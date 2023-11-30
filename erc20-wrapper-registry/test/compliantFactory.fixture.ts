import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";

import {
  CompliantFactory,
  CompliantFactory__factory,
  MockERC20,
  MockERC20__factory
} from "../typechain-types";

export async function deployCompliantFactoryFixture(): Promise<{
  compliantFactory: CompliantFactory;
  mockERC20: MockERC20;
}> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const owner: SignerWithAddress = signers[0];
  const admin: SignerWithAddress = signers[1];


  const CompliantFactory_Factory: CompliantFactory__factory = 
    <CompliantFactory__factory> await ethers.getContractFactory("CompliantFactory");

  const compliantFactory: CompliantFactory = <CompliantFactory>(
    await CompliantFactory_Factory.deploy()
  );
  await compliantFactory.waitForDeployment();

  const MockERC20__factory: MockERC20__factory = 
    <MockERC20__factory> await ethers.getContractFactory("MockERC20");

  const mockERC20: MockERC20 = <MockERC20>(
    await MockERC20__factory.deploy("ERC20", "ERC20")
  );
  await mockERC20.waitForDeployment();


  return { compliantFactory, mockERC20 };
}
