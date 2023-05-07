// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19 <0.9.0;

struct Heir {
	address heirAddress;
	string signature;
	bool delegated;
}

contract Settings {
  mapping(string => Heir) private heirs;

  c

}