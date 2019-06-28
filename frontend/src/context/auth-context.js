import React from 'react';

export default React.createContext({
    token: null,
    clienteId: null,
    login: (token, clienteId, tokenExpiration) => {
    
    },
    logout: () =>{

    }
});