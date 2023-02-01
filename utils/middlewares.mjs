
import {Module_config } from '../modules/config.mjs'
import {content} from './content.mjs'
import {createTime} from '../modules/getTime.mjs'
function Middlewares(){

}

Middlewares.prototype.checkUpdate = function(req,res,next){
    next()
    console.log('Middleware sprawdza')
    const current_date = new Date().getTime()
    if(current_date > content.getTimeLastUpdate() +(Module_config.getConfig().cacheRefreshTime * 3600000) && !content.operationStatus()  ){
        console.log(`Start refreshing cache at time: ${createTime()}`)
        content.loadContent((err,message)=>{
            if(err)
                console.log(err)
            console.log(message)
        })
    }

}



export const middlewares = new Middlewares()