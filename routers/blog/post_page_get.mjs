import path from 'path'
import {__dirname} from '../../dirname.mjs'
import { content } from '../../utils/content.mjs'
import {render_page} from '../../modules/render_page.mjs'
import { cache } from '../../utils/cache.mjs'
export function post_page_get(req,res){
    const params = req.params
    if(!('post' in params))
        return res.status(404).sendFile(path.join(__dirname,'template','404.html'))
    cache.getCache(params.post,(err,cachedPage)=>{
        if(err){
            const content_local = content.getContent()
            const find_content = content_local.find((post)=>post.filename ==  params.post)
            if(!find_content)
                return res.status(404).sendFile(path.join(__dirname,'template','404.html'))
            return render_page({
                template:'post.html',
                object:find_content,
                tag: params.post
            },(err,page)=>{
                if(err)
                    return res.status(500).sendFile(path.join(__dirname,'template','500.html'))
                return res.status(200).send(page)  
            })
        }
        console.log('Uzycie cache')
        return res.status(200).send(cachedPage)  
    })

}