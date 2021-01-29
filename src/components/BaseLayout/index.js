import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Sidebar from 'components/Sidebar';

const BaseLayout = ({children, withHeader = true, withSidebar = true, withFooter = true}) => {

  return (
    <div className="App" header={withHeader ? '' : 'false'}>
      {withHeader ? <Header /> : '' }
      
      <div className="main">
        {withSidebar ? <Sidebar/> : ''}
        <main className="page-manager">
          <div className="page-content">{children}</div>
          {withFooter ? <Footer/> : ''}
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;