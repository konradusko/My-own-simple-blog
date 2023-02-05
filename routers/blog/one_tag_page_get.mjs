import { createErrorResponse } from '../../modules/createError.mjs'
import { cache } from '../../utils/cache.mjs'
import { content } from '../../utils/content.mjs'
import { calculate_index_tag_page } from '../../modules/calculate_index_tag_page.mjs'
import { render_page } from '../../modules/render_page.mjs'
import { calcMaxPage } from '../../modules/groups.mjs'
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
        page = 1
    if('query' in req.query && req.query.query.trim().length !=0){
        //Now we have page with search query
        const query = req.query.query

        //first check cache before calculate content
        const cache_tag_to_search = req._parsedUrl.pathname+`?page=${page}&query=${query}`
        cache.getCache(cache_tag_to_search ,(err,cachedPage)=>{
            if(err){
                //There is no cache
            }
        })
        return

        //get content only with 
        //filter content by title,filename and description
        const filtered_by_query = content_local.content.filter((element)=>{
            if(element.title.toLowerCase().includes(query)|| element.description.toLowerCase().includes(query)|| element.filename.toLowerCase().includes(query))
                return element
        })
        const {filtered_content_by_query,max_page,
            posts_on_tag} = calcMaxPage(filtered_by_query)
        if(page> max_page)
        page = 1
        const cache_tag_to_save = req._parsedUrl.pathname+`?page=${page}&query=${query}`
        cache.getCache(cache_tag_to_save,(err,cachedPage)=>{
            if(err){
                const data_to_redner = calculate_index_tag_page({
                    content:filtered_content_by_query,
                    max_page:max_page,
                    posts_on_tag:posts_on_tag
                },page,params.tag,query)
                return render_page({
                    template:'single_tag_page.html',
                    object:data_to_redner,
                    tag: cache_tag_to_save
                },(err,page)=>{
                    if(err)
                        return createErrorResponse('500',err)
                    return res.status(200).send(page)  
                })
            }
            return res.status(200).send(cachedPage)  
        })
    }else{
        //We are looking only for tag so we can cache this page
        const cache_tag = req._parsedUrl.pathname+`?page=${page}`
        cache.getCache(cache_tag,(err,cachedPage)=>{
            if(err){
                console.log(params.tag)
                const data_to_redner = calculate_index_tag_page({
                    content:content_local.content,
                    max_page:content_local.max_page,
                    posts_on_tag:content_local.posts_on_tag
                },page,params.tag,"")
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
            return res.status(200).send(cachedPage)  
        })
    }
}