// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IVioletID} from "@violetprotocol/violetid/contracts/IVioletID.sol";

error AccountWithoutVioletIDRequiredStatus();

/**
 * @dev ERC20 token contract that only allows wrapping and unwraping to valid VioletID holders
 *
 * Currently uses the VioletID status 1 representing enrollment, which includes initial screening and KYC/KYB.
 */
contract CompliantERC20 is ERC20 {
    IERC20 permissionlessERC20;
    uint256 public tokensWrapped;
    IVioletID violetID;

    constructor(
        string memory name_,
        string memory symbol_,
        address violetID_,
        address _nonCompliantERC20
    ) ERC20(name_, symbol_) {
        violetID = IVioletID(violetID_);
        permissionlessERC20 = IERC20(_nonCompliantERC20);
    }

    modifier onlyVioletIDHolders(address account) {
        uint8 isEnrolledStatus = 1;
        require(
            violetID.hasStatus(account, isEnrolledStatus),
            "account does not have a VioletID"
        );
        if (!violetID.hasStatus(account, isEnrolledStatus))
            revert AccountWithoutVioletIDRequiredStatus();
        _;
    }

    // All customizations to transfers, mints, and burns should be done by overriding this function.
    // https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#ERC20-_transfer-address-address-uint256-
    // Adding the onlyVioletIDHolders modifier ensures only addresses with VioletID status receive tokens
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override onlyVioletIDHolders(to) {
        super._update(from, to, amount);
    }

    function wrap(
        uint256 amount
    ) public virtual onlyVioletIDHolders(msg.sender) {
        permissionlessERC20.transferFrom(msg.sender, address(this), amount);
        tokensWrapped += amount;
        super._mint(msg.sender, amount);
    }

    function unwrap(
        uint256 amount
    ) public virtual onlyVioletIDHolders(msg.sender) {
        require(
            tokensWrapped >= amount,
            "cERC20_unwrap: amount to unwrap exceeds total wrapped"
        );
        tokensWrapped -= amount;
        _burn(msg.sender, amount);
        permissionlessERC20.transfer(msg.sender, amount);
    }
}
