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

filesInput.addEventListener("change", function () {

    selectedFiles = [...filesInput.files];

    fileList.textContent =
        selectedFiles.length + " Datei(en) ausgewählt";

    progress.style.width = "0%";
    status.textContent = "";

});

uploadButton.addEventListener("click", async function () {

    if (selectedFiles.length === 0) {

        alert("Bitte zuerst Dateien auswählen.");
        return;

    }

    uploadButton.disabled = true;

    const filesToUpload = [...selectedFiles];

    let finished = 0;

    for (const file of filesToUpload) {

        await uploadFile(file);

        finished++;

        progress.style.width =
            (finished / filesToUpload.length) * 100 + "%";

    }

    status.textContent = "✓ Upload erfolgreich";

    uploadButton.disabled = false;

    selectedFiles = [];
    filesInput.value = "";
    fileList.textContent = "Keine Dateien ausgewählt";

});

function uploadFile(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = async function () {

            const payload = {

                file: reader.result,
                filename: file.name,
                mime: file.type,
                uploader:
                    document.getElementById("name").value.trim() || "Gast"

            };

            try {

                const response = await fetch(API_URL, {

                    method: "POST",
                    body: JSON.stringify(payload)

                });

                const result = await response.json();

                console.log(result);

                resolve();

            } catch (error) {

                console.error(error);

                reject(error);

            }

        };

        reader.readAsDataURL(file);

    });

}