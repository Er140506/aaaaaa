/**
 * src/controllers/seriesControllers.js
 * CRUD de séries (categorias/divisões do torneio).
 */

import { seriesModel } from "../model/index.js"
import { tratarErro } from "../utils/erroHandler.js"
import { formatSerie, formatSerieList } from "../views/seriesView.js"

// Campos que o cliente tem permissão de alterar via PATCH.
// Evita que o usuário sobrescreva colunas internas (id, timestamps, etc).
const CAMPOS_PERMITIDOS = ["nome", "nivel", "pais", "corPrimaria", "corSecundaria"]

// GET /series - Lista todas as séries cadastradas
export const ListaSeries = async (request, response) => {
    try {
        const series = await seriesModel.findAll()
        return response.status(200).json(formatSerieList(series))
    } catch (error) {
        console.error("Erro ao listar séries:", error.message)
        return tratarErro(error, response)
    }
}

// POST /series - Cria uma nova série
export const CriarSerie = async (request, response) => {
    try {
        const { nome, nivel, pais, corPrimaria, corSecundaria } = request.body

        // 'nome' é o único campo realmente obrigatório para a série existir
        if (!nome || nome.trim() === "") {
            return response.status(400).json({ msg: "O campo 'nome' é obrigatório" })
        }

        const novaSerie = await seriesModel.create({ nome, nivel, pais, corPrimaria, corSecundaria })

        return response.status(201).json({
            msg: "Série criada com sucesso!",
            serie: formatSerie(novaSerie)
        })
    } catch (error) {
        console.error("Erro ao criar série:", error.message)
        return tratarErro(error, response)
    }
}

// PUT /series/:id - Substitui todos os campos da série (atualização completa)
export const AtualizarSerie = async (request, response) => {
    try {
        const { id } = request.params
        const { nome, nivel, pais, corPrimaria, corSecundaria } = request.body

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Id inválido" })
        }

        if (!nome || nome.trim() === "") {
            return response.status(400).json({ msg: "O campo 'nome' é obrigatório" })
        }

        const serie = await seriesModel.findByPk(id)
        if (!serie) {
            return response.status(404).json({ msg: "Série não encontrada" })
        }

        // PUT sobrescreve o registro inteiro, mesmo que algum campo venha undefined
        await serie.update({ nome, nivel, pais, corPrimaria, corSecundaria })

        return response.status(200).json({
            msg: "Série atualizada com sucesso!",
            serie: formatSerie(serie)
        })
    } catch (error) {
        console.error("Erro ao atualizar série:", error.message)
        return tratarErro(error, response)
    }
}

//