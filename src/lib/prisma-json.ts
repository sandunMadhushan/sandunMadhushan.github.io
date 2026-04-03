import { Prisma } from "@prisma/client";

/** Maps API `null` to DB NULL for optional Json fields. */
export function optionalJson(
  v: unknown,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (v === undefined) return undefined;
  if (v === null) return Prisma.DbNull;
  return v as Prisma.InputJsonValue;
}
