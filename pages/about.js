import React, { Component} from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import NavBar2 from '../components/NavBar2';
import NavBar3 from '../components/NavBar3';
import "../style.css";
import BaseLayout from '../components/BaseLayout';
import fb from '../firebase';


class About extends Component {

  state = {
    loading: true,
    user1: '',
  }

  componentDidMount() {
      fb.auth().onAuthStateChanged(user => {

        var theUser;
  
        if (user) {
          theUser = user;
  
          this.setState({user1: user.email});
          // User is signed in.
        } else {
          // No user is signed in.
          this.setState({user1: null});
        }
    });


      this.setState({loading:false});
  }


  render() {
    if(this.state.loading) {
        return 'Loading...'
    } 

    else if((this.state.user1=='dean@certdapp.com')||(this.state.user1=='vice@certdapp.com')||(this.state.user1=='academic@certdapp.com')){
      return (
        <BaseLayout>
          <NavBar3/>
            <Container id="About-Container">
              <Head>
                <link rel="stylesheet" href="/_next/static/style.css" />
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
                <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Pinyon+Script" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Head>
              <div>About Page</div>
            </Container>
        </BaseLayout>
      );

    }

    else if(this.state.user1=='admin@certdapp.com'){
      return (
        <BaseLayout>
          <NavBar />
            <Container id="About-Container">
              <Head>
                <link rel="stylesheet" href="/_next/static/style.css" />
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
                <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Pinyon+Script" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Head>
              <div>About Page</div>
            </Container>
        </BaseLayout>
      );
      }

      else {
        return (
          <BaseLayout>
            <NavBar2 />
              <Container id="About-Container">
                <Head>
                  <link rel="stylesheet" href="/_next/static/style.css" />
                  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
                  <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Pinyon+Script" rel="stylesheet" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <div>About Page</div>
              </Container>
          </BaseLayout>
        );
      }


  }
}

export default About;
