function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

const fs = require("fs")

const points = [
    {
        "x": 1657,
        "y": 1036,
        "n": "Wisła"
    },
    {
        "x": 1371,
        "y": 1147,
        "n": "Noteć"
    },
    {
        "x": 2233,
        "y": 1827,
        "n": "Pilica"
    },
    {
        "x": 2748,
        "y": 1824,
        "n": "Wieprz"
    },
    {
        "x": 2785,
        "y": 2373,
        "n": " San"
    },
    {
        "x": 2418,
        "y": 2615,
        "n": "Dunajec"
    },
    {
        "x": 557,
        "y": 1258,
        "n": "Odra"
    },
    {
        "x": 853,
        "y": 1922,
        "n": "Bóbr"
    },
    {
        "x": 1210,
        "y": 1851,
        "n": "Barycz"
    },
    {
        "x": 1297,
        "y": 2352,
        "n": "Nysa Kłodzka"
    },
    {
        "x": 2001,
        "y": 1598,
        "n": "Bzura"
    },
    {
        "x": 1519,
        "y": 1676,
        "n": "Prosna"
    },
    {
        "x": 1149,
        "y": 1312,
        "n": "Warta"
    },
    {
        "x": 1644,
        "y": 2282,
        "n": "Mała Panew"
    },
    {
        "x": 2014,
        "y": 2514,
        "n": "Krzeszówka"
    },
    {
        "x": 2721,
        "y": 1322,
        "n": "Bug"
    },
    {
        "x": 627,
        "y": 1824,
        "n": "Nysa Łużycka"
    },
    {
        "x": 2496,
        "y": 1275,
        "n": "Narew"
    },
    {
        "x": 2223,
        "y": 1312,
        "n": "Wkra"
    },
    {
        "x": 1671,
        "y": 831,
        "n": "Wda"
    },
    {
        "x": 2422,
        "y": 1195,
        "n": "Orzyc"
    },
    {
        "x": 1950,
        "y": 1067,
        "n": "Drwęca"
    },
    {
        "x": 792,
        "y": 1023,
        "n": "Ina"
    },
    {
        "x": 839,
        "y": 807,
        "n": "Rega"
    },
    {
        "x": 1254,
        "y": 568,
        "n": "Wieprza"
    },
    {
        "x": 1428,
        "y": 603,
        "n": "Słupia"
    },
    {
        "x": 2593,
        "y": 996,
        "n": "Pisa"
    },
    {
        "x": 2087,
        "y": 629,
        "n": "Pasłęka"
    },
    {
        "x": 2259,
        "y": 2326,
        "n": "Nida"
    },
    {
        "x": 2540,
        "y": 2460,
        "n": "Wisłoka"
    },
    {
        "x": 2799,
        "y": 976,
        "n": "Biebrza"
    },
    {
        "x": 1530,
        "y": 976,
        "n": "Brda"
    },
    {
        "x": 1883,
        "y": 2672,
        "n": "Soła"
    }
]


const data = JSON.stringify(points.map(point => ({...point, id: uuidv4()})))

fs.writeFileSync('./points.txt', data)