import '@testing-library/jest-dom';
import { vi } from 'vitest';
import enTranslations from '../i18n/locales/en/translation.json';

/**
 * Flatten nested translation object to dot-notation keys.
 * e.g. { menu: { language: "Language" } } => { "menu.language": "Language" }
 */
function flattenTranslations(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
        const prefixedKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenTranslations(obj[key], prefixedKey));
        } else {
            acc[prefixedKey] = obj[key];
        }
        return acc;
    }, {});
}

const flatEn = flattenTranslations(enTranslations);

/**
 * Mock react-i18next to use the actual English translations.
 * This allows tests to search for real translated text (e.g. "Something went wrong")
 * while avoiding the need to initialize a full i18n instance.
 *
 * For testing actual language switching and locale files, see i18n.test.jsx
 * which uses its own isolated i18n instance.
 */
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            // Handle i18next pluralization: e.g. t('commentsOnArticle.title', { count: 1 })
            // looks up "title_one" or "title_other" depending on count
            if (options && options.count !== undefined) {
                const pluralKey = options.count === 1 ? `${key}_one` : `${key}_other`;
                if (flatEn[pluralKey]) {
                    return flatEn[pluralKey];
                }
                // Fallback: if count is 1, try singular, otherwise use the base key
                if (options.count === 1) {
                    return flatEn[key] || key;
                }
                return flatEn[key] || key;
            }
            return flatEn[key] || key;
        },
        i18n: {
            changeLanguage: vi.fn(() => new Promise(() => {})),
            language: 'en',
        },
    }),
    initReactI18next: {
        type: '3rdParty',
        init: vi.fn(),
    },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock URL.createObjectURL and URL.revokeObjectURL
URL.createObjectURL = vi.fn(() => 'blob:mock-url');
URL.revokeObjectURL = vi.fn();

// Mock DOMParser (used in stripHtml)
global.DOMParser = class {
  parseFromString(html, _type) {
    const cleanHtml = html.replace(/<[^>]*>/g, '');
    return {
      body: {
        textContent: cleanHtml,
      },
    };
  }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
