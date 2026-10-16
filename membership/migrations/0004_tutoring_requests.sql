CREATE TABLE IF NOT EXISTS tutoring_requests (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 starts_at INTEGER NOT NULL,
 alternatives TEXT NOT NULL DEFAULT '',
 topic TEXT NOT NULL,
 contact_email TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'requested' CHECK(state IN ('requested','approved','declined')),
 booking_id TEXT,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS tutoring_requests_user ON tutoring_requests(user_id,created_at);
