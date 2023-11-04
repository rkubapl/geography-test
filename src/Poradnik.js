import {Link} from "react-router-dom";

export const Poradnik = () => {
    return (
        <div>
            <Link to="/">Strona główna</Link>
            <h1>Poradnik</h1>
            <h2>1. Tryb testu</h2>
            <img src="/legenda/test.png" width="75%" />
            <h2>2. Tryb nauki</h2>
            <span>Np. możesz zastanowić się nad nazwą lokalizacji, a potem kliknąć i sprawdzić czy dobrze myślałeś/aś.</span>
            <img src="/legenda/nauka.png" width="75%" />
            <br />
            <br />
            <span>Najlepiej połączyć obie te metody - pierwsza metoda pozwala generalnie zapamiętać lokalizacje, a druga umożliwia zapamiętanie nazw.</span>
            <br />
        </div>
    )
}