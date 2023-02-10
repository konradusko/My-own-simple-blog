import express from 'express'
import ejs from 'ejs'
import { middlewares } from './middlewares.mjs';
const app = express()
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.set('views','./template')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
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
console.log('test')
import { tags_page } from '../routers/blog/tags_page.mjs';
console.log(tags_page)
app.get('/tags',tags_page)
//handle errors
import {handleError} from '../routers/blog/handle_error.mjs'
app.use(handleError)
import {page_not_found} from '../routers/blog/handle_error.mjs'
app.use('*',page_not_found)
export {app}