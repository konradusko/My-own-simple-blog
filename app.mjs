import express from 'express'

const PORT = 3000
const app = express()



var server = app.listen(PORT, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Konradusko-blog listening at http://${host}:${port}`);
});