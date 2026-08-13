import{Router}from "express"
import{ListaEquipes}from "../controllers/equipesControllers.js"

const router = Router()

router.get("/", ListaEquipes)

export default router