import React, { createContext, useState,useContext, useEffect  } from 'react';
// AXIOS
import axios from 'axios';
import SqlContext from 'sqlContext';
import { Alert } from '@chakra-ui/react';

const DisposalContext = createContext();

const DisposalProvider = ({ children }) => {
    const [deleteQueue, setDeleteQueue] = useState([]);
    const {db,saveToIndexedDB,rehidratarDb} = useContext(SqlContext)
    /*useEffect( () =>{
        rehidratarDb()
    },[])*/

    const processDeleteQueue = async () => {
        if (deleteQueue.length > 0 && db) {
            const itemToDelete = deleteQueue.shift();
            try {
                /*
                equipo_ID INTEGER NOT NULL,
                caso_ID INTEGER NOT NULL,
                */
                let attempts = 0;
                const maxAttempts = 5;
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

                while (attempts < maxAttempts) {
                    try {
                        await axios.delete(`${process.env.REACT_APP_API_URL}${itemToDelete.ruta}`);
                        break; // Exit loop if successful
                    } catch (error) {
                        attempts++;
                        console.error(`Error deleting item from API (attempt ${attempts}):`, error);
                        if (attempts >= maxAttempts) {
                            deleteQueue.push(itemToDelete); // Re-add item to queue if deletion fails
                            setDeleteQueue([...deleteQueue]);
                            //throw error;
                        }
                        await delay(5000); // Wait for 5 seconds before retrying
                    }
                }
                
                // Eliminar en base de datos Sqlite
                db.run(`DELETE FROM ${itemToDelete.table} WHERE equipo_ID = ${itemToDelete.equipo_ID} AND caso_ID = '${itemToDelete.caso_ID}'`);
                saveToIndexedDB(db)
                

                
            } catch (error) {
                console.error('Error deleting item:', error);
                deleteQueue.push(itemToDelete); // Re-add item to queue if deletion fails
                setDeleteQueue([...deleteQueue]);
            }
        }
    };

    useEffect(() => {
        processDeleteQueue();
        //const intervalId = setInterval(processDeleteQueue, 60000); // Process queue every 60 seconds
        //return () => clearInterval(intervalId);
    }, [deleteQueue, db]);

    const addToDeleteQueue = (caso_ID,equipo_ID, table, ruta) => {
        rehidratarDb()
        setDeleteQueue([...deleteQueue, { caso_ID,equipo_ID, table,ruta }]);
    };

    return (
        <DisposalContext.Provider value={{ addToDeleteQueue }}>
            {children}
        </DisposalContext.Provider>
    );
};

export { DisposalContext, DisposalProvider };