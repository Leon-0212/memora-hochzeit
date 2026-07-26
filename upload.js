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





/*******************************************************
 * USER ID
 *******************************************************/


function getUserId(){


    let userId =
    localStorage.getItem(
        "memora_user_id"
    );


    if(!userId){


        userId =
        crypto.randomUUID();


        localStorage.setItem(
            "memora_user_id",
            userId
        );


    }


    return userId;


}





/*******************************************************
 * FILE SELECTION
 *******************************************************/


filesInput.addEventListener(
"change",
function(){


    selectedFiles =
    Array.from(
        filesInput.files
    );


    fileList.innerHTML =
    selectedFiles.length +
    " Datei(en) ausgewählt";


});







/*******************************************************
 * UPLOAD BUTTON
 *******************************************************/


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
    `
    <span class="button-spinner"></span>
    Upload läuft...
    `;



    status.innerHTML =
    "";



    progress.style.width =
    "0%";



    let finished = 0;



    try {



        for(const file of selectedFiles){



            await uploadFile(
                file
            );



            finished++;



            progress.style.width =
            (
                finished /
                selectedFiles.length *
                100
            )
            +
            "%";


        }




        status.innerHTML =
        "✓ Upload erfolgreich";



        filesInput.value =
        "";



        fileList.innerHTML =
        "";



        selectedFiles = [];



    }



    catch(error){



        console.error(
            error
        );



        status.innerHTML =
        "✕ Upload fehlgeschlagen";


    }





    setTimeout(
        function(){

            uploadButton.disabled =
            false;


            uploadButton.classList.remove(
                "upload-active"
            );


            uploadButton.innerHTML =
            "Hochladen";


        },
        1500
    );



});








/*******************************************************
 * UPLOAD FILE
 *******************************************************/


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
            "Gast",



            userId:

            getUserId()



        };







        fetch(
            API_URL,
            {

                method:
                "POST",


                body:
                JSON.stringify(payload)


            }

        )



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



                if(!result.success){

                    reject(
                        result.message
                    );

                    return;

                }



                resolve();



            }

        )



        .catch(
            error => {


                reject(
                    error
                );


            }

        );



    };







    reader.onerror =
    function(error){


        reject(
            error
        );


    };





    reader.readAsDataURL(file);



});


}