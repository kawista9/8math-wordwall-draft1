# Math Word Wall membership launch

Prepared integration, not a live payment system. Existing GitHub Pages content remains unchanged. Deploy this folder to Cloudflare Workers with Static Assets (not a plain public Pages upload). All content requests run through server authentication and subscription checks. Clerk manages registration, sign-in, email verification and password recovery. Stripe Checkout collects recurring payments; its portal manages cancellation and billing. D1 stores the verified payment-to-learner mapping.

## First: accounts owned by Karista

1. Create a Stripe account at https://dashboard.stripe.com/register. Complete Stripe's identity, business and payout-bank setup yourself. Begin integration in a sandbox/test environment, not live payments.
2. Create Cloudflare at https://dash.cloudflare.com/sign-up. A domain can be attached later; registration should be finalized on the chosen production domain.
3. Create Clerk at https://dashboard.clerk.com/sign-up and create a Math Word Wall application. Enable email/password registration with verified email. Use its development instance for test purchases; set up a production instance on the final domain for launch.

Do not paste passwords, banking details, secret API keys or webhook signing secrets into a chat or commit them to GitHub. Configure runtime secrets directly in Cloudflare or Wrangler's secret prompts. Public publishable keys, public JWT verification key, price ID and the domain can be shared for connection work.

## Connect Cloudflare

From this folder:

```sh
npm ci
npx wrangler login
npx wrangler d1 create math-word-wall-members
```

Put the returned database ID into `wrangler.jsonc`. Then:

```sh
npx wrangler d1 execute math-word-wall-members --remote --file schema.sql
```

Configure the following variables in `wrangler.jsonc` (the file has no secrets):

- `SITE_URL`: exact final origin, HTTPS and no trailing slash.
- `CLERK_PUBLISHABLE_KEY`: selected instance's public publishable key.
- `CLERK_ISSUER`: selected instance's Frontend API URL, including `https://` and no trailing slash.
- `STRIPE_PRICE_ID`: selected environment's recurring price ID.
- `PLAN_LABEL`: display price matching the Stripe price. `$12 / month` is a starting value based on prior planning, and must be confirmed before launch. It does not include any new AI upload feature.
- `OWNER_USER_ID`: optional exact Clerk user ID for Karista's owner access. No other free access is enabled by default.

Create these runtime secrets using Cloudflare's dashboard or secret prompts:

```sh
npx wrangler secret put CLERK_JWT_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

`CLERK_JWT_KEY` is the selected Clerk instance's full PEM JWT public key from API Keys. Stripe keys and webhook secret must be from the same test/live environment as the price.

## Connect Stripe

Create product **8th Grade Math Digital Word Wall — Individual Learner**, with one recurring monthly USD price. Confirm the amount before making the product available to buyers. Configure the customer portal to allow payment method updates, invoices, and cancellation at the end of the paid period. Do not enable subscription pause or plan switching for this single-plan launch.

Create a webhook destination for:

```
https://YOUR_DOMAIN/api/stripe/webhook
```

Subscribe to `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, and `invoice.payment_failed`. Put the destination's signing secret in `STRIPE_WEBHOOK_SECRET`. Webhook signatures are verified before processing. Events trigger a fresh Stripe subscription lookup, so a delayed older event does not directly overwrite access with an older event payload.

## Build and deploy

```sh
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
npm run deploy
```

The build copies the existing content into a generated deployment directory without editing its source. The auth client is injected into protected HTML to refresh Clerk sessions during learning; an account link is added to the existing toolbar. No lesson, lab, chart or standard-search content is rewritten. Do not deploy `dist` independently as an unprotected static site.

## Required connection tests before taking real payments

The automated tests cover access decisions, signature-verified sign-in, expiry, direct-asset denial, origin protection, invalid webhooks and fail-closed configuration. They do not demonstrate a real registration, payment, payout or cancellation.

On the configured test deployment, verify:

1. Fresh learner registers, verifies email, signs in and can recover their password.
2. Unsubscribed learner cannot retrieve `/`, `data.js`, lesson scripts or direct image URLs.
3. A Stripe test purchase activates the correct learner and opens the original standard search, lessons and labs.
4. Checkout abandonment grants no access; repeated Subscribe clicks reuse the open checkout.
5. A different learner cannot use the buyer's payment return URL or billing account.
6. Portal cancellation retains access until the paid period ends; expired, unpaid, paused and canceled memberships lose access.
7. A failed renewal updates access and allows the learner to fix payment in the portal.
8. Sign-out blocks content; returning learners can sign in and resume. Let a lesson stay open several minutes and then open another protected image to verify token refresh.
9. Verify the account page and an original lab on phone and desktop.

Only after these pass, switch all account settings, price and secrets to production and repeat a real purchase/cancellation test with the owner. Verify payout setup and the actual customer-facing price.

## Finish protection at cutover

The GitHub repository and Pages URL are currently public. This new deployment alone cannot revoke existing public copies. After the paid site works, remove the public Pages deployment and change the repository to private, retaining a private backup. Existing testers need an explicit agreed access arrangement before this cutover; none is silently revoked here.

ScreenPal videos use existing external links. This paywall protects discovery of those links inside the word wall; it cannot independently restrict playback of a public ScreenPal link or erase previously downloaded material. Video-host privacy must be configured separately if required.

Classroom seat plans, learner rosters and AI uploads are outside this individual-membership integration. They require separate pricing and implementation.
