import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LOCALES,
  STORAGE_KEY,
  LocaleContext,
  dictionaries,
  resolveInitialLocale,
  translate,
} from "./i18n";

/** Map a stored/requested code to a known locale, falling back to en-US. */
const resolveLocale = (code) => LOCALES.find((entry) => entry.code === code) || LOCALES[0];

/**
 * The saved choice, or null when there isn't a usable one. localStorage throws
 * in some private-mode browsers, and can hold a code from an older release.
 */
const readStoredLocale = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/** The browser's languages, most preferred first. */
const readBrowserLanguages = () => {
  if (typeof navigator === "undefined") return [];
  const { languages, language } = navigator;
  if (Array.isArray(languages) && languages.length) return [...languages];
  return language ? [language] : [];
};

/**
 * Owns the app's single locale setting.
 *
 * The starting language is settled once, before the first paint — a saved choice
 * wins, otherwise the visitor's browser language, otherwise en-US — so nothing
 * flashes in the wrong language on the way in.
 *
 * A detected language is deliberately NOT written to storage: it is a default,
 * not a decision, so an explicit choice stays distinguishable and always
 * overrides it. Choosing a locale writes straight back to localStorage, which is
 * what makes it survive a reload.
 *
 * This file exports a component and nothing else: mixing component and
 * non-component exports in one module breaks fast refresh.
 */
const LocaleProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(() =>
    resolveInitialLocale({ stored: readStoredLocale(), preferred: readBrowserLanguages() })
  );

  const localeEntry = useMemo(() => resolveLocale(locale), [locale]);

  // <html lang> drives screen-reader pronunciation, hyphenation and the
  // browser's translate prompt, so it has to follow the setting.
  useEffect(() => {
    document.documentElement.lang = localeEntry.tag;
  }, [localeEntry]);

  const setLocale = useCallback((code) => {
    const next = resolveLocale(code);
    setLocaleState(next.code);
    try {
      localStorage.setItem(STORAGE_KEY, next.code);
    } catch {
      // Storage unavailable — the choice is still live for this session.
    }
  }, []);

  const value = useMemo(() => {
    const dictionary = dictionaries[localeEntry.code];
    return {
      locale: localeEntry.code,
      localeEntry,
      setLocale,
      // Bound to the active dictionary so callers just write t("some.key").
      t: (key, vars) => translate(dictionary, key, vars),
    };
  }, [localeEntry, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export default LocaleProvider;
