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

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: Dashboard,
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
    layout: "/admin",
  },
  {
    name: "ACCOUNT PAGES2",
    path: "/account2",
    category: "account2",
    rtlName: "صفحات",
    state: "pageCollapse",
    layout: "/admin",
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
    name: "PAGES",
    path: "/pages",
    category: "pages",
    rtlName: "صفحات",
    state: "pageCollapse",
    layout: "/admin",
    icon: <PersonIcon color='inherit' />,
    views: [
      {
        path: "/pages/base64image",
        name: "Base 64 Image",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Base64Image,
        layout: "/admin",
      },
      {
        path: "/pages/searchbox",
        name: "Serach Box",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: SearchBox,
        layout: "/admin",
      },
      {
        path: "/pages/reacthookform",
        name: "React Hook Form",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Form,
        layout: "/admin",
      },
      {
        path: "/pages/formik",
        name: "Formik",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Formik,
        layout: "/admin",
      },
      {
        path: "/pages/formik-login",
        name: "Formik Login",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: SignInDash,
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
];
export default dashRoutes;
