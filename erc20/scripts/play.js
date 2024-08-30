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
const abi = contractMetadata.contracts["BootcampERC20.sol:Bootcamp"].abi;

const testing = async () => {
    const contractAddress = await fs.readFileSync("./scripts/token-address.txt", "utf8");
    // Construct the contract instance
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    // Ensure the token metadata is correct.
    console.log("Testing: Query token info:");
    let tokenName = await contract.name();
    let tokenSymbol = await contract.symbol();
    let tokenDecimals = await contract.decimals();
    let tokenSupply = ethers.formatEther(await contract.totalSupply());
    console.log(`   > Token name: ${tokenName}`);
    console.log(`   > Token symbol: ${tokenSymbol}`);
    console.log(`   > Token decimals: ${tokenDecimals}`);
    console.log(`   > Token supply: ${tokenSupply} ${tokenSymbol}`);

    // Ensure the owner balance of this token is correct.
    console.log(`Testing: Query balance of the token owner:`);
    let ownerBalance = ethers.formatEther(await contract.balanceOf(tokenOwner.address));
    console.log(`   > Balance of ${tokenOwner.address}[TokenOwner] is ${ownerBalance} ${tokenSymbol}`);
    
    // Ensure the token can be transfer.
    let toAccount = ethers.Wallet.createRandom();
    let toAccountAddr = toAccount.address;
    let transferAmount = ethers.parseUnits("1");
    console.log(`Testing: Transfer token to another account ${toAccountAddr}[ToAccount]:`);
    console.log(`   > Before transfer: The balance of ${toAccountAddr}[ToAccount] is ${ ethers.formatEther(await contract.balanceOf(toAccountAddr))} ${tokenSymbol}`);
    console.log(`   > Transfer ${ ethers.formatEther(transferAmount)} ${tokenSymbol} to ${toAccountAddr}[ToAccount]`);
    let transfer = await contract.transfer(toAccountAddr, transferAmount);
    await transfer.wait();
    console.log(`   > Transaction hash: ${transfer.hash}`);
    console.log(`   > After transfer: The balance of ${toAccountAddr}[ToAccount] is ${ ethers.formatEther(await contract.balanceOf(toAccountAddr))} ${tokenSymbol}`);
    
    // Ensure the token can be approved.
    let approveAccount = ethers.Wallet.createRandom();
    let approveAccountAddr = approveAccount.address;
    let approveAccountPrivateKey = approveAccount.privateKey;
    console.log(`Testing: Approve token to another account ${approveAccountAddr}[ApproveAccount]:`);
    console.log(`   > Before approve: The allowance of ${approveAccountAddr}[ApproveAccount] is ${ ethers.formatEther(await contract.allowance(tokenOwner.address, approveAccountAddr))} ${tokenSymbol}`);
    // Ensure the approve account has enough balance.
    const tx = await wallet.sendTransaction({
        to: approveAccountAddr,
        value: ethers.parseUnits("1")
    });
    console.log(`   > Transfer some transaction fee to ${approveAccountAddr}[ApproveAccount]: ${tx.hash}`);
    await tx.wait();
    console.assert(await provider.getBalance(approveAccountAddr) == ethers.parseUnits("1"), "The approve account should have enough balance");

    let approveValue = ethers.parseUnits("10");
    let approve = await contract.approve(approveAccountAddr, approveValue);
    await approve.wait();
    console.log(`   > Transaction hash: ${approve.hash}`);
    console.log(`   > After approve: The allowance of ${approveAccountAddr}[ApproveAccount] is ${ ethers.formatEther(await contract.allowance(tokenOwner.address, approveAccountAddr))} ${tokenSymbol}`);

    // Change the contract sender to the newly created approve account.
    let newWallet = new ethers.Wallet(approveAccountPrivateKey, provider);
    let contract2 = contract.connect(newWallet);
    // Ensure the token can be transfer from.
    let transferFromAmount = ethers.parseUnits("5");
    console.log(`Testing: TransferFrom token to another address:`);
    console.log(`   > Before transferFrom: The allowance of ${approveAccountAddr}[ApproveAccount] is ${ ethers.formatEther(await contract2.allowance(tokenOwner.address, approveAccountAddr))}`);
    console.log(`   > Transfer ${ ethers.formatEther(transferFromAmount)} ${tokenSymbol} from ${tokenOwner.address}[TokenOwner] to ${toAccountAddr}[ToAccount]`);
    let transferFrom = await contract2.transferFrom(tokenOwner.address, toAccountAddr, transferFromAmount);
    await transferFrom.wait();
    console.log(`   > Transaction hash: ${transferFrom.hash}`);
    console.log(`   > After transferFrom: The allowance of ${approveAccountAddr}[ApproveAccount] is ${ ethers.formatEther(await contract2.allowance(tokenOwner.address, approveAccountAddr))} ${tokenSymbol}`);
}
testing().catch(console.error);

