
import { equipeModel } from '../model/equipe.js'
import { modalidadeModel } from '../model/modalidades.js'
import { partidasModel } from "../model/partidas.js"
import { tratarErro } from "../utils/erroHandler.js"
import { gerarEliminatoria, gerarPontosCorridos } from "../service/bracketService.js"
import { conexao } from "../config/conexao.js"

import { formatPartida } from "../views/partidaView.js"
import { calcularClassificacao } from "../service/standingsService.js"
import { formatEquipe } from "../views/equipesViews.js"


// ======================================================
// GET - Lista todas as modalidades
// ======================================================

export const listarModalidades = async (req, res) => {

    try {

        const modalidades = await modalidadeModel.findAll({
            // CORREÇÃO:
            // Antes estava:
            // order: ['id']
            //
            // O Sequelize espera uma estrutura de ordenação.
            order: [['id', 'ASC']]
        })

        return res.status(200).json({
            msg: modalidades
        })

    } catch (error) {

        // CORREÇÃO:
        // Antes você fazia:
        // await tratarErro(error, res)
        //
        // Não é obrigatório usar await porque tratarErro
        // não precisa ser uma função assíncrona.
        return tratarErro(error, res)
    }
}


// ======================================================
// POST - Cadastra uma modalidade
// ======================================================

export const cadastrarModalidades = async (req, res) => {

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


    // CORREÇÃO IMPORTANTE:
    //
    // ANTES:
    // if(nome || tipo){
    //     throw new tratarErro(400, "...")
    // }
    //
    // ERRO 1:
    // A condição estava invertida.
    // !nome significa "nome não foi informado".
    //
    // ERRO 2:
    // tratarErro NÃO é uma classe/construtor.
    // Por isso não podemos usar:
    // new tratarErro(...)
    //
    // CORRETO:
    // Se nome OU tipo estiver faltando, retorna erro 400.
    if (!nome || !tipo) {

        return res.status(400).json({
            msg: "Informe ao menos o 'nome' e o 'tipo' da modalidade"
        })
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


        return res.status(201).json({
            msg: modalidades
        })

    } catch (error) {

        return tratarErro(error, res)
    }
}


// ======================================================
// GET - Busca modalidade pelo ID
// ======================================================

export const buscarporId = async (req, res) => {

    const { id } = req.params

    try {

        const modalidades = await modalidadeModel.findByPk(id)

        if (!modalidades) {

            return res.status(404).json({
                msg: "Modalidade não encontrada"
            })
        }

        return res.status(200).json({
            msg: modalidades
        })

    } catch (error) {

        return tratarErro(error, res)
    }
}


// ======================================================
// PUT/PATCH - Atualiza uma modalidade
// ======================================================

export const atualizarModalidades = async (req, res) => {

    const { id } = req.params


    if (!id) {

        // CORREÇÃO:
        // ANTES:
        // res.status(404).json({
        //     msg: "Modalidade não existe"
        // })
        //
        // ERRO:
        // 404 significa "não encontrado".
        // Aqui o problema é que o ID nem foi informado.
        //
        // Por isso usamos 400 = requisição inválida.
        return res.status(400).json({
            msg: "ID da modalidade não informado"
        })
    }


    try {

        const modalidade = await modalidadeModel.findByPk(id)


        // CORREÇÃO:
        //
        // ANTES:
        // if(!modalidade){
        //     throw new tratarErro(
        //         404,
        //         'Modalidade não encontrada'
        //     )
        // }
        //
        // ERRO:
        // tratarErro não é construtor.
        // Não pode usar "new tratarErro".
        //
        // CORRETO:
        if (!modalidade) {

            return res.status(404).json({
                msg: "Modalidade não encontrada"
            })
        }


        const campos = [
            "nome",
            "emoji",
            "tipo",
            "minJogadores",
            "maxJogadores",
            "formato",
            "duracaoPadrao",
            "minDinamico",
            "ranking"
        ]


        // CORREÇÃO:
        // ANTES você chamou essa variável de:
        // const atulização = {}
        //
        // Não causava necessariamente erro no JavaScript,
        // mas o nome estava escrito errado.
        //
        // Agora:
        const atualizacao = {}


        campos.forEach(campo => {

            if (req.body[campo] !== undefined) {

                atualizacao[campo] = req.body[campo]
            }
        })


        await modalidade.update(atualizacao)


        return res.status(200).json({
            msg: "Modalidade atualizada com sucesso",

            // CORREÇÃO:
            // Antes você retornava:
            // atulização
            //
            // Agora usa o nome correto da variável.
            atualizacao
        })

    } catch (error) {

        return tratarErro(error, res)
    }
}


// ======================================================
// POST - Gera o chaveamento
// ======================================================

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

        const equipes = await equipeModel.findAll({where:{modalidadeId: modalidade.id, fundidaEmId: null}})

        let geradas
        if(modalidade.formato === "eliminatoria"){
            geradas = gerarEliminatoria(equipes,modalidade.id)
        }else{
            geradas = gerarPontosCorridos(equipes,modalidade.id)
        }

        const partidasFinais = await conexao.transaction(async(t) => {
            await partidasModel.destroy({where:{modalidadeId: modalidade.id}, transaction: t})

            const idReal = {}
            const criadas = []

            for (const partidaGerada of geradas) {
                const linha = await partidasModel.create(
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
                include:[{association: 'timeA', include:['series']},
                {association: 'timeB', include:['series']}],
                order:[['rodada','ASC'], ['id','ASC']],
                transaction: t
            })
        })

        res.json(formatPartida(partidasFinais))
    } catch (error) {
        tratarErro(error,res)
    }
}

// ======================================================
// GET - Mostra a classificação
// ======================================================

export const classificacao = async (req, res) => {

    const { id } = req.params
    try {
        const modalidade = await modalidadeModel.findByPk(id)
        if (!modalidade) {
            return res.status(404).json({
                msg: "Modalidade não encontrada"
            })
        }
        const equipes = await equipeModel.findAll({
            where: {
                modalidadeId: modalidade.id,
                fundidaEmId: null
            }
        })


        const partidas = await partidasModel.findAll({
            where: {
                modalidadeId: modalidade.id
            }
        })


        const tabela = calcularClassificacao(
            equipes,
            partidas,
            modalidade.id
        )


        const equipesporID = new Map(
            equipes.map(e => [e.id, e])
        )


        // CORREÇÃO IMPORTANTE:
        //
        // ANTES:
        // const res = tabela.map(...)
        //
        // ERRO:
        // "res" já existe como parâmetro:
        // export const classificacao = async (req, res)
        //
        // Você não pode declarar outro "const res"
        // dentro da mesma função.
        //
        // CORRETO:
        const resultado = tabela.map(linha => ({

            ...linha,

            equipe: equipesporID.has(linha.timeId)
                ? formatEquipe(
                    equipesporID.get(linha.timeId)
                )
                : null
        }))


        // CORREÇÃO:
        // Agora usamos o "res" original do Express
        // para enviar o resultado.
        return res.status(200).json(resultado)

    } catch (error) {

        return tratarErro(error, res)
    }
}

