import React, { createContext, useState } from "react";
import "./App.css";
import { Router, RouteComponentProps } from "@reach/router";
import { LoginForm } from "./Components/LoginForm/LoginForm";
import { HomeDemo } from "./Components/HomeDemo/HomeDemo";

export const AuthContext = createContext<AuthDataType>({
  token: null,
  userId: null,
});

export type AuthDataType = { token: string | null; userId: number | null };

function App() {
  const [authData, setAuthData] = useState<AuthDataType>({
    token: null,
    userId: null,
  });
  //console.log("app",authData)

  return (
    <Router>
      <HomeDemo path="/" authData={authData} />
      <LoginForm path="authorization" setAuthData={setAuthData} />
    </Router>
  );
}

export default App;
