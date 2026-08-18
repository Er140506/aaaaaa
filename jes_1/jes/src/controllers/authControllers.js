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


// import bcrypt from "bcryptjs";
// import crypto from "crypto"; // Nativo do Node.js, não precisa instalar nada
// import { usuarioModel } from "../model/index.js";
// import { tratarErro } from "../utils/erroHandler.js";
// import { gerarToken } from "../utils/gerarToken.js";

// export const registrar = async (request, response) => {
//     try {
//         const { nome, email, senha, codigoProfessor } = request.body;

//         // 1. Validação Estrita dos Campos de Entrada
//         if (!nome || typeof nome !== "string" || nome.trim() === "") {
//             return response.status(400).json({ msg: "O campo 'nome' é obrigatório e deve ser um texto válido." });
//         }

//         // Sanitização básica do e-mail (converte para minúsculas para evitar duplicações por caixa alta)
//         if (!email || typeof email !== "string" || email.trim() === "") {
//             return response.status(400).json({ msg: "O campo 'email' é obrigatório." });
//         }
//         const emailSanitizado = email.trim().toLowerCase();

//         // Validação de formato de e-mail por Regex
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(emailSanitizado)) {
//             return response.status(400).json({ msg: "O formato do e-mail informado é inválido." });
//         }

//         if (!senha || typeof senha !== "string" || senha.length < 8) { // Aumentado para 8 por padrão de segurança
//             return response.status(400).json({ msg: "A senha deve ter ao menos 8 caracteres." });
//         }

//         // 2. Verificação de Duplicidade no Banco
//         const usuarioExiste = await usuarioModel.findOne({ where: { email: emailSanitizado } });
//         if (usuarioExiste) {
//             // Mensagem genérica ou específica (409 Conflict é o correto para REST)
//             return response.status(409).json({ msg: "Este endereço de e-mail já está em uso." });
//         }

//         // 3. Validação Segura do Código de Professor (Prevenção de Timing Attack)
//         let tipo = "aluno";
//         const codigoSecreto = process.env.CODIGO_PROFESSOR;

//         // Garante que o código secreto existe no ambiente e que o usuário enviou um código
//         if (codigoSecreto && codigoSecreto.length > 0 && typeof codigoProfessor === "string") {
//             const bufferSecreto = Buffer.from(codigoSecreto, "utf-8");
//             const bufferUsuario = Buffer.from(codigoProfessor, "utf-8");

//             // O timingSafeEqual exige que os buffers tenham exatamente o mesmo tamanho para comparar com segurança
//             if (bufferSecreto.length === bufferUsuario.length) {
//                 if (crypto.timingSafeEqual(bufferSecreto, bufferUsuario)) {
//                     tipo = "professor";
//                 }
//             }
//         }

//         // 4. Criptografia Forte da Senha
//         // Aumentado para 12 rounds para maior resistência contra supercomputadores
//         const senhaCriptografada = await bcrypt.hash(senha, 12);

//         // 5. Persistência Isolada (Mass Assignment Protection)
//         const novoUsuario = await usuarioModel.create({
//             nome: nome.trim(),
//             email: emailSanitizado,
//             senha: senhaCriptografada,
//             tipo: tipo, // Atribuído de forma estrita pelo servidor, sem chance de injeção externa
//         });

//         // 6. Geração de Token Baseado no Usuário Novo Sanitizado
//         const token = gerarToken({
//             id: novoUsuario.id,
//             email: novoUsuario.email,
//             tipo: novoUsuario.tipo
//         });

//         // 7. Resposta Limpa (Nunca exponha a senha criptografada de volta)
//         return response.status(201).json({
//             msg: "Usuário criado com sucesso!",
//             usuario: { 
//                 id: novoUsuario.id, 
//                 nome: novoUsuario.nome, 
//                 email: novoUsuario.email, 
//                 tipo: novoUsuario.tipo 
//             },
//             token
//         });

//     } catch (error) {
//         // Registra o erro de forma interna sem vazar detalhes da infraestrutura para o cliente
//         console.error("Erro interno no registro de usuário:", error.message);
//         return tratarErro(error, response);
//     }
// };
