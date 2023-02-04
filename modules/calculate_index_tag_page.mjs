
export function calculate_index_tag_page(content,page,tag,query){
console.log(content.max_page,'max page')
console.log(content.posts_on_tag,'posts on tags')
console.log(content.content.length,'dlugosc')
    const start_index = content.posts_on_tag * (page-1),
    end_index = content.posts_on_tag * (page-1) +content.posts_on_tag

    console.log(start_index)
    const data = {
        posts : content.content.slice(start_index,end_index),
        next_page: page +1 > content.max_page? null: `/tag/${tag}?page=${page+1}&query=${query}`,
        prev_page:page-1 == 0 ?null : `/tag/${tag}?page=${page-1}&query=${query}`,
        tag:tag,
        current_page:page,
        max_page:content.max_page
    }
    return data  
}