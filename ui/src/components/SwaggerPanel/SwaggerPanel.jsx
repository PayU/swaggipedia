import React from 'react'
import SwaggerUI from "swagger-ui-react"
import classnames from 'classnames'
import FontAwesome from '../FontAwesome'
import NavController from '../NavController/NavController'

import "swagger-ui-react/swagger-ui.css"
import "./swagger-ui-custom.css"
import styles from './style.module.css'
import SwaggersApi from '../../apis/SwaggersApi'

export default function SwaggerPanel({ swaggerContent, selectedSwagger, onSwaggerUpdated }) {
  return (
    <div className={styles.pageWrapper}>

      <nav className={styles.swaggerNav}>
        <div className={styles.swaggerNavLinkers}>

          {selectedSwagger.file_source_path &&
            <a
              className={classnames(styles.linker, styles.code)}
              href={`${selectedSwagger.repository_url}/${selectedSwagger.file_source_path}`}
              target='_blank' rel="noreferrer"
            >
              <div className={styles.icon}>
                <FontAwesome icon='code' />
              </div>
              <span>Source</span>
            </a>
          }

          <a
            className={classnames(styles.linker, styles.repo)}
            href={selectedSwagger.repository_url}
            target='_blank' rel="noreferrer"
          >
            <FontAwesome icon='github' />
            <span>{selectedSwagger.repository_url}</span>
          </a>
        </div>

        <div className={styles.swaggerNavControllers}>
          <NavController
            icon='at'
            tooltip='add alias to this swagger'
            placeholder='Swagger aliases'
            defaultValue={selectedSwagger.aliases.join(';')}
            enableEmptyValue
            onSaveClick={async (newAliases) => {
              const aliasesAsArray = newAliases.length > 0 ? newAliases.split(';') : []
              const isSucceeded = await SwaggersApi.updateSwagger(selectedSwagger.id, {
                aliases: aliasesAsArray
              })
              if (isSucceeded) {
                onSwaggerUpdated({
                  ...selectedSwagger,
                  aliases: aliasesAsArray
                })
              }
              return isSucceeded
            }}
          />
          <NavController
            icon='pencil'
            tooltip='rename swagger title'
            placeholder='Swagger title'
            defaultValue={selectedSwagger.title}
            onSaveClick={async (newTitle) => {
              const isSucceeded = await SwaggersApi.updateSwagger(selectedSwagger.id, {
                title: newTitle
              })
              if (isSucceeded) {
                onSwaggerUpdated({
                  ...selectedSwagger,
                  title: newTitle
                })
              }
              return isSucceeded
            }}
          />
        </div>
      </nav>

      {swaggerContent &&
        <div className={styles.swaggerViewer}>
          <SwaggerUI spec={JSON.parse(swaggerContent)} />
        </div>
      }
    </div>
  )
}
