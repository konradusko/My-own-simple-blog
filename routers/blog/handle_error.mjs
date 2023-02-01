import path from 'path'
import {__dirname} from '../../dirname.mjs'
export function handleError(err, req, res, next){
    try {
        return res.sendFile(path.join(__dirname,'template','500.html'))
    } catch (error) {
        res.send('Wystąpił błąd')        
    }
}