// vercel database client
import { createClient } from '@vercel/postgres';

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
    res.status(500).json({ error: e.message });
  }
}
