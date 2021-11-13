import {RouteComponentProps} from "@reach/router";
import React, {FC, useMemo, useState} from "react";
import {Button, ButtonToolbar, Form, Nav} from "rsuite";
import {gql, useMutation} from "@apollo/client";
import { Formik } from 'formik';
import {AuthDataType} from "../../App";
import {navigate} from "../../Navigation/hrefFactory";


type mode = "login"|"register"

const LOGIN_MUTATION = gql`
mutation LoginMutation($email: String!, $password: String!)
{

  authenticate(
    authenticateRequest:
     { email: $email, password: $password }
     )
     {
       jwtToken
       refreshToken
     }

}
`;
const REGISTER_MUTATION = gql`
mutation RegisterMutation($email: String!, $password: String!, $firstName:String, $lastName: String )
{

  register(
    inputUser:
     { email: $email, password: $password, firstName: $firstName, lastName: $lastName }
     )
     {
       id
     }

}
`;

type LoginFormProps = {setAuthData : React.Dispatch<React.SetStateAction<AuthDataType>>} & RouteComponentProps

export const LoginForm: FC<LoginFormProps> = ({ setAuthData }) => {
    const [mode, setMode] = useState<mode>("login")

    const [loginFunction, { data:loginData, loading:loginLoading, error: loginError }] = useMutation(LOGIN_MUTATION);
    const [registerFunction, { data:registerData, loading:registerLoading, error: registerError }] = useMutation(REGISTER_MUTATION);




    return(
        <>
            <Nav>
                <Nav.Item onClick={()=> setMode("login")}>Login</Nav.Item>
                <Nav.Item onClick={()=> setMode("register")}>Register</Nav.Item>
            </Nav>
            {mode == "login"
                ?(

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values) => console.log("OnSubmit")}
                    >
                        {({
                              values,
                              errors,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting,
                              /* and other goodies */
                          }) => (
                                <Form onSubmit={
                                    (checkStatus, event) => {
                                        var promise = loginFunction({variables: {email: values.email, password: values.password}})
                                        promise.then(value => {
                                            console.log("Val",value)
                                                localStorage.setItem("jwtToken", value?.data?.authenticate.jwtToken)
                                            localStorage.setItem("refreshToken", value?.data?.authenticate.refreshToken)

                                                navigate.toHome();
                                            }

                                        )}
                                    }
                                >
                                    <Form.Group controlId="email">
                                        <Form.ControlLabel>Email</Form.ControlLabel>
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            onChange={(value: any, event: React.SyntheticEvent) => handleChange(event)}
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
                                            onChange={(value: any, event: React.SyntheticEvent) => handleChange(event)}
                                            value={values.password}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <ButtonToolbar>
                                            <Button
                                                appearance="primary"
                                                type="submit"
                                            >Submit</Button>
                                        </ButtonToolbar>
                                    </Form.Group>
                                </Form>
                            )}
                    </Formik>


                ):(
                    <Formik
                        initialValues={{ email: '', password: '', firstName:'', secondName:'' }}
                        onSubmit={(values) => console.log("OnSubmit")}
                    >
                        {({
                              values,
                              errors,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting,
                              /* and other goodies */
                          }) => (
            <Form
                onSubmit={
                    (checkStatus, event) =>{console.log(values);
                        registerFunction({variables:{
                            email: values.email,
                                password: values.password,
                                firstName: values.firstName,
                            lastName: values.secondName}})}}
            >
                <Form.Group controlId="email">
                    <Form.ControlLabel>Email</Form.ControlLabel>
                    <Form.Control
                        name="email"
                        type="email"
                        onChange={(value: any, event: React.SyntheticEvent) => handleChange(event)}
                        value={values.email}/>
                    <Form.HelpText tooltip>Email is required</Form.HelpText>
                </Form.Group>
                <Form.Group controlId="firstName">
                    <Form.ControlLabel>First Name</Form.ControlLabel>
                    <Form.Control
                        name="firstName"
                        onChange={(value: any, event: React.SyntheticEvent) => handleChange(event)}
                        value={values.firstName}/>
                </Form.Group>
                <Form.Group controlId="secondName">
                    <Form.ControlLabel>Second Name</Form.ControlLabel>
                    <Form.Control
                        name="secondName"
                        onChange={(value: any, event: React.SyntheticEvent) => handleChange(event)}
                        value={values.secondName}/>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.ControlLabel>Password</Form.ControlLabel>
                    <Form.Control
                        name="password"
                        type="password"
                        autoComplete="off"
                        onChange={(value: any, event: React.SyntheticEvent) => handleChange(event)}
                        value={values.password}/>
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary" type="submit">Submit</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
                        )}
                    </Formik>
                )
            }
        </>
    )
}
