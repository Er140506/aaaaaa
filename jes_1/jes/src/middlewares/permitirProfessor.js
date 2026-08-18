export const permitirProfessor = (request, response, next) => {
    if (!request.usuario) {
        return response.status(401).json({ msg: "Token não informado" })
    }

    if (request.usuario.tipo !== "professor") {
        return response.status(403).json({ msg: "Apenas professores podem acessar esse recurso" })
    }

    next()
}