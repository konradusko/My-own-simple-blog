import fs from 'fs'
import * as yaml from 'js-yaml'
import path from 'path'
function Config(){
    this.config = null
}
Config.prototype.loadConfig = function(){
    if(!this.config){
        const config_file = process.env['config_file_path'] || path.join('config.yaml');
        this.config = yaml.load(fs.readFileSync(config_file,'utf-8'));

    }
}
Config.prototype.getConfig = function(){
        return this.config
}

export const Module_config = new Config()