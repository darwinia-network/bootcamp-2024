const { ethers } = require("ethers");
const fs = require("fs");
const contractMetadata = require("../contracts/metadata.json");
const { generateTokenUrl } = require("./token_url");

// Get free token from the faucet: https://faucet.triangleplatform.com/darwinia/koi
const tokenOwner = {
    address: "0x6Bc9543094D17f52CF6b419FB692797E48d275d0",
    privateKey: "0xd5cef12c5641455ad949c3ce8f9056478eeda53dcbade335b06467e8d6b2accc",
}

const network = new ethers.Network("koi", 701);
const provider = new ethers.JsonRpcProvider('https://koi-rpc.darwinia.network', network, {
    staticNetwork: network
});
const wallet = new ethers.Wallet(tokenOwner.privateKey, provider);
const abi = contractMetadata.contracts["BootcampERC721.sol:Bootcamp"].abi;

const testing = async () => {
    generateTokenUrl("Lesson", 1);

}
testing().catch(console.error);