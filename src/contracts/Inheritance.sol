// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19 <0.9.0;

import './SelfSovereignIdentity.sol'; // test line

// struct Degree {
// 	string degreeType;
// 	string name;
// }

// struct CredentialSubject {
// 	string id;
// 	Degree degree;
// }

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
	// CredentialSubject credentialSubject;
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

// → per il momento ogni account con amount != 0 è attivo
struct Account {
	address payable accountAddress;
	uint amount;
	// bool active;
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
	uint numberOfHeirs;	// numero di eredi attivi

	mapping(uint => string) private heirsIdToDid;
	uint heirIndex;	// id identificativo del did dell'erede

	constructor(
		string[] memory _heirsDid,
		address payable[][] memory _addresses, 
		bool[] memory _delegations, 
		uint[][] memory _amounts,
		string memory ownerDid,
		string memory _signature
	) {	

		ssi = new SelfSovereignIdentity(); // test line

		inheritanceOwner = Issuer(msg.sender, ownerDid, _signature);
		numberOfHeirs = 0;
		heirIndex = 0;
		settings(_heirsDid, _addresses, _delegations, _amounts);
	}

	function settings(
		string[] memory _dids,
		address payable[][] memory _addresses, 
		bool[] memory _delegations, 
		uint[][] memory _amounts
	) private {
		Account[] memory heirAccounts;
		for(uint i = 0; i < _dids.length; i++) {	// TO DO: controllo nel caso il did esista già
			heirAccounts = setAddresses(_addresses[i], _amounts[i]);
			heirsDidToHeir[_dids[i]] = Heir(_dids[i], _delegations[i], true, heirAccounts);
			numberOfHeirs++;

			heirsIdToDid[heirIndex++] = _dids[i];
		}
	}

	
	// → per come è stato progettato il contratto, al momento
	//		_heirAddresses.length == _heirAddressesAmount.length
	Account[] private heirAccountCollection;
	function setAddresses(
		address payable[] memory _heirAddresses,
		uint[] memory _heirAddressesAmount
	) private returns (Account[] memory) {
		for(uint i = 0; i < _heirAddresses.length; i++) {
			address payable iterationAddress = _heirAddresses[i];
			heirAccountCollection.push(Account(iterationAddress, _heirAddressesAmount[i]));
		}
		return heirAccountCollection;
	}

	// → la VC mi arriva come stringa
	// → TODO: riformattare stringa VC
	function verify(string memory _vC) public {
		vC = format(_vC);
		bool verified = false;
		if(verified) {
			split();
		} else {
			split();
		}		
	}

	function format(string memory _vC) private returns (VerifiableCredential memory) {
		// return VerifiableCredential();
	}

	// → pensare una meglio implementazione o sticazzi?
	function split() private {
		uint idAmount;
		address payable idAddress;
		string memory iterationHeirDid;
		Heir memory iterationHeir;
		Account[] memory heirAddressCollection;
		Account memory iterationAccount;
		
		for(uint i = 0; i < heirIndex; i++) {

			iterationHeirDid = heirsIdToDid[i];

			iterationHeir = heirsDidToHeir[iterationHeirDid];

			if(iterationHeir.active == true) {
				heirAddressCollection = iterationHeir.addressCollection;
				for(uint accountIndex = 0; accountIndex < heirAddressCollection.length; accountIndex++) {
					iterationAccount = heirAddressCollection[accountIndex];
					idAmount = iterationAccount.amount;
					if(idAmount > 0) {
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
