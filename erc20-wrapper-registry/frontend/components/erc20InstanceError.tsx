import styles from '../styles/Home.module.css'

export const ERC20InstanceError = () => {
  return (
    <div>
      <a className={styles.gradientText2}>
        This address does not seem to be an ERC20 token
      </a>
    </div>
  )
}
