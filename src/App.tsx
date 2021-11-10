import React from 'react';
import './App.css';
import {gql, useQuery} from "@apollo/client";

const EXCHANGE_RATES = gql`
  query GetExchangeRates {users{
    firstName
}}
`;

function App() {
    const {loading, error, data} = useQuery(EXCHANGE_RATES);
    console.log(data)
    return (
        <>
            <>dadsa</>
            <form
            >
                <button onClick={()=>
                console.log("sfasfasf")} type="button"> cockc </button>
            </form>
        </>
    );
}

export default App;
