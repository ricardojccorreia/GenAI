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
  appsScriptUrl: "PASTE_YOUR_WEB_APP_URL_HERE",

  // Base pública do site (usada nas citações por defeito)
  siteUrl: "https://ricardojccorreia.github.io/GenAI/",
  author:  "Correia, R. J. C."
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
    tags:  ["GenAI", "Formação"],
    citation: 'Correia, R. J. C. (2026). <i>IA no Trabalho Administrativo</i> [Apresentação]. Universidade do Porto. https://ricardojccorreia.github.io/GenAI/',
    citation_en: 'Correia, R. J. C. (2026). <i>AI in Administrative Work</i> [Presentation slides]. University of Porto. https://ricardojccorreia.github.io/GenAI/'
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
    citation: 'Correia, R. J. C. (2026). <i>GenAI na Saúde</i> [Apresentação]. Universidade Federal da Bahia. https://ricardojccorreia.github.io/GenAI/',
    citation_en: 'Correia, R. J. C. (2026). <i>GenAI in Healthcare</i> [Presentation slides]. Federal University of Bahia. https://ricardojccorreia.github.io/GenAI/'
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
    citation: 'Correia, R. J. C. (2026). <i>IA na Educação em Saúde</i> [Apresentação convidada]. ICIMTH 2026 — International Conference on Informatics, Management and Technology in Healthcare, Atenas, Grécia. https://ricardojccorreia.github.io/GenAI/',
    citation_en: 'Correia, R. J. C. (2026). <i>AI in Health Education</i> [Invited presentation]. ICIMTH 2026 — International Conference on Informatics, Management and Technology in Healthcare, Athens, Greece. https://ricardojccorreia.github.io/GenAI/'
  }
];

/* ---- utilidades partilhadas ---- */
function getPresentation(id) {
  return PRESENTATIONS.find(p => p.id === id) || null;
}
function fmtDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${d} ${meses[parseInt(m,10)-1]} ${y}`;
}
