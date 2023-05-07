// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19 <0.9.0;

import './SelfSovereignIdentity.sol';
import './Settings.sol';

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


struct Issuer {
	address issuerAddress;
	string issuerDid;
}

contract Inheritance {

	VerifiableCredential private vC;
	SelfSovereignIdentity private ssi;
	string private deceasedDid;

	Issuer private trustedIssuer;
	mapping(string => Heir) private heirs;

	constructor(
		VerifiableCredential memory _verifiableCredential,
		Heir[] memory heirList,
		string memory 
	) {

		vC = _verifiableCredential;
		ssi = new SelfSovereignIdentity();

		string memory trustedIssuerDid = ssi.createDid(); //ssi.createDid().(msg.sender) == this.(msg.sender) ?
		trustedIssuer = Issuer(msg.sender, trustedIssuerDid);

		for(uint i = 0; i < heirList.length; i++) {
			address tmpHeirAddress = heirList[i].heirAddress;

			string memory heirTrustedDid = ssi.createChildTrustedDid(tmpHeirAddress, trustedIssuerDid);

			heirs.push(
				Heir(tmpHeirAddress, heirTrustedDid, trustedIssuerDid)
			);
		}

	}

}