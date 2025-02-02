chrome.storage.sync.get('hideMedia', function (data) {
    if (data.hideMedia) {
        let styleTag = document.createElement('style');
        styleTag.id = 'hideMediaStyle';
        styleTag.textContent = 'img, video,image { display: none !important; }';
        document.head.appendChild(styleTag);
    }
});

chrome.runtime.onMessage.addListener(function (message) {
    if (message.toggleMedia !== undefined) {
        let styleTag = document.getElementById('hideMediaStyle');
        if (message.toggleMedia) {
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'hideMediaStyle';
                styleTag.textContent =
                    'img, video,image { display: none !important; }';
                document.head.appendChild(styleTag);
            }
        } else {
            if (styleTag) {
                styleTag.remove();
            }
        }
    }
});
