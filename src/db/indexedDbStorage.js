const DB_NAME = 'TECTRACK_DB';
const DB_STORE_NAME = 'TECTRACK_STORE';
//const DB_KEY = '2c882398-914b-4c16-926f-24ec828ac1b3';
//const DB_KEY = '0b28eecd-1287-4fe3-bc4a-6ff955973df2';
//const DB_KEY = 'c6d70365-edb8-40de-a77e-5937d681705f';
//const DB_KEY = '20927b3b-69e7-4304-b20a-6aa3549bb48a';
//const DB_KEY = '20502aa4-d222-4f6a-89e1-766aaa42cde4';
//const DB_KEY = '809bf071-c330-4453-9e18-f2e87be97150';
//const DB_KEY = '257bb0e7-4359-45e5-aaec-443b4c803111';
//const DB_KEY = 'd22e2fc8-2db2-4ff4-b57b-6f804647f53a';
const DB_KEY = '42be2b71-16e0-4f08-b56a-842bd075c772'
const DB_VERSION = 3;

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
