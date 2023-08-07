import React from 'react'
import emptyBoxImage from './assets/empty_box.png'

import styles from './style.module.css'
import Loader from '../Loader/Loader'

export default function EmptyPage({ isLoading }) {
  return (
    <div className={styles.emptyPage}>
      {isLoading ?
        <Loader /> :
        <div className={styles.noResults}>
          <img src={emptyBoxImage} height={150} alt='no results' />
          <div className={styles.title}>No results</div>
          <p className={styles.info}>Use the Swaggipedia API to add swaggers to your database</p>
        </div>
      }
    </div>
  )
}
