import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import { SocketContextProvider } from './lib/SocketContext';
import { Toaster } from './components/ui/Toaster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
       <SocketContextProvider>
         <App />
       </SocketContextProvider>
    </PersistGate>
     </Provider>
    <Toaster />
  </StrictMode>,
)
