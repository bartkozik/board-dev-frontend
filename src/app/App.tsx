import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useEffect } from 'react';
import RootStoreContext, { rootStore } from '@/RootStore';
import { saveDeviceId } from '@/api';
import Toasts from '@/toasts';
import Router from './routes/Router';

function App(): JSX.Element {
  useEffect(() => {
    saveDeviceId();
  }, []);

  return (
    <MantineProvider>
      <RootStoreContext.Provider value={rootStore}>
        <Router />
        <Toasts />
      </RootStoreContext.Provider>
    </MantineProvider>
  );
}

export default App;
