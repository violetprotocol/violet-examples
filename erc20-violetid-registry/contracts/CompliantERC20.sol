// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IVioletID } from "@violetprotocol/violetid/contracts/IVioletID.sol";

/**
 * @dev ERC20 token contract that only allows minting and transfering to valid VioletID holders
 *
 * Currently uses the VioletID status 1 representing enrollment
 */
contract CompliantERC20 is ERC20 {
    IVioletID violetID;


    constructor(string memory name_, string memory symbol_, address violetID_) ERC20(name_, symbol_) {
        violetID = IVioletID(violetID_);
    }

    modifier onlyVioletIDHolders(address account) {
        uint8 isEnrolledStatus = 1;
        require(violetID.hasStatus(account, isEnrolledStatus), "account does not have a VioletID");
        _;
    }

    // All customizations to transfers, mints, and burns should be done by overriding this function.
    // https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#ERC20-_transfer-address-address-uint256-
    // Adding the onlyVioletIDHolders modifier ensures only addresses with VioletID status receive tokens
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override onlyVioletIDHolders(to){
        super._update(from, to, amount);
    }
}
