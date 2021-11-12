import React from 'react';
import './App.css';
import {Router, RouteComponentProps} from "@reach/router"
import {LoginForm} from "./Components/LoginForm/LoginForm";

let Home = (props : RouteComponentProps) => <div>Home</div>

function App() {
    //const {loading, error, data} = useQuery(EXCHANGE_RATES);
    //console.log(data)
    // @ts-ignore
    return (
        <>
            <Router>
                <Home path="/" />
                <LoginForm path="authorization" />
            </Router>
        </>
    );
}

export default App;
