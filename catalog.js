/* ============================================================================
   CATÁLOGO DE APRESENTAÇÕES  —  fonte única dos dados PÚBLICOS
   ----------------------------------------------------------------------------
   Editar este ficheiro para adicionar/alterar apresentações no índice e no
   formulário. NUNCA colocar aqui o link de download das apresentações "por
   pedido": esse link vive só no Apps Script (Code.gs), no servidor.

   Campos:
     id       -> identificador único e estável (usado no URL ?slides=ID e no Code.gs)
     title    -> título da apresentação
     event    -> onde/para quem foi apresentada
     date     -> "AAAA-MM-DD"
     access   -> "public"  (link direto)  |  "form"  (só após preencher pedido)
     url      -> só para access:"public" — ficheiro/URL do conteúdo público
     tags     -> etiquetas curtas (opcional)
     citation -> proposta de citação (mostrada na página e enviada no email)
   ========================================================================== */

const CONFIG = {
  // Cola aqui o URL da Web App do Apps Script depois de a publicares.
  // Ex.: "https://script.google.com/macros/s/AKfycb..../exec"
  // Substitui pelo URL da tua implementação do Google Apps Script.
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbzMsL-bJCm8qouiiky_m1p_3CGQLeD4P-ldsRL6Xn_-oc5c-QstGOINspnqm3XmQBFp5Q/exec",

  // Base pública do site (usada nas citações por defeito)
  // Substitui <SEU-USER> e <SEU-REPO> pelos teus dados do GitHub.
  siteUrl: "https://<SEU-USER>.github.io/<SEU-REPO>/", // TODO: Substituir
  author:  "O Teu Nome (Sobrenome, N.)" // TODO: Substituir
};

const PRESENTATIONS = [
  {
    id:    "u-porto-admin-2026-06-16",
    title: "IA no Trabalho Administrativo",
    title_en: "AI in Administrative Work",
    event: "Universidade do Porto",
    event_en: "University of Porto",
    date:  "2026-06-16",
    access: "public",
    url:   "workshop.html",
    tags:  ["GenAI", "Formação"]
    // A citação será gerada automaticamente a partir dos campos acima.
    // Podes adicionar uma `citation` ou `citation_en` aqui para substituir a automática.
  },

  /* ---- EXEMPLO de apresentação "por pedido" (editar / substituir) ----
     Para o conteúdo novo: sem "url" público. O download é enviado por email
     pelo Apps Script, que guarda o link privado associado a este mesmo "id". */
  {
    id:    "ufba-2026-06-03",
    title: "GenAI na Saúde",
    title_en: "GenAI in Healthcare",
    event: "Universidade Federal da Bahia",
    event_en: "Federal University of Bahia",
    date:  "2026-06-03",
    access: "form",
    tags:  ["GenAI", "Saúde Digital"],
  },

  {
    id:    "icimth-2026-ai-health-education",
    title: "IA na Educação em Saúde",
    title_en: "AI in Health Education",
    event: "ICIMTH 2026 · Atenas (palestra convidada)",
    event_en: "ICIMTH 2026 · Athens (invited talk)",
    date:  "2026-07-03",
    access: "form",
    tags:  ["GenAI", "Educação"],
    // Exemplo de citação manual para casos mais complexos.
    citation: 'Correia, R. J. C. (2026). <i>IA na Educação em Saúde</i> [Apresentação convidada]. ICIMTH 2026 — International Conference on Informatics, Management and Technology in Healthcare, Atenas, Grécia. ' + CONFIG.siteUrl,
    citation_en: 'Correia, R. J. C. (2026). <i>AI in Health Education</i> [Invited presentation]. ICIMTH 2026 — International Conference on Informatics, Management and Technology in Healthcare, Athens, Greece. ' + CONFIG.siteUrl
  }
];

/* ---- utilidades partilhadas ---- */

// Gera uma citação por defeito se não for fornecida.
function generateCitation(p, lang = 'pt') {
  const year = p.date.substring(0, 4);
  const author = CONFIG.author;
  const siteUrl = CONFIG.siteUrl;

  if (lang === 'en') {
    const title = p.title_en || p.title;
    const event = p.event_en || p.event;
    return `${author} (${year}). <i>${title}</i> [Presentation slides]. ${event}. ${siteUrl}`;
  }
  
  const title = p.title;
  const event = p.event;
  return `${author} (${year}). <i>${title}</i> [Apresentação]. ${event}. ${siteUrl}`;
}

function getPresentation(id) {
  const p = PRESENTATIONS.find(p => p.id === id);
  if (!p) return null;
  // Adiciona citações geradas se não existirem
  return { ...p }; // Retorna uma cópia para não modificar o original
}
function fmtDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${d} ${meses[parseInt(m,10)-1]} ${y}`;
}
