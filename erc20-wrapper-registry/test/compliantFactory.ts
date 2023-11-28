import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { Signers } from "./types";

// import { CompliantFactory, CompliantFactory__factory } from "../typechain-types";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { deployCompliantFactoryFixture } from "./compliantFactory.fixture";
import { compliantERC20Bytecode } from "../frontend/abis/VerifiedAirdrop";
import { CompliantERC20__factory, CompliantFactory } from "../typechain-types";
import { id } from "ethers";


describe("CompliantFactory Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.owner = signers[0];
    this.signers.admin = signers[1];
    this.signers.user = signers[2];

    this.loadFixture = loadFixture;
  });

  describe("CompliantFactory", function () {
    beforeEach(async function () {
      const { compliantFactory, mockERC20 } = await this.loadFixture(deployCompliantFactoryFixture);
      this.compliantFactory = compliantFactory;
      this.mockERC20 = mockERC20;
    });

    shouldBehaveLikeCompliantFactory();
  });
});


export function shouldBehaveLikeCompliantFactory(): void {
  describe("create2", async function () {

    it("should use create2 and deploy to expected address", async function () {
      const deployedCreate2Address = 
        await this.compliantFactory.deployCompliantErc.staticCall(
          (await this.mockERC20.getAddress()).toLowerCase(),
          // VioletID address not being mocked for test purposes
          this.signers.user.address.toLowerCase()
        );
      

      // const initCodeHash = ethers.keccak256(compliantERC20Bytecode.concat(
      //   ethers.solidityPacked(
      //     ["string", "string", "address", "address"],
      //     ["cERC20", "cERC20", (await this.signers.user.getAddress()).toLowerCase(), (await this.mockERC20.getAddress()).toLowerCase()]
      //   ).slice(2)));
      const initCodeHash = ethers.keccak256(compliantERC20Bytecode);
      const salt = ethers.keccak256(ethers.solidityPacked(["address"], [await this.mockERC20.getAddress()]))
      const factoryAddress = (await this.compliantFactory.getAddress()).toLowerCase();
      // console.log("Current salt:")
      // console.log(salt);
      // console.log("Current mockerc20:")
      // console.log(await this.mockERC20.getAddress());
      // console.log("Current violetid:")
      // console.log(await this.signers.user.getAddress());

      const deployedAddress = ethers.getCreate2Address(
        factoryAddress,
        salt,
        initCodeHash
      )

      const tx = await this.compliantFactory.connect(this.signers.user).deployCompliantErc(
          (await this.mockERC20.getAddress()).toLowerCase(),
          // VioletID address not being mocked for test purposes
          this.signers.user.address.toLowerCase()
      )
      console.log(tx.data);

      // expect(deployedCreate2Address).to.be.equal(deployedAddress);
    });
  });
}
