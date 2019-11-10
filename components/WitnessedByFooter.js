import { Link } from '../routes';

const WitnessedByFooter = (props) => {
  return (
    <div className='Witnessed-By-Footer'>
      <div className='Witnessed-Box'>
        <img className='BlockChain-Logos' src='../static/Ethereum-Icon.png' />
      </div>
      <div className='Witnessed-Box'>
        <div className='Witnessed-Text-2'>This Certificate contract resides at Ethereum address:</div>
        <Link route={`https://rinkeby.etherscan.io/address/${props.address}`} >
          <a className='Witnessed-Text-2'>{ props.address }</a>
        </Link>
      </div>
    </div>
  );
}

export default WitnessedByFooter;