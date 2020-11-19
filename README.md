[![Netlify Status](https://api.netlify.com/api/v1/badges/5b95fe70-0d95-4e20-9500-8a2fb6d556c2/deploy-status)](https://messenger42-praktikum-yandex.netlify.app/)
[![Github Actions CI](https://github.com/sergey-demidov/mf.messenger.praktikum.yandex/workflows/ci/badge.svg)](https://github.com/sergey-demidov/mf.messenger.praktikum.yandex/actions?query=workflow%3Aci)

# Месенджер 
> этот репозиторий является заготовкой для учебного проекта по программе 
> "Мидл фронтенд-разработчик" от [Яндекс Практикум](https://praktikum.yandex.ru/).


### Проектная работа 1-й спринт
1. Настроен Express-сервер с раздачей статики.
1. Настоен деплой статики на [Netlify](https://messenger42-praktikum-yandex.netlify.app/)
1. [Нарисованы](https://www.figma.com/file/jCefXmc3zICQxhhZP2GLOA/Chat?node-id=0%3A1) и сверстаны прототипы экранов:
   - авторизация (с формой, имена полей: login, password),
   - регистрация (с формой, имена полей: first_name, second_name, login, email, password, phone),
   - список чатов, лента переписки (поле для ввода сообщения: message),
   - настройки пользователя:
     - имена полей для изменения информации о пользователе: 
       - first_name 
       - second_name 
       - display_name
       - login
       - email
       - phone
     - поле для изменения аватара с выбором файла и превью: avatar;
     - страница с формой для изменения пароля: (поля oldPassword, newPassword, newPasswordConfirm).
   - страница 404,
   - страница 500.
1. Сделан сбор данных из форм. В console.log выводится объект со всеми заполненными полями формы.
1. Корневой `index.html` содержит переадресацию на `chat.html`
1. Подключены шрифты Material Icons

---
## Инсталляция
Клонируйте репозиторий
```shell script
git clone https://github.com/sergey-demidov/mf.messenger.praktikum.yandex.git
```
Установите пакеты
```shell script
npm install # или yarn
```
---
## Использование
Для запуска локального express сервера
```shell script
node server.js
```
Для синхронизации с браузером
```shell script
npm run dev # или yarn dev
```
Для проверки синтаксиса
```shell script
npm run lint # или yarn lint
```


