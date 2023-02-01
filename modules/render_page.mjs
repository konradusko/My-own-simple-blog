import ejs from 'ejs'
import path from 'path'
import { __dirname } from '../dirname.mjs'
import fs from 'fs'
import { cache } from '../utils/cache.mjs'
import { createTime } from './getTime.mjs'
export const render_page = ({
    template,
    object,
    tag
},cb)=>{
    try {
        const page = ejs.render(fs.readFileSync(path.join(__dirname,'template',template),'utf-8').toString(),{data:object})
        cache.createCache(tag,page,(err,message)=>{
            console.log(`Cache Page at time ${createTime()}, tag:${tag}`)
            if(err)
                return cb('Error while caching page',null)
            return cb(null,page)
        })   
    } catch (error) {
        return cb('Error while caching page',null)
    }
    
}