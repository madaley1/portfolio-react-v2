// Node imports
import axios from 'axios';

// React Imports
import React, { Component, createRef } from 'react';

// component imports
import Slideshow from '@/components/Slideshow';
import AddProjectCard from '@/components/projects/AddProjectCard';
import EditProjectCard from '@/components/projects/EditProjectCard';
import Loading from '@/components/Loading';

// custom function imports
import loggedInCheck from '@/lib/loggedInCheck';

export default class Projects extends Component {
  state = {
    content: {} as Record<string, any>,
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

  componentDidMount() {
    if (loggedInCheck()) {
      this.loggedIn = true;
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
              <div key={project.id}>
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
              <div key={project.id}>
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
        <AddProjectCard loggedIn={this.loggedIn} />
        <h1>Active Projects</h1>
        {this.state.content.projectsArray &&
          this.state.content.projectsArray.map(
            (project: Record<string, any>, index: number) => {
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
            }
          )}
        <h1>Finished Projects</h1>
        {this.state.content.projectsArray &&
          this.state.content.projectsArray.map(
            (project: Record<string, any>, index: number) => {
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
            }
          )}
      </div>
    );
  }
}
