import React, { FC } from "react";
import { Button, ButtonToolbar, Form } from "rsuite";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../Api/RegisterMutation";
import { Mode } from "./LoginAndRegisterForm";

export const RegisterForm: FC<{
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}> = ({ setMode }) => {
  const [registerFunction, { error }] =
    useMutation(REGISTER_MUTATION);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        firstName: "",
        secondName: "",
      }}
      onSubmit={(values) => console.log("OnSubmit")}
    >
      {({ values, handleChange }) => (
        <Form
          onSubmit={() => {
            registerFunction({
              variables: {
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.secondName,
              },
            })
              .then(() => setMode("login"))
              .catch(() => console.log(""));
          }}
        >
          <Form.Group controlId="email">
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control
              name="email"
              type="email"
              onChange={(value: any, event: React.SyntheticEvent) =>
                handleChange(event)
              }
              value={values.email}
            />
            <Form.HelpText tooltip>Email is required</Form.HelpText>
          </Form.Group>
          <Form.Group controlId="firstName">
            <Form.ControlLabel>First Name</Form.ControlLabel>
            <Form.Control
              name="firstName"
              onChange={(value: any, event: React.SyntheticEvent) =>
                handleChange(event)
              }
              value={values.firstName}
            />
          </Form.Group>
          <Form.Group controlId="secondName">
            <Form.ControlLabel>Second Name</Form.ControlLabel>
            <Form.Control
              name="secondName"
              onChange={(value: any, event: React.SyntheticEvent) =>
                handleChange(event)
              }
              value={values.secondName}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.ControlLabel>Password</Form.ControlLabel>
            <Form.Control
              name="password"
              type="password"
              autoComplete="off"
              onChange={(value: any, event: React.SyntheticEvent) =>
                handleChange(event)
              }
              value={values.password}
              errorMessage={error?.message}
            />
          </Form.Group>
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary" type="submit">
                Submit
              </Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};
