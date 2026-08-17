import{ 
    partidasModel
} from "../model/index.js"
import { tratarErro } from "../utils/erroHandler.js"

export const listarPartidas = async ( request, response ) => {
    try {
        const partidas = await partidasModel.findAll()
        response.status(200).json(partidas)
    } catch (error) {
        await tratarErro(error, response);
    }
}

export const cadastrarPartidas = async ( request, response ) => {
    const { modalidadeId, formato, rodada, faseNome, slot, 
        timeAId, timeBId, placarA, placarB, status, data, hora,
        local, duracao, iniciadaEm, proximaPartidaId, proximaPartidaVaga
     } =  request.body
    
    try {
        
        const partidaCriada = {
            modalidadeId, 
            formato, 
            rodada, 
            faseNome, 
            slot, 
            timeAId, 
            timeBId, 
            placarA, 
            placarB, 
            status, 
            data, 
            hora,
            local, 
            duracao, 
            iniciadaEm, 
            proximaPartidaId, 
            proximaPartidaVaga,
        }

        await partidasModel.create(partidaCriada)

        response.status(201).json({message: "Partida Criada"})
        
    } catch (error) {
        
        await tratarErro(error, response);
    }

}

export const buscarPartidaPorId = async ( request, response ) => {
    try {
        const partida = await partidasModel.findByPk(request.params.id);

        if(!partida){
            response.status(404).json({ message: "Partida não encontrada" })
            return
        }

        response.status(200).json(partida)
    } catch (error) {
        await tratarErro(error, response);
    }
}

export const atualizarPartida = async (request, response) => {

    try {

        // Pega o ID da partida que veio pela URL
        const { id } = request.params

        // Procura a partida no banco
        const partida = await partidasModel.findByPk(id)

        // Se não existir
        if (!partida) {

            return response.status(404).json({
                message: "Partida não encontrada"
            })

        }

        // Atualiza somente os campos enviados no body
        await partida.update(request.body)

        // Retorna a partida já atualizada
        response.status(200).json({
            message: "Partida atualizada com sucesso",
            partida
        })

    } catch (error) {

        await tratarErro(error, response)

    }
}

// export const deletarPartida = async (request, response) => {

//     try {

//         // Pega o ID da URL
//         const { id } = request.params

//         // Procura a partida
//         const partida = await partidasModel.findByPk(id)

//         // Se não encontrar
//         if (!partida) {

//             return response.status(404).json({
//                 message: "Partida não encontrada"
//             })

//         }

//         // Exclui a partida do banco
//         await partida.destroy()

//         // Retorna resposta de sucesso
//         response.status(200).json({
//             message: "Partida deletada com sucesso"
//         })

//     } catch (error) {

//         await tratarErro(error, response)

//     }
// }