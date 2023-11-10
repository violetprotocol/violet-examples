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
  // The verified airdrop address in optimismGoerli
  const verifiedAirdropAddress = '0xae44841b3634D5DEAba372f5Fb822582817ea556'
  const [packedTxData, setPackedTxData] = useState<string>('')
  const [functionSignature, setFunctionSignature] = useState<string>('')
  /** State that keeps track if user already claimed the airdrop */
  const [eligible, setEligible] = useState<boolean>()
  const [authorizationUrl, setAuthorizationUrl] = useState<string>()
  const [isPageLoading, setPageLoading] = useState<boolean>(true)
  const [isWrongChain, setIsWrongChain] = useState<boolean>()

  /**
   * Instantiate the contract
   * Get function signature hash
   * call packParameters from violet-sdk to generate txData
   * */
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

  /**
   * Aux hook to make sure user connected in optimismGoerli
   * */
  useEffect(() => {
    if (chain?.chainId == 420) {
      setIsWrongChain(false)
    } else {
      setIsWrongChain(true)
    }
  }, [chain])

  /**
   * Use Txdata generated previously from state
   * Build authorization url using buildAuthorizationUrl from violet-sdk
   * */
  useEffect(() => {
    if (address && chain?.chainId == 420) {
      const builtAuthorizationUrl = buildAuthorizationUrl({
        // Add your own violet client-id that you received from our support
        clientId:
          '145fdfe2afe99aec46a2d73a55ddf25508f336488b5897fdb81d9318b1839f24',
        apiUrl: 'https://sandbox.violet.co',
        // Add your callback URL
        redirectUrl:
          'https://eat-airdrop-demo.violet.co/callback',
        transaction: {
          data: packedTxData,
          functionSignature: functionSignature,
          targetContract: verifiedAirdropAddress,
        },
        address: address,
        chainId: chain.chainId,
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
          {isWrongChain && status == 'connected' ? (
            <p className={styles.description}>
              Unsupported network, please connect to optimism goerli
            </p>
          ) : (
            <div></div>
          )}

          {!isPageLoading && status == 'connected' && !isWrongChain ? (
            <div>
              {' '}
              <p className={styles.description}>
                You have {eligible ? 'not yet claimed ' : 'already claimed '}{' '}
                your tokens
              </p>
              {eligible ? (
                /**
                 * Redirect user to violet authorization url
                 * Violet will then redirect the user to your callback page
                 * */
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
