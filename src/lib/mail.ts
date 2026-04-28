import { Resend } from "resend";
import { BookingStatus } from "@prisma/client";
import { CONTACT_EMAIL, SITE_BRAND, SITE_URL } from "@/lib/site-config";

/** Email-safe stack; DM Sans loaded via Google Fonts link in dokumentet. */
const FONT =
  "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const COL = {
  /** Hvid baggrund — roligt og ens på tværs af mail-apps */
  pageBg: "#ffffff",
  text: "#374151",
  muted: "#6b7280",
  mutedLight: "#9ca3af",
  rowLine: "#e8e8e6",
  primary: "#2d6a3a",
  danger: "#b42318",
};

/**
 * Emoji vises på tværs af mail-apps; SVG filtreres ofte væk (især Outlook).
 * De matcher “ikon”-funktionen uden at kræve billedhosting.
 */
const GLYPH = {
  clock: "\u{1F552}", // 🕒 — vises konsekvent i de fleste mailklienter
  mail: "\u{1F4E7}", // 📧
  calendar: "\u{1F4C5}", // 📅
} as const;

function glyph(kind: keyof typeof GLYPH) {
  const ch = GLYPH[kind];
  return `<span style="font-size:17px;line-height:1;display:inline-block;vertical-align:-2px;margin-right:8px;font-family:Segoe UI Emoji,Apple Color Emoji,Noto Color Emoji,sans-serif;" aria-hidden="true">${ch}</span>`;
}

type BookingMailPayload = {
  to: string;
  customerName: string;
  bookingId: string;
  whenLabel: string;
  addressLabel: string;
  squareMeters: number;
  totalPriceDkk: number;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function mailFooterEscapes() {
  let host = "ukrudtfri.dk";
  try {
    host = new URL(SITE_URL).host;
  } catch {
    /* SITE_URL invalid — fall back */
  }
  return {
    siteUrl: escapeHtml(SITE_URL),
    siteHost: escapeHtml(host),
    brand: escapeHtml(SITE_BRAND),
    contact: escapeHtml(CONTACT_EMAIL),
    bookingUrl: escapeHtml(`${SITE_URL}/booking`),
    bookingLinkLabel: escapeHtml(`${host}/booking`),
  };
}

/** Fuld HTML med webfont (mange klienter respekterer link; ellers falder stack tilbage). */
function wrapEmailDocument(innerBody: string) {
  return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:${COL.pageBg};font-family:${FONT};-webkit-font-smoothing:antialiased;">
${innerBody}
</body>
</html>`;
}

/** Centreret indhold, samme baggrund som body — ingen kasse/ramme. */
function emailCard(content: string) {
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${COL.pageBg};padding:24px 16px 32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:${COL.pageBg};">
        ${content}
      </table>
    </td>
  </tr>
</table>`;
}

function emailFooter(f: ReturnType<typeof mailFooterEscapes>, recipientEmail?: string) {
  const year = new Date().getFullYear();
  const toBlock =
    recipientEmail != null && recipientEmail.length > 0
      ? `<a href="mailto:${escapeHtml(recipientEmail)}" style="color:${COL.muted};text-decoration:none;font-weight:500;">${escapeHtml(recipientEmail)}</a>`
      : `<a href="mailto:${f.contact}" style="color:${COL.primary};text-decoration:none;font-weight:600;">${f.contact}</a>`;

  return `
<tr>
  <td style="padding:22px 24px 8px 24px;border-top:1px solid ${COL.rowLine};">
    <p style="margin:0;font-size:11px;line-height:1.5;color:${COL.mutedLight};font-family:${FONT};">
      ${recipientEmail != null && recipientEmail.length > 0 ? "Sendt til " : "Kontakt: "}
      ${toBlock}
      <span style="color:${COL.rowLine};">&nbsp;·&nbsp;</span>
      <a href="${f.siteUrl}" style="color:${COL.primary};text-decoration:none;font-weight:600;">${f.siteHost}</a>
      <span style="color:${COL.rowLine};">&nbsp;·&nbsp;</span>
      <span style="color:${COL.mutedLight};">© ${year}</span>
    </p>
  </td>
</tr>`;
}

type CtaIcon = "mail" | "calendar" | null;

function buttonPrimary(href: string, label: string, icon: CtaIcon = null) {
  const escapedLabel = escapeHtml(label);
  const prefix =
    icon === "mail" ? glyph("mail") : icon === "calendar" ? glyph("calendar") : "";
  const inner = `${prefix}<span style="font-size:14px;font-weight:600;color:#ffffff;font-family:${FONT};vertical-align:middle;">${escapedLabel}</span>`;

  return `
<table role="presentation" cellspacing="0" cellpadding="0" style="margin:18px 0 0 0;">
  <tr>
    <td style="border-radius:8px;background:${COL.primary};">
      <a href="${href}" style="display:inline-block;padding:11px 18px;color:#ffffff;text-decoration:none;border-radius:8px;font-family:${FONT};line-height:1.35;white-space:nowrap;">
        ${inner}
      </a>
    </td>
  </tr>
</table>`;
}

/** Status — kun venstrestreg + tekst, ingen baggrundskasse. */
function statusAwaitingRow() {
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px 0;">
  <tr>
    <td style="padding:2px 0 2px 12px;border-left:3px solid ${COL.primary};font-size:14px;line-height:1.45;color:${COL.text};font-family:${FONT};">
      ${glyph("clock")}<strong style="color:${COL.primary};">Afventer lige vores bekræftelse</strong>
    </td>
  </tr>
</table>`;
}

function bookingCustomerHtml(payload: BookingMailPayload) {
  const f = mailFooterEscapes();
  const name = escapeHtml(payload.customerName);
  const bookingId = escapeHtml(payload.bookingId);
  const whenLabel = escapeHtml(payload.whenLabel);
  const addressLabel = escapeHtml(payload.addressLabel);
  const sqm = escapeHtml(String(payload.squareMeters));
  const price = escapeHtml(`${payload.totalPriceDkk.toLocaleString("da-DK")} kr`);

  const inner = `
<tr>
  <td style="padding:22px 24px 20px 24px;">
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;line-height:1.3;color:${COL.text};font-family:${FONT};">
      Hej ${name}
    </h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:${COL.text};font-family:${FONT};">
      Tusind tak fordi du har booket hos <span style="font-weight:600;color:${COL.primary};">${f.brand}</span> — det sætter vi pris på.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${COL.text};font-family:${FONT};">
      Vi har fået det hele med, og så kigger vi lige tidspunktet igennem i ro og mag, så det også passer for os i kalenderen. Du får en mail fra os, når det er grønt — eller hvis vi foreslår et andet tidspunkt, der passer bedre.
    </p>
    ${statusAwaitingRow()}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px 0;">
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid ${COL.rowLine};font-size:13px;color:${COL.muted};width:40%;font-family:${FONT};">Booking</td>
        <td style="padding:8px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;font-weight:600;color:${COL.text};font-family:${FONT};">${bookingId}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid ${COL.rowLine};font-size:13px;color:${COL.muted};font-family:${FONT};">Tidspunkt</td>
        <td style="padding:8px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${whenLabel}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid ${COL.rowLine};font-size:13px;color:${COL.muted};font-family:${FONT};">Adresse</td>
        <td style="padding:8px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${addressLabel}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid ${COL.rowLine};font-size:13px;color:${COL.muted};font-family:${FONT};">Areal</td>
        <td style="padding:8px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${sqm} m²</td>
      </tr>
      <tr>
        <td style="padding:8px 0 0 0;font-size:13px;color:${COL.muted};font-family:${FONT};">Vejledende pris</td>
        <td style="padding:8px 0 0 0;font-size:15px;font-weight:700;color:${COL.primary};font-family:${FONT};">${price}</td>
      </tr>
    </table>

    <p style="margin:0 0 12px;font-size:14px;line-height:1.65;color:${COL.text};font-family:${FONT};">
      Du betaler først, når arbejdet er udført. Skal du flytte eller aflyse, hører vi gerne fra dig senest <strong>24 timer</strong> før. Ring endelig på <a href="tel:+4541820046" style="color:${COL.primary};text-decoration:none;font-weight:600;">+45 41 82 00 46</a>, hvis noget driller.
    </p>

    ${buttonPrimary(`mailto:${CONTACT_EMAIL}`, "Skriv til os", "mail")}

    <p style="margin:18px 0 0;font-size:15px;line-height:1.65;color:${COL.text};font-family:${FONT};">
      Tak for tilliden — vi glæder os til at give plænen et ordentligt løft.<br /><br />
      <span style="font-weight:600;">De bedste hilsner<br />${f.brand}</span>
    </p>
  </td>
</tr>
${emailFooter(f, payload.to)}
`;

  return wrapEmailDocument(emailCard(inner));
}

type SimpleEmailOptions = {
  /** Vises som h1 under velkomst, fx "Din booking er bekræftet" */
  heading: string;
  /** Kort linje under overskrift (allerede escaped hvis nødvendigt) */
  lead?: string;
  /** HTML fragment (allerede escaped) */
  bodyHtml: string;
  recipientEmail?: string;
};

function simpleCustomerEmail(opts: SimpleEmailOptions) {
  const f = mailFooterEscapes();
  const h = escapeHtml(opts.heading);
  const inner = `
<tr>
  <td style="padding:22px 24px 6px 24px;">
    <h1 style="margin:0 0 8px;font-size:19px;font-weight:700;line-height:1.3;color:${COL.text};font-family:${FONT};">${h}</h1>
    ${opts.lead ? `<p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:${COL.muted};font-family:${FONT};">${opts.lead}</p>` : ""}
    ${opts.bodyHtml}
    <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:${COL.text};font-family:${FONT};">
      <span style="font-weight:600;">De bedste hilsner<br />${f.brand}</span>
    </p>
  </td>
</tr>
${emailFooter(f, opts.recipientEmail)}
`;
  return wrapEmailDocument(emailCard(inner));
}

type BookingStatusMailPayload = {
  to: string;
  customerName: string;
  status: BookingStatus;
  whenLabel: string;
  addressLabel: string;
  squareMeters: number;
  totalPriceDkk: number;
};

type BookingReminderMailPayload = {
  to: string;
  customerName: string;
  whenLabel: string;
  addressLabel: string;
  squareMeters: number;
  totalPriceDkk: number;
};

export async function sendBookingConfirmationEmail(payload: BookingMailPayload) {
  const from = process.env.EMAIL_FROM ?? "Ukrudtfri <booking@ukrudtfri.dk>";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email] RESEND_API_KEY mangler — springer mail over", payload);
    }
    return { skipped: true as const };
  }

  const resend = new Resend(apiKey);
  const subject = `Vi har din booking — tak, ${payload.customerName.split(" ")[0] ?? "dig"}!`;
  const text = [
    `Hej ${payload.customerName},`,
    ``,
    `Tusind tak fordi du har booket hos ${SITE_BRAND}. Vi har fået det hele med og kigger tidspunktet igennem, så det også passer hos os.`,
    `Du får besked på mail, når det er bekræftet — eller hvis vi foreslår et andet tidspunkt.`,
    ``,
    `Det du har booket`,
    `Booking: ${payload.bookingId}`,
    `Tid: ${payload.whenLabel}`,
    `Adresse: ${payload.addressLabel}`,
    `Areal: ${payload.squareMeters} m²`,
    `Vejledende pris: ${payload.totalPriceDkk} kr`,
    ``,
    `Betaling først efter besøget. Flyt eller aflys gerne senest 24 timer før.`,
    `Telefon +45 41 82 00 46 · ${CONTACT_EMAIL}`,
    ``,
    `Tak for tilliden — vi ses.`,
    ``,
    `De bedste hilsner`,
    `${SITE_BRAND}`,
    `${SITE_URL}`,
  ].join("\n");
  const html = bookingCustomerHtml(payload);

  await resend.emails.send({
    from,
    to: payload.to,
    subject,
    text,
    html,
  });

  return { skipped: false as const };
}

type AdminBookingMailPayload = {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  whenLabel: string;
  addressLabel: string;
  squareMeters: number;
  totalPriceDkk: number;
  confirmUrl: string;
  rejectUrl: string;
};

function bookingAdminHtml(payload: AdminBookingMailPayload) {
  const f = mailFooterEscapes();
  const bookingId = escapeHtml(payload.bookingId);
  const customerName = escapeHtml(payload.customerName);
  const customerEmail = escapeHtml(payload.customerEmail);
  const customerPhone = escapeHtml(payload.customerPhone);
  const whenLabel = escapeHtml(payload.whenLabel);
  const addressLabel = escapeHtml(payload.addressLabel);
  const sqm = escapeHtml(String(payload.squareMeters));
  const price = escapeHtml(`${payload.totalPriceDkk.toLocaleString("da-DK")} kr`);
  const confirmUrl = escapeHtml(payload.confirmUrl);
  const rejectUrl = escapeHtml(payload.rejectUrl);

  const inner = `
<tr>
  <td style="padding:22px 24px 18px 24px;">
    <h1 style="margin:0 0 6px;font-size:18px;font-weight:700;color:${COL.text};font-family:${FONT};">Ny booking</h1>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:${COL.muted};font-family:${FONT};">
      ${customerName} har booket — den ligger og venter på et hurtigt ja eller nej fra dig.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px 0;">
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};width:38%;font-family:${FONT};">Booking</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;font-weight:600;color:${COL.text};font-family:${FONT};">${bookingId}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Kunde</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${customerName}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Mail</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${customerEmail}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Telefon</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${customerPhone}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Tidspunkt</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${whenLabel}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Adresse</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${addressLabel}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Areal</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${sqm} m²</td></tr>
      <tr><td style="padding:7px 0 0 0;font-size:12px;color:${COL.muted};font-family:${FONT};">Pris (vejl.)</td><td style="padding:7px 0 0 0;font-size:15px;font-weight:700;color:${COL.primary};font-family:${FONT};">${price}</td></tr>
    </table>
    <table role="presentation" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding-right:8px;">
          <a href="${confirmUrl}" style="display:inline-block;padding:10px 16px;background:${COL.primary};color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;font-family:${FONT};">Godkend</a>
        </td>
        <td>
          <a href="${rejectUrl}" style="display:inline-block;padding:10px 16px;background:${COL.danger};color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;font-family:${FONT};">Afvis</a>
        </td>
      </tr>
    </table>
  </td>
</tr>
<tr>
  <td style="padding:0 24px 18px 24px;border-top:1px solid ${COL.rowLine};">
    <p style="margin:12px 0 0;font-size:11px;color:${COL.mutedLight};font-family:${FONT};">
      <a href="${f.siteUrl}" style="color:${COL.primary};text-decoration:none;font-weight:600;">${f.siteHost}</a> · admin · © ${new Date().getFullYear()}
    </p>
  </td>
</tr>
`;

  return wrapEmailDocument(emailCard(inner));
}

export async function sendAdminBookingNotificationEmail(payload: AdminBookingMailPayload) {
  const from = process.env.EMAIL_FROM ?? "Ukrudtfri <booking@ukrudtfri.dk>";
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_ADMIN_EMAIL ?? process.env.EMAIL_FROM?.match(/<([^>]+)>/)?.[1];

  if (!apiKey || !to) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email] Mangler RESEND_API_KEY eller BOOKING_ADMIN_EMAIL", { hasApiKey: Boolean(apiKey), to });
    }
    return { skipped: true as const };
  }

  const resend = new Resend(apiKey);
  const subject = `Ny booking fra ${payload.customerName}`;
  const text = [
    `Hej,`,
    ``,
    `${payload.customerName} har sendt en booking, som du lige skal godkende eller afvise.`,
    ``,
    `Booking ID: ${payload.bookingId}`,
    `Mail: ${payload.customerEmail}`,
    `Telefon: ${payload.customerPhone}`,
    `Tidspunkt: ${payload.whenLabel}`,
    `Adresse: ${payload.addressLabel}`,
    `Areal: ${payload.squareMeters} m²`,
    `Vejledende pris: ${payload.totalPriceDkk} kr`,
    ``,
    `Godkend: ${payload.confirmUrl}`,
    `Afvis: ${payload.rejectUrl}`,
  ].join("\n");

  await resend.emails.send({
    from,
    to,
    replyTo: payload.customerEmail,
    subject,
    text,
    html: bookingAdminHtml(payload),
  });

  return { skipped: false as const };
}

export async function sendBookingStatusEmail(payload: BookingStatusMailPayload) {
  const from = process.env.EMAIL_FROM ?? "Ukrudtfri <booking@ukrudtfri.dk>";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true as const };

  const resend = new Resend(apiKey);
  const statusLabel = payload.status === "CONFIRMED" ? "bekræftet" : payload.status === "REJECTED" ? "afvist" : "opdateret";
  const first = payload.customerName.split(" ")[0] ?? "";
  const subject =
    payload.status === "CONFIRMED"
      ? first
        ? `Det er en aftale, ${first} — vi ses!`
        : `Din tid er bekræftet`
      : payload.status === "REJECTED"
        ? "Om din booking (den blev ikke bekræftet)"
        : `Lille opdatering på din booking`;

  const text =
    payload.status === "CONFIRMED"
      ? [
          `Hej ${payload.customerName},`,
          ``,
          `Så er det bare at sige: vi kommer som aftalt.`,
          `Vi ses ${payload.whenLabel}.`,
          ``,
          `Adresse: ${payload.addressLabel}`,
          `Areal: ${payload.squareMeters} m²`,
          `Vejledende pris: ${payload.totalPriceDkk.toLocaleString("da-DK")} kr`,
          ``,
          `Tak fordi du valgte os — vi glæder os.`,
        ].join("\n")
      : payload.status === "REJECTED"
        ? [
            `Hej ${payload.customerName},`,
            ``,
            `Den her gang kunne vi desværre ikke bekræfte bookingen.`,
            `Du er velkommen til at finde et andet tidspunkt på ${SITE_URL}/booking`,
            ``,
            `Skriv til ${CONTACT_EMAIL} eller ring +45 41 82 00 46, hvis du vil snakke om det.`,
          ].join("\n")
        : [
            `Hej ${payload.customerName},`,
            ``,
            `Der er rykket lidt ved din booking. Status lige nu: ${statusLabel}.`,
            ``,
            `Tid: ${payload.whenLabel}`,
            `Adresse: ${payload.addressLabel}`,
            `Areal: ${payload.squareMeters} m²`,
            ``,
            `${CONTACT_EMAIL} · +45 41 82 00 46`,
          ].join("\n");

  const f = mailFooterEscapes();
  const bodyHtml =
    payload.status === "CONFIRMED"
      ? `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:${COL.text};font-family:${FONT};">
      Hej <strong>${escapeHtml(payload.customerName)}</strong>,<br /><br />
      Vi kan godt komme som aftalt — her er lige stumperne samlet, så du har dem for dig selv.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 10px 0;">
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};width:38%;font-family:${FONT};">Status</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;font-weight:600;color:${COL.primary};font-family:${FONT};">${escapeHtml(statusLabel)}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Tidspunkt</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${escapeHtml(payload.whenLabel)}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Adresse</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${escapeHtml(payload.addressLabel)}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Areal</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${escapeHtml(String(payload.squareMeters))} m²</td></tr>
      <tr><td style="padding:7px 0 0 0;font-size:12px;color:${COL.muted};font-family:${FONT};">Vejledende pris</td><td style="padding:7px 0 0 0;font-size:15px;font-weight:700;color:${COL.primary};font-family:${FONT};">${escapeHtml(`${payload.totalPriceDkk.toLocaleString("da-DK")} kr`)}</td></tr>
    </table>
    <p style="margin:0;font-size:14px;line-height:1.65;color:${COL.text};font-family:${FONT};">Vi ses derude — og tak for tilliden.</p>
    `
      : payload.status === "REJECTED"
        ? `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:${COL.text};font-family:${FONT};">
      Hej <strong>${escapeHtml(payload.customerName)}</strong>,<br /><br />
      Den her gang kan vi desværre ikke bekræfte bookingen — det sker som regel, hvis tidspunktet driller i kalenderen.
    </p>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:${COL.text};font-family:${FONT};">
      Du er mere end velkommen til at vælge et andet tidspunkt, hvis du stadig har brug for os.
    </p>
    ${buttonPrimary(f.bookingUrl, "Book et nyt tidspunkt", "calendar")}
    <p style="margin:14px 0 0;font-size:13px;line-height:1.55;color:${COL.muted};font-family:${FONT};">
      <a href="mailto:${f.contact}" style="color:${COL.primary};font-weight:600;text-decoration:none;">${f.contact}</a> · <a href="tel:+4541820046" style="color:${COL.primary};font-weight:600;text-decoration:none;">+45 41 82 00 46</a>
    </p>
    `
        : `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:${COL.text};font-family:${FONT};">
      Hej <strong>${escapeHtml(payload.customerName)}</strong>,<br /><br />
      Der er lige kommet en lille opdatering: status er nu <strong>${escapeHtml(statusLabel)}</strong>.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 8px 0;">
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};width:38%;font-family:${FONT};">Tidspunkt</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${escapeHtml(payload.whenLabel)}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Adresse</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${escapeHtml(payload.addressLabel)}</td></tr>
      <tr><td style="padding:7px 0 0 0;font-size:12px;color:${COL.muted};font-family:${FONT};">Areal</td><td style="padding:7px 0 0 0;font-size:14px;color:${COL.text};font-family:${FONT};">${escapeHtml(String(payload.squareMeters))} m²</td></tr>
    </table>
    <p style="margin:0;font-size:13px;line-height:1.55;color:${COL.muted};font-family:${FONT};">
      <a href="mailto:${f.contact}" style="color:${COL.primary};font-weight:600;text-decoration:none;">${f.contact}</a> · <a href="tel:+4541820046" style="color:${COL.primary};font-weight:600;text-decoration:none;">+45 41 82 00 46</a>
    </p>
    `;

  const html = simpleCustomerEmail({
    heading:
      payload.status === "CONFIRMED"
        ? "Så er det en aftale"
        : payload.status === "REJECTED"
          ? "Den her gang blev det ikke til noget"
          : "Lidt nyt om din booking",
    lead:
      payload.status === "CONFIRMED"
        ? `Vi kommer <strong>${escapeHtml(payload.whenLabel)}</strong>.`
        : undefined,
    bodyHtml,
    recipientEmail: payload.to,
  });

  await resend.emails.send({
    from,
    to: payload.to,
    subject,
    text,
    html,
  });

  return { skipped: false as const };
}

/** Manuelt udsendt indhold fra admin-skabelon (fragment indsættes i standard layout). */
export async function sendTemplatedCustomerEmail(payload: {
  to: string;
  subject: string;
  /** HTML-fragment — variabler bør allerede være escaped. */
  bodyHtmlFragment: string;
}) {
  const from = process.env.EMAIL_FROM ?? "Ukrudtfri <booking@ukrudtfri.dk>";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email] RESEND_API_KEY mangler — springer skabelon-mail over", payload.to);
    }
    return { skipped: true as const };
  }

  const resend = new Resend(apiKey);
  const text = payload.bodyHtmlFragment.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || payload.subject;

  const html = simpleCustomerEmail({
    heading: "Besked fra os",
    bodyHtml: payload.bodyHtmlFragment,
    recipientEmail: payload.to,
  });

  await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    text,
    html,
  });

  return { skipped: false as const };
}

export async function sendBookingReminderEmail(payload: BookingReminderMailPayload) {
  const from = process.env.EMAIL_FROM ?? "Ukrudtfri <booking@ukrudtfri.dk>";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true as const };

  const resend = new Resend(apiKey);
  const subject = "Vi er på vej om lidt — bare en påmindelse";
  const text = [
    `Hej ${payload.customerName},`,
    ``,
    `Vi tænkte lige, at du skulle have en påmindelse: vi er hos dig om cirka to timer (som det ser ud lige nu i kalenderen).`,
    ``,
    `Tid: ${payload.whenLabel}`,
    `Adresse: ${payload.addressLabel}`,
    `Areal: ${payload.squareMeters} m²`,
    ``,
    `Ses snart — og tak fordi du venter på os.`,
    ``,
    `${SITE_BRAND}`,
  ].join("\n");

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:${COL.text};font-family:${FONT};">
      Hej <strong>${escapeHtml(payload.customerName)}</strong>,<br /><br />
      Vi er på vej om <strong>cirka to timer</strong> — her er lige adressen og tidspunktet, så du har det i baghovedet.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 6px 0;">
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};width:38%;font-family:${FONT};">Tidspunkt</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${escapeHtml(payload.whenLabel)}</td></tr>
      <tr><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:12px;color:${COL.muted};font-family:${FONT};">Adresse</td><td style="padding:7px 0;border-bottom:1px solid ${COL.rowLine};font-size:14px;color:${COL.text};font-family:${FONT};">${escapeHtml(payload.addressLabel)}</td></tr>
      <tr><td style="padding:7px 0 0 0;font-size:12px;color:${COL.muted};font-family:${FONT};">Areal</td><td style="padding:7px 0 0 0;font-size:14px;color:${COL.text};font-family:${FONT};">${escapeHtml(String(payload.squareMeters))} m²</td></tr>
    </table>
    <p style="margin:0;font-size:14px;line-height:1.65;color:${COL.text};font-family:${FONT};">Rolig dag derude — vi ses.</p>
  `;

  const html = simpleCustomerEmail({
    heading: "Vi er snart ved dig",
    lead: "Kort påmindelse før vi ringer på.",
    bodyHtml,
    recipientEmail: payload.to,
  });

  await resend.emails.send({
    from,
    to: payload.to,
    subject,
    text,
    html,
  });

  return { skipped: false as const };
}
