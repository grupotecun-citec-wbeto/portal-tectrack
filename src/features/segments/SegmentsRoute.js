import React from "react";

import SelectSegmentoDash from "./views/dashboard/SelectSegmentoDash";

// icons 
//import { PiLineSegmentsThin } from "react-icons/pi";
import { MdSegment } from "react-icons/md";


/** @type Feature */
export const SegmentsFeature = {
  enabled: true,
  category: "",
  order: 1,
  route: {
    path: "/pages/selectsegmento",
    name: "Segmentos",
    rtlName: "لوحة القيادة",
    icon: <MdSegment color='inherit' />,
    secondaryNavbar: true,
    component: SelectSegmentoDash,
    layout: "/admin",
  },
};