import React, { Component} from 'react';
import { Container, Form, Button, Icon, Input, Message, FormGroup } from 'semantic-ui-react';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import "../style.css";
import BaseLayout from '../components/BaseLayout';
import firebase from '../firebase';
import Forbidden from '../components/Forbidden';
import Secondary from '../secondary';


const Facultyoptions = [
  { key: 'it', text: 'Computing', value: 'Computing' },
  { key: 'en', text: 'Engineering', value: 'Engineering' },
  { key: 'bus', text: 'Business', value: 'Business' },
]
const Yearoptions = [
  { key: 'one', text: '1', value: '1' },
  { key: 'two', text: '2', value: '2' },
  { key: 'three', text: '3', value: '3' },
  { key: 'four', text: '4', value: '4' },
]
const Sememsteroptions = [
  { key: 'one', text: '1', value: '1' },
  { key: 'two', text: '2', value: '2' },
]


class createUser extends Component {

    state = {
        loading: false,
        errorMessage: '',
        successMessage: '',
        password: '',
        db: '',
        fullName: '',
        DOB: '',
        IDNo: '',
        uemail: '',
        contactNo: '',
        faculty: '',
        year: '',
        semester: '',
        password: '',
        students: [],
        loadingDB: true,
		    user1: '',
      };

  componentDidMount(){
    const fbApp= firebase;
    const  db = fbApp.firestore();
    this.setState({db: db});
    fbApp.auth().onAuthStateChanged(user => {
	
			var theUser;
	  
			if (user) {
			  console.log("user is logged in!");
	  
			  theUser = user;
	  
			  this.setState({user1: user.email});
			  // User is signed in.
			} else {
			  // No user is signed in.
			  console.log("user is not logged in!")
			  this.setState({user1: null});
			}
		});
      
    this.setState({loadingDB:false});
    }

    createUser = async(event) =>{
      this.setState({successMessage: ''});
      this.setState({loading: true});
      Secondary.auth().createUserWithEmailAndPassword(this.state.uemail, this.state.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
      Secondary.auth().signOut();
      let data = {
        Full_Name: this.state.fullName,
        DOB: this.state.DOB,
        ID: this.state.IDNo,
        Email: this.state.uemail,
        Contact_No: this.state.contactNo,
        Faculty: this.state.faculty,
        Year: this.state.year,
        Semester: this.state.semester,
        AccountExists: true
      };
      this.state.db.collection("students").doc(this.state.IDNo).set(data);
      this.setState({successMessage: 'User account created.'});
      this.setState({loading: false});
    }

    
  render() {
		if(this.state.loadingDB) {
			return 'Loading...'
		} 
	
		else if(this.state.user1=='admin@certdapp.com'){
			return (
        <BaseLayout>
    <NavBar />
  <Container>
    <Head>
      <link rel="stylesheet" href="/_next/static/style.css" />
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
      <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Pinyon+Script" rel="stylesheet" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div><br/><h2>Create User </h2><br/></div>
  </Container>
  <Container>
  
      
      <Container>
      <Form onSubmit={ this.createUser } error={!!this.state.errorMessage} success={!!this.state.successMessage} >
            <Form.Group widths='equal'>
              <Form.Input fluid
                  label = "Full Name"
                  value = { this.state.fullName }
                  placeholder="Full name of the user"
                  value = { this.state.fullName }
                  onChange = {(e, { value }) => this.setState({fullName: value})}
                />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input fluid
                    label = "D.O.B"
                    value = { this.state.DOB }
                    placeholder="1 Jan 2019"
                    value = { this.state.DOB }
                    onChange = {(e, { value }) => this.setState({DOB: value})}
                  />
                <Form.Input fluid
                  label = "ID No"
                  value = { this.state.IDNo }
                  placeholder="Identification Number"
                  value = { this.state.IDNo }
                  onChange = {(e, { value }) => this.setState({IDNo: value})}
                />
                </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input fluid
                    label = "Email"
                    value = { this.state.uemail }
                    placeholder="Email of the User"
                    value = { this.state.uemail }
                    onChange = {(e, { value }) => this.setState({uemail: value})}
                  />
                  <Form.Input fluid
                  label = "Contact No"
                  value = { this.state.contactNo }
                  placeholder="Contact Number of the User"
                  value = { this.state.contactNo }
                  onChange = {(e, { value }) => this.setState({contactNo: value})}
                />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Select fluid
                    label = "Faculty"
                    options = {Facultyoptions}
                    placeholder="Faculty of the user"
                    value = { this.state.faculty }
                    onChange = {(e, { value }) => this.setState({faculty: value})}
                  />
                  <Form.Select fluid
                    label = "Year"
                    options = {Yearoptions}
                    placeholder="Current year"
                    value = { this.state.year }
                    onChange = {(e, { value }) => this.setState({year: value})}
                  />
                  <Form.Select fluid
                    label = "Semester"
                    options = {Sememsteroptions}
                    placeholder="Current semester"
                    value = { this.state.semester }
                    onChange = {(e, { value }) => this.setState({semester: value})}
                  />
              </Form.Group>
              <Form.Input fluid
                        label = "Password"
                        value = { this.state.password }
                        placeholder="Password for this user"
                        value = { this.state.password }
                        onChange = {(e, { value }) => this.setState({password: value})}
                    />
                <Message error header='Error!' content={ this.state.errorMessage } />
                <Message success header='Success!' content={ this.state.successMessage } />

                <Button loading={ this.state.loading } id='' icon labelPosition='left' centered>
                <Icon name='add user' />Submit
                </Button>
                </Form>
          </Container>
        </Container>
        </BaseLayout>
      );
	
		}
	
		else{
      return (
        <Forbidden>
        </Forbidden>
      );
    }
	  }
}

export default createUser;