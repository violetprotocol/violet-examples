import { ethers } from "hardhat";

async function main() {


  // Ethereum Access Token Verifier contract address on optimismGoerli
  const ACCESS_TOKEN_VERIFIER = "0x5b66D6bf6395Cfe769B44e5404c7875f95749F80";
  const verifiedAidrop = await ethers.deployContract("VerifiedAirdrop", ["VerifiedAirdrop", "VFAD", ACCESS_TOKEN_VERIFIER]);

  await verifiedAidrop.waitForDeployment();

  console.log(
    `VerifiedAirdrop deployed to ${verifiedAidrop.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
