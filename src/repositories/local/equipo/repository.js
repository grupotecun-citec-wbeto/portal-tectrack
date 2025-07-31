/**
 * @package repositories/local/equipo
 * @description Repositorio de la tabla de equipo
 * @author CITEC
 */

const PACKAGE = 'repositories/local/equipo';

import { getDB, persistDatabase } from '../../../db/database';


import repoCatalogo from '../catalogo/repository';
import repoDivision from '../division/repository';
import repoCategoria from '../categoria/repository';
import repoModelo from '../modelo/repository';

const repository = {
    tableCode:16,
    tableName:'equipo',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (ID,catalogo_ID,serie,serie_extra,chasis,proyecto_ID,departamento_crudo,departamento_code,estatus_maquinaria_ID,cliente_ID,estado_maquinaria_ID,codigo_finca,contrato,serial_modem_telemetria_pcm,serial_modem_telemetria_am53,fecha_inicio_afs_connect,fecha_vencimiento_afs_connect,fecha_vencimiento_file_transfer,modem_activo,img,unidad_negocio_ID,propietario_ID,departamento_negocio_ID,supervisor_ID,modelo_variante_ID,tiene_telemetria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        for (const {ID,catalogo_ID,serie,serie_extra,chasis,proyecto_ID,departamento_crudo,departamento_code,estatus_maquinaria_ID,cliente_ID,estado_maquinaria_ID,codigo_finca,contrato,serial_modem_telemetria_pcm,serial_modem_telemetria_am53,fecha_inicio_afs_connect,fecha_vencimiento_afs_connect,fecha_vencimiento_file_transfer,modem_activo,img,unidad_negocio_ID,propietario_ID,departamento_negocio_ID,supervisor_ID,modelo_variante_ID,tiene_telemetria} of json) {
            stmt.run([ID,catalogo_ID,serie,serie_extra,chasis,proyecto_ID,departamento_crudo,departamento_code,estatus_maquinaria_ID,cliente_ID,estado_maquinaria_ID,codigo_finca,contrato,serial_modem_telemetria_pcm,serial_modem_telemetria_am53,fecha_inicio_afs_connect,fecha_vencimiento_afs_connect,fecha_vencimiento_file_transfer,modem_activo,img,unidad_negocio_ID,propietario_ID,departamento_negocio_ID,supervisor_ID,modelo_variante_ID,tiene_telemetria]);
        }
        stmt.free();
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

    search: async(cadena,seleccionados) =>{
        

        const db = getDB();
        const seleccionadosCondition = seleccionados.toUpperCase() !== "ALL" ? `E.ID IN (${seleccionados})` : "1=1";
        const seleccionadosConditionSelect = seleccionados.toUpperCase() !== "ALL" ? ` ,(E.ID IN (${seleccionados})) isSelected` : "";
        const busquedaCondition = cadena.toUpperCase() !== "ALL" 
            ? `(UPPER(serie) LIKE UPPER('%${cadena}%')
            OR UPPER(serie_extra) LIKE UPPER('%${cadena}%')
            OR UPPER(chasis) LIKE UPPER('%${cadena}%')
            OR UPPER(E.codigo_finca) LIKE UPPER('%${cadena}%')
            OR UPPER(P.name) LIKE UPPER('%${cadena}%'))
            OR UPPER(CL.name) LIKE UPPER('%${cadena}%'))`
            : seleccionadosCondition;

        const query = `
            SELECT 
            E.ID,
            CT.name AS categoria_name,
            CT.ID AS categoria_id,
            C.img AS catalogo_img,
            L.name AS linea_name,
            M.name AS modelo_name,
            MR.name AS marca_name,
            D.name AS division_name,
            P.name AS proyecto_name,
            DEPART.subdivision_name,
            CL.name AS cliente_name,
            ESTADO.name AS estado_maquinaria,
            ESTATUS.name AS estatus_maquinaria,
            DEP_NEG.name AS departamento_negocio,
            UNEGOCIO.nombre AS unidad_negocio,
            PROPIETARIO.name AS propietario_name,
            E.contrato,
            E.codigo_finca,
            E.serial_modem_telemetria_pcm,
            E.serial_modem_telemetria_am53,
            E.fecha_inicio_afs_connect,
            E.fecha_vencimiento_afs_connect,
            E.fecha_vencimiento_file_transfer,
            E.modem_activo
            ${seleccionadosConditionSelect}
            FROM equipo E
            INNER JOIN catalogo C ON C.ID = E.catalogo_ID
            INNER JOIN division D ON D.ID = C.division_ID
            INNER JOIN modelo M ON M.ID = C.modelo_id
            INNER JOIN marca MR ON MR.ID = C.marca_ID
            INNER JOIN linea L ON L.ID = C.linea_ID
            INNER JOIN categoria CT ON CT.ID = C.categoria_id
            LEFT JOIN proyecto P ON P.ID = E.proyecto_ID
            LEFT JOIN departamento DEPART ON DEPART.code = E.departamento_code
            LEFT JOIN cliente CL ON CL.ID = E.cliente_ID
            LEFT JOIN estado_maquinaria ESTADO ON ESTADO.ID = E.estado_maquinaria_ID
            LEFT JOIN estatus_maquinaria ESTATUS ON ESTATUS.ID = E.estatus_maquinaria_ID
            LEFT JOIN departamento_negocio DEP_NEG ON DEP_NEG.ID = E.departamento_negocio_ID
            LEFT JOIN unidad_negocio UNEGOCIO ON UNEGOCIO.ID = E.unidad_negocio_ID
            LEFT JOIN cliente PROPIETARIO ON PROPIETARIO.ID = E.propietario_ID
            WHERE ${busquedaCondition};
        `;

        const stmt = db.prepare(query);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
        
    },


    searchList: async(seleccionados) =>{

        const placeholders = seleccionados.map(() => '?').join(',');
        const db = getDB();
        const query = `
            SELECT 
                E.ID,
                E.chasis,
                E.serie, 
                E.serie_extra,
                DV.name AS division_name,
                CTE.name AS categoria_name,
                M.name AS modelo_name,
                CT.business_name 
            FROM ${repository.tableName} E
            INNER JOIN ${repoCatalogo.tableName} CT ON CT.ID = E.catalogo_ID
            INNER JOIN ${repoDivision.tableName} DV ON DV.ID = CT.division_ID
            INNER JOIN ${repoCategoria.tableName} CTE ON CTE.ID = CT.categoria_id
            INNER JOIN ${repoModelo.tableName} M ON M.ID = CT.modelo_ID
            WHERE E.ID IN (${placeholders})
        `;
        const stmt = db.prepare(query);
        stmt.bind(seleccionados);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },

    

    

    

    

}

export default repository;