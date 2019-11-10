import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import {
    FirebaseAuthProvider,
    IfFirebaseAuthed,
    IfFirebaseUnAuthed
  } from "@react-firebase/auth";
import firebase from 'firebase'
import { config } from "../test-credentials";
import Cookie from "js-cookie";


class Login extends Component {

    state = {
        useremail: '',
        userpassword: '',
        loading: false,
        errorMessage: '',
        successMessage: '',
      }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '', successMessage: '' });
        firebase.auth().signInWithEmailAndPassword(this.state.useremail, this.state.userpassword).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          this.setState({errorMessage: error.message});
          // ...
        });
          this.setState({ loading: false });

          Cookie.set("ClientEmail",this.state.useremail);
    }

    render() {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h2' color='teal' textAlign='center'>
                 Log-in to your account
              </Header>
              <Form size='large' onSubmit={ this.handleSubmit } error={!!this.state.errorMessage} success={!!this.state.successMessage}>
                <Segment stacked>
                  <Form.Input
                   fluid icon='user'
                   iconPosition='left'
                   placeholder='E-mail address' 
                   onChange = {(e, { value }) => this.setState({useremail: value})}
                  />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    onChange = {(e, { value }) => this.setState({userpassword: value})}
                  />

                <Message error header='Error!' content={ this.state.errorMessage } />
                <Message success header='Success!' content={ this.state.successMessage } />
        
                  <Button color='teal' fluid size='large'>
                    Login
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        );
      }
};

export default Login;