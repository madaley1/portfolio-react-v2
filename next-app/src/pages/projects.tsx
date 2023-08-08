// Node imports
import axios from 'axios';

// React Imports
import React, { Component, createRef } from 'react';

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

export default class Projects extends Component {
  state = {
    content: {} as Record<string, any>,
    projectData: [] as projectData[],
  };

  loggedIn: boolean;
  constructor(props: any) {
    super(props);
    this.loggedIn = false;
    try {
      this.getProjects().then((data) => {
        if (!data) return;
        this.setState({ content: data });
      });
    } catch (err) {
      console.error(err);
    }
  }

  filterSlidesToShows(
    slides: Record<string, any>[],
    projectsArray: Record<string, any>[]
  ) {
    const slideShows: Record<number, any> = {};
    projectsArray.forEach(
      (project: Record<string, any>) => (slideShows[project.id] = {})
    );
    Object.entries(slides).forEach((slide) => {
      const { slideshow_id, slide_number, slide_path, slide_description } =
        slide[1];
      if (!slideShows[slideshow_id]) return;
      slideShows[slideshow_id][slide_number] = {
        path: slide_path,
        description: slide_description,
      };
    });
    return slideShows;
  }

  getProjects(): Promise<any | undefined> {
    return axios
      .get('/api/projects')
      .then((response) => {
        const { projects, projectSlides } = response.data;
        const projectsArray: Record<string, any>[] = [];
        projects.map((project: Record<string, any>) =>
          projectsArray.push(project)
        );
        projectsArray.sort((a, b) => a.id - b.id);
        const slideshows: Record<number, any> = this.filterSlidesToShows(
          projectSlides,
          projectsArray
        );
        return { projectsArray, slideshows };
      })
      .catch((err) => {
        return err.response;
      });
  }

  processToProjectData(data: any) {
    if (!data.projectsArray) return;
    const projects = data.projectsArray;
    if (!projects || Object.entries(projects).length < 0) return;
    const projectData = projects.map((project: any, index: number) => {
      if (
        !project.id ||
        !project.name ||
        !project.description ||
        !project.status
      )
        return false;
      const { id, name, description, status } = project;

      const currentProjectData = {
        id,
        title: name,
        text: decodeURI(description),
        status,
        slides: [],
      };
      if (!data.slideshows[id]) return currentProjectData;
      const { slideshows } = data;
      currentProjectData.slides = slideshows[id];
      return currentProjectData;
    });
    return projectData;
  }

  componentDidMount() {
    if (loggedInCheck()) {
      this.loggedIn = true;
    }
  }

  componentDidUpdate(): void {
    if (this.loggedIn) {
      if (
        this.state.projectData.length !==
        this.state.content.projectsArray.length
      ) {
        const { content } = this.state;
        const projectData = this.processToProjectData(content);
        projectData.sort((a: projectData, b: projectData) => a.id - b.id);
        this.setState({ projectData });
      }
    }
  }

  render() {
    const finished = this.state.content.projectsArray
      ? this.state.content.projectsArray.map((project: Record<string, any>) => {
          if (project.status !== 'inactive') return;
          const slides = this.state.content.slideshows[project.id] || null;
          const object = {
            project,
            slides,
          };
          return (
            <>
              <div className="project project-inactive" key={project.id}>
                <h2>{project.name}</h2>
                <p>{decodeURI(project.description)}</p>
                <Slideshow slides={slides} />
              </div>
              <EditProjectCard
                index={project.id}
                loggedIn={this.loggedIn}
                textObject={object}
              />
            </>
          );
        })
      : [<Loading key="0" />];
    const active = this.state.content.projectsArray
      ? this.state.content.projectsArray.map((project: Record<string, any>) => {
          if (project.status !== 'active') return;
          const slides = this.state.content.slideshows[project.id] || null;
          const object = {
            project,
            slides,
          };
          return (
            <>
              <div className="project project-active" key={project.id}>
                <h2>{project.name}</h2>
                <p>{decodeURI(project.description)}</p>
                <Slideshow slides={slides} />
              </div>
              <EditProjectCard
                index={project.id}
                loggedIn={this.loggedIn}
                textObject={object}
              />
            </>
          );
        })
      : [<Loading key="0" />];
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
