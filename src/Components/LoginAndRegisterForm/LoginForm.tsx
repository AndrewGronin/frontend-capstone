import React, { FC } from "react";
import { Button, ButtonToolbar, Form } from "rsuite";
import { navigate } from "../../Navigation/navigate";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../Api/LoginMutation";

export const LoginForm: FC = () => {
  const [loginFunction, { error }] = useMutation(LOGIN_MUTATION);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={(values) => console.log("OnSubmit")}
    >
      {({ values, handleChange }) => (
        <Form
          onSubmit={() => {
            var promise = loginFunction({
              variables: { email: values.email, password: values.password },
            });
            promise
              .then((value) => {
                localStorage.setItem(
                  "jwtToken",
                  value?.data?.authenticate.jwtToken
                );
                localStorage.setItem(
                  "refreshToken",
                  value?.data?.authenticate.refreshToken
                );

                navigate.toHome();
              })
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
