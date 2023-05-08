// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19 <0.9.0;

import './SelfSovereignIdentity.sol';

// struct Degree {
// 	string degreeType;
// 	string name;
// }

struct CredentialSubject {
	string id;
	// Degree degree;
}

struct Proof {
	string proofType;
	string creationDate;
	string verificationMethod;
	string proofPurpose;
	string proofValue;
}

struct VerifiableCredential {
	string[] context;
	string id;
	string[] credentialTypes;
	string issuer;
	string issuanceDate;
	CredentialSubject credentialSubject;
	Proof proof;
}

struct Issuer {	// ?? -> non mi ricordo di preciso chi è ç-ç
	address issuerAddress;
	string issuerDid;
	string signature;
}

struct Heir {
	uint id;
	address payable heirAddress;
	bool delegated;
	uint amount;
}

contract Inheritance {

	VerifiableCredential private vC;
	Issuer private inheritanceOwner;

	SelfSovereignIdentity private ssi; // test line
	
	mapping(uint => string) private heirsIdToDids;
	mapping(string => Heir) private heirsDidToHeir;
	uint numberOfHeirs;

	constructor(
		string[] memory _heirsDid,
		address payable[] memory _addresses, 
		bool[] memory _delegations, 
		uint[] memory _amounts,
		string memory ownerDid,
		string memory _signature
	) {	

		ssi = new SelfSovereignIdentity(); // test line

		inheritanceOwner = Issuer(msg.sender, ownerDid, _signature);
		settings(_heirsDid, _addresses, _delegations, _amounts);
	}

	// → posso già ricevere un oggetto Heir come param o è più efficiente se
	// 		me lo costruisco qua?
	function settings(
		string[] memory _dids,
		address payable[] memory _addresses, 
		bool[] memory _delegations, 
		uint[] memory _amounts
	) private {
		numberOfHeirs = 0;
		for(uint i = 0; i < _dids.length; i++) {
			heirsIdToDids[i] = _dids[i];
			heirsDidToHeir[_dids[i]] = Heir(i, _addresses[i], _delegations[i], _amounts[i]);
			numberOfHeirs++;
		}
	}

	// → la VC mi arriva come stringa? non mi ricordo...
	//		nel caso dovrei riformattarla
	function verify(VerifiableCredential memory _vC) public {
		vC = _vC;
		bool verified = false;
		if(verified) {
			split();
		} else {
			split();
		}		
	}

	function split() private {
		uint idAmount;
		address payable idAddress;
		
		for(uint i = 0; i < numberOfHeirs; i++) {
			idAmount = heirsDidToHeir[heirsIdToDids[i]].amount;
			idAddress = heirsDidToHeir[heirsIdToDids[i]].heirAddress;
			
			// si prende i soldi direttamente dal conto dell'issuer?
			(bool success, bytes memory data) = idAddress.call{value: idAmount}(""); // reentrancy?
			require(success, 'Fato caca adoso :C');
		}
	}
}
