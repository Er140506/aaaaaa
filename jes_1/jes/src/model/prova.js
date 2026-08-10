import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js"

import { modalidadeModel } from "./modalidades.js";



export const provaModel =  conexao.define(
    "prova",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        modalidadeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'modalidade_id',
            references: {
                model: modalidadeModel,
                key: "id"
            }
        },
        nome: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        tipoMarca: {
            type: DataTypes.ENUM('menor', 'maior'),
            allowNull: false,
             defaultValue: 'menor',
            field: 'tipo_marca'
        }
    }
)
