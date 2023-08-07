

import { useEffect, useState } from 'react';
import SideBar from './components/SideBar/SideBar';
import SwaggerViewer from './components/SwaggerViewer/SwaggerViewer';
import SwaggersApi from './apis/SwaggersApi';

import styles from './App.module.css';
import EmptyPage from './components/EmptyPage/EmptyPage';

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [swaggersMap, setSwaggersMap] = useState({})
  const [swaggerTitles, setSwaggerTitles] = useState([])
  const [selectedSwaggerTitle, setSelectedSwaggerTitle] = useState('')

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const fetchedSwaggers = await SwaggersApi.fetchSwaggers() || [];
      setSwaggersMap(fetchedSwaggers);

      const swaggerTitles = Object.keys(fetchedSwaggers);
      setSwaggerTitles(swaggerTitles);
      setSelectedSwaggerTitle(swaggerTitles[0]);

      setIsLoading(false);
    }

    fetchData();
  }, [])

  return (
    <div className={styles.app}>
      <SideBar
        swaggerTitles={swaggerTitles}
        selectedSwaggerTitle={selectedSwaggerTitle}
        onSwaggerSelected={(swaggerTitle) => setSelectedSwaggerTitle(swaggerTitle)}
      />
      {(isLoading || (!isLoading && swaggerTitles.length === 0)) ?
        <EmptyPage isLoading={isLoading} /> :
        <SwaggerViewer swaggerContent={swaggersMap[selectedSwaggerTitle]?.data} />
      }
    </div>
  )
}

export default App;
