import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import classNames from 'classnames'
import FontAwesome from '../FontAwesome'
import logo from './assets/logo.png'

export default function SideBar({ swaggerTitles, selectedSwaggerTitle, onSwaggerSelected }) {
  const [filteredSwaggerTitles, setFilteredSwaggerTitles] = useState([])
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setFilteredSwaggerTitles(swaggerTitles)
  }, [swaggerTitles])

  useEffect(() => {
    const filteredSwaggerTitles = swaggerTitles.filter(swaggerTitle => {
      return swaggerTitle.toLowerCase().includes(searchValue.toLowerCase())
    })
    setFilteredSwaggerTitles(filteredSwaggerTitles);
  }, [swaggerTitles, searchValue])

  const disabled = swaggerTitles.length === 0;

  return (
    <div className={styles.sideBar}>
      {/* Banner */}
      <div className={styles.banner}>
        <div className={styles.logoPlaceholder}>
          <img src={logo} alt='logo' height={33} />
        </div>
        <div className={styles.text}>Swaggipedia</div>
      </div>

      {/* Search */}
      <div className={styles.swaggerSearch}>
        <div className={classNames(styles.inputWrapper, { [styles['inputWrapper--disabled']]: disabled })}>
          <FontAwesome className={styles.searchIcon} icon='search' />
          <input disabled={disabled} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Search..'></input>
        </div>
      </div>

      {/* Swagger List */}
      <div className={styles.navigation}>
        {
          filteredSwaggerTitles.map((swaggerTitle) => (
            <div
              key={swaggerTitle}
              className={classNames(styles.swagger, { [styles.selectedSwagger]: selectedSwaggerTitle === swaggerTitle })}
              onClick={() => onSwaggerSelected(swaggerTitle)}
            >
              {swaggerTitle}
            </div>
          ))
        }
      </div>
    </div >
  )
}
