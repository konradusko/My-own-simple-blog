import { content } from '../../utils/content.mjs'
import { cache } from '../../utils/cache.mjs'
import { calculate_index_home_page } from '../../modules/calculate_index_page.mjs'
import { calcMaxPage } from '../../modules/groups.mjs'
import { createTime } from '../../modules/getTime.mjs'
import { render_page } from '../../modules/render_page.mjs'
import { createErrorResponse } from '../../modules/createError.mjs'
import { Module_config } from '../../modules/config.mjs'
import { get_template } from '../../modules/raw_display_json.mjs'
export function home_page_get(req,res){
    console.log( req.query)
    let page = !isNaN(req.query.page) ? Math.abs(Math.trunc(req.query.page)) : 1 || 1
    let content_local = content.getContent()
    if('query' in req.query && req.query.query.trim().length !=0){
        const query = req.query.query
        //We have search query
        const cache_path_query = req._parsedUrl.pathname +'engine_data_cache yes_query' + `_query=${query}`
        cache.getCache(cache_path_query,(err,cachedData)=>{
            let tmp_data;
            if(err){
                console.log(`There is no cache for ${cache_path_query } with query=${query}`)
                const filtered_by_query = content_local.filter((element)=>{
                    if(element.title.toLowerCase().includes(query)|| element.description.toLowerCase().includes(query)|| element.filename.toLowerCase().includes(query))
                        return element
                })
                tmp_data = calcMaxPage(filtered_by_query,'home')
                cache.createCache(cache_path_query,tmp_data,(err,message)=>{
                    if(err)
                        return createErrorResponse('500')
                    console.log(`Cache  at time ${createTime()}, page:${cache_path_query} for query ${query}`)
                    })
            }else{
                tmp_data = cachedData
            }
            if(page> tmp_data.max_page)
            return res.redirect( req._parsedUrl.pathname+`?page=1&query=${query}`)

       
            

            const chage_page_query =Module_config.getConfig().template + req._parsedUrl.pathname+`?page=${page}&query=${query}`
            cache.getCache( chage_page_query,(err,cachedPage)=> {
                if(err){
                    const data_to_redner = calculate_index_home_page({
                        content:tmp_data.filtered_content_by_query,
                        max_page:tmp_data.max_page,
                        posts_on_page:tmp_data.posts_on_page
                    },page,req._parsedUrl.pathname,query)


                    if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true)
                    return res.status(200).send(get_template(data_to_redner))

                    return render_page({
                        template:'home.html',
                        object:data_to_redner,
                        tag:  chage_page_query
                    },(err,page)=>{
                        if(err)
                            return createErrorResponse('500',err)
                        return res.status(200).send(page)  
                    })
                }else{

                    if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true){
                        const data_to_redner = calculate_index_home_page({
                            content:tmp_data.filtered_content_by_query,
                            max_page:tmp_data.max_page,
                            posts_on_page:tmp_data.posts_on_page
                        },page,req._parsedUrl.pathname,query)
                        return res.status(200).send(get_template(data_to_redner))
                    }
                

                    return res.status(200).send(cachedPage) 
                }
                
            })
        })

    }else{
        const cache_path_no_query = req._parsedUrl.pathname +'engine_data_cache no_query'
        cache.getCache(cache_path_no_query,(err,cachedData)=>{
            let tmp_data;
            if(err){
                console.log(`There is no cache for ${cache_path_no_query } without query`)
                tmp_data = calcMaxPage(content_local,'home')
                cache.createCache(cache_path_no_query,tmp_data,(err,message)=>{
                    if(err)
                        return createErrorResponse('500')
                    console.log(`Cache  at time ${createTime()}, page:${cache_path_no_query}`)
                    })
            }else{
                tmp_data = cachedData
            }
            if(page>tmp_data.max_page)
                return res.redirect( req._parsedUrl.pathname+`?page=1`)  
              
  
            const cache_page_no_query = Module_config.getConfig().template + req._parsedUrl.pathname+`?page=${page}`
            cache.getCache(cache_page_no_query,(err,cachedPage)=> {
                if(err){
                    const data_to_redner = calculate_index_home_page({
                        content:tmp_data.filtered_content_by_query,
                        max_page:tmp_data.max_page,
                        posts_on_page:tmp_data.posts_on_page
                    },page,req._parsedUrl.pathname,"")
                    if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true)
                    return res.status(200).send(get_template(data_to_redner ))
    
                    return render_page({
                        template:'home.html',
                        object:data_to_redner,
                        tag: cache_page_no_query
                    },(err,page)=>{
                        if(err)
                            return createErrorResponse('500',err)
                        return res.status(200).send(page)  
                    })
                }else{
                    if('getJsonData' in req.query && req.query.getJsonData == 'true' && Module_config.getConfig().allowJsonData == true){
                        const data_to_redner = calculate_index_home_page({
                            content:tmp_data.filtered_content_by_query,
                            max_page:tmp_data.max_page,
                            posts_on_page:tmp_data.posts_on_page
                        },page,req._parsedUrl.pathname,"")
                        return res.status(200).send(get_template(data_to_redner ))
                    }
                    return res.status(200).send(cachedPage)  
    
                }
              
            })
        })
    }
}