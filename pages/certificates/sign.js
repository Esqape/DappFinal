import React, { Component } from 'react';
import { Container, Grid, Button, Icon, Image,Form,Message } from 'semantic-ui-react';
import Certificate from '../../ethereum/contracts/Certificate';
import Layout from '../../components/CertificateLayout';
import WitnessedByFooter from '../../components/WitnessedByFooter';
import Head from 'next/head'
import { Link } from '../../routes';
import firebase from '../../firebase';
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import Forbidden from '../../components/Forbidden';
import web3 from '../../ethereum/web3';
import axios from 'axios';
import Web3g from 'web3-utils';

class CertificateSign extends Component {
  state = {
    WithdrawVisible: false,
    SigDean: '',
    loading: false,
    errorMessage:'',
    successMessage:'',
    txnHash: 0,
    blockWitnessed: 0,
    prices : [],
  }
	// Retrieve the Certificate contract instance to show the details
	static async getInitialProps(props) {
		const address = props.query.address;
    const certificate = Certificate(address);
		const CertificateDetails = await certificate.methods.getCertificateDetails().call();
    const name = CertificateDetails[0];
    const certType = CertificateDetails[1];
    const institue = CertificateDetails[2];
    const certificateName = CertificateDetails[3];
    const description = CertificateDetails[4];
    const createdDate = CertificateDetails[5];

    const CertificateSignatureDetails = await certificate.methods.getCertificateSignatureDetails().call();
    const deanSignature = CertificateSignatureDetails[0];
    const viceDeanSignature = CertificateSignatureDetails[1];
    const afSignature = CertificateSignatureDetails[2];

    return {
      address, name, certType, institue, certificateName, description, createdDate ,deanSignature , viceDeanSignature , afSignature ,certificate
    };
	}

  componentDidMount() {
    axios.get(`https://ethgasstation.info/json/ethgasAPI.json`)
      .then(res => {
        const prices = res.data;
        this.setState({ prices });
      });
    
  }

  epochToDate(numString) {
    const date = new Date(parseInt(numString*1000));
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateString = `${months[month]} ${day}, ${year}`;
    return dateString;
  }

  trunc(text){
    return (text.length > 300) ? `${text.substr(0, 300)} ...` : text;
  }

  signDean = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    let gp = Web3g.toWei(String(this.state.prices.fastest/10), 'gwei');
    console.log(gp);
    
    // Submitting form to the blockchain
      try {
        const accounts = await web3.eth.getAccounts();
        await this.props.certificate.methods.setDeanSignature().send({
          from: accounts[0], gasPrice: Web3g.toWei(String(this.state.prices.fastest/10), 'gwei')
        });
  
        this.setState({ successMessage: `Success` });
      } catch (err) {
        this.setState({ errorMessage: err.message });
        
      }
    this.setState({ loading: false });
  }

  signVice = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    let gp = Web3g.toWei(String(this.state.prices.fastest/10), 'gwei');
    console.log(gp);
    
      
      // Submitting form to the blockchain
      try {
        const accounts = await web3.eth.getAccounts();
        await this.props.certificate.methods.setViceDeanSignature().send({
          from: accounts[0], gasPrice: Web3g.toWei(String(this.state.prices.fastest/10), 'gwei')
        });
  
        this.setState({ successMessage: `Success` });
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    this.setState({ loading: false });
  }

  signAcademic = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    let gp = Web3g.toWei(String(this.state.prices.fastest/10), 'gwei');
    console.log(gp);
          
      // Submitting form to the blockchain
      try {
        const accounts = await web3.eth.getAccounts();
        await this.props.certificate.methods.setAF_Signature().send({
          from: accounts[0], gasPrice: Web3g.toWei(String(this.state.prices.fastest/10), 'gwei')
        });
  
        this.setState({ successMessage: `Success` });
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    this.setState({ loading: false });
  }

	render() {
		return (
      <FirebaseAuthConsumer>
      {() => {
          if((firebase.auth().currentUser!=null)&&(firebase.auth().currentUser.email=='dean@certdapp.com')){
          return (
            <Layout type={this.props.certType} certName={this.props.certificateName}>
              <Head>
                <meta property="og:title" content={this.props.certificateName + ' certificate issued to ' + this.props.name}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={'http://localhost:3000' + this.props.url.asPath}/>
                <meta property="og:image" content="http://localhost:3000/static/OGFormImg.png"/>
                <meta property="og:site_name" content="CertificateDApp.io"/>
                <meta property="og:description"
                      content={this.props.certificateName + " certificate issued to " + this.props.name + " by "+this.props.institue+" on the blockchain"}/>
              </Head>

              <Container className='Cert-Container'>
              <Link route={`/`}>
                    <div className="Home-Button">
                    <Button animated>
                      <Button.Content visible>Back</Button.Content>
                      <Button.Content hidden>
                        <Icon name='arrow left' />
                      </Button.Content>
                    </Button>
                    </div>
                  </Link> 
              <Image src='../static/sliit-logo.jpg' size='small' centered></Image>
                <h4>SRI LANKA</h4>
                <h4>INSTITUTE OF INFORMATION TECHNOLOGY</h4>
                <p className='Cert-Text'>This is to certify that
                <br></br><span className='Cert-Name'><b>{ this.props.name}</b></span>
                <br></br>having successfully completed
                <br></br>the prescribed course of study and examinations
                <br></br>of the Sri Lanka Institute of Information Technology
                <br></br>the prescribed course of study and examinations
                <br></br>on { this.epochToDate(this.props.createdDate) }
                <br></br>was admitted to the
                <br></br>{this.props.certType} of
                <br></br><span><b>{this.props.certificateName}</b></span>
                <br></br>at the convocation held in Colombo
                </p>


                <Grid className='Cert-Sigs' stackable={true} columns='3'>
                  <Grid.Row>
                    <Grid.Column>{this.props.deanSignature ? <Link route={`https://rinkeby.etherscan.io/address/0x0Ea3E95a306ec09103cca75CDd514EF5EB6a9023`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                        <Button loading={ this.state.loading } id='certsignBtn' icon labelPosition='left' centered onClick={this.signDean}>
                        <Icon name='signup' />Sign
                        </Button>
                    }<br />__________________<br/>Signature of Faculty Dean</Grid.Column>
                    <Grid.Column>{this.props.viceDeanSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xc40f501446236e56F3533F5cf610932ec3e54aDE`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                      <a className='Sign-Text-2'>EMPTY</a>
                    }<br />__________________<br/>Signature of Vice Chancellor</Grid.Column>
                    <Grid.Column>{this.props.afSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xD220474baBa04669f02556a4d803F016c0244f34`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                        <a className='Sign-Text-2'>EMPTY</a>
                    }<br />__________________<br/>Signature of Academic Director</Grid.Column>
                  </Grid.Row>
                </Grid>
                <WitnessedByFooter address={this.props.address}/>
              </Container>
            </Layout>
          );
        }

        else if((firebase.auth().currentUser!=null)&&(firebase.auth().currentUser.email=='vice@certdapp.com'))
        {
                return (
                  <Layout type={this.props.certType} certName={this.props.certificateName}>
                    <Head>
                      <meta property="og:title" content={this.props.certificateName + ' certificate issued to ' + this.props.name}/>
                      <meta property="og:type" content="website"/>
                      <meta property="og:url" content={'http://localhost:3000' + this.props.url.asPath}/>
                      <meta property="og:image" content="http://localhost:3000/static/OGFormImg.png"/>
                      <meta property="og:site_name" content="CertificateDApp.io"/>
                      <meta property="og:description"
                            content={this.props.certificateName + " certificate issued to " + this.props.name + " by "+this.props.institue+" on the blockchain"}/>
                    </Head>
      
                    <Container className='Cert-Container'>
                    <Link route={`/`}>
                          <div className="Home-Button">
                          <Button animated>
                            <Button.Content visible>Back</Button.Content>
                            <Button.Content hidden>
                              <Icon name='arrow left' />
                            </Button.Content>
                          </Button>
                          </div>
                        </Link> 
                    <Image src='../static/sliit-logo.jpg' size='small' centered></Image>
                      <h4>SRI LANKA</h4>
                      <h4>INSTITUTE OF INFORMATION TECHNOLOGY</h4>
                      <p className='Cert-Text'>This is to certify that
                      <br></br><span className='Cert-Name'><b>{ this.props.name}</b></span>
                      <br></br>having successfully completed
                      <br></br>the prescribed course of study and examinations
                      <br></br>of the Sri Lanka Institute of Information Technology
                      <br></br>the prescribed course of study and examinations
                      <br></br>on { this.epochToDate(this.props.createdDate) }
                      <br></br>was admitted to the
                      <br></br>{this.props.certType} of
                      <br></br><span><b>{this.props.certificateName}</b></span>
                      <br></br>at the convocation held in Colombo
                      </p>
      
      
                      <Grid className='Cert-Sigs' stackable={true} columns='3'>
                        <Grid.Row>
                          <Grid.Column>{this.props.deanSignature ? <Link route={`https://rinkeby.etherscan.io/address/0x0Ea3E95a306ec09103cca75CDd514EF5EB6a9023`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                               <a className='Sign-Text-2'>EMPTY</a>
                          }<br />__________________<br/>Signature of Faculty Dean</Grid.Column>
                          <Grid.Column>{this.props.viceDeanSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xc40f501446236e56F3533F5cf610932ec3e54aDE`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                            <Button loading={ this.state.loading } id='certsignBtn' icon labelPosition='left' centered onClick={this.signVice}>
                            <Icon name='signup' />Sign
                            </Button>
                          }<br />__________________<br/>Signature of Vice Chancellor</Grid.Column>
                          <Grid.Column>{this.props.afSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xD220474baBa04669f02556a4d803F016c0244f34`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                              <a className='Sign-Text-2'>EMPTY</a>
                          }<br />__________________<br/>Signature of Academic Director</Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <WitnessedByFooter address={this.props.address}/>
                    </Container>
                  </Layout>
                );
        }

        else if((firebase.auth().currentUser!=null)&&(firebase.auth().currentUser.email=='academic@certdapp.com'))
        {
                return (
                  <Layout type={this.props.certType} certName={this.props.certificateName}>
                    <Head>
                      <meta property="og:title" content={this.props.certificateName + ' certificate issued to ' + this.props.name}/>
                      <meta property="og:type" content="website"/>
                      <meta property="og:url" content={'http://localhost:3000' + this.props.url.asPath}/>
                      <meta property="og:image" content="http://localhost:3000/static/OGFormImg.png"/>
                      <meta property="og:site_name" content="CertificateDApp.io"/>
                      <meta property="og:description"
                            content={this.props.certificateName + " certificate issued to " + this.props.name + " by "+this.props.institue+" on the blockchain"}/>
                    </Head>
      
                    <Container className='Cert-Container'>
                    <Link route={`/`}>
                          <div className="Home-Button">
                          <Button animated>
                            <Button.Content visible>Back</Button.Content>
                            <Button.Content hidden>
                              <Icon name='arrow left' />
                            </Button.Content>
                          </Button>
                          </div>
                        </Link> 
                    <Image src='../static/sliit-logo.jpg' size='small' centered></Image>
                      <h4>SRI LANKA</h4>
                      <h4>INSTITUTE OF INFORMATION TECHNOLOGY</h4>
                      <p className='Cert-Text'>This is to certify that
                      <br></br><span className='Cert-Name'><b>{ this.props.name}</b></span>
                      <br></br>having successfully completed
                      <br></br>the prescribed course of study and examinations
                      <br></br>of the Sri Lanka Institute of Information Technology
                      <br></br>the prescribed course of study and examinations
                      <br></br>on { this.epochToDate(this.props.createdDate) }
                      <br></br>was admitted to the
                      <br></br>{this.props.certType} of
                      <br></br><span><b>{this.props.certificateName}</b></span>
                      <br></br>at the convocation held in Colombo
                      </p>
      
      
                      <Grid className='Cert-Sigs' stackable={true} columns='3'>
                        <Grid.Row>
                          <Grid.Column>{this.props.deanSignature ? <Link route={`https://rinkeby.etherscan.io/address/0x0Ea3E95a306ec09103cca75CDd514EF5EB6a9023`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                               <a className='Sign-Text-2'>EMPTY</a>
                          }<br />__________________<br/>Signature of Faculty Dean</Grid.Column>
                          <Grid.Column>{this.props.viceDeanSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xc40f501446236e56F3533F5cf610932ec3e54aDE`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                            <a className='Sign-Text-2'>EMPTY</a>
                          }<br />__________________<br/>Signature of Vice Chancellor</Grid.Column>
                          <Grid.Column>{this.props.afSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xD220474baBa04669f02556a4d803F016c0244f34`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                              <Button loading={ this.state.loading } id='certsignBtn' icon labelPosition='left' centered onClick={this.signAcademic}>
                              <Icon name='signup' />Sign
                              </Button>
                          }<br />__________________<br/>Signature of Academic Director</Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <WitnessedByFooter address={this.props.address}/>
                    </Container>
                  </Layout>
                );
        }

        else{
          return (
            <Forbidden>
            </Forbidden>
          );
        }
      }}
    </FirebaseAuthConsumer>
      
    )
	}
}

export default CertificateSign;
