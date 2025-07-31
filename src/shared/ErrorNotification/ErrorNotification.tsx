import React, {useEffect} from 'react'
import styles from './ErrorNotification.module.css'

type Props = {
  message: string
  onClose: () => void
}

const ErrorNotification: React.FC<Props> = ({message, onClose}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000) // автоисчезновение через 5 сек
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={styles.notification}>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>
        ✖
      </button>
    </div>
  )
}

export default ErrorNotification
