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
import Notfound404 from "layouts/Errors/Notfound404.js";
// Custom Chakra theme
import theme from "theme/theme.js";


const UserProfile = () => {
  const { userId } = useParams();

  // Validación simple de que userId sea numérico usando expresión regular
  const isValidId = /^[0-9]+$/.test(userId);

  if (!isValidId) {
    return <Redirect to="/error" />;
  }

  return <h2>Perfil del usuario con ID: {userId}</h2>;
};

ReactDOM.render(
  <ChakraProvider theme={theme} resetCss={false} position="relative">
    <AppProvider>
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
    </AppProvider>
    
  </ChakraProvider>,
  document.getElementById("root")
);
