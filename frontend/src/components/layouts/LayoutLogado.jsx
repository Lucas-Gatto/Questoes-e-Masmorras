import React from "react";
import { Outlet } from "react-router-dom";
import Headerlogado from "../header-logado";
import Footer from "../footer";

const LayoutLogado = () => {
  return (
    <>
      <Headerlogado />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default LayoutLogado;
