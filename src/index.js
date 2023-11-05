import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {GeoTest} from "./components/GeoTest";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {Main} from "./pages/Main";
import {Leaderboard} from "./pages/Leaderboard";
import {Poradnik} from "./pages/Poradnik";
import {User} from "./pages/User";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
        path: "/poradnik",
        element: <Poradnik />,
    },
    {
        path: "/leaderboard/:testId",
        element: <Leaderboard />,
    },
    {
        path: "/test/:testId",
        element: <GeoTest />,
    },
    {
        path: "/user/:nickname",
        element: <User />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
