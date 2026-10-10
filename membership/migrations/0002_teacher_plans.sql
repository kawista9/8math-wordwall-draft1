ALTER TABLE subscriptions ADD COLUMN plan TEXT NOT NULL DEFAULT 'individual';
ALTER TABLE subscriptions ADD COLUMN canceling INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS teacher_offers (
 user_id TEXT PRIMARY KEY, checkout_id TEXT NOT NULL UNIQUE,
 schedule_id TEXT, used INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS classrooms (
 teacher_id TEXT PRIMARY KEY, join_hash TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS learners (
 teacher_id TEXT NOT NULL, learner_id TEXT NOT NULL,
 display_name TEXT NOT NULL, joined_at INTEGER NOT NULL,
 PRIMARY KEY(teacher_id,learner_id)
);
CREATE INDEX IF NOT EXISTS learners_user ON learners(learner_id);

CREATE TABLE IF NOT EXISTS checkout_locks (
 user_id TEXT PRIMARY KEY, token TEXT NOT NULL, expires_at INTEGER NOT NULL
);
