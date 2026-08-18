import { Router } from "express"
import { registrar, entra } from "../controllers/authControllers.js"

const router = Router()

router.post("/registrar", registrar)
router.post("/entra", entra)

export default router