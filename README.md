[![Github Actions CI](https://github.com/sergey-demidov/mf.messenger.praktikum.yandex/workflows/ci/badge.svg)](https://github.com/sergey-demidov/mf.messenger.praktikum.yandex/actions?query=workflow%3Aci)
[![Heroku](https://img.shields.io/badge/website-mfmessenger.herokuapp.com-brightgreen)](https://mfmessenger.herokuapp.com/)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/292312ce77de4ff9aa76a66458fa8f5a)](https://app.codacy.com/gh/sergey-demidov/mf.messenger.praktikum.yandex?utm_source=github.com&utm_medium=referral&utm_content=sergey-demidov/mf.messenger.praktikum.yandex&utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/1c725db8ddea43a59afdbc3dacf89dc8)](https://www.codacy.com/gh/sergey-demidov/mf.messenger.praktikum.yandex/dashboard?utm_source=github.com&utm_medium=referral&utm_content=sergey-demidov/mf.messenger.praktikum.yandex&utm_campaign=Badge_Coverage)
[![David](https://img.shields.io/david/sergey-demidov/mf.messenger.praktikum.yandex)](https://github.com/sergey-demidov/mf.messenger.praktikum.yandex)

## Месенджер 

> учебный проект по программе "Мидл фронтенд-разработчик" от Яндекс Практикум

<details><summary>Проектная работа 1-й спринт</summary>

1. Настроен Express-сервер с раздачей статики.
1. Настоен деплой статики на [Netlify](https://messenger42-praktikum-yandex.netlify.app/)
1. [Нарисованы](https://www.figma.com/file/jCefXmc3zICQxhhZP2GLOA/Chat?node-id=0%3A1) и сверстаны прототипы экранов:
   - авторизация (с формой, имена полей: login, password),
   - регистрация (с формой, имена полей: first_name, second_name, login, email, password, phone),
   - список чатов, лента переписки (поле для ввода сообщения: message),
   - настройки пользователя:
     1. имена полей для изменения информации о пользователе: 
        - first_name 
        - second_name 
        - display_name
        - login
        - email
        - phone
     1. поле для изменения аватара с выбором файла и превью: avatar;
     1. страница с формой для изменения пароля: (поля oldPassword, newPassword, newPasswordConfirm).
   - страница 404,
   - страница 500.
1. Сделан сбор данных из форм. В console.log выводится объект со всеми заполненными полями формы.
1. Корневой `index.html` содержит переадресацию на `chat.html`
1. Подключены шрифты Material Icons

</details>

<details><summary>Проектная работа 2-й спринт</summary>

1. Частично реализован шаблонизатор на основе [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
1. Проект переведен на TypeScript
1. В `tsconfig` включен режим `strict`
1. Проект разбит на модули, настроены `import`/`export`
1. На все формы добавлена валидация по `focus`/`blur` плюс `keyup`
1. Страницы генерируются на основании шаблонов
1. Сделаны переиспользуемые модули для кнопок и текстовых полей
1. Свойство `disabled` кнопки отправки связано с валидацией форм
1. TypeScript компилятор внедрен в скрипт запуска сервера разработки

</details>

<details><summary>Проектная работа 3-й спринт</summary>

1. Добавен класс `HttpTransport` для работы с запросами
1. В проект добавлен роутинг с проверкой авторизации
1. Библиотеки частично покрыты тестами
1. Внедрены HTTP API чатов, авторизации и пользователей
   - настройка/удаление чата по клику на аватарке чата
   - добавление участника выбором из выпадающего списка
   - удаление участника перетаскиванием в корзину
1. Стили перенесены на SCSS
1. Компилятор `node-sass` внедрен в скрипт запуска сервера разработки
1. Для транспиляции TS используется обертка [TTypeScript](https://github.com/cevek/ttypescript)
1. Реализована система оповещения пользователя `toaster`
1. Настроены CSP в виде `http-equiv` тэга в заголовке `index.html`

</details>

#### Проектная работа 4-й спринт

1. Внедрен `webpack` с двумя различными конфигурациями:
   - для разработки 
   - для разворачивания в продакшн
1. Прект размещен на `Heroku` 
   - автодеплой через вебхук `github`
   - разворачиватеся в контейнере `docker`
   - статика раздается `express`
   - добавлены CSP заголовки и компрессия
1. Используется `StyleLint` и `ESLint` с наследованием от `airbnb` 
1. Добавлены `pre-commit` и `pre-push` с помощью `husky`
1. Обновлены npm-пакеты. Версии зафиксированы.
1. Подключен WebSocket, добавлена работа с real-time сообщениями.
1. Интегрирован внешний анализатор кода `codacy`

---
#### Инсталляция
Клонируйте репозиторий
```shell script
git clone https://github.com/sergey-demidov/mf.messenger.praktikum.yandex.git
```
Установите пакеты
```shell script
npm install # или yarn
```
---
#### Использование
Для запуска локального сервера express
```shell script
node server.js
```
Для компиляции TS, SCSS и синхронизации с браузером
```shell script
npm run dev # или yarn dev
```
Для проверки синтаксиса
```shell script
npm run lint # или yarn lint
```

Для запуска тестов
```shell script
npm run test # или yarn test
```
