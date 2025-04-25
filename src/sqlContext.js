// SqlContext.js
import { createContext, useState, useEffect } from 'react';

// Crear el contexto
const SqlContext = createContext();


// Crear el proveedor del contexto
export function SqlProvider({ children }) {
  const [db,setDb] = useState(null);
  const [data, setData] = useState([]);

  /**
   * Convertir la respuesta de base de datos en array
   * @param {*} data 
   * @deprecated
   * @returns array
   */
  const casos_to_json = (data) =>{
    const result = data.map(item => {
      return item.values.map(valueArray => {
          return item.columns.reduce((obj, col, index) => {
              obj[col] = valueArray[index];
              return obj;
          }, {});
      });
    });
    if(data.length != 0)
      return result[0]
    return []
  }

  /**
   * @deprecated 10 abril 2025
   */
  const rehidratarDb = async() =>{
    return false;
    //const storedDb = await loadFromIndexedDB();

    //let db;
    
    //db = new SQL.Database(storedDb); // Cargar base de datos desde IndexedDB
    //extendFunctions(db)
    //setDb(db)
  }

  return (
        <SqlContext.Provider value={{
            data,rehidratarDb
            }}>
            {children}
        </SqlContext.Provider>
  );
}

export default SqlContext;


//setFinSync(true)