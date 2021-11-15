import React, { createContext, useState } from "react";
import "./App.css";
import { Router, RouteComponentProps } from "@reach/router";
import { LoginAndRegisterForm } from "./Components/LoginAndRegisterForm/LoginAndRegisterForm";
import { HomeDemo } from "./Components/HomeDemo/HomeDemo";

function App() {
  return (
    <Router>
      <HomeDemo path="/" />
      <LoginAndRegisterForm path="authorization" />
    </Router>
  );
}

export default App;
