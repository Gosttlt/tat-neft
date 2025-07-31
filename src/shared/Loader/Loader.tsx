import styles from './Loader.module.css'
import type {LoaderComponentType} from './Loader.types'

const Loader: LoaderComponentType = props => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <span className={styles.text}>Загрузка...</span>
    </div>
  )
}

export default Loader
