// =====================================================================
// script.js - LÓGICA PRINCIPAL
// Depende do arquivo messages.js (carregado antes)
// =====================================================================

// =====================================================================
// 1. CONTROLE DE REPETIÇÃO DE MENSAGENS
// =====================================================================

let lastMessageIndex = -1;

// =====================================================================
// 2. CÁLCULO DE FERIADOS MÓVEIS (com cache por ano)
// =====================================================================

const holidayCache = {};

function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getMovableHolidays(year) {
  if (holidayCache[year]) return holidayCache[year];

  const easter = getEasterDate(year);
  const addDays = (dt, days) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + days);

  const holidays = {
    "Carnaval": addDays(easter, -47),
    "Quarta-feira de Cinzas": addDays(easter, -46),
    "Sexta-feira Santa": addDays(easter, -2),
    "Páscoa": easter,
    "Corpus Christi": addDays(easter, 60),
  };

  const result = {};
  for (const [name, dt] of Object.entries(holidays)) {
    const key = `${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
    result[key] = { name, type: "movel", date: dt };
  }

  holidayCache[year] = result;
  return result;
}

// -------- Feriados fixos (nacionais, estaduais RJ, municipais RJ) --------
const fixedHolidays = {
  "01-01": { name: "Ano Novo", type: "nacional" },
  "04-21": { name: "Tiradentes", type: "nacional" },
  "05-01": { name: "Dia do Trabalho", type: "nacional" },
  "09-07": { name: "Independência do Brasil", type: "nacional" },
  "10-12": { name: "Nossa Senhora Aparecida", type: "nacional" },
  "11-02": { name: "Finados", type: "nacional" },
  "11-15": { name: "Proclamação da República", type: "nacional" },
  "11-20": { name: "Consciência Negra", type: "nacional" },
  "12-25": { name: "Natal", type: "nacional" },
  "01-20": { name: "São Sebastião (RJ)", type: "estadual" },
  "04-23": { name: "São Jorge (RJ)", type: "municipal" },
};

// -------- Pontos facultativos fixos --------
const optionalHolidays = {
  "12-24": { name: "Véspera de Natal", type: "facultativo" },
  "12-31": { name: "Véspera de Ano Novo", type: "facultativo" },
};

function getAllHolidays(year) {
  const fixed = { ...fixedHolidays };
  const movable = getMovableHolidays(year);
  const all = { ...fixed, ...movable };
  for (const [key, val] of Object.entries(optionalHolidays)) {
    if (!all[key]) all[key] = val;
  }
  const cinzasKey = Object.keys(movable).find(k => movable[k].name === "Quarta-feira de Cinzas");
  if (cinzasKey && all[cinzasKey]) {
    all[cinzasKey].type = "facultativo";
  }
  return all;
}

function getHolidayInfo(date) {
  const year = date.getFullYear();
  const key = `${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const holidays = getAllHolidays(year);
  return holidays[key] || null;
}

function isWeekday(date) {
  const dow = date.getDay();
  return dow >= 1 && dow <= 5;
}

function isProlongedHoliday(holidayDate) {
  const dow = holidayDate.getDay();
  if (dow === 1 || dow === 5) return true;
  if (dow === 4) {
    const nextDay = new Date(holidayDate);
    nextDay.setDate(holidayDate.getDate() + 1);
    const nextHoliday = getHolidayInfo(nextDay);
    if (nextHoliday && (nextHoliday.type === 'facultativo' || nextHoliday.type !== 'nacional')) {
      return true;
    }
  }
  if (dow === 2) {
    const prevDay = new Date(holidayDate);
    prevDay.setDate(holidayDate.getDate() - 1);
    const prevHoliday = getHolidayInfo(prevDay);
    if (prevHoliday && (prevHoliday.type === 'facultativo' || prevHoliday.type !== 'nacional')) {
      return true;
    }
  }
  return false;
}

// =====================================================================
// 3. SELEÇÃO DE MENSAGENS (com rotação e não repetição)
// =====================================================================

// As variáveis messageMap, dayMessageMap e feriadaoMessagesList são
// definidas no arquivo messages.js, carregado antes deste script.

function getRandomMessageFromList(list) {
  if (!list || list.length === 0) return "☕ Aguente firme...";
  let idx;
  do {
    idx = Math.floor(Math.random() * list.length);
  } while (idx === lastMessageIndex && list.length > 1);
  lastMessageIndex = idx;
  return list[idx];
}

function getMessageForHoliday(holidayName) {
  const list = messageMap[holidayName];
  if (list) {
    return getRandomMessageFromList(list);
  }
  return `📅 Hoje é ${holidayName}! Aproveite!`;
}

function getMessageForDayOfWeek(dayOfWeek) {
  const list = dayMessageMap[dayOfWeek];
  if (list) {
    return getRandomMessageFromList(list);
  }
  return "☕ Aguente firme...";
}

// =====================================================================
// 4. LÓGICA PRINCIPAL DE MENSAGEM (com prioridades)
// =====================================================================

function getUpcomingHolidayMessage() {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7;

  for (let i = 1; i <= daysUntilSunday; i++) {
    const future = new Date(now);
    future.setDate(now.getDate() + i);
    if (!isWeekday(future)) continue;

    const holiday = getHolidayInfo(future);
    if (holiday) {
      const daysLeft = i;
      const name = holiday.name;
      let msg = `📢 Atenção! Em ${daysLeft} dia${daysLeft > 1 ? 's' : ''} teremos ${name}!`;

      if (isProlongedHoliday(future)) {
        const feriadaoMsg = getRandomMessageFromList(feriadaoMessagesList);
        msg = `🔥 ${feriadaoMsg}`;
      } else {
        const holidayMsg = getMessageForHoliday(name);
        msg = `📢 ${holidayMsg}`;
      }
      return msg;
    }
  }
  return null;
}

function getDailyMessage() {
  const now = new Date();
  const holidayToday = getHolidayInfo(now);
  if (holidayToday) {
    return getMessageForHoliday(holidayToday.name);
  }
  const dow = now.getDay();
  return getMessageForDayOfWeek(dow);
}

// =====================================================================
// 5. CONTAGEM REGRESSIVA PARA SEXTA (horário ajustado para 17h)
// =====================================================================

function getNextFriday() {
  const now = new Date();
  const friday = new Date();
  let daysUntilFriday = (5 - now.getDay() + 7) % 7;
  if (daysUntilFriday === 0 && now.getHours() >= 17) daysUntilFriday = 7;
  friday.setDate(now.getDate() + daysUntilFriday);
  friday.setHours(17, 0, 0, 0);
  return friday;
}

// =====================================================================
// 6. CONFETES
// =====================================================================

let confettiInterval;

function createConfetti(multiplier = 1) {
  const confetti = document.createElement('div');
  confetti.classList.add('confetti');
  confetti.style.left = Math.random() * window.innerWidth + 'px';
  const size = (Math.random() * 10 + 5) * multiplier;
  confetti.style.width = size + 'px';
  confetti.style.height = size + 'px';
  const colors = ['#ff0', '#0ff', '#f0f', '#0f0', '#ff5722', '#fff'];
  confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 5000);
}

function startNormalConfetti() {
  clearInterval(confettiInterval);
  confettiInterval = setInterval(() => createConfetti(1), 250);
}

function megaCelebration() {
  for (let i = 0; i < 400; i++) {
    setTimeout(() => createConfetti(Math.random() * 1.5 + 0.5), i * 8);
  }
}

// =====================================================================
// 7. ATUALIZAÇÃO DA INTERFACE (incluindo título e subtítulo)
// =====================================================================

function updateTitleAndSubtitle() {
  const titleEl = document.getElementById('title');
  const subtitleEl = document.getElementById('subtitle');
  const now = new Date();

  const holidayToday = getHolidayInfo(now);
  if (holidayToday) {
    titleEl.textContent = `⏳ ${holidayToday.name} está aqui! 🎉`;
    subtitleEl.textContent = `Aproveite o descanso!`;
    return;
  }

  const daysUntilSunday = (7 - now.getDay()) % 7;
  let holidayName = null;
  let daysLeft = 0;

  for (let i = 1; i <= daysUntilSunday; i++) {
    const future = new Date(now);
    future.setDate(now.getDate() + i);
    if (!isWeekday(future)) continue;
    const holiday = getHolidayInfo(future);
    if (holiday) {
      holidayName = holiday.name;
      daysLeft = i;
      break;
    }
  }

  if (holidayName) {
    titleEl.textContent = `⏳ ${holidayName} está chegando!`;
    subtitleEl.textContent = `Faltam ${daysLeft} dia${daysLeft > 1 ? 's' : ''} para o feriado!`;
  } else {
    titleEl.textContent = `⏳ Sexta-feira está chegando!`;
    subtitleEl.textContent = `A sobrevivência semanal continua...`;
  }
}

function updateCountdown() {
  const now = new Date();
  const countdown = document.querySelector('.countdown');
  const normalMessage = document.getElementById('message');
  const sextouContainer = document.getElementById('sextouContainer');
  const card = document.querySelector('.card');
  const title = document.getElementById('title');
  const subtitle = document.getElementById('subtitle');
  const footer = document.getElementById('footer');

  if (now.getDay() === 5 && now.getHours() >= 17) {
    countdown.style.display = 'none';
    normalMessage.style.display = 'none';
    title.style.display = 'none';
    subtitle.style.display = 'none';
    footer.style.display = 'none';
    sextouContainer.style.display = 'block';
    card.classList.add('sextou-mode');
    if (!sessionStorage.getItem('sextouCelebrated')) {
      sessionStorage.setItem('sextouCelebrated', 'true');
      megaCelebration();
    }
    return;
  }

  countdown.style.display = 'flex';
  normalMessage.style.display = 'block';
  title.style.display = 'block';
  subtitle.style.display = 'block';
  footer.style.display = 'block';
  sextouContainer.style.display = 'none';
  card.classList.remove('sextou-mode');

  const diff = getNextFriday() - now;
  document.getElementById('days').textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById('hours').textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById('minutes').textContent = Math.floor((diff / (1000 * 60)) % 60);
  document.getElementById('seconds').textContent = Math.floor((diff / 1000) % 60);
}

function updateMessage() {
  const msgEl = document.getElementById('message');

  const upcomingMsg = getUpcomingHolidayMessage();
  if (upcomingMsg) {
    msgEl.innerHTML = upcomingMsg;
    msgEl.classList.add('highlight');
  } else {
    const dailyMsg = getDailyMessage();
    msgEl.innerHTML = dailyMsg;
    msgEl.classList.remove('highlight');
  }

  updateTitleAndSubtitle();
}

// =====================================================================
// 8. INICIALIZAÇÃO
// =====================================================================

updateCountdown();
updateMessage();

setInterval(updateCountdown, 1000);
setInterval(updateMessage, 4000);

startNormalConfetti();