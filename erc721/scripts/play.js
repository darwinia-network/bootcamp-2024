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
    const contractAddress = await fs.readFileSync("./scripts/token-address.txt", "utf8");
    // Construct the contract instance
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    // Mint the token
    let nextTokenId = await contract.nextTokenId();
    console.log("Mint the NFT token: id = ", Number(nextTokenId));
    // let token = await generateTokenUrl("LA", nextTokenId);
    let token = "ipfs://bafkreidpx2sbcgvwdxxtjm2pz5vjkq2bj2qw5dtztrrqtx5eakho6t2tqq";
    console.log("   > The token url: ", token);
    let mint = await contract.mint(tokenOwner.address, token);
    await mint.wait();
    console.log("   > Token Name: ", await contract.name());
    console.log("   > Token Symbol: ", await contract.symbol());
    console.log("   > Token url: ", await contract.tokenURI(nextTokenId));
    console.log("   > Token Owner: ", await contract.ownerOf(nextTokenId));
    console.log("   > BalanceOf the token owner: ", Number(await contract.balanceOf(tokenOwner.address)));

    // Transfer the token
    let toAccount = ethers.Wallet.createRandom();
    let toAccountAddr = toAccount.address;
    let toAccountPrivateKey = toAccount.privateKey;
    // Ensure the approve account has enough balance.
    let tx = await wallet.sendTransaction({
        to: toAccountAddr,
        value: ethers.parseUnits("1")
    });
    await tx.wait();
    console.log("Transfer the token from %s to another account %s", tokenOwner.address, toAccountAddr);
    console.log("   > Before transfer: The owner of the token %s is %s", Number(nextTokenId), await contract.ownerOf(nextTokenId));
    let transfer = await contract.safeTransferFrom(tokenOwner.address, toAccountAddr, nextTokenId);
    await transfer.wait();
    console.log("   > After Transfer: The owner of the token %s is %s", Number(nextTokenId), await contract.ownerOf(nextTokenId));

    // Approve the token
    console.log("Approve the token to account: %s", toAccountAddr);
    nextTokenId = await contract.nextTokenId();
    mint = await contract.mint(tokenOwner.address, token);
    await mint.wait();
    console.log("   > Token owner successfully mint another token: id = ", Number(nextTokenId));
    let approve = await contract.approve(toAccountAddr, nextTokenId);
    await approve.wait();
    console.log("   > The approved address is : ", await contract.getApproved(nextTokenId));

    // TransferFrom the approved address
    let newWallet = new ethers.Wallet(toAccountPrivateKey, provider);
    let contract2 = contract.connect(newWallet);
    let toAccount2 = ethers.Wallet.createRandom();
    let toAccountAddr2 = toAccount2.address;
    console.log("TransferFrom the token from %s to another account %s by %s", tokenOwner.address, toAccountAddr2, toAccountAddr);
    console.log("   > Before transfer: The owner of the token %s is %s", Number(nextTokenId), await contract2.ownerOf(nextTokenId));
    let transferFrom = await contract2.safeTransferFrom(tokenOwner.address, toAccount2, nextTokenId);
    await transferFrom.wait();
    console.log("   > After transfer: The owner of the token %s is %s", Number(nextTokenId), await contract2.ownerOf(nextTokenId));

}
testing().catch(console.error);