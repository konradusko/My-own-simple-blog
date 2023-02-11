import {marked} from 'marked'
function Indexing_file_module(){
    this.processed_data = []
}

Indexing_file_module.prototype.getTitle = function(string){
    if(typeof string != 'string')
        return ''
    const reg_title = RegExp(/\[konradusko:title](.*)\[\/konradusko:title]/)
    const search = reg_title.exec(string)
    if(!search)
        return ''
    return search[1]
}
Indexing_file_module.prototype.getTags = function(string){
    if(typeof string != 'string')
    return []
    let tags_array = []
    const reg_tags = RegExp(/\[konradusko:tag](.*)\[\/konradusko:tag]/g)
    const not_global = RegExp(/\[konradusko:tag](.*)\[\/konradusko:tag]/)
    const match_tags = string.match(reg_tags)
    if(!match_tags)
        return []
    for(const tags of match_tags){
        const output = not_global.exec(tags)
        if(output)
            tags_array.push(output[1].trim())
    }
    //remove duplicate
    return  [...new Set(tags_array)];
}
Indexing_file_module.prototype.getDescription = function(string){
    if(typeof string != 'string')
    return ''
    const reg_title = RegExp(/\[konradusko:description](.*)\[\/konradusko:description]/)
    const search = reg_title.exec(string)
    if(!search)
        return ''
    return search[1]
}
Indexing_file_module.prototype.getImage = function(string){
    if(typeof string != 'string')
    return ''
    const reg_title = RegExp(/\[konradusko:image](.*)\[\/konradusko:image]/)
    const search = reg_title.exec(string)
    if(!search)
        return ''
    return search[1]
}
Indexing_file_module.prototype.getAuthor = function(string){
    if(typeof string != 'string')
    return ''
    const reg_title = RegExp(/\[konradusko:author](.*)\[\/konradusko:author]/)
    const search = reg_title.exec(string)
    if(!search)
        return ''
    return search[1] 
}
Indexing_file_module.prototype.handle_one_content = function(content,cb){
    let buffer_to_string = content.buffer.toString()
    let obj_for_index = {
        title:this.getTitle(buffer_to_string).trim(),
        tags:this.getTags(buffer_to_string),
        image: this.getImage(buffer_to_string).trim(),
        description:this.getDescription(buffer_to_string).trim(),
        content:marked(buffer_to_string.replace(/\[konradusko:(.*)\[\/konradusko:(.*)]/g,'')),
        author:this.getAuthor(buffer_to_string).trim(),
        filename:content['filename'],
        birth_time:content['birth_time'],
        modify_time:content['modify_time'],
        link:'/posts/' + content['filename'],
        nextPage:null,
        prevPage:null
    }
    this.processed_data.push(obj_for_index)

}
Indexing_file_module.prototype.create_index_for_files = function(contentProcessing,cb){
    if(!Array.isArray(contentProcessing))
        return cb('ContentProcessing is not array',null)
    if(contentProcessing.length === 0 )
        return cb('ContentProcessing array is empty',null)

    contentProcessing.forEach((content)=>{
        return this.handle_one_content(content)
    })
    this.processed_data = this.processed_data.sort(function(a,b){
        return b.birth_time.getTime() - a.birth_time.getTime()
    })
    for(let i = 0;i<this.processed_data.length ;i++){
        const _current_number = i
        if(_current_number ==0)
            this.processed_data[i].prevPage = null
        if(_current_number  != 0)
        this.processed_data[i].prevPage = '/posts/' + this.processed_data[_current_number -1]['filename']
        if(_current_number +1 > this.processed_data.length)
        this.processed_data[i].nextPage = null
        if(_current_number +1 < this.processed_data.length)
        this.processed_data[i].nextPage = '/posts/'+ this.processed_data[_current_number +1]['filename']
    }
    return cb(null,this.processed_data)


}
export const index_file = new Indexing_file_module()