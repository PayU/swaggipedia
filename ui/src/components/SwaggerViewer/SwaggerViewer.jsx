import React from 'react'
import SwaggerUI from "swagger-ui-react"

import styles from './style.module.css'
import "swagger-ui-react/swagger-ui.css"
import "./swagger-ui-custom.css"

export default function SwaggerViewer({ swaggerContent }) {
  return (
    <div className={styles.pageWrapper}>
      { swaggerContent &&
        <div className={styles.swaggerViewer}>
          <SwaggerUI spec={JSON.parse(swaggerContent)} />
      </div>
      }
    </div>
  )
}
