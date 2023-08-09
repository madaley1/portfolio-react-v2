export type projectData = {
  id: number;
  title: string;
  text: string;
  status: 'active' | 'inactive';
  slides: [
    {
      path: string;
      description: string;
    }
  ];
};
