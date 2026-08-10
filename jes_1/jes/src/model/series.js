import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js"
import { provaModel } from "./prova.js";


export const seriesModel = conexao.define(
    "series",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        provaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'prova_id',
            references: {
                model: provaModel,
                key: "id"
            }
        },
        equipeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'equipe_id',
            references: {
                model: "equipes",
                key: "id"
            }
        },
        marca: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
    }
)


