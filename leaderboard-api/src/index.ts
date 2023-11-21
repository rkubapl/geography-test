import userRoute from "./routes/user.route";
import cors from "cors"

require('dotenv').config();

import Database from "./database";
import resultRoute from "./routes/result.route";
new Database(process.env.MONGODB);

const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

// app.use('/api/operation', operationRoute);
app.use('/api/result', resultRoute);
app.use('/api/user', userRoute);

app.listen(port);

console.log('✔ Geography-api backend started on port ' + port);