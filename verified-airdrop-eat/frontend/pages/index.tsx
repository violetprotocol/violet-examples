import { ConnectWallet, useAddress, useChain, useConnectionStatus, useContract, useContractWrite, useSigner } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { VerifiedAirdropAbi } from "../abis/VerifiedAirdrop";
import { packParameters } from "@violetprotocol/ethereum-access-token-helpers/dist/utils";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { authorize } from "@violetprotocol/sdk";

const Home: NextPage = () => {
  const chain = useChain();
  const status = useConnectionStatus();
  const address = useAddress();
  const signer = useSigner()
  const verifiedAirdropAddress = "0xae44841b3634D5DEAba372f5Fb822582817ea556";
  //0x8dAE831011fdfF43666F3E2a7cBEeEaA5270DDf2
  // const verifiedAirdropAddress = "0x8dAE831011fdfF43666F3E2a7cBEeEaA5270DDf2";
  const { contract, isLoading, error } = useContract(verifiedAirdropAddress, VerifiedAirdropAbi);
  const { mutateAsync, isLoading: isWriteLoading, error: writeError } = useContractWrite(
    contract,
    "claimAirdrop"
  );
  const [ packedTxData, setPackedTxData ] = useState<string>("");
  const [ functionSignature, setFunctionSignature ] = useState<string>("");

useEffect(() => {
  if (signer) {
    const ethersAidropContract = new ethers.Contract(verifiedAirdropAddress, VerifiedAirdropAbi, signer);
    if (ethersAidropContract) {
      const functionFragment = ethersAidropContract.interface.getFunction("claimAirdrop");
      setFunctionSignature(ethersAidropContract.interface.getSighash(functionFragment));
      setPackedTxData(packParameters(ethersAidropContract.interface, "claimAirdrop", []));
    }
  }
}, [signer])

  // if (!address || !chain || !signer) {
  //   return (
  //     <div>Unsupported network, please connect to Optimism Goerli</div>
  //   )
  // }

  if (status === "connected" && chain?.chainId != 420) {
    return (
      <div>Unsupported network, please connect to Optimism Goerli</div>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
          {contract?.chainId}
            <span className={styles.gradientText0}>
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Violet EAT {''}
              </a>
            </span>
              Verified airdrop demo 
          </h1>

          <p className={styles.description}>
            Claim an aidrop by enrolling and authenticating with {' '}
            <span className={styles.gradientText0}>
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Violet
              </a>
            </span>
          </p>

          <div className={styles.connect}>
            <ConnectWallet
              dropdownPosition={{
                side: "bottom",
                align: "center",
              }}
            />
          </div>
          <button className={styles.cardText}
          // onClick={() => mutateAsync({  args: [27, '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 1699544639]})}>
          onClick={async () => {
          // await authorize({
          //   clientId: "b5bb4058440a37cf1699c6d22da73f38b06902f0e3087ffcc8100a1b01d8ddb8",
          //   apiUrl: 'https://staging.k8s.app.violet.co',
          //   redirectUrl: 'https://staging.k8s.app.mauve.org/#/callback',
          //   transaction: {
          //     data: packedTxData,
          //     functionSignature: functionSignature,
          //     targetContract: verifiedAirdropAddress,
          //   },
          //   address: address!,
          //   chainId: chain?.chainId!,
          // })
          }}>
          Test
          </button>
        </div>

      </div>
    </main>
  );
};

export default Home;
