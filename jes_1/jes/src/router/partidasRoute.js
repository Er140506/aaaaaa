// import { Router } from "express";
// import { 
//     cadastrarPartidas, 
//     listarPartidas,
//     buscarPartidaPorId,
//     atualizarPartida,
//     //deletarPartida
// } from "../controllers/partidasControllers.js";

// const router = Router()

// router.get("/", listarPartidas)
// router.post("/", cadastrarPartidas)
// router.get("/:id", buscarPartidaPorId)
// router.put("/:id", atualizarPartida)
// //router.delete("/:id", deletarPartida)

// export default router

import { Router } from "express";
import {
    cadastrarPartidas,
    listarPartidas,
    buscarPartidaPorId,
    atualizarPartida,
    //deletarPartida
} from "../controllers/partidasControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { permitirProfessor } from "../middlewares/permitirProfessor.js"

const router = Router()

router.get("/", authMiddleware, listarPartidas)
router.get("/:id", authMiddleware, buscarPartidaPorId)

router.post("/", authMiddleware, permitirProfessor, cadastrarPartidas)
router.put("/:id", authMiddleware, permitirProfessor, atualizarPartida)
//router.delete("/:id", authMiddleware, permitirProfessor, deletarPartida)

export default router