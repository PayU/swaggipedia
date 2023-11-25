import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import Tippy from '@tippyjs/react';
import classNames from 'classnames'
import FontAwesome from '../FontAwesome'
import logo from './assets/swaggipedia_new.png'

import styles from './style.module.css'

export default function SideBar({ swaggersMap, selectedSwagger, onSwaggerSelected }) {
  const [filteredSwaggerList, setFilteredSwaggerList] = useState([])
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setFilteredSwaggerList(Object.values(swaggersMap))
  }, [swaggersMap])

  useEffect(() => {
    const filteredSwaggers = Object.values(swaggersMap).filter(swagger => {
      let isMatch = swagger.title.toLowerCase().includes(searchValue.toLowerCase());

      if (searchValue.length > 0 && !isMatch) {
        const alias = (swagger.aliases.find(alias => alias.toLowerCase().includes(searchValue.toLowerCase())))

        if (alias) {
          isMatch = true;
          swagger.alias = alias;
        }
      }

      return isMatch;
    })

    setFilteredSwaggerList(filteredSwaggers);
  }, [swaggersMap, searchValue])

  const disabled = isEmpty(swaggersMap);

  return (
    <div className={styles.sideBar}>
      {/* Banner */}
      <div className={styles.banner}>
        <img src={logo} alt='logo' height={58} />
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
          filteredSwaggerList.map((swagger) => (
            <Tippy disabled={swagger.title.length < 26} content={swagger.title || ''} delay={500}>
              <div
                key={swagger.id}
                className={classNames(styles.swagger, { [styles.selectedSwagger]: selectedSwagger.title === swagger.title })}
                onClick={() => onSwaggerSelected(swaggersMap[swagger.id])}
              >
                {(searchValue.length && swagger.alias) ? <span className={styles.alias}>{`[@${swagger.alias}]`}</span> : null}
                <span>{swagger.title}</span>

              </div>
            </Tippy>
          ))
        }
      </div>
    </div >
  )
}
