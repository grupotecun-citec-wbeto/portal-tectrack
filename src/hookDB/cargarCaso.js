import { useState,useContext,useEffect } from 'react';
import SqlContext from 'sqlContext';
import axios from 'axios';
//redux
import { useSelector, useDispatch } from 'react-redux';

function useCargarCaso(caso_id) {
  
  
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


  const[startLoad,setStartLoad] = useState(false)
  
  const {db,rehidratarDb,saveToIndexedDB} = useContext(SqlContext)
  
  const [formData, setFormData] = useState([]);
  const [times,setTimes] = useState({'caso':300000})
  const [dataCasoSync,setDataCasoSync] = useState({})
  const [formDatadiagnosticos,setFormDataDiagnosticos] = useState({})
  const [formDataProgramas,setFormDataProgramas] = useState({})
  const [formDataVisitas,setFormDataVisitas] = useState({})
  const [formDataCasoVisitas,setFormDataCasoVisitas] = useState({})
  const [listaCasos,setListaCasos] = useState([])



  // Rehidratar la base de dato
  useEffect( () =>{
    if(!db) rehidratarDb()
  },[db,rehidratarDb])

  /**
   * Obtener lista de casos no sincronizados
   */
  const loadCaso = async() =>{
    
    
    if(caso_id == '') return;
    const codigo = 4, tabla = 'caso', setTime = setTimes, time = times[tabla]
    
    const fetchData = async (synctable_ID) => {
      if(db != null){
        rehidratarDb()
        try {
          const query = `SELECT
              ID,
              usuario_ID,
              usuario_ID_assigned,
              comunicacion_ID,
              segmento_ID,
              caso_estado_ID,
              fecha,
              start,
              date_end,
              description,
              prioridad,
              uuid,
              equipos
            FROM 
              caso_v2 
            WHERE 
              length(ID) = 36
              AND ID LIKE '%${caso_id}%'
              AND syncStatus = 1
              `
          const casosNoSincronizados = db.exec(query).toArray()


            // syncStatus = 0 AND 
            
          if(casosNoSincronizados.length != 0){   
            setFormData(casosNoSincronizados)
            const uuids = casosNoSincronizados.map(objeto => objeto.ID);
            setListaCasos(uuids)
          }
              
            
          //const json = JSON.parse(response.data)
          //const insertar = `INSERT OR REPLACE INTO ${tabla} (ID,catalogo_ID,serie,serie_extra,chasis,proyecto_ID,departamento_crudo,departamento_code,estatus_maquinaria_ID,cliente_ID,estado_maquinaria_ID,codigo_finca,contrato,serial_modem_telemetria_pcm,serial_modem_telemetria_am53,fecha_inicio_afs_connect,fecha_vencimiento_afs_connect,fecha_vencimiento_file_transfer,modem_activo,img,unidad_negocio_ID,propietario_ID,departamento_negocio_ID,supervisor_ID,modelo_variante_ID,tiene_telemetria) VALUES ${values};`
          //db.run(insertar)
          // imporante simpres salvar en en indexdb
          //await saveToIndexedDB(db);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            //const prevTime = time[tabla]
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data: 70983d04-a730-4b3c-963d-e07872845b27', error);
        }
        
      }else{
        console.log('cadb0a6c-385b-4caf-89e5-f79ed4b6fc27');
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }


  /**
   * Cargar Casos hacia MYSQL
   */
  useEffect( () =>{
    if (formData.length == 0) return;
    //if (formDatadiagnosticos.length == 0) return;
    //if (formDataProgramas.length == 0) return;
    //if (formDataVisitas.length == 0) return;
    //if (formDataCasoVisitas.length == 0) return;

    const fetchData = async(url,retries = 3,delay = 500) =>{
      let attempts = 0;

      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      while (attempts < retries) {
        try{  
          const formDataMerge = {
            "casos":formData,
            "diagnosticos":(formDatadiagnosticos.length != 0) ? formDatadiagnosticos : {},
            "programas": (formDataProgramas.length != 0) ? formDataProgramas : {} ,
            "visitas": (formDataVisitas.length != 0) ? formDataVisitas : {} ,
            "caso_visitas":(formDataCasoVisitas.length != 0) ? formDataCasoVisitas : {}
          };
          
          const response = await axios.post(url, formDataMerge);
          const data = response.data
          setDataCasoSync(data)
          Object.keys(data).map( (uuid) => {
            db.run(`UPDATE caso_v2 SET syncStatus = 0 WHERE ID = '${uuid}'`);
          })
    
          // recordar de activar este procedimiento
          saveToIndexedDB(db);

          attempts = retries + 1
          
        } catch (error) {
          attempts++;
          console.warn(`Intento ${attempts} fallido.`, error.message);

          if (attempts >= retries) {
              //throw error; // Propaga el error después de agotar los intentos
          }
          await wait(delay); // Espera antes del siguiente intento
        }
      }
  
    }

    
    fetchData(`${process.env.REACT_APP_API_URL}/api/v1/cargar/casos`,5,500)
    
    
    
    
  },[formDataCasoVisitas])

  // Obtner la lista diagnosticos segun la lista de casos sincronizados
  useEffect( () =>{
    if (!db) return;
    if( Object.keys(listaCasos).length == 0) return;

    const fetchData = async() => {
    
      try{
        const uuids = listaCasos.map(key => `'${key}'`).join(",")
        const diagnosticos = db.exec(`
          SELECT
            D.equipo_ID,
            D.caso_ID,
            D.diagnostico_tipo_ID,
            D.asistencia_tipo_ID,
            CASE 
              WHEN D.especialista_ID <> 0 THEN D.especialista_ID 
              ELSE NULL 
            END AS especialista_ID,
            D.description
          FROM 
            caso_v2 C
            INNER JOIN diagnostico_v2 D ON D.caso_ID = C.ID
          WHERE
            C.ID IN (${uuids})
          
          `).toArray()
          setFormDataDiagnosticos(diagnosticos)

          
          const programas = db.exec(`
            SELECT
              P.asistencia_tipo_ID,
              P.caso_ID,
              P.catalogo_ID,
              P.prioridad,
              P.name,
              P.type
            FROM 
              caso_v2 C
              INNER JOIN programa_v2 P ON P.caso_ID = C.ID
            WHERE
              C.ID IN (${uuids})
            
            `).toArray()
          setFormDataProgramas(programas)

          const visitas = db.exec(`
            SELECT
              V.ID,
              V.vehiculo_ID,
              V.usuario_ID,
              V.fecha,
              V.programming_date,
              V.descripcion_motivo,
              V.realization_date,
              V.confirmation_date,
              V.km_inicial,
              V.km_final
            FROM 
              caso_v2 C
              INNER JOIN caso_visita_v2 CV ON CV.caso_ID = C.ID
              INNER JOIN visita_v2 V ON V.ID = CV.visita_ID
            WHERE
              C.ID IN (${uuids})
            
            `).toArray()
          setFormDataVisitas(visitas)

          const casoVisitas = db.exec(`
            SELECT
              CV.caso_ID,
              CV.visita_ID
            FROM 
              caso_v2 C
              INNER JOIN caso_visita_v2 CV ON CV.caso_ID = C.ID
            WHERE
              C.ID IN (${uuids})
            
            `).toArray()
          setFormDataCasoVisitas(casoVisitas)

          /** caso_ID CHAR(36) NOT NULL,
        visita_ID CHAR(36) NOT NULL, */

    
      
      }catch(err){
        console.warn('bdd2c366-e099-4a5c-bc71-d2aa7e3de3ac',err)
      }
    }

    fetchData()

    return () => {}
    
  },[db,listaCasos]) //dataCasoSync

  /*useEffect( () =>{
    const fetchData = async(url,retries = 3,delay = 100) =>{
      let attempts = 0;

      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      while (attempts < retries) {
        try{  
          
          const response = await axios.post(url, formDatadiagnosticos);
          console.log('794a3d28-ac84-4675-9a50-4476ad2f6767',response);
          // recordar de activar este procedimiento
          //saveToIndexedDB(db);
          attempts = retries + 1
          
        } catch (error) {
          attempts++;
          console.warn(`Intento ${attempts} fallido.`, error.message);

          if (attempts >= retries) {
              //throw error; // Propaga el error después de agotar los intentos
          }
          await wait(delay); // Espera antes del siguiente intento
        }
      }
  
    }

    if(Object.keys(formDatadiagnosticos).length > 0){
      //fetchData(`${process.env.REACT_APP_API_URL}/api/v1/cargar/diagnosticos`,5,100)
    }
    
    
    
  },[formDatadiagnosticos])*/

  return {loadCaso}

}

export default useCargarCaso



/**
 * 
 * const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Lógica para enviar el formulario
    console.log(values);
  };
 */