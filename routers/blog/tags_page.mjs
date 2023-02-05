
import { content } from '../../utils/content.mjs'
import {render_page} from '../../modules/render_page.mjs'
import { cache } from '../../utils/cache.mjs'
import { createErrorResponse } from '../../modules/createError.mjs'

export function tags_page(req,res){
    cache.getCache(req._parsedUrl.pathname,(err,cachedPage)=>{
        if(err){
            const tags = content.getTagsHrefs()
            return render_page({
                template:'tags.html',
                object:tags,
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