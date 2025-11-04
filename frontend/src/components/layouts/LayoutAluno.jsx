import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../footer";
import HeaderAluno from "../header-aluno";

const LayoutAluno = () => {
  return (
    <>
      <HeaderAluno/>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default LayoutAluno;
