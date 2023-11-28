import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { CompliantFactory, MockERC20 } from "../typechain-types";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    compliantFactory: CompliantFactory;
    mockERC20: MockERC20;
    randomAddresses: string[];
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  owner: SignerWithAddress;
  admin: SignerWithAddress;
  user: SignerWithAddress;
}
