import { RouteComponentProps } from "@reach/router";
import React, { FC, useMemo, useState } from "react";
import { Button, ButtonToolbar, Form, Nav } from "rsuite";
import { gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import { navigate } from "../../Navigation/navigate";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RefisterForm";

export type Mode = "login" | "register";

export const LoginAndRegisterForm: FC<RouteComponentProps> = () => {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <>
      <Nav>
        <Nav.Item onClick={() => setMode("login")}>Login</Nav.Item>
        <Nav.Item onClick={() => setMode("register")}>Register</Nav.Item>
      </Nav>
      {mode === "login" ? <LoginForm /> : <RegisterForm setMode={setMode} />}
    </>
  );
};
