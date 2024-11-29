import { useState,useContext,useEffect } from 'react';
import SqlContext from 'sqlContext';
import axios from 'axios';
import { format } from "date-fns";

import {v4 as uuidv4} from 'uuid'

function useTransladoDb() {
  
  const {db,saveToIndexedDB,} = useContext(SqlContext)

  const [casos,setCasos] = useState([])
  const [stateDiagnosticos,setStateDiagnosticos] = useState([])
  const [stateVisitas,setStateVisitas] = useState([])
  const [stateTerminateVisitas,setStateTerminateVisitas] = useState(false)
  const [stateCasoVisitas,setStateCasoVisitas] = useState([])
  const [stateProgramas,setStateProgramas] = useState([])





  /**
   * Obtener lista de casos no sincronizados
   */
  useEffect( () =>{
    if(!db) return;
    const run = async() => {
        const casos = await db.exec(`
            SELECT 
                uuid AS ID,
                usuario_ID,
                comunicacion_ID,
                segmento_ID,
                caso_estado_ID,
                fecha,
                start,
                date_end,
                description,
                prioridad,
                equipos
            FROM caso WHERE length(uuid) = 36 `).toArray()
        
            setCasos(casos)

        const diagnosticos = await db.exec(`
            SELECT 
                D.equipo_ID,
                C.uuid AS caso_ID,
                D.diagnostico_tipo_ID,
                D.asistencia_tipo_ID,
                CASE 
                    WHEN D.especialista_ID <> 0 THEN D.especialista_ID 
                    ELSE NULL 
                END AS especialista_ID,
                D.description
            FROM caso C
            INNER JOIN diagnostico D ON D.caso_ID = C.ID 
        `).toArray()
        setStateDiagnosticos(diagnosticos)
        
        const visitas = await db.exec(`
            SELECT
                ID,
                vehiculo_ID,
                usuario_ID,
                fecha,
                programming_date,
                descripcion_motivo,
                realization_date,
                confirmation_date,
                km_inicial,
                km_final,
                uuid
            FROM 
                visita
        `).toArray()

        setStateVisitas(visitas)
       
        const programas = db.exec(`
            SELECT
                C.uuid AS caso_ID,
                P.asistencia_tipo_ID,
                P.catalogo_ID,
                P.prioridad,
                P.name,
                P.type
            FROM 
                caso C
                INNER JOIN programa P ON P.caso_ID = C.ID
        `).toArray()

        setStateProgramas(programas)
        
       
    }
    run();
    // Limpiar el intervalo cuando el componente se desmonte
    return () => {}
  },[db])


    useEffect( () =>{
        if(!db) return;
        if(stateTerminateVisitas) return;

        const run = async() =>{
            const casoVisitas = db.exec(`
                SELECT
                    C.uuid AS caso_ID,
                    V.uuid AS visita_ID
                FROM
                    caso_visita CV
                    INNER JOIN caso C ON C.ID = CV.caso_ID
                    INNER JOIN visita V ON V.ID = CV.visita_ID 
                    
            `).toArray()

            setStateCasoVisitas(casoVisitas)
        }

        run()

    },[db,stateTerminateVisitas])


    useEffect (() =>{
        if(casos.length == 0) return;
        
        

        
        let values = ``
        casos.forEach((element,index) => {
        
            const coma = (index == 0 ) ? '' : ','
            const fecha = !element.fecha?.includes('null') ? `'${format(element.fecha, 'yyyy-MM-dd')}'` : null;
            const start = !element.start?.includes('null') ? `'${format(element.start, 'yyyy-MM-dd HH:mm:ss')}'` : null;
            const date_end = !element.date_end?.includes('null') ? `'${format(element.date_end, 'yyyy-MM-dd HH:mm:ss')}'` : null;
            const description = !element.description?.includes('null')  ? `'${element.description}'` : `''`;
            values +=  `${coma}(
                '${element.ID}', 
                ${element.usuario_ID},
                ${element.comunicacion_ID},
                ${element.segmento_ID},
                ${element.caso_estado_ID},
                ${fecha},
                ${start},
                ${date_end},
                ${description},
                ${element.prioridad},
                '${element.equipos}'

            )` 
        });

        console.log(values);
        
        
        
        try{
            db.run(`INSERT INTO caso_v2 (ID,usuario_ID,comunicacion_ID,segmento_ID,caso_estado_ID,fecha,start,date_end,description,prioridad,equipos) VALUES ${values}`)
        }catch(err){
            console.error('a98dbff4-9eba-4bdc-97ba-3ab059bdb21a',err)
        }
    },[casos])

    useEffect( () =>{
        if(stateDiagnosticos.length == 0) return;
        
        try{
            let values = ``
            stateDiagnosticos.forEach((element,index) => {
                if(element.equipo_ID <= 404){
                    //const coma = (index == 0 ) ? '' : ','
                    const description = !element.description?.includes('null') ? `'${element.description}'` : `''`;
                    values +=  `,(
                        ${element.equipo_ID}, 
                        '${element.caso_ID}',
                        ${element.diagnostico_tipo_ID},
                        ${element.asistencia_tipo_ID},
                        ${element.especialista_ID},
                        ${description}
                    )` 
                }
            });
            const newValues = values.replace(',','')
            //console.log(newValues);
            
            
            const data = db.run(`INSERT INTO diagnostico_v2 (equipo_ID,caso_ID,diagnostico_tipo_ID,asistencia_tipo_ID,especialista_ID,description) VALUES ${newValues}`)

            //console.log(data);
            

        }catch(err){
            console.error('c2bf1777-1aac-4f96-b0bb-1bb68d6bc8fd',err)
        }
        
        
    },[stateDiagnosticos])
    
    
    
    useEffect( () =>{
        if(stateVisitas.length == 0) return;
        
        const run = async() =>{

        
            try{
                
                
                const values = stateVisitas.reduce( (acc,element) =>{
                    db.run(`UPDATE visita set uuid='${uuidv4()}' WHERE uuid IS NULL AND ID = ${element.ID}`)
                    //db.run(`UPDATE visita set uuid=null`)
                    const fecha = !element.fecha?.includes('null') ? `'${element.fecha}'` : null;
                    const programming_date = !element.programming_date?.includes('null') ? `'${format(element.programming_date, 'yyyy-MM-dd HH:mm:ss')}'` : null;
                    const realization_date = !element.realization_date?.includes('null') ? `'${format(element.realization_date, 'yyyy-MM-dd HH:mm:ss')}'` : null;
                    const confirmation_date = !element.confirmation_date?.includes('null')? `'${format(element.confirmation_date, 'yyyy-MM-dd HH:mm:ss')}'` : null;
                    const descripcion_motivo = !element.descripcion_motivo?.includes('null')? `'${element.descripcion_motivo}'` : `''`;
                    return acc + `,(
                        '${element.uuid}', 
                        ${element.vehiculo_ID},
                        ${element.usuario_ID},
                        ${fecha},
                        ${programming_date},
                        ${descripcion_motivo},
                        ${realization_date},
                        ${confirmation_date},
                        ${element.km_inicial},
                        ${element.km_final}
                    )`
                },'')

                await saveToIndexedDB(db)

                const newValues = values.replace(',','')
                //console.log('5f5b232b-5099-4942-8fff-5d89a287597d',newValues);
                
                const query = `INSERT INTO visita_v2 (ID,vehiculo_ID,usuario_ID,fecha,programming_date,descripcion_motivo,realization_date,confirmation_date,km_inicial,km_final) VALUES ${newValues}`
                console.log('cb318eb7-b203-4fae-a22f-463ed5b4dc3a',query);
                
                const data = db.run(query)
                setStateTerminateVisitas(true) // reportar que ya se termino con visitas
                saveToIndexedDB(db)
                
                

            }catch(err){
                console.error('99136cc9-c3da-4615-b108-c53a96724e8d',err)
            }
        }

        run()
        
        
    },[stateVisitas])
    
    
    
    useEffect( () =>{
        if(stateCasoVisitas.length == 0) return;
        
        const run = async() =>{

        
            try{
                
                
                const values = stateCasoVisitas.reduce( (acc,element) =>{
                    return acc + `,(
                        '${element.caso_ID}', 
                        '${element.visita_ID}'
                    )`
                },'').replace(',','')

                
                const query = `INSERT INTO caso_visita_v2 (caso_ID,visita_ID) VALUES ${values}`
                
                const data = db.run(query)
                saveToIndexedDB(db)
                
                

            }catch(err){
                console.error('2650dcd3-88d4-402f-af1b-ba44f0c3af01',err)
            }
        }

        run()
        
        
    },[stateCasoVisitas])



    useEffect( () =>{
        if(stateProgramas.length == 0) return;
        
        const run = async() =>{

        
            try{

                const values = stateProgramas.reduce( (acc,element) =>{
                    return acc + `,(
                        '${element.caso_ID}', 
                        ${element.asistencia_tipo_ID},
                        ${element.catalogo_ID},
                        ${element.prioridad},
                        '${element.name}',
                        '${element.type}'

                    )`
                },'').replace(',','')

                
                
                const query = `INSERT INTO programa_v2 (caso_ID,asistencia_tipo_ID,catalogo_ID,prioridad,name,type) VALUES ${values}`
                console.log('c6071a02-e6c9-465e-9ed9-e0d94c49db5b',query);
                const data = db.run(query)
                saveToIndexedDB(db)
                
                

            }catch(err){
                console.error('01fc5cd8-879f-4395-9291-c2aa721ee5e0',err)
            }
        }

        run()
        
        
    },[stateProgramas])
    
    
    


  

}

export default useTransladoDb



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