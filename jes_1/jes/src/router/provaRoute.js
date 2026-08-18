// import { Router } from "express"
// import {
//     ListaProvas,
//     CriarProva,
//     AtualizarProva,
//     AtualizarParcialProva,
//     DeletarProva
// } from "../controllers/provaControllers.js"

// const router = Router()

// router.get("/", ListaProvas)
// router.post("/", CriarProva)
// router.put("/:id", AtualizarProva)
// router.patch("/:id", AtualizarParcialProva)
// router.delete("/:id", DeletarProva)

// export default router

import { Router } from "express"
import {
    ListaProvas,
    CriarProva,
    AtualizarProva,
    AtualizarParcialProva,
    DeletarProva
} from "../controllers/provaControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { permitirProfessor } from "../middlewares/permitirProfessor.js"

const router = Router()

router.get("/", ListaProvas)

router.post("/", authMiddleware, permitirProfessor, CriarProva)
router.put("/:id", authMiddleware, permitirProfessor, AtualizarProva)
router.patch("/:id", authMiddleware, permitirProfessor, AtualizarParcialProva)
router.delete("/:id", authMiddleware, permitirProfessor, DeletarProva)

export default router