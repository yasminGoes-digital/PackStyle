// PackStyle - Painel Administrativo

function adicionarFigurinha() {

    let nome = document.getElementById("nome").value;
    let imagem = document.getElementById("imagem").value;
    let categoria = document.getElementById("categoria").value;


    if (nome === "" || imagem === "") {
        alert("Preencha todos os campos!");
        return;
    }


    let novaFigurinha = {
        nome: nome,
        imagem: imagem,
        categoria: categoria
    };


    let lista = JSON.parse(localStorage.getItem("figurinhas")) || [];


    lista.push(novaFigurinha);


    localStorage.setItem(
        "figurinhas",
        JSON.stringify(lista)
    );


    alert("Figurinha adicionada com sucesso!");


    document.getElementById("nome").value = "";
    document.getElementById("imagem").value = "";

}
