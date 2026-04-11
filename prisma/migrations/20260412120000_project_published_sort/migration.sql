-- Published flag + manual sort order for projects.

ALTER TABLE "Project" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Project" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

UPDATE "Project" p
SET "sortOrder" = sub.n
FROM (
  SELECT id, (ROW_NUMBER() OVER (ORDER BY "createdAt" DESC) - 1) * 10 AS n
  FROM "Project"
) sub
WHERE p.id = sub.id;
