import path from 'path'
import {__dirname} from '../../dirname.mjs'
import { content } from '../../utils/content.mjs'
export function post_page_get(req,res){

    console.log(req)
    const params = req.params
    console.log(__dirname)
    if(!('post' in params))
        return res.sendFile(path.join(__dirname,'template','404.html'))
    console.log(content.getContent())

}