const footer = document.querySelector("#footer");
fetch("./footer.html")
    .then(response => response.text())
    .then(data => {
        footer.innerHTML = data;
    });
