import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty'
import SideBar from './components/SideBar/SideBar';
import SwaggerPanel from './components/SwaggerPanel/SwaggerPanel';
import SwaggersApi from './apis/SwaggersApi';

import styles from './App.module.css';
import EmptyPage from './components/EmptyPage/EmptyPage';

import 'tippy.js/dist/tippy.css';

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [swaggersMap, setSwaggersMap] = useState({})
  const [selectedSwagger, setSelectedSwagger] = useState()
  const [swaggerContentMap, setSwaggerContentMap] = useState({})

  useEffect(() => {
    async function fetchAllSwaggers() {
      setIsLoading(true);

      const fetchedSwaggers = await SwaggersApi.fetchSwaggers() || {};
      setSwaggersMap(fetchedSwaggers);

      const initialSelectedSwagger = fetchedSwaggers[Object.keys(fetchedSwaggers)[0]];
      setSelectedSwagger(initialSelectedSwagger);

      setIsLoading(false);
    }

    fetchAllSwaggers();
  }, [])

  useEffect(() => {
    async function fetSelectedSwaggerContent() {
      const swaggerContent = await SwaggersApi.fetchSwaggerContent(selectedSwagger.id)
      setSwaggerContentMap({
        ...swaggerContentMap,
        [selectedSwagger.id]: swaggerContent.file_content
      })
    }

    if (selectedSwagger?.id && !swaggerContentMap[selectedSwagger.id]) {
      fetSelectedSwaggerContent();
    }
  }, [selectedSwagger, swaggerContentMap])

  return (
    <div className={styles.app}>
      <SideBar
        swaggersMap={swaggersMap}
        selectedSwagger={selectedSwagger}
        onSwaggerSelected={setSelectedSwagger}
      />
      {(isLoading || (!isLoading && isEmpty(swaggersMap))) ?
        <EmptyPage isLoading={isLoading} /> :
        <SwaggerPanel
          swaggerContent={swaggerContentMap[selectedSwagger.id]}
          selectedSwagger={selectedSwagger}
          onSwaggerUpdated={(updatedSwagger) => {
            const updatedSwaggersMap = {
              ...swaggersMap,
              [updatedSwagger.id]: updatedSwagger
            }
            setSwaggersMap(updatedSwaggersMap)
            setSelectedSwagger(updatedSwagger)
          }}
        />
      }
    </div>
  )
}

export default App;