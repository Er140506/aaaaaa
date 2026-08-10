import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js"
import { modalidadeModel } from "./modalidades.js";
import { equipeModel } from "./equipe.js";



export const partidasModel = conexao.define(
    "partidas",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        modalidadeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: modalidadeModel,
                key: "id"
            }
        },

        formato: {
            type: DataTypes.ENUM('pontoscorridos', 'eliminatoria'),
            allowNull: false
        },

        rodada: {
            type: DataTypes.INTEGER
            , allowNull: false
        },

        faseNome: {
            type: DataTypes.STRING(60),
            allowNull: false,
            field: 'fase_nome'
        },

        slot: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        timeAId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                // ERRO ORIGINAL: "times" não existe. O time é uma "equipe" mesmo,
                // e a tabela criada pelo equipeModel se chama "equipes".
                model: equipeModel,
                key: "id"
            }
        },

        timeBId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: equipeModel,
                key: "id"
            }
        },

        // ERRO ORIGINAL: placarA e placarB tinham "references" apontando para uma
        // tabela "placar" que nunca existiu no projeto. Placar aqui é só um número
        // (ex: 3 a 1), não um ID de outra tabela, então o "references" foi removido.
        placarA: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        placarB: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM('agendado', 'ao_vivo', 'finalizado',),
            allowNull: false,
            defaultValue: 'agendado'
        },

        data: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        hora: {
            type: DataTypes.TIME,
            allowNull: true
        },

        local: {
            type: DataTypes.STRING(80),
            allowNull: true
        },

        duracao: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        iniciadaEm: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'iniciada_em'
        },

        proximaPartidaId: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'proxima_partida_id', 
            references: {
                model: "partidas",
                key: "id"
            }
        },
        proximaPartidaVaga: { 
            type: DataTypes.ENUM('A', 'B'),
            allowNull: true,
            field: 'proxima_partida_vaga'
        }


    }
)