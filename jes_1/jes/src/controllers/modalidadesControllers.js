

import {equipeModel} from '../model/equipe.js'
import {modalidadeModel} from '../model/modalidades.js'
import {partidasModel}  from "../model/partidas.js"
import { tratarErro } from "../utils/erroHandler.js"
import { gerarEliminatoria, gerarPontosCorridos } from "../service/bracketService.js"
import { conexao } from "../config/conexao.js"

import { formatPartida } from "../views/partidaView.js"
import { calcularClassificacao } from "../service/standingsService.js"
import { formatEquipe } from "../views/equipesViews.js"
import asyncHandler from '../utils/asyncHandler.js'


export const listarModalidades = async (req,res) =>{


try {
        const modalidades = await modalidadeModel.findAll({order: ['id']})

        res.status(200).json({msg: modalidades})

} catch (error) {
        tratarErro(error,res)
}


}

export const cadastrarModalidades = async (req,res) =>{

 const {id} = req.params

    const { 
nome,
emoji,
tipo,
minJogadores,
maxJogadores,
formato,
duracaoPadrao,
minDinamico,
ranking 
} = req.body

if(nome || tipo){
    throw new tratarErro(400, "nforme ao menos o 'nome' e o 'tipo' da modalidade")
}

try {
    const modalidades = await modalidadeModel.create({
       
        nome,
        emoji: emoji || "",
        tipo,
        minJogadores: minJogadores || 1,
        maxJogadores: maxJogadores || 1,
        formato: formato || 'pontoscorridos',
        duracaoPadrao: duracaoPadrao ?? null,
        minDinamico: !!minDinamico,
        ranking: !!ranking 

    })

    res.status(201).json({msg: modalidades})
} catch (error) {
    tratarErro(error,res)
}

}

export const buscarporId = async (req,res)=>{

   const {id} = req.params

    try {
        const modalidades = await modalidadeModel.findByPk(id)
        if(!modalidades){
            res.status(404).json({msg: "Modalidade não encontrada"})
            return
        }
        res.status(200).json({msg: modalidades})
    } catch (error) {
         tratarErro(error,res)
    }


}

export const atualizarModalidades = async (req,res) =>{

    const {id} = req.params

    if(!id){
        res.status(404).json({msg: "Modalidade não existe"})
        return
    }
try {
    
const modalidade = await modalidadeModel.findByPk(id)
if(!modalidade){
    throw new tratarErro(404, 'Modalidade não encontrada')
}
const campo = ["nome",'emoji','tipo','minJogadores','maxJogadores','formato','duracaoPadrao','minDinamico','ranking' ]

const atulização = {}

campo.forEach(c => {
    if(req.body[c] !== undefined){
        atulização[c] = req.body[c]
    }
})

await modalidade.update(atulização)

res.status(200).json({
    msg: "Modalidade atualizada com sucesso",
    atulização,
})
} catch (error) {
    tratarErro(error,res

    )
}

}

export const gerarChaveamento = async (req,res)=>{

        const {id} = req.params
    try {
        const modalidade = await modalidadeModel.findByPk(id)

        if(!modalidade){
            tratarErro(404, "Modalidade não encontrada")
            return
        }
        
        if(modalidade.ranking){
            tratarErro(400,"Modalidades de ranking não usam chaveamentos - cadastre provas ou resultados")
            return
        }

        const equipes = equipeModel.findAll({where:{modalidade: modalidade.id, fundidaEmId: null}})

        const geradas = modalidade.formato
        if(geradas === "eliminatoria"){
            gerarEliminatoria(equipes,modalidade.id)
      }else{
        gerarPontosCorridos(equipes,modalidade.id)
      }

      const partidasFinais = await conexao.transaction(async(t) => {
        await partidasModel.destroy({where:{modalidadeId: modalidade.id}, transaction: t}) //deleta tudo de uma modalidade, para caso o banco de dados tiver risco 
      

      const idReal = {}
      const criadas = []

       for (const partidaGerada of geradas) {
      const linha = await Partida.create(
        {
          modalidadeId: modalidade.id,
          formato: partidaGerada.formato,
          rodada: partidaGerada.rodada,
          faseNome: partidaGerada.faseNome,
          slot: partidaGerada.slot ?? null,
          timeAId: partidaGerada.timeAId || null,
          timeBId: partidaGerada.timeBId || null,
          status: partidaGerada.status || 'agendado',
        },
        { transaction: t }
      );
      idReal[partidaGerada.id] = linha.id;
      criadas.push({ linha, nextMatchIdTemp: partidaGerada.nextMatchId, nextMatchSlot: partidaGerada.nextMatchSlot });
    }

     for (const item of criadas) {
      if (item.nextMatchIdTemp) {
        await item.linha.update(
          { nextMatchId: idReal[item.nextMatchIdTemp], nextMatchSlot: item.nextMatchSlot },
          { transaction: t }
        );
      }
    }

    return partidasModel.findAll({
        where: {modalidadeId: modalidade.id},
        include:[{association: 'timeA', include:['serie']}, 
        {association: 'timeB', include:['serie']}],
        order:[['rodada','ASC'], ['id','ASC']],
        transaction: t
    })
})

    res.json(formatPartida(partidasFinais))
    } catch (error) {
        tratarErro(error,res)
    }

}

export const classificacao = async(req,res)=>{
    const {id} = req.params
    try {
        const modalidade = await modalidadeModel.findByPk(id)
        if(!modalidade){
            tratarErro(404,"Modalidade não encontrada")
            return
        }

        const equipes = await equipeModel.findAll({where:{
            modalidadeId: modalidade.id, fundidaEmId: null}
        })

        const partidas = await partidasModel.findAll({where:{
            modalidadeId: modalidade.id}
        })

        const tabela = calcularClassificacao(equipes,partidas,modalidade.id)

        const equipesporID = new Map(equipes.map(e => [e.id,e]))
        const res = tabela.map(linha => ({
            ...linha,
            equipe: equipesporID.has(linha.timeId) ? formatEquipe(equipesporID.get(linha.timeId)) : null
        }))

        res.json(res)
    } catch (error) {
        tratarErro(error,res)
    }
}