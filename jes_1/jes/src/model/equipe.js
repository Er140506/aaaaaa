import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js"
import { modalidadeModel } from "./modalidades.js";
import { seriesModel } from "./series.js";

export const equipeModel = conexao.define(
    "equipes",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        modalidadeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: modalidadeModel,
                key:"id"
            }
        },
        serieId: {
            type: DataTypes.INTEGER,
            allowNull: true,
             references:{
                model:seriesModel,
                key:"id"
            }
        },
        turma: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        nome: {
            type: DataTypes.STRING(120)
            , allowNull: false
        },
        jogadores: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        combinadaDe1Id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field:"combinada_de_1_id",
        },
        combinadaDe2Id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field:"combinada_de_2_id"
        },
        fundidaEmId: {
            type: DataTypes.INTEGER,
            allowNull: true,
           
            
        },
    }
)

