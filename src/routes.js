// import
import React, { Component }  from 'react';
import Dashboard from "views/Dashboard/Dashboard.js";
import Tables from "views/Dashboard/Tables.js";
import Billing from "views/Dashboard/Billing.js";
import RTLPage from "views/RTL/RTLPage.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";
import Form from 'views/Dashboard/Form';
import Formik from 'views/Dashboard/Formik';
import SignInDash from 'views/Dashboard/SignInDash';
import SearchBox from 'views/Dashboard/SearchBox';
import Base64Image from 'views/Dashboard/Base64Image';
import SelectCasoBox from 'views/Dashboard/SelectCasoBox';
import ComunicationBox from 'views/Dashboard/ComunicationBox';
import PreDiagnosticoBox from 'views/Dashboard/PreDiagnosticoBox';
import DiagnosticoBox from 'views/Dashboard/DiagnosticoBox';
import Casos from 'views/Dashboard/Casos';
import SelectSegmentoDash from 'views/Dashboard/SelectSegmentoDash';
import ResultTableSqlite from 'views/Pages/ResultTableSqlite';
import CasoInfo from 'components/Casos/CasoInfo';

import { PiLineSegmentsThin } from "react-icons/pi";
import { IoBriefcaseOutline } from "react-icons/io5";
import { VscServerProcess } from "react-icons/vsc";


// - NOTE
// - In routes active redirect:"#", is not visible en slidebar, without content only "#"

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";
import CapacitacionDash from 'views/Dashboard/CapacitacionDash';

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: Dashboard,
    visible:false,
    layout: "/admin",
  },
  /*{
    path: "/tables",
    name: "Tables",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color='inherit' />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Billing",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color='inherit' />,
    component: Billing,
    layout: "/admin",
  },
  {
    path: "/rtl-support-page",
    name: "RTL",
    rtlName: "آرتيإل",
    icon: <SupportIcon color='inherit' />,
    component: RTLPage,
    layout: "/rtl",
  },*/
  {
    name: "ACCOUNT PAGES",
    path: "/account",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    layout: "/admin",
    visible:false,
    icon: <PersonIcon color='inherit' />,
    views: [
      {
        path: "/account/profile",
        name: "Profile",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color='inherit' />,
        component: SignIn,
        layout: "/auth",
      },
      {
        path: "/signup2",
        name: "Sign Up2",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: SignUp,
        layout: "/auth",
        redirect: "#" // If activate redirect is not visible in slidebar
      },
    ],
  },
  {
    path: "/tables",
    name: "Tables",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color='inherit' />,
    component: Tables,
    visible:false,
    layout: "/admin",
  },
  {
    name: "ACCOUNT PAGES2",
    path: "/account2",
    category: "account2",
    rtlName: "صفحات",
    state: "pageCollapse",
    layout: "/admin",
    visible: false,
    icon: <PersonIcon color='inherit' />,
    views: [
      {
        path: "/account2/profile2",
        name: "Profile2",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color='inherit' />,
        component: SignIn,
        layout: "/auth",
      },
      {
        path: "/signup",
        name: "Sign Up",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: SignUp,
        layout: "/auth",
      },
    ],
  },
  {
    name: "PROCESOS",
    path: "/pages",
    category: "pages",
    rtlName: "صفحات",
    state: "pageCollapse",
    layout: "/admin",
    icon: <VscServerProcess color='inherit' />,
    views: [
      {
        path: "/pages/base64image",
        name: "Base 64 Image",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: Base64Image,
        layout: "/admin",
      },
      {
        path: "/pages/searchbox",
        name: "Serach Box",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: SearchBox,
        layout: "/admin",
      },
      {
        path: "/pages/selectcaso",
        name: "Select Caso",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: SelectCasoBox,
        layout: "/admin",
      },
      {
        path: "/pages/selectsegmento",
        name: "Segmentos",
        rtlName: "لوحة القيادة",
        icon: <PiLineSegmentsThin color='inherit' />,
        secondaryNavbar: true,
        component: SelectSegmentoDash,
        layout: "/admin",
      },
      {
        path: "/pages/programa/capacitacion",
        name: "Capacitacion",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: CapacitacionDash,
        layout: "/admin",
      },
      {
        path: "/pages/programa/proyecto",
        name: "Proyecto",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: CapacitacionDash,
        layout: "/admin",
      },
      {
        path: "/pages/comunication",
        name: "Comuniación",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: ComunicationBox,
        layout: "/admin",
      },
      {
        path: "/pages/prediagnostico",
        name: "Pre Diagnostico",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: PreDiagnosticoBox,
        layout: "/admin",
      },
      {
        path: "/pages/diagnostico",
        name: "Diagnostico",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: DiagnosticoBox,
        layout: "/admin",
      },
      {
        path: "/pages/casos",
        name: "Casos",
        rtlName: "لوحة القيادة",
        icon: <IoBriefcaseOutline color='inherit' />,
        secondaryNavbar: true,
        component: Casos,
        layout: "/admin",
      },
      {
        path: "/pages/reacthookform",
        name: "React Hook Form",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: Form,
        layout: "/admin",
      },
      {
        path: "/pages/formik",
        name: "Formik",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: Formik,
        layout: "/admin",
      },
      {
        path: "/pages/formik-login",
        name: "Formik Login",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: SignInDash,
        layout: "/admin",
      },
      {
        path: "/pages/resultable",
        name: "Result Table",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        visible:false,
        component: ResultTableSqlite,
        layout: "/admin",
      },
      {
        path: "/pages/casoinfo",
        name: "Caso info",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: CasoInfo,
        visible:false,
        layout: "/admin",
        params:['id']
      },
      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color='inherit' />,
        component: SignIn,
        visible:false,
        layout: "/auth",
      },
      {
        path: "/signup",
        name: "Sign Up",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: SignUp,
        visible:false,
        layout: "/auth",
      },
    ],
  },
];
export default dashRoutes;
