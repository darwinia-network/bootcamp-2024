const { ethers } = require("ethers");
const fs = require("fs");
const contractMetadata = require("../contracts/metadata.json");

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
// Compile and output the contract metadata by running the following command:
// solc contracts/BootcampERC20.sol --include-path node_modules/ --base-path / --combined-json abi,bin,hashes --pretty-json > contracts/metadata.json
const abi = contractMetadata.contracts["BootcampERC721.sol:Bootcamp"].abi;
const bin = contractMetadata.contracts["BootcampERC721.sol:Bootcamp"].bin;

const deploy = async () => {
    console.log(`Attempting to deploy contract from account ${tokenOwner.address}`);

    // Construct the contract instance
    const contract = new ethers.ContractFactory(abi, bin, wallet);
    
    let res = await contract.deploy();
    let address = await res.getAddress();
    console.log(`Contract deployed at address: ${address}`);

    fs.writeFileSync("./scripts/token-address.txt", address);
};

deploy();