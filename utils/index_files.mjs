
function Indexing_file_module(){
    this.queque = {}
    this.processed_data = []
}

Indexing_file_module.prototype.getTitle = function(string){
    if(typeof string != 'string')
        return ''
    const reg_title = RegExp(/\[konradusko:title](.*)\[\/konradusko:title]/)
    const search = reg_title.exec(string)
    console.log(search)
    console.log(string.match(/\[konradusko:title](.*)\[\/konradusko:title]/g))
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
    return tags_array

}

Indexing_file_module.prototype.handle_one_content = function(content){
    const buffer_to_string = content.buffer.toString()
    console.log(buffer_to_string)
    const title = this.getTitle(buffer_to_string)
    const tags = this.getTags(buffer_to_string)
    console.log(title)
    console.log(tags)
    
}
Indexing_file_module.prototype.create_index_for_files = function(contentProcessing,cb){
    if(!Array.isArray(contentProcessing))
        return cb('ContentProcessing is not array',null)
    if(contentProcessing.length === 0 )
        return cb('ContentProcessing array is empty',null)
    
    contentProcessing.forEach((content)=>{
        this.queque[content['filename']] = true
        return this.handle_one_content(content)
    })
}
export const index_file = new Indexing_file_module()