# milkiees6bots

Статический сайт-портфолио для продажи и демонстрации Telegram-ботов.

## Локальный запуск с отправкой заявок в Telegram

```powershell
cd C:\Users\Artem\Documents\milkiees6bots1.1
node server.js
```

Открыть:

```text
http://127.0.0.1:5173/index.html
```

## Подключение Telegram-заявок

Не вставляйте токен Telegram-бота в `assets/js/main.js`, HTML или любой публичный файл. Токен должен храниться только на backend в переменных окружения.

Для локальной работы уже создан файл `.env`. Вставьте новый токен от BotFather:

```env
TELEGRAM_BOT_TOKEN=replace_with_new_bot_token
TELEGRAM_CHAT_ID=6657672762
```

После этого запустите `node server.js`. Форма отправляет данные на `/api/order`, а сервер пересылает заявку в Telegram.

`api/order.example.js` оставлен как пример для деплоя на serverless-хостинг.
