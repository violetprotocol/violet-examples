# ERC20 Compliant Token - VioletID Registry example

This project aims to demonstrate a simple example of how to integrate with the VioletID registry smart contract.
It comes with a sample ERC20 contract, and a deploy script that uses the correct VioletID address on Optimism Goerli.

You can check a frontend with a live version of this demo [here](http://erc20-compliant.violet.co)

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
