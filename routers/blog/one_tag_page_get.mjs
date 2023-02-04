import { createErrorResponse } from '../../modules/createError.mjs'
import { cache } from '../../utils/cache.mjs'
import { content } from '../../utils/content.mjs'
import { calculate_index_tag_page } from '../../modules/calculate_index_tag_page.mjs'
import { render_page } from '../../modules/render_page.mjs'
export function one_tag_page_get(req,res){
    const params = req.params
    console.log(req.query)
    console.log()
    if(!('tag' in params))
    return createErrorResponse('404')

    let page = !isNaN(req.query.page) ? Math.abs(Math.trunc(req.query.page)) : 1 || 1
    console.log(page,'to jest to')
    const content_local = content.getTagWithGroup(params.tag)
    if(!content_local)
        return createErrorResponse('404') 
    if(page> content_local.max_page)
        page = content_local.max_page
    if('query' in req.query && req.query.query.trim().length !=0){
        //Now we have page with search query
    }else{
        //We are looking only for tag so we can cache this page
        console.log('ehheehe')
        console.log(req._parsedUrl.pathname)
        const cache_tag = req._parsedUrl.pathname+`page=${page}`
        cache.getCache(cache_tag,(err,cachedPage)=>{
            if(err){
                console.log(params.tag)
                const data_to_redner = calculate_index_tag_page(content_local,page,params.tag,"")
                return render_page({
                    template:'single_tag_page.html',
                    object:data_to_redner,
                    tag: cache_tag
                },(err,page)=>{
                    if(err)
                        return createErrorResponse('500',err)
                    return res.status(200).send(page)  
                })
            }
            console.log('Uzycie cahce')
            return res.status(200).send(cachedPage)  
        })
    }
}