import React from "react";

import AdministrativeDash from "./views/dashboard/AdministrativeDash";

// icons 
import {PersonIcon} from "components/Icons/Icons";


/** @type Feature */
export const AdministrativeFeature = {
  enabled: true,
  category: "",
  order: 1.2,
  route:  {
      path: "/pages/programa/capacitacion",
      name: "Capacitacion",
      rtlName: "لوحة القيادة",
      icon: <PersonIcon color='inherit' />,
      secondaryNavbar: true,
      visible: false,
      component: AdministrativeDash,
      layout: "/admin",
    },
};

/*
NOTA: Si se quiere crear una categoria se agregar texto en category
 */