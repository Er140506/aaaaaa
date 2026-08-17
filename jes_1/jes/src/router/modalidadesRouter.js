import {Router} from "express"
import {
    listarModalidades,
    buscarporId,
    cadastrarModalidades,
    atualizarModalidades,
    classificacao,
    gerarChaveamento

} from '../controllers/modalidadesControllers.js'
import asyncHandler from "../utils/asyncHandler.js"

const router = Router()

router.get('/', asyncHandler(listarModalidades))
router.post('/', asyncHandler(cadastrarModalidades))
router.get('/:id', asyncHandler(buscarporId))
router.put('/:id', asyncHandler(atualizarModalidades))
router.post('/:id/chaveamento', asyncHandler(gerarChaveamento))
router.get('/:id/classificacao',asyncHandler(classificacao))

export default router