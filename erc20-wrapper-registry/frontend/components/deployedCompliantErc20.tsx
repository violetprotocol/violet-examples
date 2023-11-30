import styles from '../styles/Home.module.css'
import { FC } from 'react'

interface DeployedCompliantERC20Props {
  foundDeployedWrappedErc20: string | undefined
  compliantErc20: { name: string; symbol: string }
}

export const DeployedCompliantERC20: FC<DeployedCompliantERC20Props> = ({
  foundDeployedWrappedErc20,
  compliantErc20,
}: DeployedCompliantERC20Props) => {
  return (
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
        <a className={styles.gradientText3}>Symbol: {compliantErc20.symbol} </a>
      </div>
      <div className={styles.connect}>
        <a className={styles.gradientText3}>Name: {compliantErc20.name} </a>
      </div>
    </div>
  )
}
