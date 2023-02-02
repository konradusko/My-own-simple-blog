import {createTime} from '../modules/getTime.mjs'
import path from 'path'
import fs from 'fs'
import {index_file} from './index_files.mjs'
import {cache} from './cache.mjs'
import {group_by_tag} from '../modules/groups.mjs'
//Processing files
function Content(){
    this.operationRunning = false
    this.contentProcessing = []
    this.queque = {}
    this.content = []
    this.lastUpdate = new Date().getTime()
    this.tags = []
    this.clearCache = cache.cleanAll
    this.group_tags_by_content = {}
}
Content.prototype.getTagWithGroup = function(tag){
    if(!this.group_tags_by_content[tag])
        return null
    return this.group_tags_by_content[tag]
}
Content.prototype.getTags = function(){
    return this.tags
}
Content.prototype.getTimeLastUpdate = function(){
    return this.lastUpdate
}
Content.prototype.operationStatus = function(){
    return this.operationRunning
}
Content.prototype.getContent = function(){
    return this.content
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
Content.prototype.check_queque = function(filename){
    delete this.queque[filename]
    if(Object.keys(this.queque).length === 0 ){
        console.log(`Start indexing files at time ${createTime()}`)
        console.log(this.contentProcessing.length,'sprawdzam przekazana dlugosc')
        index_file.create_index_for_files(this.contentProcessing,(err,content)=>{
            if(err){
                this.callBack(`Error while indexing files:${err} at time ${createTime()}`)
                delete this.callBack 
                return
            }
            let tmp_tags = []
            for(const single_content of content){
                for(const tags of single_content.tags){
                    if(!tmp_tags.includes(tags))
                        tmp_tags.push(tags)
                }
            }
            this.tags = tmp_tags
            this.content = content
            this.group_tags_by_content = group_by_tag(this.tags,this.content)
            this.contentProcessing = []
            this.queque = {}
            this.operationRunning = false
            this.clearCache((err,message)=>{
                if(err)
                    console.log(err)
                if(message)
                    console.log(message)
            this.callBack(null,'Local file loaded...')  
            delete this.callBack 
            })
             
        })
    }
      

}
Content.prototype.processFile = function(filename,filePath){
    let file_obj = {
        filename:filename
    }
    fs.stat(filePath,(err,stats)=>{
        if(err)
            return this.check_queque(filename)
        file_obj['birth_time'] = stats.birthtime
        file_obj['modify_time'] = stats.mtime
        fs.readFile(filePath,(err,buffer)=>{
            if(err)
                return this.check_queque(filename)
            file_obj['buffer'] = buffer
            this.contentProcessing.push(file_obj)
            return this.check_queque(filename)
        })
    })
}
Content.prototype.processContentFiles= function(array_files,path_content){
    if(!Array.isArray(array_files))
        return null
    array_files.forEach((filename)=>{
        //Adding to queuqe

        const filePath = path.join(path_content,filename)
        const file_name = filename.slice(0,-3)
        this.queque[file_name] = true
        return this.processFile(file_name,filePath)
    })
}
Content.prototype.loadContent = function(callback){
 
    if(this.operationRunning){
        if(callback)
            return callback('Operation is already running',null)
        return null
    }
    this.operationRunning = true
    this.lastUpdate = new Date().getTime()
    if(callback)
    this.callBack = callback
    console.log(`Loading content on time ${createTime()}`)
    const path_content = process.env['content_path'] || path.join('content')
    fs.readdir(path_content,(err,files)=>{
        if(err){
            if(this.callBack)
                return this.callBack('Error while loading files',null)
                return null
        }
           
        const filtered_files = this.filter_files(files)
        if(filtered_files.length ==0){
            if(this.callBack)
            return this.callBack('Error while loading files',null)
            return null
        }
        this.processContentFiles(filtered_files,path_content)
    })
}



export const content = new Content()