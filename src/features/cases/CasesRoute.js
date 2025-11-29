import React from "react";

import Casos from "./views/dashboard/Casos";

// icons 
import { IoBriefcaseOutline } from "react-icons/io5";


/** @type Feature */
export const CasesFeature = {
  enabled: true,
  category: "",
  order: 1.2,
  route: {
        path: "/pages/casos",
        name: "Casos",
        rtlName: "لوحة القيادة",
        icon: <IoBriefcaseOutline color='inherit' />,
        secondaryNavbar: true,
        component: Casos,
        layout: "/admin",
      },
};