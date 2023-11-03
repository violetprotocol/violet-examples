import { ethers } from "hardhat";

async function main() {


  // The last argument is the VioletID contract address on optimismGoerli
  const compliantToken = await ethers.deployContract("CompliantERC20", ["CompliantToken", "CPTK", "0x2a0988b07C538a097Ad8b693369f6e42991591F5"]);

  await compliantToken.waitForDeployment();

  console.log(
    `Compliant Token deployed to ${compliantToken.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
