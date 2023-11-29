#  ERC20 Wrapper - Violet ID example

This project aims to demonstrate a simple example of how to wrap ERC20 tokens to a compliant version of it using VioletID. It comes with a sample Factory contract, and a CompliantERC20 contract on Optimism Goerli.

You can check a frontend with a live version of this demo [here](https://erc20-wrapper.violet.co/)
The frontend is located on the `frontend` folder, all relevant code can be found on the `frontend/pages/index.tsx` file

Find all VioletID live addresses in our [docs](https://docs.violet.co).


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
