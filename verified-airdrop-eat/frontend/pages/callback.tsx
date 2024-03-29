import {
  ConnectWallet,
  useChain,
  useConnectionStatus,
  useContract,
  useContractWrite,
} from '@thirdweb-dev/react'
import styles from '../styles/Home.module.css'
import { NextPage } from 'next'
import { VerifiedAirdropAbi } from '../abis/VerifiedAirdrop'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Circles } from 'react-loader-spinner'
import { EAT, parseEncodedEAT } from '@violetprotocol/sdk'

const Home: NextPage = () => {
  const router = useRouter()
  const base64EncodedToken = router?.query?.token
  const chain = useChain()
  const status = useConnectionStatus()
  const verifiedAirdropAddress = '0xae44841b3634D5DEAba372f5Fb822582817ea556'
  const { contract, isLoading } = useContract(
    verifiedAirdropAddress,
    VerifiedAirdropAbi,
  )
  /**
   *  Hook from thirdweb-sdk to call contract functions
   *  You can call your contract that is gated with EAT with any framework
   *  such as wagmi or web3js, just make sure to pass the EAT as argument
   *  to the function.
   *  */
  const {
    mutateAsync,
    isLoading: isWriteLoading,
    error: error,
  } = useContractWrite(contract, 'claimAirdrop')
  /**
   *  State to keep track of our received token
   *  */
  const [ethereumAccessToken, setEthereumAccessToken] =
    useState<EAT>()
  const [txError, setTxError] = useState()
  const [tx, setTx] = useState<string>()

  /**
   *  Decodes the token from base64 into:
   *  {
   *    token: Signature
   *    expiry: number
   *  }
   *  */
  useEffect(() => {
    if (base64EncodedToken) {
      const eat = parseEncodedEAT(base64EncodedToken.toString())
      setEthereumAccessToken(eat)
    }
  }, [base64EncodedToken])

  /**
   *  Hook that uses thirdweb-sdk to send the transaction
   *  in case our token was correctly received, parsed
   *  and is present on the state
   *  */
  useEffect(() => {
    if (
      ethereumAccessToken?.expiry &&
      ethereumAccessToken.signature &&
      !isWriteLoading &&
      !isLoading &&
      !txError &&
      !tx
    ) {
      mutateAsync({
        args: [
          ethereumAccessToken.signature.v,
          ethereumAccessToken.signature.r,
          ethereumAccessToken.signature.s,
          ethereumAccessToken.expiry,
        ],
      })
        .then((sentTransaction) => {
          setTx(sentTransaction.receipt.transactionHash)
        })
        .catch((error) => {
          console.log(error)
          setTxError(error)
        })
    }
  }, [ethereumAccessToken, mutateAsync, isWriteLoading, isLoading, txError, tx])

  if (status === 'connected' && chain?.chainId != 420) {
    return <div>Unsupported network, please connect to Optimism Goerli</div>
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.gradientText0}>
              <a>Violet EAT {''}</a>
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

          {tx ? (
            <a className={styles.gradientText2}>Claimed! 🎉 </a>
          ) : error ? (
            <a className={styles.gradientText3}>Error, please try again </a>
          ) : (
            <div className={styles.grid}>
              <Circles
                height="80"
                width="80"
                color="#c35ab1"
                ariaLabel="circles-loading"
                visible={true}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Home
