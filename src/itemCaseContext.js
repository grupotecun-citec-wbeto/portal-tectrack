import React, { createContext, useContext, useState } from 'react';

const ItemCaseContext = createContext();

export const ItemCaseProvider = ({ children }) => {
    const [state, setState] = useState(null);

    return (
        <ItemCaseContext.Provider value={{ state, setState }}>
            {children}
        </ItemCaseContext.Provider>
    );
};

export const useItemCaseContext = () => {
    const context = useContext(ItemCaseContext);
    if (!context) {
        throw new Error('useItemCaseContext must be used within an ItemCaseProvider');
    }
    return context;
};