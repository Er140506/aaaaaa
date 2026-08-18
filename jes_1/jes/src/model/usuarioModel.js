import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js"

export const usuarioModel = conexao.define(
    "usuarios",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(160),
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        senha: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        // "professor" tem acesso total; "aluno" só pode visualizar
        tipo: {
            type: DataTypes.ENUM("professor", "aluno"),
            allowNull: false,
            defaultValue: "aluno"
        },
    }
)