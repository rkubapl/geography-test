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

# How to add your own test
- Create test by going to `/create` page
- Get base64 data from query (`?data=base64`) and decode it using base64
- Paste decoded data to the tests array in `data.js` file
```js
const tests = {
    "countries": {n: "European Countries", p: [{x:168,y:165,n:"Poland"},{x:324,y:53,n:"Italy"}], i: "https://geografia.rkuba.pl/maps/map-eu.png", s: 300}
}
```

## License

The Geography Test app is licensed under the [MIT License](https://github.com/rkubapl/geography-test/blob/master/LICENSE). Feel free to modify and use it according to your needs.
