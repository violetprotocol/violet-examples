import {
  ConnectWallet,
  useAddress,
  useChain,
  useConnectionStatus,
  useSigner,
} from '@thirdweb-dev/react'
import styles from '../styles/Home.module.css'
import { NextPage } from 'next'
import { VerifiedAirdropAbi } from '../abis/VerifiedAirdrop'
import { packParameters } from '@violetprotocol/ethereum-access-token-helpers/dist/utils'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { buildAuthorizationUrl } from '@violetprotocol/sdk'

const Home: NextPage = () => {
  const chain = useChain()
  const status = useConnectionStatus()
  const address = useAddress()
  const signer = useSigner()
  const verifiedAirdropAddress = '0xae44841b3634D5DEAba372f5Fb822582817ea556'
  const [packedTxData, setPackedTxData] = useState<string>('')
  const [functionSignature, setFunctionSignature] = useState<string>('')
  const [eligible, setEligible] = useState<boolean>()
  const [authorizationUrl, setAuthorizationUrl] = useState<string>()
  const [isPageLoading, setPageLoading] = useState<boolean>(true);
  const [isWrongChain, setIsWrongChain] = useState<boolean>();

  useEffect(() => {
    if (signer && address && chain?.chainId == 420) {
      const ethersAidropContract = new ethers.Contract(
        verifiedAirdropAddress,
        VerifiedAirdropAbi,
        signer,
      )
      if (ethersAidropContract) {
        const functionFragment =
          ethersAidropContract.interface.getFunction('claimAirdrop')
        setFunctionSignature(
          ethersAidropContract.interface.getSighash(functionFragment),
        )
        setPackedTxData(
          packParameters(ethersAidropContract.interface, 'claimAirdrop', []),
        )
        ethersAidropContract.callStatic
          .claimed(address)
          .then((claimedResult) => {
            setEligible(!claimedResult)
          })
      }
    }
  }, [signer, address, chain])

  useEffect(() => {
    if (chain?.chainId == 420) {
      setIsWrongChain(false)
    } else {
      setIsWrongChain(true)
    }
  }, [chain])

  useEffect(() => {
    if (address && chain?.chainId == 420) {
      const builtAuthorizationUrl = buildAuthorizationUrl({
        clientId:
          '7dbf8fbd3896d47e8d17f33a96189c2a9f91748f6dcdd9394de01bf52c8b0af2',
        apiUrl: 'https://staging.k8s.app.violet.co',
        redirectUrl:
          'https://dd3a-2001-7d0-81bc-ae80-f0e8-afa4-d680-509c.ngrok-free.app/callback',
        transaction: {
          data: packedTxData,
          functionSignature: functionSignature,
          targetContract: verifiedAirdropAddress,
        },
        address: address,
        chainId: chain?.chainId,
      })
      setAuthorizationUrl(builtAuthorizationUrl)
    }
  }, [address, chain, functionSignature, packedTxData])

  useEffect(() => {
    if (authorizationUrl == null || eligible == null) {
      setPageLoading(true)
    } else {
      setPageLoading(false)
    }
  }, [authorizationUrl, eligible])

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.gradientText0}>
              <a href="https://docs.violet.co">Violet EAT {''}</a>
            </span>
            Verified airdrop demo
          </h1>

          <p className={styles.description}>
            Claim an aidrop by enrolling and authenticating with{' '}
            <span className={styles.gradientText0}>
              <a>Violet</a>
            </span>
          </p>

          <div className={styles.connect}>
            <ConnectWallet
              dropdownPosition={{
                side: 'bottom',
                align: 'center',
              }}
            />
          </div>
          { isWrongChain && status == 'connected'
          ? 
              (<p className={styles.description}>
                Unsupported network, please connect to optimism goerli
              </p>)
          : <div></div>
          }

          {!isPageLoading && status == 'connected' && !isWrongChain ? (
            <div>
              {' '}
              <p className={styles.description}>
                You have {eligible ? 'not yet claimed ' : 'already claimed '}{' '}
                your tokens
              </p>
              {eligible ? (
                <button
                  className={styles.buttonRound}
                  onClick={async () => {
                    if (authorizationUrl)
                      window.location.href = authorizationUrl
                  }}
                >
                  <a className={styles.gradientText0}>Claim</a>
                </button>
              ) : (
                <a className={styles.gradientText2}>Claimed! 🎉 </a>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Home
