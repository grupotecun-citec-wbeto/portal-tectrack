/**
 * @package repositories/local/caso
 * @description Repositorio de la tabla de caso
 * @author CITEC
 */

const PACKAGE = 'repositories/local/caso';

import { getDB, persistDatabase } from '../../../db/database';
import repositoryVisita from '../visita/repository';
import repositoryCasoVisita from '../caso_visita/repository';
import repositoryDiagnostico from '../diagnostico/repository';

const repository = {
    tableCode:4,
    tableName:'caso',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        try{
            const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (ID,syncStatus,caso_estado_ID,comunicacion_ID,date_end,description,equipos,fecha,prioridad,segmento_ID,start,usuario_ID,usuario_ID_assigned,uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

            for (const {ID,caso_estado_ID,comunicacion_ID,date_end,description,equipos,fecha,prioridad,segmento_ID,start,usuario_ID,usuario_ID_assigned,uuid} of json) {
                const syncStatus = 0; // 0 = Sincronizado, 1 = No sincronizado
                stmt.run([ID,syncStatus,caso_estado_ID,comunicacion_ID,date_end,description,equipos,fecha,prioridad,segmento_ID,start,usuario_ID,usuario_ID_assigned,uuid]);
            }
            stmt.free();
        }catch(err){
            console.log(`[${PACKAGE}] Error al crear o reemplazar los datos:`, err);
        }
        
        await persistDatabase();
    },

    create: async (id, name) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT INTO ${repository.tableName} (id, name) VALUES (?, ?)`);

        stmt.run([id, name]);
        stmt.free();
        await persistDatabase();
    },
    
    findAll: () => {
        const db = getDB();
        const stmt = db.prepare(`SELECT * FROM ${repository.tableName}`);
        const results = [];
        while (stmt.step()) {
        results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },
    
    deleteById: async (id) => {
        const db = getDB();
        const stmt = db.prepare(`DELETE FROM ${repository.tableName} WHERE id = ?`);
        stmt.run([id]);
        stmt.free();
        await persistDatabase();
    },

    findById: async (id) => {
        const db = getDB();
        const stmt = db.prepare(`SELECT * FROM ${repository.tableName} WHERE ID = ?`);
        stmt.bind([id]);
        stmt.step()
        const result = stmt.getAsObject()
        stmt.free();
        return result;
    },

    searchForCasesBeingEdited: async () => {
        const db = getDB();
        const stmt = db.prepare(`SELECT ID FROM ${repository.tableName} WHERE syncStatus = ?`);
        const results = [];
        stmt.bind([1])
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },
    findAllByFilters: async (userDataLogin,filters, estado = {operador:"<>", value:"6"}, config = {countOnly:false}) => {
        try{
            const db = getDB();
            let query = ``
            //filtros
            const query_user = (filters.usuarioSelected != '') ? ` AND usuario_ID = ? ` : ''
            const query_prioridad = (filters.prioridadSelected != '') ? ` AND prioridad = ? ` : ''
            const query_segmento = (filters.segmentoSelected != '') ? ` AND segmento_ID = ? ` : ''
            
            // definir si se necesita solo contar
            const query_count = (config.countOnly) ? ` COUNT(*) AS cantidad ` : ` * `

            const estadoFilter = ` ${estado.operador} ? `;

            const parameters = []
            
            if(query_user != ''){
                parameters.push(filters.usuarioSelected)
            }
            if(query_prioridad != ''){
                parameters.push(filters.prioridadSelected)
            }
            if(query_segmento != ''){
                parameters.push(filters.segmentoSelected)
            }

            let results = [];
            
            switch(userDataLogin.perfil_ID){
                case 3: // perfil admin 
                    parameters.unshift(estado.value)   
                    query = `SELECT ${query_count} FROM ${repository.tableName} WHERE 1=1 AND caso_estado_ID ${estadoFilter} ${query_user} ${query_prioridad} ${query_segmento} ORDER BY start DESC`
                break;
                default:
                    
                    parameters.unshift(userDataLogin.ID)
                    parameters.unshift(userDataLogin.ID)
                    parameters.unshift(estado.value)
                    query = `SELECT ${query_count} FROM ${repository.tableName} WHERE 1=1 AND caso_estado_ID ${estadoFilter} AND (usuario_ID = ? OR usuario_ID_assigned =  ? ) ${query_prioridad} ${query_segmento} ORDER BY start DESC`
                break;
            }

            const stmt = db.prepare(query);

            if(config.countOnly) {
                stmt.bind(parameters)
                stmt.step()
                results = stmt.getAsObject()
            }else{
                stmt.bind(parameters)
                while (stmt.step()) {
                    results.push(stmt.getAsObject());
                }
            }
            stmt.free();
            return results;
        }catch(err){
            console.error(`[${PACKAGE}] 3b0570ce-a7e3-4a88-9ef4-8084776ea409 Error al buscar los casos:`, err);
        }

        
    },

    updateStatus: async (id,status) => {
        const db = getDB();
        const stmt = db.prepare(`UPDATE ${repository.tableName} SET caso_estado_ID = ${status}, syncStatus = 1 WHERE id = ?`);
        stmt.run([id]);
        stmt.free();
        await persistDatabase();
    },

    assignTechnician: async (id,technicianID) =>{
        const db = getDB();
        const stmt = db.prepare(`UPDATE ${repository.tableName} SET caso_estado_ID = 2, usuario_ID_assigned = ${technicianID}, syncStatus = 1 WHERE id = ?`);
        stmt.run([id]);
        stmt.free();
        await persistDatabase();
    },

    /**
     * Un Assign Technician
     * @param {interger} id identifier of case
     * 
     * @var {integer} caso_estado_ID 1: Pendiente de asignación 
     */
    unAssignTechnician : async (id) =>{
        const db = getDB();
        const stmt = db.prepare(`UPDATE ${repository.tableName} SET caso_estado_ID = 1, usuario_ID_assigned = NULL WHERE id = ?`);
        stmt.run([id]);
        stmt.free();
        await persistDatabase();
    },

    start: async (id,visita_ID,vehiculo_ID,userLogin,kmInicial) => {
        const db = getDB();
       
        try{
            db.exec("BEGIN TRANSACTION")
            const stmt = db.prepare(`UPDATE ${repository.tableName} SET caso_estado_ID = 3,syncStatus=1 WHERE id = ?`);
            stmt.run([id]);
            stmt.free();

            const stmt2 = db.prepare(`INSERT INTO ${repositoryVisita.tableName} (ID,vehiculo_ID,usuario_ID,km_inicial) VALUES (?, ?, ?, ?)`);
            stmt2.run([visita_ID,vehiculo_ID,userLogin.ID,kmInicial]);
            stmt2.free();

            //INSERT INTO caso_visita_v2 (caso_ID,visita_ID) VALUES ('${id}','${visita_ID}')

            const stmt3 = db.prepare(`INSERT INTO ${repositoryCasoVisita.tableName} (caso_ID,visita_ID) VALUES (?, ?)`);
            stmt3.run([id,visita_ID]);
            stmt3.free();

            db.exec("COMMIT")
            await persistDatabase();
        }catch(error){
            
            console.error(`[${PACKAGE}] 55ef495e-57dc-467e-a0b7-f0c8813f3f4a Error al iniciar el caso:`, error);
            db.exec("ROLLBACK")
        }

        
    },
    
    endCaseWithoutDiagnosis: async (id,kmFinal,currentDateTime) => {
        const db = getDB();
        try{
            db.exec("BEGIN TRANSACTION")
            const stmt = db.prepare(`UPDATE ${repository.tableName} SET caso_estado_ID = 5, date_end = ? ,syncStatus = 1 WHERE id = ?`);
            stmt.run([currentDateTime,id]);
            stmt.free();

            const stmt2 = db.prepare(`UPDATE ${repositoryVisita.tableName} SET km_final = ?  WHERE id = (SELECT visita_ID FROM ${repositoryCasoVisita.tableName} WHERE caso_ID = ? LIMIT 1)`);
            stmt2.run([kmFinal,id]);
            stmt2.free();


            db.exec("COMMIT")
            await persistDatabase();
        }catch(error){
            console.error(`[${PACKAGE}] 1dc96abd-024c-412b-896f-8fcfb0868c8d Error al iniciar el caso:`, error);
            db.exec("ROLLBACK")
        }

        
    },
    
    unsynchronizedCases: async (id) => {
        const db = getDB();
        const stmt = db.prepare( 
            `SELECT
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
                ${repository.tableName} 
            WHERE 
                ID LIKE ?
                AND syncStatus = 1
            `);
        const searchPattern = `%${id}%`;
        stmt.bind([searchPattern])
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },

    setAsSynchronized: async (id) => {
        const db = getDB();
        const stmt = db.prepare(`UPDATE ${repository.tableName} SET syncStatus = 0 WHERE ID = ?`);
        stmt.run([id]);
        stmt.free();
        await persistDatabase();
    }

    

    

}

export default repository;