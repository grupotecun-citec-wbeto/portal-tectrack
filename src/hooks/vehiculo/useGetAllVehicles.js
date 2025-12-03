import { useState, useEffect } from 'react';

const PACKAGE = 'vehiculos';

import { getAllVehiculos } from '@application/vehiculo/getAllVehiculos';



const useGetAllVehicles = (dbReady) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                /**
                 * @type {Array<VehiculoDTO>}
                 */
                const result = await getAllVehiculos();
                
                
                setData(result);
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

export default useGetAllVehicles;