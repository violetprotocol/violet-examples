# Verified Airdrop - VioletID Registry example

This project aims to demonstrate a simple example of how to integrate with the VioletID registry smart contract.

It comes with a sample Smart Contract for an aidrop, that leverages an ERC20 token whilist gating the function to claim the airdrop only to users who possess a status with VioletID.
If you wish to see an example where the token itself is gated, refer to the ERC20 project on this same repository.

You can check a frontend with a live version of this demo [here](https://airdrop-violetid-example.violet.co/)

Find all VioletID live addresses at our [docs](https://docs.violet.co)


## Setup

#### Install the project by running the command

```shell
yarn install
```

#### Compile the test contract

```shell
yarn hardhat compile
```

#### Deploy the test contract on optimismGoerli:

```shell
yarn hardhat run scripts/deploy.ts --network optimismGoerli
```
