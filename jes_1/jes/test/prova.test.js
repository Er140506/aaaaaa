import { describe, test, expect, beforeAll } from "vitest";
import app from "../src/app.js";
import request from "supertest";
import { conexao } from "../src/config/conexao.js";

let token;

beforeAll(async () => {
  await conexao.sync({ force: true });

   const usuario = await request(app)
    .post("/auth/registrar")
    .send({
      nome: "Professor Teste",
      email: `professor${Date.now()}@email.com`,
      senha: "123456789",
      codigoProfessor: process.env.CODIGO_PROFESSOR || "CODIGO_PADRAO_DO_SEU_BACKEND", // 
    });


  expect(usuario.status).toBe(201);

  token = usuario.body.token;
});


const criarModalidade = async (dados = {}) => {
  return await request(app)
    .post("/modalidades")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nome: `Modalidade ${Date.now()}${Math.random()}`,
      tipo: "individual",
      minJogadores: 1,
      maxJogadores: 10,
      formato: "ranking",
      ...dados,
    });
};


const criarProva = async (modalidadeId, dados = {}) => {
  return await request(app)
    .post("/provas")
    .set("Authorization", `Bearer ${token}`)
    .send({
      modalidadeId,
      nome: `Prova ${Date.now()}${Math.random()}`,
      tipoMarca: "menor",
      ...dados,
    });
};

describe("GET /provas", () => {
  test("Deve retornar o status 200 e uma lista", async () => {
    const response = await request(app).get("/provas");

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});

describe("POST /provas", () => {
  test("Deve retornar o status 201 ao criar uma prova válida", async () => {
    const modalidade = await criarModalidade();

    const response = await criarProva(modalidade.body.msg.id, {
      nome: "Prova dos 100m",
      tipoMarca: "menor",
    });

    expect(response.status).toBe(201);
    expect(response.ok).toBeTruthy();
    expect(response.body.prova).toHaveProperty("id");
    expect(response.body.prova.nome).toBe("Prova dos 100m");
    expect(response.body.prova.tipoMarca).toBe("menor");
    expect(response.body.prova.modalidadeId).toBe(modalidade.body.msg.id);
  });

  test("Deve retornar 400 quando o nome não for informado", async () => {
    const modalidade = await criarModalidade();

    const response = await request(app)
      .post("/provas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: modalidade.body.msg.id,
        tipoMarca: "menor",
      });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 400 quando o modalidadeId não for informado", async () => {
    const response = await request(app)
      .post("/provas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Prova sem modalidade",
        tipoMarca: "menor",
      });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 404 quando a modalidade informada não existir", async () => {
    const response = await request(app)
      .post("/provas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: 9999,
        nome: "Prova modalidade inexistente",
        tipoMarca: "menor",
      });

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 401 quando nenhum token for informado", async () => {
    const modalidade = await criarModalidade();

    const response = await request(app).post("/provas").send({
      modalidadeId: modalidade.body.msg.id,
      nome: "Prova sem token",
      tipoMarca: "menor",
    });

    expect(response.status).toBe(401);
    expect(response.ok).toBeFalsy();
  });
});

describe("PUT /provas/:id", () => {
  test("Deve retornar o status 200 ao atualizar por completo", async () => {
    const modalidade = await criarModalidade();
    const prova = await criarProva(modalidade.body.msg.id);

    const response = await request(app)
      .put(`/provas/${prova.body.prova.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: modalidade.body.msg.id,
        nome: "Prova Atualizada",
        tipoMarca: "maior",
      });

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.prova.nome).toBe("Prova Atualizada");
    expect(response.body.prova.tipoMarca).toBe("maior");
  });

  test("Deve retornar 400 quando o nome não for informado", async () => {
    const modalidade = await criarModalidade();
    const prova = await criarProva(modalidade.body.msg.id);

    const response = await request(app)
      .put(`/provas/${prova.body.prova.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: modalidade.body.msg.id,
        tipoMarca: "maior",
      });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 404 caso a prova não exista", async () => {
    const modalidade = await criarModalidade();

    const response = await request(app)
      .put("/provas/9999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: modalidade.body.msg.id,
        nome: "Prova Atualizada",
        tipoMarca: "maior",
      });

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 400 quando o id for inválido", async () => {
    const response = await request(app)
      .put("/provas/abc")
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: 1,
        nome: "Prova Atualizada",
        tipoMarca: "maior",
      });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });
});

describe("PATCH /provas/:id", () => {
  test("Deve retornar o status 200 ao atualizar parcialmente", async () => {
    const modalidade = await criarModalidade();
    const prova = await criarProva(modalidade.body.msg.id);

    const response = await request(app)
      .patch(`/provas/${prova.body.prova.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Prova Parcialmente Atualizada",
      });

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.prova.nome).toBe("Prova Parcialmente Atualizada");
  });

  test("Deve retornar 400 quando nenhum campo for enviado", async () => {
    const modalidade = await criarModalidade();
    const prova = await criarProva(modalidade.body.msg.id);

    const response = await request(app)
      .patch(`/provas/${prova.body.prova.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 400 quando o nome enviado for vazio", async () => {
    const modalidade = await criarModalidade();
    const prova = await criarProva(modalidade.body.msg.id);

    const response = await request(app)
      .patch(`/provas/${prova.body.prova.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "   " });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 404 caso a prova não exista", async () => {
    const response = await request(app)
      .patch("/provas/9999")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Prova Inexistente" });

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});

describe("DELETE /provas/:id", () => {
  test("Deve retornar o status 200 ao deletar uma prova existente", async () => {
    const modalidade = await criarModalidade();
    const prova = await criarProva(modalidade.body.msg.id);

    const response = await request(app)
      .delete(`/provas/${prova.body.prova.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  });

  test("Deve retornar 404 caso a prova não exista", async () => {
    const response = await request(app)
      .delete("/provas/9999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 401 quando nenhum token for informado", async () => {
    const modalidade = await criarModalidade();
    const prova = await criarProva(modalidade.body.msg.id);

    const response = await request(app).delete(
      `/provas/${prova.body.prova.id}`
    );

    expect(response.status).toBe(401);
    expect(response.ok).toBeFalsy();
  });
});