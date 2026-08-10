import { Sequelize } from "sequelize";

export const conexao = new Sequelize("jes","root","123456789",{
    host:"localhost",
    dialect:"mysql"
})