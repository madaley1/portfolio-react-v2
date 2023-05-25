// imports
import { useEffect, useState } from 'react';

import Link from 'next/link';

// exports
export default function NavMenu() {
  const { menu }: Record<string, any> | undefined = process.env;
  const [menuReturned, setMenuReturned] = useState(false);
  const [navInfo, setNavInfo] = useState([
    {
      name: 'Home',
      link: ''
    }
  ]);

  useEffect(() => {
    if (menuReturned) return;
    if (menu && menu.length > 0) {
      if (navInfo === menu) return;
      setNavInfo(menu);
      setMenuReturned(true);
      console.log(navInfo);
    } else {
      setNavInfo([
        {
          name: 'Home',
          link: '/'
        }
      ]);
    }
  }, [menu, navInfo]);

  return (
    <nav>
      <ul>
        {navInfo.map((item: Record<string, string>) => (
          <Link key={item.link} href={item.link}>
            {item.name}
          </Link>
        ))}
      </ul>
    </nav>
  );
}
