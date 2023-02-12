import express from 'express'
import ejs from 'ejs'
import { middlewares } from './middlewares.mjs';
import { __dirname } from '../dirname.mjs';
import morgan from 'morgan';
import fs from 'fs'
import path from 'path'
const app = express()

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream, skip:function(req,res){
    if(req.url.toLowerCase().includes(`/style/`) || req.url.toLowerCase().includes(`/favicon/`) )
        return true
    return false
} }))
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.set('views','./template')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/public", express.static(__dirname + "/public"));
app.use("/ftp/static", express.static(__dirname + "/public_FTP"));
app.all('/*', middlewares.checkUpdate)
//home page handler
import {home_page_get} from '../routers/blog/home_page_get.mjs'
app.get('/',home_page_get)
//posts handler
import {post_page_get} from '../routers/blog/post_page_get.mjs'
app.get('/posts/:post',post_page_get)
//single tags handler
import {one_tag_page_get} from '../routers/blog/one_tag_page_get.mjs'
app.get('/tag/:tag',one_tag_page_get)
import { tags_page } from '../routers/blog/tags_page.mjs';
app.get('/tags',tags_page)

app.get('/robots.txt', function(req, res) {
    res.set('Content-Type', 'text/plain');
    res.end();
});



//handle errors
import {handleError} from '../routers/blog/handle_error.mjs'
app.use(handleError)
import {page_not_found} from '../routers/blog/handle_error.mjs'
app.use('*',page_not_found)
export {app}