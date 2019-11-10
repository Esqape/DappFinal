import React, { Component} from 'react';
import { Container, Form, Button, Icon, Input, Message } from 'semantic-ui-react';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import "../style.css";
import BaseLayout from '../components/BaseLayout';
import firebase from '../firebase';
import Forbidden from '../components/Forbidden';
import Secondary from '../secondary';




class AddUser extends Component {

    state = {
        loading: false,
        errorMessage: '',
        errorMessage1: '',
        successMessage: '',
        successMessage1: '',
        searchIDNo: '',
        students:[],
        result:[],
        password: '',
        db: '',
        loadingDB: true,
		    user1: '',
      };

  componentDidMount(){
    const fbApp= firebase;
    const  db = fbApp.firestore();
    this.setState({db: db});
    db.collection("students")
    .get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      this.setState({ students: data });
    });

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
      Secondary.auth().createUserWithEmailAndPassword(this.state.result.Email, this.state.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
      Secondary.auth().signOut();
      this.state.db.collection("students").doc(this.state.result.ID).update({AccountExists: true});
      this.setState({successMessage: 'User account created.'})
    }

    search = async (event) => {
        this.setState({ result: ''});
        this.setState({successMessage1: ''});
        this.setState({errorMessage1: ''});
          var result1;
        for( var i = 0, len = this.state.students.length; i < len; i++ ) {
            if( this.state.students[i].ID === this.state.searchIDNo ) {
                
                
                result1 = this.state.students[i];
                if(result1.AccountExists===true){
                  this.setState({ successMessage1: 'Account already exists.'});
                  break;
                }
                else {
                this.setState({ result: result1});
                this.setState({ successMessage1: 'Student found.'});
                break;
                }
            }
        }

    this.state.db.collection("students")
    .get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      this.setState({ students: data });
    });
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
    <div><br/><h2>Add User </h2><br/></div>
  </Container>
  <Container>
  
      <Container>
            <Form onSubmit={ this.search } error={!!this.state.errorMessage1} success={!!this.state.successMessage1} >
            <Form.Group widths='equal'>
                    <Form.Input fluid
                        label = "ID Number"
                        value = { this.state.searchIDNo }
                        placeholder="Existing student ID"
                        value = { this.state.searchIDNo }
                        onChange = {(e, { value }) => this.setState({searchIDNo: value})}
                    />
                </Form.Group>
                
                <Message success header='' content={ this.state.successMessage1 } />
                

                <Button loading={ this.state.loading } id='SearchUserBtn' icon labelPosition='left' centered>
                <Icon name='search' />Search
                </Button>
                
            </Form>
            <br/>
      </Container>
      <Container>
      <Form onSubmit={ this.createUser } error={!!this.state.errorMessage} success={!!this.state.successMessage} >
            <Form.Group widths='equal'>
                <Form.Input fluid
                 label='Full name'
                  placeholder='Read only'
                   readOnly 
                   value = { this.state.result.Full_Name } />
              </Form.Group>
              <Form.Group widths='equal'>
                  <Form.Input fluid label='D.O.B' placeholder='Read only' readOnly value = { this.state.result.DOB } />
                  <Form.Input fluid label='ID No' placeholder='Read only' readOnly value = { this.state.result.ID } />
              </Form.Group>
              <Form.Group widths='equal'>
                  <Form.Input fluid label='Email' placeholder='Read only' readOnly value = { this.state.result.Email } />
                  <Form.Input fluid label='Contact No' placeholder='Read only' readOnly value = { this.state.result.Contact_No } />
              </Form.Group>
              <Form.Group widths='equal'>
                  <Form.Input fluid label='Faculty' placeholder='Read only' readOnly value = { this.state.result.Faculty } />
                  <Form.Input fluid label='Year' placeholder='Read only' readOnly value = { this.state.result.Year } />
                  <Form.Input fluid label='Semester' placeholder='Read only' readOnly value = { this.state.result.Semester } />
              </Form.Group>
              <Form.Input fluid
                        label = "Password"
                        value = { this.state.password }
                        placeholder="Password for this user"
                        value = { this.state.password }
                        onChange = {(e, { value }) => this.setState({password: value})}
                    />
                
                <Message success header='Success!' content={ this.state.successMessage } />

                <Button loading={ this.state.loading } id='' icon labelPosition='left' centered>
                <Icon name='user' />Submit
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

export default AddUser;