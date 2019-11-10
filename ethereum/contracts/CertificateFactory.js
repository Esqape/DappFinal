// Tell web3 that a deployed copy of 'CertificateFactory' exists
import web3 from '../web3';    // This pulls it from our web3 instance, not actual web3
import CertificateFactory from '../build/CertificateFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CertificateFactory.interface),
  // This is the address of the contract factory
  // 

  // Rinkeby
  '0xc95ee2b8b63ef63332316b4cdfb8d840d90f0812'
);

export default instance;
