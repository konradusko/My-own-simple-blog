
import { content } from '../../utils/content.mjs'
import {render_page} from '../../modules/render_page.mjs'
import { cache } from '../../utils/cache.mjs'
import { createErrorResponse } from '../../modules/createError.mjs'
import { Module_config } from '../../modules/config.mjs'
import { get_template } from '../../modules/raw_display_json.mjs'
export function tags_page(req,res){
    cache.getCache( Module_config.getConfig().template + req._parsedUrl.pathname,(err,cachedPage)=>{
        if(err){
            const tags = content.getTagsHrefs()
            if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true)
            return res.status(200).send(get_template(tags))
            return render_page({
                template:'tags.html',
                object:tags,
                tag: req._parsedUrl.pathname
            },(err,page)=>{
                if(err)
                    return createErrorResponse('500',err)
                return res.status(200).send(page)  
            })
        }else{
            if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true)
                return res.status(200).send(get_template(content.getTagsHrefs()))
        return res.status(200).send(cachedPage)  
    
}})
}