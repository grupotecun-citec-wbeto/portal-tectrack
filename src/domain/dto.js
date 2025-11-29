/**
 * @typedef {Object} SistemaDTO
 * @property {number} id - Identificador único del sistema.
 * @property {number} areaId - Identificador del área asociada.
 * @property {number} sistemaId - Identificador del sistema.
 * @property {number} nivel - Nivel del sistema.
 * @property {string} name - Nombre del sistema.
 * @property {string} createdAt - Fecha de creación del registro.
 * @property {string} updatedAt - Fecha de última actualización del registro.
 * @property {Function} [map] - Optional function to iterate over elements (e.g., for arrays or collections).
 */


/**
 * @typedef {Object} SistemaServicioDTO
 * @property {number} id - Primary key of the sistema_servicio table.
 * @property {number} sistemaId - Foreign key referencing the sistema table.
 * @property {number} tipoId - Foreign key referencing the servicio_tipo table.
 * @property {string} name - Name of the servicio tipo.
 * @property {Function} [map] - Optional function to iterate over elements (e.g., for arrays or collections).
 * 
 */


/**
 * @typedef {Object} SystemNode
 * @property {string} title - Título del nodo del sistema.
 * @property {string} key - Clave única del nodo.
 * @property {number} sistemaId - Foreign key referencing the sistema table.
 * @property {number|null} areaId - Foreign key referencing the area table (optional).
 * @property {number|null} marcaId - Foreign key referencing the marca table (optional).
 * @property {boolean} leafNode - Indica si el nodo es una hoja (sin hijos).
 * @property {boolean} [checked] - Indica si el nodo está marcado.
 * @property {boolean} [halfChecked] - Indica si el nodo está semiseleccionado.
 * @property {Array<SystemNode>} [children] - Lista de nodos hijos (opcional).
 */


/**
 * @typedef {Object} AreaDTO
 * @property {number} id - Primary key of the area table.
 * @property {string} name - Name of the area.
 * @property {string} createdAt - Timestamp when the record was created.
 * @property {string|null} updatedAt - Timestamp when the record was last updated.
 */


/**
 * @typedef {Object} SistemaMarcaDTO
 * @property {number} id - Primary key of the area table.
 * @property {string} name - Name of the area.
 * @property {string} createdAt - Timestamp when the record was created.
 * @property {string|null} updatedAt - Timestamp when the record was last updated.
 */


/**
 * @typedef {Object} ServicioDTO
 * @property {number} sistemaId - Foreign key referencing the sistema table.
 * @property {number} sistemaServicioId - Foreign key referencing the sistema_servicio table.
 * @property {number} diagnosticoEquipoId - Foreign key referencing the diagnostico_equipo table.
 * @property {number} diagnosticoCasoId - Foreign key referencing the diagnostico_caso table.
 * @property {number} diagnosticoDiagnosticoTipoId - Foreign key referencing the diagnostico_diagnostico_tipo table.
 * @property {number} check - Check value.
 * @property {number} sistemaMarcaId - Foreign key referencing the sistema_marca table.
 * @property {string} createdAt - Timestamp when the record was created.
 * @property {string|null} updatedAt - Timestamp when the record was last updated.
 */


/**
 * @typedef {Object} Route
 * @property {string} path - The URL path for the route.
 * @property {string} name - The display name for the route.
 * @property {string} rtlName - The RTL (right-to-left) display name for the route.
 * @property {React.ReactNode} [icon] - The icon component to display for the route.
 * @property {boolean} [secondaryNavbar] - Indicates if the route should appear in a secondary navigation bar.
 * @property {React.ComponentType<any>} [component] - The React component to render for this route.
 * @property {string} layout - The layout path where this route belongs.
 * @property {boolean} [visible] - Indicates if the route should be visible in the navigation bar.
 * @property {string} [category] - The category of the route, e.g., "account".
 * @property {string} [state] - The state of the route, e.g., "pageCollapse".
 * @property {Route[]} [views] - An array of nested routes.
 * @property {string} [redirect] - A URL to redirect to, often used for routes not visible in the sidebar.
 * @property {Array<string>} [params] - Array of parameters for the route.
 */


/**
 * @typedef {Object} Feature
 * @property {boolean} enabled - Whether the feature is enabled.
 * @property {Route} route - The route configuration for the feature.
 * @property {string} category - The category of the feature, e.g., "pages".
 * @property {number} [order] - The order of the feature.
 */



