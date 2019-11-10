import React, { Component } from 'react';
import Layout from '../components/CertificateaddLayout'
import CertificateForm from '../components/CertificateForm'
import fb from '../firebase';
import Forbidden from '../components/Forbidden';

class CertificatesNew extends Component {

	state = {
		loading: true,
		user1: '',
	  }
	
	  componentDidMount() {
		  fb.auth().onAuthStateChanged(user => {
	
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
	
	
		  this.setState({loading:false});
	  }
	
	
	  render() {
		if(this.state.loading) {
			return 'Loading...'
		} 
	
		else if(this.state.user1=='admin@certdapp.com'){
			return (
				<Layout>
			  <CertificateForm />
			</Layout>
		  )
	
		}
	
		else {
			return (
			  <Forbidden>
			  </Forbidden>
			);
		  }
	  }
}

export default CertificatesNew;