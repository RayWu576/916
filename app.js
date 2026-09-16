/**
 * Personal Dashboard & Live Clock Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DOM Elements
  // --------------------------------------------------------------------------
  const userNameEl = document.getElementById('userName');
  const personalTaglineEl = document.getElementById('personalTagline');
  const nameHintEl = document.getElementById('nameHint');
  const greetingTextEl = document.getElementById('greetingText');
  const greetingIconEl = document.getElementById('greetingIcon');
  const statusBtn = document.getElementById('statusBtn');
  const statusTextEl = document.getElementById('statusText');

  const clockHoursEl = document.getElementById('clockHours');
  const clockMinutesEl = document.getElementById('clockMinutes');
  const clockSecondsEl = document.getElementById('clockSeconds');
  const meridiemWrapperEl = document.getElementById('meridiemWrapper');
  const clockMeridiemEl = document.getElementById('clockMeridiem');
  const formatToggleBtn = document.getElementById('formatToggleBtn');
  const formatLabelEl = document.getElementById('formatLabel');
  const secondsTrackBarEl = document.getElementById('secondsTrackBar');

  const fullDateStrEl = document.getElementById('fullDateStr');
  const dayProgressBarEl = document.getElementById('dayProgressBar');
  const dayProgressPercentEl = document.getElementById('dayProgressPercent');
  const timezoneStrEl = document.getElementById('timezoneStr');
  const utcOffsetStrEl = document.getElementById('utcOffsetStr');
  const weekNumStrEl = document.getElementById('weekNumStr');

  // World Clocks
  const timeTokyoEl = document.getElementById('timeTokyo');
  const timeLondonEl = document.getElementById('timeLondon');
  const timeNewYorkEl = document.getElementById('timeNewYork');
  const timeUTCEl = document.getElementById('timeUTC');

  // Focus Timer
  const timerDigitsEl = document.getElementById('timerDigits');
  const timerStatusLabelEl = document.getElementById('timerStatusLabel');
  const timerToggleBtn = document.getElementById('timerToggleBtn');
  const timerBtnTextEl = document.getElementById('timerBtnText');
  const timerResetBtn = document.getElementById('timerResetBtn');
  const timerModeBtns = document.querySelectorAll('.timer-mode-btn');

  // Quotes
  const dailyQuoteEl = document.getElementById('dailyQuote');
  const quoteAuthorEl = document.getElementById('quoteAuthor');
  const refreshQuoteBtn = document.getElementById('refreshQuoteBtn');

  // Theme & Window
  const themeBtns = document.querySelectorAll('.theme-btn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // --------------------------------------------------------------------------
  // 2. State & Local Storage Initialization
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    NAME: 'pd_user_name',
    TAGLINE: 'pd_tagline',
    STATUS_INDEX: 'pd_status_index',
    IS_24H: 'pd_is_24h',
    THEME: 'pd_theme'
  };

  const STATUS_LIST = [
    { text: 'Deep Work', color: '#10b981' },
    { text: 'Building & Shipping', color: '#3b82f6' },
    { text: 'Flow State', color: '#a855f7' },
    { text: 'Taking a Break', color: '#f59e0b' },
    { text: 'Offline / Resting', color: '#64748b' }
  ];

  const QUOTES = [
    { text: "Time is not the main thing. It's the only thing.", author: "Miles Davis" },
    { text: "The two most powerful warriors are patience and time.", author: "Leo Tolstoy" },
    { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
    { text: "Lost time is never found again.", author: "Benjamin Franklin" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Focus is a muscle. Practice makes it effortless.", author: "James Clear" }
  ];

  let is24HourFormat = localStorage.getItem(STORAGE_KEYS.IS_24H) !== 'false'; // default true
  let currentStatusIndex = parseInt(localStorage.getItem(STORAGE_KEYS.STATUS_INDEX) || '0', 10);
  let savedName = localStorage.getItem(STORAGE_KEYS.NAME) || 'RAYWU';
  let savedTagline = localStorage.getItem(STORAGE_KEYS.TAGLINE) || 'Welcome back to your workspace. Make every moment count today.';
  let savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'aurora';

  // Apply Initial Stored Values
  userNameEl.textContent = savedName;
  personalTaglineEl.textContent = savedTagline;
  applyTheme(savedTheme);
  applyStatus(currentStatusIndex);
  updateFormatToggleButton();

  // --------------------------------------------------------------------------
  // 3. User Identity & Editable Name Controller
  // --------------------------------------------------------------------------
  function saveName() {
    const rawText = userNameEl.textContent.trim();
    const cleanName = rawText || 'Your Name';
    userNameEl.textContent = cleanName;
    localStorage.setItem(STORAGE_KEYS.NAME, cleanName);

    // Visual feedback
    if (nameHintEl) {
      nameHintEl.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span style="color: #10b981; font-weight: 600;">Saved!</span>
      `;
      setTimeout(() => {
        nameHintEl.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          <span>Click name to edit & save</span>
        `;
      }, 1800);
    }
  }

  userNameEl.addEventListener('blur', saveName);
  userNameEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      userNameEl.blur();
    }
  });

  personalTaglineEl.addEventListener('blur', () => {
    const rawTagline = personalTaglineEl.textContent.trim();
    localStorage.setItem(STORAGE_KEYS.TAGLINE, rawTagline);
  });
  personalTaglineEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      personalTaglineEl.blur();
    }
  });

  // Status Pill cycling
  function applyStatus(index) {
    const status = STATUS_LIST[index % STATUS_LIST.length];
    statusTextEl.textContent = status.text;
    const indicator = statusBtn.querySelector('.status-indicator');
    if (indicator) {
      indicator.style.background = status.color;
      indicator.style.boxShadow = `0 0 8px ${status.color}`;
    }
    localStorage.setItem(STORAGE_KEYS.STATUS_INDEX, index.toString());
  }

  statusBtn.addEventListener('click', () => {
    currentStatusIndex = (currentStatusIndex + 1) % STATUS_LIST.length;
    applyStatus(currentStatusIndex);
  });

  // --------------------------------------------------------------------------
  // 4. Live Clock & Timekeeping Engine
  // --------------------------------------------------------------------------
  function updateFormatToggleButton() {
    if (is24HourFormat) {
      formatLabelEl.textContent = '24H';
      meridiemWrapperEl.style.display = 'none';
    } else {
      formatLabelEl.textContent = '12H';
      meridiemWrapperEl.style.display = 'block';
    }
  }

  formatToggleBtn.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    localStorage.setItem(STORAGE_KEYS.IS_24H, is24HourFormat.toString());
    updateFormatToggleButton();
    updateClock();
  });

  function getISOWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }

  function formatTimeForZone(date, timeZone) {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24HourFormat
      });
      return formatter.format(date);
    } catch {
      return '--:--';
    }
  }

  function updateGreeting(hours) {
    let greeting = 'Good Evening';
    let icon = '🌇';

    if (hours >= 5 && hours < 12) {
      greeting = 'Good Morning';
      icon = '☀️';
    } else if (hours >= 12 && hours < 17) {
      greeting = 'Good Afternoon';
      icon = '🌤️';
    } else if (hours >= 17 && hours < 22) {
      greeting = 'Good Evening';
      icon = '🌇';
    } else {
      greeting = 'Good Night';
      icon = '🌙';
    }

    greetingTextEl.textContent = greeting;
    greetingIconEl.textContent = icon;
  }

  function updateClock() {
    const now = new Date();
    const rawHours = now.getHours();
    const rawMinutes = now.getMinutes();
    const rawSeconds = now.getSeconds();
    const rawMs = now.getMilliseconds();

    // 1. Dynamic Greeting
    updateGreeting(rawHours);

    // 2. Master Clock Display
    let displayHours = rawHours;
    let meridiem = 'AM';

    if (!is24HourFormat) {
      meridiem = rawHours >= 12 ? 'PM' : 'AM';
      displayHours = rawHours % 12 || 12;
    }

    clockHoursEl.textContent = String(displayHours).padStart(2, '0');
    clockMinutesEl.textContent = String(rawMinutes).padStart(2, '0');
    clockSecondsEl.textContent = String(rawSeconds).padStart(2, '0');
    clockMeridiemEl.textContent = meridiem;

    // 3. Seconds progress bar (linear sub-second smooth progress)
    const secondsProgress = ((rawSeconds + rawMs / 1000) / 60) * 100;
    secondsTrackBarEl.style.width = `${secondsProgress.toFixed(1)}%`;

    // 4. Date formatting
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fullDateStrEl.textContent = now.toLocaleDateString(undefined, dateOptions);

    // 5. Day progress percentage
    const secondsInDay = rawHours * 3600 + rawMinutes * 60 + rawSeconds;
    const dayProgress = (secondsInDay / 86400) * 100;
    dayProgressBarEl.style.width = `${dayProgress.toFixed(1)}%`;
    dayProgressPercentEl.textContent = `${dayProgress.toFixed(1)}% day passed`;

    // 6. Timezone and Offset
    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    timezoneStrEl.textContent = tzName;

    const offsetMinutes = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMinsRemainder = Math.abs(offsetMinutes) % 60;
    const offsetSign = offsetMinutes >= 0 ? '+' : '-';
    utcOffsetStrEl.textContent = `UTC${offsetSign}${offsetHours}${offsetMinsRemainder > 0 ? `:${String(offsetMinsRemainder).padStart(2, '0')}` : ''}`;

    // Week number
    weekNumStrEl.textContent = `W${String(getISOWeekNumber(now)).padStart(2, '0')}`;

    // 7. World Clocks
    timeTokyoEl.textContent = formatTimeForZone(now, 'Asia/Tokyo');
    timeLondonEl.textContent = formatTimeForZone(now, 'Europe/London');
    timeNewYorkEl.textContent = formatTimeForZone(now, 'America/New_York');
    timeUTCEl.textContent = formatTimeForZone(now, 'UTC');
  }

  // Run clock update loop immediately and periodically
  updateClock();
  setInterval(updateClock, 200);

  // --------------------------------------------------------------------------
  // 5. Focus / Pomodoro Timer Engine
  // --------------------------------------------------------------------------
  let timerDurationSec = 25 * 60;
  let timerRemainingSec = 25 * 60;
  let timerInterval = null;
  let isTimerRunning = false;

  function renderTimer() {
    const mins = Math.floor(timerRemainingSec / 60);
    const secs = timerRemainingSec % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    timerDigitsEl.textContent = formatted;

    if (isTimerRunning) {
      document.title = `(${formatted}) Personal Dashboard`;
    } else {
      document.title = 'Personal Dashboard & Live Clock';
    }
  }

  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerBtnTextEl.textContent = 'Pause Focus';
    timerStatusLabelEl.textContent = 'Focus in progress... Stay in the zone';

    timerInterval = setInterval(() => {
      if (timerRemainingSec > 0) {
        timerRemainingSec--;
        renderTimer();
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerBtnTextEl.textContent = 'Start Focus';
        timerStatusLabelEl.textContent = '🎉 Session completed! Great work.';
        renderTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!isTimerRunning) return;
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerBtnTextEl.textContent = 'Resume Focus';
    timerStatusLabelEl.textContent = 'Paused';
    renderTimer();
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerRemainingSec = timerDurationSec;
    timerBtnTextEl.textContent = 'Start Focus';
    timerStatusLabelEl.textContent = 'Ready to focus';
    renderTimer();
  }

  timerToggleBtn.addEventListener('click', () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  timerResetBtn.addEventListener('click', resetTimer);

  timerModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timerModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mins = parseInt(btn.dataset.minutes, 10);
      timerDurationSec = mins * 60;
      resetTimer();
    });
  });

  // --------------------------------------------------------------------------
  // 6. Daily Motto / Spark Generator
  // --------------------------------------------------------------------------
  let currentQuoteIndex = 0;
  function showQuote(index) {
    const q = QUOTES[index % QUOTES.length];
    dailyQuoteEl.style.opacity = '0';
    quoteAuthorEl.style.opacity = '0';

    setTimeout(() => {
      dailyQuoteEl.textContent = `"${q.text}"`;
      quoteAuthorEl.textContent = `— ${q.author}`;
      dailyQuoteEl.style.transition = 'opacity 0.3s ease';
      quoteAuthorEl.style.transition = 'opacity 0.3s ease';
      dailyQuoteEl.style.opacity = '1';
      quoteAuthorEl.style.opacity = '1';
    }, 150);
  }

  refreshQuoteBtn.addEventListener('click', () => {
    currentQuoteIndex = (currentQuoteIndex + 1) % QUOTES.length;
    showQuote(currentQuoteIndex);
  });

  // --------------------------------------------------------------------------
  // 7. Theme Switcher & Fullscreen
  // --------------------------------------------------------------------------
  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem(STORAGE_KEYS.THEME, themeName);
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
    });
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  });
});
