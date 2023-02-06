import { Module_config } from "./config.mjs"
export const get_template = (jsonData)=>{
    return `<html>
    <body>
    <pre>
    <code>
        ${JSON.stringify({data:jsonData,template:Module_config.getConfig().template_data}, null, 6)}
    </code>
    </pre>
    </body>
    </html>`
}