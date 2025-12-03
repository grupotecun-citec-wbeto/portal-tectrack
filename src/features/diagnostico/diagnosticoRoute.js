import React from "react";

import DiagnosticoBox from "./views/dashboard/DiagnosticoBox";

// icons 
//import { PiLineSegmentsThin } from "react-icons/pi";
import {
  PersonIcon,
} from "components/Icons/Icons";


/** @type Feature */
export const DiagnosticoFeature = {
  enabled: true,
  category: "",
  order: 1,
  route:  {
      path: "/pages/diagnostico",
      name: "Diagnostico",
      rtlName: "لوحة القيادة",
      icon: <PersonIcon color='inherit' />,
      secondaryNavbar: true,
      visible: false,
      component: DiagnosticoBox,
      layout: "/admin",
    },
};