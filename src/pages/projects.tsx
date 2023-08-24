// Node imports
import axios from 'axios';

// React Imports
import React, { Component } from 'react';

import Head from 'next/head';

// component imports
import Slideshow from '@/components/Slideshow';
import GlobalProjectEditCard from '@/components/projects/GlobalProjectEditCard';
import AddProjectCard from '@/components/projects/AddProjectCard';
import EditProjectCard from '@/components/projects/EditProjectCard';
import Loading from '@/components/Loading';

// custom function imports
import loggedInCheck from '@/lib/loggedInCheck';

import type { projectData } from '@/types/projects/projectData';

import styles from '@/Styles/sass/pages/projects.module.scss';

export default class Projects extends Component {
  state = {
    content: {} as Record<string, unknown>,
    projectData: [] as projectData[],
  };

  loggedIn: boolean;
  constructor(props: Record<string, unknown>) {
    super(props);
    this.loggedIn = false;
    try {
      this.getProjects().then((data) => {
        if (!data) return;
        this.setState({ content: data });
      });
    } catch (err) {
      return;
    }
  }

  filterSlidesToShows(
    slides: Record<string, unknown>[],
    projectsArray: Record<string, unknown>[]
  ) {
    const slideShows: Record<number, unknown> = {};
    projectsArray.forEach((project: Record<string, unknown>) => {
      const { id } = project;
      if (typeof id !== 'number') return;
      slideShows[id] = {};
    });
    Object.entries(slides).forEach((slide) => {
      const { slideshow_id, slide_number, slide_path, slide_description } =
        slide[1];
      if (typeof slideshow_id !== 'number' || typeof slide_number !== 'number')
        return;
      if (!slideShows[slideshow_id]) return;
      (slideShows[slideshow_id] as Record<number, unknown>)[slide_number] = {
        path: slide_path,
        description: slide_description,
      };
    });
    return slideShows;
  }

  getProjects(): Promise<unknown | undefined> {
    return axios
      .get('/api/projects')
      .then((response) => {
        const { projects, projectSlides } = response.data;
        const projectsArray: Record<string, string | number>[] = [];
        projects.map((project: Record<string, unknown>) => {
          if (project.id)
            projectsArray.push(project as Record<string, string | number>);
        });
        projectsArray.sort((a, b) => parseInt(`${b.id}`) - parseInt(`${a.id}`));
        const slideshows: Record<number, unknown> = this.filterSlidesToShows(
          projectSlides,
          projectsArray
        );
        return { projectsArray, slideshows };
      })
      .catch((err) => {
        return err.response;
      });
  }

  processToProjectData(data: Record<string, unknown>) {
    if (!data.projectsArray) return;
    const projects = data.projectsArray;
    if (
      !projects ||
      !Array.isArray(projects) ||
      Object.entries(projects).length < 0
    )
      return;
    const projectData = projects.map(
      (project: Record<string, string | number>) => {
        if (
          !project.id ||
          !project.name ||
          typeof project.name !== 'string' ||
          !project.description ||
          typeof project.description !== 'string' ||
          !project.status ||
          typeof project.status !== 'string'
        ) {
          return;
        }
        const { id, name, description, status } = project;
        const currentProjectData = {
          id,
          title: name,
          text: decodeURI(description),
          status,
          slides: [],
        };
        if (
          !data.slideshows ||
          Object.entries(data.slideshows).length < 0 ||
          !data.slideshows[id as keyof typeof data.slideshows]
        )
          return currentProjectData;
        const { slideshows } = data;
        currentProjectData.slides =
          slideshows[id as keyof typeof data.slideshows];
        return currentProjectData;
      }
    );
    return projectData;
  }

  componentDidMount() {
    if (loggedInCheck()) {
      this.loggedIn = true;
    }
  }

  componentDidUpdate(): void {
    if (this.loggedIn) {
      const { projectsArray } = this.state.content;
      const { projectData } = this.state;
      if (Array.isArray(projectsArray))
        if (projectData.length !== projectsArray.length) {
          const { content } = this.state;
          const processedData = this.processToProjectData(content);
          if (!processedData || !Array.isArray(processedData)) {
            this.setState({ projectData: {} });
            return;
          }
          processedData.sort((a, b) => {
            if (!a || !b) {
              return 0;
            } else {
              return parseInt(`${b.id}`) - parseInt(`${a.id}`);
            }
          });
          this.setState({ projectData: processedData });
        }
    }
  }

  render() {
    const { projectsArray } = this.state.content;

    const processor = (status: string) => {
      return projectsArray && Array.isArray(projectsArray)
        ? projectsArray.map((project: Record<string, unknown>) => {
            if (project.status !== status) return;
            const { slideshows } = this.state.content;
            const { id } = project;
            const idKey = parseInt(`${id}`);
            const slides =
              slideshows && slideshows[idKey as keyof typeof slideshows]
                ? slideshows[idKey as keyof typeof slideshows]
                : {};
            const object = {
              project,
              slides,
            };
            const { name, description } = project;
            if (typeof name !== 'string' || typeof description !== 'string')
              return;
            return (
              <div key={idKey}>
                <div
                  className={`${styles.project} ${styles['project-inactive']}`}
                >
                  <h2>{name}</h2>
                  <p>{decodeURI(description)}</p>
                  <Slideshow slides={slides} />
                </div>
                <EditProjectCard
                  index={idKey}
                  loggedIn={this.loggedIn}
                  textObject={object}
                  key={idKey}
                />
              </div>
            );
          })
        : [<Loading key={Math.random()} />];
    };

    const finished = processor('inactive');

    const active = processor('active');

    return (
      <div>
        <Head>
          <title>Projects | Daley Development</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <GlobalProjectEditCard
          loggedIn={this.loggedIn}
          projectData={this.state.projectData}
          key={this.state.projectData.length}
        />
        <AddProjectCard loggedIn={this.loggedIn} />
        <h1>Active Projects</h1>
        {active}
        <h1>Finished Projects</h1>
        {finished}
      </div>
    );
  }
}
