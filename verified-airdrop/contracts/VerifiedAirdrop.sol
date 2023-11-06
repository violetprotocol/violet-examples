// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IVioletID } from "@violetprotocol/violetid/contracts/IVioletID.sol";

/**
 * @dev ERC20 token contract that drops tokens to VioletID Holders only
 *
 * VioletID holders can claim some tokens once only
 * Currently uses the VioletID status 1 representing enrollment
 */
contract VerifiedAirdrop is ERC20 {
    IVioletID violetID;
    uint256 public constant airdropAmount = 100e18;

    mapping(address => bool) public claimed;

    constructor(string memory name_, string memory symbol_, address violetID_) ERC20(name_, symbol_) {
        violetID = IVioletID(violetID_);
    }

    modifier onlyVioletIDHolders() {
        uint8 isEnrolledStatus = 1;
        require(violetID.hasStatus(msg.sender, isEnrolledStatus), "msg.sender does not have a VioletID");
        _;
    }

    modifier onlyUnclaimed() {
        require(!claimed[msg.sender], "msg.sender has already claimed airdrop");
        _;
    }

    function claimAirdrop() public onlyVioletIDHolders onlyUnclaimed {
        _mint(msg.sender, airdropAmount);
        claimed[msg.sender] = true;
    }
}
