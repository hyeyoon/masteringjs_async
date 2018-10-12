function $(selector) {
  return document.querySelector(selector);
}

function addLoginEvent() {
  const loginButton = $('.login-btn');
  loginButton.addEventListener("click", () => {
    if (loginButton.innerText === 'LOGIN') {
      logIn();
    } else {
      logOut();
    }
  })
}

function logIn() {
  fetchManager({
    url: '/api/login',
    method: 'POST',
    body: JSON.stringify({user: 'crong'}),
    headers:{
      'Content-Type': 'application/json'
    },
    callback: renderButtonText
  })
}

function logOut() {
  fetchManager({
    url: '/api/session',
    method: 'DELETE',
    body: JSON.stringify({'command':'deletesession'}),
    headers:{
      'Content-Type': 'application/json'
    },
    callback: renderButtonText
  })
}

function renderButtonText() {
  const loginButton = $('.login-btn');
  if (loginButton.innerText === 'LOGIN') {
    loginButton.innerText = 'LOGOUT';
  } else {
    loginButton.innerText = 'LOGIN';
  }
}

function addAnswerEvent() {
  const answerForm = $('.answer-form');
  const answer = $('.form-control');
  answerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addAnswer(answer.value);
    answer.value = '';
  })
}

function addAnswer(content) {
  fetchManager({
    url: '/api/questions/1/answers',
    method: 'POST',
    body: JSON.stringify({content}),
    headers:{
      'Content-Type': 'application/json'
    },
    callback: appendAnswer
  })
  .then(renderAnswer)
  .catch(error => {
    console.error(error);
  })
}

function appendAnswer({
  content,
  writer,
  date,
  answerId
}) {
  const commentHTML = `
    <li class="answer" data-id=${answerId}>
      <div class="answer-content"> ${content} </div>
      <div class="answer-metainfo">
        <div class="answer-id">${writer.id}</div>
        <div class="answer-date">${date}</div>
        <div class="answer-util">
          <a class="answer-delete" href="/api/questions/2/answers/${answerId}">삭제</a>
        </div>
      </div>
    </li> `

  return commentHTML;
}

function renderAnswer(htmlEl) {
  const answers = $('.answers');
  answers.innerHTML = answers.innerHTML + htmlEl;
}

function fetchManager({url, method, headers, body, callback}) {
  return fetch(url, {
    method,
    headers,
    body
  })
  .then(response => response.json())
  .then(callback)
  .catch(error => {
    console.error(error);
  })
}

function initEvents() {
  //이벤트등록
  addLoginEvent();
  addAnswerEvent();
}

document.addEventListener("DOMContentLoaded", () => {
  initEvents();
})