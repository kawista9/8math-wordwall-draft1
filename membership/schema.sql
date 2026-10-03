CREATE TABLE IF NOT EXISTS customers (
 user_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS subscriptions (
 subscription_id TEXT PRIMARY KEY, user_id TEXT NOT NULL,
 status TEXT NOT NULL, access_until INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS subscriptions_user ON subscriptions(user_id);
