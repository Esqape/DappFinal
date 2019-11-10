import React from 'react';
import { Container, Button } from 'semantic-ui-react';
import "../style.css";
import { Link } from '../routes';
import BaseLayout from './BaseLayout'

//Head Component from next
import Head from 'next/head';
// My own NavBar component
import NavBar from './NavBar';

// Popunder model for mobile viewers
import MobilePopUnder from './MobilePopUnder';
import head from 'next/dist/lib/head';


// TODO put image in a grid so its somewhat responsive
export default props => {
  return (
    <div>
    <BaseLayout>
      <NavBar />
      <div>
         <Container>
          <div>
          </div>
          </Container>
      </div>

      <Container>
        {props.children}
      </Container>

      <MobilePopUnder/>
    </BaseLayout>
    </div>
  );
};
