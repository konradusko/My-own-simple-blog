(async function(){
    const {content} = await import('./utils/content.mjs')
    const {Module_config} = await import('./modules/config.mjs')
    const {app} = await import('./utils/server.mjs')
    const dotenv = require('dotenv')
    
    dotenv.config()
    //Init
    const PORT = process.env['PORT'] || 3000
    
    
    //read config file
    console.log(`Loading configuration file...`)
    Module_config.loadConfig((err,message)=>{
        if(err)
            throw new Error(err)
        console.log(message)
    })
    console.log(Module_config.getConfig())
    //Loading content
    content.loadContent(async function(err,message){
        if(err){
            console.log(err)
            return 
        }
        
   
        var server = app.listen(PORT, function () {
            const host = server.address().address;
            const port = server.address().port;
            console.log(`Konradusko-blog listening at http://${host}:${port}`);
        });
    
    })
    
})()

