# 🏢 OSBB AI Assistant

**AI-powered ticket management system for housing associations (ОСББ)**

🔗 **Live Demo:** https://osbb-mvp.vercel.app

---

## 📋 Про проект

Система управління заявками для ОСББ з AI-класифікацією. Мешканці можуть подавати заявки, а штучний інтелект автоматично визначає тип проблеми та пріоритет.

### ✨ Можливості

- 🤖 **AI-класифікація** — автоматичне визначення типу та пріоритету заявки (Groq + Llama 3.1)
- 📊 **Real-time дашборд** — моніторинг всіх заявок з графіками та статистикою
- 🎨 **Сучасний UI** — glassmorphism дизайн, адаптивний під мобільні
- ⚡ **Швидкість** — обробка заявки за ~500мс
- 🔄 **Авто-оновлення** — дані оновлюються кожні 10 секунд

### 🛠 Технології

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (графіки)
- Lucide React (іконки)

**Backend:**
- Next.js API Routes
- Groq Cloud API (Llama 3.1 8B)
- In-memory storage (демо)

**Deployment:**
- Vercel
- GitHub

### 📱 Як користуватися

**Для мешканців:**
1. Відкрий https://osbb-mvp.vercel.app
2. Опиши проблему
3. Вкажи номер квартири
4. Натисни "Надіслати заявку"

**Для голови ОСББ:**
1. Відкрий https://osbb-mvp.vercel.app/admin
2. Переглядай заявки в реальному часі
3. Змінюй статуси заявок
4. Аналізуй статистику за графіками

### 🚀 Встановлення (локально)

```bash
# Клонуй репозиторій
git clone https://github.com/vasiliyyanov-max/osbb-mvp.git

# Встанови залежності
npm install

# Створи .env.local з GROQ_API_KEY
echo "GROQ_API_KEY=your_key_here" > .env.local

# Запусти
npm run dev