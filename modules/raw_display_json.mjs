export const get_template = (jsonData)=>{
    return `<html>
    <body>
    <pre>
    <code>
        ${JSON.stringify(jsonData, null, 6)}
    </code>
    </pre>
    </body>
    </html>`
}