import { ethers } from "hardhat";

async function main() {


  const compliantFactory = await ethers.deployContract("CompliantFactory", []);

  await compliantFactory.waitForDeployment();

  console.log(
    `CompliantFactory deployed to ${compliantFactory.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
