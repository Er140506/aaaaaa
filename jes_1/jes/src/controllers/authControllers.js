import bcrypt from "bcryptjs"
import { usuarioModel } from "../model/index.js"
import { tratarErro } from "../utils/erroHandler.js"
import { gerarToken } from "../utils/gerarToken.js"

export const registrar = async (request, response) => {
    try {
        const { nome, email, senha, codigoProfessor } = request.body

        if (!nome || nome.trim() === "") {
            return response.status(400).json({ msg: "O campo 'nome' é obrigatório" })
        }

        if (!email || email.trim() === "") {
            return response.status(400).json({ msg: "O campo 'email' é obrigatório" })
        }

        if (!senha || senha.length < 6) {
            return response.status(400).json({ msg: "A senha deve ter ao menos 6 caracteres" })
        }

        // Confere se já existe um usuário com esse email
        const usuarioExiste = await usuarioModel.findOne({ where: { email } })
        if (usuarioExiste) {
            return response.status(409).json({ msg: "Já existe um usuário com esse email" })
        }

        // Só vira "professor" se mandou o código secreto certo
        const tipo = (codigoProfessor && codigoProfessor === process.env.CODIGO_PROFESSOR)
        // Nunca salva a senha em texto puro - sempre criptografada
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoUsuario = await usuarioModel.create({
            nome,
            email,
            senha: senhaCriptografada,
            tipo,
        })

        const token = gerarToken(novoUsuario)

        return response.status(201).json({
            msg: "Usuário criado com sucesso!",
            usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email, tipo: novoUsuario.tipo },
            token
        })
    } catch (error) {
        console.error("Erro ao registrar usuário:", error.message)
        return tratarErro(error, response)
    }
}