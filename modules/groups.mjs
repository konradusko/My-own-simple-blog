import { Module_config } from "./config.mjs"
//Type
//home - home page , tag - tag page
export function calcMaxPage(content,type = 'tag'){
        const posts_count = type == 'tag' ?Module_config.getConfig().tagsPagePosts:Module_config.getConfig().mainPagePosts
        if(content.length == 0 )
        return {
            filtered_content_by_query:[],
            max_page:1,
            posts_on_page:posts_count
        }
        const content_local=content.sort(function(a,b){
            return b.birth_time.getTime() - a.birth_time.getTime()
        })
        const max_page = (content_local.length/posts_count) %1 !=0 ?Math.trunc((content_local.length/posts_count)+1):Math.trunc(content_local.length/posts_count)
        const posts_on_page = posts_count
        return {
            filtered_content_by_query:content_local,
            max_page,
            posts_on_page
        }
}
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
    tag_content[tag].max_page = (tag_content[tag].content.length/Module_config.getConfig().tagsPagePosts) %1 !=0 ?Math.trunc((tag_content[tag].content.length/Module_config.getConfig().tagsPagePosts)+1):Math.trunc(tag_content[tag].content.length/Module_config.getConfig().tagsPagePosts)
    tag_content[tag].max_page = Math.sign(tag_content[tag].max_page) == -1 ||  Math.sign(tag_content[tag].max_page) == 0?1: tag_content[tag].max_page
    tag_content[tag].posts_on_page = Module_config.getConfig().tagsPagePosts
}
return tag_content
}