import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js"

export const modalidadeModel = conexao.define(
    "modalidades",
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

        emoji: {
            type: DataTypes.STRING(10),
            allowNull: false,
             defaultValue: ''
        },

        tipo: {
            type: DataTypes.ENUM('equipe', 'individual'),
            allowNull: false
        },

        minJogadores: {
            type: DataTypes.INTEGER,
             allowNull: false,
            defaultValue: 1
        },

        maxJogadores: {
            type: DataTypes.INTEGER,
             allowNull: false,
            defaultValue: 1
        },

        formato: {
            type: DataTypes.ENUM('pontoscorridos', 'eliminatoria', 'ranking'),
            allowNull: false,
            defaultValue: 'pontoscorridos'
        },

        duracaoPadrao: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        minDinamico: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        ranking: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }
)