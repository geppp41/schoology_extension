chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.type === "fetch" && request.url !== undefined) {
        console.debug("fetching information from " + request.url);
        (async function() {
            let finalResponse;
            let responseObj;
            try {
                responseObj = await fetch(request.url, request.params).then(response => response.json());
            } catch (e) {
                finalResponse.success = false;
                finalResponse.error = e;
                return finalResponse
            }

            console.debug("returning final response");
            await (async function () {
                console.debug(responseObj);
            })();
            return responseObj;
        })().then(x => sendResponse(JSON.stringify(x))).catch(err => sendResponse(JSON.stringify({ success: false, error: err })));
    } else {
        if(request.type !== "fetch") {
            console.error("request type is not fet request type is :", request.type);
        } else if(request.url !== undefined) {
            console.error("request url is undefined");
        }
    }
});


chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.local.set({"initilized": false});
});