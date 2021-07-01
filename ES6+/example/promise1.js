const { response } = require("express");
const { createHarness } = require("tape");

// promise封装普通请求
function getJSON(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
      try {
        if (this.status === 200) {
          resolve(JSON.parse(this.response))
        } else {
          reject(this.status + ':' + this.statusText)
        }
      } catch (e) {
        reject(e.message);
      }
    }
    xhr.onerror = function () {
      reject(this.status + ':' + this.statusText);
    }
    xhr.send();
  })
}

// promise封装fetch
function postData(url, data) {
  let params = new FormData();
  for (let key in data) {
    params.append(key, data[key])
  }
  return new Promise(function (resolve, reject) {
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: params
    }).then(res => {
      if (response.ok) {
        return res.json();
      } else {
        return reject({ status: res.status })
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err);
    })
  })
}

// Promise
class Promise{
  constructor(fn){
    const _this = this;
    this._queue = [];
    this._
  }
}