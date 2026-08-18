import { Router } from "express"
import { login, entra } from "../controllers/authControllers.js"

const router = Router()


router.post("/login", login)
router.post("/entra", entra)
export default router