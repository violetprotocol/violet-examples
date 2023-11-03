// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IVioletID } from "@violetprotocol/violetid/contracts/IVioletID.sol";

/**
 * @dev ERC20 token contract that only allows minting and transfering to valind VioletID holders
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

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override onlyVioletIDHolders(to) onlyVioletIDHolders(from) {
        super._transfer(from, to, amount);
    }

	function mint(address account, uint256 amount) public virtual {
		_mint(account, amount);
	}

	function _mint(address account, uint256 amount) internal virtual override onlyVioletIDHolders(account) {
        super._mint(account, amount);
    }

}
