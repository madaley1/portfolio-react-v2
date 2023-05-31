// imports
import { useEffect, useState } from 'react';

import Link from 'next/link';

// types
type navItem = {
  name: string;
  link: string;
};

// Parse and convert the string value of the environment variable
function parseNavItems(value: unknown) {
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

// exports
export default function NavMenu() {
  const { menu } = process.env;
  const menuData: navItem[] = parseNavItems(menu);
  const [menuReturned, setMenuReturned] = useState(false);
  const [navInfo, setNavInfo] = useState([
    {
      name: 'Home',
      link: ''
    }
  ]);

  useEffect(() => {
    if (menuReturned) return;
    if (menuData && menuData.length > 0) {
      if (navInfo === menuData) return;
      setNavInfo(menuData);
      setMenuReturned(true);
      console.log(menuData);
    } else {
      setNavInfo([
        {
          name: 'Home',
          link: '/'
        }
      ]);
    }
  }, [menu, navInfo, menuReturned]);

  return (
    <nav className="navMenu">
      <ul className="navMenu-list">
        {navInfo.map((item: navItem) => (
          <Link className="navMenu-list-item" key={item.link} href={item.link}>
            {item.name}
          </Link>
        ))}
      </ul>
    </nav>
  );
}
