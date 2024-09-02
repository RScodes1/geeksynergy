
const express = require('express');
require('dotenv').config()
const {connection } = require('./config/db');
const {userRoute} = require('./routes/user.routes');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());

app.use(cors());

app.use("/users", userRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.listen(process.env.port, async()=>{
    try {
        await connection
        console.log("mongodb is connected");
        console.log(`server running on http://localhost:${process.env.port}`);
    } catch (error) {
        console.error(error);
    }
})