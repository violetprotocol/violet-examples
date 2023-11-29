// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IVioletID } from "@violetprotocol/violetid/contracts/IVioletID.sol";
import "./CompliantERC20.sol";

/**
 * @dev ERC20 token factory that builds a new ERC20 using the previous token address
 *
 * Saves the new wrapped token address on the erc20ToCompliantWrapped mapping
 */
contract CompliantFactory {

  mapping(address => address) public erc20ToCompliantWrapped;

  function deployCompliantErc(address nonCompliantERC20, address violetId_) public payable {
    address compliantErc20 = address(
      new CompliantERC20
        {
          salt: keccak256(abi.encodePacked(nonCompliantERC20))
        }(
          string.concat("c", ERC20(nonCompliantERC20).name()),
          string.concat("c", ERC20(nonCompliantERC20).symbol()),
          violetId_,
          nonCompliantERC20
        )
    );
    erc20ToCompliantWrapped[nonCompliantERC20] = compliantErc20;
  }
}
