export const permitirProfessor = (request, response, next) => {
    if (!request.usuario) {
        return response.status(401).json({ msg: "Token não informado" })
    }

    if (request.usuario.tipo !== "professor") {
        return response.status(403).json({ msg: "Apenas professores podem acessar esse recurso" })
    }

    next()
}



// export const permitirProfessor = (request, response, next) => {
//     // 1. Verifica se o middleware de autenticação (authMiddleware) realmente rodou antes deste
//     if (!request.usuario) {
//         return response.status(401).json({ msg: "Acesso negado. Usuário não autenticado." });
//     }

//     // 2. Validação defensiva do tipo/role
//     // O uso de "tipo" deve bater exatamente com o que você extraiu e sanitizou no payload do JWT
//     if (!request.usuario.tipo || request.usuario.tipo !== "professor") {
//         return response.status(403).json({ 
//             msg: "Acesso proibido. Apenas professores têm permissão para acessar este recurso." 
//         });
//     }

//     return next();
// };
