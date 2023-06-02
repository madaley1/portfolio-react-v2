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
      </header>
    </div>
  );
}
