// --- CONFIGURAÇÕES ---
// COLE AQUI O LINK DO CSV QUE VOCÊ GEROU NO PASSO 1
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRKGsyuscKYI0aLYldQ06Jq6tyvGgOyIupFnrljpdLwv0v1Unh8A9FNDwYpeF8QpKCYUoH7YPLsa2Bs/pub?output=csv'; 

const PRECO_POR_NUMERO = 10.00; // Valor da rifa
const WHATSAPP_NUMERO = '5588981688970'; // Número da sua amiga (com 55 e DDD)

// --- ESTADO DA APLICAÇÃO ---
let numerosSelecionados = [];

// --- LÓGICA DO COUNTDOWN TIMER ---

// 1. Defina a data final do sorteio
// IMPORTANTE: O mês em JavaScript vai de 0 a 11 (Jan=0, Fev=1, ..., Nov=10, Dez=11)
// Formato: Ano, Mês (0-11), Dia, Hora, Minuto, Segundo
const dataSorteio = new Date(2025, 11, 20, 22, 0, 0).getTime(); // Ex: 20 de Nov de 2025 às 22:00

// 2. Armazena o elemento do timer
const timerElement = document.getElementById('countdown-display');

// 3. Atualiza o timer a cada 1 segundo
const timerInterval = setInterval(function() {
    const agora = new Date().getTime();
    const distancia = dataSorteio - agora;

    if (distancia < 0) {
        // Se o tempo acabou
        clearInterval(timerInterval);
        timerElement.innerHTML = "🎉 Sorteio Realizado! 🎉";
        // Muda o estilo para verde (opcional)
        timerElement.style.backgroundColor = "#28a745";
        timerElement.style.color = "white";
    } else {
        // Se ainda há tempo, calcula
        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        // 4. Exibe o resultado no HTML (o ⏰ é um emoji)
        timerElement.innerHTML = `⏰ ${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }
}, 1000);

// --- LÓGICA ---
async function carregarDados() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        processarCSV(data);
    } catch (error) {
        console.error('Erro ao carregar:', error);
        document.getElementById('grid-numeros').innerHTML = '<p class="text-danger text-center">Erro ao carregar os números. Avise o administrador.</p>';
    }
}

function processarCSV(textoCsv) {
    const linhas = textoCsv.split('\n');
    const grid = document.getElementById('grid-numeros');
    grid.innerHTML = ''; // Limpa o loading

    // Começa do i=1 para pular o cabeçalho da planilha
    for (let i = 1; i < linhas.length; i++) {
        // Divide a linha por vírgula (CSV simples)
        const colunas = linhas[i].split(',');
        if (colunas.length < 2) continue;

        const numero = colunas[0].trim();
        const status = colunas[1].trim().toLowerCase(); // "livre" ou "vendido"

        criarElementoNumero(numero, status);
    }
}

function criarElementoNumero(numero, status) {
    const grid = document.getElementById('grid-numeros');
    const div = document.createElement('div');
    div.className = 'col';

    // Define a classe baseada no status vindo da planilha
    let classeCor = status === 'vendido' ? 'bg-vendido' : 'bg-livre';
    
    div.innerHTML = `
        <div class="card h-100 numero-card ${classeCor}" 
                id="num-${numero}"
                onclick="toggleNumero('${numero}', '${status}')">
            <div class="card-body d-flex align-items-center justify-content-center p-2">
                <h5 class="m-0 fw-bold">${numero}</h5>
            </div>
        </div>
    `;
    grid.appendChild(div);
}

function toggleNumero(numero, statusOriginal) {
    if (statusOriginal === 'vendido') return; // Não faz nada se já vendeu

    const index = numerosSelecionados.indexOf(numero);
    const elemento = document.getElementById(`num-${numero}`);

    if (index > -1) {
        // Se já estava selecionado, remove
        numerosSelecionados.splice(index, 1);
        elemento.classList.remove('bg-selecionado');
        elemento.classList.add('bg-livre');
    } else {
        // Se não estava, adiciona
        numerosSelecionados.push(numero);
        elemento.classList.remove('bg-livre');
        elemento.classList.add('bg-selecionado');
    }

    atualizarBarraCheckout();
}

function atualizarBarraCheckout() {
    const barra = document.getElementById('checkout-bar');
    const contador = document.getElementById('contador-selecao');
    const total = document.getElementById('valor-total');

    if (numerosSelecionados.length > 0) {
        barra.style.display = 'block';
        contador.innerText = numerosSelecionados.join(', ');
        total.innerText = (numerosSelecionados.length * PRECO_POR_NUMERO).toFixed(2).replace('.', ',');
    } else {
        barra.style.display = 'none';
    }
}

function enviarWhatsApp() {
    if (numerosSelecionados.length === 0) return;

    const nums = numerosSelecionados.join(', ');
    const total = (numerosSelecionados.length * PRECO_POR_NUMERO).toFixed(2).replace('.', ',');
    
    // Cria a mensagem
    const mensagem = `Olá! Gostaria de reservar os números: *${nums}*. Total: R$ ${total}. Como faço o Pix?`;
    
    // Abre o WhatsApp
    const link = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
}

// Inicia tudo
carregarDados();
