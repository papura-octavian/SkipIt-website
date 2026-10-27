# skipit-requests (Cloudflare Worker)

Primeste formularul "Request a tool" de pe skipit.space si il trimite pe email prin **Resend**.

Site-ul trimite la adresa din `REQUEST_ENDPOINT` (`lib/site.ts`). Pana cand worker-ul e publicat,
formularul arata automat varianta de rezerva: deschide emailul sau copiaza mesajul.

## 1. Cont Resend + cheie API

1. Iti faci cont pe https://resend.com/signup cu emailul tau si confirmi emailul.
2. *API Keys* → *Create API Key* → nume `skipit-worker`, permisiune **Sending access** → *Add*.
3. Copiezi cheia (`re_...`) intr-un loc sigur. Resend o arata **o singura data**. Nu o pune in cod si nu o trimite pe chat.

## 2. De pe ce adresa trimite

**Varianta rapida (fara domeniu).** Resend lasa adresa de test `onboarding@resend.dev` sa trimita
doar catre emailul cu care ti-ai facut contul. In `wrangler.toml`:

```toml
FROM_EMAIL = "SkipIt <onboarding@resend.dev>"
TO_EMAIL = "emailul-tau-de-resend@gmail.com"
```

**Varianta cu domeniu (ai nevoie de acces la DNS-ul skipit.space, adica la Namecheap).**
Resend → *Domains* → *Add Domain* → `skipit.space`. Copiezi inregistrarile DNS aratate (MX + TXT)
in Namecheap → *Domain List* → `skipit.space` → *Manage* → *Advanced DNS*, fara sa stergi ce exista
pentru GitHub Pages. Cand Resend arata *Verified*, poti trimite de pe `noreply@skipit.space` catre orice adresa:

```toml
FROM_EMAIL = "SkipIt <noreply@skipit.space>"
TO_EMAIL = "skipittools@gmail.com"
```

## 3. Cont Cloudflare

1. Iti faci cont pe https://dash.cloudflare.com/sign-up si confirmi emailul.
2. In meniul din stanga: *Compute (Workers)* → *Workers & Pages*. Daca iti cere un subdomeniu
   `workers.dev`, alegi unul (de exemplu numele tau). Worker-ul va avea adresa
   `https://skipit-requests.<subdomeniu>.workers.dev`.

## 4. Publicarea

Din folderul `worker` (ai nevoie de Node.js, pe care il ai deja):

```bash
npx wrangler login
```

Se deschide browserul: te loghezi in Cloudflare-ul tau si apesi *Allow*.

```bash
npx wrangler deploy
```

La final, wrangler afiseaza adresa worker-ului. Apoi pui cheia Resend ca secret
(o lipesti cand o cere; nu se vede cand o scrii):

```bash
npx wrangler secret put RESEND_API_KEY
```

La sfarsit pui adresa worker-ului + `/request` in `REQUEST_ENDPOINT` din `lib/site.ts`.

## Test

```bash
npx wrangler tail
```

arata in timp real cererile si erorile cat trimiti formularul de pe site.

## Ce face

- accepta doar `POST /request` de pe originile din `ALLOWED_ORIGINS`;
- valideaza emailul si lungimea mesajului;
- ignora in tacere botii (campul ascuns `company` sau trimitere in mai putin de 2,5 s);
- pune emailul vizitatorului la `reply_to`, ca sa poti raspunde direct din Gmail.
