import { Router } from "express"
import { registrar} from "../controllers/authControllers.js"

const router = Router()

router.post("/registrar", registrar)
export default router