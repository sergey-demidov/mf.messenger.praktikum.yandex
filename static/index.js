import Router from "./lib/router.js";
import chat from "./pages/chat/index.js";
import login from "./pages/login/index.js";
import register from "./pages/register/index.js";
import profile from "./pages/profile/index.js";
import error404 from "./pages/404/index.js";
import password from "./pages/password/index.js";
const root = document.getElementById('app');
if (!root)
    throw new Error('Root element does not exist');
// нужен для простоты использования
// в частности - в шаблонах
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
        .start();
});
//# sourceMappingURL=index.js.map