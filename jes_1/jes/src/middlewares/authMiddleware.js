import jwt from "jsonwebtoken"
import { getToken } from "../utils/getToken.js"

export const authMiddleware = (request, response, next) => {
    const token = getToken(request)

    if (!token) {
        return response.status(401).json({ msg: "Token não informado" })
    }

    try {
        const dadosUsuario = jwt.verify(token, process.env.JWT_SECRET)
        request.usuario = dadosUsuario 
        next()
    } catch (error) {
        return response.status(401).json({ msg: "Token inválido ou expirado" })
    }
}