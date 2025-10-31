import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../footer";
import HeaderAventura from "../HeaderAventura";

const LayoutAluno = () => {
  return (
    <>
      <HeaderAventura />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default LayoutAluno;
