import {render} from 'react-dom'
import App from './App'
import React from "react";

export async function initApp(background){
    render(
        <App background={background}/>,
        document.getElementById('app-content')
    );
}

