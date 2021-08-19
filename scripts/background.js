const databaseUrl = browser.runtime.getURL('/database.csv');

/* initialize */
const found = new Set();

setBadgeCount(0);

/* setup listeners */
browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    found.add(msg);
    setBadgeCount(found.size);
});

browser.runtime.onConnect.addListener((port) => {
    console.log('[>] New Session ', port);
    if (port.name == "logger") {
        port.onMessage.addListener((msg) => {
            if (msg == 'clearLog') {
                found.clear();
                setBadgeCount(0);
            }
            port.postMessage({ found: [...found] });
        });
    }
});

browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync.set({ toggle: false }, () => {
        console.log('[*] Toggle: disabled');
    });

    browser.storage.sync.set({ buster: false }, () => {
        console.log('[*] Buster: disabled');
    });

    browser.storage.sync.set({ passive: true }, () => {
        console.log('[*] Passive: enabled');
    });
});


browser.storage.sync.get("toggle", ({ toggle }) => {
    if (toggle) {
        browser.webRequest.onHeadersReceived.addListener((response) => {
            response.forEach(header => {
                if (isCSPHeader(header)) {
                    header.value = `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; `;
                };

                if (isXFrameEnabled(header)) {
                    header.name = 'foo';
                }

                if (isCached(header)) {
                    header.name = 'foo';
                }
            });
            return {
                responseHeaders: header.responseHeaders,
            };
        }, {
            urls: ['<all_urls>']
        }, ['blocking', 'responseHeaders', 'extraHeaders']);
    }
});

browser.storage.sync.get("passive", ({ passive }) => {
    if (passive) { updateDB(); }
});