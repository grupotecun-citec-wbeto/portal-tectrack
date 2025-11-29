import React from "react";

import SelectSegmentoDash from "./views/dashboard/SelectSegmentoDash";

// icons 
import { PiLineSegmentsThin } from "react-icons/pi";


/** @type Feature */
export const SegmentsFeature = {
  enabled: true,
  category: "",
  order: 1,
  route: {
    path: "/pages/selectsegmento",
    name: "Segmentos",
    rtlName: "لوحة القيادة",
    icon: <PiLineSegmentsThin color='inherit' />,
    secondaryNavbar: true,
    component: SelectSegmentoDash,
    layout: "/admin",
  },
};