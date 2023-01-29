import express from 'express'
import dotenv from 'dotenv'
import ejs from 'ejs'
import { marked } from 'marked';
import fs from 'fs'
import {content} from './utils/content.mjs'
import {Module_config } from './modules/config.mjs'
dotenv.config()
//Init
const PORT = 3000


//read config file
console.log(`Loading configuration file...`)
Module_config.loadConfig()
console.log(Module_config.getConfig())
const app = express()
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.set('views','./template')


//1. Wczytanie w tle wszystkich blogów razem z tagami
//2. Co x czasu odświeżanie ich - sprawdzanie czy nie wpadły nowe

//Loading content

content.loadContent()
app.get('/',(req,res)=>{

})

var server = app.listen(PORT, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Konradusko-blog listening at http://${host}:${port}`);
});