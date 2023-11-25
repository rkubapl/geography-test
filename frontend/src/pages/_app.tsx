import type { AppProps } from 'next/app'
import '../index.css';
import '../index.scss';
import "../components/GeoTest.css"

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}