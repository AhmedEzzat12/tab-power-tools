browser.commands.onCommand.addListener((command) => {
    if (command === "open-popup") {
        browser.browserAction.openPopup();
    }
});