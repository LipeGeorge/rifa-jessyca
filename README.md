# 🎟️ RifaSimples

Um projeto de frontend "serverless" de custo zero para gerenciar rifas pequenas. Ele usa uma página HTML estática como interface e o Google Sheets como um "banco de dados" para controlar os números. O checkout é feito via API do WhatsApp.

Ideal para soluções rápidas e sem custo, onde o administrador (dono da rifa) pode gerenciar tudo pelo celular apenas editando uma planilha.

---

## 🚀 Como Funciona

1.  **"Banco de Dados" (Google Sheets):** Uma planilha pública no Google Sheets (publicada como CSV) armazena a lista de todos os números e seus respectivos status (`livre` ou `vendido`).
2.  **Frontend (HTML/JS):** O `index.html` carrega o site. Um script JavaScript faz um `fetch` (requisição) para o link do CSV.
3.  **Renderização:** O JavaScript lê o CSV e desenha a grade de números, colorindo-os com base no status (`bg-livre`, `bg-vendido`).
4.  **Seleção (Carrinho):** O usuário clica nos números livres. O JavaScript guarda os números selecionados em um array (carrinho de compras).
5.  **Checkout (WhatsApp):** Ao clicar em "Reservar", o script gera uma mensagem pré-formatada e abre a API do WhatsApp, enviando o pedido (com os números e o total) diretamente para o administrador.
6.  **Administração:** O dono da rifa recebe o Pix, abre a planilha do Google Sheets no celular e altera o status dos números de `livre` para `vendido`. O site reflete a mudança automaticamente na próxima vez que for carregado (ou após o cache do Google expirar, o que leva cerca de 5 minutos).

## 🛠️ Tecnologias Utilizadas

* **HTML5**
* **Bootstrap 5** (para estilo rápido, via CDN)
* **JavaScript (Vanilla)** (para a lógica e requisições)
* **Google Sheets** (como "banco de dados")
* **API do WhatsApp** (como "gateway de checkout")

---

## ⚙️ Guia de Instalação (Setup)

Para colocar o projeto no ar, siga estes 3 passos:

### Passo 1: Configurar o Google Sheets

1.  Crie uma nova planilha no Google Sheets.
2.  Na **Linha 1**, use os cabeçalhos (exatamente assim): `numero` e `status`.
3.  Na **Coluna A**, preencha os números da rifa (ex: 1, 2, 3...).
4.  Na **Coluna B**, preencha o status inicial de todos como `livre`.
5.  Vá em `Arquivo` > `Compartilhar` > `Publicar na Web`.
6.  Na janela que abrir, em "Link", mude de "Página da Web" para **Valores separados por vírgula (.csv)**.
7.  Clique em "Publicar" e confirme.
8.  **Copie o link gerado.**

### Passo 2: Configurar o `index.html`

Abra o arquivo `index.html` e encontre o bloco `<script>` no final. Dentro dele, localize e edite as variáveis de configuração:

```javascript
// --- CONFIGURAÇÕES ---
const SHEET_URL = 'COLE_SEU_LINK_DO_GOOGLE_SHEETS_AQUI'; 
const PRECO_POR_NUMERO = 10.00; // Valor de cada número
const WHATSAPP_NUMERO = '5511999999999'; // Seu número com 55 + DDD
