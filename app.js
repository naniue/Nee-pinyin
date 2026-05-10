const DEFAULT_WORDS = [
  { kanji: "長所", kanaParts: ["ちょう", "しょ"], pinyinParts: ["chang", "suo"] },
  { kanji: "会長", kanaParts: ["かい", "ちょう"], pinyinParts: ["hui", "zhang"] },
  { kanji: "会社", kanaParts: ["かい", "しゃ"], pinyinParts: ["hui", "she"] },
  { kanji: "教員", kanaParts: ["きょう", "いん"], pinyinParts: ["jiao", "yuan"] },
  { kanji: "教会", kanaParts: ["きょう", "かい"], pinyinParts: ["jiao", "hui"] },
  { kanji: "教育", kanaParts: ["きょう", "いく"], pinyinParts: ["jiao", "yu"] },
  { kanji: "社交", kanaParts: ["しゃ", "こう"], pinyinParts: ["she", "jiao"] },
  { kanji: "交通", kanaParts: ["こう", "つう"], pinyinParts: ["jiao", "tong"] },
  { kanji: "社員", kanaParts: ["しゃ", "いん"], pinyinParts: ["she", "yuan"] },
  { kanji: "職員", kanaParts: ["しょく", "いん"], pinyinParts: ["zhi", "yuan"] },
  { kanji: "精神", kanaParts: ["せい", "しん"], pinyinParts: ["jing", "shen"] },
  { kanji: "神社", kanaParts: ["じん", "じゃ"], pinyinParts: ["shen", "she"] },
  { kanji: "神童", kanaParts: ["しん", "どう"], pinyinParts: ["shen", "tong"] }
];

const PINYIN_BY_KANJI = {
  重: "zhong",
  心: "xin",
  要: "yao",
  尊: "zun",
  理: "li",
  中: "zhong",
  今: "jin",
  週: "zhou",
  周: "zhou",
  交: "jiao",
  番: "fan",
  公: "gong",
  園: "yuan",
  园: "yuan",
  郵: "you",
  邮: "you",
  便: "bian",
  本: "ben",
  当: "dang",
  當: "dang"
};

const WORD_READING_PARTS = {
  長所: ["ちょう", "しょ"],
  会長: ["かい", "ちょう"],
  会社: ["かい", "しゃ"],
  教員: ["きょう", "いん"],
  教会: ["きょう", "かい"],
  教育: ["きょう", "いく"],
  社交: ["しゃ", "こう"],
  交通: ["こう", "つう"],
  社員: ["しゃ", "いん"],
  職員: ["しょく", "いん"],
  精神: ["せい", "しん"],
  神社: ["じん", "じゃ"],
  神童: ["しん", "どう"]
};

const SUPABASE_URL = "https://zmqbazkasaehrzzhkyph.supabase.co";
const SUPABASE_KEY = "sb_publishable_jWi8lPtYs99tCyIh2AUw0A_q0VDoXbg";
const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;
const BATCH_SIZE = 20;
const MY_WORDS_SOURCE = "mine";
const ALL_WORD_SOURCES = [MY_WORDS_SOURCE, "N5", "N4", "N3", "N2", "N1"];
const AUTH_REDIRECT_URL = "https://naniue.github.io/-/";

function toChineseAuthError(message) {
  const raw = String(message || "").toLowerCase();
  if (!raw) return "操作失败，请稍后再试。";
  if (raw.includes("invalid login credentials")) return "邮箱或密码不正确。";
  if (raw.includes("email not confirmed")) return "请先完成邮箱验证，再登录。";
  if (raw.includes("user already registered") || raw.includes("already registered")) return "这个邮箱已经注册过，请直接登录。";
  if (raw.includes("password")) return "密码不符合要求，请至少输入 6 位。";
  if (raw.includes("rate limit") || raw.includes("too many")) return "操作太频繁，请稍后再试。";
  if (raw.includes("foreign key") || raw.includes("member_profiles_user_id_fkey")) return "会员信息同步中，请刷新页面后重新登录。";
  if (raw.includes("network") || raw.includes("failed to fetch")) return "网络连接失败，请检查网络后重试。";
  if (raw.includes("oauth")) return "第三方登录暂时不可用，请稍后再试。";
  if (/^[\x00-\x7F]+$/.test(String(message || ""))) return "操作失败，请稍后再试。";
  return String(message);
}

const uiText = {
  zh: {
    learn: "学习",
    test: "测试",
    add: "添加",
    authTitle: "个人中心",
    email: "邮箱",
    password: "密码",
    inviteCode: "邀请码（注册时必填）",
    login: "登录",
    register: "注册",
    logout: "退出登录",
    settings: "设置",
    reset: "重置进度",
    currentGuest: "当前未登录（访客模式）。登录后词库存储到账号。",
    currentUser: (user) => `当前已登录：${user}`,
    loginSuccess: (user) => `登录成功：${user}`,
    registerSuccess: (user) => `验证邮件已发送到 ${user}。请现在打开邮箱，点击邮件里的验证链接；验证成功后再回到这里登录。`,
    logoutSuccess: "已退出登录，回到访客模式。",
    authMissing: "请输入邮箱和密码。",
    authMissingInvite: "注册需要填写邀请码。",
    memberChecking: "正在确认会员状态...",
    memberRequired: "请先登录会员账号。注册时需要填写有效邀请码，完成邮箱认证并登录后才能使用。",
    memberDenied: "此账号还不是会员，请使用邀请码注册会员账号。",
    levelLoaded: (level, count) => `已加载 ${level} 词库，共 ${count} 个单词。`,
    myWordsLoaded: (count) => `已加载我的单词，共 ${count} 个。`,
    authFailed: (msg) => `操作失败：${toChineseAuthError(msg)}`
  },
  ja: {
    learn: "学習",
    test: "テスト",
    add: "追加",
    authTitle: "マイページ",
    email: "メール",
    password: "パスワード",
    inviteCode: "招待コード（登録時必須）",
    login: "ログイン",
    register: "登録",
    logout: "ログアウト",
    settings: "設定",
    reset: "進捗をリセット",
    currentGuest: "未ログイン（ゲストモード）です。ログイン後、単語帳はアカウントに保存されます。",
    currentUser: (user) => `ログイン中：${user}`,
    loginSuccess: (user) => `ログインしました：${user}`,
    registerSuccess: (user) => `${user} に確認メールを送信しました。メール認証後にログインしてください。`,
    logoutSuccess: "ログアウトしました。",
    authMissing: "メールとパスワードを入力してください。",
    authMissingInvite: "登録には招待コードが必要です。",
    memberChecking: "会員状態を確認しています...",
    memberRequired: "会員アカウントでログインしてください。登録には有効な招待コードが必要です。",
    memberDenied: "このアカウントは会員ではありません。招待コードで登録してください。",
    levelLoaded: (level, count) => `${level} の単語帳を読み込みました（${count}語）。`,
    myWordsLoaded: (count) => `マイ単語を読み込みました（${count}語）。`,
    authFailed: (msg) => `操作に失敗しました：${msg}`
  },
  vi: {
    learn: "Học",
    test: "Kiểm tra",
    add: "Thêm",
    authTitle: "Tài khoản",
    email: "Email",
    password: "Mật khẩu",
    inviteCode: "Mã mời (bắt buộc khi đăng ký)",
    login: "Đăng nhập",
    register: "Đăng ký",
    logout: "Đăng xuất",
    settings: "Cài đặt",
    reset: "Đặt lại tiến độ",
    currentGuest: "Chưa đăng nhập (chế độ khách). Sau khi đăng nhập, từ vựng sẽ lưu theo tài khoản.",
    currentUser: (user) => `Đang đăng nhập: ${user}`,
    loginSuccess: (user) => `Đăng nhập thành công: ${user}`,
    registerSuccess: (user) => `Đã gửi email xác nhận đến ${user}. Vui lòng xác nhận email rồi đăng nhập.`,
    logoutSuccess: "Đã đăng xuất.",
    authMissing: "Vui lòng nhập email và mật khẩu.",
    authMissingInvite: "Cần nhập mã mời để đăng ký.",
    memberChecking: "Đang kiểm tra trạng thái thành viên...",
    memberRequired: "Vui lòng đăng nhập bằng tài khoản thành viên. Cần mã mời hợp lệ khi đăng ký.",
    memberDenied: "Tài khoản này chưa phải thành viên. Vui lòng đăng ký bằng mã mời.",
    levelLoaded: (level, count) => `Đã tải từ vựng ${level}: ${count} mục.`,
    myWordsLoaded: (count) => `Đã tải từ của tôi: ${count} mục.`,
    authFailed: (msg) => `Thao tác thất bại: ${msg}`
  },
  en: {
    learn: "Learn",
    test: "Test",
    add: "Add",
    authTitle: "Profile",
    email: "Email",
    password: "Password",
    inviteCode: "Invite code (required for sign-up)",
    login: "Log in",
    register: "Sign up",
    logout: "Log out",
    settings: "Settings",
    reset: "Reset progress",
    currentGuest: "Not signed in (guest mode). After login, vocabulary is saved to your account.",
    currentUser: (user) => `Signed in as: ${user}`,
    loginSuccess: (user) => `Logged in: ${user}`,
    registerSuccess: (user) => `A verification email was sent to ${user}. Please verify your email, then log in.`,
    logoutSuccess: "Logged out.",
    authMissing: "Please enter email and password.",
    authMissingInvite: "An invite code is required to sign up.",
    memberChecking: "Checking membership...",
    memberRequired: "Please log in with a member account. Sign-up requires a valid invite code.",
    memberDenied: "This account is not a member. Please sign up with an invite code.",
    levelLoaded: (level, count) => `Loaded ${count} ${level} words.`,
    myWordsLoaded: (count) => `Loaded ${count} of my words.`,
    authFailed: (msg) => `Action failed: ${msg}`
  }
};

const state = {
  currentPage: "learn",
  currentUser: null,
  words: [],
  learnIndex: 0,
  learnProgress: 0,
  learnSeenKeys: new Set(),
  learnHistory: [],
  learnForwardHistory: [],
  learnBubbleChainRoot: null,
  testSeenKeys: new Set(),
  testMode: "choice",
  testIndex: 0,
  testProgress: 0,
  testResult: "",
  selectedOptions: new Set(),
  isMember: false,
  membershipChecked: false,
  membershipMessage: "",
  currentLevel: MY_WORDS_SOURCE,
  selectedSources: [MY_WORDS_SOURCE],
  learnBatchStart: 0,
  testBatchStart: 0,
  learnCelebration: false,
  testCelebration: false,
  testPendingIndexes: [],
  addSearchQuery: "",
  language: "zh",
  darkMode: localStorage.getItem("nee_dark_mode") === "true"
};

const usersKey = "nee_users";
const currentUserKey = "nee_current_user";
const progressKey = "nee_progress";
const statsKey = "nee_stats";

const el = {
  progressBar: document.querySelector("#progressBar"),
  learnPage: document.querySelector("#learnPage"),
  testPage: document.querySelector("#testPage"),
  addPage: document.querySelector("#addPage"),
  tabs: document.querySelectorAll(".tab"),
  profileBtn: document.querySelector("#profileBtn"),
  settingsBtn: document.querySelector("#settingsBtn"),
  authDialog: document.querySelector("#authDialog"),
  loginBtn: document.querySelector("#loginBtn"),
  registerBtn: document.querySelector("#registerBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  authStatus: document.querySelector("#authStatus"),
  profileStats: document.querySelector("#profileStats"),
  usernameInput: document.querySelector("#usernameInput"),
  passwordInput: document.querySelector("#passwordInput"),
  inviteCodeInput: document.querySelector("#inviteCodeInput"),
  levelSwitcher: document.querySelector("#levelSwitcher"),
  authFormGrid: document.querySelector("#authDialog .form-grid"),
  authActions: document.querySelector("#authDialog .auth-actions")
};

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(usersKey) || "{}");
  } catch {
    return {};
  }
}

function writeUsers(users) {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function getSavedProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressKey) || "{}");
  } catch {
    return {};
  }
}

function getSavedStats() {
  try {
    return JSON.parse(localStorage.getItem(statsKey) || "{}");
  } catch {
    return {};
  }
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStatsOwner() {
  return state.currentUser || "__guest__";
}

function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: getLocalDateKey(date),
      label: `${date.getMonth() + 1}/${date.getDate()}`
    };
  });
}

function incrementDailyStat(field) {
  const all = getSavedStats();
  const owner = getStatsOwner();
  const day = getLocalDateKey();
  all[owner] ||= {};
  all[owner][day] ||= { learned: 0, tested: 0 };
  all[owner][day][field] = (all[owner][day][field] || 0) + 1;
  localStorage.setItem(statsKey, JSON.stringify(all));
  if (el.authDialog?.open) {
    renderProfileStats();
  }
}

function saveProgress() {
  const all = getSavedProgress();
  const owner = state.currentUser || "__guest__";
  all[owner] = {
    learnProgress: state.learnProgress,
    testProgress: state.testProgress,
    learnIndex: state.learnIndex,
    testIndex: state.testIndex,
    currentLevel: state.currentLevel,
    selectedSources: state.selectedSources,
    learnBatchStart: state.learnBatchStart,
    testBatchStart: state.testBatchStart,
    testPendingIndexes: state.testPendingIndexes
  };
  localStorage.setItem(progressKey, JSON.stringify(all));
}

function loadProgress() {
  const all = getSavedProgress();
  const owner = state.currentUser || "__guest__";
  const p = all[owner] || {};
  state.learnProgress = p.learnProgress ?? 0;
  state.testProgress = p.testProgress ?? 0;
  state.learnIndex = p.learnIndex ?? 0;
  state.testIndex = p.testIndex ?? 0;
  state.currentLevel = p.currentLevel || state.currentLevel || MY_WORDS_SOURCE;
  state.selectedSources = normalizeSelectedSources(p.selectedSources || p.currentLevel || state.currentLevel || MY_WORDS_SOURCE);
  if (!canUseApp()) {
    state.currentLevel = MY_WORDS_SOURCE;
    state.selectedSources = [MY_WORDS_SOURCE];
  }
  state.learnBatchStart = p.learnBatchStart ?? 0;
  state.testBatchStart = p.testBatchStart ?? 0;
  state.testPendingIndexes = Array.isArray(p.testPendingIndexes) ? p.testPendingIndexes : [];
  state.learnCelebration = false;
  state.testCelebration = false;
}

function canUseApp() {
  return Boolean(state.currentUser && state.isMember);
}

function canUseStudy() {
  return true;
}

async function refreshMembershipStatus() {
  const text = t();
  if (!state.currentUser) {
    state.isMember = false;
    state.membershipChecked = true;
    state.membershipMessage = text.memberRequired;
    return;
  }

  state.membershipChecked = false;
  state.membershipMessage = text.memberChecking;
  if (!supabaseClient) {
    state.isMember = false;
    state.membershipChecked = true;
    state.membershipMessage = "认证服务暂时无法加载，无法确认会员状态。";
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_my_membership");
  state.membershipChecked = true;
  if (error || !data?.is_member) {
    state.isMember = false;
    state.membershipMessage = data?.message || (error ? toChineseAuthError(error.message) : text.memberDenied);
    return;
  }

  state.isMember = true;
  state.membershipMessage = `会员账号：${state.currentUser}`;
}

async function setCurrentUser(user) {
  state.currentUser = user;
  if (user) {
    localStorage.setItem(currentUserKey, user);
  } else {
    localStorage.removeItem(currentUserKey);
  }
  await refreshMembershipStatus();
  loadProgress();
  loadWords();
  markCurrentLearnWord();
  updateLearnProgressForBatch();
  renderAll();
}

function combineKana(word) {
  if (Array.isArray(word.kanaParts)) {
    return word.kanaParts.join("");
  }
  return word.kana || "";
}

function splitKanaFallback(word) {
  if (Array.isArray(word.kanaParts) && word.kanaParts.length) {
    return [word.kanaParts[0] || "", word.kanaParts[1] || ""];
  }
  if (WORD_READING_PARTS[word.kanji]) {
    return WORD_READING_PARTS[word.kanji];
  }
  const kana = word.kana || "";
  const chars = [...word.kanji];
  if (chars.length === 2) {
    const middle = Math.ceil([...kana].length / 2);
    return [kana.slice(0, middle), kana.slice(middle)];
  }
  return [kana, ""];
}

function splitPinyinFallback(word, kanji) {
  const rawParts = Array.isArray(word.pinyinParts)
    ? word.pinyinParts.map((part) => (part || "").trim()).filter(Boolean)
    : [];
  const joined = rawParts
    .join(" ")
    .replace(/[，,、/|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const splitBySpace = joined ? joined.split(" ") : [];
  if (splitBySpace.length >= 2) {
    return [splitBySpace[0], splitBySpace[1]];
  }
  if (rawParts.length === 2) {
    return [rawParts[0], rawParts[1]];
  }
  if (rawParts.length === 1) {
    return [rawParts[0], ""];
  }
  return [...kanji].slice(0, 2).map((char) => PINYIN_BY_KANJI[char] || "");
}

function normalizeWord(word) {
  const kanji = (word.kanji || "").trim();
  const kanaParts = splitKanaFallback(word).map((part) => (part || "").trim()).slice(0, 2);
  const pinyinParts = splitPinyinFallback(word, kanji).map(normalizePinyin).slice(0, 2);
  while (kanaParts.length < 2) kanaParts.push("");
  while (pinyinParts.length < 2) pinyinParts.push("");
  return {
    kanji,
    kanaParts,
    pinyinParts,
    kana: kanaParts.join("")
  };
}

function normalizeWords(words) {
  return words.map(normalizeWord).filter((word) => word.kanji && combineKana(word));
}

function normalizeSelectedSources(value) {
  const sources = Array.isArray(value) ? value : [value];
  const normalized = sources.filter((source) => ALL_WORD_SOURCES.includes(source));
  return normalized.length ? [...new Set(normalized)] : [MY_WORDS_SOURCE];
}

function getLevelWords(level) {
  const source = window.JLPT_VOCAB?.[level] || [];
  return normalizeWords(source);
}

function isLevelSource(source) {
  return /^N[1-5]$/.test(source);
}

function isKnownLevelWords(words) {
  const normalized = normalizeWords(Array.isArray(words) ? words : []);
  if (!normalized.length) return false;
  return ["N5", "N4", "N3", "N2", "N1"].some((level) => {
    const levelWords = getLevelWords(level);
    return levelWords.length === normalized.length
      && levelWords.every((word, index) => getWordKey(word) === getWordKey(normalized[index]));
  });
}

function ensureUserAccount() {
  if (!state.currentUser) return null;
  const users = readUsers();
  const account = users[state.currentUser] || {};
  const legacyWords = Array.isArray(account.words) ? account.words : [];
  if (!Array.isArray(account.customWords)) {
    account.customWords = legacyWords.length && !isKnownLevelWords(legacyWords)
      ? normalizeWords(legacyWords)
      : normalizeWords(DEFAULT_WORDS);
  }
  if (!account.currentSource) {
    account.currentSource = MY_WORDS_SOURCE;
  }
  if (!Array.isArray(account.currentSources)) {
    account.currentSources = normalizeSelectedSources(account.currentSource);
  }
  delete account.words;
  users[state.currentUser] = account;
  writeUsers(users);
  return account;
}

function getMyWords() {
  const account = ensureUserAccount();
  return normalizeWords(account?.customWords?.length ? account.customWords : DEFAULT_WORDS);
}

function saveMyWords(words) {
  const users = readUsers();
  const account = ensureUserAccount() || {};
  account.customWords = normalizeWords(words);
  users[state.currentUser] = account;
  writeUsers(users);
}

function isWordInMyWords(word) {
  const key = getWordKey(normalizeWord(word));
  return getMyWords().some((item) => getWordKey(item) === key);
}

function favoriteWord(word) {
  if (!canUseApp() || !word) return;
  const normalized = normalizeWord(word);
  const key = getWordKey(normalized);
  const myWords = getMyWords();
  if (isWordInMyWords(normalized)) {
    saveMyWords(myWords.filter((item) => getWordKey(item) !== key));
    if (state.selectedSources.includes(MY_WORDS_SOURCE)) {
      state.words = getSelectedWords();
    }
    playBackSound();
    updateAuthStatus(`已取消收藏 ${normalized.kanji}。`);
    renderAll();
    return;
  }
  saveMyWords(myWords.concat(normalized));
  if (state.selectedSources.includes(MY_WORDS_SOURCE)) {
    state.words = getSelectedWords();
  }
  playNextSound();
  updateAuthStatus(`已收藏 ${normalized.kanji} 到“我的单词”。`);
  renderAll();
}

function saveCurrentSource() {
  if (!state.currentUser) return;
  const users = readUsers();
  const account = ensureUserAccount() || {};
  account.currentSources = normalizeSelectedSources(state.selectedSources);
  account.currentSource = account.currentSources[0] || MY_WORDS_SOURCE;
  users[state.currentUser] = account;
  writeUsers(users);
}

function getWordsForSource(source) {
  return source === MY_WORDS_SOURCE ? getMyWords() : getLevelWords(source);
}

function getSelectedWords() {
  const seen = new Set();
  return state.selectedSources.flatMap(getWordsForSource).filter((word) => {
    const key = getWordKey(word);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resetWordSession() {
  state.learnIndex = 0;
  state.testIndex = 0;
  state.learnProgress = 0;
  state.testProgress = 0;
  state.learnBatchStart = 0;
  state.testBatchStart = 0;
  state.learnSeenKeys.clear();
  state.testSeenKeys.clear();
  state.learnHistory = [];
  state.learnForwardHistory = [];
  state.learnBubbleChainRoot = null;
  state.learnCelebration = false;
  state.testCelebration = false;
  state.testPendingIndexes = [];
  initTestBatch();
  markCurrentLearnWord();
}

function loadLevelWords(level) {
  if (!canUseApp() && level !== MY_WORDS_SOURCE) {
    el.authDialog.showModal();
    updateAuthStatus(state.membershipMessage || t().memberRequired);
    return;
  }
  if (!canUseApp()) {
    state.selectedSources = [MY_WORDS_SOURCE];
    state.currentLevel = MY_WORDS_SOURCE;
    state.words = normalizeWords(DEFAULT_WORDS);
    resetWordSession();
    saveProgress();
    renderAll();
    updateAuthStatus("试用模式只能使用“我的单词”的初始词库。");
    return;
  }
  const isSelected = state.selectedSources.includes(level);
  state.selectedSources = isSelected
    ? state.selectedSources.filter((source) => source !== level)
    : [...state.selectedSources, level];
  state.selectedSources = normalizeSelectedSources(state.selectedSources);
  state.currentLevel = state.selectedSources[0] || MY_WORDS_SOURCE;
  const words = getSelectedWords();
  if (!words.length) return;
  state.words = words;
  resetWordSession();
  saveCurrentSource();
  saveProgress();
  renderAll();
  updateAuthStatus(`已选择 ${state.selectedSources.map((source) => source === MY_WORDS_SOURCE ? "我的单词" : source).join(" + ")}，共 ${words.length} 个单词。`);
}

function loadWords() {
  state.learnSeenKeys.clear();
  state.testSeenKeys.clear();
  state.learnHistory = [];
  state.learnForwardHistory = [];
  state.learnBubbleChainRoot = null;
  if (!canUseApp()) {
    state.currentLevel = MY_WORDS_SOURCE;
    state.selectedSources = [MY_WORDS_SOURCE];
    state.words = normalizeWords(DEFAULT_WORDS);
    initTestBatch();
    return;
  }
  const account = ensureUserAccount();
  state.selectedSources = normalizeSelectedSources(state.selectedSources?.length
    ? state.selectedSources
    : account?.currentSources || account?.currentSource || MY_WORDS_SOURCE);
  state.currentLevel = state.selectedSources[0] || MY_WORDS_SOURCE;
  state.words = getSelectedWords();
  initTestBatch();
}

function saveWordsForCurrentUser() {
  if (!state.currentUser || state.selectedSources.length !== 1 || state.selectedSources[0] !== MY_WORDS_SOURCE) {
    return;
  }
  saveMyWords(state.words);
}

function updateAuthStatus(msg, type = "") {
  el.authStatus.textContent = msg;
  el.authStatus.classList.toggle("success", type === "success");
  el.authStatus.classList.toggle("error", type === "error");
}

function updateAuthDialogView() {
  const isLoggedIn = Boolean(state.currentUser);
  if (el.authFormGrid) el.authFormGrid.classList.toggle("hidden", isLoggedIn);
  if (el.profileStats) el.profileStats.classList.toggle("hidden", !isLoggedIn);
  el.loginBtn.classList.toggle("hidden", isLoggedIn);
  el.registerBtn.classList.toggle("hidden", isLoggedIn);
  el.logoutBtn.classList.toggle("hidden", !isLoggedIn);
  renderProfileStats();
}

function renderProfileStats() {
  if (!el.profileStats || !state.currentUser) return;
  const all = getSavedStats();
  const ownerStats = all[getStatsOwner()] || {};
  const days = getLastSevenDays();
  const learnedValues = days.map((day) => ownerStats[day.key]?.learned || 0);
  const todayTested = ownerStats[getLocalDateKey()]?.tested || 0;
  const maxValue = Math.max(1, ...learnedValues);
  const points = learnedValues.map((value, index) => {
    const x = 18 + index * 44;
    const y = 92 - (value / maxValue) * 64;
    return `${x},${y}`;
  }).join(" ");

  el.profileStats.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">今天测试单词</div>
      <div class="stat-value">${todayTested}</div>
    </div>
    <div class="week-chart">
      <div class="chart-title">最近 7 天学习单词</div>
      <svg viewBox="0 0 300 120" role="img" aria-label="最近七天学习单词折线图">
        <polyline class="chart-grid" points="18,92 282,92"></polyline>
        <polyline class="chart-line" points="${points}"></polyline>
        ${learnedValues.map((value, index) => {
          const x = 18 + index * 44;
          const y = 92 - (value / maxValue) * 64;
          return `<circle class="chart-dot" cx="${x}" cy="${y}" r="4"><title>${days[index].label}: ${value}</title></circle>`;
        }).join("")}
      </svg>
      <div class="chart-labels">
        ${days.map((day) => `<span>${day.label}</span>`).join("")}
      </div>
    </div>
  `;
}

function t() {
  return uiText[state.language] || uiText.zh;
}

function applyLanguage() {
  const text = t();
  document.documentElement.lang = "zh-CN";
  document.querySelector("[data-page='learn']").textContent = text.learn;
  document.querySelector("[data-page='test']").textContent = text.test;
  document.querySelector("[data-page='add']").textContent = text.add;
  document.querySelector("#authDialog h3").textContent = text.authTitle;
  el.usernameInput.parentElement.childNodes[0].nodeValue = `${text.email}\n          `;
  el.passwordInput.parentElement.childNodes[0].nodeValue = `${text.password}\n          `;
  if (el.inviteCodeInput) {
    el.inviteCodeInput.parentElement.childNodes[0].nodeValue = `${text.inviteCode}\n          `;
  }
  el.loginBtn.textContent = text.login;
  el.registerBtn.textContent = text.register;
  el.logoutBtn.textContent = text.logout;
}

function applyTheme() {
  document.body.classList.toggle("dark-mode", state.darkMode);
  const icon = el.settingsBtn?.querySelector(".material-symbols-outlined");
  if (icon) {
    icon.textContent = state.darkMode ? "light_mode" : "dark_mode";
  }
  if (el.settingsBtn) {
    el.settingsBtn.title = state.darkMode ? "切换到日间模式" : "切换到夜间模式";
    el.settingsBtn.setAttribute("aria-label", el.settingsBtn.title);
  }
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!window.neeAudioContext) {
    window.neeAudioContext = new AudioContextClass();
  }
  return window.neeAudioContext;
}

function playTone(frequency, startTime, duration, type = "sine", volume = 0.06) {
  const audioContext = getAudioContext();
  if (!audioContext) return;
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const boostedVolume = Math.min(volume * 1.8, 0.16);
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(boostedVolume, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

function playNextSound() {
  const audioContext = getAudioContext();
  if (!audioContext) return;
  const now = audioContext.currentTime;
  playTone(660, now, 0.08, "triangle", 0.045);
  playTone(880, now + 0.07, 0.1, "triangle", 0.05);
}

function playBackSound() {
  const audioContext = getAudioContext();
  if (!audioContext) return;
  const now = audioContext.currentTime;
  playTone(520, now, 0.08, "triangle", 0.04);
  playTone(390, now + 0.06, 0.1, "triangle", 0.045);
}

function playErrorSound() {
  const audioContext = getAudioContext();
  if (!audioContext) return;
  const now = audioContext.currentTime;
  playTone(220, now, 0.12, "sawtooth", 0.035);
  playTone(170, now + 0.11, 0.16, "sawtooth", 0.032);
}

function playCelebrationSound() {
  const audioContext = getAudioContext();
  if (!audioContext) return;
  const now = audioContext.currentTime;
  [523, 659, 784, 1046].forEach((frequency, index) => {
    playTone(frequency, now + index * 0.09, 0.13, "sine", 0.055);
  });
}

function isComposingKeyEvent(e) {
  return e.isComposing || e.keyCode === 229 || e.key === "Process";
}

function initDashes() {
  el.progressBar.innerHTML = "";
  for (let i = 0; i < 20; i += 1) {
    const s = document.createElement("span");
    el.progressBar.appendChild(s);
  }
}

function renderProgress() {
  const value = state.currentPage === "learn" ? state.learnProgress : state.testProgress;
  const dashes = [...el.progressBar.children];
  const activeCount = Math.round((value / 100) * dashes.length);
  dashes.forEach((dash, idx) => {
    dash.classList.toggle("active", idx < activeCount);
  });
}

function getBatchEnd(start = state.learnBatchStart) {
  return Math.min(start + BATCH_SIZE, state.words.length);
}

function getBatchIndexes(start = state.learnBatchStart) {
  return state.words
    .map((_, index) => index)
    .slice(start, getBatchEnd(start));
}

function getCompletedCountForBatch(start) {
  return Math.min(start + BATCH_SIZE, state.words.length);
}

function updateLearnProgressForBatch() {
  const batchIndexes = getBatchIndexes(state.learnBatchStart);
  const learnedCount = batchIndexes.filter((index) => {
    const word = state.words[index];
    return word && state.learnSeenKeys.has(getWordKey(word));
  }).length;
  state.learnProgress = batchIndexes.length
    ? Math.round((learnedCount / batchIndexes.length) * 100)
    : 0;
}

function initTestBatch() {
  const batchIndexes = getBatchIndexes(state.testBatchStart);
  const validPending = state.testPendingIndexes.filter((index) => batchIndexes.includes(index));
  state.testPendingIndexes = validPending.length ? validPending : [...batchIndexes];
  state.testIndex = state.testPendingIndexes[0] ?? state.testBatchStart;
  updateTestProgressForBatch();
}

function updateTestProgressForBatch() {
  const batchIndexes = getBatchIndexes(state.testBatchStart);
  const passedCount = batchIndexes.length - state.testPendingIndexes.length;
  state.testProgress = batchIndexes.length
    ? Math.round((passedCount / batchIndexes.length) * 100)
    : 0;
}

function isLearnBatchComplete() {
  const batchIndexes = getBatchIndexes(state.learnBatchStart);
  return batchIndexes.length > 0 && batchIndexes.every((index) => {
    const word = state.words[index];
    return word && state.learnSeenKeys.has(getWordKey(word));
  });
}

function renderCelebrationPage(type) {
  const isLearn = type === "learn";
  const start = isLearn ? state.learnBatchStart : state.testBatchStart;
  const completed = getCompletedCountForBatch(start);
  const total = state.words.length;
  const label = isLearn ? "学习" : "测试";
  const hasNextBatch = completed < total;
  return `
    <div class="celebration-page">
      <div class="fireworks" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="trophy" aria-hidden="true">🏆</div>
      <h3>恭喜完成本轮${label}！</h3>
      <p>恭喜您已${label}${completed}/${total}个。</p>
      <button class="continue-batch-btn" data-celebration="${type}" type="button">
        ${hasNextBatch ? "继续下一组" : "重新开始"}
      </button>
    </div>
  `;
}

function bindCelebrationButtons() {
  document.querySelectorAll("[data-celebration]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.celebration === "learn") {
        continueLearnAfterCelebration();
        return;
      }
      continueTestAfterCelebration();
    });
  });
}

function renderMemberGate() {
  const message = state.membershipChecked
    ? (state.membershipMessage || t().memberRequired)
    : t().memberChecking;
  return `
    <div class="member-gate">
      <div class="member-gate-card">
        <h3>会员专用</h3>
        <p>${escapeHtml(message)}</p>
        <button class="open-auth-btn" type="button">登录 / 注册会员</button>
      </div>
    </div>
  `;
}

function bindMemberGateButtons() {
  document.querySelectorAll(".open-auth-btn").forEach((button) => {
    button.addEventListener("click", () => {
      updateAuthStatus(state.membershipMessage || t().memberRequired);
      el.authDialog.showModal();
    });
  });
}

function getCurrentWord() {
  if (!state.words.length) {
    return null;
  }
  const batchIndexes = getBatchIndexes(state.learnBatchStart);
  if (!batchIndexes.includes(state.learnIndex)) {
    state.learnIndex = batchIndexes[0] ?? 0;
  }
  if (state.learnIndex >= state.words.length) {
    state.learnIndex = state.learnBatchStart;
  }
  return state.words[state.learnIndex];
}

function getWordKey(word) {
  return `${word.kanji}::${combineKana(word)}`;
}

function markCurrentLearnWord() {
  const word = getCurrentWord();
  if (word) {
    state.learnSeenKeys.add(getWordKey(word));
    updateLearnProgressForBatch();
  }
}

function getRandomIndexFromPool(indexes) {
  return indexes[Math.floor(Math.random() * indexes.length)];
}

function getUnseenIndexes(seenKeys, excludeIndex = -1) {
  return getBatchIndexes(state.learnBatchStart)
    .map((index) => ({ word: state.words[index], index }))
    .filter(({ word, index }) => index !== excludeIndex && !seenKeys.has(getWordKey(word)))
    .map(({ index }) => index);
}

function advanceLearnProgress() {
  updateLearnProgressForBatch();
}

function findNextUnseenLearnIndex(direction = 1) {
  if (!state.words.length) return 0;
  const unseenIndexes = getUnseenIndexes(state.learnSeenKeys, state.learnIndex);
  if (unseenIndexes.length) {
    return getRandomIndexFromPool(unseenIndexes);
  }
  state.learnCelebration = true;
  return state.learnIndex;
}

function visitLearnIndex(index, shouldAdvanceProgress = true, shouldRecordHistory = true, shouldClearForwardHistory = true) {
  if (!state.words.length) return;
  if (!getBatchIndexes(state.learnBatchStart).includes(index)) {
    state.learnBatchStart = Math.floor(index / BATCH_SIZE) * BATCH_SIZE;
    state.learnSeenKeys.clear();
    state.learnHistory = [];
    state.learnForwardHistory = [];
    state.learnBubbleChainRoot = null;
    state.learnCelebration = false;
  }
  const previousIndex = state.learnIndex;
  state.learnIndex = (index + state.words.length) % state.words.length;
  if (shouldRecordHistory && previousIndex !== state.learnIndex) {
    state.learnHistory.push(previousIndex);
  }
  if (shouldClearForwardHistory && previousIndex !== state.learnIndex) {
    state.learnForwardHistory = [];
  }
  const word = getCurrentWord();
  const key = getWordKey(word);
  const wasSeen = state.learnSeenKeys.has(key);
  state.learnSeenKeys.add(key);
  if (shouldAdvanceProgress && !wasSeen) {
    incrementDailyStat("learned");
    advanceLearnProgress();
  }
  if (isLearnBatchComplete()) {
    state.learnCelebration = true;
    playCelebrationSound();
  }
  saveProgress();
  renderAll();
}

function rotateLearnWord(direction = 1) {
  if (state.learnCelebration) return;
  state.learnBubbleChainRoot = null;
  if (direction > 0) {
    playNextSound();
  }
  if (direction > 0 && state.learnForwardHistory.length) {
    const forwardIndex = state.learnForwardHistory.pop();
    visitLearnIndex(forwardIndex, true, true, false);
    return;
  }
  const index = findNextUnseenLearnIndex(direction);
  visitLearnIndex(index);
}

function goBackLearnWord() {
  const previousIndex = state.learnHistory.pop();
  if (previousIndex === undefined) return;
  playBackSound();
  state.learnBubbleChainRoot = null;
  state.learnForwardHistory.push(state.learnIndex);
  visitLearnIndex(previousIndex, false, false, false);
}

function jumpToBubbleWord(index) {
  if (index === state.learnIndex) return;
  const rootIndex = state.learnBubbleChainRoot ?? state.learnIndex;
  playNextSound();
  visitLearnIndex(index, true, false);
  state.learnBubbleChainRoot = rootIndex;
  state.learnHistory = [rootIndex];
  saveProgress();
}

function resetLearnToStart() {
  state.learnBatchStart = 0;
  state.learnIndex = state.learnBatchStart;
  state.learnProgress = 0;
  state.learnSeenKeys.clear();
  state.learnHistory = [];
  state.learnForwardHistory = [];
  state.learnBubbleChainRoot = null;
  state.learnCelebration = false;
  markCurrentLearnWord();
  updateLearnProgressForBatch();
  saveProgress();
  renderAll();
}

function continueLearnAfterCelebration() {
  const nextStart = state.learnBatchStart + BATCH_SIZE;
  state.learnBatchStart = nextStart < state.words.length ? nextStart : 0;
  state.learnIndex = state.learnBatchStart;
  state.learnSeenKeys.clear();
  state.learnHistory = [];
  state.learnForwardHistory = [];
  state.learnBubbleChainRoot = null;
  state.learnCelebration = false;
  markCurrentLearnWord();
  updateLearnProgressForBatch();
  saveProgress();
  renderAll();
}

function getRelatedWords(mainWord) {
  const leftChar = mainWord.kanji[0];
  const rightChar = mainWord.kanji[1];
  const leftWords = state.words
    .filter((w) => w.kanji !== mainWord.kanji && w.kanji.includes(leftChar))
    .slice(0, 2);
  const rightWords = state.words
    .filter((w) => w.kanji !== mainWord.kanji && w.kanji.includes(rightChar))
    .slice(0, 2);
  return { leftWords, rightWords };
}

function getPinyinForWordChar(word, index) {
  const char = [...word.kanji][index];
  return (word.pinyinParts && word.pinyinParts[index]) || PINYIN_BY_KANJI[char] || "";
}

function normalizePinyin(pinyin) {
  return String(pinyin || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ü/g, "v")
    .replace(/[^a-z]/g, "");
}

function getPinyinRulesForPinyin(pinyin) {
  const normalized = normalizePinyin(pinyin);
  const rules = [];
  if (normalized.includes("ng")) rules.push({ type: "long", text: "・〜ng → 長音" });
  if (normalized.includes("ao")) rules.push({ type: "long", text: "・〜ao → 長音" });
  if (normalized.includes("ou")) rules.push({ type: "long", text: "・〜ou → 長音" });
  if (normalized.includes("iu")) rules.push({ type: "long", text: "・〜iu → 長音" });
  if (normalized.endsWith("n") && !normalized.endsWith("ng")) {
    rules.push({ type: "n", text: "・〜n → ん结尾" });
  }
  return rules;
}

function getPinyinRules(char) {
  return getPinyinRulesForPinyin(PINYIN_BY_KANJI[char] || "");
}

function getReadingParts(word) {
  return splitKanaFallback(word);
}

function getKanaColorClass(char, index, word, mainWord) {
  if (getWordKey(word) === getWordKey(mainWord)) {
    return getPinyinRulesForPinyin(getPinyinForWordChar(word, index)).length
      ? (index === 0 ? "kana-red" : "kana-blue")
      : "";
  }
  if (char === mainWord.kanji[0] && getPinyinRulesForPinyin(getPinyinForWordChar(mainWord, 0)).length) {
    return "kana-red";
  }
  if (char === mainWord.kanji[1] && getPinyinRulesForPinyin(getPinyinForWordChar(mainWord, 1)).length) {
    return "kana-blue";
  }
  return "";
}

function renderKanaParts(word, mainWord = word) {
  const chars = [...word.kanji];
  const parts = getReadingParts(word);
  return parts.map((part, index) => {
    const cls = getKanaColorClass(chars[index], index, word, mainWord);
    return `<span class="reading-part ${cls}">${part}</span>`;
  }).join("");
}

function renderRuleLines(word) {
  const chars = [...word.kanji].slice(0, 2);
  return chars.flatMap((char, index) => {
    const sideClass = index === 0 ? "rule-red" : "rule-blue";
    return getPinyinRulesForPinyin(getPinyinForWordChar(word, index))
      .map((rule) => `<div class="${sideClass}">${rule.text}</div>`);
  }).join("");
}

function renderSideBubble(word, positionClass, mainWord) {
  if (!word) {
    return "";
  }

  const index = state.words.findIndex((item) => getWordKey(item) === getWordKey(word));
  return `
    <button class="bubble bubble-side ${positionClass}" data-learn-index="${index}" title="点击跳转到 ${word.kanji}">
      <div class="kana-row small">${renderKanaParts(word, mainWord)}</div>
      <div class="kanji-side">${word.kanji}</div>
    </button>
  `;
}

function renderLearnPage() {
  if (!canUseStudy()) {
    el.learnPage.innerHTML = renderMemberGate();
    return;
  }
  if (state.learnCelebration) {
    el.learnPage.innerHTML = renderCelebrationPage("learn");
    return;
  }
  const current = getCurrentWord();
  if (!current) {
    el.learnPage.innerHTML = "<p>词库为空，请先到添加页新增单词。</p>";
    return;
  }
  const { leftWords, rightWords } = getRelatedWords(current);
  const leftTop = leftWords[0];
  const leftBottom = leftWords[1];
  const rightTop = rightWords[0];
  const rightBottom = rightWords[1];
  const isFavorite = isWordInMyWords(current);

  el.learnPage.innerHTML = `
    <div class="learn-layout">
      <button
        id="favoriteWordBtn"
        class="favorite-word-btn ${isFavorite ? "active" : ""}"
        type="button"
        aria-label="${isFavorite ? "已收藏" : "收藏到我的单词"}"
        title="${isFavorite ? "已收藏到我的单词" : "收藏到我的单词"}"
      >★</button>

      <div id="mainBubble" class="bubble bubble-main">
        <div class="kana-row">${renderKanaParts(current)}</div>
        <div class="kanji-main">${current.kanji}</div>
        <div class="explain">${renderRuleLines(current)}</div>
      </div>

      ${renderSideBubble(leftTop, "left-top", current)}
      ${renderSideBubble(leftBottom, "left-bottom", current)}
      ${renderSideBubble(rightTop, "right-top", current)}
      ${renderSideBubble(rightBottom, "right-bottom", current)}

      <div class="learn-nav">
        <button id="prevLearnBtn" class="learn-nav-btn">上一个</button>
        <button id="resetLearnBtn" class="learn-nav-btn secondary">返回最开始</button>
        <button id="nextLearnBtn" class="learn-nav-btn">下一个</button>
      </div>
    </div>
  `;

  const mainBubble = document.querySelector("#mainBubble");
  mainBubble.title = "中心学习词";

  document.querySelector("#nextLearnBtn").addEventListener("click", () => {
    rotateLearnWord(1);
  });
  document.querySelector("#prevLearnBtn").addEventListener("click", () => {
    goBackLearnWord();
  });
  document.querySelector("#resetLearnBtn").addEventListener("click", resetLearnToStart);
  document.querySelector("#favoriteWordBtn").addEventListener("click", () => {
    favoriteWord(current);
  });

  [...document.querySelectorAll("[data-learn-index]")].forEach((bubble) => {
    bubble.addEventListener("click", () => {
      jumpToBubbleWord(Number(bubble.dataset.learnIndex));
    });
  });
}

function getCurrentTestWord() {
  if (!state.words.length) return null;
  if (!state.testPendingIndexes.length) {
    initTestBatch();
  }
  if (!state.testPendingIndexes.includes(state.testIndex)) {
    state.testIndex = state.testPendingIndexes[0] ?? state.testBatchStart;
  }
  if (state.testIndex >= state.words.length) state.testIndex = state.testBatchStart;
  return state.words[state.testIndex];
}

function findNextRandomTestIndex(excludeIndex = -1) {
  if (!state.words.length) return 0;
  if (!state.testPendingIndexes.length) {
    return state.testBatchStart;
  }
  const pool = state.testPendingIndexes.filter((index) => index !== excludeIndex);
  return getRandomIndexFromPool(pool.length ? pool : state.testPendingIndexes);
}

function getChoiceOptions(correctKana) {
  const all = [...new Set(state.words.map((w) => combineKana(w)))];
  const pool = all.filter((k) => k !== correctKana);
  while (pool.length < 3) pool.push(`${correctKana.slice(0, -1)}ん`);
  const selected = [];
  while (selected.length < 3 && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(i, 1)[0]);
  }
  selected.push(correctKana);
  return selected.sort(() => Math.random() - 0.5);
}

function nextTest(isCorrect = true) {
  const currentIndex = state.testIndex;
  if (isCorrect) {
    incrementDailyStat("tested");
    state.testPendingIndexes = state.testPendingIndexes.filter((index) => index !== currentIndex);
  } else {
    state.testPendingIndexes = state.testPendingIndexes
      .filter((index) => index !== currentIndex)
      .concat(currentIndex);
  }
  updateTestProgressForBatch();
  if (!state.testPendingIndexes.length) {
    state.testCelebration = true;
    playCelebrationSound();
    state.testResult = "";
    state.selectedOptions.clear();
    saveProgress();
    renderAll();
    return;
  }
  state.testIndex = findNextRandomTestIndex(isCorrect ? -1 : currentIndex);
  if (isCorrect) {
    playNextSound();
  }
  state.testResult = "";
  state.selectedOptions.clear();
  saveProgress();
  renderAll();
}

function continueTestAfterCelebration() {
  const nextStart = state.testBatchStart + BATCH_SIZE;
  state.testBatchStart = nextStart < state.words.length ? nextStart : 0;
  state.testCelebration = false;
  state.testPendingIndexes = [];
  initTestBatch();
  saveProgress();
  renderAll();
}

function renderTestPage() {
  if (!canUseStudy()) {
    el.testPage.innerHTML = renderMemberGate();
    return;
  }
  if (state.testCelebration) {
    el.testPage.innerHTML = renderCelebrationPage("test");
    return;
  }
  const word = getCurrentTestWord();
  if (!word) {
    el.testPage.innerHTML = "<p>词库为空，请先添加单词。</p>";
    return;
  }
  const isChoice = state.testMode === "choice";
  const correctKana = combineKana(word);
  const options = getChoiceOptions(correctKana);
  const modeText = isChoice ? "切换到输入模式" : "切换到选择题模式";

  el.testPage.innerHTML = `
    <div class="test-wrap">
      <div class="test-head">
        <h3 class="test-title">测试页面（${isChoice ? "选择题" : "输入题"}）</h3>
        <button id="switchModeBtn" class="switch-btn">${modeText}</button>
      </div>
      <div class="question-kanji">${word.kanji}</div>
      ${isChoice ? `
        <div class="options">
          ${options.map((op) => `<button class="option" data-kana="${op}">${op}</button>`).join("")}
        </div>
        <div class="result-line">${state.testResult}</div>
      ` : `
        <div class="input-mode">
          <div class="input-row">
            <input id="kanaInput" placeholder="输入假名..." />
            <button id="confirmInputBtn" class="confirm-btn">确认</button>
          </div>
          <div class="result-line">${state.testResult}</div>
        </div>
      `}
    </div>
  `;

  document.querySelector("#switchModeBtn").addEventListener("click", () => {
    state.testMode = isChoice ? "input" : "choice";
    state.testResult = "";
    renderAll();
  });

  if (isChoice) {
    [...document.querySelectorAll(".option")].forEach((btn) => {
      btn.addEventListener("click", () => {
        const selected = btn.dataset.kana;
        const allBtns = [...document.querySelectorAll(".option")];
        allBtns.forEach((b) => {
          if (b.dataset.kana === correctKana) b.classList.add("correct");
          if (b === btn && selected !== correctKana) b.classList.add("wrong");
          b.disabled = true;
        });
        const isCorrect = selected === correctKana;
        state.testResult = isCorrect ? "回答正确，已进入下一题。" : `回答错误，正确答案：${correctKana}。本轮会再次出现。`;
        if (!isCorrect) {
          playErrorSound();
        }
        setTimeout(() => nextTest(isCorrect), 700);
      });
    });
    return;
  }

  const input = document.querySelector("#kanaInput");
  const confirm = () => {
    const val = input.value.trim();
    if (!val) return;
    if (val === correctKana) {
      state.testResult = "回答正确，已进入下一题。";
      renderAll();
      setTimeout(() => nextTest(true), 700);
    } else {
      state.testResult = `回答错误，正确答案：${correctKana}。本轮会再次出现。`;
      playErrorSound();
      renderAll();
      setTimeout(() => nextTest(false), 900);
    }
  };

  document.querySelector("#confirmInputBtn").addEventListener("click", confirm);
  input.addEventListener("keydown", (e) => {
    if (isComposingKeyEvent(e)) return;
    if (e.key === "Enter") {
      e.preventDefault();
      confirm();
    }
  });
  input.focus();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function matchesAddSearch(word, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  const normalized = normalizeWord(word);
  const haystack = [
    normalized.kanji,
    ...normalized.kanaParts,
    ...normalized.pinyinParts,
    combineKana(normalized)
  ].join(" ").toLowerCase();
  return haystack.includes(normalizedQuery);
}

function renderAddPage() {
  if (!canUseApp()) {
    el.addPage.innerHTML = renderMemberGate();
    return;
  }
  const myWords = getMyWords();
  const filteredWords = myWords
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => matchesAddSearch(word, state.addSearchQuery));
  el.addPage.innerHTML = `
    <div class="add-wrap">
      <h3 class="add-title">添加我的单词</h3>
      <div class="add-box">
        <div class="add-inputs">
          <input id="newKanji" maxlength="2" placeholder="汉字（如 重心）" />
          <input id="newKana1" placeholder="第一个字的假名（如 じゅう）" />
          <input id="newKana2" placeholder="第二个字的假名（如 しん）" />
          <input id="newPinyin1" placeholder="第一个字的拼音（如 zhong）" />
          <input id="newPinyin2" placeholder="第二个字的拼音（如 xin）" />
          <button id="addWordBtn" class="add-word-btn" type="button">添加</button>
        </div>
      </div>
      <div class="bulk-box">
        <textarea id="bulkImportInput" placeholder="从 Excel 复制五列后粘贴到这里：汉字、第一个字假名、第二个字假名、第一个字拼音、第二个字拼音"></textarea>
        <button id="bulkImportBtn" class="add-word-btn" type="button">批量添加</button>
      </div>
      <input
        id="myWordsSearch"
        class="my-words-search"
        type="search"
        placeholder="搜索我的单词（汉字 / 假名 / 拼音）"
        value="${escapeHtml(state.addSearchQuery)}"
      />
      <div class="word-table-wrap">
        <table>
          <thead>
            <tr>
              <th>汉字</th>
              <th>第一个字的假名</th>
              <th>第二个字的假名</th>
              <th>第一个字的拼音</th>
              <th>第二个字的拼音</th>
              <th>删除</th>
            </tr>
          </thead>
          <tbody>
            ${filteredWords.map(({ word: w, index }) => {
              const normalized = normalizeWord(w);
              return `
                <tr data-word-row="${index}">
                  <td><input data-field="kanji" maxlength="2" value="${escapeHtml(normalized.kanji)}" /></td>
                  <td><input data-field="kana1" value="${escapeHtml(normalized.kanaParts[0])}" /></td>
                  <td><input data-field="kana2" value="${escapeHtml(normalized.kanaParts[1])}" /></td>
                  <td><input data-field="pinyin1" value="${escapeHtml(normalized.pinyinParts[0])}" /></td>
                  <td><input data-field="pinyin2" value="${escapeHtml(normalized.pinyinParts[1])}" /></td>
                  <td class="table-actions">
                    <button class="delete-row-btn" data-delete-index="${index}" type="button">删除</button>
                  </td>
                </tr>
              `;
            }).join("")}
            ${filteredWords.length ? "" : `
              <tr>
                <td colspan="6" class="empty-row">没有找到匹配的单词</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const kanjiInput = document.querySelector("#newKanji");
  const kana1Input = document.querySelector("#newKana1");
  const kana2Input = document.querySelector("#newKana2");
  const pinyin1Input = document.querySelector("#newPinyin1");
  const pinyin2Input = document.querySelector("#newPinyin2");
  const bulkInput = document.querySelector("#bulkImportInput");
  const searchInput = document.querySelector("#myWordsSearch");
  const submit = () => {
    const kanji = kanjiInput.value.trim();
    const kana1 = kana1Input.value.trim();
    const kana2 = kana2Input.value.trim();
    const pinyin1 = pinyin1Input.value.trim();
    const pinyin2 = pinyin2Input.value.trim();
    if (!kanji || !kana1 || !kana2) return;
    const nextWord = normalizeWord({
      kanji,
      kanaParts: [kana1, kana2],
      pinyinParts: [pinyin1, pinyin2]
    });
    const nextWords = getMyWords().concat(nextWord);
    saveMyWords(nextWords);
    if (state.selectedSources.includes(MY_WORDS_SOURCE)) {
      state.words = getSelectedWords();
      resetWordSession();
    }
    renderAll();
  };

  const importBulkWords = () => {
    const rows = bulkInput.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const imported = rows.map((line) => {
      const columns = line.includes("\t")
        ? line.split("\t")
        : line.includes(",")
          ? line.split(",")
          : line.split(/\s+/);
      const [kanji, kana1, kana2, pinyin1, pinyin2] = columns.map((value) => (value || "").trim());
      return normalizeWord({
        kanji,
        kanaParts: [kana1, kana2],
        pinyinParts: [pinyin1, pinyin2]
      });
    }).filter((word) => word.kanji && word.kanaParts[0] && word.kanaParts[1]);

    if (!imported.length) return;
    const nextWords = getMyWords().concat(imported);
    saveMyWords(nextWords);
    if (state.selectedSources.includes(MY_WORDS_SOURCE)) {
      state.words = getSelectedWords();
      resetWordSession();
    }
    renderAll();
  };

  document.querySelector("#addWordBtn").addEventListener("click", submit);
  document.querySelector("#bulkImportBtn").addEventListener("click", importBulkWords);
  searchInput.addEventListener("input", () => {
    state.addSearchQuery = searchInput.value;
    renderAddPage();
    document.querySelector("#myWordsSearch")?.focus();
  });
  [kanjiInput, kana1Input, kana2Input, pinyin1Input, pinyin2Input].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (isComposingKeyEvent(e)) return;
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    });
  });

  const updateWordFromRow = (row, shouldRenderAll = false) => {
      const index = Number(row.dataset.wordRow);
      const value = (field) => row.querySelector(`[data-field="${field}"]`).value.trim();
      const nextWord = normalizeWord({
        kanji: value("kanji"),
        kanaParts: [value("kana1"), value("kana2")],
        pinyinParts: [value("pinyin1"), value("pinyin2")]
      });
      if (!nextWord.kanji || !nextWord.kanaParts[0] || !nextWord.kanaParts[1]) return;
      const nextWords = getMyWords();
      nextWords[index] = nextWord;
      saveMyWords(nextWords);
      if (state.selectedSources.includes(MY_WORDS_SOURCE)) {
        state.words = getSelectedWords();
        resetWordSession();
      }
    if (shouldRenderAll) {
        renderAll();
      return;
    }
    renderLearnPage();
    renderTestPage();
  };

  [...document.querySelectorAll("[data-word-row] input")].forEach((input) => {
    input.addEventListener("change", () => {
      updateWordFromRow(input.closest("[data-word-row]"));
    });

    input.addEventListener("keydown", (e) => {
      if (isComposingKeyEvent(e)) return;
      if (e.key === "Enter") {
        e.preventDefault();
        updateWordFromRow(input.closest("[data-word-row]"), true);
      }
    });
  });

  [...document.querySelectorAll("[data-delete-index]")].forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.deleteIndex);
      const nextWords = getMyWords();
      nextWords.splice(index, 1);
      saveMyWords(nextWords);
      if (state.selectedSources.includes(MY_WORDS_SOURCE)) {
        state.words = getSelectedWords();
        resetWordSession();
      }
      renderAll();
    });
  });
}

function switchPage(page) {
  state.currentPage = page;
  el.learnPage.classList.toggle("hidden", page !== "learn");
  el.testPage.classList.toggle("hidden", page !== "test");
  el.addPage.classList.toggle("hidden", page !== "add");
  el.progressBar.classList.toggle("hidden", page === "add");
  el.tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.page === page);
  });
  renderProgress();
}

function updateLevelSwitcher() {
  if (!el.levelSwitcher) return;
  el.levelSwitcher.querySelectorAll("[data-level]").forEach((button) => {
    const isLocked = !canUseApp() && button.dataset.level !== MY_WORDS_SOURCE;
    const isActive = state.selectedSources.includes(button.dataset.level);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.disabled = isLocked;
  });
}

function renderAll() {
  renderLearnPage();
  renderTestPage();
  renderAddPage();
  switchPage(state.currentPage);
  bindMemberGateButtons();
  bindCelebrationButtons();
  updateLevelSwitcher();
  saveProgress();
}

function setupTabs() {
  el.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchPage(tab.dataset.page);
    });
  });
}

function setupLevelSwitcher() {
  if (!el.levelSwitcher) return;
  el.levelSwitcher.querySelectorAll("[data-level]").forEach((button) => {
    button.addEventListener("click", () => loadLevelWords(button.dataset.level));
  });
}

function setupAuth() {
  el.profileBtn.addEventListener("click", () => {
    const text = t();
    updateAuthDialogView();
    updateAuthStatus(state.currentUser
      ? `${text.currentUser(state.currentUser)}${canUseApp() ? "（会员）" : `。${state.membershipMessage}`}`
      : text.memberRequired);
    el.authDialog.showModal();
  });

  el.loginBtn.addEventListener("click", async () => {
    const text = t();
    const email = el.usernameInput.value.trim();
    const password = el.passwordInput.value.trim();
    if (!email || !password) {
      updateAuthStatus(text.authMissing);
      return;
    }
    if (!supabaseClient) {
      updateAuthStatus(text.authFailed("认证服务暂时无法加载"));
      return;
    }
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      updateAuthStatus(text.authFailed(error.message));
      return;
    }
    const userEmail = data.user?.email || email;
    await setCurrentUser(userEmail);
    updateAuthDialogView();
    updateAuthStatus(canUseApp()
      ? `${text.currentUser(userEmail)}（会员）`
      : state.membershipMessage);
  });

  el.registerBtn.addEventListener("click", async () => {
    const text = t();
    const email = el.usernameInput.value.trim();
    const password = el.passwordInput.value.trim();
    const inviteCode = el.inviteCodeInput?.value.trim();
    if (!email || !password) {
      updateAuthStatus(text.authMissing);
      return;
    }
    if (!inviteCode) {
      updateAuthStatus(text.authMissingInvite);
      return;
    }
    if (!supabaseClient) {
      updateAuthStatus(text.authFailed("认证服务暂时无法加载"));
      return;
    }
    const { data: inviteData, error: inviteError } = await supabaseClient.rpc("claim_invite_code", {
      p_code: inviteCode,
      p_email: email
    });
    if (inviteError || !inviteData?.ok) {
      updateAuthStatus(text.authFailed(inviteData?.message || inviteError?.message || "邀请码验证失败"));
      return;
    }
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: AUTH_REDIRECT_URL,
        data: {
          invite_code: inviteCode
        }
      }
    });
    if (error) {
      updateAuthStatus(text.authFailed(error.message));
      return;
    }
    const userEmail = data.user?.email || email;
    const users = readUsers();
    if (!users[userEmail]) {
      users[userEmail] = { password: "", words: normalizeWords(DEFAULT_WORDS) };
      writeUsers(users);
    }
    updateAuthStatus(text.registerSuccess(userEmail), "success");
  });

  el.logoutBtn.addEventListener("click", async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    await setCurrentUser(null);
    updateAuthDialogView();
    updateAuthStatus(t().logoutSuccess);
  });

}

function setupSettings() {
  el.settingsBtn.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
    localStorage.setItem("nee_dark_mode", String(state.darkMode));
    applyTheme();
  });
}

function setupDialogCloseButtons() {
  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(`#${button.dataset.closeDialog}`)?.close();
    });
  });
}

function setupLearnKeyboardControls() {
  document.addEventListener("keydown", (e) => {
    const target = e.target;
    const isTyping = target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
    if (state.currentPage !== "learn" || isTyping || document.querySelector("dialog[open]")) {
      return;
    }
    if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
      e.preventDefault();
      rotateLearnWord(1);
    }
    if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      goBackLearnWord();
    }
  });
}

async function boot() {
  initDashes();
  let remembered = localStorage.getItem(currentUserKey);
  if (supabaseClient) {
    const { data } = await supabaseClient.auth.getSession();
    remembered = data.session?.user?.email || remembered;
  }
  state.currentUser = remembered || null;
  await refreshMembershipStatus();
  loadProgress();
  loadWords();
  markCurrentLearnWord();
  updateLearnProgressForBatch();
  setupTabs();
  setupLevelSwitcher();
  setupAuth();
  setupSettings();
  setupDialogCloseButtons();
  setupLearnKeyboardControls();
  applyLanguage();
  applyTheme();
  updateAuthDialogView();
  renderAll();
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      const email = session?.user?.email || null;
      if (email !== state.currentUser) {
        await setCurrentUser(email);
      }
    });
  }
}

boot();
