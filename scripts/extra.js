function addPictures(){
    var pictures = document.getElementById("images");
    for(var index =0; index<9; index++){
        var picture = document.createElement("img");
        picture.src = filmData[index].image;
        picture.id = "image";
        picture.onclick = function(){
            redirect();
        }
        pictures.appendChild(picture);
    }
}

function redirect(){
    window.location = "index.html";
}