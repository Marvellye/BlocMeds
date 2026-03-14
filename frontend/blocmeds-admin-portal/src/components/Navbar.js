import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills, faUpload, faChartLine, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <FontAwesomeIcon icon={faPills} />
        <span>BlocMeds</span>
      </div>
      <div className="nav-links">
        <a href="#" className="nav-link active">
          <FontAwesomeIcon icon={faUpload} />
          Upload
        </a>
        <a href="#" className="nav-link">
          <FontAwesomeIcon icon={faChartLine} />
          Analytics
        </a>
        <a href="#" className="nav-link">
          <FontAwesomeIcon icon={faUserCircle} />
          Profile
        </a>
      </div>
    </nav>
  );
};

export default Navbar;