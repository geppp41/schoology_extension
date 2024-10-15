if(window.location.href.includes("schoology.com/api")) {
    let api_data = {
        "public": "",
        "secret": ""
    }
    let publicContainer = document.getElementById("edit-current-key-wrapper");
    let privateContainer = document.getElementById("edit-current-secret-wrapper");
    let publicKey = document.getElementById("edit-current-key");
    let privateKey = document.getElementById("edit-current-secret");
    let e = document.getElementsByClassName("form-submit");
    let container = document.getElementById("center-wrapper");
    document.getElementsByClassName("description warning")[0].textContent = "By Clicking allow access you are allowing the extension Ravens plus to have access to your student api and understand this gives it access to your grades, assignments, and any other information stored in the schoology api."
    document.getElementById("content-wrapper").style.textAlign = "center";
    publicContainer.style.display = "none"
    privateContainer.style.display = "none"
    for(i = 0; i < e.length; i++) {
        if(e[i].value === "Reveal Existing Secret"){
            e[i].value = "Allow Access"

        }  else {
            e[i].parentElement.style.display = "none"
        }
    }
    if (privateKey.value !== "********************") {
        api_data.secret = privateKey.value
        api_data.public = publicKey.value
        chrome.storage.sync.set({"api-keys": api_data})
        chrome.storage.sync.set({"initilized": {confirmed: true}})
        window.location.href = `https://${getSchool()}.schoology.com`;
    }
}