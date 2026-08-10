import"./model/index.js"
import app from "./app.js";
import{conexao}from "./config/conexao.js"

const PORT = 3000

const iniciarSever = async ()=>{
    try {
        await conexao.sync()

        app.listen(PORT,()=>{
            console.log("servidos iniciado na porta ",PORT)
        })
    } catch (error) {
            console.log("Error ao inicar o servidor: ", error.message)
    }
}

await iniciarSever()