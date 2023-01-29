import express from 'express'
import dotenv from 'dotenv'
import ejs from 'ejs'
import { marked } from 'marked';
import fs from 'fs'

dotenv.config()
//Init
const PORT = 3000

import {Module_config } from './modules/config.mjs'
//read config file
console.log(`Loading configuration file...`)
Module_config.loadConfig()
const app = express()
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.set('views','./template')

app.get('/',(req,res)=>{
    
})

var server = app.listen(PORT, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Konradusko-blog listening at http://${host}:${port}`);
});