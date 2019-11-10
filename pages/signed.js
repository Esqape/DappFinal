import React, { Component } from 'react';
import { Link } from '../routes'
import CertificateFactory from '../ethereum/contracts/CertificateFactory';
import CertificateContract from '../ethereum/contracts/Certificate';
import { Card, Button, Container,Form, Icon, Input, Message } from 'semantic-ui-react';
import { epochToDate } from '../helper';
import _ from 'lodash';
import Login from '../components/Login';
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer
} from "@react-firebase/auth";
import * as firebase from "firebase/app";
import { config } from "../test-credentials";
import NavBar2 from '../components/NavBar2';
import NavBar3 from '../components/NavBar3';
import BaseLayout from '../components/BaseLayout'
import fb from '../firebase';



class Signed extends Component {

  state = {
   useremail: '',
   userpassword: '',
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

  handleChange (event) {
    this.setState({ useremail: event.target.value })
  }

  handleChange2 (event) {
    this.setState({ userpassword: event.target.value })
  }

  renderDeanItems() {
    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey'];

    const items = this.props.certificateItems1.map((certificate, index) => {
      var user = firebase.auth().currentUser;
      
      if(this.props.certificateItems2[index][0]==true){
      return {
        key: this.props.allCertificates[index],
        color: colors[index % colors.length],
        header: `${certificate[3]} Certificate issued to ${certificate[0]}`,
        meta: `Issued on ${epochToDate(certificate[5])}`,
        description: (
          <div>
          <Link route={`/certificates/${this.props.allCertificates[index]}`}>
            <a className='vows-link'>{ `Certificate link`}</a>
          </Link>
        </div>
          ),
        fluid: true
      }
    }
    })


    var filtered = items.filter(function (el) {
      return el != null;
    });


    return <Card.Group items= { filtered } className='Index-Cards' itemsPerRow={2} stackable={true} doubling={true} textAlign='center'/>
  }

  renderViceItems() {
    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey'];

    const items = this.props.certificateItems1.map((certificate, index) => {
      var user = firebase.auth().currentUser;
      
      if(this.props.certificateItems2[index][1]==true){
      return {
        key: this.props.allCertificates[index],
        color: colors[index % colors.length],
        header: `${certificate[3]} Certificate issued to ${certificate[0]}`,
        meta: `Issued on ${epochToDate(certificate[5])}`,
        description: (
          <div>
          <Link route={`/certificates/${this.props.allCertificates[index]}`}>
            <a className='vows-link'>{ `Certificate link`}</a>
          </Link>
        </div>
          ),
        fluid: true
      }
    }
    })


    var filtered = items.filter(function (el) {
      return el != null;
    });


    return <Card.Group items= { filtered } className='Index-Cards' itemsPerRow={2} stackable={true} doubling={true} textAlign='center'/>
  }

  renderAcademicItems() {
    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey'];

    const items = this.props.certificateItems1.map((certificate, index) => {
      var user = firebase.auth().currentUser;
      
      if(this.props.certificateItems2[index][2]==true){
      return {
        key: this.props.allCertificates[index],
        color: colors[index % colors.length],
        header: `${certificate[3]} Certificate issued to ${certificate[0]}`,
        meta: `Issued on ${epochToDate(certificate[5])}`,
        description: (
          <div>
          <Link route={`/certificates/${this.props.allCertificates[index]}`}>
            <a className='vows-link'>{ `Certificate link`}</a>
          </Link>
        </div>
          ),
        fluid: true
      }
    }
    })


    var filtered = items.filter(function (el) {
      return el != null;
    });


    return <Card.Group items= { filtered } className='Index-Cards' itemsPerRow={2} stackable={true} doubling={true} textAlign='center'/>
  }

  render() {

 
    return (        
                      <div>
                      <FirebaseAuthProvider {...config} firebase={firebase}>
                        <div>
                          <FirebaseAuthConsumer>
                            {({ isSignedIn, firebase }) => {
                              if (isSignedIn === true) {
                                if(firebase.auth().currentUser.email=='dean@certdapp.com'){
                                  return (
                                    <BaseLayout>
                                    <NavBar3 />
                                    <div>
                                    <Container>
                                        <a name="certificates"><h2 className='Certificates-Title'>Certificates already Signed</h2></a>
                                      { this.renderDeanItems() }
                                    </Container>
                                    
                                    </div>
                                    </BaseLayout>
                                  );
                              }
                              else if(firebase.auth().currentUser.email=='vice@certdapp.com'){
                                return (
                                  <BaseLayout>
                                  <NavBar3 />
                                  <div>
                                  <Container>
                                      <a name="certificates"><h2 className='Certificates-Title'>Certificates already Signed</h2></a>
                                    { this.renderViceItems() }
                                  </Container>
                                  
                                  </div>
                                  </BaseLayout>
                                );
                              }

                              else if(firebase.auth().currentUser.email=='academic@certdapp.com'){
                                return (
                                  <BaseLayout>
                                  <NavBar3 />
                                  <div>
                                  <Container>
                                      <a name="certificates"><h2 className='Certificates-Title'>Certificates already Signed</h2></a>
                                    { this.renderAcademicItems() }
                                  </Container>
                                  
                                  </div>
                                  </BaseLayout>
                                );
                              }
                            } else {
                                return (
                                  <BaseLayout>
                                  <NavBar2 />
                                  <div>
                                  
                                  <Container>
                                   <Login></Login>
                                    </Container>
                                  </div>
                                  </BaseLayout>
                                );
                              }
                            }}
                          </FirebaseAuthConsumer>
                        </div>
                        
                      </FirebaseAuthProvider>
                    
                
                    
                      </div>

        
      
    )
  }

}


export default Signed;
