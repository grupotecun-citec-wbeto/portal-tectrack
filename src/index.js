if (!navigator.onLine) {
  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = ''; // Esto evita el reinicio del navegador
  });
}


if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length === 0) {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
        //console.log('Service Worker registrado con éxito:', registration);
          })
          .catch((error) => {
        console.error('Error al registrar el Service Worker:', error);
          });
      } else {
        const existingSW = registrations.find(reg => reg.active && reg.active.scriptURL === `${window.location.origin}/service-worker.js`);
        if (!existingSW) {
          registrations.forEach((registration) => {
        registration.unregister().then(() => {
          //console.log('Service Worker viejo desregistrado:', registration);
        }).catch((error) => {
          console.error('Error al desregistrar el Service Worker viejo:', error);
        });
          });

          navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          //console.log('Nuevo Service Worker registrado con éxito:', registration);
        })
        .catch((error) => {
          console.error('Error al registrar el nuevo Service Worker:', error);
        });
        } else {
          //console.log('El Service Worker actual ya está registrado y activo.');
        }
      }
    }).catch((error) => {
      console.error('Error al verificar los Service Workers activos:', error);
    });
  }
} else {
  //console.log('Modo de desarrollo: no se registra el Service Worker.');
}

/*if (!navigator.onLine) {
  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          //console.log('Service Worker registrado con éxito:', registration);
        })
        .catch((error) => {
          console.error('Error al registrar el Service Worker:', error);
        });
    }
  } else {
    //console.log('Modo de desarrollo: no se registra el Service Worker.');
  }
}else{
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().then(() => {
      //console.log('Service Worker viejo desregistrado:', registration);
      }).catch((error) => {
      console.error('Error al desregistrar el Service Worker viejo:', error);
      }).finally(() => {
        if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker
              .register('/service-worker.js')
              .then((registration) => {
                //console.log('Service Worker registrado con éxito:', registration);
              })
              .catch((error) => {
                console.error('Error al registrar el Service Worker:', error);
              });
          }
        } else {
          //console.log('Modo de desarrollo: no se registra el Service Worker.');
        }
      });
    });
  });
}*/


/*!

=========================================================
* Argon Dashboard Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-chakra
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-chakra/blob/master/LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect, useParams   } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js"; // Chakra imports
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from './appContext.js';
import { SqlProvider } from './sqlContext.js';
import { DisposalProvider } from "./disposalContext.js";
import { DataBaseProvider } from "dataBaseContext.js";
import { UsuarioProvider } from "usuarioContext.js";
import { CasoProvider } from "casoContext.js";
import Notfound404 from "layouts/Errors/Notfound404.js";
// Custom Chakra theme
import theme from "theme/theme.js";

// REDUX
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store.js';

import FullscreenLoader from "@components/Loaders/FullscreenLoader.jsx";

import '@domain/dto';

const UserProfile = () => {
  const { userId } = useParams();

  // Validación simple de que userId sea numérico usando expresión regular
  const isValidId = /^[0-9]+$/.test(userId);

  if (!isValidId) {
    return <Redirect to="/error" />;
  }

  return <h2>Perfil del usuario con ID: {userId}</h2>;
};

/*useEffect(() => {
  initDatabase().then(() => setDbReady(true));
}, []);*/




ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<FullscreenLoader visible={true} />} persistor={persistor}>
      <ChakraProvider theme={theme} resetCss={false} position="relative">
        <DataBaseProvider>
          <AppProvider>
              <UsuarioProvider>
                <CasoProvider>
                  <SqlProvider>
                    <DisposalProvider>
                      <HashRouter>
                        <Switch>
                          <Route path={`/auth`} component={AuthLayout} />
                          <Route path={`/admin`} component={AdminLayout} />
                          <Route path={`/user/:userId`} component={UserProfile} />
                          <Route path={`/error`} component={Notfound404} />
                          <Route path={`/rtl`} component={RTLLayout} />
                          <Redirect from={`/`} to="/admin/dashboard" />
                        </Switch>
                      </HashRouter>
                    </DisposalProvider>
                  </SqlProvider>
                </CasoProvider>
              </UsuarioProvider>
          </AppProvider>
        </DataBaseProvider>
      </ChakraProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);




