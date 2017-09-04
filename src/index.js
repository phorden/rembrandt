import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';
import MyApp from './app.jsx';


render(
    <MyApp />,
    document.getElementById( 'app' )
);
