import {createTime} from '../modules/getTime.mjs'
import path from 'path'
import fs from 'fs'
import utils from 'util'
//Processing files
function Content(){

}
Content.prototype.check_md_type = function(name){
    if(typeof name != 'string')
        return false
    if(name.slice(-3) === '.md')
        return true
    return false
}
Content.prototype.filter_files = function(array_files){
    if(!Array.isArray(array_files))
        return []
    const checker = array_files.filter((file_name)=>{
        if(typeof file_name == 'string' && this.check_md_type(file_name))
            return file_name
    })
    return checker
}
Content.prototype.processFile = function(filename,filePath){
    let file_obj = {
        filename:filename
    }
    fs.stat(filePath,(err,stats)=>{
        if(err)
            return null
        console.log(stats.birthtime)
        console.log(stats.mtime)
    })
}
Content.prototype.processContentFiles= function(array_files,path_content){
    if(!Array.isArray(array_files))
        return null
    const cb = 
    array_files.forEach((filename)=>{
        const filePath = path.join(path_content,filename)
        console.log(filePath)
        const file_name = filename.slice(-3)
        return this.processFile(file_name,filePath)
    })
}
Content.prototype.loadContent = function(){
    console.log(`Loading content on time ${createTime()}`)
    const path_content = process.env['content_path'] || path.join('content')
    fs.readdir(path_content,(err,files)=>{
        if(err)
            return null
        const filtered_files = this.filter_files(files)
        if(filtered_files.length ==0)
            return null
        this.processContentFiles(filtered_files,path_content)
    })
}



export const content = new Content()