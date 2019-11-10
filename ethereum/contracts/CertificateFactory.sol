
pragma solidity >=0.4.22 <0.6.0;

contract CertificateFactory {
    // You will declare your global vars here
    Certificate[] private issuedCertificates;
    event ContractCreated(Certificate contractAddress);
    
   
    function createCertificate(address _dean, address _viceDean, address _academicAffairs, string memory _type, string memory _name, string memory _institute, string memory _certificateName, string memory _description, uint _date) public {
        Certificate newCertificate = new Certificate(msg.sender, _dean, _viceDean, _academicAffairs, _type, _name, _institute, _certificateName, _description, _date);
        // saving the address so a front-end client can find it
        emit ContractCreated(newCertificate);
        issuedCertificates.push(newCertificate);
    }

    function getIssuedCertificates() public view returns (Certificate[] memory) {
     return issuedCertificates;
    }
    function getIssuedCertificatesCount() public view returns (uint) {
     return issuedCertificates.length;
    }

}

contract Certificate {
    // You will declare your global vars here
    // Owner address
    address public owner;
    //Signing addresses
    address public dean;
    address public viceDean;
    address public academicAffairs;
    // Certificate contract details
    string public certType;
    string public name;
    string public institute;
    string public certificateName;
    string public description;
    uint public createdDate;
    //Whether contract is signed
    bool public deanSignature = false;
    bool public viceDeanSignature = false;
    bool public AF_Signature = false;
    
    constructor(address _owner, address _dean, address _viceDean, address _academicAffairs, string memory _type, string memory _name, string memory _institute, string memory _certificateName, string memory _description, uint _date) public {
    // You will instantiate your contract here
        certType = _type;
        dean = _dean;
        viceDean = _viceDean;
        academicAffairs = _academicAffairs;
        owner = _owner;
        name = _name;
        institute = _institute;
        certificateName = _certificateName;
        description = _description;
        createdDate = _date;
        
    }
    
    // Reusable modifier function
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    // Reusable modifier function
    modifier onlyDean() {
        require(msg.sender == dean);
        _;
    }
    
    // Reusable modifier function
    modifier onlyViceDean() {
        require(msg.sender == viceDean);
        _;
    }
    
    // Reusable modifier function
    modifier onlyAcademicAffairs() {
        require(msg.sender == academicAffairs);
        _;
    }
    
    function getBalance() public view onlyOwner returns (uint) {
        return address(this).balance;
    }
    
    
    
    function setDeanSignature() public onlyDean {
        deanSignature = true;
        return;
    }
    
    function setViceDeanSignature() public  onlyViceDean {
        viceDeanSignature = true;
        return;
    }
    
    function setAF_Signature() public onlyAcademicAffairs {
        AF_Signature = true;
        return;
    }
    
    function kill() public onlyOwner {
        selfdestruct(owner);  
    }
    
    function getCertificateDetails() public view returns (
         string, string, string, string, string, uint256) {
        return (
            name,
            certType,
            institute,
            certificateName,
            description,
            createdDate
        );
    }
    
    function getCertificateSignatureDetails() public view returns (
         bool, bool, bool, address, address ,address) {
        return (
            deanSignature,
            viceDeanSignature,
            AF_Signature,
            dean,
            viceDean,
            academicAffairs
        );
    }

}