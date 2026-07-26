const API_URL =
"https://script.google.com/macros/s/AKfycbxmKTqHSCzpHdvvtZF8vQPwZWNesUVblQLI38bEehXUEwSNTo8jQwwdC2YJd-wLZYhLbQ/exec";



const filesInput =
document.getElementById("files");


const fileList =
document.getElementById("file-list");


const uploadButton =
document.getElementById("upload-button");


const progress =
document.getElementById("progress");


const status =
document.getElementById("status");



let selectedFiles = [];





filesInput.addEventListener(
"change",
function(){


    selectedFiles =
    Array.from(filesInput.files);



    fileList.innerHTML =
    selectedFiles.length +
    " Datei(en) ausgewählt";


});







uploadButton.addEventListener(
"click",
async function(){



    if(selectedFiles.length === 0){


        alert(
        "Bitte zuerst Dateien auswählen."
        );


        return;


    }




    uploadButton.disabled = true;



    uploadButton.classList.add(
        "upload-active"
    );



    uploadButton.innerHTML =
    "Upload läuft...";



    status.innerHTML =
    "";



    let finished = 0;



    try {



        for(const file of selectedFiles){



            await uploadFile(file);



            finished++;



            progress.style.width =
            (
                (finished / selectedFiles.length)
                * 100
            )
            + "%";



        }



        status.innerHTML =
        "✓ Upload erfolgreich";



    }


    catch(error){



        console.error(error);



        status.innerHTML =
        "✕ Upload fehlgeschlagen";



    }





    uploadButton.disabled = false;



    uploadButton.classList.remove(
        "upload-active"
    );



    uploadButton.innerHTML =
    "Hochladen";



});









function uploadFile(file){



return new Promise(
(resolve,reject)=>{



    const reader =
    new FileReader();





    reader.onload =
    function(){



        const payload = {


            file:
            reader.result,


            filename:
            file.name,


            mime:
            file.type,


            uploader:

            document.getElementById("name").value
            ||
            "Gast"



        };





        fetch(
        API_URL,
        {

            method:"POST",

            body:
            JSON.stringify(payload)

        })



        .then(
        response =>
        response.json()
        )



        .then(
        result => {


            console.log(
                "Upload Antwort:",
                result
            );



            /*
            Google Apps Script hat geantwortet,
            Upload gilt als erfolgreich
            */


            resolve();



        })



        .catch(
        error => {


            console.error(
                "Upload Fehler:",
                error
            );


            reject(error);


        });



    };






    reader.onerror =
    function(error){


        reject(error);


    };





    reader.readAsDataURL(file);



});


}