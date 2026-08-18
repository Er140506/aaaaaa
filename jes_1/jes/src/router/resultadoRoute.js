import { Router } from "express"
import {
    ListaResultados,
    CriarResultado,
    AtualizarResultado,
    AtualizarParcialResultado,
    DeletarResultado
} from "../controllers/resultadoControllers.js"

const router = Router()

router.get("/", ListaResultados)
router.post("/", CriarResultado)
router.put("/:id", AtualizarResultado)
router.patch("/:id", AtualizarParcialResultado)
router.delete("/:id", DeletarResultado)

export default router