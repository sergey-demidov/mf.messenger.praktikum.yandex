import Router from './lib/router';
import chat from './pages/chat/chat';
import login from './pages/login/login';
import register from './pages/register/register';
import profile from './pages/profile/profile';
import error404 from './pages/404/404';
import password from './pages/password/password';
import chatCreate from './pages/chat-create/chat-create';
import chatEdit from './pages/chat-edit/chat-edit';
import addUser from './pages/chat-add-user/chat-add-user';
import { createWindowListeners } from './lib/utils';
import './css/main.scss';

declare global {
  interface Window {
    router: Router;
    debug: boolean;
  }
}

if (process.env.NODE_ENV !== 'production') {
  window.debug = true;
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (!root) throw new Error('Root element does not exist');

  // window нужен для использования в шаблонах
  window.router = new Router(root);

  createWindowListeners();

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
