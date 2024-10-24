// store.js
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
//import storage from 'redux-persist/lib/storage'; // Usaremos localStorage
import indexedDBStorage from 'redux-persist-indexeddb-storage'; // Adaptador para IndexedDB
import caseReducer from './caseReducer';


// Configuración de Redux-Persist
const persistConfig = {
  key: 'root',
  storage: indexedDBStorage('myAppDB'), // Aquí defines tu IndexedDB
};

// Configuración de persistencia
/*const persistConfig = {
  key: 'root',
  storage,  // Usar localStorage
};*/

// Crear el reducer persistente
const persistedReducer = persistReducer(persistConfig, caseReducer);

// Crear la store
const store = createStore(persistedReducer);

// Crear el persistor
const persistor = persistStore(store);

export { store, persistor };
