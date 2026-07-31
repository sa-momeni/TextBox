// تابع پاک کردن متن - ویرایش شده برای دریافت هر دو آیدی ورودی و خروجی
function clearText(inputId, outputId) {
    document.getElementById(inputId).value = '';
    document.getElementById(outputId).value = '';

    // در صورتی که در تب اول باشیم، آمارهای متن هم صفر شوند
    if (inputId === 'text-input') {
        document.getElementById('stat-zwnj').innerText = '0';
        document.getElementById('stat-spaces').innerText = '0';
        document.getElementById('stat-hidden').innerText = '0';
    }
}

// توابع کپی و پیست
function copyText(elementId) {
    const el = document.getElementById(elementId);
    el.select();
    el.setSelectionRange(0, 99999); // برای موبایل
    navigator.clipboard.writeText(el.value).then(() => {
        // نمایش بازخورد موقت
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

// مدیریت تب‌ها
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
}

// مدیریت حالت شب
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

// بررسی تم ذخیره شده
window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('theme-btn').innerText = 'حالت روز';
    }
}

// مدیریت Modal
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

// پردازش متن
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

// فشرده‌سازی کد
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
        code = code.replace(/\s*([=+\-*/<>{}()[\\\\];,.:])\s*/g, '$1');
    }

    document.getElementById('code-output').value = code.trim();
}

// اصلاح کیبورد
function fixKeyboard() {
    const faChars = {
        'q': 'ض', 'w': 'ص', 'e': 'ث', 'r': 'ق', 't': 'ف', 'y': 'غ', 'u': 'ع', 'i': 'ه', 'o': 'خ', 'p': 'ح', '[': 'ج', ']': 'چ', '\\': 'پ',
        'a': 'ش', 's': 'س', 'd': 'ی', 'f': 'ب', 'g': 'ل', 'h': 'ا', 'j': 'ت', 'k': 'ن', 'l': 'م', ';': 'ک', "'": 'گ',
        'z': 'ظ', 'x': 'ط', 'c': 'ز', 'v': 'ر', 'b': 'ذ', 'n': 'د', 'm': 'ئ', ',': 'و', '?': '؟',
        'Q': 'ْ', 'W': 'ٌ', 'E': 'ٍ', 'R': 'ً', 'T': 'ُ', 'Y': 'ِ', 'U': 'َ', 'I': 'ّ', 'O': ']', 'P': '[', '{': '}', '}': '{',
        'A': 'ؤ', 'S': 'ئ', 'D': 'ي', 'F': 'إ', 'G': 'أ', 'H': 'آ', 'J': 'ة', 'K': '»', 'L': '«',
        'Z': 'ك', 'X': 'ٓ', 'C': 'ژ', 'V': 'ٰ', 'B': '\u200C', 'N': 'ٔ', 'M': 'ء'
    };

    const input = document.getElementById('keyboard-input').value;
    let output = '';

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        output += faChars[char] !== undefined ? faChars[char] : char;
    }

    document.getElementById('keyboard-output').value = output;
}
