const regionsPoints = [
    {x: 749, y: 757, n: "Pobrzeże Szczecińskie"},
    {x: 1252, y: 528, n: "Pobrzeże Koszalińskie"},
    {x: 2426, y: 800, n: "Pojezierze Mazurskie"},
    {x: 1223, y: 947, n: "Pojezierze Pomorskie"},
    {x: 2890, y: 1107, n: "Nizina Północnopodlaska"},
    {x: 685, y: 1444, n: "Pojezierze Lubuskie"},
    {x: 2250, y: 1420, n: "Nizina Mazowiecka"},
    {x: 2812, y: 1469, n: "Nizina Południowopodlaska"},
    {x: 2814, y: 2097, n: "Wyżyna Lubelska"},
    {x: 2278, y: 2171, n: "Wyżyna Małopolska"},
    {x: 1750, y: 2458, n: "Wyżyna Śląska"},
    {x: 1975, y: 2350, n: "Wyżyna Krakowsko-Częstochowska"},
    {x: 1025, y: 2506, n: "Sudety"},
    {x: 2139, y: 2907, n: "Karpaty"},
    {x: 1810, y: 634, n: "Żuławy Wiślane"},
    {x: 1297, y: 1378, n: "Pojezierze Wielkopolskie"},
    {x: 1600, y: 1764, n: "Nizina Południowowielkopolska"},
    {x: 1259, y: 2302, n: "Nizina Śląska"},
    {x: 2660, y: 2397, n: "Kotlina Sandomierska"},
    {x: 1817, y: 2598, n: "Kotlina Oświęcimska"}
]
const megaregionyPoints = [{"x":168,"y":165,"n":"Pozaalpejska Europa Środkowa"},{"x":346,"y":77,"n":"Niż Wschodnioeuropejski"},{"x":297,"y":336,"n":"Karpaty, Podkarpacie i Nizina Panońska"}]
const podprowincjePoints = [{"x":58,"y":54,"n":"Pobrzeża Południowobałtyckie"},{"x":298,"y":47,"n":"Pobrzeże Wschodniobałtyckie"},{"x":290,"y":71,"n":"Pojezierze Wschodniobałtyckie"},{"x":368,"y":126,"n":"Wysoczyzny Podlasko-Białoruskie"},{"x":386,"y":228,"n":"Polesie"},{"x":410,"y":284,"n":"Wyżyna Wołyńsko-Podolska"},{"x":356,"y":261,"n":"Wyżyna Lubelsko-Lwowska"},{"x":266,"y":266,"n":"Wyżyna Małopolska"},{"x":205,"y":289,"n":"Wyżyna Śląsko-Krakowska"},{"x":337,"y":299,"n":"Podkarpacie Północne"},{"x":239,"y":345,"n":"Zewnętrzne Karpaty Zachodnie"},{"x":247,"y":374,"n":"Centralne Karpaty Zachodnie"},{"x":356,"y":373,"n":"Zewnętrzne Karpaty Wschodnie (Beskidy Wschodnie)"},{"x":67,"y":231,"n":"Niziny Sasko-Łużyckie"},{"x":88,"y":272,"n":"Sudety z Przedgorzem Sudeckim"},{"x":216,"y":202,"n":"Niziny Środkowopolskie"},{"x":129,"y":116,"n":"Pojezierza Południowobałtyckie"},{"x":373,"y":346,"n":"Wschodnie Podkarpacie"}]
const prowincjePoints = [{"x":179,"y":161,"n":"Niż Środkowoeuropejski"},{"x":85,"y":271,"n":"Masyw Czeski"},{"x":279,"y":272,"n":"Wyżyny Polskie"},{"x":351,"y":87,"n":"Niż Wschodniobałtycko-Białoruski"},{"x":409,"y":281,"n":"Wyżyny Ukraińskie"},{"x":290,"y":331,"n":"Karpaty Zachodnie z Podkarpaciem Zachodnim i Północnym"},{"x":357,"y":374,"n":"Karpaty Wschodnie z Podkarpaciem Wschodnim"}]
const pradolinyPoints = [{"x":164,"y":23,"n":"Pradolina Redy-Łeby"},{"x":80,"y":69,"n":"Pradolina Pomorska"},{"x":325,"y":125,"n":"Pradolina Biebrzy i Narwi"},{"x":114,"y":138,"n":"Pradolina Toruńsko-Eberswaldzka"},{"x":148,"y":196,"n":"Pradolina Warszawsko-Berlińska"},{"x":101,"y":230,"n":"Pradolina Barucko-Głogowska"},{"x":115,"y":271,"n":"Pradolina Wrocławsko-Magdeburska"},{"x":273,"y":321,"n":"Pradolina Górnej Wisły"},{"x":340,"y":327,"n":"Pradolina Podkarpacka"},{"x":313,"y":231,"n":"Pradolina Pillcy-Wieprza-Krzny"}]
const rzekiPoints = [{"x":1838,"y":1333,"n":"Wisła"},{"x":942,"y":1747,"n":"Odra"},{"x":1706,"y":1555,"n":"Warta"},{"x":2921,"y":1467,"n":"Bug"},{"x":2406,"y":1326,"n":"Narew"},{"x":2787,"y":2379,"n":"San"},{"x":1161,"y":1184,"n":"Noteć"},{"x":2103,"y":1885,"n":"Pilica"},{"x":2864,"y":1895,"n":"Wieprz"},{"x":831,"y":1821,"n":"Bóbr"},{"x":2292,"y":632,"n":"Łyna"},{"x":629,"y":1750,"n":"Nysa Łużycka"},{"x":2211,"y":1312,"n":"Wkra"},{"x":2235,"y":2787,"n":"Dunajec"},{"x":1531,"y":956,"n":"Brda"}]
const fortnitePoints = [
    {n: "Wykrzywione Wieże", x: 748, y: 1049},
    {n: "Lepki Lasek", x: 458, y: 1313},
    {n: "Spawalnia Spłuczek", x: 708, y: 1826},
    {n: "Golfowe Gniazdko", x: 1092, y: 497},
    {n: "Przyjemny Park", x: 564, y: 643},
    {n: "Widmowe Wzgórza", x: 300, y: 450},
    {n: "Rozdroża Rupieci", x: 396, y: 290},
    {n: "Karkołomne Kino", x: 1521, y: 432},
    {n: "Płacząca Puszcza", x: 1669, y: 645},
    {n: "Samotne Schronisko", x: 1858, y: 954},
    {n: "Oaza Odpoczynku", x: 1696, y: 1548},
    {n: "Wypasiona Wyrwa", x: 1221, y: 1058},
    {n: "Sklepowa Sadyba", x: 1512, y: 1158},
    {n: "Zgubne Ziemie", x: 1223, y: 1615},
    {n: "Pagody Pomyślności", x: 1146, y: 1897},
    {n: "Szemrane Szyby", x: 739, y: 1393},
    {n: "Butny Brzeg", x: 158, y: 934},
    {n: "Pomidorowy Przybytek", x: 1341, y: 705},
    {n: "Zalew Zdobyczy", x: 884, y: 807}
]

const tests = {
    "krainy": {n: "Krainy geograficzne", p: regionsPoints, i: "/maps/mapa-1.png", s: 300},
    "megaregiony": {n: "Megaregiony", p: megaregionyPoints, i: "/maps/mapa-2.jpg", s: 100},
    "prowincje": {n: "Prowincje", p: prowincjePoints, i: "/maps/mapa-2.jpg", s: 70},
    "podprowincje": {n: "Podprowincje", p: podprowincjePoints, i: "/maps/mapa-2.jpg", s: 70},
    "pradoliny": {n: "Pradoliny", p: pradolinyPoints, i: "/maps/mapa-pradoliny.jpg", s: 70, defaultFlip: true},
    "rzeki": {i: "/maps/mapa-rzek.jpg", n: "Rzeki w Polsce", p: rzekiPoints, s: 300},
    "fortnite": {i: "/maps/mapa-fortnite.jpg", n: "Mapa Fortnite", p: fortnitePoints, s: 300},
}

export default tests