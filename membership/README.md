# Math Word Wall membership launch

Prepared integration; live registration and billing require provider connection and testing. Existing GitHub Pages remains unchanged. Cloudflare Workers with Static Assets protects every original lesson, script and image server-side. Clerk manages registration and sign-in. Stripe handles payments. D1 holds memberships and rosters.

## Confirmed pricing

| Plan | Access | Billing |
| --- | --- | --- |
| Individual | One learner | $12 each month, starting at purchase |
| Teacher | One teacher and up to 150 learners | 14 days free, $24.99 for the next 14 days, then $49.99 each month |

The teacher introductory offer applies once per teacher account. Returning teachers pay $49.99 monthly. Customers authorize automatic charges and save a card at signup. Teachers cancel from **Cancel next renewal** on their account page; the roster keeps access through the current free or paid period. AI uploads and progress analytics are not included.

## Owner accounts

Create Stripe at https://dashboard.stripe.com/register and complete identity, business and payout-bank setup directly with Stripe. Create Cloudflare at https://dash.cloudflare.com/sign-up and Clerk at https://dashboard.clerk.com/sign-up. Set up Clerk email/password registration with verified email. Use provider test environments first, then production authentication on the final domain.

Do not paste passwords, banking details, secret keys or webhook secrets into chat or GitHub. Use Cloudflare's runtime secret settings or Wrangler prompts. Publishable keys, public JWT verification key, price IDs and the domain can be shared for connection work.

## Stripe catalog: three recurring prices

| Product/price | Amount | Recurrence | Runtime variable |
| --- | --- | --- | --- |
| Individual Learner | USD 12.00 | Every month | `STRIPE_INDIVIDUAL_PRICE_ID` |
| Teacher Membership | USD 49.99 | Every month | `STRIPE_TEACHER_PRICE_ID` |
| Teacher Introductory Period | USD 24.99 | Every 2 weeks | `STRIPE_TEACHER_INTRO_PRICE_ID` |

The two-week price is an internal schedule component, not a standalone selectable membership. Do not substitute a monthly $24.99 price or a 50% coupon. Checkout verifies amounts, currency, interval and recurrence against the advertised offer before proceeding.

The teacher launch flow uses Checkout **setup mode** to collect a card without charging. After verifying completed Checkout and a succeeded SetupIntent, the server creates a subscription schedule:

1. Two-week free trial using the introductory price.
2. Two paid weeks at $24.99.
3. One month at $49.99, then release of the schedule so the same subscription continues monthly indefinitely.

Phase transitions reset the billing cycle and disable prorations. Stripe runs the schedule; no browser timer is needed. Webhooks and account refresh can complete setup. A per-account offer ledger and Stripe idempotency prevent duplicate schedules. A checkout return URL grants no access by itself.

Stripe's portal cannot cancel subscriptions with future scheduled updates. The authenticated app cancellation endpoint releases the future schedule, then cancels the subscription at the current period end. Keep the account page cancellation button available. Configure the Stripe portal for payment-method updates, invoices and end-of-period cancellation of ordinary subscriptions; disable plan switching and subscription pauses for launch.

## Connect Cloudflare

Run from this folder:

```sh
npm ci
npx wrangler login
npx wrangler d1 create math-word-wall-members
```

Put the returned database ID into `wrangler.jsonc`. For a new database:

```sh
npx wrangler d1 execute math-word-wall-members --remote --file schema.sql
```

If the previous individual-only schema was already deployed, use this migration instead:

```sh
npx wrangler d1 execute math-word-wall-members --remote --file migrations/0002_teacher_plans.sql
```

Do not apply that ALTER migration to a fresh database initialized with the current schema.

Configure these non-secret variables in `wrangler.jsonc`:

- `SITE_URL`: exact HTTPS origin, no trailing slash.
- `CLERK_PUBLISHABLE_KEY`: selected instance's publishable key.
- `CLERK_ISSUER`: selected instance's Frontend API URL with HTTPS, no trailing slash.
- All three Stripe price IDs above.
- `OWNER_USER_ID`: optional exact Clerk user ID for Karista's owner access. This alone does not create a teacher subscription or roster.

Configure runtime values directly:

```sh
npx wrangler secret put CLERK_JWT_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

`CLERK_JWT_KEY` is the selected instance's full PEM JWT public verification key. Both Stripe secrets and all prices must use the same test/live environment.

Create a Stripe webhook destination at `https://YOUR_DOMAIN/api/stripe/webhook` for `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, and `invoice.payment_failed`. The server verifies signatures and reconciles current Stripe state. Enable receipts, trial-ending reminders and failed-payment notifications in Stripe. Verify payout setup before live launch.

## Teacher and learner access

The teacher registers, authorizes the offer and saves a card. Once setup is confirmed, the teacher trial activates and the account page can create a class invitation link. The teacher shares the link with their own learners; no automated messages are sent.

Learners register/sign in, enter a name their teacher recognizes and join the class. Up to 150 learner accounts can enroll per teacher, separate from the teacher's account. One atomic database insert enforces the cap. Repeat joins consume no additional seat. Removing a learner frees a seat. Creating a new invitation link invalidates the old link while retaining enrolled learners. Codes are hashed at rest.

Learner content access follows the sponsoring teacher's active subscription or trial, and stops if that access expires or the learner is removed. A learner's own separate individual subscription continues to grant personal access. Roster APIs derive the teacher from verified identity and cannot use a supplied teacher ID to read or alter someone else's roster.

## Build and deploy

```sh
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
npm run deploy
```

Node 22+ is needed for SQLite-backed tests, verified with Node 24. The build copies existing content to `dist` without rewriting lesson source. Keep Worker-first routing enabled for every asset. Do not deploy `dist` alone as an unprotected static site. Protected HTML gets Clerk session refresh and a My account link.

## Required provider-connected checks

Automated tests verify real JWT signatures, SQLite seat rules and mocked Stripe requests. They do not prove real charges or payouts.

Before live launch:

1. Register an individual, teacher and learner; verify email, sign-in/out and password recovery.
2. Verify individual Checkout charges $12 and provides no teacher offer.
3. Complete teacher setup; verify $0 initially and all 150 seats available during the trial.
4. Use a Stripe test clock: at day 14 verify exactly one $24.99 payment; at day 28 verify exactly one $49.99 payment; one calendar month later verify another $49.99 renewal. Check actual invoice totals and timestamps, not only subscription status.
5. Cancel before day 14 and verify no charges. Cancel during the introductory paid fortnight and verify no day-28 charge, while access lasts through day 28. Cancel during a regular month and verify no next renewal.
6. Test duplicate/delayed webhooks, repeated checkout clicks, refreshed return URLs, incomplete card setup and a returning teacher account.
7. Enroll learners 1–150, block learner 151, repeat a join, remove a learner, reuse the free seat and rotate the invitation link.
8. Verify another teacher cannot view or delete the first teacher's roster. Verify canceled, expired, paused and unpaid memberships no longer grant rostered learners access.
9. Test failed payments, card updates and recovery; verify the app cancellation button works during each introductory stage.
10. Verify protected script/image/content URLs deny anonymous and unsubscribed users, and responses cannot be shared through a public cache.
11. Check account/roster UI and an original lab on phone and desktop; leave a lesson open several minutes to verify token refresh.

After passing these checks, switch all provider settings to production, repeat a real purchase/cancellation with the owner and verify customer-facing pricing and payouts.

## Protection at cutover

The source repository and current GitHub Pages URL are public. The paid deployment cannot revoke those copies. After the paid site works, disable public Pages and make the repository private, retaining a private backup. Arrange continued access for existing testers first.

Existing ScreenPal videos have external links. This paywall protects discovery inside the word wall but cannot independently restrict a public ScreenPal link or erase prior downloads. Configure video-host privacy separately if required.


## Embedded checkout and current deployment configuration

Checkout renders inside the account page using Stripe.js createEmbeddedCheckoutPage and Checkout ui_mode embedded_page. Only card payments are enabled; redirect_on_completion never keeps completion on the site. Completion refreshes server-verified membership; webhooks remain required. The server returns the authenticated customer’s client secret, never a secret API key. Hosted open sessions are expired before a new embedded session is created.

Cloudflare project: math-word-wall-membership. Repository: kawista9/8math-wordwall-draft1. Production branch: launch/membership-paywall. Root directory: membership. Build: npm ci && npm run build. Deploy: npx wrangler deploy. Disable preview builds until separate test resources exist.

STRIPE_PUBLISHABLE_KEY is an additional required public variable (pk_live for the current live prices; pk_test with separate sandbox prices). The three owner-provided live price IDs are saved in wrangler.jsonc. Before deployment, replace the D1 database ID and SITE_URL and supply the Clerk configuration and Stripe secrets. Do not put secret keys in git. Test checkout and all teacher schedule phases in sandbox before opening live registration.

## Math Help Live and private tutoring

Existing installations: run `migrations/setup_learning_support.sql` in the Cloudflare D1 console (or `npx wrangler d1 execute math-word-wall-members --remote --file=migrations/setup_learning_support.sql`). This creates five additional tables without changing membership records. Fresh installations use the updated `schema.sql`.

Set the runtime variable `OWNER_USER_ID` to the instructor's Clerk user ID. This is the same explicit owner account bypass used by the original site. Do not set it to a learner's ID. Sign in at `/live` to see the instructor controls. The development and production Clerk accounts have different IDs; update this when switching Clerk to production.

- `/live` provides a public embedded YouTube lesson. The instructor supplies the 11-character video ID, next session date, and manually switches Live now on/off. This does not start a YouTube broadcast or detect live status automatically. Enable embedding in YouTube and start/end the broadcast there.
- Active members, including learners enrolled under an active teacher, submit advance questions and questions during the live hour. They see their own submissions; the instructor sees the queue and can mark questions handled. Submissions are text only, capped at 2,000 characters and 20 per user per hour. Questions poll every 15 seconds. Read questions on air without displaying names or private details.
- Learners request a preferred time, alternate availability, topic and contact email at least 48 hours ahead. The instructor approves a one-hour appointment or declines the request. Approval makes no charge. Approved appointments cannot overlap. Dates display in the device timezone. Learners return to this page to see approval and explicitly pay; email notifications are not implemented.
- The server charges $25 for an active individual membership; other eligible accounts (including teacher-enrolled learners) pay $50. Selecting Parent/Learner/Teacher does not change the charge. Checkout is a separate one-time payment; it never alters the subscription or default membership billing card.
- Booking checkout reserves the hour and expires after approximately 31 minutes. Expired sessions are reconciled when appointments are refreshed; approved appointments remain reserved after checkout expiry so their learner can retry payment. Payment confirmation verifies the stored session, identity, amount, and currency. The existing checkout.session.completed webhook handles tutoring. No extra recurring Stripe prices are required.
- Paid appointment details appear in the instructor view with the checkout contact email. The instructor can add an HTTPS private-lesson link; only that learner and the instructor can retrieve it through the booking API. Email notifications and automatic video-room creation are not implemented. Refunds/rescheduling are handled manually with the learner and Stripe; refunds do not currently update booking state automatically. A checkout created by Stripe whose database save fails remains reserved and needs manual reconciliation rather than being resold.

Before offering paid tutoring, test individual and teacher-enrolled bookings in a separate Stripe sandbox, verify approval permissions, webhook confirmation and checkout expiry recovery, and publish availability plus your cancellation/refund terms. The weekly group time and actual YouTube stream still need to be supplied by the instructor.

## Complimentary individual learners

Existing databases: execute `migrations/0005_complimentary_access.sql` in D1. Fresh databases use schema.sql. The owner manages grants in Instructor controls at `/live`. Learners register first; the owner copies their exact User ID from the connected Clerk instance, adds an optional label, and selects ongoing access or a future expiration in the owner device timezone. This requires no new Clerk secret or email lookup. Grants are individual-only: they do not create teacher plans or class rosters. Active grants provide content and weekly member questions, and qualify for $25 one-time hourly tutoring. Only the owner may list, grant, or revoke access; expiry and revocation are checked server-side on subsequent requests. Independent paid or teacher-sponsored access continues. Grants do not cancel, refund, pause, or otherwise change existing Stripe subscriptions. To change a grant, submit the same User ID again with the new expiry. When moving to production Clerk, recreate grants using production User IDs. No notification emails are sent.
