/**
 * Gets the users id
 */
function getUserId() {

    return Number.parseInt(new URLSearchParams(document.querySelector("iframe[src*=session-tracker]").src.split("?")[1]).get("id"));

}


window.addEventListener('load', function () {
    (async function(){
        let temp = await chrome.storage.sync.get("initilized").confirmed !== undefined;
        if(!temp && !window.location.href.includes("schoology.com/api")) {
            window.location.href = window.location.href.replace("home#", "api#");
        }
    })();
})
/**
 *
 * @returns {string[]}
 */
function getSchool(){
    console.log("grabbed school")
    return (window.location.href.replace("https://" , "")).split(".", 1)
}

async function fetchApiJson(path){
    var varPath =  await chrome.storage.sync.get("api-keys");
    var a = varPath[`api-keys`].public.toString();
    var b = varPath[`api-keys`].secret.toString();
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "fetch", url: `https://api.schoology.com/v1/${path}`, params: { headers:  {'Authorization': `OAuth realm="Schoology%20API",oauth_consumer_key="${a}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Math.floor(Date.now() / 1000)}",oauth_nonce="${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}",oauth_version="1.0",oauth_signature="${b}%26"`}, 'Accept': 'application/json'}, bodyReadType: "json" }, function (response) {
            console.log(response);
            if (response === undefined || response === null) {
                console.error("[backgroundPageFetch] Response is undefined or null", response, chrome.runtime.lastError);
                reject("Response is undefined or null. Last error: " + chrome.runtime.lastError);
            }
            response = JSON.parse(response);
            if (!response.success) {
                reject(response.error);
                return;
            }

            delete response.success;

            let bodyReadError = response.bodyReadError;
            delete response.bodyReadError;

            let bodyContent = response[bodyReadType];
            let readBodyTask = new Promise((readBodyResolve, readBodyReject) => {
                if (bodyReadError) {
                    if (bodyReadError === true) {
                        readBodyReject();
                    } else {
                        readBodyReject({ status: response.status, bodyReadError: bodyReadError });
                    }
                } else {
                    readBodyResolve(bodyContent);
                }
            });
            response[bodyReadType] = () => readBodyTask;

            resolve(response);
        });
    });

}