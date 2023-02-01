
function Cache(){
    this.cachedPages={}
}
Cache.prototype.createCache = function(id,content,cb){
    if(typeof id != "string" || typeof content != 'string')
        return cb('Wrong data provided',null)
    if(this.cachedPages[id])
        return cb(null,'Cache exists')
    
    this.cachedPages[id] = content
    return cb(null,'Cache has been saved')
}   
Cache.prototype.getCache = function(id,cb){
    if(typeof id != "string" )
        return cb('Wrong data provided',null)
    if(!this.cachedPages[id])
        return cb('No cache',null)
    return cb(null,this.cachedPages[id])
}
Cache.prototype.removeCache = function(id,cb){
    if(typeof id != "string" )
        return cb('Wrong data provided',null)
    delete this.cachedPages[id]
    return cb(null,'Cache has been removed')
}
Cache.prototype.cleanAll = function(cb){
    this.cachedPages = {}
    return cb(null,'All cache has been removed')
}
export const cache = new Cache()