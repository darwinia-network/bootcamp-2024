// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Bootcamp is ERC721URIStorage {
    uint256 public nextTokenId;

    constructor() ERC721("Lesson", "LS") {}

    function mint(address to, string memory tokenURI) public returns (uint256) {
        uint256 tokenId = nextTokenId++;

        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
}
