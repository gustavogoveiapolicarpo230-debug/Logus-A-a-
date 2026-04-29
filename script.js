// =========================
// VARIÁVEIS
// =========================
let carrinho = [];
let total = 0;

let maxCalda = 1;
let maxComp = 2;


// =========================
// INICIAR TUDO
// =========================
window.addEventListener("DOMContentLoaded", () => {

    iniciarSelecao();
    iniciarCremosinho();

    document.getElementById("tamanho").addEventListener("change", ()=>{
        definirRegras();
        atualizarPreco();
    });

});


// =========================
// SELEÇÃO AÇAÍ
// =========================
function iniciarSelecao(){

    document.querySelectorAll(".opcao input[type='checkbox']").forEach(input => {

        let opcao = input.closest(".opcao");

        input.addEventListener("change", () => {

            opcao.classList.toggle("selecionado", input.checked);

            validarLimites();
            atualizarPreco();
        });

        opcao.addEventListener("click", (e) => {
            if(e.target.tagName !== "INPUT"){
                input.checked = !input.checked;
                input.dispatchEvent(new Event("change"));
            }
        });

    });
}


// =========================
// CREMOSINHO (🔥 CORREÇÃO)
// =========================
function iniciarCremosinho(){

    // atualizar contador
    document.querySelectorAll(".creme").forEach(input => {
        input.addEventListener("input", atualizarCremosinho);
    });

    // botão (sem onclick no HTML)
    const btn = document.querySelector("#btnCremosinho");

    if(btn){
        btn.addEventListener("click", adicionarCremosinho);
    }
}


// =========================
// MODAL
// =========================
function abrirModal(){
    document.getElementById("modal").style.display = "block";
    definirRegras();
    atualizarPreco();
}

function fecharModal(){
    document.getElementById("modal").style.display = "none";
}


// =========================
// REGRAS
// =========================
function definirRegras(){

    let t = document.getElementById("tamanho").value;

    if(t == 8){ maxCalda = 1; maxComp = 2; }
    if(t == 12){ maxCalda = 2; maxComp = 2; }
    if(t == 15){ maxCalda = 2; maxComp = 3; }

    document.getElementById("regras").innerText =
        t == 8 ? "1 calda + 2 complementos" :
        t == 12 ? "2 caldas + 2 complementos" :
        "2 caldas + 3 complementos";
}


// =========================
// LIMITES
// =========================
function validarLimites(){

    let caldas = [...document.querySelectorAll(".calda:checked")];
    let comps  = [...document.querySelectorAll(".comp:checked")];

    while(caldas.length > maxCalda){
        let last = caldas.pop();
        last.checked = false;
        last.closest(".opcao").classList.remove("selecionado");
    }

    while(comps.length > maxComp){
        let last = comps.pop();
        last.checked = false;
        last.closest(".opcao").classList.remove("selecionado");
    }
}


// =========================
// PREÇO
// =========================
function atualizarPreco(){

    let base = parseFloat(document.getElementById("tamanho").value);
    let adds = document.querySelectorAll(".add:checked");

    let valor = base + (adds.length * 2.5);

    document.getElementById("precoAtual").innerText =
        "Total: R$ " + valor.toFixed(2);
}


// =========================
// ADICIONAR AÇAÍ
// =========================
function adicionar(){

    let nome = document.getElementById("nomeCliente").value || "Cliente";

    let base = parseFloat(document.getElementById("tamanho").value);
    let nomeTam = document.getElementById("tamanho").selectedOptions[0].text;

    let caldas = [...document.querySelectorAll(".calda:checked")].map(e => e.value);
    let comps  = [...document.querySelectorAll(".comp:checked")].map(e => e.value);
    let adds   = [...document.querySelectorAll(".add:checked")].map(e => e.value);

    console.log(caldas, comps, adds); // 👈 DEBUG

    let valor = base + (adds.length * 2.5);

    total += valor;

    carrinho.push({
        nome,
        nomeTam,
        caldas,
        comps,
        adds,
        valor
    });

    atualizarCarrinho();
    fecharModal();
}


// =========================
// CREMOSINHO ADD
// =========================
function adicionarCremosinho(){

    let sabores = [];
    let totalQtd = 0;
    let precoUnit = 2.50;

    document.querySelectorAll(".creme").forEach(i => {

        let qtd = parseInt(i.value) || 0;

        if(qtd > 0){
            sabores.push(`${i.dataset.sabor} (${qtd})`);
            totalQtd += qtd;
        }
    });

    if(totalQtd === 0){
        alert("Escolha pelo menos 1 cremosinho");
        return;
    }

    let valor = totalQtd * precoUnit;
    total += valor;

    carrinho.push({
        nome: "Cremosinho",
        nomeTam: totalQtd + " unidades",
        caldas: sabores,
        comps: [],
        adds: [],
        valor
    });

    atualizarCarrinho();

    // limpar
    document.querySelectorAll(".creme").forEach(i => i.value = 0);
    atualizarCremosinho();
}


// =========================
// CONTADOR CREMOSINHO
// =========================
function atualizarCremosinho(){

    let totalQtd = 0;

    document.querySelectorAll(".creme").forEach(i=>{
        totalQtd += parseInt(i.value) || 0;
    });

    document.getElementById("totalCremosinho").innerText =
        "Total: " + totalQtd + " unidades";
}


// =========================
// CARRINHO
// =========================
function atualizarCarrinho(){

    let lista = document.getElementById("carrinho");
    lista.innerHTML = "";

    carrinho.forEach((item, index)=>{

        let li = document.createElement("li");

        let caldas = item.caldas.length ? item.caldas.join(", ") : "Nenhuma";
        let comps  = item.comps.length ? item.comps.join(", ") : "Nenhum";
        let adds   = item.adds.length ? item.adds.join(", ") : "Nenhum";

        li.innerHTML = `
            <b>${item.nome}</b><br>
            ${item.nomeTam}<br>

            <small>Caldas: ${caldas}</small><br>
            <small>Complementos: ${comps}</small><br>
            <small>Adicionais: ${adds}</small><br>

            <b>R$ ${item.valor.toFixed(2)}</b><br>

            <button onclick="removerItem(${index})">❌ Remover</button>
        `;

        lista.appendChild(li);
    });

    document.getElementById("total").innerText =
        "Total: R$ " + total.toFixed(2);
}

// =========================
// REMOVER
// =========================
function removerItem(index){

    total -= carrinho[index].valor;
    carrinho.splice(index,1);

    atualizarCarrinho();
}


// =========================
// FINALIZAR
// =========================
function finalizar(){

    let msg = "💜 Pedido Logus Açaí 💜\n\n";

carrinho.forEach(i => {

    msg += `${i.nome} - ${i.nomeTam}\n`;

    if(i.caldas && i.caldas.length > 0){
        msg += `Caldas: ${i.caldas.join(", ")}\n`;
    }

    if(i.comps && i.comps.length > 0){
        msg += `Complementos: ${i.comps.join(", ")}\n`;
    }

    if(i.adds && i.adds.length > 0){
        msg += `Adicionais: ${i.adds.join(", ")}\n`;
    }

    msg += `Valor: R$${i.valor.toFixed(2)}\n\n`;
});

msg += `💰 Total: R$${total.toFixed(2)}`;

    window.open("https://wa.me/5587991292282?text=" + encodeURIComponent(msg));
}
