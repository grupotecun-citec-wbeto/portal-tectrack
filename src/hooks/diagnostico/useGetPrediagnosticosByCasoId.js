/**
 * @package hooks/diagnostico
 * @description Hook para obtener prediagnosticos
 * @author CITEC
 */

import { useState, useEffect } from 'react';

// import repositores
import repository from '../../repositories/local/diagnostico/repository';



const useGetPrediagnosticosByCasoId = (casoId,caso_estado_ID,dbReady) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await repository.findPreDiagnosticosByCasoId(casoId,caso_estado_ID);
                setData(result);
            } catch (err) {
                console.error(err, '7dd8ea43-3c85-4fd5-9358-19cd62523c83')
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dbReady]);

    return { data, loading, error };
};

export default useGetPrediagnosticosByCasoId;
