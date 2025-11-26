import { useState, useEffect } from 'react';

const PACKAGE = 'sistema';

import { getAllSistemas, getAllSistemasServicios, getStrucureDataTree, getAllAreas,getAllMarcas } from '@application/sistema';



const useSistemasChildrens = (dbReady) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                /**
                 * @type {Array<SistemaDTO>}
                 */
                const result = await getAllSistemas();
                /**
                 * @type {Array<SistemaServicioDTO>}
                 */
                /**
                 * @type {Array<SistemaServicioDTO>}
                 */
                const servicios = await getAllSistemasServicios();
                /**
                 * @type {Array<AreaDTO>}
                 */
                const areas = await getAllAreas();

                /**
                 * @type {Array<SistemaMarcaDTO>}
                 */
                const marcas = await getAllMarcas();
                /**
                 * @type {Array<SystemNode>}
                 */
                const combinedData = getStrucureDataTree(result, servicios,areas,marcas);
                
                setData(combinedData);
            } catch (err) {
                setError(err.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dbReady]);

    return { data, loading, error };
};

export default useSistemasChildrens;