import styles from '../styles/Home.module.css'
import { FC } from 'react'

interface ERC20InputProps {
  setTokenInput: (value: string) => void
  setNonCompliantERC20: (value: string) => void
  tokenInput: string | undefined
}

export const ERC20Input: FC<ERC20InputProps> = ({
  setTokenInput,
  setNonCompliantERC20,
  tokenInput,
}: ERC20InputProps) => {
  return (
    <div>
      <div>
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
            tokenInput ? setNonCompliantERC20(tokenInput) : null
          }}
        >
          <a className={styles.gradientText1}>Set ERC20</a>
        </button>
      </div>
    </div>
  )
}
