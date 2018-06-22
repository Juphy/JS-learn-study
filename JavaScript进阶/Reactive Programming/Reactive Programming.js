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


const getAllBtn = $('#getAllBtn');
const searchInput = $('#search-input');
let keyword = '';

// 定义事件流
const clickEventStream = Rx.Observable.fromEvent(getAllBtn, 'click'); // 获取所有
const inputEventStream = Rx.Observable.fromEvent(searchInput, 'keyup').filter(event => event.keyCode !== 13); // 搜索过滤
const clickUserItemStream = Rx.Observable.fromEvent($('#user-lists'), 'click'); // 点击获取详细

clickEventStream.subscribe(v => {
    console.log('getAllUsers btn click!');
});
inputEventStream.subscribe(e => {
    console.log(e);
    console.log(searchInput.val());
    keyword = searchInput.val();
});
clickUserItemStream.subscribe(e => {
    console.log(e.target);
});


// 将用户触发的事件流转换成API请求流
const getUserListStream = clickEventStream.mergeMap(() => {
    return Rx.Observable.fromPromise($.getJSON('https://api.github.com/users'));
});

const filterUserStream = inputEventStream.mergeMap(event => {
    return Rx.Observable.fromPromise($.getJSON('https://api.github.com/users'));
});

const getUserInformation = clickUserItemStream.mergeMap(e => {
    console.log(e.target.innerText);
    return Rx.Observable.fromPromise($.getJSON('https://api.github.com/users/' + e.target.innerText));
});

let renderUserInfo = (user) => {
    $('#user-info').html('');
    for (var key in user) {
        $('#user-info').append(`<div>${key} ---> ${user[key]}</div>`);
    }
};
let renderUserLists = (users) => {
    console.log(users);
    $('#user-lists').html('');
    users.forEach(user => {
        $('#user-lists').append(`<li>${user.login}</li>`)
    })
};


getUserInformation.subscribe(users => {
    console.log(users);
    renderUserInfo(users);
});
filterUserStream.subscribe(users => {
    console.log(users);
    renderUserLists(users.filter(user => user.login.includes(keyword)));
});
getUserListStream.catch(err => {
    Rx.Observable.of(err);
}).subscribe(users => {
   renderUserLists(users);
});

