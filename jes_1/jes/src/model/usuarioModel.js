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
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O nome é obrigatório"
                },
                len: {
                    args: [3, 100],
                    msg: "O nome deve possuir 3 e 100 caracteres"
                }
            }
        },
        email: {
            type: DataTypes.STRING(160),
            allowNull: false,
            unique: true,
            unique: {
                msg: "Já existe um usuário cadastrado com esse e-mail"
            },
            validate: {
                notEmpty: {
                    msg: "o E-mail é obrigatoria"
                },
                isEmail: {
                    msg: "Informe uma e-mail valido"
                }
            }
        },
        senha: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: " a senha e obrigatoria"
                },
                len: {
                    args: [8, 100],
                    msg: "A senha deve ter mais que 8 e nenos que 100"
                }
            }
        },
    }
)