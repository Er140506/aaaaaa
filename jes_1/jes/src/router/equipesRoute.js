import{Router}from "express"
import{ListaModalidade}from "../controllers/equipesControllers.js"

const router = Router()

router.get("/", ListaModalidade)

export default router