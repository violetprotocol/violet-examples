import { useNetwork } from '@thirdweb-dev/react'
import styles from '../styles/Home.module.css'

export const UnsupportedNetwork = () => {
  const [, switchNetwork] = useNetwork()

  return (
    <p className={styles.description}>
      Unsupported network, please{' '}
      <span
        className={styles.switchNetwork}
        onClick={() => switchNetwork?.(420)}
      >
        connect to Optimism Goerli (420)
      </span>
    </p>
  )
}
