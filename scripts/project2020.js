/*
 NOM : HAOUILI/FEZZOUA
 GROUPE : M1-Groupe14-PW
*/

/**
 * fonction createFilm  : prend  en  paramètre  un  entier  index  et  dont  le  résultat  est l’élément DOM div.film correspondant au film d’indice index.
 * @param {*} index : représente index-film (l'ID de la balise film)
 */
function createFilm(index) {
    var film = document.createElement("div");
    film.id = index+"-film";
    film.classList.add("film");

    // Image
    var img = document.createElement("img");
    img.src = filmData[index].image;
    img.alt = filmData[index].title;


    var titre = document.createElement("h3");
    titre.innerText = filmData[index].title;


    film.appendChild(img);
    film.appendChild(titre);
    film.onmouseover = function() {mouseOver(filmData[index].text)}; // Display les détails
    film.onmouseout = function() {mouseOut()}; // Ne plus afficher les détails
    film.onclick = function(){selectFavori(index)}; // Sélectionner les favoris

    return film;
}
/**
 * fonction loading : parcours tous les films présent dans filmData et utilise la fonction createFilm pour les ajouter comme Child à la balise films
 */
function loading(){
    var films = document.getElementById("films");
    for(var i = 0; i<filmData.length; i++){
        films.appendChild(createFilm(i));
    }
}

/**
 * fonction addEventSearch : Ajoute un EventListener de type Keyup à l'inuput filter et associe la fonction displayTitres() pour pouvoir faire la recherche
 */
function addEventSearch(){
    var filter = document.getElementById("filter");
    filter.addEventListener("keyup",ev => {displayTitres()} )
}

/**
 * fonction displayTitres : filtre les films (child de films) présent dans la balise films à chaque fois qu'un événement Keyup a été déclanché sur l'input filter
 * PS : on ne cherche que dans les childs de films ce qui fait qu'un élement séléctionné comme favori, restera toujours favori même si il ne contains pas le texte recherché
 *      Nous avons essayé de filter les films d'un genre particulier, mais nous nous y sommes pas arrivé (Explication dans guide.txt). 
 */
function displayTitres(){
    var text = document.getElementById("filter").value;
    var childNodes = document.getElementById("films").childNodes;
    for(var index = 0; index<childNodes.length; index++){
        console.log(filmData[index].genre);
        var input = document.getElementsByName(filmData[index].genre);
        console.log(input);
        console.log(input.value);

        if(!input.checked){
            if(!childNodes[index].childNodes[1].innerText.includes(text)){
                childNodes[index].style.display = 'none';

            }else {
                childNodes[index].style.display = '';
            }
        }else if(input.checked){ // Pour filtrer avec les genres, on regarde s'il a était sélectionné (ne fonctionne pas)

            if(input.getAttribute("name") == filmData[index].genre){
                console.log(input.getAttribute("name") + " "+ filmData[index].genre);

                if(!childNodes[index].childNodes[1].innerText.includes(text)){
                    childNodes[index].style.display = 'none';

                }else {
                    childNodes[index].style.display = '';
                }
            }

        }


    }
}
/**
 * fonction mouseOver : Cette fonction permet d'afficher les détails d'un film quand la souris passe au-dessus, si le boutton cheched est validé ou non. 
 *                      On l'associe à film dans la fonction createFilm
 *  @param {*} text : C'est la description du film, récupéré depuis le fichier javascript filmData
 */
function mouseOver(text){
    var check = document.getElementById("showDetails").checked;
    if(check){
        document.getElementById("details").innerHTML = text;
    }
}

/**
 * fonction mouseOver : Cette fonction permet de supprimer les détails d'un film quand la souris n'est plus sur le film. 
 *                      On l'associe à film dans la fonction createFilm
 */
function mouseOut(){
    document.getElementById("details").innerHTML = " ";
}

/**
 * function selectFavori(index) : Elle permet de séléctionner les favoris en cliquant sur un film particulier
 *                                Plus en détails : 1- On récupère les childs des élements select1 @ select2, 
 *                                                  2- On vérifie si select1 est vide, si oui, on insère le film sinon, on vérifie select2, si oui, on insère le film, sinon on lève une alerte
 *                                                  3- On get le film cliqué grâce au paramètre index, puis on l'ajoute au select vide
 *                                                  4- On ajoute une information dans le localStorage pour garder les favoris quand on recharge la page
 *                                                  5- on désactive la fonction onClick => selectFavori de film pour permettre la déselection.
 * @param {*} index : numéro du film cliqué
 */
function selectFavori(index){
    var childSelect1 = document.getElementById("select1").childNodes;
    var childSelect2 = document.getElementById("select2").childNodes;

    if(childSelect1.length == 1){
        var span = childSelect1[0];
        console.log(index);
        var film = document.getElementById(index+"-film");
        document.getElementById("select1").appendChild(film);
        document.getElementById("select1").appendChild(span);

        // Pour ne pas perdre les favoris quand on recharge la page
        localStorage.setItem("select1", index);

        film.onclick = false;

    }else if(childSelect2.length == 1){
        var span = childSelect2[0];
        var film = document.getElementById(index+"-film");
        document.getElementById("select2").appendChild(film);
        document.getElementById("select2").appendChild(span);

        // Pour ne pas perdre les favoris quand on recharge la page
        localStorage.setItem("select2", index);

        film.onclick = false;
    }else{
        alert("Il n'y a plus de place dans la liste des favoris");
    }
}

/**
 * fonction addEventClick : permet d'ajouter un EventListerner sur les div select1 & select2 pour déselectionner les favoris. 
 *                          en associant à onClick, la fonction replaceFilm(element)
 */
function addEventClick(){
    var select1 = document.getElementById("select1");
    select1.onclick = function(){replaceFilm(1)};

    var select2 = document.getElementById("select2");
    select2.onclick = function(){replaceFilm(2)};
}
/**
 * fonction replaceFilm : Fonction exécutée quand il y'a un clique sur les div select1 et select2. 
 *                        On prend le film grâce à getElementById puis on l'ajoute au child de films
 * @param {*} index : l'index du select, il peut être 1 ou 2, a été initialisé dans addEventClick
 */
function replaceFilm(index){
    var childSelect = document.getElementById("select"+index).childNodes;
    var film = document.getElementById(childSelect[0].id);
    putOnclick(childSelect[0].id.charAt(0)); // Pour re-permettre la selection du film dans favori
    localStorage.removeItem("select"+index); // Pour vider le storage
    document.getElementById("films").appendChild(film);

}

/**
 * fonctio purOnclick : permet d'associer le l'event Onclick à la fonction selecFavori(index)
 * @param {*} index : numéro du film déselectionné
 */
function putOnclick(index){
    document.getElementById(index+"-film").onclick = function(){selectFavori(index)};
}
/**
 * fonction addEventSearchGenre : Ajoute un EventListener de type Keyup à l'inuput genre et associe la fonction displayGenres() pour pouvoir faire la recherche
 */
function addEventSearchGenre(){
    var genre = document.getElementById("genre");
    genre.addEventListener("keyup",ev => {displayGenres()} )
}


/**
 * fonction displayGenres : filtre les films présent dans filmData à chaque fois qu'un événement Keyup a été déclanché sur l'input genre
 */
function displayGenres(){
    var text = document.getElementById("genre").value;

    for(var index = 0; index<filmData.length; index++){

        if(!filmData[index].genre.includes(text)){
            console.log(document.getElementById(index+"-film").parentElement.id);
            if(document.getElementById(index+"-film").parentElement.id == "films"){ // Pour ne pas retirer l'élement sélectionné
                document.getElementById(index+"-film").style.display = 'none';
            }

        }else{
            document.getElementById(index+"-film").style.display = '';
        }
    }
}
/**
 * fonction loadingGenre : parcours filmData et récupère tous les genres présent dans filmData.genre pour pouvoir ajouter des genres existants à la gage index.html
 */
function loadingGenre(){

    var genres = [];
    for(var i = 0; i<filmData.length; i++){
        if(!genres.includes(filmData[i].genre)){
            createGenres(filmData[i].genre); // Crée le genre avec checkBox 

        }
        genres.push(filmData[i].genre);
    }
}

/**
 * fonction createGenres : permet d'ajouter des éléments (genre) à checks pour permettre à l'user de choisir la liste des films à voir dans catalogue suivant un genre particulier
 * @param {*} genre : nom texte du genre, récupéré avec la fonction loadingGenre()
 */
function createGenres(genre) {
    var checks = document.getElementById("checks");

    // input
    var input = document.createElement("input");
    input.type = "checkbox";
    input.className = "genre";
    input.name = genre;

    // label
    var label = document.createElement("label");
    label.innerText = genre +" ("+ getNbElements(genre)+")"; // Pour faire comme le rendu et récupérer le bon nombre de fims du genre


    var br = document.createElement("br");

    input.onclick = function(){filtreByGenres(input, genre)} // Pour réaliser le filtrage des films 
    // Insertion
    checks.appendChild(input);
    checks.appendChild(label);
    checks.appendChild(br);
}

/**
 * Parcours filmData et compte le nombre de films avec le genre passé en paramètre
 * @param {*} genre 
 */
function getNbElements(genre){
    var number = 0;
    for(var i = 0; i<filmData.length; i++){
        if(filmData[i].genre == genre){
            number ++;
        }
    }
    return number;
}

/**
 * fonction filtreByGenres : permet d'afficher ou d'enlever les films avec le genre cliqué.
 * @param {*} input : pour savoir quel input à été coché
 * @param {*} genre : pour récuperer le l'intitulé du genre 
 */
function filtreByGenres(input, genre){
    for(var index = 0; index<filmData.length; index++){
        if(input.checked){
            if(!filmData[index].genre.includes(genre)){
                if(document.getElementById(index+"-film").parentElement.id == "films"){ // Pour ne pas retirer l'élement sélectionné
                    document.getElementById(index+"-film").style.display = 'none';
                }
            }
        }else{
            if(document.getElementById(index+"-film").parentElement.id == "films"){ // Pour ne pas retirer l'élement sélectionné
                document.getElementById(index+"-film").style.display = '';
            }

        }
    }
}
/**
 * fonction printSelectionFromStorage : permet d'afficher les favoris même si la page a été rechargé.
 *                                      utile pour garder l'information.
 */
function printSelectionFromStorage(){
    if(localStorage.getItem("select1") != null){
        var index = localStorage.getItem("select1");
        selectFavori(index);

    }
    if(localStorage.getItem("select2") != null){
        var index = localStorage.getItem("select2");
        selectFavori(index);
    }
}