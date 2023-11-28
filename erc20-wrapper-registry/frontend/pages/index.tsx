import {
  ConnectWallet,
  useChain,
  useConnectionStatus,
  useContract,
  useContractWrite,
  useSigner,
} from '@thirdweb-dev/react'
import styles from '../styles/Home.module.css'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { CompliantFactoryAbi } from '../abis/CompliantFactory'
import { Circles } from 'react-loader-spinner'
import { ethers } from 'ethers'
import { CompliantERC20Abi } from '../abis/CompliantERC20'
import { ERC20Abi } from '../abis/ERC20'

const Home: NextPage = () => {
  const chain = useChain()
  const status = useConnectionStatus()
  const signer = useSigner()
  const compliantFactoryAddress = '0x94930faD31Eec31f21d406C5c650cc5925822B45'
  const violetIdAddress = '0x2a0988b07C538a097Ad8b693369f6e42991591F5'
  const { contract: compliantFactoryContract, isLoading: isContractLoading } =
    useContract(compliantFactoryAddress, CompliantFactoryAbi)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const [isWrongChain, setIsWrongChain] = useState<boolean>()
  const [tokenInput, setTokenInput] = useState<string>()
  const [nonCompliantERC20, setNonCompliantERC20] = useState<string>()
  const [foundDeployedWrappedErc20, setFoundDeployedWrappedErc20] = useState()
  const [erc20NotWrapped, setErc20NotWrapped] = useState<boolean>(false)
  const [compliantErc20, setCompliantErc20] = useState<any>()
  const [erc20InstanceError, setErc20InstanceError] = useState<string>()
  const [readyToWrap, setReadyToWrap] = useState<boolean>()
  const [erc20ToBeWrapped, setErc20ToBeWrapped] = useState<any>()
  const [wrapTransaction, setWrapTransaction] = useState<string>()
  const {
    mutateAsync,
    isLoading: isWriteLoading,
    error: _error,
  } = useContractWrite(compliantFactoryContract, 'deployCompliantErc')

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
        compliantFactoryAddress,
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
    if (!isContractLoading && !isWriteLoading) {
      setIsPageLoading(false)
    }
  }, [isContractLoading, isWriteLoading])

  useEffect(() => {
    if (wrapTransaction) {
      setIsPageLoading(false);
    }
  }, [wrapTransaction])

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
              <a href="https://docs.violet.co">Violet ID {''}</a>
            </span>
            Compliant Token Wrapper Demo
          </h1>

          <p className={styles.description}>
            Wrap your ERC20 token and make it compliant with{' '}
            <span className={styles.gradientText0}>
              <a>Violet ID</a>
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

          {isPageLoading ? (
            <div>
              <div className={styles.grid}>
                <Circles
                  height="80"
                  width="80"
                  color="#c35ab1"
                  ariaLabel="circles-loading"
                  visible={true}
                />
              </div>
            </div>
          ) : (
            <div>
              {wrapTransaction ? (
                <div>
                  <p className={styles.description}>
                    You have successfully wrapped your token!
                  </p>
                  <div className={styles.connect}>
                    <a
                      className={styles.gradientText3}
                      href={
                        'https://goerli-optimism.etherscan.io/tx/' +
                        wrapTransaction
                      }
                    >
                      Click here to see the transaction!
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  {status == 'connected' &&
                  !isWrongChain &&
                  !isPageLoading &&
                  !nonCompliantERC20 ? (
                    <div>
                      <div>
                        {' '}
                        <p className={styles.description}>
                          Enter the address of an ERC20 token to wrap it
                        </p>
                        <input
                          className={styles.card}
                          onChange={async (inputtedText) => {
                            setTokenInput(inputtedText.target.value)
                          }}
                        />
                      </div>

                      <div>
                        <button
                          className={styles.buttonalt}
                          onClick={async () => {
                            setNonCompliantERC20(tokenInput)
                          }}
                        >
                          <a className={styles.gradientText1}>Set ERC20</a>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {erc20NotWrapped && readyToWrap ? (
                        <div>
                          <div className={styles.connect}>
                            <a className={styles.gradientText3}>
                              Symbol: {erc20ToBeWrapped.symbol}{' '}
                            </a>
                          </div>
                          <div className={styles.connect}>
                            <a className={styles.gradientText3}>
                              Name: {erc20ToBeWrapped.name}{' '}
                            </a>
                          </div>
                          <button
                            className={styles.buttonRound}
                            onClick={async () => {
                              setIsPageLoading(true)
                              mutateAsync({
                                args: [nonCompliantERC20, violetIdAddress],
                              }).then((sentTransaction) => {
                                setWrapTransaction(
                                  sentTransaction.receipt.transactionHash,
                                )
                                console.log(
                                  sentTransaction.receipt.transactionHash,
                                )
                              })
                            }}
                          >
                            <a className={styles.gradientText0}>Wrap</a>
                          </button>
                        </div>
                      ) : (
                        <div>
                          {erc20InstanceError ? (
                            <div>
                              <a className={styles.gradientText2}>
                                This address does not seem to be an ERC20 token
                              </a>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                      {compliantErc20 ? (
                        <div>
                          <div className={styles.connect}>
                            <a className={styles.gradientText2}>
                              Your compliant token is already deployed! 🎉{' '}
                            </a>
                          </div>
                          <div className={styles.connect}>
                            <a
                              className={styles.gradientText3}
                              href={
                                'https://goerli-optimism.etherscan.io/address/' +
                                foundDeployedWrappedErc20
                              }
                            >
                              Deployed at: {foundDeployedWrappedErc20}{' '}
                            </a>
                          </div>
                          <div className={styles.connect}>
                            <a className={styles.gradientText3}>
                              Symbol: {compliantErc20.symbol}{' '}
                            </a>
                          </div>
                          <div className={styles.connect}>
                            <a className={styles.gradientText3}>
                              Name: {compliantErc20.name}{' '}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.grid}></div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Home
