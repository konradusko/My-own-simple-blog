
export function calculate_index_tag_page({
    content,
    max_page,
    posts_on_tag
},page,tag,query){
    const start_index = posts_on_tag * (page-1),
    end_index = posts_on_tag * (page-1) +posts_on_tag
    const data = {
        posts : content.slice(start_index,end_index),
        next_page: page +1 > max_page? null: `/tag/${tag}?page=${page+1}&query=${query}`,
        prev_page:page-1 == 0 ?null : `/tag/${tag}?page=${page-1}&query=${query}`,
        tag:tag,
        current_page:page,
        max_page:max_page,
        query:query,

    }
    return data  
}