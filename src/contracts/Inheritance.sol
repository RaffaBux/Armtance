// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19 <0.9.0;

import './SelfSovereignIdentity.sol'; // test line

struct Degree {
	string degreeType;
	string name;
}

struct CredentialSubject {
	string id;
	Degree degree;
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

// → ?? non mi ricordo di preciso chi è ç-ç
// → Issuer è l'inheritanceOwner quando viene invoato il contratto
// 		contratto la prima volta ma che succede quando 
//		inheritanceOwner muore???
struct Issuer {
	address issuerAddress;
	string issuerDid;
	string signature;
}

struct Account {
	address payable accountAddress;
	uint amount;
	bool active;
}

// → in questa maniera se l'utente perde la chiave privata
//		son cazzi perché gli inculano la sua fetta di eredità
struct Heir {
	string did;
	bool delegated;
	bool active;
	Account[] addressCollection;
}

contract Inheritance {

	VerifiableCredential private vC;
	Issuer private inheritanceOwner;

	SelfSovereignIdentity private ssi; // test line
	
	mapping(string => Heir) private heirsDidToHeir;
	uint numberOfHeirs;
	uint heirIndex;

	constructor(
		string[] memory _heirsDid,
		address[][] memory _addresses, 
		bool[] memory _delegations, 
		uint[][] memory _amounts,
		string memory ownerDid,
		string memory _signature
	) {	

		ssi = new SelfSovereignIdentity(); // test line

		inheritanceOwner = Issuer(msg.sender, ownerDid, _signature);
		numberOfHeirs = 0;
		settings(_heirsDid, _addresses, _delegations, _amounts);
	}

	function settings(
		string[] memory _dids,
		address[][] memory _addresses, 
		bool[] memory _delegations, 
		uint[][] memory _amounts
	) private {
		Account[] memory heirAccount;
		for(uint i = 0; i < _dids.length; i++) {	//TO DO: controllo nel caso il did esista già
			heirAccount = setAddresses(_dids[i], _addresses[i], _amounts[i]);
			heirsDidToHeir[_dids[i]] = Heir(_dids[i], _delegations[i], true, heirAccount);
			numberOfHeirs++;
		}
	}

	// → per come è stato progettato il sw
	//		_heirAddresses.length == _heirAddressesAmount.length
	function setAddresses(
		string memory _ownerDid,
		address[] memory _heirAddresses,
		uint[] memory _heirAddressesAmount
	) private returns (Account[] storage heirAccount) {
		for(uint i = 0; i < _heirAddresses.length; i++) {
			(address payable iterationAddress, bool status) = _heirAddresses[i];
			heirAccount.push(Account(iterationAddress, _heirAddressesAmount[i], status));
		}
		return heirAccount;
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


	// → che cazzo di orrore
	function split() private {
		uint idAmount;
		address payable idAddress;
		Heir memory iterationHeir;
		Account[] memory heirAddressCollection;
		Account memory iterationAccount;
		
		for(uint i = 0; i < numberOfHeirs; i++) {
			iterationHeir = heirsDidToHeir[i];
			if(iterationHeir.active == true) {
				heirAddressCollection = iterationHeir.addressCollection;
				for(uint accountIndex = 0; accountIndex < heirAddressCollection.length; accountIndex++) {
					iterationAccount = heirAddressCollection[accountIndex];
					if(iterationAccount.active == true) {
						idAmount = iterationAccount.amount;
						idAddress = iterationAccount.accountAddress;
						
						// si prende i soldi direttamente dal conto dell'issuer?
						(bool success, ) = idAddress.call{value: idAmount}(''); // reentrancy?
						require(success, 'Fato caca adoso :C');
					}
				}
			}
		}
	}

	// function modify(
	// 	string[] memory didsToBeRemoved,
	// 	Heir[] memory didsToBeAdded,
	// 	Heir[] memory didsToBeModified
	// ) public {}
	
}
