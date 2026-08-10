import { request, response } from "express"
import{equipeModel,partidasModel,modalidadeModel,provaModel,seriesModel,resultadoModel} from "../model/index.js" 

export const ListaModalidade = async (request,response) =>{
    try {
     
        const equipe = await equipeModel.findAll()
        response.status(200).json(equipe)
    } catch (error) {
        console.log("erro ao listar equipes:", error.message)
        response.status(500).json({ mensagem: "Erro ao listar equipes" })
    }

}