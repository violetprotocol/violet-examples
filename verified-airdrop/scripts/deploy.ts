import { ethers } from "hardhat";

async function main() {


  // VioletID contract address on optimismGoerli
  const VIOLETID_REGISTRY_OP_GOERLI = "0x2a0988b07C538a097Ad8b693369f6e42991591F5";
  const compliantToken = await ethers.deployContract("VerifiedAirdrop", ["AirdropCompliant", "AICP", VIOLETID_REGISTRY_OP_GOERLI]);

  await compliantToken.waitForDeployment();

  console.log(
    `Verified Airdrop deployed to ${compliantToken.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
