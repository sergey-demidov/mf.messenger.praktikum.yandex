import Router from "./lib/router.js";
import chat from "./pages/chat/index.js";
import login from "./pages/login/login.js";
import register from "./pages/register/index.js";
import profile from "./pages/profile/index.js";
import error404 from "./pages/404/index.js";
import password from "./pages/password/index.js";
import chatCreate from "./pages/chat-create/index.js";
import chatEdit from "./pages/chat-edit/index.js";
import addUser from "./pages/chat-add-user/index.js";
const root = document.getElementById('app');
if (!root)
    throw new Error('Root element does not exist');
// нужен для простоты использования
// в частности - в шаблонах
window.router = new Router(root);
document.ondragstart = () => {
    const trash = document.getElementsByClassName('s-trash')[0];
    setTimeout(() => { trash.innerText = 'delete'; }, 250);
    trash.parentElement.classList.add('mpy_red');
};
document.ondragend = () => {
    const trash = document.getElementsByClassName('s-trash')[0];
    setTimeout(() => { trash.innerText = 'group_add'; }, 250);
    trash.parentElement.classList.remove('mpy_red');
};
document.addEventListener('DOMContentLoaded', () => {
    window.router
        .use('/#/chat', chat)
        .use('/#/login', login)
        .use('/#/profile', profile)
        .use('/#/register', register)
        .use('/#/password', password)
        .use('/#/chat/create', chatCreate)
        .use('/#/chat/edit', chatEdit)
        .use('/#/chat/adduser', addUser)
        .use('/#/404', error404)
        .start();
});
//# sourceMappingURL=index.js.map