import express from "express"
import cors from "cors"
import equipesRoute from "./router/equipesRoute.js"


const app = express()

app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    credentials: true
}))

app.use(express.json())

app.use("/jes",equipesRoute)

app.use((request,response)=>{
  
    response.status(400).json({mensagem:"Rota não encontrada"})
})


export default app