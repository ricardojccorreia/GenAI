/* ============================================================================
   BACKEND — Registo de pedidos de apresentações + envio automático por email
   ----------------------------------------------------------------------------
   Google Apps Script (script.google.com). Ver instruções em SETUP.md.

   O que faz, quando alguém submete o formulário (pedido.html):
     1. Grava uma linha na Google Sheet: data, nome, email, instituição, uso, id.
     2. Envia ao requerente um email com o LINK DE DOWNLOAD + citação sugerida.
     3. (Opcional) Notifica o Ricardo de cada novo pedido.

   IMPORTANTE: os links de download vivem SÓ aqui (servidor), nunca no site
   público. É isto que faz o formulário "travar" o acesso.
   ========================================================================== */

/* ----------------------------- CONFIGURAÇÃO ------------------------------ */

// ID da Google Sheet onde os pedidos são registados.
// (Está no URL da folha: docs.google.com/spreadsheets/d/<ISTO_AQUI>/edit)
const SHEET_ID = "1cDuBS7EOKxGN0T89ZVYBhec-Hn18rnPPDQSZCsi8xnE";

// Nome da aba/folha dentro da Sheet.
const SHEET_NAME = "Pedidos";

// Email que recebe a notificação de cada pedido (deixa "" para não notificar).
const NOTIFY_EMAIL = "o.seu.email@exemplo.com"; // TODO: Substituir pelo seu email

// Nome que aparece como remetente nos emails enviados.
const SENDER_NAME = "Ricardo Correia";

// Catálogo PRIVADO: para cada "id" (igual ao de catalog.js), o link de download.
// Adicionar aqui uma entrada por cada apresentação "a pedido".
//
// ⚠️ Os links REAIS só devem ser colados na versão que vive no editor do
//    Apps Script (script.google.com). NÃO faças commit dos links reais neste
//    ficheiro: o repositório GitHub é público e o link deixaria de ser privado.
//    No repositório, deixa sempre os placeholders.
const DOWNLOAD_LINKS = { // TODO: Substituir pelos seus links de partilha do Google Drive
  "ufba-2026-06-03": "COLA_AQUI_O_LINK_DE_PARTILHA_DO_DRIVE_PARA_UFBA",
  "icimth-2026-ai-health-education": "COLA_AQUI_O_LINK_DE_PARTILHA_DO_DRIVE_PARA_ICIMTH"
  // "outro-id": "https://drive.google.com/file/d/.../view?usp=sharing"
};

/* ------------------------------- ENDPOINT -------------------------------- */

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};
    const nome        = (p.nome        || "").toString().trim();
    const email       = (p.email       || "").toString().trim();
    const instituicao = (p.instituicao || "").toString().trim();
    const uso         = (p.uso         || "").toString().trim();
    const slides      = (p.slides      || "").toString().trim();
    const citation    = (p.citation    || "").toString().trim();
    const origem      = (p.origem      || "").toString().trim();
    const lang        = (p.lang === "en") ? "en" : "pt";

    if (!nome || !email || !uso || !slides) {
      return json_({ ok: false, error: "Campos em falta." });
    }
    if (!isEmail_(email)) {
      return json_({ ok: false, error: "Email inválido." });
    }

    const downloadUrl = DOWNLOAD_LINKS[slides] || "";

    // 1) Registar na Sheet
    appendRow_([
      new Date(), nome, email, instituicao, uso, slides,
      downloadUrl ? "enviado" : "SEM LINK", origem
    ]);

    // 2) Enviar email ao requerente (se houver link)
    if (downloadUrl) {
      sendRequesterEmail_(email, nome, slides, downloadUrl, citation, lang);
    }

    // 3) Notificar o Ricardo
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "Novo pedido de apresentação: " + slides,
        name: SENDER_NAME,
        body: [
          "Novo pedido registado.",
          "",
          "Apresentação: " + slides,
          "Nome: " + nome,
          "Email: " + email,
          "Instituição: " + (instituicao || "—"),
          "Uso: " + uso,
          "Link enviado: " + (downloadUrl ? "sim" : "NÃO — falta link para este id"),
          "Origem: " + origem
        ].join("\n")
      });
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Teste rápido no browser (GET) — confirma que a Web App está no ar.
function doGet() {
  return HtmlService.createHtmlOutput(
    "<p>Serviço de pedidos activo.</p>"
  );
}

/* ------------------------------- HELPERS --------------------------------- */

// Textos do email nos dois idiomas
const EMAIL_STR = {
  pt: {
    subject: "A sua apresentação: ",
    hi:      "Olá ",
    intro:   "Obrigado pelo interesse. Pode descarregar a apresentação aqui:",
    btn:     "Descarregar apresentação",
    fallback:"Se o botão não funcionar: ",
    cite:    "Se usar os materiais, agradeço a citação:",
    sign:    "Com os melhores cumprimentos,"
  },
  en: {
    subject: "Your presentation: ",
    hi:      "Hi ",
    intro:   "Thanks for your interest. You can download the presentation here:",
    btn:     "Download presentation",
    fallback:"If the button doesn't work: ",
    cite:    "If you use the materials, please cite as:",
    sign:    "Kind regards,"
  }
};

function sendRequesterEmail_(email, nome, slides, downloadUrl, citation, lang) {
  const s = EMAIL_STR[lang] || EMAIL_STR.pt;
  const primeiroNome = nome.split(" ")[0];
  const subject = s.subject + slides;

  const html =
    '<div style="font-family:Segoe UI,Arial,sans-serif;color:#16324f;line-height:1.6;">' +
      '<p>' + s.hi + escapeHtml_(primeiroNome) + ',</p>' +
      '<p>' + s.intro + '</p>' +
      '<p><a href="' + downloadUrl + '" ' +
        'style="background:#0891B2;color:#fff;padding:10px 18px;border-radius:8px;' +
        'text-decoration:none;font-weight:bold;">' + s.btn + '</a></p>' +
      '<p style="font-size:13px;color:#5b7089;word-break:break-all;">' +
        s.fallback + downloadUrl + '</p>' +
      (citation
        ? '<p style="margin-top:22px;"><strong>' + s.cite + '</strong></p>' +
          '<p style="background:#f7f9fc;border-left:3px solid #F59E0B;padding:10px 14px;' +
          'border-radius:6px;font-size:14px;">' + citation + '</p>'
        : '') +
      '<p style="margin-top:22px;">' + s.sign + '<br>Ricardo Correia<br>' +
        '<span style="color:#5b7089;font-size:13px;">FMUP / MEDCIDS · Universidade do Porto</span></p>' +
    '</div>';

  const plain =
    s.hi + primeiroNome + ",\n\n" +
    s.intro + "\n" + downloadUrl + "\n\n" +
    (citation ? s.cite + "\n" + stripHtml_(citation) + "\n\n" : "") +
    s.sign + "\nRicardo Correia\nFMUP / MEDCIDS · Universidade do Porto";

  MailApp.sendEmail({
    to: email,
    subject: subject,
    name: SENDER_NAME,
    body: plain,
    htmlBody: html
  });
}

function appendRow_(row) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(["Data", "Nome", "Email", "Instituição", "Como pretende usar",
                  "Apresentação (id)", "Estado", "Origem"]);
    sh.getRange(1, 1, 1, 8).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  sh.appendRow(row);
}

function isEmail_(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
function json_(obj)  { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function escapeHtml_(s){ return String(s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function stripHtml_(s){ return String(s).replace(/<[^>]*>/g, ""); }
