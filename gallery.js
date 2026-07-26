const API_URL =
"https://script.google.com/macros/s/AKfycbxmKTqHSCzpHdvvtZF8vQPwZWNesUVblQLI38bEehXUEwSNTo8jQwwdC2YJd-wLZYhLbQ/exec";


const gallery =
document.getElementById("gallery");


const lightbox =
document.getElementById("lightbox");


const lightboxImage =
document.getElementById("lightbox-image");


const lightboxVideo =
document.getElementById("lightbox-video");


const lightboxUploader =
document.getElementById("lightbox-uploader");


const close =
document.getElementById("close");


const prev =
document.getElementById("prev");


const next =
document.getElementById("next");


let media = [];

let currentIndex = 0;





function uploaderText(item){

    if(!item.uploader || item.uploader === "Gast"){
        return "";
    }

    return "📷 " + item.uploader;

}





async function loadGallery(){

    try{

        const response =
        await fetch(
            API_URL + "?action=list"
        );

        const data =
        await response.json();

        if(!data.success){

            gallery.innerHTML =
            "Galerie konnte nicht geladen werden.";

            return;

        }

        media = data.gallery;

        renderGallery();

    }

    catch(error){

        console.error(error);

        gallery.innerHTML =
        "Galerie konnte nicht geladen werden.";

    }

}





function renderGallery(){

    gallery.innerHTML = "";

    media.forEach((item,index)=>{

        const card =
        document.createElement("div");

        card.className =
        "card";

        const uploader =
        uploaderText(item);

        if(item.video){

            card.innerHTML = `

            <div class="video-card">

                <img
                class="video-thumbnail"
                src="${item.thumbnail}"
                >

                <div class="play-button">

                    ▶

                </div>

            </div>

            ${
                uploader
                ?
                `<div class="uploader">${uploader}</div>`
                :
                ""
            }

            `;

            card.onclick =
            function(){

                openLightbox(index);

            };

        }

        else{

            card.innerHTML = `

            <img
            class="gallery-image"
            src="https://drive.google.com/thumbnail?id=${item.driveId}&sz=w1200"
            >

            ${
                uploader
                ?
                `<div class="uploader">${uploader}</div>`
                :
                ""
            }

            `;

            card.onclick =
            function(){

                openLightbox(index);

            };

        }

        gallery.appendChild(card);

    });

}





function openLightbox(index){

    currentIndex =
    index;

    lightbox.style.display =
    "flex";

    showMedia();

}





function showMedia(){

    const item =
    media[currentIndex];

    if(!item){
        return;
    }

    lightboxImage.style.display =
    "none";

    lightboxVideo.style.display =
    "none";

    lightboxVideo.pause();

    if(item.video){

        lightboxVideo.style.display =
        "block";

        lightboxVideo.src =
        "https://drive.google.com/uc?export=download&id="
        +
        item.driveId;

    }

    else{

        lightboxImage.style.display =
        "block";

        lightboxImage.src =
        "https://drive.google.com/thumbnail?id="
        +
        item.driveId
        +
        "&sz=w1800";

    }

    lightboxUploader.textContent =
    uploaderText(item);

}

function showNext(){

    currentIndex++;

    if(currentIndex >= media.length){

        currentIndex = 0;

    }

    showMedia();

}





function showPrevious(){

    currentIndex--;

    if(currentIndex < 0){

        currentIndex =
        media.length - 1;

    }

    showMedia();

}





if(close){

    close.onclick =
    function(){

        lightbox.style.display =
        "none";

        lightboxVideo.pause();

        lightboxVideo.removeAttribute("src");

        lightboxVideo.load();

    };

}





if(next){

    next.onclick =
    function(event){

        event.stopPropagation();

        showNext();

    };

}





if(prev){

    prev.onclick =
    function(event){

        event.stopPropagation();

        showPrevious();

    };

}





lightbox.onclick =
function(event){

    if(event.target === lightbox){

        lightbox.style.display =
        "none";

        lightboxVideo.pause();

        lightboxVideo.removeAttribute("src");

        lightboxVideo.load();

    }

};





document.addEventListener(

"keydown",

function(event){

    if(lightbox.style.display !== "flex"){

        return;

    }

    if(event.key === "ArrowRight"){

        showNext();

    }

    if(event.key === "ArrowLeft"){

        showPrevious();

    }

    if(event.key === "Escape"){

        lightbox.style.display =
        "none";

        lightboxVideo.pause();

        lightboxVideo.removeAttribute("src");

        lightboxVideo.load();

    }

}

);





let touchStartX = 0;





lightbox.addEventListener(

"touchstart",

function(event){

    touchStartX =
    event.changedTouches[0].screenX;

}

);





lightbox.addEventListener(

"touchend",

function(event){

    const touchEndX =
    event.changedTouches[0].screenX;

    if(touchEndX < touchStartX - 50){

        showNext();

    }

    if(touchEndX > touchStartX + 50){

        showPrevious();

    }

}

);





loadGallery();





setInterval(

function(){

    loadGallery();

},

20000

);

