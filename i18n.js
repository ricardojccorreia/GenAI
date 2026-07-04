/* ============================================================================
   i18n — traduções da interface (PT / EN) para index.html e pedido.html
   ----------------------------------------------------------------------------
   O idioma é escolhido por:
     1. parâmetro ?lang=pt|en no URL (útil nos links do LinkedIn);
     2. senão, a última escolha guardada (localStorage);
     3. senão, o idioma do browser (en → inglês, restante → português).
   ========================================================================== */

const STRINGS = {
  pt: {
    role:        "Professor de Informática Médica · FMUP / MEDCIDS · Universidade do Porto",
    tagline:     "Apresentações e materiais de formação em Inteligência Artificial e Saúde Digital. Pode consultar os materiais públicos ou pedir uma apresentação — recebe-a por email com uma proposta de citação.",
    pub_h:       "📂 Materiais públicos",
    pub_note:    "Acesso direto, sem necessidade de pedido.",
    form_h:      "✉️ Apresentações a pedido",
    form_note:   "Preencha um formulário curto (30 segundos) e recebe o ficheiro por email, com a citação sugerida. Assim consigo saber quem usa os materiais e como.",
    badge_pub:   "Público",
    badge_form:  "A pedido",
    cta_open:    "Abrir →",
    cta_req:     "Pedir apresentação →",

    page_title:  "Pedir apresentação",
    back_all:    "← voltar a todas as apresentações",
    get_h:       "Receber a apresentação",
    get_sub:     "Preencha os campos abaixo e recebe o ficheiro por email em poucos minutos.",
    req_label:   "Apresentação:",
    f_name:      "Nome",
    f_email:     "Email",
    f_org:       "Instituição / organização",
    f_use:       "Como pretende usar a apresentação?",
    hint_req:    "(obrigatório)",
    hint_opt:    "(opcional)",
    hint_email:  "(para onde enviamos o ficheiro)",
    use_ph:      "Ex.: aula, formação interna, referência num artigo, partilha com colegas…",
    consent:     "Autorizo o registo do meu nome, email e finalidade indicada, para acompanhamento da utilização dos materiais. Os dados não são partilhados com terceiros.",
    btn_send:    "Receber por email",
    btn_sending: "A enviar…",
    err_fields:  "Preencha o nome, email, finalidade e a autorização.",
    err_config:  "Configuração pendente: falta o URL do Apps Script (CONFIG.appsScriptUrl em catalog.js).",
    err_generic: "Ocorreu um erro. Tente novamente ou escreva para",
    ok_h:        "Pedido registado!",
    ok_sub_a:    "Vai receber",
    ok_sub_b:    "no email indicado dentro de poucos minutos. Verifique também a pasta de spam.",
    ok_default:  "a apresentação",
    ok_cite:     "Como citar esta apresentação:",
    back_list:   "← voltar às apresentações",
    nf_h:        "Apresentação não encontrada",
    nf_sub:      "O link parece incompleto. Veja a lista de apresentações disponíveis.",
    nf_btn:      "Ver apresentações"
  },
  en: {
    role:        "Professor of Medical Informatics · FMUP / MEDCIDS · University of Porto",
    tagline:     "Presentations and training materials on Artificial Intelligence and Digital Health. Browse the public materials or request a presentation — you'll receive it by email with a suggested citation.",
    pub_h:       "📂 Public materials",
    pub_note:    "Direct access, no request needed.",
    form_h:      "✉️ Presentations on request",
    form_note:   "Fill in a short form (30 seconds) and receive the file by email, with a suggested citation. This lets me know who uses the materials and how.",
    badge_pub:   "Public",
    badge_form:  "On request",
    cta_open:    "Open →",
    cta_req:     "Request presentation →",

    page_title:  "Request presentation",
    back_all:    "← back to all presentations",
    get_h:       "Get the presentation",
    get_sub:     "Fill in the fields below and receive the file by email within minutes.",
    req_label:   "Presentation:",
    f_name:      "Name",
    f_email:     "Email",
    f_org:       "Institution / organisation",
    f_use:       "How do you plan to use the presentation?",
    hint_req:    "(required)",
    hint_opt:    "(optional)",
    hint_email:  "(where we'll send the file)",
    use_ph:      "E.g. teaching, internal training, a reference in an article, sharing with colleagues…",
    consent:     "I consent to my name, email and stated purpose being recorded to track how the materials are used. The data is not shared with third parties.",
    btn_send:    "Get it by email",
    btn_sending: "Sending…",
    err_fields:  "Please fill in your name, email, purpose and consent.",
    err_config:  "Setup pending: the Apps Script URL is missing (CONFIG.appsScriptUrl in catalog.js).",
    err_generic: "Something went wrong. Please try again or write to",
    ok_h:        "Request received!",
    ok_sub_a:    "You'll receive",
    ok_sub_b:    "at the email address you provided within a few minutes. Please also check your spam folder.",
    ok_default:  "the presentation",
    ok_cite:     "How to cite this presentation:",
    back_list:   "← back to presentations",
    nf_h:        "Presentation not found",
    nf_sub:      "The link looks incomplete. See the list of available presentations.",
    nf_btn:      "See presentations"
  }
};

// Tradução de etiquetas (tags)
const TAGS_EN = {
  "Formação": "Training",
  "Saúde Digital": "Digital Health",
  "Educação": "Education"
  // "GenAI" mantém-se
};

function getLang() {
  const p = new URLSearchParams(location.search).get("lang");
  if (p === "en" || p === "pt") { try { localStorage.setItem("site_lang", p); } catch (e) {} return p; }
  let s = null;
  try { s = localStorage.getItem("site_lang"); } catch (e) {}
  if (s === "en" || s === "pt") return s;
  // Por defeito, mostra em inglês, a não ser que o browser esteja em português.
  return (navigator.language || "en").toLowerCase().startsWith("pt") ? "pt" : "en";
}

// Muda de idioma recarregando a página com ?lang=… (preserva ?slides)
function switchLang(lang) {
  try { localStorage.setItem("site_lang", lang); } catch (e) {}
  const u = new URL(location.href);
  u.searchParams.set("lang", lang);
  location.href = u.toString();
}

function t(key) {
  const L = getLang();
  return (STRINGS[L] && STRINGS[L][key] != null) ? STRINGS[L][key] : (STRINGS.pt[key] || "");
}

// Campo de apresentação com variante _en (ex.: title / title_en)
function pField(p, field) {
  const L = getLang();
  if (L === "en" && p[field + "_en"] != null) return p[field + "_en"];
  // Caso especial para a citação: gerar se não existir
  if (field === 'citation') {
    if (L === 'en' && p.citation_en) return p.citation_en;
    if (L === 'pt' && p.citation) return p.citation;
    // Se não houver citação específica, gera uma por defeito
    return generateCitation(p, L);
  }

  return p[field] || '';
}

function pTags(p) {
  const L = getLang();
  return (p.tags || []).map(function (tag) {
    return (L === "en" && TAGS_EN[tag]) ? TAGS_EN[tag] : tag;
  });
}

// Aplica textos a todos os [data-i18n], [data-i18n-ph], [data-i18n-html]
function applyI18n(root) {
  root = root || document;
  root.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
  root.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
  root.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
  document.documentElement.lang = getLang();
  // estado visual do seletor de idioma
  root.querySelectorAll("[data-lang-btn]").forEach(function (el) {
    el.classList.toggle("active", el.getAttribute("data-lang-btn") === getLang());
  });
}
