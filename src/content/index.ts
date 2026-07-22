import { contentSchema, type Content } from "./schemas";
import { rawContent } from "./data";

/**
 * The validated content tree — parsing happens once at module load, so a
 * schema violation fails the build/tests instead of surfacing at runtime.
 */
export const content: Content = contentSchema.parse(rawContent);
