function clearText(inputId, outputId) {
    document.getElementById(inputId).value = '';
    document.getElementById(outputId).value = '';

    if (inputId === 'text-input') {
        document.getElementById('stat-zwnj').innerText = '0';
        document.getElementById('stat-spaces').innerText = '0';
        document.getElementById('stat-hidden').innerText = '0';
    }
}

function copyText(elementId) {
    const el = document.getElementById(elementId);
    el.select();
    el.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(el.value).then(() => {
        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ کپی شد';
        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
    }).catch(err => {
        console.error('خطا در کپی: ', err);
        alert('مرورگر شما از کپی مستقیم پشتیبانی نمی‌کند.');
    });
}

async function pasteText(elementId) {
    try {
        const text = await navigator.clipboard.readText();
        const el = document.getElementById(elementId);
        el.value = text;
    } catch (err) {
        console.error('خطا در پیست: ', err);
        alert('لطفا اجازه دسترسی به کلیپ‌بورد را به مرورگر بدهید یا به صورت دستی (Ctrl+V) استفاده کنید.');
    }
}

function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    const themeBtn = document.getElementById('theme-btn');

    if (isDark) {
        body.removeAttribute('data-theme');
        themeBtn.innerText = 'حالت شب';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeBtn.innerText = 'حالت روز';
        localStorage.setItem('theme', 'dark');
    }
}

window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('theme-btn').innerText = 'حالت روز';
    }
}

function openModal() {
    document.getElementById('changelog-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('changelog-modal').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('changelog-modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function processText() {
    let text = document.getElementById('text-input').value;

    let zwnjCount = (text.match(/\u200C/g) || []).length;
    text = text.replace(/\u200C/g, ' ');

    let hiddenRegex = /[\u200B\u200D\uFEFF]/g;
    let hiddenCount = (text.match(hiddenRegex) || []).length;
    text = text.replace(hiddenRegex, '');

    let spacesCount = 0;
    text = text.replace(/ {2,}/g, function (match) {
        spacesCount += match.length - 1;
        return ' ';
    });

    document.getElementById('text-output').value = text;
    document.getElementById('stat-zwnj').innerText = zwnjCount;
    document.getElementById('stat-hidden').innerText = hiddenCount;
    document.getElementById('stat-spaces').innerText = spacesCount;
}

function minifyCode() {
    let code = document.getElementById('code-input').value;
    const type = document.getElementById('minify-type').value;

    if (type === 'css') {
        code = code.replace(/\/\*[\s\S]*?\*\//g, '');
        code = code.replace(/\s+/g, ' ');
        code = code.replace(/\s*([{}:;,])\s*/g, '$1');
    } else if (type === 'js') {
        code = code.replace(/\/\*[\s\S]*?\*\//g, '');
        code = code.replace(/\/\/.*/g, '');
        code = code.replace(/\s+/g, ' ');
        code = code.replace(/\s*([=+\-*/<>{}()[\\\\\\];,.:])\s*/g, '$1');
    }

    document.getElementById('code-output').value = code.trim();
}

// اصلاح کیبورد - ویرایش شده برای پشتیبانی از هر دو جهت
function fixKeyboard(direction) {
    const faChars = {
        'q': 'ض', 'w': 'ص', 'e': 'ث', 'r': 'ق', 't': 'ف', 'y': 'غ', 'u': 'ع', 'i': 'ه', 'o': 'خ', 'p': 'ح', '[': 'ج', ']': 'چ', '\\': 'پ',
        'a': 'ش', 's': 'س', 'd': 'ی', 'f': 'ب', 'g': 'ل', 'h': 'ا', 'j': 'ت', 'k': 'ن', 'l': 'م', ';': 'ک', "'": 'گ',
        'z': 'ظ', 'x': 'ط', 'c': 'ز', 'v': 'ر', 'b': 'ذ', 'n': 'د', 'm': 'ئ', ',': 'و', '?': '؟',
        'Q': 'ْ', 'W': 'ٌ', 'E': 'ٍ', 'R': 'ً', 'T': 'ُ', 'Y': 'ِ', 'U': 'َ', 'I': 'ّ', 'O': ']', 'P': '[', '{': '}', '}': '{',
        'A': 'ؤ', 'S': 'ئ', 'D': 'ي', 'F': 'إ', 'G': 'أ', 'H': 'آ', 'J': 'ة', 'K': '»', 'L': '«',
        'Z': 'ك', 'X': 'ٓ', 'C': 'ژ', 'V': 'ٰ', 'B': '\u200C', 'N': 'ٔ', 'M': 'ء'
    };

    // ساخت دیکشنری معکوس برای تبدیل فارسی به انگلیسی
    const enChars = {};
    for (const key in faChars) {
        enChars[faChars[key]] = key;
    }

    const input = document.getElementById('keyboard-input').value;
    const outputEl = document.getElementById('keyboard-output');
    let output = '';

    const map = direction === 'toFa' ? faChars : enChars;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        output += map[char] !== undefined ? map[char] : char;
    }

    outputEl.value = output;

    // تنظیم راست‌چین یا چپ‌چین شدن خروجی بسته به زبان
    if (direction === 'toEn') {
        outputEl.setAttribute('dir', 'ltr');
    } else {
        outputEl.setAttribute('dir', 'rtl');
    }
}