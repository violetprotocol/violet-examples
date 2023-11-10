# Verified Airdrop - Ethereum Access Token example

This project aims to demonstrate a simple example of how to integrate with Violet using Ethereum Access Tokens.
It comes with a sample Airdrop contract, and a deploy script that uses the correct EATVerifier address on Optimism Goerli.

You can check a frontend with a live version of this demo [here](https://eat-airdrop-demo.violet.co/)
The frontend is located on the `frontend` folder, all relevant code can be found on the `frontend/pages/index.tsx` and `frontend/pages/callback.tsx` files

Find all EATVerifier live addresses at our [docs](https://docs.violet.co)


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


#### Run the frontend locally

```shell
cd frontend
yarn dev
```
