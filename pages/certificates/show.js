import React, { Component } from 'react';
import { Container, Grid, Button, Icon, Image } from 'semantic-ui-react';
import Certificate from '../../ethereum/contracts/Certificate';
import Layout from '../../components/CertificateLayout';
import WitnessedByFooter from '../../components/WitnessedByFooter';
import Head from 'next/head'
import { Link } from '../../routes';
import fb from '../../firebase';
import Forbidden from '../../components/Forbidden';


class CertificateShow extends Component {
  state = {
    WithdrawVisible: false,
    SigDean: '',
    ownerEmail: '',
    sharing: '',
    db: '',
    loading: true,
    user1: '',
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
      address, name, certType, institue, certificateName, description, createdDate ,deanSignature , viceDeanSignature , afSignature
    };
	}

  componentDidMount() {
    const fbApp= fb;
    const  db = fbApp.firestore();
    this.setState({db: db});
    let Ref = db.collection('certificates').doc(this.props.address);
    Ref.get()
      .then(doc => {
          let data = doc.data();
          this.setState({sharing: data.Sharing});
          this.setState({ownerEmail: data.User});
          
      })
      .catch(err => {
        console.log('Error getting document', err);
      }); 

      

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



  epochToDate(numString) {
    const date = new Date(parseInt(numString));
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

  
  render() {
    if(this.state.loading) {
        return 'Loading...'
    } 

    else if((this.state.user1=='admin@certdapp.com')||(this.state.user1=='dean@certdapp.com')||(this.state.user1=='vice@certdapp.com')||(this.state.user1=='academic@certdapp.com')||(this.state.user1==this.state.ownerEmail)){
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
            <br></br>
            <p className='Cert-Text'>This is to certify that
            <br></br><span className='Cert-Name'><b>{ this.props.name}</b></span>
            <br></br>having successfully completed
            <br></br>the prescribed course of study and examinations
            <br></br>of the Sri Lanka Institute of Information Technology
            <br></br>on { this.epochToDate(this.props.createdDate) }
            <br></br>was admitted to the
            <br></br>{this.props.certType} of
            <br></br><span><b>{this.props.certificateName}</b></span>
            <br></br>at the convocation held in Colombo
            </p>


            <Grid className='Cert-Sigs' stackable={true} columns='3'>
              <Grid.Row>
                <Grid.Column>{this.props.deanSignature ? <Link route={`https://rinkeby.etherscan.io/address/0x0Ea3E95a306ec09103cca75CDd514EF5EB6a9023`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                'EMPTY'}<br />__________________<br/>Signature of Faculty Dean</Grid.Column>
                <Grid.Column>{this.props.viceDeanSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xc40f501446236e56F3533F5cf610932ec3e54aDE`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                'EMPTY'}<br />__________________<br/>Signature of Vice Chancellor</Grid.Column>
                <Grid.Column>{this.props.afSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xD220474baBa04669f02556a4d803F016c0244f34`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                'EMPTY'}<br />__________________<br/>Signature of Academic Director</Grid.Column>
              </Grid.Row>
            </Grid>
            <WitnessedByFooter address={this.props.address}/>
          </Container>
        </Layout>
      );

    }

    else if(this.state.sharing){
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
                'EMPTY'}<br />__________________<br/>Signature of Faculty Dean</Grid.Column>
                <Grid.Column>{this.props.viceDeanSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xc40f501446236e56F3533F5cf610932ec3e54aDE`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                'EMPTY'}<br />__________________<br/>Signature of Vice Chancellor</Grid.Column>
                <Grid.Column>{this.props.afSignature ? <Link route={`https://rinkeby.etherscan.io/address/0xD220474baBa04669f02556a4d803F016c0244f34`} ><a className='Witnessed-Text-2'>SIGNED</a></Link> : 
                'EMPTY'}<br />__________________<br/>Signature of Academic Director</Grid.Column>
              </Grid.Row>
            </Grid>
            <WitnessedByFooter address={this.props.address}/>
          </Container>
        </Layout>
      );
      }

    else {
      return (
        <Forbidden>
        </Forbidden>
      );
    }


  }

	
}
		

export default CertificateShow;
