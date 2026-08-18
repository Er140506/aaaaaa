import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js"

export const seriesModel = conexao.define(
    "series",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        nivel: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        pais: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        corPrimaria: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'cor_primaria'
        },
        corSecundaria: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'cor_secundaria'
        },
    }
)