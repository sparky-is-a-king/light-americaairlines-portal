import React, { createContext, useContext } from "react";

/**
 * Locale registry — drives the navbar language menu.
 *
 * `code` is the stable id stored in localStorage and used as the dictionary
 * key; `tag` is the BCP-47 tag applied to <html lang> (used by screen readers,
 * font fallback and browser translate prompts).
 */
export const LOCALES = [
  { code: "US", name: "English (US)", flag: "🇺🇸", tag: "en-US" },
  { code: "GB", name: "English (UK)", flag: "🇬🇧", tag: "en-GB" },
  { code: "ES", name: "Español", flag: "🇪🇸", tag: "es" },
  { code: "FR", name: "Français", flag: "🇫🇷", tag: "fr" },
  { code: "DE", name: "Deutsch", flag: "🇩🇪", tag: "de" },
  { code: "JP", name: "日本語", flag: "🇯🇵", tag: "ja" },
  { code: "CN", name: "中文", flag: "🇨🇳", tag: "zh-CN" },
];

// localStorage key for the persisted choice. Not namespaced — this is the
// only locale setting the app has.
export const STORAGE_KEY = "app-locale";

/**
 * Translation strings for the app shell and core pages (navbar, dock, Home,
 * Login, Register, flight rows). Keys are flat so lookups stay trivial.
 *
 * The boarding-pass and track-flight screens still render English literals;
 * they can adopt t() keys incrementally — anything missing simply falls back
 * to the en-US string, and an unknown key falls back to the key itself.
 */
const enUS = {
  // Navbar
  "nav.install": "Install app",
  "nav.logout": "Logout",
  "nav.language": "Choose language",
  "nav.error.network": "Network issue: cannot logout now!",

  // Dock / tab bar
  "dock.home": "Home",
  "dock.book": "Book",
  "dock.track": "Track",

  // Shared stats
  "stats.flightsDaily": "Flights Daily",
  "stats.support": "Support",
  "stats.uptime": "Uptime",

  // Home — hero
  "home.badge": "⭐ 4.9/5 RATED BY 50K+ TRAVELERS",
  "home.hero.title1": "Elevate Your",
  "home.hero.title2": "Journey Experience",
  "home.hero.subtitle":
    "Fly with confidence. Track in real-time. Experience premium service across 500+ destinations worldwide.",
  "home.stat.destinations": "Destinations",
  "home.stat.support": "Support",
  "home.stat.ontime": "On-time Rate",
  "home.stat.travelers": "Happy Travelers",
  "home.cta.book": "Book Flight",
  "home.cta.track": "Track Flight",
  "home.trust.price": "Best Price Guarantee",
  "home.trust.secure": "Secure Booking",
  "home.scroll": "Scroll to explore",

  // Home — booking form
  "home.booking.title": "Book Your Flight",
  "home.form.from": "From",
  "home.form.fromPh": "e.g. JKIA",
  "home.form.to": "To",
  "home.form.toPh": "e.g. CGK",
  "home.form.date": "Departure Date",
  "home.form.search": "Search Flights",

  // Home — destinations
  "home.dest.chip": "🌍 Global Destinations",
  "home.dest.title": "Popular Destinations Worldwide",
  "home.dest.subtitle": "Discover amazing flight deals across the globe",
  "home.dest.viewAll": "View All →",
  "home.dest.deals": "{count} deals",
  "home.dest.airport": "Airport",

  // Home — flight results
  "home.flights.title": "Available Flights",
  "home.flights.showing": "Showing {shown} of {total} flights",
  "home.flights.fromChip": "From: {value}",
  "home.flights.toChip": "To: {value}",
  "home.flights.clear": "Clear search",
  "home.flights.noMatch": "No flights match your search",
  "home.flights.noMatchHint":
    "Try another airport code, or clear the filters to see every available route.",

  // Home — features
  "home.features.title": "Why Choose American Airlines?",
  "home.feature.instant.title": "Instant Booking",
  "home.feature.instant.desc": "Get confirmed tickets in minutes",
  "home.feature.flexible.title": "Flexible Cancellation",
  "home.feature.flexible.desc": "Free cancellation up to 24 hours",
  "home.feature.price.title": "Best Price Guarantee",
  "home.feature.price.desc": "We'll match any lower price",
  "home.feature.app.title": "Mobile App",
  "home.feature.app.desc": "Book & track flights on the go",

  // Flight card
  "flight.from": "FROM",
  "flight.book": "Book",

  // Auth pages
  "auth.welcome": "Welcome Back!",
  "auth.welcomeBlurb":
    "Access your dashboard, manage flights, and track your American Airlines operations with our secure enterprise platform.",
  "auth.join": "Join Our Community!",
  "auth.joinBlurb":
    "Create your account to access exclusive flight deals, track your journeys, and experience premium American Airlines services.",
  "auth.signin.title": "Sign In",
  "auth.signin.subtitle": "Enter your credentials to access your account",
  "auth.signup.title": "Create Account",
  "auth.signup.subtitle": "Fill in your details to get started",
  "auth.email": "Email Address",
  "auth.password": "Password",
  "auth.fullName": "Full Name",
  "auth.confirmPassword": "Confirm Password",
  "auth.forgot": "Forgot password?",
  "auth.signin.cta": "Sign In",
  "auth.signup.cta": "Create Account",
  "auth.noAccount": "Don't have an account?",
  "auth.createLink": "Create account",
  "auth.hasAccount": "Already have an account?",
  "auth.signinLink": "Sign In",
  "auth.error.fallback": "Invalid credentials. Please try again.",
  "auth.error.required": "All fields are required.",
  "auth.error.mismatch": "Passwords do not match.",
  "auth.error.short": "Password must be at least 8 characters long.",
  "auth.success": "Account created successfully! Redirecting to login...",
};

const enGB = {
  ...enUS,
  "home.badge": "⭐ 4.9/5 RATED BY 50K+ TRAVELLERS",
  "home.stat.travelers": "Happy Travellers",
};

const es = {
  "nav.install": "Instalar app",
  "nav.logout": "Cerrar sesión",
  "nav.language": "Elegir idioma",
  "nav.error.network": "Problema de red: no se puede cerrar sesión ahora.",

  "dock.home": "Inicio",
  "dock.book": "Reservar",
  "dock.track": "Rastrear",

  "stats.flightsDaily": "Vuelos diarios",
  "stats.support": "Soporte",
  "stats.uptime": "Disponibilidad",

  "home.badge": "⭐ 4.9/5 CON CALIFICACIÓN DE +50K VIAJEROS",
  "home.hero.title1": "Eleva Tu",
  "home.hero.title2": "Experiencia de Viaje",
  "home.hero.subtitle":
    "Vuela con confianza. Rastrea en tiempo real. Disfruta de un servicio premium en más de 500 destinos del mundo.",
  "home.stat.destinations": "Destinos",
  "home.stat.support": "Soporte",
  "home.stat.ontime": "Puntualidad",
  "home.stat.travelers": "Viajeros felices",
  "home.cta.book": "Reservar vuelo",
  "home.cta.track": "Rastrear vuelo",
  "home.trust.price": "Mejor precio garantizado",
  "home.trust.secure": "Reserva segura",
  "home.scroll": "Desliza para explorar",

  "home.booking.title": "Reserva tu vuelo",
  "home.form.from": "Origen",
  "home.form.fromPh": "p. ej. JKIA",
  "home.form.to": "Destino",
  "home.form.toPh": "p. ej. CGK",
  "home.form.date": "Fecha de salida",
  "home.form.search": "Buscar vuelos",

  "home.dest.chip": "🌍 Destinos globales",
  "home.dest.title": "Destinos populares del mundo",
  "home.dest.subtitle": "Descubre ofertas de vuelos increíbles en todo el mundo",
  "home.dest.viewAll": "Ver todos →",
  "home.dest.deals": "{count} ofertas",
  "home.dest.airport": "Aeropuerto",

  "home.flights.title": "Vuelos disponibles",
  "home.flights.showing": "Mostrando {shown} de {total} vuelos",
  "home.flights.fromChip": "De: {value}",
  "home.flights.toChip": "A: {value}",
  "home.flights.clear": "Borrar búsqueda",
  "home.flights.noMatch": "Ningún vuelo coincide con tu búsqueda",
  "home.flights.noMatchHint":
    "Prueba con otro código de aeropuerto o borra los filtros para ver todas las rutas disponibles.",

  "home.features.title": "¿Por qué elegir American Airlines?",
  "home.feature.instant.title": "Reserva instantánea",
  "home.feature.instant.desc": "Consigue boletos confirmados en minutos",
  "home.feature.flexible.title": "Cancelación flexible",
  "home.feature.flexible.desc": "Cancelación gratuita hasta 24 horas antes",
  "home.feature.price.title": "Mejor precio garantizado",
  "home.feature.price.desc": "Igualamos cualquier precio más bajo",
  "home.feature.app.title": "App móvil",
  "home.feature.app.desc": "Reserva y rastrea vuelos donde vayas",

  "flight.from": "DESDE",
  "flight.book": "Reservar",

  "auth.welcome": "¡Bienvenido de nuevo!",
  "auth.welcomeBlurb":
    "Accede a tu panel, gestiona vuelos y rastrea tus operaciones de American Airlines con nuestra plataforma empresarial segura.",
  "auth.join": "¡Únete a nuestra comunidad!",
  "auth.joinBlurb":
    "Crea tu cuenta para acceder a ofertas exclusivas, seguir tus viajes y disfrutar de los servicios premium de American Airlines.",
  "auth.signin.title": "Iniciar sesión",
  "auth.signin.subtitle": "Introduce tus credenciales para acceder a tu cuenta",
  "auth.signup.title": "Crear cuenta",
  "auth.signup.subtitle": "Completa tus datos para empezar",
  "auth.email": "Correo electrónico",
  "auth.password": "Contraseña",
  "auth.fullName": "Nombre completo",
  "auth.confirmPassword": "Confirmar contraseña",
  "auth.forgot": "¿Olvidaste tu contraseña?",
  "auth.signin.cta": "Iniciar sesión",
  "auth.signup.cta": "Crear cuenta",
  "auth.noAccount": "¿No tienes una cuenta?",
  "auth.createLink": "Crear cuenta",
  "auth.hasAccount": "¿Ya tienes una cuenta?",
  "auth.signinLink": "Iniciar sesión",
  "auth.error.fallback": "Credenciales no válidas. Inténtalo de nuevo.",
  "auth.error.required": "Todos los campos son obligatorios.",
  "auth.error.mismatch": "Las contraseñas no coinciden.",
  "auth.error.short": "La contraseña debe tener al menos 8 caracteres.",
  "auth.success": "¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...",
};

const fr = {
  "nav.install": "Installer l'app",
  "nav.logout": "Se déconnecter",
  "nav.language": "Choisir la langue",
  "nav.error.network": "Problème de réseau : déconnexion impossible pour le moment.",

  "dock.home": "Accueil",
  "dock.book": "Réserver",
  "dock.track": "Suivre",

  "stats.flightsDaily": "Vols quotidiens",
  "stats.support": "Assistance",
  "stats.uptime": "Disponibilité",

  "home.badge": "⭐ 4.9/5 — NOTÉ PAR +50K VOYAGEURS",
  "home.hero.title1": "Élevez Votre",
  "home.hero.title2": "Expérience de Voyage",
  "home.hero.subtitle":
    "Volez en toute confiance. Suivi en temps réel. Profitez d'un service premium vers plus de 500 destinations dans le monde.",
  "home.stat.destinations": "Destinations",
  "home.stat.support": "Assistance",
  "home.stat.ontime": "Ponctualité",
  "home.stat.travelers": "Voyageurs satisfaits",
  "home.cta.book": "Réserver un vol",
  "home.cta.track": "Suivre un vol",
  "home.trust.price": "Meilleur prix garanti",
  "home.trust.secure": "Réservation sécurisée",
  "home.scroll": "Faites défiler pour explorer",

  "home.booking.title": "Réservez Votre Vol",
  "home.form.from": "Départ",
  "home.form.fromPh": "ex. JKIA",
  "home.form.to": "Arrivée",
  "home.form.toPh": "ex. CGK",
  "home.form.date": "Date de départ",
  "home.form.search": "Rechercher des vols",

  "home.dest.chip": "🌍 Destinations mondiales",
  "home.dest.title": "Destinations populaires dans le monde",
  "home.dest.subtitle": "Découvrez des offres de vol exceptionnelles partout dans le monde",
  "home.dest.viewAll": "Tout voir →",
  "home.dest.deals": "{count} offres",
  "home.dest.airport": "Aéroport",

  "home.flights.title": "Vols disponibles",
  "home.flights.showing": "{shown} vols affichés sur {total}",
  "home.flights.fromChip": "De : {value}",
  "home.flights.toChip": "Vers : {value}",
  "home.flights.clear": "Effacer la recherche",
  "home.flights.noMatch": "Aucun vol ne correspond à votre recherche",
  "home.flights.noMatchHint":
    "Essayez un autre code d'aéroport ou effacez les filtres pour voir toutes les routes disponibles.",

  "home.features.title": "Pourquoi choisir American Airlines ?",
  "home.feature.instant.title": "Réservation instantanée",
  "home.feature.instant.desc": "Obtenez des billets confirmés en quelques minutes",
  "home.feature.flexible.title": "Annulation flexible",
  "home.feature.flexible.desc": "Annulation gratuite jusqu'à 24 heures",
  "home.feature.price.title": "Meilleur prix garanti",
  "home.feature.price.desc": "Nous égalerons tout prix inférieur",
  "home.feature.app.title": "Application mobile",
  "home.feature.app.desc": "Réservez et suivez vos vols où que vous soyez",

  "flight.from": "DÈS",
  "flight.book": "Réserver",

  "auth.welcome": "Bon retour !",
  "auth.welcomeBlurb":
    "Accédez à votre tableau de bord, gérez vos vols et suivez vos opérations American Airlines sur notre plateforme d'entreprise sécurisée.",
  "auth.join": "Rejoignez notre communauté !",
  "auth.joinBlurb":
    "Créez votre compte pour accéder à des offres exclusives, suivre vos voyages et profiter des services premium d'American Airlines.",
  "auth.signin.title": "Connexion",
  "auth.signin.subtitle": "Saisissez vos identifiants pour accéder à votre compte",
  "auth.signup.title": "Créer un compte",
  "auth.signup.subtitle": "Remplissez vos informations pour commencer",
  "auth.email": "Adresse e-mail",
  "auth.password": "Mot de passe",
  "auth.fullName": "Nom complet",
  "auth.confirmPassword": "Confirmer le mot de passe",
  "auth.forgot": "Mot de passe oublié ?",
  "auth.signin.cta": "Se connecter",
  "auth.signup.cta": "Créer un compte",
  "auth.noAccount": "Pas encore de compte ?",
  "auth.createLink": "Créer un compte",
  "auth.hasAccount": "Vous avez déjà un compte ?",
  "auth.signinLink": "Se connecter",
  "auth.error.fallback": "Identifiants invalides. Veuillez réessayer.",
  "auth.error.required": "Tous les champs sont obligatoires.",
  "auth.error.mismatch": "Les mots de passe ne correspondent pas.",
  "auth.error.short": "Le mot de passe doit contenir au moins 8 caractères.",
  "auth.success": "Compte créé avec succès ! Redirection vers la connexion...",
};

const de = {
  "nav.install": "App installieren",
  "nav.logout": "Abmelden",
  "nav.language": "Sprache wählen",
  "nav.error.network": "Netzwerkproblem: Abmelden ist gerade nicht möglich.",

  "dock.home": "Start",
  "dock.book": "Buchen",
  "dock.track": "Verfolgen",

  "stats.flightsDaily": "Flüge täglich",
  "stats.support": "Support",
  "stats.uptime": "Verfügbarkeit",

  "home.badge": "⭐ 4,9/5 BEWERTET VON 50K+ REISENDEN",
  "home.hero.title1": "Ihre Reiseerfahrung",
  "home.hero.title2": "neu definiert",
  "home.hero.subtitle":
    "Fliegen Sie mit Vertrauen. Verfolgen Sie in Echtzeit. Erleben Sie Premium-Service an über 500 Reisezielen weltweit.",
  "home.stat.destinations": "Reiseziele",
  "home.stat.support": "Support",
  "home.stat.ontime": "Pünktlichkeit",
  "home.stat.travelers": "Glückliche Reisende",
  "home.cta.book": "Flug buchen",
  "home.cta.track": "Flug verfolgen",
  "home.trust.price": "Bestpreisgarantie",
  "home.trust.secure": "Sichere Buchung",
  "home.scroll": "Scrollen zum Entdecken",

  "home.booking.title": "Buchen Sie Ihren Flug",
  "home.form.from": "Von",
  "home.form.fromPh": "z. B. JKIA",
  "home.form.to": "Nach",
  "home.form.toPh": "z. B. CGK",
  "home.form.date": "Abflugdatum",
  "home.form.search": "Flüge suchen",

  "home.dest.chip": "🌍 Globale Reiseziele",
  "home.dest.title": "Beliebte Reiseziele weltweit",
  "home.dest.subtitle": "Entdecken Sie tolle Flugangebote rund um den Globus",
  "home.dest.viewAll": "Alle ansehen →",
  "home.dest.deals": "{count} Angebote",
  "home.dest.airport": "Flughafen",

  "home.flights.title": "Verfügbare Flüge",
  "home.flights.showing": "{shown} von {total} Flügen werden angezeigt",
  "home.flights.fromChip": "Von: {value}",
  "home.flights.toChip": "Nach: {value}",
  "home.flights.clear": "Suche löschen",
  "home.flights.noMatch": "Keine Flüge entsprechen Ihrer Suche",
  "home.flights.noMatchHint":
    "Versuchen Sie einen anderen Flughafencode oder löschen Sie die Filter, um alle verfügbaren Strecken zu sehen.",

  "home.features.title": "Warum American Airlines?",
  "home.feature.instant.title": "Sofortige Buchung",
  "home.feature.instant.desc": "Bestätigte Tickets in Minuten",
  "home.feature.flexible.title": "Flexible Stornierung",
  "home.feature.flexible.desc": "Kostenlose Stornierung bis 24 Stunden",
  "home.feature.price.title": "Bestpreisgarantie",
  "home.feature.price.desc": "Wir matchen jeden niedrigeren Preis",
  "home.feature.app.title": "Mobile App",
  "home.feature.app.desc": "Flüge unterwegs buchen & verfolgen",

  "flight.from": "AB",
  "flight.book": "Buchen",

  "auth.welcome": "Willkommen zurück!",
  "auth.welcomeBlurb":
    "Greifen Sie auf Ihr Dashboard zu, verwalten Sie Flüge und verfolgen Sie Ihre American Airlines-Vorgänge über unsere sichere Unternehmensplattform.",
  "auth.join": "Werden Sie Teil unserer Community!",
  "auth.joinBlurb":
    "Erstellen Sie Ihr Konto für exklusive Flugangebote, verfolgen Sie Ihre Reisen und genießen Sie den Premium-Service von American Airlines.",
  "auth.signin.title": "Anmelden",
  "auth.signin.subtitle": "Geben Sie Ihre Zugangsdaten ein, um auf Ihr Konto zuzugreifen",
  "auth.signup.title": "Konto erstellen",
  "auth.signup.subtitle": "Füllen Sie Ihre Daten aus, um loszulegen",
  "auth.email": "E-Mail-Adresse",
  "auth.password": "Passwort",
  "auth.fullName": "Vollständiger Name",
  "auth.confirmPassword": "Passwort bestätigen",
  "auth.forgot": "Passwort vergessen?",
  "auth.signin.cta": "Anmelden",
  "auth.signup.cta": "Konto erstellen",
  "auth.noAccount": "Noch kein Konto?",
  "auth.createLink": "Konto erstellen",
  "auth.hasAccount": "Bereits ein Konto?",
  "auth.signinLink": "Anmelden",
  "auth.error.fallback": "Ungültige Zugangsdaten. Bitte versuchen Sie es erneut.",
  "auth.error.required": "Alle Felder sind erforderlich.",
  "auth.error.mismatch": "Passwörter stimmen nicht überein.",
  "auth.error.short": "Das Passwort muss mindestens 8 Zeichen lang sein.",
  "auth.success": "Konto erfolgreich erstellt! Weiterleitung zur Anmeldung...",
};

const ja = {
  "nav.install": "アプリをインストール",
  "nav.logout": "ログアウト",
  "nav.language": "言語を選択",
  "nav.error.network": "ネットワークの問題により、今はログアウトできません。",

  "dock.home": "ホーム",
  "dock.book": "予約",
  "dock.track": "追跡",

  "stats.flightsDaily": "毎日の便",
  "stats.support": "サポート",
  "stats.uptime": "稼働率",

  "home.badge": "⭐ 4.9/5 — 5万人以上の旅行者が評価",
  "home.hero.title1": "あなたの旅を",
  "home.hero.title2": "特別に",
  "home.hero.subtitle":
    "安心して空の旅を。リアルタイムで追跡。世界500以上の就航都市でプレミアムなサービスをご体験ください。",
  "home.stat.destinations": "就航都市",
  "home.stat.support": "サポート",
  "home.stat.ontime": "定時運航率",
  "home.stat.travelers": "利用者",
  "home.cta.book": "便を予約",
  "home.cta.track": "便を追跡",
  "home.trust.price": "最安値保証",
  "home.trust.secure": "安全な予約",
  "home.scroll": "スクロールして探索",

  "home.booking.title": "フライトを予約",
  "home.form.from": "出発地",
  "home.form.fromPh": "例: JKIA",
  "home.form.to": "到着地",
  "home.form.toPh": "例: CGK",
  "home.form.date": "出発日",
  "home.form.search": "フライトを検索",

  "home.dest.chip": "🌍 世界の目的地",
  "home.dest.title": "人気の世界旅行先",
  "home.dest.subtitle": "世界中のおすすめ航空券のお得情報を見つけよう",
  "home.dest.viewAll": "すべて表示 →",
  "home.dest.deals": "{count} 件の特典",
  "home.dest.airport": "空港",

  "home.flights.title": "運航中のフライト",
  "home.flights.showing": "{total} 便中 {shown} 便を表示",
  "home.flights.fromChip": "出発: {value}",
  "home.flights.toChip": "到着: {value}",
  "home.flights.clear": "検索をクリア",
  "home.flights.noMatch": "検索に一致するフライトはありません",
  "home.flights.noMatchHint":
    "別の空港コードを試すか、フィルターをクリアしてすべての路線をご確認ください。",

  "home.features.title": "American Airlinesが選ばれる理由",
  "home.feature.instant.title": "即時予約",
  "home.feature.instant.desc": "数分で確定チケットを取得",
  "home.feature.flexible.title": "柔軟なキャンセル",
  "home.feature.flexible.desc": "24時間前まで無料でキャンセル可能",
  "home.feature.price.title": "最安値保証",
  "home.feature.price.desc": "より安い価格があれば合わせます",
  "home.feature.app.title": "モバイルアプリ",
  "home.feature.app.desc": "外出先でも予約・追跡",

  "flight.from": "〜から",
  "flight.book": "予約",

  "auth.welcome": "おかえりなさい！",
  "auth.welcomeBlurb":
    "セキュアなエンタープライズプラットフォームで、ダッシュボードへのアクセス、フライトの管理、運航状況の追跡ができます。",
  "auth.join": "コミュニティに参加しよう！",
  "auth.joinBlurb":
    "アカウントを作成して限定の航空券特典へのアクセス、旅程の追跡、American Airlinesのプレミアムサービスをご利用ください。",
  "auth.signin.title": "サインイン",
  "auth.signin.subtitle": "アカウントにアクセスするには認証情報を入力してください",
  "auth.signup.title": "アカウント作成",
  "auth.signup.subtitle": "必要事項を入力して始めましょう",
  "auth.email": "メールアドレス",
  "auth.password": "パスワード",
  "auth.fullName": "氏名",
  "auth.confirmPassword": "パスワード（確認）",
  "auth.forgot": "パスワードをお忘れですか？",
  "auth.signin.cta": "サインイン",
  "auth.signup.cta": "アカウントを作成",
  "auth.noAccount": "アカウントをお持ちでないですか？",
  "auth.createLink": "アカウント作成",
  "auth.hasAccount": "すでにアカウントをお持ちですか？",
  "auth.signinLink": "サインイン",
  "auth.error.fallback": "認証情報が正しくありません。もう一度お試しください。",
  "auth.error.required": "すべての項目を入力してください。",
  "auth.error.mismatch": "パスワードが一致しません。",
  "auth.error.short": "パスワードは8文字以上で入力してください。",
  "auth.success": "アカウントを作成しました！ログイン画面に移動しています...",
};

const zh = {
  "nav.install": "安装应用",
  "nav.logout": "退出登录",
  "nav.language": "选择语言",
  "nav.error.network": "网络异常，暂时无法退出登录。",

  "dock.home": "首页",
  "dock.book": "预订",
  "dock.track": "追踪",

  "stats.flightsDaily": "每日航班",
  "stats.support": "支持",
  "stats.uptime": "在线率",

  "home.badge": "⭐ 4.9/5 — 超过 5 万旅客好评",
  "home.hero.title1": "开启您的",
  "home.hero.title2": "非凡旅程体验",
  "home.hero.subtitle": "安心出行，实时追踪。在全球 500 多个目的地畅享尊贵服务。",
  "home.stat.destinations": "目的地",
  "home.stat.support": "支持",
  "home.stat.ontime": "准点率",
  "home.stat.travelers": "满意旅客",
  "home.cta.book": "预订航班",
  "home.cta.track": "追踪航班",
  "home.trust.price": "最优价格保证",
  "home.trust.secure": "安全预订",
  "home.scroll": "下滑探索",

  "home.booking.title": "预订您的航班",
  "home.form.from": "出发地",
  "home.form.fromPh": "例如：JKIA",
  "home.form.to": "目的地",
  "home.form.toPh": "例如：CGK",
  "home.form.date": "出发日期",
  "home.form.search": "搜索航班",

  "home.dest.chip": "🌍 全球目的地",
  "home.dest.title": "全球热门目的地",
  "home.dest.subtitle": "发现全球超值航班优惠",
  "home.dest.viewAll": "查看全部 →",
  "home.dest.deals": "{count} 个优惠",
  "home.dest.airport": "机场",

  "home.flights.title": "可用航班",
  "home.flights.showing": "显示 {total} 个航班中的 {shown} 个",
  "home.flights.fromChip": "出发地：{value}",
  "home.flights.toChip": "目的地：{value}",
  "home.flights.clear": "清除搜索",
  "home.flights.noMatch": "没有符合搜索条件的航班",
  "home.flights.noMatchHint": "请尝试其他机场代码，或清除筛选条件查看所有可用航线。",

  "home.features.title": "为什么选择美国航空？",
  "home.feature.instant.title": "即时预订",
  "home.feature.instant.desc": "几分钟内拿到确认机票",
  "home.feature.flexible.title": "灵活取消",
  "home.feature.flexible.desc": "24 小时内免费取消",
  "home.feature.price.title": "最优价格保证",
  "home.feature.price.desc": "发现更低价格即为您匹配",
  "home.feature.app.title": "移动应用",
  "home.feature.app.desc": "随时随地预订和追踪航班",

  "flight.from": "低至",
  "flight.book": "预订",

  "auth.welcome": "欢迎回来！",
  "auth.welcomeBlurb": "通过我们安全的企业平台访问您的控制台、管理航班并追踪 American Airlines 的运营信息。",
  "auth.join": "加入我们的社区！",
  "auth.joinBlurb": "创建账户，享受独家机票优惠、追踪您的旅程并体验 American Airlines 尊贵服务。",
  "auth.signin.title": "登录",
  "auth.signin.subtitle": "输入您的凭据以访问账户",
  "auth.signup.title": "创建账户",
  "auth.signup.subtitle": "填写您的信息即可开始",
  "auth.email": "电子邮箱",
  "auth.password": "密码",
  "auth.fullName": "姓名",
  "auth.confirmPassword": "确认密码",
  "auth.forgot": "忘记密码？",
  "auth.signin.cta": "登录",
  "auth.signup.cta": "创建账户",
  "auth.noAccount": "还没有账户？",
  "auth.createLink": "创建账户",
  "auth.hasAccount": "已经有账户了？",
  "auth.signinLink": "登录",
  "auth.error.fallback": "凭据无效，请重试。",
  "auth.error.required": "所有字段均为必填项。",
  "auth.error.mismatch": "两次输入的密码不一致。",
  "auth.error.short": "密码长度至少为 8 个字符。",
  "auth.success": "账户创建成功！正在跳转到登录页...",
};

// Dictionary key === LOCALES entry's `code`.
export const dictionaries = {
  US: enUS,
  GB: enGB,
  ES: es,
  FR: fr,
  DE: de,
  JP: ja,
  CN: zh,
};

export const LocaleContext = createContext(null);

/**
 * Translate `key` in the given dictionary, falling back to en-US and finally
 * to the key itself. `vars` fills `{name}` placeholders.
 */
export const translate = (dict, key, vars) => {
  let text = dict?.[key] ?? enUS[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside <LocaleProvider>");
  }
  return context;
};

/**
 * ---------- First-visit language detection ----------
 *
 * Someone who has never chosen a language should get one that matches their
 * browser — a French browser opens in French rather than English. This is only
 * the starting point: a saved choice always outranks it.
 */

/** Regions that use British spelling, for the two English locales on offer. */
const BRITISH_ENGLISH_REGIONS = ["gb", "au", "nz", "ie", "za", "in"];

/** Regions whose Chinese is Simplified — the only Chinese the app ships. */
const SIMPLIFIED_CHINESE_REGIONS = ["cn", "sg", "my", "hans"];

/**
 * Match one BCP-47 tag ("fr-CA", "en-GB", "zh-Hant") to a locale code, or null
 * when nothing on offer fits.
 *
 * Region only decides the two languages that have more than one variant here —
 * English and Chinese. For every other language it is ignored, so "es-419"
 * still finds Español and "de-AT" still finds Deutsch.
 */
export const matchLocaleTag = (tag) => {
  if (!tag || typeof tag !== "string") return null;
  const normalized = tag.trim().toLowerCase().replace(/_/g, "-");
  if (!normalized) return null;

  const exact = LOCALES.find((entry) => entry.tag.toLowerCase() === normalized);
  if (exact) return exact.code;

  const [language, region] = normalized.split("-");
  if (language === "en") {
    return BRITISH_ENGLISH_REGIONS.includes(region) ? "GB" : "US";
  }
  if (language === "zh") {
    // zh-TW / zh-HK / zh-Hant is Traditional, which the app doesn't carry.
    return region === undefined || SIMPLIFIED_CHINESE_REGIONS.includes(region) ? "CN" : null;
  }

  const sameLanguage = LOCALES.find((entry) => entry.tag.toLowerCase().split("-")[0] === language);
  return sameLanguage ? sameLanguage.code : null;
};

/** The first supported locale among the browser's preferences, or null. */
export const detectLocale = (preferred) => {
  if (!Array.isArray(preferred)) return null;
  for (const tag of preferred) {
    const code = matchLocaleTag(tag);
    if (code) return code;
  }
  return null;
};

/**
 * The locale to start in: an explicit saved choice, else the browser's
 * preference, else en-US.
 *
 * It takes its inputs rather than reading globals, so the precedence — and the
 * whole tag-matching table — can be exercised without a browser.
 */
export const resolveInitialLocale = ({ stored, preferred } = {}) => {
  const saved = LOCALES.some((entry) => entry.code === stored) ? stored : null;
  return saved ?? detectLocale(preferred) ?? LOCALES[0].code;
};
