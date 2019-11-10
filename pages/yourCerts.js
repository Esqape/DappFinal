import React, { Component } from 'react';
import { Link } from '../routes'
import CertificateFactory from '../ethereum/contracts/CertificateFactory';
import CertificateContract from '../ethereum/contracts/Certificate';
import { Card, Button, Container,Form, Icon, Input, Message, AccordionAccordion, } from 'semantic-ui-react';
import { epochToDate } from '../helper';
import _ from 'lodash';
import * as firebase from "firebase/app";
import NavBar2 from '../components/NavBar2';
import BaseLayout from '../components/BaseLayout';
import fb from '../firebase';
import { Router } from '../routes';



class YourCerts extends Component {

  state = {
   useremail: '',
   userpassword: '',
   db: '',
   IDNo: '',
   userCerts: [],
   UCarray: [],
   Svar: '',
   loading: false,
   errorMessage: '',
   successMessage: '',
   loadingDB: true,
	  user1: '',
  }

  static async getInitialProps() {

    let IDNo= '';
    let data=[];
    let killed =[];
    const fbApp= fb;
    const  db = fbApp.firestore();
    await db.collection("killed")
    .get()
    .then(querySnapshot => {
      data = querySnapshot.docs.map(doc => doc.data());
      
    });

    for(var i=0;i<data.length;i++){
      killed[i]=data[i].address;
      }

    const deployedCertificates = await CertificateFactory.methods.getIssuedCertificates().call();
    // Omits blacklisted contract addresses from list, to not be shown
    const displayCertificates = _.difference(deployedCertificates, killed);

    //contracts rendered in LIFO order
    const allCertificates = displayCertificates.reverse();
    const size = allCertificates.length;

    const certificateContracts = await Promise.all(
      Array(size).fill().map((item, index) => {
        return CertificateContract(allCertificates[index]);
      })
    );

    //certificateItems1 contains general details of certificates
    const certificateItems1 = await Promise.all(
      Array(size).fill().map((item, index) => {
        return certificateContracts[index].methods.getCertificateDetails().call();
      })
    )

    //certificateItems2 contains signature details of certificates
    const certificateItems2 = await Promise.all(
      Array(size).fill().map((item, index) => {
        return certificateContracts[index].methods.getCertificateSignatureDetails().call();
      })
    )

    return { allCertificates, certificateItems1, certificateItems2};
  }

  componentDidMount(){
      

    fb.auth().onAuthStateChanged(user => {
	
			var theUser;
	  
			if (user) {
			  console.log("user is logged in!");
	  
			  theUser = user;
	  
        this.setState({user1: user.email});
        this.setState({loadingDB:false});
        let IDNo= '';
        const fbApp= fb;
        const  db = fbApp.firestore();
        this.setState({db: db});
        db.collection("certificates")
        .where('User', '==', this.state.user1)
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          this.setState({userCerts: data});
        });
			  // User is signed in.
			} else {
			  // No user is signed in.
			  console.log("user is not logged in!")
			  this.setState({user1: null});
			}
		});

  }

  handleChange (event) {
    this.setState({ useremail: event.target.value })
  }

  handleChange2 (event) {
    this.setState({ userpassword: event.target.value })
  }

 
  enableSharing = async(event) =>{
    let addre1= event.currentTarget.value;

    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    
      try {
       let ref = this.state.db.collection("certificates").doc(addre1);
       let updateSingle = ref.update({Sharing: true});

        this.setState({ successMessage: `Success` });
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    this.setState({ loading: false });
   Router.replaceRoute(`/`);
  }

  disableSharing = async(event) =>{
    let addre1= event.currentTarget.value;

    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    
      try {
       let ref = this.state.db.collection("certificates").doc(addre1);
       let updateSingle = ref.update({Sharing: false});

        this.setState({ successMessage: `Success` });
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    this.setState({ loading: false });
   Router.replaceRoute(`/`);
  }

  renderItems() {
    let certData = this.state.userCerts;
    let len = this.state.userCerts.length;
    let UCA = [];
    let sharingVar= [];


    for(var i=0;i<len;i++){
        UCA[i]=certData[i].address;
        sharingVar[i]=certData[i].Sharing;
    }


    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey'];

    const items = this.props.certificateItems1.map((certificate, index) => {
      var user = firebase.auth().currentUser;
      let Sflag='';
      if(UCA.includes(this.props.allCertificates[index])){
          var addr= this.props.allCertificates[index];
          

          for(var i=0;i<len;i++){
            if(certData[i].address==addr){
                Sflag = certData[i].Sharing;
                
            }
            }


      if(Sflag){

      return {
        key: this.props.allCertificates[index],
        color: colors[index % colors.length],
        header: `${certificate[3]} Certificate issued to ${certificate[0]}`,
        meta: `Issued on ${epochToDate(certificate[5])}`,
        description: (
        <div>
            <div>
            <Link route={`/certificates/${this.props.allCertificates[index]}`}>
                <a className='vows-link'>{ `Certificate link`}</a>
            </Link>
            
            </div>
            <div className='Share'>
                <br />
                <Button loading={ this.state.loading } value={addr} id='certunshareBtn' icon labelPosition='left'  onClick={this.disableSharing}>
                <Icon name='lock' />Disable Sharing
                </Button>
            </div>
        </div>
          ),
        fluid: true
        }
      }
      else {
        return {
          key: this.props.allCertificates[index],
          color: colors[index % colors.length],
          header: `${certificate[3]} Certificate issued to ${certificate[0]}`,
          meta: `Issued on ${epochToDate(certificate[5])}`,
          description: (
          <div>
              <div>
              <Link route={`/certificates/${this.props.allCertificates[index]}`}>
                  <a className='vows-link'>{ `Certificate link`}</a>
              </Link>
              
              </div>
              <div className='Share'>
                  <br />
                  <Button loading={ this.state.loading } disabled={Sflag} value={addr} id='certshareBtn' icon labelPosition='left' onClick={this.enableSharing}>
                  <Icon name='unlock' />Enable Sharing
                  </Button>
              </div>
          </div>
            ),
          fluid: true
          }
      }
    }
    })


    var filtered = items.filter(function (el) {
      return el != null;
    });


    return <Card.Group items= { filtered } className='Index-Cards' itemsPerRow={1} centered={true} stackable={true} doubling={true} textAlign='center'/>
  }


  render() {
		if(this.state.loadingDB) {
			return 'Loading...'
		} 
	
		else if((this.state.user1!='admin@certdapp.com')&&(this.state.user1!='dean@certdapp.com')&&(this.state.user1!='vice@certdapp.com')&&(this.state.user1!='academic@certdapp.com')){
			return (
        <BaseLayout>
        <NavBar2 />
        <div>
        <Container textAlign='center'>
            <a name="certificates"><h2 className='Certificates-Title'>Your Certificates</h2></a>
            { this.renderItems() }
        </Container>
        
        </div>
        </BaseLayout>
      );
	
		}
	
		else{
      return (
        'Invalid user type'
      );
    }
	  }

}


export default YourCerts;
