// import { Router } from "express"
// import {
//     ListaSeries,
//     CriarSerie,
//     AtualizarSerie,
//     AtualizarParcialSerie,
//     DeletarSerie
// } from "../controllers/seriesControllers.js"

// const router = Router()

// router.get("/", ListaSeries)
// router.post("/", CriarSerie)
// router.put("/:id", AtualizarSerie)
// router.patch("/:id", AtualizarParcialSerie)
// router.delete("/:id", DeletarSerie)

// export default router

import { Router } from "express"
import {
    ListaSeries,
    CriarSerie,
    AtualizarSerie,
    AtualizarParcialSerie,
    DeletarSerie
} from "../controllers/seriesControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { permitirProfessor } from "../middlewares/permitirProfessor.js"

const router = Router()

router.get("/", ListaSeries)

router.post("/", authMiddleware, permitirProfessor, CriarSerie)
router.put("/:id", authMiddleware, permitirProfessor, AtualizarSerie)
router.patch("/:id", authMiddleware, permitirProfessor, AtualizarParcialSerie)
router.delete("/:id", authMiddleware, permitirProfessor, DeletarSerie)

export default router