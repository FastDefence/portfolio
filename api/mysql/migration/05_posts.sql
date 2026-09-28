DROP PROCEDURE IF EXISTS migrate_posts;

DELIMITER $$

CREATE PROCEDURE migrate_posts()
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = DATABASE() AND table_name = 'articles'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = DATABASE() AND table_name = 'posts'
    ) THEN
        RENAME TABLE articles TO posts;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'posts'
          AND column_name = 'kind'
    ) THEN
        ALTER TABLE posts
            ADD COLUMN kind VARCHAR(20) NOT NULL DEFAULT 'article' AFTER id,
            ADD CONSTRAINT chk_posts_kind CHECK (kind IN ('article', 'daily')),
            ADD INDEX idx_posts_kind_created_at (kind, created_at);
    END IF;
END$$

DELIMITER ;

CALL migrate_posts();
DROP PROCEDURE migrate_posts;
