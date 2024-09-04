// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Bootcamp is ERC20 {
    // The token name and symbol are set in the constructor
    constructor(uint256 initialSupply) ERC20("Lesson", "LS") {
        _mint(msg.sender, initialSupply);
    }
}
