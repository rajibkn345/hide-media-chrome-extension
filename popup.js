document.addEventListener('DOMContentLoaded', function () {
    let toggleButton = document.getElementById('toggleButton');

    chrome.storage.sync.get('hideMedia', function (data) {
        let isActive = data.hideMedia ?? true;
        updateButton(isActive);
    });

    toggleButton.addEventListener('click', function () {
        chrome.storage.sync.get('hideMedia', function (data) {
            let newState = !data.hideMedia;
            chrome.storage.sync.set({ hideMedia: newState });
            updateButton(newState);
            sendMessageToAllTabs(newState);
        });
    });

    function updateButton(isActive) {
        toggleButton.textContent = isActive ? 'Disable' : 'Enable';
        toggleButton.classList.toggle('off', !isActive);
    }

    function sendMessageToAllTabs(state) {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                if (!tab.url.startsWith('chrome://')) {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: toggleMedia,
                        args: [state],
                    }, () => {
                        chrome.tabs.reload(tab.id);
                    });
                }
            });
        });
    }
});

function toggleMedia(state) {
    let styleTag = document.getElementById('hideMediaStyle');
    if (state) {
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'hideMediaStyle';
            styleTag.textContent =
                'img, video, image, [role="img"] { display: none !important; }';
            document.head.appendChild(styleTag);
        }
    } else {
        if (styleTag) {
            styleTag.remove();
        }
    }
}