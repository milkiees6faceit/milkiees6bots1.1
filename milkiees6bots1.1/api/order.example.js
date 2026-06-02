export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return response.status(500).json({ ok: false, error: "Telegram environment variables are missing" });
  }

  const { telegram, name, description, budget, contacts } = request.body || {};

  if (!telegram || !name || !description || !budget || !contacts) {
    return response.status(400).json({ ok: false, error: "Required fields are missing" });
  }

  const text = [
    "Новая заявка с сайта milkiees6bots",
    "",
    `Telegram: ${telegram}`,
    `Имя: ${name}`,
    `Бюджет: ${budget}`,
    `Контакты: ${contacts}`,
    "",
    "Описание:",
    description
  ].join("\n");

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true
    })
  });

  if (!telegramResponse.ok) {
    return response.status(502).json({ ok: false, error: "Telegram request failed" });
  }

  return response.status(200).json({ ok: true });
}
