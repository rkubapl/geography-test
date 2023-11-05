const regionsPoints = [
    {x: 749, y: 757, name: "Pobrzeże Szczecińskie"},
    {x: 1252, y: 528, name: "Pobrzeże Koszalińskie"},
    {x: 2426, y: 800, name: "Pojezierze Mazurskie"},
    {x: 1223, y: 947, name: "Pojezierze Pomorskie"},
    {x: 2890, y: 1107, name: "Nizina Północnopodlaska"},
    {x: 685, y: 1444, name: "Pojezierze Lubuskie"},
    {x: 2250, y: 1420, name: "Nizina Mazowiecka"},
    {x: 2812, y: 1469, name: "Nizina Południowopodlaska"},
    {x: 2814, y: 2097, name: "Wyżyna Lubelska"},
    {x: 2278, y: 2171, name: "Wyżyna Małopolska"},
    {x: 1750, y: 2458, name: "Wyżyna Śląska"},
    {x: 1975, y: 2350, name: "Wyżyna Krakowsko-Częstochowska"},
    {x: 1025, y: 2506, name: "Sudety"},
    {x: 2139, y: 2907, name: "Karpaty"},
    {x: 1810, y: 634, name: "Żuławy Wiślane"},
    {x: 1297, y: 1378, name: "Pojezierze Wielkopolskie"},
    {x: 1600, y: 1764, name: "Nizina Południowowielkopolska"},
    {x: 1259, y: 2302, name: "Nizina Śląska"},
    {x: 2660, y: 2397, name: "Kotlina Sandomierska"},
]
const megaregionyPoints = [{"x":168,"y":165,"name":"Pozaalpejska Europa Środkowa"},{"x":346,"y":77,"name":"Niż Wschodnioeuropejski"},{"x":297,"y":336,"name":"Karpaty, Podkarpacie i Nizina Panońska"}]
const podprowincjePoints = [{"x":58,"y":54,"name":"Pobrzeża Południowobałtyckie"},{"x":298,"y":47,"name":"Pobrzeże Wschodniobałtyckie"},{"x":290,"y":71,"name":"Pojezierze Wschodniobałtyckie"},{"x":368,"y":126,"name":"Wysoczyzny Podlasko-Białoruskie"},{"x":386,"y":228,"name":"Polesie"},{"x":410,"y":284,"name":"Wyżyna Wołyńsko-Podolska"},{"x":356,"y":261,"name":"Wyżyna Lubelsko-Lwowska"},{"x":266,"y":266,"name":"Wyżyna Małopolska"},{"x":205,"y":289,"name":"Wyżyna Śląsko-Krakowska"},{"x":337,"y":299,"name":"Podkarpacie Północne"},{"x":239,"y":345,"name":"Zewnętrzne Karpaty Zachodnie"},{"x":247,"y":374,"name":"Centralne Karpaty Zachodnie"},{"x":356,"y":373,"name":"Zewnętrzne Karpaty Wschodnie (Beskidy Wschodnie)"},{"x":67,"y":231,"name":"Niziny Sasko-Łużyckie"},{"x":88,"y":272,"name":"Sudety z Przedgorzem Sudeckim"},{"x":216,"y":202,"name":"Niziny Środkowopolskie"},{"x":129,"y":116,"name":"Pojezierza Południowobałtyckie"}]
const prowincjePoints = [{"x":179,"y":161,"name":"Niż Środkowoeuropejski"},{"x":85,"y":271,"name":"Masyw Czeski"},{"x":279,"y":272,"name":"Wyżyny Polskie"},{"x":351,"y":87,"name":"Niż Wschodniobałtycko-Białoruski"},{"x":409,"y":281,"name":"Wyżyny Ukraińskie"},{"x":290,"y":331,"name":"Karpaty Zachodnie z Podkarpaciem Zachodnim i Północnym"},{"x":357,"y":374,"name":"Karpaty Wschodnie z Podkarpaciem Wschodnim"}]
const pradolinyPoints = [{"x":164,"y":23,"name":"Pradolina Redy-Łeby"},{"x":80,"y":69,"name":"Pradolina Pomorska"},{"x":325,"y":125,"name":"Pradolina Biebrzy i Narwi"},{"x":114,"y":138,"name":"Pradolina Toruńsko-Eberswaldzka"},{"x":148,"y":196,"name":"Pradolina Warszawsko-Berlińska"},{"x":101,"y":230,"name":"Pradolina Barucko-Głogowska"},{"x":115,"y":271,"name":"Pradolina Wrocławsko-Magdeburska"},{"x":273,"y":321,"name":"Pradolina Górnej Wisły"},{"x":340,"y":327,"name":"Pradolina Podkarpacka"},{"x":313,"y":231,"name":"Pradolina Pillcy-Wieprza-Krzny"}]

const tests = {
    "krainy": {name: "Krainy geograficzne", points: regionsPoints, map: "mapa-1.png", pointSize: 300},
    "megaregiony": {name: "Megaregiony", points: megaregionyPoints, map: "mapa-2.jpg", pointSize: 100},
    "prowincje": {name: "Prowincje", points: prowincjePoints, map: "mapa-2.jpg", pointSize: 70},
    "podprowincje": {name: "Podrowincje", points: podprowincjePoints, map: "mapa-2.jpg", pointSize: 70},
    "pradoliny": {name: "Pradoliny", points: pradolinyPoints, map: "mapa-pradoliny.jpg", pointSize: 70, defaultFlip: true},
}

export default tests