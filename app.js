// PackStyle - Mostrar figurinhas

let area = document.getElementById("figurinhas");

let lista = JSON.parse(localStorage.getItem("figurinhas")) || [];


lista.forEach((item)=>{

    let div = document.createElement("div");

    div.innerHTML = `
    
    <h3>${item.nome}</h3>

    <img src="${item.imagem}" width="150">

    <br>

    <button onclick="copiarImagem('${item.imagem}')">
    Copiar Figurinha
    </button>

    `;


    area.appendChild(div);

});


async function copiarImagem(url){

    try{

        let resposta = await fetch(url);

        let arquivo = await resposta.blob();

        await navigator.clipboard.write([
            new ClipboardItem({
                [arquivo.type]: arquivo
            })
        ]);

        alert("Figurinha copiada! Agora cole nos Stories ❤️");

    }

    catch{

        alert("Não foi possível copiar essa imagem");

    }

}
