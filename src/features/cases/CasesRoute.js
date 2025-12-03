import React from "react";

import Casos from "./views/dashboard/Casos";

// icons 
import { FiGrid } from "react-icons/fi";


/** @type Feature */
export const CasesFeature = {
  enabled: true,
  category: "",
  order: 1.2,
  route: {
        path: "/pages/casos",
        name: "Casos",
        rtlName: "لوحة القيادة",
        icon: <FiGrid color='inherit' />,
        secondaryNavbar: true,
        component: Casos,
        layout: "/admin",
      },
};

/*
NOTA: Si se quiere crear una categoria se agregar texto en category
 */