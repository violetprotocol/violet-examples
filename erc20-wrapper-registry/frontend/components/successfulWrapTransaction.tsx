import styles from '../styles/Home.module.css'
import { FC } from 'react'

interface SuccessfulWrapTransactionProps {
  wrapTransaction: string
}

export const SuccessfulWrapTransaction: FC<SuccessfulWrapTransactionProps> = ({
  wrapTransaction,
}: SuccessfulWrapTransactionProps) => {
  return (
    <div>
      <p className={styles.description}>
        You have successfully wrapped your token!
      </p>
      <div className={styles.connect}>
        <a
          className={styles.gradientText3}
          href={'https://goerli-optimism.etherscan.io/tx/' + wrapTransaction}
        >
          Click here to see the transaction!
        </a>
      </div>
    </div>
  )
}
