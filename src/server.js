import express from 'express'
import { create } from 'kubo-rpc-client'
import multer from 'multer'

const server = express()
const upload = multer()
const client = create("http://127.0.0.1:5001")

server.get("/", async (req, res) => {
    let info = []
    for await (const file of client.files.ls("/")) {
        info.push(file)
    }
    res.send(info)
})

server.post("/", upload.single('file'), async (req, res) => {
    try {
        let nome = req.file.originalname
        let content = req.file.buffer
        await client.files.write(`/${nome}`, content, { create: true })
        let info = []
        for await (const file of client.files.ls(`/${nome}`)) {
            info.push(file)
        }
        console.log(info);
        res.status(200).json({ message: "Arquivo enviado" })
    } catch (error) {
        console.log("erro no upload", error);
        res.status(500).json({ message: "Erro" })
    }
})

// Pina os arquivos
for await (const f of client.files.ls("/") ) {
    let pin = await client.pin.add(f.cid)
    console.log(pin);
}

const testPeer = async () => {
    let p = await client.swarm.connect("/ip4/100.64.10.137/tcp/26007/p2p/12D3KooWKKFY7hTvYt36XEenh3ZdLuBrfC1qa8goHVKCUXpngNtz")
    console.log(p);
} 
testPeer()

const readFilesIPNS = async () => {
    // const pinned = client.name.resolve("/ipns/k51qzi5uqu5dmd2mgtfpapx4p4f2i37461kqod6bzujv4pbly2gtdr8h2cdex8")
    let buffer = client.ls("/ipns/k51qzi5uqu5dmd2mgtfpapx4p4f2i37461kqod6bzujv4pbly2gtdr8h2cdex8")

    for await(const p of buffer) {
        // let buffer = client.cat(p.split("/")[2])
        for await (const chunk of client.cat(p.cid)) {
            console.log(chunk.toString());
        }
    }
} 
readFilesIPNS()

server.listen(5002, () => {
    console.log("Servidor ligado")
})