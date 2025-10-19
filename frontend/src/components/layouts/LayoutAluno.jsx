import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../footer";
import HeaderAventura from "../HeaderAventura";

const LayoutAluno = () => {
  return (
    <>
      <HeaderAventura />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default LayoutAluno;
