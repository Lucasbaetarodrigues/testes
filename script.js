let convidados = [];
let familiaAtual = [];

// URL da API do Google Sheets
const API_URL = 'https://script.google.com/macros/s/AKfycbz-I7Hh-AQoZiNVAW3kzzPuzmCykIQPY8363KdIk9A-UBaZoemdeVM_F19PgsJQtw8T/exec';

// Função que busca nome na planilha
async function buscarFamilia() {
  const nomeDigitado = document.getElementById('nome').value.trim().toLowerCase();
  if (!nomeDigitado) {
    alert('Por favor, digite seu nome.');
    return;
  }

  try {
    if (convidados.length === 0) {
      const response = await fetch(API_URL);
      convidados = await response.json();
    }

    const convidado = convidados.find(c =>
      removerAcentos(c.nome.toLowerCase()) === removerAcentos(nomeDigitado)
    );

    if (!convidado) {
      alert('Nome não encontrado.');
      return;
    }

    const familia = convidado.familia;
    familiaAtual = convidados.filter(c => c.familia === familia).map(c => c.nome);

    mostrarCheckboxes(familiaAtual);
  } catch (error) {
    console.error(error);
    alert('Erro ao buscar lista de convidados.');
  }
}

// Exibe os checkboxes com os nomes da família
function mostrarCheckboxes(membros) {
  const form = document.getElementById('familiaForm');
  form.innerHTML = '';
  membros.forEach(nome => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = nome;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + nome));
    form.appendChild(label);
  });

  document.getElementById('familia-container').style.display = 'block';
  document.getElementById('mensagem-sucesso').style.display = 'none';
}

// Envia confirmação de presença
async function confirmarPresenca() {
  const selecionados = Array.from(document.querySelectorAll('#familiaForm input[type="checkbox"]:checked')).map(cb => cb.value);
  if (selecionados.length === 0) {
    alert('Selecione pelo menos um nome.');
    return;
  }

  try {
    await Promise.all(selecionados.map(nome =>
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `nome=${encodeURIComponent(nome)}&status=Confirmado`
      })
    ));

    document.getElementById('familia-container').style.display = 'none';
    document.getElementById('mensagem-sucesso').style.display = 'block';
    document.getElementById('nome').value = '';
  } catch (error) {
    console.error(error);
    alert('Erro ao confirmar presença.');
  }
}

// Remove acentos para facilitar comparação de nomes
function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Exibe uma imagem em tela cheia
function mostrarImagem(nomeArquivo) {
  document.getElementById('main-container').style.display = 'none';
  const imagem = document.getElementById('imagem-exibida');
  imagem.src = nomeArquivo;
  document.getElementById('imagem-container').style.display = 'flex';
}

// Volta para a tela principal
function voltarTelaInicial() {
  document.getElementById('imagem-container').style.display = 'none';
  document.getElementById('main-container').style.display = 'flex';
}

// Abre link do Google Maps
function abrirMapa() {
  window.open("https://www.google.com/maps/place/SUA_LOCALIZACAO_AQUI", "_blank");
}
