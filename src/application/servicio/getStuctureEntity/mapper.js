/**
 * @param {Array<SystemNode>} systems
 * @returns {Array<ServicioORM>} 
 */

export function toORM(systems, caso_id, equipo_id, diagnostico_tipo_id) {
    const result = [];

    /**
     * Recursive function to traverse the tree and accumulate context
     * @param {Array<SystemNode>} nodes 
     * @param {Object} context - Context accumulated from ancestors
     * @param {number|null} context.currentSystemId - The ID of the current system context
     * @param {number|null} context.currentMarcaId - The ID of the current marca context
     */
    const traverse = (nodes, context = { currentSystemId: null, currentMarcaId: null }) => {
        nodes.forEach(node => {
            let newContext = { ...context };

            // Determine node type and update context or push to result
            if (node.key.startsWith("S-")) {
                // It's a SERVICE node
                const serviceId = parseInt(node.key.split("-")[1], 10);

                // Use the accumulated context for this service
                result.push({
                    sistema_ID: newContext.currentSystemId,
                    sistema_servicio_ID: serviceId,
                    diagnostico_equipo_ID: equipo_id,
                    diagnostico_caso_ID: caso_id,
                    diagnostico_diagnostico_tipo_ID: diagnostico_tipo_id,
                    check: node.checked ? 1 : 0,
                    sistema_marca_ID: newContext.currentMarcaId
                });
            } else if (node.key.startsWith("A-")) {
                // It's an AREA node, just pass through context (or reset if needed, but usually areas contain systems)
                // No specific context update needed for Area unless defined
            } else {
                // It's a SYSTEM node (or potentially a MARCA node if structure implies)
                // Update context with this system's ID
                newContext.currentSystemId = parseInt(node.key, 10);

                // If this node has a marcaId, update the context
                if (node.marcaId) {
                    newContext.currentMarcaId = node.marcaId;
                }

                // Also push the system itself as a record (optional, based on previous requirement, but user emphasized services inheriting data)
                // If the user ONLY wants services with inherited data, we might remove this push. 
                // However, the previous prompt asked to also insert systems. 
                // "y que SystemNode.sistemaId del padre un nodo que el key no inicie con "S" ingrese en ServicioORM.sistema_ID"
                // I will keep it but ensure it uses its own data.
                /*result.push({
                    sistema_ID: parseInt(node.key, 10),
                    sistema_servicio_ID: null,
                    diagnostico_equipo_ID: equipo_id,
                    diagnostico_caso_ID: caso_id,
                    diagnostico_diagnostico_tipo_ID: diagnostico_tipo_id,
                    check: node.checked ? 1 : 0,
                    sistema_marca_ID: node.marcaId || newContext.currentMarcaId // Use its own or inherited
                });*/
            }

            // Continue traversal with the UPDATED context
            if (node.children && node.children.length > 0) {
                traverse(node.children, newContext);
            }
        });
    };

    traverse(systems);
    return result;
}