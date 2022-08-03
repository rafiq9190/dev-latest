import React, { useState } from 'react';
import Header from './Header';
import { Helmet } from 'react-helmet';

const Layout = ({ location, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          />
        </Helmet>
        <Header location={location} />
        <div className="mainWrapper">
          <div className="">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
