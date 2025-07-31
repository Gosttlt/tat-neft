import React from 'react'
import {RangeOption} from '../../types'
import styles from './TemperatureChart.module.css'

type Props = {
  options: RangeOption[]
  selected: RangeOption
  onSelect: (option: RangeOption) => void
}

const RangeSelector: React.FC<Props> = ({options, selected, onSelect}) => {
  return (
    <div className={styles.rangeSelector}>
      {options.map(opt => (
        <button
          key={opt.hours}
          onClick={() => onSelect(opt)}
          className={`${styles.rangeButton} ${
            opt.hours === selected.hours ? styles.active : ''
          }`}
          type='button'
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default RangeSelector
