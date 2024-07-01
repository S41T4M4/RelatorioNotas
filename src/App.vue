<template>
  <div class="app">
    <div class="container">
      <table class="table">
        <thead>
          <tr class = "headers">
            <th>Turmas/A/B/C</th>
            <th>Nome</th>
            <th>Matemática</th>
            <th>Geografia</th>
            <th>Português</th>
            <th>Inglês</th>
            <th>História</th>
            <th>Ciências</th>
            <th>Ed. Física</th>
            <th>Média Total</th>
            <th>Situação do Aluno</th>
            <th>Excluir Editar</th>
          </tr>
        </thead>
        <tbody>
        <tr class="myTr" v-for="aluno in alunos" :key="aluno.id">
          <td :class="getTurmaClass(aluno.nomeTurma)" id="turmaName">{{ aluno.nomeTurma }}</td>
          <td>{{ aluno.nome }}</td>
          <td :class="getNotaClass(aluno.matematica)">{{ aluno.matematica }}</td>
          <td :class="getNotaClass(aluno.geografia)">{{ aluno.geografia }}</td>
          <td :class="getNotaClass(aluno.portugues)">{{ aluno.portugues }}</td>
          <td :class="getNotaClass(aluno.ingles)">{{ aluno.ingles }}</td>
          <td :class="getNotaClass(aluno.historia)">{{ aluno.historia }}</td>
          <td :class="getNotaClass(aluno.ciencias)">{{ aluno.ciencias }}</td>
          <td :class="getNotaClass(aluno.educacaoFisica)">{{ aluno.educacaoFisica }}</td>
          <td :class="getMediaClass(aluno.mediaTotal)">{{ aluno.mediaTotal }}</td>
          <td>{{ aluno.aprovado }}</td>       
          <td><button id="apagar" @click="apagar(aluno.id)" class="waves-effect btn-small red darken-1"><i class="material-icons">delete_sweep</i></button>
          <button id="edit" @click="editar(aluno)" class="waves-effect btn-small blue darken-1"><i class="material-icons">create</i></button></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="container">
      <form id="myInput" @submit.prevent="salvarTurma"> 
      <label>Turma</label>
      <input id="turmaI" type="text" placeholder="Turma" v-model="turma.nomeTurma"/>
      <label>Nome</label>
      <input id="turmaI" type="text" placeholder="Nome" v-model="turma.nome"/>
      <label>Matemática</label>
      <input id="turmaI" type="text" placeholder="Matemática" v-model="turma.matematica"/>
      <label>Geografia</label>
      <input id="turmaI" type="text" placeholder="Geografia" v-model="turma.geografia"/>
      <label>Português</label>
      <input id="turmaI" type="text" placeholder="Português" v-model="turma.portugues"/>
      <label>Inglês</label>
      <input id="turmaI" type="text" placeholder="Inglês" v-model="turma.ingles"/>
      <label>História</label>
      <input id="turmaI" type="text" placeholder="História" v-model="turma.historia"/>
      <label>Ciências</label>
      <input id="turmaI" type="text" placeholder="Ciências" v-model="turma.ciencias"/>
      <label>Educação Física</label>
      <input id="turmaI" type="text" placeholder="Educação Física" v-model="turma.educacaoFisica"/>
      <button id="saveButton" type="submit" class="waves-effect waves-light btn-small">Salvar<i class="material-icons left">save</i></button>
      <button id="baixarCsv" @click="baixarCSV" class="waves-effect waves-light btn-small">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
      </svg>
    </button>
  </form>
</div>
</div>
</template>

<script>
import AlunosService from './services/AlunosService';

export default {
  data() {
    return {
      turma: {
        nomeTurma: '',
        nome: '',
        matematica: '',
        geografia: '',
        portugues: '',
        ingles: '',
        historia: '',
        ciencias: '',
        educacaoFisica: '',
        mediaTotal: '',
        aprovado: ''
      },
      alunos: []
    };
  },
  mounted() {
    this.carregarAlunos();
  },
  methods: {
    carregarAlunos() {
      AlunosService.listarTurmaA()
        .then(alunos => {
          this.alunos = alunos;
          console.log('Alunos:', this.alunos);
        })
        .catch(error => {
          console.error('Erro ao carregar alunos:', error);
        });
    },
    baixarCSV() {
      AlunosService.baixarTurmaCSV()
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'RelatórioAlunos.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error('Erro ao baixar CSV:', error);
        });
    },
    salvarTurma() {
      const turma = this.formatarTurma();
      if (this.turma.id) {
        this.editarTurmaA(turma);
      } else {
        this.adicionarTurmaA(turma);
      }
    },
    adicionarTurmaA(turma) {
      AlunosService.adicionarTurmaA(turma)
        .then(() => {
          this.carregarAlunos();
          this.resetarFormulario();
        })
        .catch(error => {
          console.log('Erro ao adicionar turma:', error.response);
          console.log('Dados do erro:', error.response.data);
        });
    },
    editarTurmaA(aluno) {
      AlunosService.editarTurmaA(aluno.id, aluno)
        .then(() => {
          this.carregarAlunos();
          this.resetarFormulario();
        })
        .catch(error => {
          window.alert('Turma inválida !', error.response);
          console.log('Dados do erro:', error.response.data);
        });
    },
    apagar(id) {
      if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
        AlunosService.apagar(id)
          .then(() => {
            window.alert("Aluno deletado com sucesso.");
            this.carregarAlunos();
          })
          .catch(error => {
            window.alert('Erro ao deletar aluno:', error);
          });
      } else {
        window.alert("Operação de exclusão cancelada pelo usuário.");
      }
    },
    editar(aluno) {
      this.turma = {
        nomeTurma: aluno.nomeTurma,
        id: aluno.id,
        nome: aluno.nome,
        matematica: aluno.matematica,
        geografia: aluno.geografia,
        portugues: aluno.portugues,
        ingles: aluno.ingles,
        historia: aluno.historia,
        ciencias: aluno.ciencias,
        educacaoFisica: aluno.educacaoFisica,
        mediaTotal: aluno.mediaTotal,
        aprovado: aluno.aprovado
      };
    },
    resetarFormulario() {
      this.turma = {
        nomeTurma: '',
        nome: '',
        matematica: '',
        geografia: '',
        portugues: '',
        ingles: '',
        historia: '',
        ciencias: '',
        educacaoFisica: '',
        mediaTotal: '',
        aprovado: ''
      };
    },
    formatarTurma() {
      return {
        nomeTurma: this.turma.nomeTurma,
        id: this.turma.id,
        nome: this.turma.nome,
        matematica: Number(this.turma.matematica),
        geografia: Number(this.turma.geografia),
        portugues: Number(this.turma.portugues),
        ingles: Number(this.turma.ingles),
        historia: Number(this.turma.historia),
        ciencias: Number(this.turma.ciencias),
        educacaoFisica: Number(this.turma.educacaoFisica),
        mediaTotal: Number(this.turma.mediaTotal),
        aprovado: this.turma.aprovado,
      };
    },
    getTurmaClass(nometurma) {
      if (nometurma === 'Turma A') {
        return 'turma-a';
      } else if (nometurma === 'Turma B') {
        return 'turma-b';
      } else if (nometurma === 'Turma C') {
        return 'turma-c';
      }
      return '';
    },
    getNotaClass(nota) {
      return nota >= 6 ? 'nota-verde' : 'nota-vermelha';
    },
    getMediaClass(mediaTotal){
      return mediaTotal >=6 ? 'media-verde' : 'media-vermelha';
    }
  }
};
</script>

<style>
*{
  font-family: sans-serif;
}
.app {
 background-color: #bedbe0;
}
.table {
border-collapse: collapse;
font-size: 0.9em;
min-width: 400px;
border-radius: 5px 5px 0 0;
overflow: hidden;
box-shadow: 0 0 40px rgba(0, 0, 0, 0.15);
}
#baixarCsv {
  background-color: rgb(26, 91, 4);
  left: 1100px;
  top:4px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
#baixarCsv:hover {
  background-color: rgb(0, 128, 0);
}
#saveButton {
  background-color: rgb(0, 80, 155);
  left: 1099px;
  top:4px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
#saveButton:hover {
  background-color: rgb(0, 0, 104);
}
#turmaI{
  background-color: rgb(255, 255, 255);
}
#turmaI:hover {
  background-color: rgb(241, 241, 241);
}
.headers{
  background-color: #000000;
}
.headers th{
  padding: 12px 15px;
  color: #ffffff;
}
.turma-a {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  color: rgb(123, 57, 128);
  background-color: rgb(255, 255, 255);
}
.turma-a:hover{
  color: white;
  background-color: rgb(123, 57, 160);
}
.turma-b {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  color: rgb(91, 156, 139);
  background-color: rgb(255, 255, 255);
}
.turma-b:hover{
  color: white;
  background-color: rgb(60, 103, 91);
}
.turma-c {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  color: rgb(83, 138, 189);
  background-color: rgb(255, 255, 255);
}
.turma-c:hover{
  color: white;
  background-color: rgb(27, 69, 106);
}
tr{
border: 1px solid black;
}
td{
border: 1px solid black;
}
th{
  border: 1px solid black;
  color: rgb(0, 0, 0);
}
.nota-verde:hover {
  background-color: #d7f0dd;
  color: #060706;
}
.nota-vermelha:hover {
  background-color: #f6d4d6;
  color: #000000;
}
.myTr{
  background-color: #ffffff;
  color: #020101;
  text-align: left;
  font-weight: bold;
}
#myInput{
  width: 100%;
  font-size: 18px; 
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #000000;
  box-shadow: #000000;
}
.media-verde{
  color: #000000;
  background-color: #66ca7d;
}
.media-vermelha{
  background-color: #e8656e;
}
</style>