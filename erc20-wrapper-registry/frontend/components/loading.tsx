import styles from '../styles/Home.module.css'

import { Circles } from 'react-loader-spinner'

export const LoadingCircles = () => {
  return (
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
  )
}
