<div align="center">
  <a href="https://geografia.rkuba.pl"><img src="https://raw.githubusercontent.com/rkubapl/geography-test/master/frontend/public/logo.png" alt="Logo" width="200"></a>
  <br>
  <h1>Geography Test Web App</h1>
  <h3><a href="https://geografia.rkuba.pl" target="_blank">Live Version</a></h3>
  <br>
</div>

[![wakatime](https://wakatime.com/badge/user/a0c4550d-7e34-41b0-9e32-d67f272398e0/project/018b68a7-a1ba-4725-8330-742751fc6dce.svg)](https://wakatime.com/badge/user/a0c4550d-7e34-41b0-9e32-d67f272398e0/project/018b68a7-a1ba-4725-8330-742751fc6dce)

Geography Test is a web application designed to facilitate learning of geographical maps by enabling the creation and completion of personalized tests on various geographical regions. Similar to Seterra, but it allows users to craft their own tests for free. The logo was generated using [DALL-E 2](https://openai.com/dall-e-2).

You can experience the live version of the app here:
- [geografia.rkuba.pl](https://geografia.rkuba.pl)
- [geography-test.vercel.app](https://geography-test.vercel.app)
- [geography-test.pages.dev](https://geography-test.pages.dev)

# Features
- Two test modes: click on a point by its name or display point name by clicking on the point.
- Catalog API: access list of tests from API
- Ability to create custom tests by providing an image URL (from allowed domains) and clicking on points on the map in the creator. Data is included in created url encoded using base64 `https://geografia.rkuba.pl/customTest?data=eyJuIjoiZHNhZGFzIiwicyI6MzAwLCJp...`
- Capability to create an account and upload test results.
- Leaderboard for tests (results are sorted by points calculated based on time and accuracy).
- Personal user statistics (records, recently taken tests).

# Screenshots
![screenshot1](https://i.imgur.com/zz23ULE.png)
![screenshot2](https://i.imgur.com/dPUu7yy.png)

# Background
I created this app to prepare for a geography test. Some time ago the teacher recommended learning European countries using Seterra and I liked it. However, I couldn't find test for geographical regions of Poland, so I decided to create my own website.

# Setup
## Frontend
### Requirements
- [NodeJS](https://nodejs.org/) and NPM (Node 18.13.0 was utilized)

### Instructions
- Download or clone the repository.
- Go to folder by `cd frontend/`
- Install dependencies using `npm install`.
- Run the development version with `npm run dev` or build the app using `npm run build`. Upon completion of the build process, the production-ready version will be available in the `build/` directory.
- For production you can use [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/#deploy-with-cloudflare-pages) or [Vercel](https://vercel.com/docs/deployments/overview).

## Catalog API
### Requirements
- [Cloudflare account](https://www.cloudflare.com/)
- [NodeJS](https://nodejs.org/) and NPM
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) -  `npm install -g @cloudflare/wrangler`

### Instructions
- Download or clone the repository.
- Go to folder by `cd catalog-api/`
- Log in to your [Cloudflare account or create one](https://dash.cloudflare.com/login). Create D1 Database by navigating to Workers & Pages > D1 > Create Database > Dashboard. Copy the database ID and name.
- Use `wrangler login` to log in to your Cloudflare account via wrangler.
- Rename `wrangler.example.toml` to `wrangler.toml` and replace `DATABASE_NAME` and `Database_ID` with copied ones from second step.
- Execute `wrangler publish`. The console will provide the worker's URL, something like `https://geography-test-api.<your nickname>.workers.dev`. Add this URL to the frontend's environmental variables as `REACT_APP_API_CATALOG_URL`.

## Leaderboard API
### Requirements
- [NodeJS](https://nodejs.org/) and NPM
- [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)

### Instructions
For Docker Compose users:
- Utilize `docker-compose up` if Docker Compose is installed on your machine.

For development and production versions:
- Download or clone the repository.
- Go to folder by `cd leaderboard-api/` and install dependencies using `npm install`.
- Rename `.env.example` to `.env`. Set `MONGODB` to your MongoDB database URI and `TOKEN_SECRET` to a secure, lengthy random string (utilized for password hashing).
- Run `npm run dev` for development or `npm run build` for production. The build output can be found in `dist/`.

## License
The Geography Test app is licensed under the [MIT License](https://github.com/rkubapl/geography-test/blob/master/LICENSE). Feel free to modify and use it in accordance with your requirements.