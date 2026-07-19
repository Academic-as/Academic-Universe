const DEFAULT_THEME = 'summer';

const themes = {
  winter: {
    label: 'Зимняя',
    bg: '#071b2f',
    bg2: '#10324b',
    glow1: 'rgba(223, 247, 255, 0.2)',
    glow2: 'rgba(143, 208, 255, 0.2)',
    panel: 'rgba(255, 255, 255, 0.08)',
    text: '#f6fbff',
    muted: '#8fb0cc',
    accent: '#dff7ff',
    accentStrong: '#8dd9ff',
    accentSoft: '#d8f2ff',
    border: 'rgba(223, 247, 255, 0.24)'
  },
  summer: {
    label: 'Летняя',
    bg: '#22111d',
    bg2: '#4a2431',
    glow1: 'rgba(255, 183, 197, 0.24)',
    glow2: 'rgba(255, 214, 228, 0.2)',
    panel: 'rgba(255, 255, 255, 0.08)',
    text: '#fff7fa',
    muted: '#c8a4b3',
    accent: '#ffd8e4',
    accentStrong: '#ff9eb2',
    accentSoft: '#ffe7ef',
    border: 'rgba(255, 216, 228, 0.28)'
  },
  spring: {
    label: 'Весенняя',
    bg: '#1f2f31',
    bg2: '#4d5f4b',
    glow1: 'rgba(255, 168, 196, 0.24)',
    glow2: 'rgba(185, 243, 194, 0.22)',
    panel: 'rgba(255, 255, 255, 0.08)',
    text: '#fff7fb',
    muted: '#aebfa8',
    accent: '#ffd0e3',
    accentStrong: '#ff8fb7',
    accentSoft: '#ffe8f1',
    border: 'rgba(255, 208, 227, 0.28)'
  }
};

function applyTheme(themeName) {
  const theme = themes[themeName] || themes[DEFAULT_THEME];
  document.body.dataset.theme = themeName;
  document.documentElement.style.setProperty('--bg', theme.bg);
  document.documentElement.style.setProperty('--bg-2', theme.bg2);
  document.documentElement.style.setProperty('--glow-primary', theme.glow1);
  document.documentElement.style.setProperty('--glow-secondary', theme.glow2);
  document.documentElement.style.setProperty('--panel', theme.panel);
  document.documentElement.style.setProperty('--text', theme.text);
  document.documentElement.style.setProperty('--muted', theme.muted);
  document.documentElement.style.setProperty('--accent', theme.accent);
  document.documentElement.style.setProperty('--accent-strong', theme.accentStrong);
  document.documentElement.style.setProperty('--accent-soft', theme.accentSoft);
  document.documentElement.style.setProperty('--border', theme.border);
}

const canvas = document.getElementById('sakuraCanvas');
const thunderOverlay = document.getElementById('thunderOverlay');
const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let dpr = Math.max(1, window.devicePixelRatio || 1);
const petals = [];
const rainDrops = [];

function resizeCanvas() {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  petals.length = 0;
  rainDrops.length = 0;

  const petalCount = Math.min(120, Math.max(70, Math.floor(width / 10)));
  const rainCount = Math.min(260, Math.max(140, Math.floor(width / 4.5)));

  for (let i = 0; i < petalCount; i += 1) {
    petals.push(createPetal());
  }

  for (let i = 0; i < rainCount; i += 1) {
    rainDrops.push(createRainDrop());
  }
}

function createPetal() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 2 + Math.random() * 4,
    speed: 0.15 + Math.random() * 0.3,
    sway: Math.random() * 0.02,
    drift: (Math.random() - 0.5) * 0.3,
    rotation: Math.random() * Math.PI * 2
  };
}

function createRainDrop() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    length: 8 + Math.random() * 16,
    speed: 2 + Math.random() * 3,
    opacity: 0.18 + Math.random() * 0.22
  };
}

function drawScene() {
  ctx.clearRect(0, 0, width, height);

  ctx.save();
  petals.forEach((petal) => {
    petal.y += petal.speed;
    petal.x += Math.sin(petal.rotation) * petal.sway + petal.drift;
    petal.rotation += 0.004;

    if (petal.y > height + 10) {
      petal.y = -10;
      petal.x = Math.random() * width;
    }

    if (petal.x < -10) {
      petal.x = width + 10;
    }
    if (petal.x > width + 10) {
      petal.x = -10;
    }

    ctx.beginPath();
    ctx.moveTo(petal.x, petal.y);
    ctx.quadraticCurveTo(petal.x + petal.size * 0.6, petal.y - petal.size * 0.4, petal.x + petal.size, petal.y);
    ctx.quadraticCurveTo(petal.x + petal.size * 0.6, petal.y + petal.size * 0.4, petal.x, petal.y);
    ctx.closePath();
    ctx.fillStyle = `rgba(250, 218, 221, ${0.38 + Math.random() * 0.2})`;
    ctx.fill();
  });
  ctx.restore();

  ctx.save();
  rainDrops.forEach((drop) => {
    drop.y += drop.speed;
    drop.x -= 0.12;

    if (drop.y > height + 20) {
      drop.y = -20;
      drop.x = Math.random() * width;
    }

    ctx.strokeStyle = `rgba(255, 255, 255, ${drop.opacity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 0.7, drop.y + drop.length);
    ctx.stroke();
  });
  ctx.restore();

  requestAnimationFrame(drawScene);
}

function triggerThunder() {
  thunderOverlay.classList.remove('active');
  void thunderOverlay.offsetWidth;
  thunderOverlay.classList.add('active');
  setTimeout(() => thunderOverlay.classList.remove('active'), 900);
}

function scheduleThunder() {
  const wait = 6000 + Math.random() * 12000;
  setTimeout(() => {
    triggerThunder();
    scheduleThunder();
  }, wait);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawScene();
scheduleThunder();

const carouselElement = document.getElementById('videoCarousel');
if (carouselElement) {
  const speed = 0.4;
  let position = 0;

  function autoScrollCarousel() {
    position += speed;
    if (position >= carouselElement.scrollWidth - carouselElement.clientWidth) {
      position = 0;
    }
    carouselElement.scrollLeft = position;
    requestAnimationFrame(autoScrollCarousel);
  }

  autoScrollCarousel();
}

const audioElement = document.getElementById('pageAudio');
const audioToggle = document.getElementById('audioToggle');
const audioVolume = document.getElementById('audioVolume');

if (audioElement) {
  audioElement.volume = 0.1;
  audioElement.loop = true;
  audioElement.preload = 'auto';
  audioElement.muted = true;

  const updateAudioButton = () => {
    audioToggle.textContent = audioElement.paused ? '🔇' : '🔊';
  };

  audioToggle.addEventListener('click', async () => {
    if (audioElement.paused) {
      await audioElement.play();
      audioElement.muted = false;
    } else {
      audioElement.pause();
    }
    updateAudioButton();
  });

  audioVolume.addEventListener('input', (event) => {
    audioElement.volume = parseFloat(event.target.value);
  });

  audioElement.addEventListener('play', updateAudioButton);
  audioElement.addEventListener('pause', updateAudioButton);

  const initAudio = async () => {
    audioElement.muted = true;
    try {
      await audioElement.play();
      audioElement.muted = false;
      console.log('Автовоспроизведение запущено сразу после загрузки');
    } catch (e) {
      console.log('Автовоспроизведение заблокировано браузером');
    }
    updateAudioButton();
  };

  window.addEventListener('load', initAudio);

  const audioHint = document.getElementById('audioHint');
  if (audioHint) {
    const showHint = () => {
      audioHint.classList.add('show');
      setTimeout(() => audioHint.classList.remove('show'), 5000);
    };

    showHint();
    setInterval(showHint, 25000);
  }

  updateAudioButton();
}
const favoriteGames = [
  {
    title: 'Zenless Zone Zero',
    note: 'Яркая городская RPG с живой боёвкой',
    steamUrl: 'https://steamcommunity.com/app/4162040'
  },
  {
    title: 'NTE: Neverness to Everness',
    note: 'Сюжетный хоррор с атмосферой и сообществом',
    steamUrl: 'https://store.steampowered.com/app/4508340/NTE_Neverness_to_Everness/'
  },
  {
    title: 'Grand Theft Auto V Enhanced',
    note: 'Открытый мир, сюжет и бесконечный экшен',
    steamUrl: 'https://store.steampowered.com/app/3240220/Grand_Theft_Auto_V_Enhanced/'
  }
];

const favoritesContainer = document.getElementById('favorites-panel');

function getSteamHref(game) {
  const rawUrl = game.steamUrl?.trim();

  if (rawUrl && /^https?:\/\//i.test(rawUrl)) {
    return rawUrl;
  }

  return `https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`;
}

let currentLanguage = 'ru';

function renderSteamLink(game, label = 'Открыть в Steam') {
  return `<a class="steam-link" href="${getSteamHref(game)}" target="_blank" rel="noreferrer">${label}</a>`;
}

function renderFavorites() {
  if (!favoritesContainer) return;

  const locale = translations[currentLanguage] || translations.ru;
  const gameNotes = {
    ru: {
      'Zenless Zone Zero': translations.ru.gameZenlessNote,
      'NTE: Neverness to Everness': translations.ru.gameNTENote,
      'Grand Theft Auto V Enhanced': translations.ru.gameGTANote
    },
    en: {
      'Zenless Zone Zero': translations.en.gameZenlessNote,
      'NTE: Neverness to Everness': translations.en.gameNTENote,
      'Grand Theft Auto V Enhanced': translations.en.gameGTANote
    }
  };

  favoritesContainer.innerHTML = `
    <div class="games-grid">
      ${favoriteGames
        .map(
          (game) => `
            <article class="game-card favorite-card">
              <div class="game-card-head">
                <div>
                  <h3>${game.title}</h3>
                  <p class="meta">${gameNotes[currentLanguage][game.title]}</p>
                </div>
                ${renderSteamLink(game, locale.steamOpenButton)}
              </div>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

const translations = {
  ru: {
    pageTitle: 'Академик',
    audioHint: '← не хотите немного музыки?',
    heroEyebrow: 'Коснись заветных грёз - глядя в небеса, новый путь вперёд зовёт.',
    heroHeading: 'Привет. Я Academic — создаю музыку, миры и настроение в каждом треке и каждой игре.',
    heroButton: 'Узнать подробнее',
    profileName: 'Academic • Академик',
    profileStatus: 'Музыка • гейминг',
    aboutTitle: 'Обо мне',
    aboutIntro: 'Звать меня Академик — мне 22, и я живу между творчеством, кодингом и атмосферой хороших игр. Стараюсь быть простым, добрым и отзывчивым человеком.',
    aboutMusic: '<strong>🎵 Музыка и команда:</strong> Музыка — важнейшая часть моей жизни. Вместе с друзьями мы создаём собственные треки и развиваем творческий проект. Сейчас у нас небольшая пауза, но я верю, что это лишь перерыв перед новым этапом.',
    aboutMain: '<strong>❤️ Главное:</strong> Рядом со мной мой <strong>Ангелочек</strong> — самый дорогой человек, который поддерживает меня во всём.',
    aboutViews: '<strong>🎨 Взгляды:</strong> Уважаю творчество, сделанное с душой. Особенно ценю фурри-сообщество за красивые и ламповые арты. При этом я не поддерживаю ЛГБТ, БДСМ и похожие темы.',
    linksTitle: 'Ссылки',
    linksSubtitle: 'Интересные ссылочки...',
    steamProfile: 'Мой Steam Профиль',
    myNicknameProfile: 'Творческий ник',
    gunsLolProfile: 'Профиль и активности',
    videosTitle: 'Все видео',
    videosSubtitle: 'Канал Academic Studios',
    videoActionOpen: 'Открыть',
    favoritesTitle: 'Любимые игры',
    steamOpenButton: 'Открыть в Steam',
    gameZenlessNote: 'Яркая городская RPG с живой боёвкой',
    gameNTENote: 'Сюжетный хоррор с атмосферой и сообществом',
    gameGTANote: 'Открытый мир, сюжет и бесконечный экшен',
    moreAboutText: 'Тут текст еще не готов но будет',
    backButtonText: '← Назад',
    footerText: 'Академик • Здесь должен был быть текст, но нужные слова пока не нашлись...'
  },
  en: {
    pageTitle: 'Academic',
    audioHint: '← want some music?',
    heroEyebrow: 'Touch the cherished dreams — a new path forward calls from the sky.',
    heroHeading: 'Hello. I am Academic — I create music, worlds, and atmosphere in every track and every game.',
    heroButton: 'Learn more',
    profileName: 'Academic • Academic',
    profileStatus: 'Music • gaming',
    aboutTitle: 'About me',
    aboutIntro: 'My name is Academic — I am 22, and I live between creativity, coding, and the atmosphere of great games. I try to be a simple, kind, and responsive person.',
    aboutMusic: '<strong>🎵 Music and team:</strong> Music is the most important part of my life. Together with friends, we create our own tracks and develop a creative project. We are currently on a short pause, but I believe it is only a break before a new stage.',
    aboutMain: '<strong>❤️ Most important:</strong> Beside me is my <strong>Angel</strong> — the dearest person who supports me in everything.',
    aboutViews: '<strong>🎨 Views:</strong> I respect art made with soul. I especially value the furry community for its beautiful and cozy art. At the same time, I do not support LGBT, BDSM, or similar themes.',
    linksTitle: 'Links',
    linksSubtitle: 'Interesting links...',
    steamProfile: 'My Steam profile',
    myNicknameProfile: 'Creative nickname',
    gunsLolProfile: 'Profile and activities',
    videosTitle: 'All videos',
    videosSubtitle: 'Academic Studios channel',
    videoActionOpen: 'Open',
    favoritesTitle: 'Favorite games',
    steamOpenButton: 'Open in Steam',
    gameZenlessNote: 'Bright urban RPG with dynamic combat',
    gameNTENote: 'Story-driven horror with atmosphere and community',
    gameGTANote: 'Open world, story and endless action',
    moreAboutText: 'This text is not ready yet but will be',
    backButtonText: '← Back',
    footerText: 'Academic • There should have been text here, but the right words have not been found yet...'
  }
};

function setLanguage(lang) {
  currentLanguage = lang;
  const locale = translations[lang] || translations.ru;
  document.documentElement.lang = lang;
  document.title = locale.pageTitle;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (locale[key]) {
      // Use innerHTML for elements that should contain HTML (about section)
      if (['aboutMusic', 'aboutMain', 'aboutViews'].includes(key)) {
        element.innerHTML = locale[key];
      } else {
        element.textContent = locale[key];
      }
    }
  });

  document.querySelectorAll('.lang-toggle').forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });

  renderFavorites();
}

const langButtons = document.querySelectorAll('.lang-toggle');
langButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
  });
});

// Handle "About me more" button and back button
const heroButton = document.querySelector('.hero-button');
const backButton = document.getElementById('backButton');
const moreAboutSection = document.getElementById('more-about-section');

if (heroButton) {
  heroButton.addEventListener('click', () => {
    moreAboutSection.classList.add('visible');
  });
}

if (backButton) {
  backButton.addEventListener('click', () => {
    moreAboutSection.classList.remove('visible');
  });
}

renderFavorites();
setLanguage('ru');
applyTheme(DEFAULT_THEME);

