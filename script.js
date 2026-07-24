/* ==========================================================
   PACKSTYLE
   SCRIPT.JS

   PARTE 1
========================================================== */

"use strict";

/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

const CONFIG = {

    jsonPath: "data/stickers.json",

    favoritesKey: "packstyle_favorites",

    version: "1.0.0"

};


/* ==========================================================
   ELEMENTOS DA TELA
========================================================== */

const searchInput = document.getElementById("searchInput");

const stickersContainer = document.getElementById("stickersContainer");

const categoriesContainer = document.getElementById("categories");

const modal = document.getElementById("modal");

const modalImage = document.getElementById("modalImage");

const modalTitle = document.getElementById("modalTitle");

const toast = document.getElementById("toast");

const closeModal = document.getElementById("closeModal");

const copyButton = document.getElementById("copySticker");

const favoriteButton = document.getElementById("favoriteSticker");

const favoritesButton = document.getElementById("favoritesButton");

const homeButton = document.getElementById("homeButton");


/* ==========================================================
   VARIÁVEIS
========================================================== */

let stickers = [];

let filteredStickers = [];

let favorites = [];

let currentSticker = null;

let selectedCategory = "Todos";

let favoritesMode = false;


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener("DOMContentLoaded", init);

async function init(){

    loadFavorites();

    await loadStickers();

    createCategories();

    renderStickers();

    registerEvents();

}


/* ==========================================================
   CARREGAR JSON
========================================================== */

async function loadStickers(){

    try{

        const response = await fetch(CONFIG.jsonPath);

        stickers = await response.json();

        filteredStickers = [...stickers];

    }

    catch(error){

        console.error(error);

        showToast("Erro ao carregar figurinhas.");

    }

}


/* ==========================================================
   FAVORITOS
========================================================== */

function loadFavorites(){

    favorites = JSON.parse(

        localStorage.getItem(CONFIG.favoritesKey)

    ) || [];

}


function saveFavorites(){

    localStorage.setItem(

        CONFIG.favoritesKey,

        JSON.stringify(favorites)

    );

}


/* ==========================================================
   TOAST
========================================================== */

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}/* ==========================================================
   PARTE 2
   CATEGORIAS • PESQUISA • RENDERIZAÇÃO
========================================================== */

/* ==========================================================
   CRIAR CATEGORIAS
========================================================== */

function createCategories(){

    categoriesContainer.innerHTML = "";

    const categories = [
        "Todos",
        ...new Set(
            stickers.map(item => item.categoria)
        )
    ];

    categories.forEach(category=>{

        const button = document.createElement("button");

        button.className="category";

        if(category===selectedCategory){

            button.classList.add("active");

        }

        button.textContent=category;

        button.addEventListener("click",()=>{

            selectedCategory=category;

            favoritesMode=false;

            updateCategoryButtons();

            filterStickers();

        });

        categoriesContainer.appendChild(button);

    });

}


/* ==========================================================
   BOTÕES DAS CATEGORIAS
========================================================== */

function updateCategoryButtons(){

    document
    .querySelectorAll(".category")
    .forEach(button=>{

        button.classList.remove("active");

        if(button.textContent===selectedCategory){

            button.classList.add("active");

        }

    });

}


/* ==========================================================
   PESQUISA
========================================================== */

function filterStickers(){

    const search = searchInput.value
    .trim()
    .toLowerCase();

    filteredStickers = stickers.filter(sticker=>{

        const byCategory =
            selectedCategory==="Todos"
            ||
            sticker.categoria===selectedCategory;

        const byName =
            sticker.nome
            .toLowerCase()
            .includes(search);

        const byTags =
            sticker.tags
            ?.join(" ")
            .toLowerCase()
            .includes(search);

        const byFavorite =
            !favoritesMode
            ||
            favorites.includes(sticker.id);

        return (
            byCategory
            &&
            byFavorite
            &&
            (
                byName
                ||
                byTags
            )
        );

    });

    renderStickers();

}


/* ==========================================================
   RENDERIZAÇÃO
========================================================== */

function renderStickers(){

    stickersContainer.innerHTML="";

    if(filteredStickers.length===0){

        stickersContainer.innerHTML=`

        <div class="empty">

            <h2>

                Nenhuma figurinha encontrada

            </h2>

            <p>

                Tente outra pesquisa
                ou categoria.

            </p>

        </div>

        `;

        return;

    }

    filteredStickers.forEach(createCard);

}


/* ==========================================================
   CARD
========================================================== */

function createCard(sticker){

    const favorite =
    favorites.includes(sticker.id);

    const card =
    document.createElement("div");

    card.className="sticker-card fade-in";

    card.innerHTML=`

        <img
            class="sticker-image"
            src="${sticker.arquivo}"
            alt="${sticker.nome}">

        <div class="sticker-info">

            <div class="sticker-title">

                ${sticker.nome}

            </div>

            <div class="sticker-buttons">

                <button
                    class="copy-button">

                    Copiar

                </button>

                <button
                    class="favorite-button
                    ${favorite?"active":""}">

                    ${favorite?"❤️":"🤍"}

                </button>

            </div>

        </div>

    `;

    const image =
    card.querySelector(".sticker-image");

    const copy =
    card.querySelector(".copy-button");

    const fav =
    card.querySelector(".favorite-button");

    image.addEventListener("click",()=>{

        openModal(sticker);

    });

    copy.addEventListener("click",()=>{

        copySticker(sticker);

    });

    fav.addEventListener("click",()=>{

        toggleFavorite(sticker.id);

    });

    stickersContainer.appendChild(card);

}/* ==========================================================
   PARTE 3
   FAVORITOS • MODAL • COPIAR
========================================================== */


/* ==========================================================
   FAVORITOS
========================================================== */

function toggleFavorite(id){

    if(favorites.includes(id)){

        favorites=favorites.filter(item=>item!==id);

        showToast("Removido dos favoritos.");

    }else{

        favorites.push(id);

        showToast("Adicionado aos favoritos.");

    }

    saveFavorites();

    filterStickers();

}


/* ==========================================================
   BOTÃO FAVORITOS
========================================================== */

favoritesButton.addEventListener("click",()=>{

    favoritesMode=true;

    filterStickers();

});


homeButton.addEventListener("click",()=>{

    favoritesMode=false;

    filterStickers();

});


/* ==========================================================
   MODAL
========================================================== */

function openModal(sticker){

    currentSticker=sticker;

    modalImage.src=sticker.arquivo;

    modalTitle.textContent=sticker.nome;

    modal.classList.add("show");

}


closeModal.addEventListener("click",()=>{

    modal.classList.remove("show");

});


modal.addEventListener("click",(event)=>{

    if(event.target===modal){

        modal.classList.remove("show");

    }

});


/* ==========================================================
   COPIAR
========================================================== */

copyButton.addEventListener("click",()=>{

    if(currentSticker){

        copySticker(currentSticker);

    }

});


/* ==========================================================
   COPIAR FIGURINHA
========================================================== */

async function copySticker(sticker){

    try{

        const response=await fetch(sticker.arquivo);

        const blob=await response.blob();

        /* Clipboard API */

        if(

            navigator.clipboard

            &&

            window.ClipboardItem

        ){

            await navigator.clipboard.write([

                new ClipboardItem({

                    [blob.type]:blob

                })

            ]);

            showToast("Figurinha copiada!");

            return;

        }

        /* Compartilhar */

        if(

            navigator.canShare

            &&

            navigator.share

        ){

            const file=new File(

                [blob],

                sticker.nome+".png",

                {

                    type:"image/png"

                }

            );

            if(

                navigator.canShare({

                    files:[file]

                })

            ){

                await navigator.share({

                    files:[file],

                    title:sticker.nome

                });

                return;

            }

        }

        /* Download */

        const url=URL.createObjectURL(blob);

        const link=document.createElement("a");

        link.href=url;

        link.download=sticker.nome+".png";

        link.click();

        URL.revokeObjectURL(url);

        showToast("Imagem baixada.");

    }

    catch(error){

        console.error(error);

        showToast(

            "Seu navegador não suporta esta função."

        );

    }

}/* ==========================================================
   PARTE 4
   EVENTOS • PWA • FINALIZAÇÃO
========================================================== */


/* ==========================================================
   EVENTOS
========================================================== */

function registerEvents(){

    searchInput.addEventListener(

        "input",

        filterStickers

    );

}


/* ==========================================================
   SERVICE WORKER
========================================================== */

if(

    "serviceWorker"

    in

    navigator

){

    window.addEventListener(

        "load",

        ()=>{

            navigator

            .serviceWorker

            .register(

                "service-worker.js"

            )

            .then(()=>{

                console.log(

                    "Service Worker registrado."

                );

            })

            .catch(error=>{

                console.error(error);

            });

        }

    );

}


/* ==========================================================
   INSTALAÇÃO PWA
========================================================== */

let deferredPrompt=null;

window.addEventListener(

    "beforeinstallprompt",

    event=>{

        event.preventDefault();

        deferredPrompt=event;

    }

);


async function installApp(){

    if(!deferredPrompt){

        return;

    }

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt=null;

}


/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

document

.getElementById(

    "settingsButton"

)

.addEventListener(

    "click",

    ()=>{

        showToast(

            "Configurações em desenvolvimento."

        );

    }

);


/* ==========================================================
   ATUALIZAÇÕES FUTURAS
========================================================== */

/*

Espaço reservado para:

✔ Login

✔ Banco de dados

✔ Sincronização

✔ Pacotes Premium

✔ Upload automático

✔ Notificações Push

✔ Tema escuro

✔ Idiomas

*/


/* ==========================================================
   FIM DO ARQUIVO
========================================================== */
