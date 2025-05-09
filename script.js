let convidados = [];
let familiaAtual = [];

const API_URL = 'https://script.google.com/macros/s/AKfycbz-I7Hh-AQoZiNVAW3kzzPuzmCykIQPY8363KdIk9A-UBaZoemdeVM_F19PgsJQtw8T/exec';

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

function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function mostrarImagem(nomeArquivo) {
  const container = document.getElementById('imagem-container');
  document.getElementById('main-container').style.display = 'none';

  if (nomeArquivo === 'combinados') {
    container.innerHTML = `
      <button onclick="voltarTelaInicial()" style="position:absolute;top:20px;left:20px;">⬅ Voltar</button>
      <button onclick="mostrarCardapio()" style="position:absolute;top:20px;right:20px;">🍽️ Cardápio</button>
      <img class="imagem-full" src="3.jpg" alt="Combinados" />
    `;
  } else {
    container.innerHTML = `
      <button onclick="voltarTelaInicial()" style="position:absolute;top:20px;left:20px;">⬅ Voltar</button>
      <img class="imagem-full" src="${nomeArquivo}" alt="Imagem" />
    `;
  }

  container.style.display = 'flex';
}

function mostrarCardapio() {
  const container = document.getElementById('imagem-container');
  container.innerHTML = `
    <button onclick="voltarTelaInicial()" style="position:absolute;top:20px;left:20px;">⬅ Voltar</button>
    <button onclick="mostrarImagem('combinados')" style="position:absolute;top:20px;right:20px;">↩️ Combinados</button>
    <img class="imagem-full" src="4.jpg" alt="Cardápio" />
  `;
}

function voltarTelaInicial() {
  document.getElementById('imagem-container').style.display = 'none';
  document.getElementById('main-container').style.display = 'flex';
}

function abrirMapa() {
  window.open("https://www.google.com/maps/place/SUA_LOCALIZACAO_AQUI", "_blank");
}
