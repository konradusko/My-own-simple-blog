
function Indexing_file_module(){
    this.queque = {}
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
    return ''
    let tags_array = []
    const reg_tags = RegExp(/\[konradusko:tag](.*)\[\/konradusko:tag]/g)
    const not_global = RegExp(/\[konradusko:tag](.*)\[\/konradusko:tag]/)
    const match_tags = string.match(reg_tags)
    for(const tags of match_tags){
        const output = not_global.exec(tags)
        if(output)
            tags_array.push(output[1])
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
Indexing_file_module.prototype.handle_one_content = function(content,cb){
    console.log(content)
    let buffer_to_string = content.buffer.toString()
    let obj_for_index = {
        title:this.getTitle(buffer_to_string),
        tags:this.getTags(buffer_to_string),
        image: this.getImage(buffer_to_string),
        description:this.getDescription(buffer_to_string),
        content:buffer_to_string.replace(/\[konradusko:(.*)\[\/konradusko:(.*)]/g,''),
        filename:content['filename'],
        birth_time:content['birth_time'],
        modify_time:content['modify_time']
    }
    this.processed_data.push(obj_for_index)
    delete this.queque[obj_for_index['filename']]
    return cb()
}
Indexing_file_module.prototype.create_index_for_files = function(contentProcessing,cb){
    if(!Array.isArray(contentProcessing))
        return cb('ContentProcessing is not array',null)
    if(contentProcessing.length === 0 )
        return cb('ContentProcessing array is empty',null)
    const cb_inner_checker = ()=>{
        if(Object.keys(this.queque).length ==0){
            if(this.processed_data.length == 0)
                return cb('Error while indexing content',null)
            //sorting data by latest first
            this.processed_data = this.processed_data.sort(function(a,b){
                return b.birth_time.getTime() - a.birth_time.getTime()
            })
            console.log(this.processed_data )
        }
    }
    contentProcessing.forEach((content)=>{
        this.queque[content['filename']] = true
        return this.handle_one_content(content,cb_inner_checker)
    })
}
export const index_file = new Indexing_file_module()