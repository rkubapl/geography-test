import type { AppProps } from 'next/app'
import '../index.css';
import '../index.scss';
import "../components/GeoTest.css"
import {UserProvider} from "@auth0/nextjs-auth0/client";

export default function App({ Component, pageProps }: AppProps) {
    return <UserProvider><Component {...pageProps} /></UserProvider>
}