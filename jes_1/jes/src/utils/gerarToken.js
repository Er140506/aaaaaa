import jwt from "jsonwebtoken"

export const gerarToken = (usuario) => {
    return jwt.sign(
        { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
    )
}


// import jwt from "jsonwebtoken";

// export const gerarToken = (usuario) => {
//     // 1. Validação defensiva dos dados de entrada
//     if (!usuario || !usuario.id || !usuario.email) {
//         throw new Error("Dados de usuário insuficientes para a geração do token.");
//     }

//     // 2. Montagem do Payload Sanitizado
//     // Mantemos apenas os dados essenciais para identificação e autorização nas rotas.
//     const payload = {
//         id: usuario.id,
//         email: usuario.email,
//         tipo: usuario.tipo || "aluno"
//     };

//     // 3. Validação de força da Chave Secreta
//     const secret = process.env.JWT_SECRET;
//     if (!secret || secret.length < 32) {
//         throw new Error("Erro de Segurança: JWT_SECRET não configurada ou muito curta (mínimo de 32 caracteres).");
//     }

//     // 4. Assinatura Estrita do Token
//     return jwt.sign(payload, secret, {
//         algorithm: "HS256", // Força o uso de algoritmo seguro simétrico
//         expiresIn: process.env.JWT_EXPIRES_IN || "12h", // Usa a variável de ambiente ou o padrão de 12h
//         issuer: "api-campeonato" // Identifica quem emitiu o token (ajuda a evitar ataques de reutilização)
//     });
// };
