/**
 * Structure
 * ------------------------
 * Imports
 *  - React
 *  - State Management(Redux)
 *  - Repositories
 *  - Context
 * Component
 *  - State Management(Redux)
 *  - Hooks
 *  - State Management(Local)
 *  - Functions
 *  - return
 * Export
 */


// Imports React
import { useState, useContext, useEffect } from 'react';

// Imports Redux
import { useSelector, useDispatch } from 'react-redux';

// Imports Repositories
import syncRepository from 'repositories/api/syncRepository';
import repositoryDiagnostico from 'repositories/local/diagnostico/repository';
import repositoryVisita from 'repositories/local/visita/repository';
import repositoryPrograma from 'repositories/local/programa/repository';
import repositoryCasoVisita from 'repositories/local/caso_visita/repository';
import repositoryCaso from 'repositories/local/caso/repository';
import repositoryServicio from 'repositories/local/servicio/repository';

function useCargarCaso(caso_id = false) {

  /*=======================================================
    BLOQUE: REDUX-PERSIST
    DESCRIPTION: 
  =========================================================*/
  const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
  const dispatch = useDispatch();

  const saveUserData = (json) => {
    dispatch({ type: 'SET_USER_DATA', payload: json });
  };

  const getUserData = () => {
    dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
  };

  /*====================FIN BLOQUE: REDUX-PERSIST ==============*/


  // Component States Management(Local)

  const [times, setTimes] = useState({ 'caso': 300000 })


  // Component Functions

  const loadCasoPromise = async () => {
    if (caso_id == '') return;
    const codigo = 4, tabla = 'caso', setTime = setTimes, time = times[tabla]


    return new Promise(async (resolve, reject) => {

      try {
        const casosNoSincronizados = await repositoryCaso.unsynchronizedCase(caso_id)


        if (casosNoSincronizados.length != 0) {
          // List of uuids of unsynchronized cases
          const uuids = casosNoSincronizados.map(objeto => objeto.ID);

          const listaCasos = { casosNoSincronizados: casosNoSincronizados, uuids: uuids }
          const formDataMerge = await getDataMerge(listaCasos)
          try {
            await syncCloud(formDataMerge) // sincroniza con la nube
          } catch (err) {
            //await repositoryCaso.markAsErrorSynchronized(listaCasos)
            if (err.code != 'ERR_NETWORK') {
              for (const uuid of uuids) {
                await repositoryCaso.setAsUnSynchronized(uuid) // colocar en estado 1
                const casoNoSincronizado = await repositoryCaso.unsynchronizedCase(uuid)
                const uuids = casosNoSincronizados.map(objeto => objeto.ID);

                const caso = { casosNoSincronizados: casosNoSincronizados, uuids: uuids }
                const formDataMerge = await getDataMerge(caso)
                try {
                  await syncCloud(formDataMerge)
                } catch (err) {
                  await repositoryCaso.markAsErrorSynchronized(caso)
                }

              }
              reject(err)
            }


          }
          resolve(true)
        } else {
          console.error('loadCaso fail 699d355d-15f8-4c54-b900-cad9c08b67a9', casosNoSincronizados);
          reject(false)
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
        }
        console.error('Error fetching data: e8ed6720-8a86-463e-88a1-de1eda9254a4', error);
        reject(error)
      }


    });



    // This block of code (fetchData and setInterval) is intentionally commented out.
    // It was part of a previous implementation for automatic synchronization using intervals within the loadCaso function.
    // It is being kept for potential future reference or re-activation if interval-based synchronization is reintroduced.
    // Llamar a la función de inmediato
    // fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    // const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }


  /**
   * Obtener lista de casos no sincronizados
   */
  const loadCaso = async () => {
    if (caso_id == '') return;
    const codigo = 4, tabla = 'caso', setTime = setTimes, time = times[tabla]


    const fetchData = async (synctable_ID) => {
      try {
        const casosNoSincronizados = await repositoryCaso.unsynchronizedCases(caso_id)

        if (casosNoSincronizados.length != 0) {
          const uuids = casosNoSincronizados.map(objeto => objeto.ID);

          const listaCasos = { casosNoSincronizados: casosNoSincronizados, uuids: uuids }
          const formDataMerge = await getDataMerge(listaCasos)
          try {
            await syncCloud(formDataMerge) // sincroniza con la nube
          } catch (err) {
            if (err.code != 'ERR_NETWORK') {
              for (const uuid of uuids) {
                await repositoryCaso.setAsUnSynchronized(uuid) // colocar en estado 1
                const casoNoSincronizado = await repositoryCaso.unsynchronizedCase(uuid)
                const uuids = casosNoSincronizados.map(objeto => objeto.ID);

                const caso = { casosNoSincronizados: casosNoSincronizados, uuids: uuids }
                const formDataMerge = await getDataMerge(caso)
                try {
                  await syncCloud(formDataMerge)
                } catch (err) {
                  await repositoryCaso.markAsErrorSynchronized(caso)
                }

              }
            }
            console.warn('Error sincronizando caso: 955a6aa9-67b4-4877-af02-6fbd43b401f4', err)

          }
        } else {
          //console.log('loadCaso fail 699d355d-15f8-4c54-b900-cad9c08b67a9', casosNoSincronizados);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
        }
        console.error('Error fetching data: 70983d04-a730-4b3c-963d-e07872845b27', error);
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }


  const loadCasos = async () => {
    const codigo = 4, tabla = 'caso', setTime = setTimes, time = times[tabla]

    return new Promise(async (resolve, reject) => {
      try {
        const casosNoSincronizados = await repositoryCaso.unsynchronizedCases()

        //console.log('casosNoSincronizados: f9bee5eb-9ef5-434c-9598-fe7c54437074', casosNoSincronizados,caso_id);

        if (casosNoSincronizados.length != 0) {
          //console.log('loadCaso a880314f-5d74-460b-aacd-bfbd00ba7e57', casosNoSincronizados); 
          const uuids = casosNoSincronizados.map(objeto => objeto.ID);

          const listaCasos = { casosNoSincronizados: casosNoSincronizados, uuids: uuids }
          const formDataMerge = await getDataMerge(listaCasos)
          await syncCloud(formDataMerge)
          resolve(true)
        } else {
          console.error('loadCaso fail 3ba8b4c2-fa61-45ee-b29c-ce8e22e4f350', casosNoSincronizados);
          reject(false)
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
        }
        console.error('Error fetching data: 6263ae81-e343-439a-82db-2a2e496b2fda', error);
        reject(error)
      }

    });

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }

  /**
   * Cargar datos hacia medio de datos enviado por repositorio de datos.
   * @param {*} formDataMerge 
   * @returns 
   */
  const syncCloud = async (formDataMerge) => {
    return new Promise(async (resolve, reject) => {
      const fetchData = async (retries = 3, delay = 500) => {
        let attempts = 0;

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        while (attempts < retries) {
          try {

            const data = await syncRepository.syncLocalCasesWithCloud(formDataMerge)
            for (const uuid of Object.keys(data)) {
              repositoryCaso.setAsSynchronized(uuid);
            }

            resolve(data)

            attempts = retries + 1

          } catch (error) {
            attempts++;
            console.warn(`Intento ${attempts} fallido.`, error.message);

            if (attempts >= retries) {
              //throw error; // Propaga el error después de agotar los intentos
              reject(error)
            }
            await wait(delay); // Espera antes del siguiente intento
          }
        }

      }


      fetchData(5, 500)
    })
  }


  /**
   * Obtiene los datos de los casos, diagnosticos, programas y visitas
   * @param {object} listaCasos objeto con la lista de casos y sus identificadores
   * @returns 
   */
  const getDataMerge = (listaCasos) => {
    return new Promise(async (resolve, reject) => {
      try {

        const diagnosticos = await repositoryDiagnostico.findByListCaseIds(listaCasos.uuids)

        const programas = await repositoryPrograma.findByListCaseIds(listaCasos.uuids)

        const visitas = await repositoryVisita.findByListCaseIds(listaCasos.uuids)

        const caso_visitas = await repositoryCasoVisita.findByListCaseIds(listaCasos.uuids)

        const servicios = await repositoryServicio.findByListCaseIds(listaCasos.uuids)


        resolve({
          casos: listaCasos.casosNoSincronizados,
          diagnosticos: diagnosticos,
          programas: programas,
          visitas: visitas,
          caso_visitas: caso_visitas,
          servicios: servicios
        })

      } catch (err) {
        console.warn('bdd2c366-e099-4a5c-bc71-d2aa7e3de3ac', err)
        reject(err)
      }
    });
  }



  return { loadCaso, loadCasos, loadCasoPromise }

}

export default useCargarCaso


