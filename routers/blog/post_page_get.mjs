import { content } from '../../utils/content.mjs'
import {render_page} from '../../modules/render_page.mjs'
import { cache } from '../../utils/cache.mjs'
import { createErrorResponse } from '../../modules/createError.mjs'
import { Module_config } from '../../modules/config.mjs'
import { get_template } from '../../modules/raw_display_json.mjs'
export function post_page_get(req,res){
    const params = req.params

    if(!('post' in params))
        return createErrorResponse('404')
    cache.getCache(Module_config.getConfig().template + req._parsedUrl.pathname,(err,cachedPage)=>{
        if(err){
            const content_local = content.getContent()
            const find_content = content_local.find((post)=>post.filename ==  params.post)
            if(!find_content)
                return createErrorResponse('404')
            if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true)
                return res.status(200).send(get_template(find_content))
            return render_page({
                template:'post.html',
                object:find_content,
                tag: req._parsedUrl.pathname
            },(err,page)=>{
                if(err)
                    return createErrorResponse('500',err)
                return res.status(200).send(page)  
            })
        }
        return res.status(200).send(cachedPage)  
    })

}