import { createErrorResponse } from '../../modules/createError.mjs'
import { cache } from '../../utils/cache.mjs'
import { content } from '../../utils/content.mjs'
export function one_tag_page_get(req,res){
    const params = req.params
    console.log(req.query)
    console.log()
    if(!('tag' in params))
    return createErrorResponse('404')

    let page = typeof req.query.page == 'number'? Math.trunc(req.query.page) : 1 || 1
    const content_local = content.getTagWithGroup(params.tag)
    if(!content_local)
        return createErrorResponse('404') 
    if(page> content_local.max_page)
        page = content_local.max_page
    if('query' in req.query && req.query.query.trim().length !=0){
        //Now we have page with search query
    }else{
        //We are looking only for tag so we can cache this page
        cache.getCache(req._parsedUrl.pathname+`page=${page}`,(err,cachedPage)=>{
            if(err){
                console.log(params.tag)
              
         
                console.log(content_local)
                console.log(page)
            }
    
            return res.status(200).send(cachedPage)  
        })
    }
}