// component imports
import Image from 'next/image';

// logo import
import logo from '@/Assets/images/logoLight.png';

export default function Index() {
  return (
    <div id="index">
      <header id="titleCard">
        <div className="namePlate">
          <div className="namePlate-image">
            <Image
              src={logo}
              alt="The light colour pallette of Morgan Daley's Logo"
              id="logo"
            />
          </div>
          <div className="namePlate-text">
            <h1>Morgan Daley</h1>
            <p>Full Stack Engineer </p>
            <p>
              <small>Morgan Daley &copy; 2021 </small>
            </p>
          </div>
        </div>
        <p>
          Please note, this portfolio is currently under construction. I&apos;m
          currently upgrading from React.js to Next.js, as well as transitioning
          to PostgreSQL, and many other cool tech upgrades! I appreciate your
          patience, and feel free to check out the codebase in{' '}
          <a href="https://github.com/madaley1/portfolio-react-v2">
            the GitHub!
          </a>
        </p>
      </header>
    </div>
  );
}
