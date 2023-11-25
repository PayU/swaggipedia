import React, { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import Tippy from '@tippyjs/react';
import FontAwesome from '../FontAwesome'

import styles from './style.module.css'
import { delay } from '../../common/helpers';

export default function NavController({ icon, tooltip, defaultValue, placeholder, enableEmptyValue, onSaveClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isShowingSuccessIndicator, setIsShowingSuccessIndicator] = useState(false)
  const [isShowingFailureIndicator, setIsShowingFailureIndicator] = useState(false)
  const [inputValue, setInputValue] = useState(defaultValue)
  const inputRef = useRef();

  useEffect(() => {
    setInputValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    // Set focus right after the input is rendered and placed
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200)
    }
  }, [isOpen])

  return (
    <Tippy disabled={isOpen} content={tooltip} delay={500}>
      <div
        className={classnames(styles.navController, {
          [styles['navController--open']]: isOpen,
          [styles['navController--failure']]: isShowingFailureIndicator,
        })}
        onClick={() => { if (!isOpen) { setIsOpen(true) } }}
      >
        {!isOpen ?
          <FontAwesome icon={icon} />
          :
          <div className={styles.openBox}>
            <input
              ref={inputRef}
              placeholder={placeholder}
              value={inputValue}
              className={styles.controllerInput}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div
              className={classnames(styles.saveBtn, {
                [styles['saveBtn--success']]: isShowingSuccessIndicator,
                [styles['saveBtn--disabled']]: (!enableEmptyValue && inputValue.length === 0)
              })}
              onClick={async () => {
                setIsLoading(true);
                await delay(500) // loading animation
                const isSucceeded = await onSaveClick(inputValue)
                setIsLoading(false);

                if (isSucceeded) {
                  setIsShowingFailureIndicator(false)
                  setIsShowingSuccessIndicator(true);
                  setTimeout(() => {
                    setIsShowingSuccessIndicator(false)
                  }, 2500)
                } else {
                  setIsShowingFailureIndicator(true)
                }
              }}>
              {isLoading ?
                <div className={styles.spinner}></div>
                :
                <span className={classnames('material-symbols-outlined', styles.saveBtnIcon)}>done</span>
              }

            </div>
            <span
              className={classnames('material-symbols-outlined', styles.closeBtn)}
              onClick={() => {
                setIsShowingFailureIndicator(false)
                setIsOpen(false)
              }}>
              close
            </span>
          </div>
        }
      </div>
    </Tippy>
  )
}
