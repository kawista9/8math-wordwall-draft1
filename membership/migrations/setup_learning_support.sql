CREATE TABLE IF NOT EXISTS live_settings (id INTEGER PRIMARY KEY CHECK(id=1), video_id TEXT NOT NULL DEFAULT '', is_live INTEGER NOT NULL DEFAULT 0, starts_at INTEGER);
INSERT OR IGNORE INTO live_settings(id) VALUES(1);
CREATE TABLE IF NOT EXISTS live_questions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('advance','chat')), body TEXT NOT NULL, created_at INTEGER NOT NULL, removed INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS live_questions_user ON live_questions(user_id,created_at);
CREATE TABLE IF NOT EXISTS tutoring_slots (id TEXT PRIMARY KEY, starts_at INTEGER NOT NULL UNIQUE, state TEXT NOT NULL DEFAULT 'open' CHECK(state IN ('open','held','paid','closed')), booking_id TEXT);
CREATE TABLE IF NOT EXISTS tutoring_bookings (id TEXT PRIMARY KEY, slot_id TEXT NOT NULL, user_id TEXT NOT NULL, amount INTEGER NOT NULL, topic TEXT NOT NULL, checkout_id TEXT, contact_email TEXT, lesson_url TEXT, state TEXT NOT NULL DEFAULT 'pending', created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS tutoring_bookings_user ON tutoring_bookings(user_id,created_at);

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
