const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 5173);

loadEnv(path.join(root, ".env"));

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === "/api/order") {
      return handleOrder(request, response);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return sendJson(response, 405, { ok: false, error: "Method not allowed" });
    }

    return serveStatic(url.pathname, request, response);
  } catch (error) {
    return sendJson(response, 500, { ok: false, error: "Server error" });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`milkiees6bots is running: http://127.0.0.1:${port}/index.html`);
});

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && !process.env[key]) process.env[key] = value;
  }
}

function serveStatic(urlPath, request, response) {
  const cleanPath = decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath);
  const resolvedPath = path.resolve(root, `.${cleanPath}`);

  if (!resolvedPath.startsWith(root)) {
    return sendText(response, 403, "Forbidden");
  }

  fs.stat(resolvedPath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      return sendText(response, 404, "Not found");
    }

    const extension = path.extname(resolvedPath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    fs.createReadStream(resolvedPath).pipe(response);
  });
}

async function handleOrder(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || token === "PASTE_NEW_BOT_TOKEN_HERE" || !chatId) {
    return sendJson(response, 500, {
      ok: false,
      error: "Telegram token is not configured"
    });
  }

  const body = await readJsonBody(request);
  const { telegram, name, description, budget, contacts } = body;

  if (!telegram || !name || !description || !budget || !contacts) {
    return sendJson(response, 400, { ok: false, error: "Required fields are missing" });
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

  let telegramResponse;

  try {
    telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true
      })
    });
  } catch (error) {
    return sendJson(response, 502, { ok: false, error: "Telegram connection failed" });
  }

  if (!telegramResponse.ok) {
    return sendJson(response, 502, { ok: false, error: "Telegram request failed" });
  }

  return sendJson(response, 200, { ok: true });
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 100_000) {
        request.destroy();
        reject(new Error("Request body is too large"));
      }
    });

    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(text);
}
