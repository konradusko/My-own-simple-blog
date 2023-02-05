import path from 'path'
import {__dirname} from '../../dirname.mjs'
import fs from 'fs'
import { Module_config } from '../../modules/config.mjs'
import { cache } from '../../utils/cache.mjs'
import { createTime } from '../../modules/getTime.mjs'
export function page_not_found(req,res){
    try {
        const cache_path_search = `Engine, page:404.html`
        cache.getCache(cache_path_search,(err,page)=>{
            if(err){
                fs.readFile(path.join(__dirname,'template',Module_config.getConfig().template,'404.html'),(err,data)=>{
                    if(err)
                        return res.status(404).send('Wystąpił błąd')  
                    cache.createCache(cache_path_search,data.toString(),(err,message)=>{
                        if(err)
                            console.log(err)
                        if(message)
                            console.log(`Create cache for ${cache_path_search} at time ${createTime()}`)
                    })
                    return res.status(404).send(data.toString())
                })
            }else{
                    return res.status(404).send(page)
            }
        })
   
    } catch (error) {
        res.status(404).send('Wystąpił błąd')        
    }
}
export function handleError(err, req, res, next){
    function sendToClient(staticPage,status){
        const cache_path_search = `Engine, page:${staticPage}`
        try {

            cache.getCache(cache_path_search,(err,page)=>{
                if(err){
                    fs.readFile(path.join(__dirname,'template',Module_config.getConfig().template,staticPage),(err,data)=>{
                        if(err)
                            return res.status(status).send('Wystąpił błąd')  
                        cache.createCache(cache_path_search,data.toString(),(err,message)=>{
                            if(err)
                                console.log(err)
                            if(message)
                                console.log(`Create cache for ${cache_path_search} at time ${createTime()}`)
                        })
                        return res.status(status).send(data.toString())
                    })
                }else{
                        return res.status(status).send(page)
                }
            })
        } catch (error) {
            res.status(status).send('Wystąpił błąd')        
        }
    }
 
    if('status' in err && 'message' in err){
        switch (err.status) {
            case "404":
                sendToClient(`404.html`,404)
                break;
            case "500":
            default:
                //Status 500 and others that doesn't match
                console.log(`New error ocurred: status:${err.status}, message:${err.message}`)
                sendToClient(`500.html`,500)
                break;
        }
    }else{
        console.log(`New error ocurred: ${err}`)
        sendToClient(`500.html`,500)  
    }
    

    
}