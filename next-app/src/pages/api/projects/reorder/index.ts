// vercel database client
import { createClient } from '@vercel/postgres';

import type { projectData } from '@/Types/projects/projectData';

import axios from 'axios';

export default async function handler(req: any, res: any) {
  const projectTypeChecker = (project: any): project is projectData => {
    return project.id !== undefined;
  };
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();
  try {
    if (req.method === 'PUT') {
      const { projects } = req.body;
      if (projects.length < 0) res.status(500).json({ error: 'no projects' });
      projects.forEach(async (project: projectData, index: number) => {
        if (!projectTypeChecker(project)) return;
        console.log(project);
      });
    }
  } catch (e) {
    if (!(e instanceof Error)) return;

    res.status(500).json({ error: e.message });
  }
}
