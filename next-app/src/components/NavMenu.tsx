// imports
import React, { useEffect, useState, createRef, Component } from 'react';

// next imports
import Image from 'next/image';
import Link from 'next/link';

//image imports
import logo from '@/Assets/images/logoLight.png';

// types
type navItem = {
  name: string;
  link: string;
};

export default class NavMenu extends Component {
  navMenuRef: React.RefObject<HTMLElement>;
  classes: string[] = ['navMenu'];
  state = {
    classes: ['navMenu'],
    navInfo: [
      {
        name: 'Home',
        link: '/',
      },
    ],
    menuReturned: false,
  };
  constructor(props: any) {
    super(props);
    this.navMenuRef = createRef();
  }

  parseNavItems(value: unknown) {
    if (!value) {
      return []; // or handle the absence of value accordingly
    }

    try {
      if (Array.isArray(value)) {
        // Perform type checks for each item in the parsed array
        const validItems = value.filter(
          (item: unknown): item is navItem =>
            typeof item === 'object' &&
            item !== null &&
            'name' in item &&
            typeof item.name === 'string' &&
            'link' in item &&
            typeof item.link === 'string'
        );

        return validItems;
      }
    } catch (error) {
      console.error('Error parsing navItems from environment variable:', error);
    }

    return []; // or handle parsing failure accordingly
  }

  setFlickerSettings = (duration = 5) => {
    if (typeof window !== undefined) {
      switch (window.location.pathname) {
        case '/' || '':
        default:
          this.setState({
            classes: [...new Set([...this.state.classes, 'green'])],
          });
          break;
        case '/about' || '/about/':
          this.setState({
            classes: [...new Set([...this.state.classes, 'yellow'])],
          });
          break;
        case '/projects' || '/projects/':
          this.setState({
            classes: [...new Set([...this.state.classes, 'purple'])],
          });
          break;
        case '/contact' || '/contact/':
          this.setState({
            classes: [...new Set([this.state.classes, 'blue'])],
          });
          break;
      }
    } else {
      this.setState({ classes: [...this.state.classes, 'green'] });
    }

    // find diff
    const difference = 30 - 5;

    // generate random number
    let rand = Math.random();

    // multiply with difference
    rand = Math.floor(rand * difference);

    // add with min value
    const animationDuration = rand + 5;
    if (!this.navMenuRef.current) return;
    this.navMenuRef.current.style.setProperty(
      '--random-number',
      animationDuration + 's'
    );
    setTimeout(() => {
      if (duration === 5) this.setFlickerSettings();
      else {
        this.setFlickerSettings(animationDuration - 1);
      }
      return animationDuration;
    }, animationDuration * 1000);
  };
  componentDidMount(): void {
    const { menu } = process.env;

    const menuData: navItem[] = this.parseNavItems(menu);
    if (!this.state.menuReturned) {
      if (menuData && menuData.length > 0) {
        if (this.state.navInfo === menuData) return;
        this.setState({ navInfo: menuData });
        this.setState({ menuReturned: true });
      } else {
        this.setState({
          navInfo: [
            {
              name: 'Home',
              link: '/',
            },
          ],
        });
      }
    }

    this.setFlickerSettings();
  }

  render() {
    const classList = this.state.classes.join(' ');
    return (
      <nav className={classList} ref={this.navMenuRef}>
        <Link href="/">
          <Image src={logo} alt="Portfolio logo" width="150" />
        </Link>
        <ul className="navMenu-list">
          <li>
            <Link className="navMenu-list-item" href="/">
              Home
            </Link>
          </li>
          {this.state.navInfo.map((item: navItem) => (
            <li key={item.name}>
              <Link className="navMenu-list-item" href={item.link}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
