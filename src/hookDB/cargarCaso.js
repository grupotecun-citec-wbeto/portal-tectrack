import { useState,useContext,useEffect } from 'react';
import SqlContext from 'sqlContext';
import axios from 'axios';

function useCargarCaso(casoRefresh,setCasoRefresh) {
  
  const {db,saveToIndexedDB,} = useContext(SqlContext)
  
  const [formData, setFormData] = useState([]);
  const [times,setTimes] = useState({'caso':300000})
  const [dataCasoSync,setDataCasoSync] = useState({})
  const [formDatadiagnosticos,setFormDataDiagnosticos] = useState({})
  const [formDataProgramas,setFormDataProgramas] = useState({})
  const [formDataVisitas,setFormDataVisitas] = useState({})
  const [listaCasos,setListaCasos] = useState([])




  /**
   * Obtener lista de casos no sincronizados
   */
  useEffect( () =>{
    const codigo = 4, tabla = 'caso', setTime = setTimes, time = times[tabla]

    const fetchData = async (synctable_ID) => {
      if(db != null){
        try {
          const casosNoSincronizados = db.exec(`
            SELECT
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
              caso_v2 WHERE length(ID) = 36
              `).toArray()


            // syncStatus = 0 AND 
            if(Object.keys(formData).length == 0){
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
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db])


  /**
   * Cargar Casos hacia MYSQL
   */
  useEffect( () =>{
    if (formData.length == 0) return;
    if (formDatadiagnosticos.length == 0) return;
    if (formDataProgramas.length == 0) return;
    if (formDataVisitas.length == 0) return;

    const fetchData = async(url,retries = 3,delay = 100) =>{
      let attempts = 0;

      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      while (attempts < retries) {
        try{  
          const formDataMerge = {
            "casos":formData,
            "diagnosticos":formDatadiagnosticos,
            "programas": formDataProgramas,
            "visitas": formDataVisitas
          };
          
          const response = await axios.post(url, formDataMerge);
          const data = response.data
          setDataCasoSync(data)
          Object.keys(data).map( (uuid) => {
            db.run(`UPDATE caso_v2 SET syncStatus = 1 WHERE ID = '${uuid}'`);
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

    
    fetchData(`${process.env.REACT_APP_API_URL}/api/v1/cargar/casos`,5,100)
    
    
    
    
  },[formData,formDatadiagnosticos,formDataProgramas,formDataVisitas])

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

    
      
      }catch(err){
        console.warn('bdd2c366-e099-4a5c-bc71-d2aa7e3de3ac',err)
      }
    }

    fetchData()

    return () => {}
    
  },[db,listaCasos]) //dataCasoSync

  useEffect( () =>{
    const fetchData = async(url,retries = 3,delay = 100) =>{
      let attempts = 0;

      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      while (attempts < retries) {
        try{  
          
          const response = await axios.post(url, formDatadiagnosticos);
          console.log('794a3d28-ac84-4675-9a50-4476ad2f6767',response);
          // recordar de activar este procedimiento
          //saveToIndexedDB(db);
          setCasoRefresh(!casoRefresh)
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
    
    
    
  },[formDatadiagnosticos])

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