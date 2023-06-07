import express from 'express';
import route from "./route.js";

import bp from "body-parser";

const PORT = 9911;
const app = express()

app.use(bp.json());

app.use(express.json());

app.use('/sborusapi', route);

async function startApp() {
    try {
        app.listen(PORT, () => console.log('started'))
    } catch (e) {
        console.log(e)
    }
}
startApp().then(r => console.log(r));