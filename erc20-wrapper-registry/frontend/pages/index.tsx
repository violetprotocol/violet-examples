import {
  ConnectWallet,
  useChain,
  useConnectionStatus,
  useContract,
  useSigner,
} from '@thirdweb-dev/react'
import styles from '../styles/Home.module.css'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { CompliantFactoryAbi } from '../abis/CompliantFactory'
import { ethers } from 'ethers'
import { CompliantERC20Abi } from '../abis/CompliantERC20'
import { ERC20Abi } from '../abis/ERC20'
import { LoadingCircles } from '../components/loading'
import { UnsupportedNetwork } from '../components/unsupportedNetwork'
import { SuccessfulWrapTransaction } from '../components/successfulWrapTransaction'
import { ERC20Input } from '../components/erc20Input'
import { WrapERC20 } from '../components/wrapErc20'
import { ERC20InstanceError } from '../components/erc20InstanceError'
import { DeployedCompliantERC20 } from '../components/deployedCompliantErc20'

// OPTIMISM GOERLI
const COMPLIANT_FACTORY_ADDRESS = '0x94930faD31Eec31f21d406C5c650cc5925822B45'

const Home: NextPage = () => {
  const chain = useChain()
  const status = useConnectionStatus()
  const signer = useSigner()
  const { contract: compliantFactoryContract, isLoading: isContractLoading } =
    useContract(COMPLIANT_FACTORY_ADDRESS, CompliantFactoryAbi)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isWrongChain, setIsWrongChain] = useState(false)
  const [tokenInput, setTokenInput] = useState<string>()
  const [nonCompliantERC20, setNonCompliantERC20] = useState<string>()
  const [foundDeployedWrappedErc20, setFoundDeployedWrappedErc20] = useState()
  const [erc20NotWrapped, setErc20NotWrapped] = useState(false)
  const [compliantErc20, setCompliantErc20] = useState<{
    symbol: string
    name: string
  }>()
  const [erc20InstanceError, setErc20InstanceError] = useState<string>()
  const [readyToWrap, setReadyToWrap] = useState(false)
  const [erc20ToBeWrapped, setErc20ToBeWrapped] = useState<{
    symbol: string
    name: string
  }>()
  const [wrapTransaction, setWrapTransaction] = useState<string>()

  useEffect(() => {
    if (foundDeployedWrappedErc20) {
      const compliantErc20 = new ethers.Contract(
        foundDeployedWrappedErc20,
        CompliantERC20Abi,
        signer,
      )

      if (compliantErc20) {
        compliantErc20.callStatic
          .symbol()
          .then((symbol) => {
            compliantErc20.callStatic.name().then((name) => {
              setCompliantErc20({ symbol: symbol, name: name })
            })
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }, [foundDeployedWrappedErc20, signer])

  useEffect(() => {
    if (erc20NotWrapped && nonCompliantERC20 && signer) {
      try {
        const nonCompliantErc20Contract = new ethers.Contract(
          nonCompliantERC20,
          ERC20Abi,
          signer,
        )

        if (nonCompliantErc20Contract) {
          nonCompliantErc20Contract.callStatic
            .name()
            .then((name) => {
              nonCompliantErc20Contract.callStatic.symbol().then((symbol) => {
                setReadyToWrap(true)
                setErc20ToBeWrapped({ name: name, symbol: symbol })
              })
            })
            .catch((error) => {
              console.log(error)
              setErc20InstanceError(error.toString())
            })
        }
      } catch (error) {
        setErc20InstanceError(String(error))
      }
    }
  }, [erc20NotWrapped, signer, nonCompliantERC20])

  useEffect(() => {
    if (
      nonCompliantERC20 &&
      ethers.utils.isAddress(nonCompliantERC20) &&
      signer
    ) {
      const compliantFactory = new ethers.Contract(
        COMPLIANT_FACTORY_ADDRESS,
        CompliantFactoryAbi,
        signer,
      )

      if (compliantFactory) {
        compliantFactory.callStatic
          .erc20ToCompliantWrapped(nonCompliantERC20)
          .then((address) => {
            if (ethers.constants.AddressZero !== address) {
              setFoundDeployedWrappedErc20(address)
            } else {
              setErc20NotWrapped(true)
            }
          })
      }
    }
  }, [nonCompliantERC20, signer])

  useEffect(() => {
    if (!isContractLoading) {
      setIsPageLoading(false)
    }
  }, [isContractLoading])

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

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.gradientText0}>
              <a href="https://docs.violet.co">VioletID </a>
            </span>
            Compliant Token Wrapper Demo
          </h1>

          <p className={styles.description}>
            Make your ERC20 token compliant with{' '}
            <span className={styles.gradientText0}>
              <a>VioletID</a>
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
            <UnsupportedNetwork />
          ) : null}

          {isPageLoading ? <LoadingCircles /> : null}

          {!isPageLoading ? (
            <>
              {wrapTransaction ? (
                <SuccessfulWrapTransaction wrapTransaction={wrapTransaction} />
              ) : (
                <div>
                  {status == 'connected' &&
                  !isWrongChain &&
                  !isPageLoading &&
                  !nonCompliantERC20 ? (
                    <ERC20Input
                      setTokenInput={setTokenInput}
                      setNonCompliantERC20={setNonCompliantERC20}
                      tokenInput={tokenInput}
                    />
                  ) : (
                    <div>
                      {erc20NotWrapped && readyToWrap && erc20ToBeWrapped ? (
                        <WrapERC20
                          erc20ToBeWrapped={erc20ToBeWrapped}
                          compliantFactoryContract={compliantFactoryContract}
                          setIsPageLoading={setIsPageLoading}
                          nonCompliantERC20={nonCompliantERC20}
                          setWrapTransaction={setWrapTransaction}
                        />
                      ) : (
                        <div>
                          {erc20InstanceError ? (
                            <ERC20InstanceError />
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}

                      {compliantErc20 ? (
                        <DeployedCompliantERC20
                          foundDeployedWrappedErc20={foundDeployedWrappedErc20}
                          compliantErc20={compliantErc20}
                        />
                      ) : (
                        <div className={styles.grid}></div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </main>
  )
}

export default Home
