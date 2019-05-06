function setupApp() {
...

    // Reaction for badge text change
    reaction(
        () => app.store.newMessages.length > 0 ? app.store.newMessages.length.toString() : '',
        text => extensionApi.browserAction.setBadgeText({text}),
        {fireImmediately: true}
    );

...
}