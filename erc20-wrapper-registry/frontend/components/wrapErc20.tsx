import { SmartContract, useContractWrite } from '@thirdweb-dev/react'
import styles from '../styles/Home.module.css'
import { FC, useEffect } from 'react'
import { ethers } from 'ethers'

interface WrapERC20Props {
  erc20ToBeWrapped: { name: string; symbol: string }
  compliantFactoryContract: SmartContract<ethers.BaseContract> | undefined
  setIsPageLoading: (loading: boolean) => void
  nonCompliantERC20: string | undefined
  setWrapTransaction: (wrapTransaction: string) => void
}

export const WrapERC20: FC<WrapERC20Props> = ({
  erc20ToBeWrapped,
  compliantFactoryContract,
  setIsPageLoading,
  nonCompliantERC20,
  setWrapTransaction,
}: WrapERC20Props) => {
  // OPTIMISM GOERLI
  const VIOLET_ID_ADDRESS = '0x2a0988b07C538a097Ad8b693369f6e42991591F5'
  const {
    mutateAsync,
    isLoading: isWriteLoading,
    error: _error,
  } = useContractWrite(compliantFactoryContract, 'deployCompliantErc')

  useEffect(() => {
    if (!isWriteLoading) {
      setIsPageLoading(false)
    }
  }, [isWriteLoading, setIsPageLoading])

  return (
    <div>
      <div className={styles.connect}>
        <a className={styles.gradientText3}>
          Symbol: {erc20ToBeWrapped.symbol}{' '}
        </a>
      </div>

      <div className={styles.connect}>
        <a className={styles.gradientText3}>Name: {erc20ToBeWrapped.name} </a>
      </div>

      <button
        className={styles.buttonRound}
        onClick={async () => {
          setIsPageLoading(true)
          mutateAsync({
            args: [nonCompliantERC20, VIOLET_ID_ADDRESS],
          })
            .then((sentTransaction) => {
              setWrapTransaction(sentTransaction.receipt.transactionHash)
              console.log(sentTransaction.receipt.transactionHash)
            })
            .finally(() => {
              setIsPageLoading(false)
            })
        }}
      >
        <a className={styles.gradientText0}>Wrap</a>
      </button>
    </div>
  )
}
