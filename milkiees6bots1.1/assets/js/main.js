const portfolioProjects = [
  {
    title: "MarketFlow Bot",
    description: "Бот для приема заказов, оплаты и передачи лидов в Google Sheets с уведомлениями менеджеру.",
    image: "assets/images/bot-commerce.svg",
    technologies: ["Telegram Bot API", "Webhooks", "Payments", "Sheets"],
    price: "от 75$",
    status: "Запущен"
  },
  {
    title: "SupportDesk TG",
    description: "Линия поддержки с очередью обращений, быстрыми ответами и ролями для операторов.",
    image: "assets/images/bot-support.svg",
    technologies: ["Node.js", "CRM API", "Admin UI", "Logs"],
    price: "от 90$",
    status: "В продакшене"
  },
  {
    title: "CourseAccess Bot",
    description: "Выдача учебных материалов, проверка оплаты, напоминания и прогресс по урокам.",
    image: "assets/images/bot-learning.svg",
    technologies: ["Subscriptions", "Channels", "Analytics", "Files"],
    price: "от 65$",
    status: "Готов"
  },
  {
    title: "LeadRouter",
    description: "Квалификация заявок и распределение между менеджерами по географии, графику и нагрузке.",
    image: "assets/images/bot-commerce.svg",
    technologies: ["Routing", "CRM", "Notifications", "CSV"],
    price: "от 55$",
    status: "Поддержка"
  },
  {
    title: "EventPulse Bot",
    description: "Регистрация гостей, QR-подтверждения, рассылки и отчеты по посещаемости мероприятия.",
    image: "assets/images/bot-support.svg",
    technologies: ["QR", "Broadcasts", "Reports", "Moderation"],
    price: "от 50$",
    status: "Готов"
  },
  {
    title: "MiniCRM Assistant",
    description: "Карточки клиентов, задачи, статусы сделок и ежедневные сводки прямо в Telegram.",
    image: "assets/images/bot-learning.svg",
    technologies: ["Database-ready", "Tasks", "Roles", "Exports"],
    price: "до 100$",
    status: "MVP"
  }
];

const fallbackCategories = [
  {
    id: "orders",
    title: "Заказы и оценки проектов",
    description: "Разбор задач, бюджетов, сроков и технических ограничений перед стартом разработки.",
    topics: 18,
    messages: 94
  },
  {
    id: "integrations",
    title: "Интеграции Telegram API",
    description: "Платежи, CRM, Google Sheets, админ-панели, webhooks и внешние сервисы.",
    topics: 26,
    messages: 141
  }
];

const fallbackUsers = [
  {
    id: "u-milk",
    name: "milkiees6",
    role: "Разработчик",
    avatar: "M6",
    telegram: "@milkiees6",
    reputation: 128,
    bio: "Проектирую Telegram-ботов для продаж, поддержки и автоматизации."
  },
  {
    id: "u-nika",
    name: "NikaOps",
    role: "Клиент",
    avatar: "NO",
    telegram: "@nika_ops",
    reputation: 34,
    bio: "Ищу надежные решения для операционных процессов."
  }
];

const fallbackTopics = [
  {
    id: "t-001",
    categoryId: "orders",
    title: "Сколько времени занимает бот для приема заявок?",
    excerpt: "Форма, уведомления менеджеру и выгрузка в таблицу.",
    authorId: "u-nika",
    tags: ["оценка", "заявки"],
    views: 284,
    replies: [{ id: "1" }]
  },
  {
    id: "t-002",
    categoryId: "integrations",
    title: "Оплата через Telegram Stars или внешнюю платежку?",
    excerpt: "Ограничения и архитектура платежного модуля.",
    authorId: "u-milk",
    tags: ["payments", "api"],
    views: 419,
    replies: [{ id: "1" }]
  }
];

const byId = (id) => document.getElementById(id);

function initNavigation() {
  const toggle = byId("menuToggle");
  const nav = byId("siteNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  });
}

function initReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((element) => observer.observe(element));
}

function projectCard(project) {
  const tech = project.technologies.map((item) => `<span class="chip">${item}</span>`).join("");
  return `
    <article class="project-card" data-reveal>
      <div class="project-media">
        <img src="${project.image}" alt="Скриншот проекта ${project.title}" loading="lazy" width="960" height="640">
      </div>
      <div class="project-body">
        <div class="topic-top">
          <h3>${project.title}</h3>
          <span class="status">${project.status}</span>
        </div>
        <p class="muted">${project.description}</p>
        <div class="meta-row">${tech}</div>
        <div class="price-line">
          <strong>${project.price}</strong>
          <a class="btn btn-ghost" href="order.html">Обсудить</a>
        </div>
      </div>
    </article>
  `;
}

function renderPortfolio(limit) {
  const root = byId("portfolioGrid");
  if (!root) return;

  const items = Number.isFinite(limit) ? portfolioProjects.slice(0, limit) : portfolioProjects;
  root.innerHTML = items.map(projectCard).join("");
}

function topicCard(topic, users = [], categories = []) {
  const author = users.find((user) => user.id === topic.authorId);
  const category = categories.find((item) => item.id === topic.categoryId);
  const tags = (topic.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("");
  const repliesCount = Array.isArray(topic.replies) ? topic.replies.length : topic.replies || 0;

  return `
    <article class="topic-card" data-topic="${topic.title.toLowerCase()} ${(topic.tags || []).join(" ").toLowerCase()}">
      <div class="topic-top">
        <div>
          <h3>${topic.title}</h3>
          <p class="muted">${topic.excerpt}</p>
        </div>
        ${category ? `<span class="status">${category.title}</span>` : ""}
      </div>
      <div class="meta-row">${tags}</div>
      <div class="topic-top">
        <div class="user-line">
          <span class="avatar">${author ? author.avatar : "TG"}</span>
          <span class="muted">${author ? author.name : "Участник"}</span>
        </div>
        <div class="topic-stats">
          <span>${repliesCount} ответов</span>
          <span>${topic.views} просмотров</span>
        </div>
      </div>
    </article>
  `;
}

async function loadForumData() {
  try {
    const [categories, topics, users] = await Promise.all([
      fetch("forum/categories.json").then((response) => response.json()),
      fetch("forum/topics.json").then((response) => response.json()),
      fetch("forum/users.json").then((response) => response.json())
    ]);
    return { categories, topics, users };
  } catch (error) {
    return { categories: fallbackCategories, topics: fallbackTopics, users: fallbackUsers };
  }
}

async function renderLatestTopics() {
  const root = byId("latestTopics");
  if (!root) return;

  const { topics, users, categories } = await loadForumData();
  root.innerHTML = topics.slice(0, 3).map((topic) => topicCard(topic, users, categories)).join("");
}

async function renderForum() {
  const categoryRoot = byId("forumCategories");
  const topicRoot = byId("forumTopics");
  const profileRoot = byId("forumProfiles");
  if (!categoryRoot || !topicRoot || !profileRoot) return;

  const { categories, topics, users } = await loadForumData();

  categoryRoot.innerHTML = categories
    .map(
      (category) => `
        <article class="category-card glass">
          <div class="icon-box" aria-hidden="true">${category.title.slice(0, 1)}</div>
          <h3>${category.title}</h3>
          <p class="muted">${category.description}</p>
          <div class="topic-stats">
            <span>${category.topics} тем</span>
            <span>${category.messages} сообщений</span>
          </div>
        </article>
      `
    )
    .join("");

  const paintTopics = (items) => {
    topicRoot.innerHTML = items.length
      ? items.map((topic) => topicCard(topic, users, categories)).join("")
      : `<div class="topic-card"><h3>Ничего не найдено</h3><p class="muted">Попробуйте другой запрос или тег.</p></div>`;
  };

  paintTopics(topics);

  profileRoot.innerHTML = users
    .map(
      (user) => `
        <article class="profile-card">
          <div class="user-line">
            <span class="avatar">${user.avatar}</span>
            <div>
              <strong>${user.name}</strong>
              <div class="muted">${user.role}</div>
            </div>
          </div>
          <p class="muted">${user.bio}</p>
          <div class="topic-stats">
            <span>${user.telegram}</span>
            <span>${user.reputation} реп.</span>
          </div>
        </article>
      `
    )
    .join("");

  const search = byId("topicSearch");
  if (search) {
    search.addEventListener("input", () => {
      const value = search.value.trim().toLowerCase();
      const filtered = topics.filter((topic) => {
        const haystack = `${topic.title} ${topic.excerpt} ${(topic.tags || []).join(" ")}`.toLowerCase();
        return haystack.includes(value);
      });
      paintTopics(filtered);
    });
  }
}

function initOrderForm() {
  const form = byId("orderForm");
  const success = byId("orderSuccess");
  if (!form || !success) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const request = Object.fromEntries(formData.entries());
    const payload = { ...request, createdAt: new Date().toISOString() };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Order API is not available");
      success.textContent = "Заявка отправлена, ждите ответ от @procentmd1.";
    } catch (error) {
      localStorage.setItem("milkiees6bots:lastOrder", JSON.stringify(payload));
      success.textContent = "Заявка отправлена, ждите ответ от @procentmd1.";
    }

    success.classList.add("is-visible");
    success.focus();
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  renderPortfolio(document.body.dataset.page === "home" ? 3 : undefined);
  renderLatestTopics();
  renderForum();
  initOrderForm();
  initReveal();
});
