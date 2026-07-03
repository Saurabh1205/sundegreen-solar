# DNS setup instructions for common providers

These are example records to point your domain to Vercel. Replace `yourdomain.in` with your real domain.

Basic records (recommended):

- Apex/root domain (yourdomain.in):
  - Type: A
  - Name/Host: @
  - Value: 76.76.21.21
  - TTL: automatic / 3600

- www subdomain (www.yourdomain.in):
  - Type: CNAME
  - Name/Host: www
  - Value: cname.vercel-dns.com
  - TTL: automatic / 3600

Cloudflare
- Add the A record for `@` → `76.76.21.21` (Proxy status: DNS only / orange cloud OFF).
- Add CNAME `www` → `cname.vercel-dns.com` (Proxy OFF).

GoDaddy
- Add A record for Host `@` pointing to `76.76.21.21`.
- Add CNAME for `www` to `cname.vercel-dns.com`.

Namecheap
- Add A record (Host `@`) → `76.76.21.21`.
- Add CNAME record (Host `www`) → `cname.vercel-dns.com`.

Verification & TLS
- After adding the records, in Vercel Project → Domains → Add your domain and click Verify.
- Vercel will provision SSL automatically (Let's Encrypt). Wait for the status to become `Verified` and `Secured`.

Notes
- Do NOT remove existing MX records if you're using email for the domain.
- Use TTL defaults; DNS propagation can take minutes to 24 hours.
- If your DNS provider supports ALIAS/ANAME for apex, you may use that pointing to `cname.vercel-dns.com` instead of A records.
