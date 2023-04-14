// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
contract Ballot {

	address public chairperson;
	Proposal[] public proposals;

	struct Voter {
		uint weight;
		bool voted;
		address delegate;
		uint voteIndex;
	}

	struct Proposal {
		bytes32 name;
		uint voteCount;
	}

	mapping(address => Voter) public voters;

	constructor(bytes32[] memory proposalNames) {
		chairperson = msg.sender;
		voters[chairperson].weight = 1; 

		for(uint i = 0; i < proposalNames.length; i++) {
			proposals.push(Proposal({
				name: proposalNames[i],
				voteCount: 0
			}));
		}
	}

	function giveRightToVote(address voter) external {
		require(msg.sender == chairperson, "Only chair person can give the right to vote");
		require(!voters[voter].voted, "The voter already vote");
		require(voters[voter].weight == 0, "The voter already has right to vote");
		voters[voter].weight = 1;
	}

	function delegate(address to) external {
		Voter storage sender = voters[msg.sender];
		require(sender.weight != 0, "You have no right to vote");
		require(!sender.voted, "You have already voted");
		require(msg.sender != to, "Self delegation is disallowed");

		while(voters[to].delegate != address(0)) {
			to = voters[to].delegate;
			require(to != msg.sender, "Delegation loop spotted");
		}

		Voter storage delegateV = voters[to];
		require(delegateV.weight == 0, "You can not delegate someone who has not right to vote");

		sender.voted = true;
		sender.delegate = to;

		if(delegateV.voted) {
			proposals[delegateV.voteIndex].voteCount += sender.weight;
		} else {
			delegateV.weight += sender.weight;
		}
	}

	function vote(uint proposal) external {
		Voter storage sender = voters[msg.sender];
		require(sender.weight != 0, "You have no right to vote");
		require(!sender.voted, "You already voted");
		sender.voted = true;
		sender.voteIndex = proposal;

		proposals[sender.voteIndex].voteCount += sender.weight;
	}

	function winnerCalc() public view returns (uint winnerIndex) {
		uint winningVoteCount = 0;
		for(uint i=0; i < proposals.length; i++) {
			if(proposals[i].voteCount > winningVoteCount) {
				winningVoteCount = proposals[i].voteCount;
				winnerIndex = i;
			}
		}
	}
	
	function getWinnerName() external view returns (bytes32 winnerName) {
		winnerName = proposals[winnerCalc()].name;
	}

	function getChairAddress() external view returns (address chairPersonAddress) {
		chairPersonAddress = chairperson;
	}

}