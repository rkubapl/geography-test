# Geography Test Web App

Geography Test is a web app that helps you learn geography maps by allowing you to create and take your own tests on geographical regions. It's similar to Seterra, but you have the abbility to add your own tests.

You can try the live version of the app here:
- [geografia.rkuba.pl](https://geografia.rkuba.pl)
- [geography-test.vercel.app](https://geography-test.vercel.app)
- [geography-test.pages.dev](https://geography-test.pages.dev)

# Screenshots
![test](https://i.imgur.com/NucaKEn.png)

# Story
I created this app to prepare for a geography test. Some time ago the teacher recommended learning European countries using Seterra and I liked it. However, I couldn't find test for geographical regions of Poland, so I decided to create my own website.

# Setup
### Requirements
- [NodeJS](https://nodejs.org/) and NPM (I used Node 18.13.0)

### Setup
- Download or clone the repository
- Install dependencies using `npm install`
- Run development version using `npm run dev` or build the app using `npm run build`.  After the build, you can find the production-ready version in the `build/` directory.

# How to create your own test
- Edit `data.js` file by adding your own test and points. Add an test with empty points to `tests` object.
```js
const tests = {
    "countries": {name: "European Countries", points: [], map: "map-eu.png", pointSize: 300}
}
```
- Edit the `GeoTest.js` file by setting `creatorMode` variable to `true`.
- Go to test f.e. `/test/countries` and add the points by clicking the map. 
- Paste array of points (you can find it on the top of website) to the test object
```js
const tests = {
    "countries": {name: "European Countries", points: [{"x":168,"y":165,"name":"Poland"},{"x":324,"y":53,"name":"Italy"}], map: "map-eu.png", pointSize: 300}
}
```
- Adjust points size to your needs (`pointSize` variable).

## License

The Geography Test app is licensed under the [MIT License](https://github.com/rkubapl/geography-test/blob/master/LICENSE). Feel free to modify and use it according to your needs.
