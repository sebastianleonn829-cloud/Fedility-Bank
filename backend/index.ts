import { router, json, error, secrets } from '@appdeploy/sdk';

const codes = new Map<string, { code: string; expiresAt: number }>();
const VERIFIED_EMAIL = 'sebastianleonn829@gmail.com';

function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const handler = router({
  'GET /api/_healthcheck': [async () => json({ message: 'Success' })],

  'POST /api/send-code': [async ({ body }) => {
    const input = body as { destination?: string };
    const destination = input.destination || VERIFIED_EMAIL;
    if (destination.toLowerCase() !== VERIFIED_EMAIL.toLowerCase()) {
      return error('Verification is configured for the approved account email.', 400);
    }

    let apiKey = '';
    try {
      apiKey = await secrets.readSecret('RESEND_API_KEY');
    } catch {
      return error('Email delivery is not configured yet.', 503);
    }
    if (!apiKey) {
      return error('Email delivery is not configured yet.', 503);
    }

    const code = makeCode();
    codes.set(VERIFIED_EMAIL.toLowerCase(), { code, expiresAt: Date.now() + 10 * 60 * 1000 });

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: controller.signal,
        headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Fedility Bank <onboarding@resend.dev>',
          to: [VERIFIED_EMAIL],
          subject: 'Your Fedility Bank verification code',
          html: '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#241d20"><div style="font-weight:800;font-size:20px;margin-bottom:24px">Fedility<span style="color:#9e2632">Bank</span></div><p style="font-size:15px">Use this verification code to continue signing in:</p><div style="font-size:34px;letter-spacing:8px;font-weight:800;padding:20px 0;color:#9e2632">' + code + '</div><p style="font-size:12px;color:#777">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>'
        }),
      });
    } catch (fetchError) {
      codes.delete(VERIFIED_EMAIL.toLowerCase());
      const detail = fetchError instanceof Error ? fetchError.message : 'The email provider could not be reached.';
      return json({ sent: false, message: 'Email delivery request failed: ' + detail }, 200);
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      codes.delete(VERIFIED_EMAIL.toLowerCase());
      const providerBody = await response.text();
      let providerMessage = 'The email provider rejected the request.';
      try {
        const parsed = JSON.parse(providerBody) as { message?: string };
        if (parsed.message) providerMessage = parsed.message;
      } catch {}
      return json({ sent: false, message: 'Resend: ' + providerMessage }, 200);
    }

    return json({ sent: true });
  }],

  'POST /api/verify-code': [async ({ body }) => {
    const input = body as { code?: string };
    const stored = codes.get(VERIFIED_EMAIL.toLowerCase());
    if (!stored || Date.now() > stored.expiresAt || input.code !== stored.code) {
      return error('Invalid or expired verification code.', 401);
    }
    codes.delete(VERIFIED_EMAIL.toLowerCase());
    return json({ verified: true });
  }],
});
