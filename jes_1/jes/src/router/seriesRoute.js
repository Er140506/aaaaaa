import { Router } from "express"
import {
    ListaSeries,
    CriarSerie,
    AtualizarSerie,
    AtualizarParcialSerie,
    DeletarSerie
} from "../controllers/seriesControllers.js"

const router = Router()

router.get("/", ListaSeries)
router.post("/", CriarSerie)
router.put("/:id", AtualizarSerie)
router.patch("/:id", AtualizarParcialSerie)
router.delete("/:id", DeletarSerie)

export default router