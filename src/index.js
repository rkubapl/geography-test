import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {GeoTest} from "./GeoTest";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {Main} from "./Main";
import {Leaderboard} from "./Leaderboard";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
        path: "/leaderboard/:testId",
        element: <Leaderboard />,
    },
    {
        path: "/test/:testId",
        element: <GeoTest />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
