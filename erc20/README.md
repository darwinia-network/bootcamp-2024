# ERC20 Example

This example shows how to deploy and play with ERC20 token. It contains two parts:

1. [Token contract](./contracts/BootcampERC20.sol) The standard ERC20 token source code.
2. [Play script](./scripts/) The script is used to deploy and test the token.


## Usage

### Install Necessary Packages

```sh
cd erc20/
npm install
```

### Deploy Token Contract

```sh
node scripts/deploy.js 
```

The output:

```sh
Attempting to deploy contract from account 0x6Bc9543094D17f52CF6b419FB692797E48d275d0
Contract deployed at address: 0xb8276B40bACB0649444D81b415c0f528C82F2351
```

The deployed contract address is stored in `./scripts/token-address.txt`.

### Play with the Token

```sh
node scripts/play.js
```

The output:

```sh
esting: Query token info:
   > Token name: Lesson
   > Token symbol: LS
   > Token decimals: 18
   > Token supply: 1000.0 LS
Testing: Query balance of the token owner:
   > Balance of 0x6Bc9543094D17f52CF6b419FB692797E48d275d0[TokenOwner] is 1000.0 LS
Testing: Transfer token to another account 0x067457C5e686aB5EDf407051334aaA5B78f26805[ToAccount]:
   > Before transfer: The balance of 0x067457C5e686aB5EDf407051334aaA5B78f26805[ToAccount] is 0.0 LS
   > Transfer 1.0 LS to 0x067457C5e686aB5EDf407051334aaA5B78f26805[ToAccount]
   > Transaction hash: 0xae8d6c5e1f14bc9f37541f492a785a639e4af48f55a342b49456b791ddf78f70
   > After transfer: The balance of 0x067457C5e686aB5EDf407051334aaA5B78f26805[ToAccount] is 1.0 LS
Testing: Approve token to another account 0xD68856c796e0A02faE50758cf22443A5c6Df5C61[ApproveAccount]:
   > Before approve: The allowance of 0xD68856c796e0A02faE50758cf22443A5c6Df5C61[ApproveAccount] is 0.0 LS
   > Transfer some transaction fee to 0xD68856c796e0A02faE50758cf22443A5c6Df5C61[ApproveAccount]: 0x9cdb1e79cd644ca8bd0d9d6e82c901f6d47f770393624b35c8cf1259c724a0d5
   > Transaction hash: 0x8702f113a8746befc9dd6044a237775be7f113ea55ca862ce37fd0c5579caefd
   > After approve: The allowance of 0xD68856c796e0A02faE50758cf22443A5c6Df5C61[ApproveAccount] is 10.0 LS
Testing: TransferFrom token to another address:
   > Before transferFrom: The allowance of 0xD68856c796e0A02faE50758cf22443A5c6Df5C61[ApproveAccount] is 10.0
   > Transfer 5.0 LS from 0x6Bc9543094D17f52CF6b419FB692797E48d275d0[TokenOwner] to 0x067457C5e686aB5EDf407051334aaA5B78f26805[ToAccount]
   > Transaction hash: 0x0f23c2c9bb845b09648bf6945aa93974e7ef1c081e759c598f718231ce393d43
   > After transferFrom: The allowance of 0xD68856c796e0A02faE50758cf22443A5c6Df5C61[ApproveAccount] is 5.0 LS
```

Try to comprehend the output in conjunction with the script above. I hope you can fully grasp what an ERC20 token is and how to utilize it.