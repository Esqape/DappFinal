// This file creates a web3 instance for our app
// We refer to this web3 instance in other files


import Web3 from 'web3';

let web3;
/*
// Modern dapp browsers...
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = window.ethereum;
  async (dispatch) => { try {
    // Request account access
    const accounts= window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
}
*/

(async () => {

// Logic to see which environment we are in (either server or client-side)
 if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running
  try {
    // Request account access
    window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }


  web3 = new Web3(window.web3.currentProvider);
}
 else {
  // We are on the server OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    // 'https://rinkeby.infura.io/pBXAeKwWE9Y2B3y2sRnw'
    'https://rinkeby.infura.io/v3/5c3596dd77dc484e9c426c88fc5c041b'
  );
  web3 = new Web3(provider);  // Reassign web3 to provider
}
})();

export default web3;
