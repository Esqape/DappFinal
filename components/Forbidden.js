import React, { Component } from 'react';
import { Container } from "semantic-ui-react";
import Head from 'next/head';


export default class Forbidden extends React.Component {

  render () {
    return (
    <Container>
        <Head>
          <link rel="stylesheet" href="/_next/static/style.css" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
          <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Pinyon+Script" rel="stylesheet" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="error-body">
        <div className="error-main">
            <h1>Oops!</h1>
            <div class="error-heading">403</div>
            <p>You do not have permission to access the page that you requested.</p>
        </div>
    </div>
    </Container>
    )
  }
}