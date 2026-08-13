export const formatEquipe = (equipe) => {
    return {
        id: equipe.id,
        nome: equipe.nome,
        turma: equipe.turma,
        jogadores: equipe.jogadores,
        modalidadeId: equipe.modalidadeId,
        serieId: equipe.serieId,
        serie: equipe.serie
    };
};



export const formatEquipeList = (equipes) => {
    return equipes.map((equipe) => {
        return formatEquipe(equipe);
    });
};