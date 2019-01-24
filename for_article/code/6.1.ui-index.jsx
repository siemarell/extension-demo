import {render} from 'react-dom'
import App from './App'
import React from "react";

// Инициализируем приложение с background объектом в качест ве props
export async function initApp(background){
    render(
        <App background={background}/>,
        document.getElementById('app-content')
    );
}

