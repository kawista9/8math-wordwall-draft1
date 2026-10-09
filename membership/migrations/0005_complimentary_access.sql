CREATE TABLE IF NOT EXISTS complimentary_access (
 user_id TEXT PRIMARY KEY,
 label TEXT NOT NULL DEFAULT '',
 expires_at INTEGER,
 revoked INTEGER NOT NULL DEFAULT 0 CHECK(revoked IN (0,1)),
 created_at INTEGER NOT NULL,
 granted_by TEXT NOT NULL
);
