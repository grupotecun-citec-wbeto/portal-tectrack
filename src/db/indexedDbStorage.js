const DB_NAME = 'TECTRACK_DB';
const DB_STORE_NAME = 'TECTRACK_STORE';
const DB_KEY = '2c882398-914b-4c16-926f-24ec828ac1b3';
const DB_VERSION = 1;

function upgradeDatabase(db) {
  if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
    db.createObjectStore(DB_STORE_NAME);
  }
}

export async function saveToIndexedDB(data) {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  return new Promise((resolve, reject) => {
    request.onupgradeneeded = () => {
      const db = request.result;
      upgradeDatabase(db);
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(DB_STORE_NAME, 'readwrite');
      tx.objectStore(DB_STORE_NAME).put(data, DB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      /*const getRequest = tx.objectStore(DB_STORE_NAME).get(DB_KEY);
      getRequest.onsuccess = () => {
        console.log('22dc84db-a9fd-47f0-8b32-e6e5afa4268f',getRequest.result);
        console.log('fe53e475-45be-4b16-88f3-575933b73fb8',data);
        if (getRequest.result) {
          const currentData = getRequest.result; // Convert to Uint8Array
          const newData = data;
          // Combina ambos arrays en un solo array
          const combined = [...currentData, ...newData];
           // Usa un Set para eliminar duplicados
          const uniqueSet = new Set(combined);
          const combinedData = new Uint8Array([...uniqueSet]);
          // Guarda el nuevo array combinado en el IndexedDB
          console.log('2592ff02-4099-460b-b836-0fd317913c83',combinedData);
          tx.objectStore(DB_STORE_NAME).put(combinedData, DB_KEY);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        }else{
          tx.objectStore(DB_STORE_NAME).put(data, DB_KEY);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        }
      }
      getRequest.onerror = () => reject(getRequest.error);*/
      
    };
    request.onerror = () => reject(request.error);
  });
}

export async function loadFromIndexedDB() {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  return new Promise((resolve, reject) => {
    request.onupgradeneeded = () => {
      const db = request.result;
      upgradeDatabase(db);
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(DB_STORE_NAME, 'readonly');
      const getRequest = tx.objectStore(DB_STORE_NAME).get(DB_KEY);
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
}
