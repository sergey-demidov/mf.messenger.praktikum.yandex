import Router from './lib/router';
import chat from './pages/chat/index';
import login from './pages/login/login';
import register from './pages/register/index';
import profile from './pages/profile/index';
import error404 from './pages/404/index';
import password from './pages/password/index';
import chatCreate from './pages/chat-create/index';
import chatEdit from './pages/chat-edit/index';
import addUser from './pages/chat-add-user/index';

declare global {
  interface Window {
    router: Router;
  }
}

const root = document.getElementById('app');
if (!root) throw new Error('Root element does not exist');
// нужен для простоты использования
// в частности - в шаблонах
window.router = new Router(root);

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
