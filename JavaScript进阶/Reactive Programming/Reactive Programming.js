let refreshButton = document.querySelector('.refresh');
let closeButton1 = document.querySelector('.close1');
let closeButton2 = document.querySelector('.close2');
let closeButton3 = document.querySelector('.close3');

let refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
let close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
let close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
let close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');

// 刷新的请求流
let requestStream = refreshClickStream
    .startWith('startup click')
    .map(() => {
        let randomOffset = Math.floor(Math.random() * 500);
        return 'https://api.github.com/users?since=' + randomOffset;
    });
// 刷新的响应流
let responseStream = requestStream
    .flatMap(requestUrl => {
        return Rx.Observable.fromPromise($.getJSON(requestUrl))
    });

let createSuggestionStream = (closeClickStream) => {
    return closeClickStream.startWith('startup click')
        .combineLatest(
            responseStream,
            (click, listUsers) => {
                return listUsers[Math.floor(Math.random() * listUsers.length)];
            }
        )
        .merge(
            refreshClickStream.map(() => {
                return null;
            })
        )
        .startWith(null);
};
let suggestion1Stream = createSuggestionStream(close1ClickStream);
let suggestion2Stream = createSuggestionStream(close2ClickStream);
let suggestion3Stream = createSuggestionStream(close3ClickStream);

// rendering
let renderSuggestion = (suggestedUser, selector) => {
    let suggestionEl = document.querySelector(selector);
    if (suggestedUser === null) {
        suggestionEl.style.visibility = 'hidden';
    } else {
        suggestionEl.style.visibility = 'visible';
        let usernameEl = suggestionEl.querySelector('.username');
        usernameEl.href = suggestedUser.html_url;
        usernameEl.textContent = suggestedUser.login;
        let imgEl = suggestionEl.querySelector('img');
        imgEl.src = '';
        imgEl.src = suggestedUser.avatar_url;
    }
};
suggestion1Stream.subscribe(suggestedUser => {
   renderSuggestion(suggestedUser, '.suggestion1');
});
suggestion2Stream.subscribe(suggestedUser => {
    renderSuggestion(suggestedUser, '.suggestion2');
});
suggestion3Stream.subscribe(suggestedUser => {
    renderSuggestion(suggestedUser, '.suggestion3');
});
