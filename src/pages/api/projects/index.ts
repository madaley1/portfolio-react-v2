// vercel database client
import { createClient } from '@vercel/postgres';
import { insert } from 'formik';

export default async function handler(req: any, res: any) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();
  try {
    if (req.method === 'GET') {
      Promise.all([
        client.query('SELECT * FROM projects'),
        client.query('SELECT * FROM project_slides'),
      ])
        .then(([projects, projectSlides]) => {
          res.status(200).json({
            projects: projects.rows,
            projectSlides: projectSlides.rows,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (req.method === 'POST') {
      const { title, text, status, slides } = JSON.parse(
        decodeURIComponent(req.body)
      );
      const decodedText = decodeURI(text);
      const processedText = decodedText.replaceAll("'", "''");
      const query = `INSERT INTO projects (name, description, status) VALUES('${title}', '${processedText}', '${status}')`;
      await client.query(query);
      const { rows } = await client.query('SELECT MAX(id) FROM projects');

      const projectId = rows[0].max;
      console.log(projectId);
      if (slides.length > 0) {
        slides.forEach(async (slide: Record<string, string>, index: number) => {
          const { path, description } = slide;
          const query = `INSERT INTO project_slides (slideshow_id, slide_number, slide_path, slide_description) VALUES(${projectId}, ${index}, '${path}', '${description}')`;
          await client.query(query);
        });
        res.status(200).json(rows);
      }
    } else if (req.method === 'PUT') {
      const { active, inactive } = JSON.parse(decodeURIComponent(req.body));
      if (!active && !inactive) {
        res.status(500).json({ error: 'no projects' });
      }
      if (!(active.updated || inactive.updated)) {
        res.status(500).json({ error: 'no updated projects found' });
      }
      const current = await Promise.all([
        await client.query('SELECT * FROM projects'),
        await client.query('SELECT * FROM project_slides'),
      ])
        .then(([projects, projectSlides]) => {
          return {
            projects: projects.rows,
            projectSlides: projectSlides.rows,
          };
        })
        .catch((err) => {
          console.log(err);
        });
      // console.log(current);
      if (
        !current ||
        !current.projects ||
        !current.projectSlides ||
        !current.projects.length
      ) {
        res.status(500).json({ error: 'no projects in Database' });
      }
      if (active.length < 0 || inactive.length < 0)
        res.status(500).json({ error: 'no projects' });
      if (active.updated) {
        delete active.updated;
        // project table vars
        //#region
        let tempTableQuery =
          'CREATE TEMPORARY TABLE reorder AS SELECT id, name, description, status FROM projects WHERE ';
        const alterTableQuery = 'ALTER TABLE reorder ADD COLUMN new_id INT;';
        const updateTableQueries: string[] = [];
        const insertTableQueries: string[] = [];
        const activeProjectEntries: Record<string, any>[] = [];
        //#endregion

        // project slides table vars
        let tempSlideTableQuery =
          'CREATE TEMPORARY TABLE slide_reorder AS SELECT slideshow_id, slide_number, slide_path, slide_description FROM project_slides WHERE ';
        const activeSlideEntries: Record<string, any>[] = [];
        const updateSlideQueries: string[] = [];
        const alterSlideTableQuery =
          'ALTER TABLE slide_reorder ADD COLUMN new_id INT;';
        const insertSlideQueries: string[] = [];

        // active project table work
        //#region]
        if (!current) return;
        const { projects } = current;

        Object.entries(projects as Record<any, any>).forEach(([key, value]) => {
          if (value.status === 'active') {
            activeProjectEntries.push(value);
          }
        });
        activeProjectEntries.sort((a, b) => {
          return a.id - b.id;
        });

        Object.entries(active).forEach(async ([key, value], index) => {
          if (!activeProjectEntries[value as number])
            res.status(500).json({ error: 'no projects' });
          if (Object.entries(active).length !== index + 1) {
            tempTableQuery += `id = ${key} OR `;
          } else {
            tempTableQuery += `id = ${key};`;
          }
          updateTableQueries.push(
            `UPDATE reorder SET new_id = ${key} WHERE id = ${
              activeProjectEntries[
                value as keyof typeof activeProjectEntries
              ] as Record<string, any>
            };`
          );
          updateSlideQueries.push(
            `UPDATE slide_reorder SET new_id = ${key} WHERE slideshow_id = ${
              (
                activeProjectEntries[
                  value as keyof typeof activeProjectEntries
                ] as Record<string, any>
              ).id
            };`
          );
          insertTableQueries.push(
            `INSERT INTO projects (id, name, description, status) SELECT new_id, name, description, status FROM reorder WHERE new_id = ${key};`
          );
        });
        await client.query(tempTableQuery);
        await client.query(alterTableQuery);
        Object.entries(active).forEach(async ([key, value], index) => {
          await client.query(`DELETE FROM projects WHERE id = ${key}`);
        });
        updateTableQueries.forEach(async (query, index) => {
          await client.query(query);
        });

        insertTableQueries.forEach(async (query, index) => {
          await client.query(query);
        });
        //#endregion

        // get active project ids
        const ids: number[] = activeProjectEntries.map((project) => {
          return project.id;
        });

        // active project slides table work
        Object.entries(current.projectSlides as Record<any, any>).forEach(
          ([key, value]) => {
            if (ids.includes(value.slideshow_id)) {
              activeSlideEntries.push(value);
            }
          }
        );

        ids.forEach((id, index) => {
          console.log(ids.length, index + 1);
          if (ids.length !== index + 1) {
            tempSlideTableQuery += `slideshow_id = ${id} OR `;
          } else {
            tempSlideTableQuery += `slideshow_id = ${id};`;
          }
          insertSlideQueries.push(
            `INSERT INTO project_slides (slideshow_id, slide_number, slide_path, slide_description) SELECT new_id, slide_number, slide_path, slide_description FROM slide_reorder WHERE new_id = ${id};`
          );
        });
        console.log(tempSlideTableQuery);
        await client.query(tempSlideTableQuery);
        ids.forEach(async (id, index) => {
          console.log(`DELETE FROM project_slides WHERE id = ${id};`);
          await client.query(
            `DELETE FROM project_slides WHERE slideshow_id = ${id}`
          );
        });
        console.log(alterSlideTableQuery);
        await client.query(alterSlideTableQuery);

        updateSlideQueries.forEach(async (query, index) => {
          console.log(updateSlideQueries[index]);
          await client.query(query);
        });

        insertSlideQueries.forEach(async (query, index) => {
          console.log(insertSlideQueries[index]);
          await client.query(query);
        });
        res.status(200).json({ message: 'updated' });
      }
      if (inactive.updated) {
        console.log(inactive);
        delete inactive.updated;
      }
    } else if (req.method === 'PATCH') {
      const { id, title, text, status, slides } = JSON.parse(
        decodeURIComponent(req.body)
      );
      const decodedText = decodeURI(text);
      const processedText = encodeURI(decodedText.replaceAll("'", "''"));

      if (!id) {
        res.status(500).json({ error: 'id is required' });
      }
      if (title) {
        const query = `UPDATE projects SET name = '${title}' WHERE id = ${id}`;
        await client.query(query);
      }
      if (processedText) {
        const query = `UPDATE projects SET description = '${processedText}' WHERE id = ${id}`;
        await client.query(query);
      }
      if (status) {
        const query = `UPDATE projects SET status = '${status}' WHERE id = ${id}`;
        await client.query(query);
      }
      if (slides) {
        await client.query(
          `DELETE FROM project_slides WHERE slideshow_id = ${id}`
        );
        const slidesArray = Object.entries(slides);
        slidesArray.forEach(
          async (slide: Record<string, any>, index: number) => {
            const { path, description } = slide[1];
            if (!path) res.status(500).json({ error: 'path is required' });
            const query = `INSERT INTO project_slides (slideshow_id, slide_number, slide_path, slide_description) VALUES(${id}, ${index}, '${path}', '${description}')`;
            await client.query(query);
          }
        );
      }
      res.status(200).json({ message: 'updated' });
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      console.log(id);
      const projectDelete = `DELETE FROM projects WHERE id = ${id}`;
      const projectSlidesDelete = `DELETE FROM project_slides WHERE slideshow_id = ${id}`;
      await client.query(projectDelete);
      await client.query(projectSlidesDelete);
      res.status(200).json({ message: 'deleted' });
    }
  } catch (e) {
    if (!(e instanceof Error)) return;
    res.status(500).json({ error: e });
  }
}
