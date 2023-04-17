// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

//lore del contratto: nella notte Armando muore e bisogna modificare il suo stato e dividere la sua eredità

contract Armando {

	address owner;
	uint fortune;
	bool deceased;

	address payable[] familyWallets;
	mapping(address => uint) inheritance;

	constructor() payable {
		owner = msg.sender;
		fortune = msg.value;
		deceased = false;
	}

	modifier onlyOwner {                //codice può proseguire solo se il chiamante della funzione è il proprietario del contratto
		require(msg.sender == owner);
		_;
	}

	modifier mustBeDead {
		require(deceased == true);
		_;
	}

	function setInheritance(address payable wallet, uint amount) public {
		familyWallets.push(wallet);
		inheritance[wallet] = amount;
	}

	function payout() private mustBeDead {
		for(uint i=0; i<familyWallets.length; i++) {
			familyWallets[i].transfer(inheritance[familyWallets[i]]);
		}
	}

	function setDeceased() public onlyOwner {
		deceased = true;
		payout();
	}

}