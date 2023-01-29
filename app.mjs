import express from 'express'
import dotenv from 'dotenv'
import ejs from 'ejs'
import { marked } from 'marked';
import fs from 'fs'
import {content} from './utils/content.mjs'
import {Module_config } from './modules/config.mjs'
import {middlewares} from './utils/middlewares.mjs'
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


//Loading content

content.loadContent(function(err,message){
    if(err){
        console.log(err)
        return 
    }
    console.log(message)
    app.get('/',middlewares.checkUpdate,(req,res)=>{
        console.log(content.getTags())
        res.send(';)')
    })
    

    var server = app.listen(PORT, function () {
        const host = server.address().address;
        const port = server.address().port;
        console.log(`Konradusko-blog listening at http://${host}:${port}`);
    });

})

