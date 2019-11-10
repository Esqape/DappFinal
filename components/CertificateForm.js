import React, { Component } from 'react';
import { Container, Form, Button, Icon, Input, Message,  Dropdown } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import CertificateFactory from '../ethereum/contracts/CertificateFactory';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
import axios from 'axios';
import fb from '../firebase';
import { fieldsAreValid, dateToEpoch } from '../helper';
import Web3g from 'web3-utils';

const deanoptions = [
  {value: '0x0Ea3E95a306ec09103cca75CDd514EF5EB6a9023' ,text: 'Dean wallet' }
]
const vicedeannoptions = [
  { key: '1', text: 'Vice dean wallet', value: '0xc40f501446236e56F3533F5cf610932ec3e54aDE' }
]
const AFoptions = [
  { key: '1', text: 'AF wallet', value: '0xD220474baBa04669f02556a4d803F016c0244f34' }
]
const Typeoptions = [
  { key: 'd', text: 'Special Honours Degree', value: 'Special Honours Degree' },

]

const intituteoptions = [
  { key: '1', text: 'SLIIT', value: 'SLIIT' }
]

class CertificateForm extends Component {

  state = {
    deanAddress: '',
    viceDeanAddress: '',
    academicAffairsAddress: '',
    type: '',
    name: '',
    institute:'',
    certificateName: '',
    description:'',
    date: '',
    loading: false,
    errorMessage: '',
    successMessage: '',
    txnHash: 0,
    CertificateContractAddress: 0,
    blockWitnessed: 0,
    prices : [],
    students: [],
    nameOptions: [],
  }

  componentDidMount() {
    let arr1 =[];
    axios.get(`https://ethgasstation.info/json/ethgasAPI.json`)
      .then(res => {
        const prices = res.data;
        this.setState({ prices });
      });

    const fbApp= fb;
    const  db = fbApp.firestore();
    db.collection("students").where("AccountExists", '==', true)
    .get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      this.setState({ students: data });

      for( var i = 0, len = this.state.students.length; i < len; i++ ) {
             
        arr1[i]={ key: this.state.students[i].Full_Name, text: this.state.students[i].Full_Name, value: this.state.students[i].Full_Name }
    
      }
      this.setState({nameOptions: arr1});
    });


    
    


  }
  
  // Date format: dd-mm-yyyy
  onDateChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '', successMessage: '' });


    let gp = Web3g.toWei(String(this.state.prices.fastest/10), 'gwei');
    console.log(gp);




    // Form Validation: check date validity
    const fieldErrorMsg = fieldsAreValid(this.state);
    if (!fieldErrorMsg) {
      let { deanAddress,viceDeanAddress,academicAffairsAddress, type, name,
      institute,certificateName,description } = this.state;
      const date = dateToEpoch(this.state.date);
      
      // Submitting form to the blockchain
      try {
        const accounts = await web3.eth.getAccounts();
        
        // (1) Create new  contract
        let transaction = await CertificateFactory.methods
          .createCertificate(deanAddress,viceDeanAddress,academicAffairsAddress,type,name,institute,certificateName,description,date)
          .send({ from: accounts[0], gasPrice: Web3g.toWei(String(this.state.prices.fastest/10), 'gwei')});
        // Update Web app
        this.setState({
          txnHash: transaction.transactionHash, blockWitnessed: transaction.blockNumber,
          successMessage: `Your new certificate have been transacted at block: ${transaction.blockNumber} and transaction hash: ${transaction.transactionHash} REDIRECTING NOW ...`
        });
        const contractAddress = transaction.events.ContractCreated.returnValues.contractAddress;

        let oemail;
        for( var i = 0, len = this.state.students.length; i < len; i++ ) {
             if(this.state.name==this.state.students[i].Full_Name){
                oemail=this.state.students[i].Email;
                break;
             }
        }

        let fbApp= fb;
        let  db = fbApp.firestore();

        db.collection('certificates').doc(contractAddress).set({
            Sharing: false,
            User: oemail,
            address: contractAddress
          });

        Router.replaceRoute(`/certificates/${contractAddress}`);

      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    } else {
      // If input fields have input errors:
      this.setState({ errorMessage: fieldErrorMsg });
    }
    this.setState({ loading: false });
  }

  render() {
    return (

      
      <Container className='Cert-Container-add'>
      
      <Form onSubmit={ this.handleSubmit } error={!!this.state.errorMessage} success={!!this.state.successMessage} >
        <Form.Group widths='3'>
            <Form.Select fluid
              label = "Faculty Dean address"
              placeholder = "Faculty Dean wallet address"
              options = {deanoptions} 
              onChange = {(e, { value }) => this.setState({deanAddress: value})}
            />
            <Form.Select fluid
              label = "Vice Chancellor address"
              placeholder = "Vice Chancellor wallet address"
              options = {vicedeannoptions}
              onChange = {(e, { value }) => this.setState({viceDeanAddress: value})}
            />
            <Form.Select fluid
              label = "Academic Director address"
              placeholder = "Academic Director wallet address"
              options = {AFoptions}      
              onChange = {(e, { value }) => this.setState({academicAffairsAddress: value})}
            />
        </Form.Group>
        <Form.Group widths='2'>
            <Form.Select fluid
                  label = "Certificate Type"
                  options = {Typeoptions}
                  value={ this.state.type }
                  placeholder = "Type of certificate"                 
                  onChange = {(e, { value }) => this.setState({type: value})}
                />

            <Form.Select fluid
                  label = "Institute Name"
                  options = {intituteoptions}
                  value={ this.state.institute }
                  placeholder = "Name of the institute" 
                  onChange = {(e, { value }) => this.setState({institute: value})}
                />
            </Form.Group>
          
            <DateInput fluid
              label = "Issued Date"
              name='date'
              value={ this.state.date }
              placeholder='Date'
              iconPosition='right'
              onChange={ this.onDateChange }
            />
        
        <Form.Group widths='equal'>
          
          <Form.Dropdown 
            fluid
            textAlign='center'
                button
                labeled
                className='dropdownNames'
                icon='user'
                options={this.state.nameOptions}
                search
                text='Select Recipient '
                onChange = {(e, { value }) => this.setState({name: value})}
              />
              <Form.Field >
                <label>Full Name</label>
                <input placeholder='First Name' readOnly value={this.state.name}/>
              </Form.Field>
          </Form.Group>
          <Form.Input fluid
                label = "Certificate Name"
                value = { this.state.c }
                placeholder="Name of the certificate"
                value = { this.state.c }
                onChange = {(e, { value }) => this.setState({certificateName: value})}
              />
          
          <Form.TextArea
            label ="Certifiate description"
            placeholder='Description of the certificate'
            value={ this.state.description}
            onChange = {(e, { value }) => this.setState({description: value})}
          />

        <Message error header='Error!' content={ this.state.errorMessage } />
        <Message success header='Success!' content={ this.state.successMessage } />

        <Button loading={ this.state.loading } id='CertBtn' icon labelPosition='left'>
          <Icon name='certificate' />
          Create
        </Button>

      </Form>
      <Message>
      <Message.Header>{this.state.prices.fastest/10} Gwei</Message.Header>
      <p>Optimal gas price for fastest transactions in current ethereum network</p>
        </Message>
      </Container>
    );
  }
};

export default CertificateForm;
