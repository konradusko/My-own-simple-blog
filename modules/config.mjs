import fs from 'fs'
import * as yaml from 'js-yaml'
import path from 'path'
function Config(){
    this.config = null
}
Config.prototype.loadConfig = function(cb){
    try {
        if(!this.config){
            const config_file = process.env['config_file_path'] || path.join('config.yaml');
            this.config = yaml.load(fs.readFileSync(config_file,'utf-8'));
            if(cb)
                return cb(null,`Config has been loaded`)
        } 
    } catch (error) {
        console.log(`Error while loaded config`)
        console.log(error)
        if(cb)
            return cb('Failed to Load config',null)
    }
 
}
Config.prototype.reloadConfig = function(cb){
    this.config = null
    this.loadConfig((err,message)=>{
        if(err){
            if(cb)
                return cb(err,null)
                console.log(err)
        }
        if(cb)
        return cb(null,message)
        console.log(message)
    })
}
Config.prototype.getConfig = function(){
        return this.config
}

export const Module_config = new Config()