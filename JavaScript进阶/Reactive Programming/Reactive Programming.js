// let refreshButton = document.querySelector('.refresh');
// let closeButton1 = document.querySelector('.close1');
// let closeButton2 = document.querySelector('.close2');
// let closeButton3 = document.querySelector('.close3');
//
// let refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
// let close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
// let close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
// let close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');
//
// // 刷新的请求流
// let requestStream = refreshClickStream
//     .startWith('startup click')
//     .map(() => {
//         let randomOffset = Math.floor(Math.random() * 500);
//         return 'https://api.github.com/users?since=' + randomOffset;
//     });
// // 刷新的响应流
// let responseStream = requestStream
//     .flatMap(requestUrl => {
//         return Rx.Observable.fromPromise($.getJSON(requestUrl))
//     });
//
// let createSuggestionStream = (closeClickStream) => {
//     return closeClickStream.startWith('startup click')
//         .combineLatest(
//             responseStream,
//             (click, listUsers) => {
//                 return listUsers[Math.floor(Math.random() * listUsers.length)];
//             }
//         )
//         .merge(
//             refreshClickStream.map(() => {
//                 return null;
//             })
//         )
//         .startWith(null);
// };
// let suggestion1Stream = createSuggestionStream(close1ClickStream);
// let suggestion2Stream = createSuggestionStream(close2ClickStream);
// let suggestion3Stream = createSuggestionStream(close3ClickStream);
//
// // rendering
// let renderSuggestion = (suggestedUser, selector) => {
//     let suggestionEl = document.querySelector(selector);
//     if (suggestedUser === null) {
//         suggestionEl.style.visibility = 'hidden';
//     } else {
//         suggestionEl.style.visibility = 'visible';
//         let usernameEl = suggestionEl.querySelector('.username');
//         usernameEl.href = suggestedUser.html_url;
//         usernameEl.textContent = suggestedUser.login;
//         let imgEl = suggestionEl.querySelector('img');
//         imgEl.src = '';
//         imgEl.src = suggestedUser.avatar_url;
//     }
// };
// suggestion1Stream.subscribe(suggestedUser => {
//    renderSuggestion(suggestedUser, '.suggestion1');
// });
// suggestion2Stream.subscribe(suggestedUser => {
//     renderSuggestion(suggestedUser, '.suggestion2');
// });
// suggestion3Stream.subscribe(suggestedUser => {
//     renderSuggestion(suggestedUser, '.suggestion3');
// });

// const getAllBtn = $('#getAllBtn');
// const searchInput = $('#search-input');
// const userLists = $('#user-lists');
// let keyword = '';
//
// // 定义事件流
//
// let clickEventStream = Rx.Observable.fromEvent(getAllBtn, 'click');
// let inputEventStream = Rx.Observable.fromEvent(searchInput, 'keyup').filter(event => event.keyCode !== 13);
// let userEventStream = Rx.Observable.fromEvent(userLists, 'click');
//
// clickEventStream.subscribe(e => {
//     console.log(e);
// });
//
// inputEventStream.subscribe(e => {
//     console.log(e);
//     keyword = searchInput.val();
// });
//
// userEventStream.subscribe(e => {
//     console.log(e);
// });
//
// // 将事件流转换成api请求流
//
// let getUsersStream = clickEventStream.mergeMap(e => {
//     return Rx.Observable.fromPromise($.getJSON('https://api.github.com/users'))
// });
//
// let filterUsersStream = inputEventStream.mergeMap(event => {
//     return Rx.Observable.fromPromise($.getJSON('https://api.github.com/users'))
// });
//
// let userInfoStream = userEventStream.mergeMap(e => {
//     return Rx.Observable.fromPromise($.getJSON('https://api.github.com/users/' + e.target.innerText))
// });
//
// const renderUsersList = (users) => {
//     $('#user-lists').html('');
//     users.forEach(user => {
//         $('#user-lists').append(`<li>${user.login}</li>`)
//     })
// };
//
// const renderUserInfo = (user) => {
//     $('#user-info').html('');
//     for (const key in user) {
//         $('#user-info').append(`<div>${key}---->${user[key]}</div>`)
//     }
// };
//
// getUsersStream.catch(err => {
//     Rx.Observable.of(err);
// }).subscribe(users => {
//     renderUsersList(users);
// });
//
// filterUsersStream.filter(err => {
//     Rx.Observable.of(err);
// }).subscribe(users => {
//     renderUsersList(users.filter(user => user.includes(keyword)));
// });
//
// userInfoStream.subscribe(user => {
//     renderUserInfo(user);
// });

const refreshBtn = document.querySelector('.refresh');
const clickClose1 = document.querySelector('.close1');
const clickClose2 = document.querySelector('.close2');
const clickClose3 = document.querySelector('.close3');
// 定义事件流
const refreshStream = Rx.Observable.fromEvent(refreshBtn, 'click');
const close1Stream = Rx.Observable.fromEvent(clickClose1, 'click');
const close2Stream = Rx.Observable.fromEvent(clickClose2, 'click');
const close3Stream = Rx.Observable.fromEvent(clickClose3, 'click');
// 刷新的请求流
const requestStream = refreshStream
    .startWith('startup click')
    .map(() => {
        const randomOffset = Math.floor(Math.random() * 500);
        return 'https://api.github.com/users?since=' + randomOffset;
    });
// 刷新的响应流，这是一个流的流，即发送出的值还是流，需要发送出一个JSON对象的流，因此可以用flatMap将流的流扁平化成流。
const responseStream = requestStream
    .flatMap(url => {
        return Rx.Observable.fromPromise($.getJSON(url));
    });

const createSuggestionStream = (closeStream) => {
    return closeStream.startWith('startup click')
        .combineLatest(responseStream,
            (click, listUsers) => {
                return listUsers[Math.floor(Math.random() * listUsers.length)]
            })
        .merge(refreshStream.map(() => null))
        .startWith(null);
};

const suggestion1Stream = createSuggestionStream(close1Stream);
const suggestion2Stream = createSuggestionStream(close2Stream);
const suggestion3Stream = createSuggestionStream(close3Stream);

const renderUser = (user, selector) => {
    const el = document.querySelector(selector);
    if (user === null) {
        el.style.visibility = 'hidden';
    } else {
        el.style.visibility = 'visible';
        const usernameEl = el.querySelector('.username');
        const imgEl = el.querySelector('img');
        usernameEl.href = user.html_url;
        usernameEl.textContent = user.login;
        imgEl.src = '';
    }
};

suggestion1Stream.subscribe(user => {
    renderUser(user, '.suggestion1')
});
suggestion2Stream.subscribe(user => {
    renderUser(user, '.suggestion2')
});
suggestion3Stream.subscribe(user => {
    renderUser(user, '.suggestion3')
});