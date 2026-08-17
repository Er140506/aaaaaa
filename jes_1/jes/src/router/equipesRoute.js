import { Router } from "express"
import {
    ListaEquipes,
    CriarEquipe,
    AtualizarEquipe,
    AtualizarParcialEquipe,
    DeletarEquipe
} from "../controllers/equipesControllers.js"

const router = Router()

router.get("/", ListaEquipes)
router.post("/", CriarEquipe)
router.put("/:id", AtualizarEquipe)
router.patch("/:id", AtualizarParcialEquipe)
router.delete("/:id", DeletarEquipe)

export default router