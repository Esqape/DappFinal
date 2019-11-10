import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Link } from '../routes'
import CertificateFactory from '../ethereum/contracts/CertificateFactory';
import { Card, Button, Container,Form, Icon, Input, Message, Confirm } from 'semantic-ui-react';
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
import BaseLayout from '../components/BaseLayout';
import { Router } from '../routes';
import fb from '../firebase';
import CertificateContract from '../ethereum/contracts/Certificate';
import web3 from '../ethereum/web3';
import axios from 'axios';
import Web3g from 'web3-utils';



class CertificateIndex extends Component {

  state = {
   useremail: '',
   userpassword: '',
   open : false,
   loading: false,
  errorMessage: '',
  successMessage: '',
  killaddr : '',
  db: ''
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

    return { allCertificates, certificateItems1 };
  }

  componentDidMount(){
    const fbApp= firebase;
    const  db = fbApp.firestore();
    this.setState({db: db});
    axios.get(`https://ethgasstation.info/json/ethgasAPI.json`)
      .then(res => {
        const prices = res.data;
        this.setState({ prices });
      });
    }

  handleChange (event) {
    this.setState({ useremail: event.target.value })
  }

  handleChange2 (event) {
    this.setState({ userpassword: event.target.value })
  }

  renderItems() {
    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey'];

    const items = this.props.certificateItems1.map((certificate, index) => {
      var addr= this.props.allCertificates[index];
      return {
        key: this.props.allCertificates[index],
        color: colors[index % colors.length],
        header: `${certificate[3]} Certificate issued to ${certificate[0]}`,
        meta: `Issued on ${epochToDate(certificate[5])}`,
        description: (
          <div className='someCenter'>
          <Link route={`/certificates/${this.props.allCertificates[index]}`}>
            <a className='vows-link'>{ `Certificate link`}</a>
          </Link>
                <Button loading={ this.state.loading }  id='certdelBtn' value={addr} icon labelPosition='left' onClick={this.show}>
                <Icon name='delete' />Kill Certificate
                </Button>
                <Confirm
                    
                    open={this.state.open}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirm}
                  />
        </div>
          ),
        fluid: true
      }
    })

    return <Card.Group items= { items } className='Index-Cards' itemsPerRow={2} stackable={true} doubling={true} textAlign='center'/>
  }


  show = async(event) =>{
    this.setState({open : true});
    try{
    await this.setState({killaddr : event.currentTarget.value});
    }
    catch(err){
      console.log('error: ', err);
    }
  }

  handleCancel = async(event) =>{
    this.setState({ open: false });
  }

  handleConfirm = async(event) =>{
    event.preventDefault();
    let addre1= this.state.killaddr;
    this.setState({ open: false });

      this.setState({ loading: true, errorMessage: '', successMessage: '' });

      let gp = Web3g.toWei(String(this.state.prices.fastest/10), 'gwei');
      console.log(gp);
        
        // Submitting kill to the blockchain
        try {
          const accounts = await web3.eth.getAccounts();
        await CertificateContract(addre1).methods.kill().send({
          from: accounts[0], gasPrice: Web3g.toWei(String(this.state.prices.fastest/10), 'gwei')
        });

        this.setState({ successMessage: `Success` });


        let data = {
          address: this.state.killaddr
        };

        this.state.db.collection("killed").doc(this.state.killaddr).set(data);
        

        Router.replaceRoute(`/`);

        } catch (err) {
          this.setState({ errorMessage: err.message });
          console.log(err.message);
        }
      
      this.setState({ loading: false });

  }

  render() {


 
    return (        
                      <div>
                      <FirebaseAuthProvider {...config} firebase={firebase}>
                        <div>
                          <FirebaseAuthConsumer>
                            {({ isSignedIn, firebase }) => {
                              if (isSignedIn === true) {
                                if(firebase.auth().currentUser.email=='admin@certdapp.com'){
                                return (
                                  <Layout uemail={firebase.auth().currentUser.email}>
                                  <div>
                                  <Container>
                                      <a name="certificates"><h2 className='Certificates-Title'>Certificates</h2></a>
                                    { this.renderItems() }
                                    
                                  </Container>
                                  
                                    
                                  </div>
                                  </Layout>
                                );
                              }
                              else if((firebase.auth().currentUser.email=='dean@certdapp.com')||(firebase.auth().currentUser.email=='vice@certdapp.com')||(firebase.auth().currentUser.email=='academic@certdapp.com')){
                                Router.replaceRoute(`/toSign`);
                              }
                              else{
                                Router.replaceRoute(`/yourCerts`);
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


export default CertificateIndex;
