import { Router } from "express"
import {
    ListaProvas,
    CriarProva,
    AtualizarProva,
    AtualizarParcialProva,
    DeletarProva
} from "../controllers/provaControllers.js"

const router = Router()

router.get("/", ListaProvas)
router.post("/", CriarProva)
router.put("/:id", AtualizarProva)
router.patch("/:id", AtualizarParcialProva)
router.delete("/:id", DeletarProva)

export default router