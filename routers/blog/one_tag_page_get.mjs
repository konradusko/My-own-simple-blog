import { createErrorResponse } from '../../modules/createError.mjs'
import { cache } from '../../utils/cache.mjs'
import { content } from '../../utils/content.mjs'
import { calculate_index_tag_page } from '../../modules/calculate_index_page.mjs'
import { render_page } from '../../modules/render_page.mjs'
import { calcMaxPage } from '../../modules/groups.mjs'
import { createTime } from '../../modules/getTime.mjs'
import { Module_config } from '../../modules/config.mjs'
import { get_template } from '../../modules/raw_display_json.mjs'
export function one_tag_page_get(req,res){
    const params = req.params
    if(!('tag' in params))
    return createErrorResponse('404')

    let page = !isNaN(req.query.page) ? Math.abs(Math.trunc(req.query.page)) : 1 || 1
    const content_local = content.getTagWithGroup(params.tag)
    if(!content_local)
        return createErrorResponse('404') 

    if('query' in req.query && req.query.query.trim().length !=0){
        //Now we have page with search query
        const query = req.query.query
        const query_tag_cache_search = req._parsedUrl.pathname+`query_cache=${query}`
        cache.getCache(query_tag_cache_search,(err,cacheQuery)=>{
            let cache_tmp;
            if(err){
                console.log(`There is no cache for query ${query} at ${req._parsedUrl.pathname}`)
                const filtered_by_query = content_local.content.filter((element)=>{
                    if(element.title.toLowerCase().includes(query)|| element.description.toLowerCase().includes(query)|| element.filename.toLowerCase().includes(query))
                        return element
                })
                cache_tmp = calcMaxPage(filtered_by_query)
                cache.createCache(query_tag_cache_search,cache_tmp,(err,message)=>{
                    if(err)
                        return createErrorResponse('500')
                    console.log(`Cache query:${query} at time ${createTime()}, tag:${params.tag}`)
                    })
            }else{
                console.log(`Used cache for query ${query}`)
                cache_tmp = cacheQuery
            }
            if(page> cache_tmp.max_page)
            return res.redirect( req._parsedUrl.pathname+`?page=1&query=${query}`)


            const cache_tag_to_save = Module_config.getConfig().template +req._parsedUrl.pathname+`?page=${page}&query=${query}`
            cache.getCache(cache_tag_to_save,(err,cachedPage)=>{
                if(err){
                    const data_to_redner = calculate_index_tag_page({
                        content:cache_tmp.filtered_content_by_query,
                        max_page:cache_tmp.max_page,
                        posts_on_page:cache_tmp.posts_on_page
                    },page,params.tag,query)
                    
                    if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true)
                    return res.status(200).send(get_template(data_to_redner))
                    return render_page({
                        template:'single_tag_page.html',
                        object:data_to_redner,
                        tag: cache_tag_to_save
                    },(err,page)=>{
                        if(err)
                            return createErrorResponse('500',err)
                        return res.status(200).send(page)  
                    })
                }else{
                    if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true){
                        const data_to_redner = calculate_index_tag_page({
                            content:cache_tmp.filtered_content_by_query,
                            max_page:cache_tmp.max_page,
                            posts_on_page:cache_tmp.posts_on_page
                        },page,params.tag,query)
                        return res.status(200).send(get_template(data_to_redner))

                    }
                    return res.status(200).send(cachedPage)  
                }
             
            })
        })
       
       
    }else{
        //We are looking only for tag so we can cache this page
        //If page is larger than max page we redirect to first page
        if(page> content_local.max_page)
            return res.redirect( req._parsedUrl.pathname+`?page=1`)
        const cache_tag = Module_config.getConfig().template + req._parsedUrl.pathname+`?page=${page}`
        cache.getCache(cache_tag,(err,cachedPage)=>{
            if(err){
                const data_to_redner = calculate_index_tag_page({
                    content:content_local.content,
                    max_page:content_local.max_page,
                    posts_on_page:content_local.posts_on_page
                },page,params.tag,"")
                if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true)
                return res.status(200).send(get_template(data_to_redner))
                return render_page({
                    template:'single_tag_page.html',
                    object:data_to_redner,
                    tag: cache_tag
                },(err,page)=>{
                    if(err)
                        return createErrorResponse('500',err)
                    return res.status(200).send(page)  
                })
            }else{
                if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true){
                    const data_to_redner = calculate_index_tag_page({
                        content:content_local.content,
                        max_page:content_local.max_page,
                        posts_on_page:content_local.posts_on_page
                    },page,params.tag,"")
                return res.status(200).send(get_template(data_to_redner))

                }
                return res.status(200).send(cachedPage)  
            }
  
        })
    }
}