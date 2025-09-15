CREATE TABLE IF NOT EXISTS rate_limit (
    ip_address VARCHAR(45) PRIMARY KEY,
    request_count INTEGER NOT NULL DEFAULT 0,
    window_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit (window_start);