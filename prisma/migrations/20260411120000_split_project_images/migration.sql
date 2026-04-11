-- Split Project.images into cover (cards), hero (case study), and gallery (artifacts).

ALTER TABLE "Project" ADD COLUMN "coverImage" TEXT;
ALTER TABLE "Project" ADD COLUMN "heroImage" TEXT;
ALTER TABLE "Project" ADD COLUMN "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "Project"
SET
  "coverImage" = CASE
    WHEN "images" IS NOT NULL AND cardinality("images") >= 1 THEN "images"[1]
    ELSE NULL
  END,
  "heroImage" = CASE
    WHEN "images" IS NOT NULL AND cardinality("images") >= 2 THEN "images"[2]
    WHEN "images" IS NOT NULL AND cardinality("images") = 1 THEN "images"[1]
    ELSE NULL
  END,
  "galleryImages" = CASE
    WHEN "images" IS NOT NULL AND cardinality("images") > 2 THEN (
      SELECT array_agg("images"[i] ORDER BY i)
      FROM generate_series(3, cardinality("images")) AS g(i)
    )
    ELSE ARRAY[]::TEXT[]
  END;

ALTER TABLE "Project" DROP COLUMN "images";
