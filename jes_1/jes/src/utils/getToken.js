
export const getToken = (request) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
        return null
    }

    const [, token] = authHeader.split(" ")
    return token || null
}

import jwt from "jsonwebtoken";

// export const gerarTokenUsuario = (usuario) => {
//     // 1. Validação defensiva dos dados de entrada
//     if (!usuario || !usuario.id) {
//         throw new Error("Dados de usuário inválidos para geração de token.");
//     }

//     // 2. Criação de um Payload Sanitizado e Enxuto
//     // Guardamos apenas o id e o tipo (professor/aluno) para controle de acesso.
//     // Evite expor dados que mudam frequentemente ou que sejam confidenciais.
//     const payload = {
//         id: usuario.id,
//         tipo: usuario.tipo || "aluno"
//     };

//     // 3. Validação da Chave Secreta
//     const secret = process.env.JWT_SECRET;
//     if (!secret || secret.length < 32) {
//         throw new Error("Configuração de segurança violada: JWT_SECRET ausente ou muito curta.");
//     }

//     // 4. Assinatura do Token com Configurações Estritas
//     return jwt.sign(payload, secret, {
//         algorithm: "HS256", // Alinhado com o 'authMiddleware' que criamos
//         expiresIn: "1h",    // Tempo de expiração seguro (1 hora)
//         audience: "meu-sistema-campeonato", // Opcional: Garante que o token é para o seu app
//         issuer: "api-campeonato"            // Opcional: Identifica quem emitiu o token
//     });
// };
