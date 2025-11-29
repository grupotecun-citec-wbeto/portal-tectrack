import React from "react";

import PreDiagnosticoBox from "./views/dashboard/PreDiagnosticoBox";

// icons 
//import { PiLineSegmentsThin } from "react-icons/pi";
import { MdSegment } from "react-icons/md";


/** @type Feature */
export const PreDiagnosticoFeature = {
  enabled: true,
  category: "",
  order: 1,
  route: {
    path: "/pages/prediagnostico",
    name: "Pre Diagnostico",
    rtlName: "لوحة القيادة",
    icon: <MdSegment color='inherit' />,
    secondaryNavbar: true,
    visible: false,
    component: PreDiagnosticoBox,
    layout: "/admin",
  },
};

/*
{
    path: "/pages/prediagnostico",
    name: "Pre Diagnostico",
    rtlName: "لوحة القيادة",
    icon: <PersonIcon color='inherit' />,
    secondaryNavbar: true,
    visible: false,
    component: PreDiagnosticoBox,
    layout: "/admin",
  },
 */