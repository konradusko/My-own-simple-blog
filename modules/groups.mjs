
export function group_by_tag (tags,content){

let tag_content = {}
for(const tag of tags){
    if(!tag_content[tag])
        tag_content[tag] = []
    for(const cont of content){
        if(cont.tags.includes(tag))
            tag_content[tag].push(cont)
    }
    //filter time add
    tag_content[tag] = tag_content[tag].sort(function(a,b){
        return b.birth_time.getTime() - a.birth_time.getTime()
    })
}
return tag_content
}