import React from "react";

import SearchBox from "./views/dashboard/SearchBox";

// icons 
//import { PiLineSegmentsThin } from "react-icons/pi";
import { MdSearch } from "react-icons/md";


/** @type Feature */
export const SearchBoxFeature = {
  enabled: true,
  category: "",
  order: 3,
  route: {
    path: "/pages/searchbox",
    name: "SearchBox",
    rtlName: "لوحة búsqueda",
    icon: <MdSearch color='inherit' />,
    secondaryNavbar: true,
    visible: false,
    component: SearchBox,
    layout: "/admin",
  },
  
};