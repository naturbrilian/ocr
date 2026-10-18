const inputGambar = document.getElementById('pilih-gambar');
const elemenStatus = document.getElementById('status');
const hasilTeks = document.getElementById('hasil-teks');

inputGambar.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    elemenStatus.innerText = "Processing image...";
    hasilTeks.value = "";
    inputGambar.disabled = true;

    Tesseract.recognize(file, 'eng', {
        logger: info => {
            if (info.status === 'recognizing text') {
                elemenStatus.innerText = `Reading text: ${Math.round(info.progress * 100)}%`;
            } else {
                elemenStatus.innerText = "Loading engine...";
            }
        }
    }).then(result => {
        const teksTerdeteksi = result.data.text;

        if (teksTerdeteksi.trim() === "") {
            elemenStatus.innerText = "Done, but no text was found.";
            hasilTeks.value = "[The image was read successfully, but no text was detected]";
        } else {
            elemenStatus.innerText = "Done!";
            hasilTeks.value = teksTerdeteksi;
        }
    }).catch(error => {
        console.error("Detail Error:", error);
        elemenStatus.innerText = "Error: " + error.message;
    }).finally(() => {
        inputGambar.disabled = false;
        inputGambar.value = ""; // supaya file yang sama bisa dipilih ulang
    });
});