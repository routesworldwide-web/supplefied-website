# Supplefied production deployment notes

## Public routing

Use one HTTPS load balancer for both domains:

- `https://supplefied.com/*` → storefront service
- `https://www.supplefied.com/*` → storefront service
- `https://supplefied.com/admin/*` → admin service
- `https://www.supplefied.com/admin/*` → admin service
- `/api/*` on either domain → backend service

The frontend and admin production defaults intentionally use
`https://supplefied.com` as the API origin. The load balancer must therefore
route `/api/*` to the backend.

## Required production environment

Create runtime/build variables from the checked-in
`.env.production.example` files. Store backend secrets in Google Secret
Manager; do not upload any real `.env` file.

Important backend values:

- `STORE_URL=https://supplefied.com`
- `ADMIN_URL=https://supplefied.com/admin`
- `ALLOWED_ORIGINS=https://supplefied.com,https://www.supplefied.com`
- Valid MongoDB Atlas, Cloudinary, email, JWT, and Razorpay credentials

## Images

Product, banner, and blog uploads are stored in Cloudinary. Do not switch
uploads back to container-local disk because Cloud Run instances are
replaceable and local files are not durable application storage.

## Security before first deployment

1. Rotate every credential that has ever appeared in a committed `.env` file.
2. Deploy with Node.js 20 or newer.
3. Keep MongoDB Atlas network access restricted to the deployment path.
4. Put Cloud Armor or equivalent rate limiting in front of public services.
5. Do not expose VM SSH or database ports publicly.
6. Confirm admin write routes return `401` without an admin bearer token.

## Verification commands

Run from each application directory:

```text
npm ci
npm audit --omit=dev
npm run build
```

Backend:

```text
npm ci
npm audit --omit=dev
npm start
```

Health check:

```text
GET /health
```
