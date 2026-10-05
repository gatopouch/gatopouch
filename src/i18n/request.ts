import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";

// Imports explicites par locale (plus compatible avec Turbopack/Webpack)
import fr from "../messages/fr.json";
import en from "../messages/en.json";
import es from "../messages/es.json";
import de from "../messages/de.json";
import it from "../messages/it.json";

const messages = { fr, en, es, de, it };

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming locale is supported
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
