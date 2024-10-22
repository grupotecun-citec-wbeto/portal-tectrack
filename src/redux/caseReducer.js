const initialState = {
    userData: null,  // Aquí almacenaremos el JSON
  };
  
  const caseReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER_DATA':  // Guardar el JSON
        return { ...state, userData: action.payload };
        
      case 'CLEAR_USER_DATA':  // Limpiar el estado
        return { ...state, userData: null };
  
      case 'GET_USER_DATA':  // Obtener el JSON
        return { ...state };  // Devuelve el estado actual sin modificar nada
  
      default:
        return state;
    }
  };
  
  export default caseReducer;