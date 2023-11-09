import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {Main} from "./pages/Main";
import {Leaderboard} from "./pages/Leaderboard";
import {Poradnik} from "./pages/Poradnik";
import {User} from "./pages/User";
import {Creator} from "./components/Creator";
import {Test} from "./pages/Test";
import {CustomTest} from "./pages/CustomTest";


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
        element: <Test />,
    },
    {
        path: "/customTest",
        element: <CustomTest />,
    },
    {
        path: "/user/:nickname",
        element: <User />,
    },
    {
        path: "/create",
        element: <Creator />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
