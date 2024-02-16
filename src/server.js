import express from 'express'
import multer from 'multer'
import axios from 'axios'
import FormData from 'form-data'

const server = express()
const upload = multer()

server.post("/", async (req, res) => {
    try {
        const filesfromIPFS = await axios.post("http://127.0.0.1:5001/api/v0/files/ls?arg=/&long=true")
        res.json(filesfromIPFS.data)
    } catch (error) {
        res.json({message: error})
    }
})

server.post("/upload", upload.single('file'), async (req, res) => {
    try {
        const nome = req.file.originalname
        const content = req.file.buffer
        const formData = new FormData()
        formData.append(nome, content)
        await axios.post(`http://127.0.0.1:5001/api/v0/files/write?arg=/${nome}&create=true`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        const filesfromIPFS = await axios.post("http://127.0.0.1:5001/api/v0/files/ls?arg=/&long=true")
        res.status(200).json({ message: "Arquivo enviado", dados: filesfromIPFS.data })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

// // Pina os arquivos
// for await (const f of client.files.ls("/") ) {
//     let pin = await client.pin.add(f.cid)
//     console.log(pin);
// }

// const testPeer = async () => {
//     let p = await client.swarm.connect("/ip4/100.64.10.137/tcp/26007/p2p/12D3KooWKKFY7hTvYt36XEenh3ZdLuBrfC1qa8goHVKCUXpngNtz")
//     console.log(p);
// } 
// testPeer()

// const readFilesIPNS = async () => {
//     // const pinned = client.name.resolve("/ipns/k51qzi5uqu5dmd2mgtfpapx4p4f2i37461kqod6bzujv4pbly2gtdr8h2cdex8")
//     let buffer = client.ls("/ipns/k51qzi5uqu5dmd2mgtfpapx4p4f2i37461kqod6bzujv4pbly2gtdr8h2cdex8")

//     for await(const p of buffer) {
//         // let buffer = client.cat(p.split("/")[2])
//         for await (const chunk of client.cat(p.cid)) {
//             console.log(chunk.toString());
//         }
//     }
// } 
// readFilesIPNS()

server.listen(5002, () => {
    console.log("Servidor ligado")
})