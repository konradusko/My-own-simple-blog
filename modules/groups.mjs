import { Module_config } from "./config.mjs"
export function group_by_tag (tags,content){

let tag_content = {}
for(const tag of tags){
    if(!tag_content[tag])
        tag_content[tag] = {
            content:[],
            max_page:1
        }
    for(const cont of content){
        if(cont.tags.includes(tag))
            tag_content[tag].content.push(cont)
    }
    //filter time add
    tag_content[tag].content = tag_content[tag].content.sort(function(a,b){
        return b.birth_time.getTime() - a.birth_time.getTime()
    })
    tag_content[tag].max_page = Math.round(tag_content[tag].content.length/Module_config.getConfig().tagsPagePosts)
}
return tag_content
}