// Unmock react-i18next so we can test the actual translations
// The global mock in setup.js returns t(key) => key, which would prevent
// us from verifying the real translation values.
import { vi } from 'vitest';
vi.unmock('react-i18next');

import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from '../i18n/locales/en/translation.json';
import fr from '../i18n/locales/fr/translation.json';

// Create an isolated i18n instance so we don't pollute the global one
// used by other tests
const createTestI18n = (lng) => {
    const instance = i18n.createInstance();
    instance.use(initReactI18next).init({
        resources: {
            en: { translation: en },
            fr: { translation: fr },
        },
        lng,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });
    return instance;
};

// --- Test component that uses useTranslation hook ---
function createLanguageLabel(i18nInstance) {
    function LanguageLabel() {
        const { t } = useTranslation(undefined, { i18n: i18nInstance });
        return <span data-testid="language-label">{t('menu.language')}</span>;
    }
    return LanguageLabel;
}

describe('i18n translations - menu.language', () => {

    it('should have the menu.language key in English translations', () => {
        expect(en.menu).toBeDefined();
        expect(en.menu.language).toBeDefined();
        expect(en.menu.language).toBe('Language');
    });

    it('should have the menu.language key in French translations', () => {
        expect(fr.menu).toBeDefined();
        expect(fr.menu.language).toBeDefined();
        expect(fr.menu.language).toBe('Langue');
    });

    it('should render "Language" in English', () => {
        const testI18n = createTestI18n('en');
        const LanguageLabel = createLanguageLabel(testI18n);
        render(<LanguageLabel />);
        expect(screen.getByTestId('language-label')).toHaveTextContent('Language');
    });

    it('should render "Langue" in French', async () => {
        const testI18n = createTestI18n('fr');
        const LanguageLabel = createLanguageLabel(testI18n);
        render(<LanguageLabel />);
        expect(screen.getByTestId('language-label')).toHaveTextContent('Langue');
    });

    it('should switch from English to French and update the translation', async () => {
        const testI18n = createTestI18n('en');
        const LanguageLabel = createLanguageLabel(testI18n);
        render(<LanguageLabel />);
        expect(screen.getByTestId('language-label')).toHaveTextContent('Language');

        // Switch to French
        await act(async () => {
            await testI18n.changeLanguage('fr');
        });

        expect(screen.getByTestId('language-label')).toHaveTextContent('Langue');
    });

    it('should switch from French to English and update the translation', async () => {
        const testI18n = createTestI18n('fr');
        const LanguageLabel = createLanguageLabel(testI18n);
        render(<LanguageLabel />);
        expect(screen.getByTestId('language-label')).toHaveTextContent('Langue');

        // Switch to English
        await act(async () => {
            await testI18n.changeLanguage('en');
        });

        expect(screen.getByTestId('language-label')).toHaveTextContent('Language');
    });
});

describe('i18n translations - all menu keys', () => {
    const menuKeys = ['search', 'language', 'articles', 'admin', 'profile', 'yourArticles', 'writeNow', 'logout', 'login', 'register', 'searchNoResults', 'searchNoResultsHint'];

    it('should have all menu keys in English', () => {
        menuKeys.forEach(key => {
            expect(en.menu[key]).toBeDefined();
        });
    });

    it('should have all menu keys in French', () => {
        menuKeys.forEach(key => {
            expect(fr.menu[key]).toBeDefined();
        });
    });

    it('should have non-empty string values for all menu keys in English', () => {
        menuKeys.forEach(key => {
            expect(en.menu[key]).toBeTruthy();
            expect(typeof en.menu[key]).toBe('string');
        });
    });

    it('should have non-empty string values for all menu keys in French', () => {
        menuKeys.forEach(key => {
            expect(fr.menu[key]).toBeTruthy();
            expect(typeof fr.menu[key]).toBe('string');
        });
    });
});
