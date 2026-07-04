# Registo de pedidos de apresentações — montagem

Sistema: página no GitHub Pages (índice + formulário) → Google Apps Script →
Google Sheet (registo) + email automático com o link de download e a citação.

**Regra de ouro:** o link de download de cada apresentação "a pedido" vive
**só** no Apps Script (`apps-script/Code.gs`), nunca no site público. É isso que
obriga a preencher o formulário antes de receber o ficheiro.

---

## Ficheiros do repositório

| Ficheiro | Papel |
|---|---|
| `index.html` | Índice/hub: lista materiais públicos e "a pedido" (bilingue PT/EN) |
| `pedido.html` | Formulário (abre com `?slides=<id>`, bilingue PT/EN) |
| `catalog.js` | **Fonte única** dos dados públicos + `CONFIG.appsScriptUrl` |
| `i18n.js` | Traduções da interface (PT/EN) |
| `style.css` | Estilos |
| `workshop.html` / `workshop_v2.html` | Deck público "IA no Trabalho Administrativo" (mantém-se em português) |
| `apps-script/Code.gs` | Backend (Sheet + email). **Não** vai para o GitHub Pages; é colado no Apps Script |

### Idiomas (PT / EN)

O índice e o formulário são bilingues. O idioma é escolhido por: `?lang=pt` ou
`?lang=en` no URL → senão a última escolha guardada → senão o idioma do browser.
Há um seletor **PT | EN** no canto superior direito. O email de entrega sai no
idioma em que o formulário foi preenchido. Para partilhar em inglês no LinkedIn,
usa `.../pedido.html?slides=<id>&lang=en`. O deck da U.Porto (`workshop.html`)
mantém-se só em português, como pedido.

Ao adicionar uma apresentação, no `catalog.js` podes juntar as variantes em
inglês: `title_en`, `event_en`, `citation_en` (se as omitires, usa o PT).

---

## Passo 1 — Criar a Google Sheet (registo)

1. Em [sheets.new](https://sheets.new) cria uma folha, ex.: **"Pedidos de apresentações"**.
2. Copia o **ID** do URL: `docs.google.com/spreadsheets/d/`**`ID`**`/edit`.
   (Os cabeçalhos são criados automaticamente no primeiro pedido.)

## Passo 2 — Publicar o Apps Script

1. Vai a [script.google.com](https://script.google.com) → **Novo projeto**.
2. Apaga o conteúdo e cola tudo o que está em `apps-script/Code.gs`.
3. No topo do ficheiro, edita:
   - `SHEET_ID` → o ID do Passo 1.
   - `NOTIFY_EMAIL` → o teu email (ou `""` para não receber notificação).
   - `DOWNLOAD_LINKS` → para cada `id` de apresentação, o link de partilha do Drive.
4. Guarda. **Implementar → Nova implementação → Tipo: App Web**:
   - *Executar como:* **Eu**.
   - *Quem tem acesso:* **Qualquer pessoa**.
   - Clica **Implementar**, autoriza (aparece um aviso do Google — normal, é a tua conta).
5. Copia o **URL da app Web** (termina em `/exec`).

## Passo 3 — Ligar a página ao backend

1. Em `catalog.js`, no topo, cola o URL no `CONFIG.appsScriptUrl`.
2. Confirma que cada apresentação "a pedido" tem uma entrada com o mesmo `id`
   em `catalog.js` **e** em `DOWNLOAD_LINKS` (no `Code.gs`).

## Passo 4 — Publicar no GitHub Pages

1. `git add . && git commit -m "Índice + formulário de pedidos" && git push`
2. No GitHub: **Settings → Pages** → Branch `main` / `/root` (se ainda não estiver).
3. Fica em `https://ricardojccorreia.github.io/GenAI/`.

## Passo 5 — Testar

1. Abre `https://ricardojccorreia.github.io/GenAI/pedido.html?slides=ufba-2026-06-03`.
2. Preenche com o teu email → confirma que:
   - aparece uma linha nova na Google Sheet;
   - recebes o email com o link + citação.

---

## Preparar cada Drive de apresentação

> Os ficheiros dos slides "a pedido" ficam na pasta local `slides-privados/`
> (está no `.gitignore` — **nunca** vai para o GitHub). Ver `slides-privados/README.md`.
> Já lá está: `icimth-2026-ai-health-education.pptx`.

1. Sobe o `.pptx` (ou PDF) de `slides-privados/` para o Google Drive.
2. **Partilhar → Qualquer pessoa com o link → Leitor**.
3. Copia o link e cola-o no `DOWNLOAD_LINKS`, com o `id` certo — **na versão do
   `Code.gs` que está no editor do Apps Script**, não no ficheiro do repositório
   (o repo é público; o link real deixaria de ser privado).
   > O link é "não listado": só quem o recebe por email lhe chega. Se quiseres
   > controlo total, mantém "Restrito" e concede acesso manualmente — mas aí o
   > email chega sem download imediato.

---

## Adicionar uma nova apresentação (checklist)

Para cada apresentação nova, no LinkedIn partilhas um ou dois slides e o link
`.../pedido.html?slides=<id>`. Antes disso:

1. **`catalog.js`** — nova entrada em `PRESENTATIONS`:
   - `access: "form"` (a pedido) ou `"public"` (link direto).
   - define `id`, `title`, `event`, `date`, `tags`, `citation`.
2. **`Code.gs`** — se `access:"form"`, adiciona `"<id>": "<link Drive>"` em `DOWNLOAD_LINKS`
   e reimplementa (Implementar → Gerir implementações → editar → nova versão).
3. `git commit && git push`.
4. Link para o LinkedIn: `https://ricardojccorreia.github.io/GenAI/pedido.html?slides=<id>`

---

## Notas

- **Privacidade (RGPD):** o formulário pede consentimento explícito e diz que os
  dados não são partilhados. Guardas nome/email/finalidade numa folha tua. Se
  quiseres, acrescenta um período de retenção.
- **Envio "fire-and-forget":** a página não lê a resposta do Apps Script (evita
  problemas de CORS); o registo e o email acontecem à mesma no servidor. Por isso
  a citação é mostrada a partir de `catalog.js` (é pública), e só o link fica no servidor.
- **Limite de emails:** contas Gmail normais permitem ~100 emails/dia via Apps
  Script — mais do que suficiente.
