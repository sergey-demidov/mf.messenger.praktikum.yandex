import Router from './lib/router';
import chat from './pages/chat/index';
import login from './pages/login/index';
import register from './pages/register/index';
import profile from './pages/profile/index';
import error404 from './pages/404/index';
import password from './pages/password/index';

declare global {
  interface Window {
    router: Router;
  }
}

const root = document.getElementById('app');
if (!root) throw new Error('Root element does not exist');
window.router = new Router(root);

document.addEventListener('DOMContentLoaded', () => {
  window.router
    .use('/', chat)
    .use('/#', chat)
    .use('/#/', chat)
    .use('/#/login', login)
    .use('/#/profile', profile)
    .use('/#/register', register)
    .use('/#/password', password)
    .use('/#/404', error404)
  // .use('/#500', ErrorPage500)
    .start();
});
