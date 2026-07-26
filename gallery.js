const API_URL =
"https://script.google.com/macros/s/AKfycbxmKTqHSCzpHdvvtZF8vQPwZWNesUVblQLI38bEehXUEwSNTo8jQwwdC2YJd-wLZYhLbQ/exec";


const gallery =
document.getElementById("gallery");


const lightbox =
document.getElementById("lightbox");


const lightboxImage =
document.getElementById("lightbox-image");


const lightboxUploader =
document.getElementById("lightbox-uploader");


const close =
document.getElementById("close");


const prev =
document.getElementById("prev");


const next =
document.getElementById("next");


let images = [];

let currentIndex = 0;



async function loadGallery(){

    try {

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


        const items =
        data.gallery;


        images =
        items.filter(
            item => !item.video
        );


        renderGallery(
            items.reverse()
        );


    } catch(error){

        console.error(error);

        gallery.innerHTML =
        "Galerie konnte nicht geladen werden.";

    }

}




function renderGallery(items){


    gallery.innerHTML = "";


    items.forEach(item => {


        const card =
        document.createElement("div");


        card.className =
        "card";



        if(item.video){


            card.innerHTML = `

            <div class="video-card"
            onclick="openVideo('${item.driveId}')">


                <div class="play-button">
                    ▶
                </div>


            </div>


            <div class="uploader">
            Hochgeladen von ${item.uploader || "Gast"}
            </div>

            `;


        } else {


            card.innerHTML = `

            <img 
            src="https://drive.google.com/thumbnail?id=${item.driveId}&sz=w1200"
            >


            <div class="uploader">
            Hochgeladen von ${item.uploader || "Gast"}
            </div>

            `;


            const image =
            card.querySelector("img");



            image.onclick =
            function(){


                const index =
                images.findIndex(
                    img =>
                    img.driveId === item.driveId
                );


                openLightbox(index);


            };


        }



        gallery.appendChild(card);


    });


}




function openVideo(id){


    window.open(
        "https://drive.google.com/file/d/"
        +
        id
        +
        "/view",
        "_blank"
    );


}




function openLightbox(index){


    currentIndex =
    index;


    showImage();


    lightbox.style.display =
    "flex";


}




function showImage(){


    const item =
    images[currentIndex];


    if(!item){

        return;

    }


    lightboxImage.src =
    "https://drive.google.com/thumbnail?id="
    +
    item.driveId
    +
    "&sz=w1600";



    lightboxUploader.textContent =
    "Hochgeladen von "
    +
    (item.uploader || "Gast");


}




function showNext(){


    currentIndex++;


    if(currentIndex >= images.length){

        currentIndex = 0;

    }


    showImage();

}




function showPrevious(){


    currentIndex--;


    if(currentIndex < 0){

        currentIndex =
        images.length - 1;

    }


    showImage();

}




close.onclick =
function(){

    lightbox.style.display =
    "none";

};




next.onclick =
function(event){

    event.stopPropagation();

    showNext();

};




prev.onclick =
function(event){

    event.stopPropagation();

    showPrevious();

};




lightbox.onclick =
function(event){

    if(event.target === lightbox){

        lightbox.style.display =
        "none";

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

    }


});





let touchStartX = 0;



lightbox.addEventListener(
"touchstart",
function(event){

    touchStartX =
    event.changedTouches[0].screenX;

});




lightbox.addEventListener(
"touchend",
function(event){


    let touchEndX =
    event.changedTouches[0].screenX;



    if(touchEndX < touchStartX - 50){

        showNext();

    }



    if(touchEndX > touchStartX + 50){

        showPrevious();

    }


});





loadGallery();





setInterval(
function(){

    loadGallery();

},
20000
);