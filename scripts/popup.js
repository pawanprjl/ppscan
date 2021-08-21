var port = browser.runtime.connect(
    {
        name: "logger"
    }
);


function logger() {
    browser.storage.sync.get("toggle", function (data) {
        document.getElementById("toggle").value = data.toggle ? "Disable Active Mode" : "Enable Active Mode";
    });

    browser.storage.sync.get("buster", function (data) {
        document.getElementById("buster").value = data.buster ? "Disable Window Mode" : "Enable Window Mode";
    });

    browser.storage.sync.get("passive", function (data) {
        document.getElementById("passive").value = data.passive ? "Disable Passive Mode" : "Enable Passive Mode";
    });

    document.getElementById("toggle").onclick = function () {
        browser.storage.sync.get("toggle", function (data) {
            if (data.toggle) {
                browser.storage.sync.set({ "toggle": false });
                browser.storage.sync.set({ "buster": false });
                document.getElementById("toggle").value = "Enable Active Mode";
                document.getElementById("buster").style.display = "none";
            } else {
                browser.storage.sync.set({ "toggle": true });
                document.getElementById("buster").style.display = "block";
                document.getElementById("toggle").value = "Disable Active Mode";
            }
        });
    }

    document.getElementById("buster").onclick = function () {
        browser.storage.sync.get("buster", function (data) {
            if (data.buster) {
                browser.storage.sync.set({ "buster": false });
                document.getElementById("buster").value = "Enable Window Mode";
            } else {
                browser.storage.sync.set({ "buster": true });
                document.getElementById("buster").value = "Disable Window Mode";
            }
        });
    }

    document.getElementById("passive").onclick = function () {
        browser.storage.sync.get("passive", function (data) {
            if (data.passive) {
                browser.storage.sync.set({ "passive": false });
                document.getElementById("passive").value = "Enable Passive Mode";
            } else {
                browser.storage.sync.set({ "passive": true });
                document.getElementById("passive").value = "Disable Passive Mode";
            }
        });
    }
}

document.getElementById("brute").onclick = function () {
    browser.tabs.executeScript(null, {
        code: `document.dispatchEvent(new CustomEvent('TriggerBrute'));`
    });
}

document.getElementById("brutehash").onclick = function () {
    browser.tabs.executeScript(null, {
        code: `document.dispatchEvent(new CustomEvent('TriggerBruteHash'))`
    });
}

document.getElementById("clear").onclick = function () {
    port.postMessage('clearLog');
}

port.postMessage('send found urls');

port.onMessage.addListener(function (found) {
    listFound(found.found);
});

window.onload = logger

const foundLabel = document.getElementById('found-label');
const foundList = document.getElementById('found-list');

function listFound(found) {
    foundLabel.style.display = foundList.style.display = found.length > 0 ? 'block' : 'none';

    found.forEach((str) => {
        const line = JSON.parse(str)
        console.log(line)
        const tr = document.createElement("tr");
        tr.innerHTML = `<td><a target="_blank" href="${line['domain']}">${new URL(line['domain']).hostname}</a></td><td>${line['type']}</td><td><a target="_blank" href="${line['file']}">${line['file']}:${line['lineCol']}</a></td>`;
        foundList.appendChild(tr);
    });
}


