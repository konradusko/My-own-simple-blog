import path from 'path'
import {__dirname} from '../../dirname.mjs'
export function page_not_found(req,res){
    try {
        return res.status(404).sendFile(path.join(__dirname,'template','404.html'))
    } catch (error) {
        res.send('Wystąpił błąd')        
    }
}
export function handleError(err, req, res, next){
    console.log(err)
    function sendToClient(staticPage,status){
        try {
            return res.status(status).sendFile(path.join(__dirname,'template',staticPage))
        } catch (error) {
            res.send('Wystąpił błąd')        
        }
    }
 
    if('status' in err && 'message' in err){
        switch (err.status) {
            case "404":
                sendToClient(`404.html`,404)
                break;
            case "500":
            default:
                //Status 500 and others that doesn't match
                console.log(`New error ocurred: status:${err.status}, message:${err.message}`)
                sendToClient(`500.html`,500)
                break;
        }
    }else{
        console.log(`New error ocurred: ${err}`)
        sendToClient(`500.html`,500)  
    }
    

    
}