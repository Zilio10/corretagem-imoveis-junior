const https = require('https')

async function uploadToBunny(fileBuffer, fileName) {
    const storageZone = process.env.BUNNY_STORAGE_ZONE
    const apiKey = process.env.BUNNY_API_KEY
    const cdnUrl = process.env.BUNNY_CDN_URL

    const remotePath = `imoveis/${fileName}`

    return new Promise((resolve, reject) => {
        const options = {
            method: 'PUT',
            hostname: 'br.storage.bunnycdn.com',
            path: `/${storageZone}/${remotePath}`,
            headers: {
                'AccessKey': apiKey,
                'Content-Type': 'application/octet-stream',
                'Content-Length': fileBuffer.length
            },
        }

        const req = https.request(options, (res) => {
            if (res.statusCode === 201) {
                resolve(`${cdnUrl}/${remotePath}`) // Retorna a URL do arquivo no CDN para ser armazenada no banco
            } else {
                reject(new Error(`Bunny retornou status ${res.statusCode} para ${fileName}`))
            }
            res.resume() // Consumir a resposta para liberar recursos
        })

        req.on('error', reject)
        req.write(fileBuffer)
        req.end()
    })
}

async function deleteFromBunny(fileName) {
    const storageZone = process.env.BUNNY_STORAGE_ZONE
    const apiKey = process.env.BUNNY_API_KEY

    const remotePath = `imoveis/${fileName}`

    return new Promise((resolve, reject) => {
        const options = {
            method: 'DELETE',
            hostname: 'br.storage.bunnycdn.com',
            path: `/${storageZone}/${remotePath}`,
            headers: {
                'AccessKey': apiKey,
            },
        }

        const req = https.request(options, (res) => {
            if (res.statusCode === 200) {
                resolve(true)
            } else {
                reject(
                    new Error(`Bunny retornou status ${res.statusCode} para ${fileName}`)
                )
            }

            res.resume()
        })

        req.on('error', reject)
        req.end()
    })
}

module.exports = { uploadToBunny, deleteFromBunny }