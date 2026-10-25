// -------------------------------------------------------------
// 1. GITHUB REPO AUDIO + MECHANICAL TYPING HAPTIC ENGINE
// -------------------------------------------------------------
let soundEnabled = true;
let lastHoverTime = 0;
let audioContext = null;

// Aapke GitHub Repo ke Direct Audio Links
const gtaAudioUrls = {
  hover: "https://raw.githubusercontent.com/Devilofdarkz/Pocket-Log/main/hover.mp3",
  click: "https://raw.githubusercontent.com/Devilofdarkz/Pocket-Log/main/click.mp3",
  income: "https://raw.githubusercontent.com/Devilofdarkz/Pocket-Log/main/credited.mp3",
  wasted: "https://raw.githubusercontent.com/Devilofdarkz/Pocket-Log/main/sounds_gta5-wasted.mp3",
  ahShit: "https://raw.githubusercontent.com/Devilofdarkz/Pocket-Log/main/language%20switch-ah-shit-here-we-go-again.mp3"
};

// Pre-load sounds
const soundBank = {
  hover: new Audio(gtaAudioUrls.hover),
  click: new Audio(gtaAudioUrls.click),
  income: new Audio(gtaAudioUrls.income),
  wasted: new Audio(gtaAudioUrls.wasted),
  ahShit: new Audio(gtaAudioUrls.ahShit)
};

soundBank.hover.volume = 0.4;
soundBank.click.volume = 0.6;
soundBank.income.volume = 0.85;
soundBank.wasted.volume = 0.75;
soundBank.ahShit.volume = 0.9;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// User first click unlock
window.addEventListener('click', () => {
  getAudioContext();
}, { once: true });

// ⌨️ ULTRA-SATISFYING MECHANICAL TYPING & HAPTIC FEEDBACK
function playTypingSound(key) {
  if (!soundEnabled) return;

  // Real Mobile Haptic Vibration Feedback
  if (navigator.vibrate) {
    try { navigator.vibrate(8); } catch (e) {}
  }

  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;

    // Pitch variation for real tactile feel
    const pitchJitter = (Math.random() - 0.5) * 70;
    const isBackspace = (key === 'Backspace' || key === 'Delete');
    const isSpace = (key === ' ');
    const baseFreq = isBackspace ? 440 : (isSpace ? 560 : 880);

    // Mechanical Click Transient
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isBackspace ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(baseFreq + pitchJitter, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.025);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);

    // Mechanical Switch Body Noise
    const bufferSize = Math.floor(ctx.sampleRate * 0.015);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);
  } catch (e) {}
}

// Fast GTA Audio Player
function playGtaSound(type) {
  if (!soundEnabled) return;

  if (type === 'hover') {
    const now = Date.now();
    if (now - lastHoverTime < 50) return;
    lastHoverTime = now;
  }

  try {
    const baseAudio = soundBank[type];
    if (baseAudio) {
      const soundClone = baseAudio.cloneNode();
      soundClone.volume = baseAudio.volume;
      soundClone.play().catch(() => {});
    }
  } catch (err) {}
}

// Subtitle Box for CJ
function showGtaSubtitle(text) {
  let sub = document.getElementById("gta-subtitle");
  if (!sub) {
    sub = document.createElement("div");
    sub.id = "gta-subtitle";
    sub.className = "gta-subtitle";
    document.body.appendChild(sub);
  }
  sub.innerHTML = `<span class="cj-tag">[ CJ ]</span>: ${text}`;
  sub.classList.add("show");

  setTimeout(() => {
    sub.classList.remove("show");
  }, 2600);
}

// Bind hover, click and typing sounds
function attachSoundEffects() {
  const hoverEls = document.querySelectorAll(
    'button, select, input, .radio-label, .card, .transaction-item, .delete-btn'
  );
  hoverEls.forEach(el => {
    el.removeEventListener('mouseenter', handleHover);
    el.addEventListener('mouseenter', handleHover);
  });

  const clickEls = document.querySelectorAll(
    'select, .radio-label, .vc-btn-action, .vc-icon-btn'
  );
  clickEls.forEach(el => {
    el.removeEventListener('click', handleClick);
    el.addEventListener('click', handleClick);
  });

  // ⌨️ Har Input pe Keydown / Typing Sound Listener
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.removeEventListener('keydown', handleTyping);
    input.addEventListener('keydown', handleTyping);
  });
}

function handleHover() {
  playGtaSound('hover');
}

function handleClick() {
  playGtaSound('click');
}

function handleTyping(e) {
  // Ignore modifier keys like Shift, Ctrl, Alt
  if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
  playTypingSound(e.key);
}

// -------------------------------------------------------------
// 2. MULTI-LANGUAGE DICTIONARY (Custom App Names)
// -------------------------------------------------------------
const i18n = {
  en: {
    appTitle: "Pocket Log",
    datePrefix: "Today's Date: ",
    exportBtn: "Export Excel",
    resetBtn: "Reset",
    balanceLabel: "Remaining Balance",
    expenseRatio: "Expense Ratio",
    incomeLabel: "Total Income",
    expenseLabel: "Total Expense",
    entriesSuffix: "Entries",
    formHeading: "+ Add New Entry",
    typeLabel: "Transaction Type",
    incomeRadio: "+ Money Received (Income)",
    expenseRadio: "- Money Spent (Expense)",
    amountLabel: "Amount (in ₹)",
    dateLabel: "Date",
    noteLabel: "Short Note (Where from / Where spent?)",
    notePlaceholder: "e.g. Salary, Petrol, Tea, Grocery",
    saveBtn: "Save Entry",
    historyHeading: "Transactions List",
    searchPlaceholder: "🔍 Search note or amount...",
    optToday: "📅 Today (Daily)",
    optWeek: "📆 This Week (Weekly)",
    optMonth: "🗓️ This Month (Monthly)",
    optAll: "📁 All Time",
    optTypeAll: "All (Income + Expense)",
    optTypeIncome: "Only Income (+)",
    optTypeExpense: "Only Expense (-)",
    badgeToday: "Today (Daily)",
    badgeWeek: "This Week (Weekly)",
    badgeMonth: "This Month (Monthly)",
    badgeAll: "All Time",
    emptyState: "No transactions found for this filter.",
    confirmDelete: "Are you sure you want to delete this entry?",
    confirmReset: "Warning! This will permanently delete all your data. Continue?",
    noDataExport: "No data available to export!"
  },
  hi: {
    appTitle: "खर्चा पानी",
    datePrefix: "आज की तारीख: ",
    exportBtn: "Export Excel",
    resetBtn: "Reset",
    balanceLabel: "बचा हुआ बैलेंस",
    expenseRatio: "खर्च अनुपात",
    incomeLabel: "कुल आमदनी (Income)",
    expenseLabel: "कुल खर्चा (Expense)",
    entriesSuffix: "प्रविष्टियाँ",
    formHeading: "+ नया हिसाब दर्ज करें",
    typeLabel: "लेन-देन का प्रकार",
    incomeRadio: "+ पैसा आया (Income)",
    expenseRadio: "- खर्चा हुआ (Expense)",
    amountLabel: "रकम (Amount ₹)",
    dateLabel: "तारीख (Date)",
    noteLabel: "शॉर्ट नोट (कहाँ से आया / कहाँ गया?)",
    notePlaceholder: "उदा. सैलरी, पेट्रोल, चाय, राशन",
    saveBtn: "सेव करें (Add Entry)",
    historyHeading: "लेन-देन की सूची",
    searchPlaceholder: "🔍 नोट या रकम खोजें...",
    optToday: "📅 आज का (Daily)",
    optWeek: "📆 इस हफ्ते का (Weekly)",
    optMonth: "🗓️ इस महीने का (Monthly)",
    optAll: "📁 सारा डाटा (All Time)",
    optTypeAll: "सभी (Income + Expense)",
    optTypeIncome: "सिर्फ आमदनी (+)",
    optTypeExpense: "सिर्फ खर्चा (-)",
    badgeToday: "आज का दिन (Daily)",
    badgeWeek: "इस हफ्ते का (Weekly)",
    badgeMonth: "इस महीने का (Monthly)",
    badgeAll: "सारा डाटा (All Time)",
    emptyState: "इस फ़िल्टर में कोई हिसाब नहीं मिला।",
    confirmDelete: "क्या आप इस एंट्री को हटाना चाहते हैं?",
    confirmReset: "ध्यान दें! इससे आपका सारा डाटा हमेशा के लिए डिलीट हो जाएगा?",
    noDataExport: "डाउनलोड करने के लिए कोई डाटा नहीं है!"
  },
  sambalpuri: {
    appTitle: "ମୋର୍ ହିସାବ୍",
    datePrefix: "ଆଜିକାର ତାରିଖ: ",
    exportBtn: "Excel ଡାଉନଲୋଡ",
    resetBtn: "ସବୁ ସଫା କରୁନ",
    balanceLabel: "ବଚ୍‌ଲା ଟଙ୍କା (Balance)",
    expenseRatio: "ଖର୍ଚା ହିସାବ",
    incomeLabel: "ମୋଟ୍ ଆୟ (ଆସିଥିବାର୍)",
    expenseLabel: "ମୋଟ୍ ଖର୍ଚା (ଯାଇଥିବାର୍)",
    entriesSuffix: "ଟା ଏଣ୍ଟ୍ରି",
    formHeading: "+ ନୂଆ ହିସାବ ଲେଖୁନ୍",
    typeLabel: "ଟଙ୍କା ଆସିଛେ କି ଯାଇଛେ?",
    incomeRadio: "+ ଟଙ୍କା ଆଇଲା (Income)",
    expenseRadio: "- ଖର୍ଚା ହେଲା (Expense)",
    amountLabel: "କେତେ ଟଙ୍କା? (₹)",
    dateLabel: "ତାରିଖ (Date)",
    noteLabel: "ଛୋଟ୍ ନୋଟ୍ (କେନ୍ନୁ ଆଇଲା / କେନେ ଗଲା?)",
    notePlaceholder: "ଯେନ୍ତା କି: ଦରମା, ପେଟ୍ରୋଲ୍, ଚାହା, ରାସନ୍",
    saveBtn: "ସାଇତି ରଖୁନ୍ (Save)",
    historyHeading: "ଖର୍ଚା-ଆୟର ହିସାବ",
    searchPlaceholder: "🔍 ହିସାବ ଖୁଜୁନ୍...",
    optToday: "📅 ଆଜିକାର (Daily)",
    optWeek: "📆 ଇ ହପ୍ତାକାର (Weekly)",
    optMonth: "🗓️ ଇ ମାସକାର (Monthly)",
    optAll: "📁 ସବୁଦିନକାର (All Time)",
    optTypeAll: "ସବୁ (ଆୟ + ଖର୍ଚ୍ଚ)",
    optTypeIncome: "ଖାଲି ଆୟ (+)",
    optTypeExpense: "ଖାଲି ଖର୍ଚା (-)",
    badgeToday: "ଆଜିକାର (Daily)",
    badgeWeek: "ଇ ହପ୍ତାକାର (Weekly)",
    badgeMonth: "ଇ ମାସକାର (Monthly)",
    badgeAll: "ସବୁଦିନକାର (All Time)",
    emptyState: "ଇଥିରେ କିଛି ହିସାବ ନାଇଁନ। ନୂଆ ଏଣ୍ଟ୍ରି କରୁନ୍!",
    confirmDelete: "ଇ ହିସାବଟା କାଟି ଦେବାର୍ କି?",
    confirmReset: "ସତେ ସବୁ ହିସାବ ଡିଲିଟ୍ କରିଦେବେ କି?",
    noDataExport: "ଏକ୍ସପୋର୍ଟ କରବାକେ ହିସାବ ହିଁ ନାଇଁନ!"
  },
  odia: {
    appTitle: "ଦୈନିକ ହିସାବ",
    datePrefix: "ଆଜିର ତାରିଖ: ",
    exportBtn: "Excel ଡାଉନଲୋଡ",
    resetBtn: "ରିସେଟ୍",
    balanceLabel: "ଅବଶିଷ୍ଟ ବାଲାନ୍ସ",
    expenseRatio: "ଖର୍ଚ୍ଚ ଅନୁପାତ",
    incomeLabel: "ମୋଟ ଆୟ (Income)",
    expenseLabel: "ମୋଟ ଖର୍ଚ୍ଚ (Expense)",
    entriesSuffix: "ଟି ଏଣ୍ଟ୍ରି",
    formHeading: "+ ନୂତନ ଏଣ୍ଟ୍ରି ଯୋଡ଼ନ୍ତୁ",
    typeLabel: "କାରବାର ପ୍ରକାର",
    incomeRadio: "+ ଟଙ୍କା ଆସିଲା (Income)",
    expenseRadio: "- ଖର୍ଚ୍ଚ ହେଲା (Expense)",
    amountLabel: "ପରିମାଣ (Amount ₹)",
    dateLabel: "ତାରିଖ (Date)",
    noteLabel: "ସଂକ୍ଷିପ୍ତ ନୋଟ୍ (କେଉଁଠାରୁ ଆସିଲା / କେଉଁଠି ଗଲା?)",
    notePlaceholder: "ଯଥା: ଦରମା, ପେଟ୍ରୋଲ, ଚାହା, ରାସନ",
    saveBtn: "ସେଭ୍ କରନ୍ତୁ",
    historyHeading: "କାରବାର ତାଲିକା",
    searchPlaceholder: "🔍 ନୋଟ୍ କିମ୍ବା ଟଙ୍କା ଖୋଜନ୍ତୁ...",
    optToday: "📅 ଆଜିର (Daily)",
    optWeek: "📆 ଏହି ସପ୍ତାହର (Weekly)",
    optMonth: "🗓️ ଏହି ମାସର (Monthly)",
    optAll: "📁 ସମସ୍ତ ତଥ୍ୟ (All Time)",
    optTypeAll: "ସମସ୍ତ (ଆୟ + ଖର୍ଚ୍ଚ)",
    optTypeIncome: "କେବଳ ଆୟ (+)",
    optTypeExpense: "କେବଳ ଖର୍ଚ୍ଚ (-)",
    badgeToday: "ଆଜିର ଦିନ (Daily)",
    badgeWeek: "ଏହି ସପ୍ତାହର (Weekly)",
    badgeMonth: "ଏହି ମାସର (Monthly)",
    badgeAll: "ସମସ୍ତ ତଥ୍ୟ (All Time)",
    emptyState: "ଏହି ଫିଲ୍ଟରରେ କୌଣସି ତଥ୍ୟ ମିଳିଲା ନାହିଁ।",
    confirmDelete: "ଆପଣ ଏହି ଏଣ୍ଟ୍ରି ଡିଲିଟ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?",
    confirmReset: "ଏହା ଆପଣଙ୍କର ସମସ୍ତ ଡାଟା ସବୁଦିନ ପାଇଁ ଡିଲିଟ୍ କରିଦେବ। ନିଶ୍ଚିତ କି?",
    noDataExport: "ଏକ୍ସପୋର୍ଟ କରିବାକୁ କୌଣସି ଡାଟା ନାହିଁ!"
  },
  bengali: {
    appTitle: "টাকার খাতা",
    datePrefix: "আজকের তারিখ: ",
    exportBtn: "Excel এক্সপোর্ট",
    resetBtn: "রিসেট",
    balanceLabel: "অবশিষ্ট ব্যালেন্স",
    expenseRatio: "খরচের অনুপাত",
    incomeLabel: "মোট আয় (Income)",
    expenseLabel: "মোট খরচ (Expense)",
    entriesSuffix: "টি রেকর্ড",
    formHeading: "+ নতুন হিসাব যোগ করুন",
    typeLabel: "লেনদেনের প্রকার",
    incomeRadio: "+ টাকা এলো (Income)",
    expenseRadio: "- খরচ হলো (Expense)",
    amountLabel: "টাকার পরিমাণ (₹)",
    dateLabel: "তারিখ (Date)",
    noteLabel: "সংক্ষিপ্ত বিবরণ (কোথা থেকে এলো / কোথায় খরচ হলো?)",
    notePlaceholder: "যেমন: বেতন, পেট্রোল, চা, বাজার",
    saveBtn: "সংরক্ষণ করুন (Save)",
    historyHeading: "লেনদেনের তালিকা",
    searchPlaceholder: "🔍 বিবরণ বা টাকা খুঁজুন...",
    optToday: "📅 আজকের (Daily)",
    optWeek: "📆 এই সপ্তাহের (Weekly)",
    optMonth: "🗓️ এই মাসের (Monthly)",
    optAll: "📁 সব সময় (All Time)",
    optTypeAll: "সব (আয় + খরচ)",
    optTypeIncome: "শুধুমাত্র আয় (+)",
    optTypeExpense: "শুধুমাত্র খরচ (-)",
    badgeToday: "আজকের দিন (Daily)",
    badgeWeek: "এই সপ্তাহে (Weekly)",
    badgeMonth: "এই মাসে (Monthly)",
    badgeAll: "সব সময় (All Time)",
    emptyState: "এই ফিল্টারে কোনো তথ্য পাওয়া যায়নি।",
    confirmDelete: "আপনি কি নিশ্চিতভাবে এই এন্ট্রি মুছে ফেলতে চান?",
    confirmReset: "সতর্কতা! এটি আপনার সমস্ত ডেটা স্থায়ীভাবে মুছে ফেলবে?",
    noDataExport: "এক্সপোর্ট করার জন্য কোনো তথ্য নেই!"
  },
  telugu: {
    appTitle: "Pocket Log",
    datePrefix: "నేటి తేది: ",
    exportBtn: "Excel ఎగుమతి",
    resetBtn: "రీసెట్",
    balanceLabel: "మిగిలిన బ్యాలెన్స్",
    expenseRatio: "ఖర్చు నిష్పత్తి",
    incomeLabel: "మొత్తం ఆదాయం (Income)",
    expenseLabel: "మొత్తం ఖర్చు (Expense)",
    entriesSuffix: "నమోదులు",
    formHeading: "+ కొత్త నమోదును జోడించండి",
    typeLabel: "లావాదేవీ రకం",
    incomeRadio: "+ డబ్బు వచ్చింది (Income)",
    expenseRadio: "- ఖర్చు అయ్యింది (Expense)",
    amountLabel: "మొత్తం (Amount ₹)",
    dateLabel: "తేది (Date)",
    noteLabel: "చిన్న గమనిక (ఎక్కడ నుండి వచ్చింది / ఎక్కడ ఖర్చు అయింది?)",
    notePlaceholder: "ఉదా: జీతం, పెట్రోల్, టీ, కిరాణా",
    saveBtn: "సేవ్ చేయండి",
    historyHeading: "లావాదేవీల జాబితా",
    searchPlaceholder: "🔍 గమనిక లేదా మొత్తం వెతకండి...",
    optToday: "📅 ఈ రోజు (Daily)",
    optWeek: "📆 ఈ వారం (Weekly)",
    optMonth: "🗓️ ఈ నెల (Monthly)",
    optAll: "📁 మొత్తం డేటా (All Time)",
    optTypeAll: "అన్నీ (ఆదాయం + ఖర్చు)",
    optTypeIncome: "కేవలం ఆదాయం (+)",
    optTypeExpense: "కేవలం ఖర్చు (-)",
    badgeToday: "ఈ రోజు (Daily)",
    badgeWeek: "ఈ వారం (Weekly)",
    badgeMonth: "ఈ నెల (Monthly)",
    badgeAll: "మొత్తం డేటా (All Time)",
    emptyState: "ఈ ఫిల్టర్‌లో ఎటువంటి లావాదేవీలు కనుగొనబడలేదు.",
    confirmDelete: "మీరు ఈ నమోదును ఖచ్చితంగా తొలగించాలనుకుంటున్నారా?",
    confirmReset: "హెచ్చరిక! ఇది మీ మొత్తం డేటాను శాశ్వతంగా తొలగిస్తుంది?",
    noDataExport: "ఎగుమతి చేయడానికి డేటా ఏదీ లేదు!"
  },
  tamil: {
    appTitle: "Pocket Log",
    datePrefix: "இன்றைய தேதி: ",
    exportBtn: "Excel பதிவிறக்கு",
    resetBtn: "மீட்டமை",
    balanceLabel: "மீதமுள்ள இருப்பு",
    expenseRatio: "செலவு விகிதம்",
    incomeLabel: "மொத்த வருமானம் (Income)",
    expenseLabel: "மொத்த செலவு (Expense)",
    entriesSuffix: "பதிவுகள்",
    formHeading: "+ புதிய வரவு-செலவு சேர்க்க",
    typeLabel: "பரிவர்த்தனை வகை",
    incomeRadio: "+ பணம் வந்தது (Income)",
    expenseRadio: "- செலவானது (Expense)",
    amountLabel: "தொகை (Amount ₹)",
    dateLabel: "தேதி (Date)",
    noteLabel: "குறிப்பு (எங்கிருந்து வந்தது / எங்கு செலவானது?)",
    notePlaceholder: "எ.கா: சம்பளம், பெட்ரோல், டீ, மளிகை",
    saveBtn: "சேமிக்கவும்",
    historyHeading: "பரிவர்த்தனை பட்டியல்",
    searchPlaceholder: "🔍 தேடவும்...",
    optToday: "📅 இன்று (Daily)",
    optWeek: "📆 இந்த வாரம் (Weekly)",
    optMonth: "🗓️ இந்த மாதம் (Monthly)",
    optAll: "📁 அனைத்தும் (All Time)",
    optTypeAll: "அனைத்தும் (வரவு + செலவு)",
    optTypeIncome: "வருமானம் மட்டும் (+)",
    optTypeExpense: "செலவு மட்டும் (-)",
    badgeToday: "இன்று (Daily)",
    badgeWeek: "இந்த வாரம் (Weekly)",
    badgeMonth: "இந்த மாதம் (Monthly)",
    badgeAll: "அனைத்தும் (All Time)",
    emptyState: "பதிவுகள் எதுவும் கிடைக்கவில்லை.",
    confirmDelete: "இதை நிச்சயமாக நீக்க விரும்புகிறீர்களா?",
    confirmReset: "உங்கள் எல்லா தரவும் நிரந்தரமாக நீக்கப்படும். தொடரவா?",
    noDataExport: "பதிவிறக்க தரவு எதுவும் இல்லை!"
  },
  marathi: {
    appTitle: "Pocket Log",
    datePrefix: "आजची तारीख: ",
    exportBtn: "Excel एक्सपोर्ट",
    resetBtn: "रीसेट करा",
    balanceLabel: "शिल्लक रक्कम (Balance)",
    expenseRatio: "खर्च प्रमाण",
    incomeLabel: "एकूण उत्पन्न (Income)",
    expenseLabel: "एकूण खर्च (Expense)",
    entriesSuffix: "नोंदी",
    formHeading: "+ नवीन नोंद जोडा",
    typeLabel: "व्यवहाराचा प्रकार",
    incomeRadio: "+ पैसे आले (Income)",
    expenseRadio: "- खर्च झाला (Expense)",
    amountLabel: "रक्कम (Amount ₹)",
    dateLabel: "तारीख (Date)",
    noteLabel: "नोंद (कुठून आले / कुठे खर्च झाले?)",
    notePlaceholder: "उदा: पगार, पेट्रोल, चहा, किराणा",
    saveBtn: "जतन करा (Save)",
    historyHeading: "व्यवहारांची यादी",
    searchPlaceholder: "🔍 नोंद किंवा रक्कम शोधा...",
    optToday: "📅 आजचे (Daily)",
    optWeek: "📆 या आठवड्याचे (Weekly)",
    optMonth: "🗓️ या महिन्याचे (Monthly)",
    optAll: "📁 संपूर्ण डेटा (All Time)",
    optTypeAll: "सर्व (उत्पन्न + खर्च)",
    optTypeIncome: "फक्त उत्पन्न (+)",
    optTypeExpense: "फक्त खर्च (-)",
    badgeToday: "आजचा दिवस (Daily)",
    badgeWeek: "या आठवड्यात (Weekly)",
    badgeMonth: "या महिन्यात (Monthly)",
    badgeAll: "संपूर्ण डेटा (All Time)",
    emptyState: "या फिल्टरमध्ये कोणतीही नोंद आढळली नाही.",
    confirmDelete: "तुम्हाला ही नोंद नक्की काढून टाकायची आहे का?",
    confirmReset: "लक्ष द्या! यामुळे तुमचा सर्व डेटा कायमचा डिलीट होईल?",
    noDataExport: "एक्सपोर्ट करण्यासाठी कोणताही डेटा नाही!"
  }
};

// 🌟 DEFAULT LANGUAGE SET TO ENGLISH ("en")
let currentLang = localStorage.getItem("money_tracker_lang") || "en";

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("money_tracker_lang", lang);
  const t = i18n[lang] || i18n["en"];

  document.title = `${t.appTitle} - Pocket Log`;
  document.getElementById("t-app-title").innerText = t.appTitle;

  document.getElementById("t-export").innerText = t.exportBtn;
  document.getElementById("clear-all-btn").innerText = t.resetBtn;
  document.getElementById("t-balance-label").innerText = t.balanceLabel;
  document.getElementById("t-expense-ratio").innerText = t.expenseRatio;
  document.getElementById("t-income-label").innerText = t.incomeLabel;
  document.getElementById("t-expense-label").innerText = t.expenseLabel;
  document.getElementById("t-form-heading").innerText = t.formHeading;
  document.getElementById("t-type-label").innerText = t.typeLabel;
  document.getElementById("t-type-income").innerText = t.incomeRadio;
  document.getElementById("t-type-expense").innerText = t.expenseRadio;
  document.getElementById("t-amount-label").innerText = t.amountLabel;
  document.getElementById("t-date-label").innerText = t.dateLabel;
  document.getElementById("t-note-label").innerText = t.noteLabel;
  document.getElementById("note").placeholder = t.notePlaceholder;
  document.getElementById("t-save-btn").innerText = t.saveBtn;
  document.getElementById("t-history-heading").innerText = t.historyHeading;
  document.getElementById("search-input").placeholder = t.searchPlaceholder;

  document.getElementById("t-opt-today").innerText = t.optToday;
  document.getElementById("t-opt-week").innerText = t.optWeek;
  document.getElementById("t-opt-month").innerText = t.optMonth;
  document.getElementById("t-opt-all").innerText = t.optAll;

  document.getElementById("t-opt-type-all").innerText = t.optTypeAll;
  document.getElementById("t-opt-type-income").innerText = t.optTypeIncome;
  document.getElementById("t-opt-type-expense").innerText = t.optTypeExpense;

  const dateObj = new Date();
  document.getElementById("current-date-display").innerText = t.datePrefix + dateObj.toLocaleDateString();

  render();
}

// -------------------------------------------------------------
// 3. LANGUAGE SWITCH (Plays: language switch-ah-shit-here-we-go-again.mp3)
// -------------------------------------------------------------
const langSelect = document.getElementById("lang-select");
langSelect.value = currentLang;

langSelect.addEventListener("change", (e) => {
  playGtaSound('ahShit');
  showGtaSubtitle("Ah shit, here we go again...");
  applyLanguage(e.target.value);
});

// -------------------------------------------------------------
// 4. CONFETTI CELEBRATION
// -------------------------------------------------------------
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  particles = [];
  const colors = ["#22c55e", "#ff2a85", "#00f0ff", "#ffe600", "#ffffff"];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20 - 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12
    });
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35;
    p.alpha -= 0.015;
    p.rotation += p.vRot;

    ctx.save();
    ctx.globalAlpha = Math.max(p.alpha, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();

    if (p.alpha <= 0) particles.splice(idx, 1);
  });

  if (particles.length > 0) requestAnimationFrame(animateConfetti);
  else ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// -------------------------------------------------------------
// 5. TRANSACTION STATE & ACTIONS
// -------------------------------------------------------------
const soundToggle = document.getElementById("sound-toggle");
const exportBtn = document.getElementById("export-btn");
const clearAllBtn = document.getElementById("clear-all-btn");

const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");
const form = document.getElementById("transaction-form");
const list = document.getElementById("transactions-list");

const totalBalanceEl = document.getElementById("total-balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const incomeCountEl = document.getElementById("income-count");
const expenseCountEl = document.getElementById("expense-count");
const progressBar = document.getElementById("progress-bar");
const expensePercentage = document.getElementById("expense-percentage");

const timeFilter = document.getElementById("time-filter");
const typeFilter = document.getElementById("type-filter");
const searchInput = document.getElementById("search-input");
const activeFilterLabel = document.getElementById("active-filter-label");

let transactions = JSON.parse(localStorage.getItem("money_tracker_pro")) || [];

// Sound Toggle
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.innerText = soundEnabled ? "🔊" : "🔇";
  if (soundEnabled) playGtaSound('click');
});

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Form Submit: Income = credited.mp3, Expense = sounds_gta5-wasted.mp3
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.querySelector('input[name="entryType"]:checked').value;
  const amount = parseFloat(amountInput.value);
  const entryDate = dateInput.value;
  const note = noteInput.value.trim();

  const newEntry = {
    id: Date.now(),
    type,
    amount,
    date: entryDate,
    note
  };

  transactions.unshift(newEntry);
  localStorage.setItem("money_tracker_pro", JSON.stringify(transactions));

  if (type === 'income') {
    playGtaSound('income'); // 🏆 Plays: credited.mp3
    launchConfetti();
  } else {
    playGtaSound('wasted'); // 💥 Plays: sounds_gta5-wasted.mp3
  }

  render();
  totalBalanceEl.classList.add("pulse");
  setTimeout(() => totalBalanceEl.classList.remove("pulse"), 400);

  amountInput.value = "";
  noteInput.value = "";
  noteInput.focus();
});

// Delete Transaction = sounds_gta5-wasted.mp3
function deleteTransaction(id, btn) {
  const t = i18n[currentLang] || i18n["en"];
  if (!confirm(t.confirmDelete)) return;

  playGtaSound('wasted'); // 💀 Plays: sounds_gta5-wasted.mp3
  const item = btn.closest('.transaction-item');
  item.classList.add('deleting');

  setTimeout(() => {
    transactions = transactions.filter(tr => tr.id !== id);
    localStorage.setItem("money_tracker_pro", JSON.stringify(transactions));
    render();
  }, 260);
}

// Reset Data = language switch-ah-shit-here-we-go-again.mp3
clearAllBtn.addEventListener("click", () => {
  const t = i18n[currentLang] || i18n["en"];
  playGtaSound('ahShit'); // 🗣️ Plays: language switch-ah-shit-here-we-go-again.mp3
  showGtaSubtitle("Ah shit, here we go again...");

  setTimeout(() => {
    if (confirm(t.confirmReset)) {
      transactions = [];
      localStorage.removeItem("money_tracker_pro");
      render();
    }
  }, 350);
});

// Export CSV
exportBtn.addEventListener("click", () => {
  const t = i18n[currentLang] || i18n["en"];
  playGtaSound('click');
  if (transactions.length === 0) {
    alert(t.noDataExport);
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,ID,Type,Amount,Date,Note\n";
  transactions.forEach(tr => {
    csvContent += `"${tr.id}","${tr.type}","${tr.amount}","${tr.date}","${tr.note}"\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `PocketLog_Report_${getTodayString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// -------------------------------------------------------------
// 6. FILTER & RENDER
// -------------------------------------------------------------
function filterByTime(items, filter) {
  const today = new Date();
  const todayStr = getTodayString();

  return items.filter(item => {
    const itemDate = new Date(item.date);
    if (filter === "today") return item.date === todayStr;
    if (filter === "week") {
      const diffDays = (today - itemDate) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }
    if (filter === "month") {
      return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
    }
    return true;
  });
}

function render() {
  const t = i18n[currentLang] || i18n["en"];
  let totalInc = 0;
  let totalExp = 0;

  transactions.forEach(i => {
    if (i.type === "income") totalInc += i.amount;
    else totalExp += i.amount;
  });

  const balance = totalInc - totalExp;
  totalBalanceEl.innerText = `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  totalBalanceEl.style.color = balance < 0 ? "var(--neon-pink)" : "var(--neon-cyan)";

  // Budget Progress
  if (totalInc > 0) {
    const ratio = Math.min(Math.round((totalExp / totalInc) * 100), 100);
    expensePercentage.innerText = `${ratio}%`;
    progressBar.style.width = `${ratio}%`;
    progressBar.style.background = ratio > 80 ? "var(--neon-pink)" : (ratio > 50 ? "var(--neon-yellow)" : "var(--neon-cyan)");
  } else {
    expensePercentage.innerText = totalExp > 0 ? "100%" : "0%";
    progressBar.style.width = totalExp > 0 ? "100%" : "0%";
    progressBar.style.background = "var(--neon-pink)";
  }

  const timeVal = timeFilter.value;
  const badgeMap = {
    today: t.badgeToday,
    week: t.badgeWeek,
    month: t.badgeMonth,
    all: t.badgeAll
  };
  activeFilterLabel.innerText = badgeMap[timeVal] || t.badgeToday;

  const typeVal = typeFilter.value;
  const searchVal = searchInput.value.toLowerCase().trim();

  let filtered = filterByTime(transactions, timeVal);

  if (typeVal !== "all") {
    filtered = filtered.filter(i => i.type === typeVal);
  }

  if (searchVal) {
    filtered = filtered.filter(i => 
      i.note.toLowerCase().includes(searchVal) || i.amount.toString().includes(searchVal)
    );
  }

  let viewInc = 0, viewExp = 0, incC = 0, expC = 0;
  filtered.forEach(i => {
    if (i.type === "income") { viewInc += i.amount; incC++; }
    else { viewExp += i.amount; expC++; }
  });

  totalIncomeEl.innerText = `+₹${viewInc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  totalExpenseEl.innerText = `-₹${viewExp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  incomeCountEl.innerText = `${incC} ${t.entriesSuffix}`;
  expenseCountEl.innerText = `${expC} ${t.entriesSuffix}`;

  list.innerHTML = "";
  if (filtered.length === 0) {
    list.innerHTML = `<li class="empty-state">${t.emptyState}</li>`;
    return;
  }

  filtered.forEach(item => {
    const li = document.createElement("li");
    li.className = `transaction-item ${item.type}`;
    const isInc = item.type === "income";

    li.innerHTML = `
      <div class="item-left">
        <span class="item-note">${item.note}</span>
        <span class="item-meta">📅 ${item.date}</span>
      </div>
      <div class="item-right">
        <span class="item-amount ${isInc ? 'text-neon-cyan' : 'text-neon-pink'}">
          ${isInc ? '+' : '-'}₹${item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
        <button class="delete-btn" onclick="deleteTransaction(${item.id}, this)" title="Delete">&times;</button>
      </div>
    `;
    list.appendChild(li);
  });

  // Rebind sounds (including typing) to newly generated elements
  attachSoundEffects();
}

// Filter Listeners
timeFilter.addEventListener("change", () => { playGtaSound('click'); render(); });
typeFilter.addEventListener("change", () => { playGtaSound('click'); render(); });
searchInput.addEventListener("input", render);

// Initial Load (Default: English)
dateInput.value = getTodayString();
applyLanguage(currentLang);
attachSoundEffects();