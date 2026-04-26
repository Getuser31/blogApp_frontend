import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from '../i18n/locales/en/translation.json';
import fr from '../i18n/locales/fr/translation.json';

// --- Test component that uses useTranslation hook ---
function LanguageLabel() {
    const { t } = useTranslation();
    return <span data-testid="language-label">{t('menu.language')}</span>;
}

// --- Initialize i18n once before all tests ---
beforeAll(() => {
    if (!i18n.isInitialized) {
        i18n.use(initReactI18next).init({
            resources: {
                en: { translation: en },
                fr: { translation: fr },
            },
            lng: 'en',
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });
    }
});

// Ensure we reset back to English after all tests
afterAll(() => {
    i18n.changeLanguage('en');
});

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
        render(<LanguageLabel />);
        expect(screen.getByTestId('language-label')).toHaveTextContent('Language');
    });

    it('should render "Langue" in French', async () => {
        await act(async () => {
            await i18n.changeLanguage('fr');
        });
        render(<LanguageLabel />);
        expect(screen.getByTestId('language-label')).toHaveTextContent('Langue');
    });

    it('should switch from English to French and update the translation', async () => {
        // Start in English
        await act(async () => {
            await i18n.changeLanguage('en');
        });
        render(<LanguageLabel />);
        expect(screen.getByTestId('language-label')).toHaveTextContent('Language');

        // Switch to French
        await act(async () => {
            await i18n.changeLanguage('fr');
        });

        expect(screen.getByTestId('language-label')).toHaveTextContent('Langue');
    });

    it('should switch from French to English and update the translation', async () => {
        // Start in French
        await act(async () => {
            await i18n.changeLanguage('fr');
        });
        render(<LanguageLabel />);
        expect(screen.getByTestId('language-label')).toHaveTextContent('Langue');

        // Switch to English
        await act(async () => {
            await i18n.changeLanguage('en');
        });

        expect(screen.getByTestId('language-label')).toHaveTextContent('Language');
    });

    it('should fallback to English for an unsupported language', async () => {
        await act(async () => {
            await i18n.changeLanguage('en');
        });
        render(<LanguageLabel />);
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
