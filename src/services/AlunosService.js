import axios from 'axios';

const http = axios.create({
  baseURL: 'https://localhost:7081/api'
});

const AlunosService = {
  listarTurmaA() {
    return http.get('/v2.0/alunos/get-turma-a')
      .then(response => response.data)
      .catch(error => {
        console.error('Erro ao buscar alunos:', error);
        throw error;
      });
  },
  adicionarTurmaA(turma) {
    return http.post('/v2.0/alunos/add-turma-a', turma)
      .then(response => response.data)
      .catch(error => {
        console.error('Erro ao adicionar turma:', error);
        console.error('Dados do erro:', error.response.data);
        throw error;
      });
  },
  apagar(id) {
    return http.delete(`/v2.0/alunos/delete-turma-a/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Erro ao deletar aluno:', error);
        throw error;
      });
  },
  editarTurmaA(id, turma) {
    return http.put(`/v2.0/alunos/edit-turma-a/${id}`, turma)
      .then(response => response.data)
      .catch(error => {
        console.error('Erro ao editar turma:', error.response);
        console.error('Dados do erro:', error.response.data);
        throw error;
      });
  },
  baixarTurmaCSV() {
    return http.get('/v2.0/alunos/download-turma-a-csv', { responseType: 'blob' }) 
      .then(response => response.data)
      .catch(error => {
        console.error('Erro ao baixar CSV:', error);
        throw error;
      });
  }
};

export default AlunosService;
