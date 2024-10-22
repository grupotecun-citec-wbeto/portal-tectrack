// store.js
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usaremos localStorage
import caseReducer from './caseReducer';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,  // Usar localStorage
};

// Crear el reducer persistente
const persistedReducer = persistReducer(persistConfig, caseReducer);

// Crear la store
const store = createStore(persistedReducer);

// Crear el persistor
const persistor = persistStore(store);

export { store, persistor };
