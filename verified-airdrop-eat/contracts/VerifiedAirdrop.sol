// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import '@violetprotocol/ethereum-access-token/contracts/AccessTokenConsumer.sol';
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VerifiedAirdrop is ERC20, AccessTokenConsumer {
    uint256 public constant airdropAmount = 100;

    mapping(address => bool) public claimed;

    constructor(string memory name_, string memory symbol_, address _EATVerifier)
			AccessTokenConsumer(_EATVerifier)
			ERC20(name_, symbol_) {}

    modifier onlyUnclaimed() {
        require(!claimed[msg.sender], "msg.sender has already claimed airdrop");
        _;
    }

    function claimAirdrop(
			uint8 v,
			bytes32 r,
			bytes32 s,
			uint256 expiry
		) public requiresAuth(v, r, s, expiry) onlyUnclaimed {
        _mint(msg.sender, airdropAmount);
        claimed[msg.sender] = true;
    }

}
