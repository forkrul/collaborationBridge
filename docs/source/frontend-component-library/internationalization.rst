Internationalization
====================

The Frontend Component Library provides comprehensive internationalization (i18n) support for building multilingual applications with cultural adaptations.

Supported Languages
-------------------

The component library supports 6 languages with full cultural adaptations:

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Language
     - Code
     - Region
     - Notes
   * - English (UK)
     - en-GB
     - United Kingdom
     - Default language, British conventions
   * - Afrikaans
     - af
     - South Africa
     - South African Afrikaans
   * - German
     - de
     - Germany
     - Standard German
   * - Romanian
     - ro
     - Romania
     - Romanian
   * - isiZulu
     - zu
     - South Africa
     - South African Zulu
   * - Swiss German
     - gsw-CH
     - Switzerland
     - Zürich dialect

Language Integration
--------------------

All components integrate seamlessly with next-intl for translation and locale-aware formatting.

Basic Usage
~~~~~~~~~~~

.. code-block:: typescript

   import { useTranslations, useLocale } from 'next-intl';

   function MyComponent() {
     const t = useTranslations('common');
     const locale = useLocale();

     return (
       <div>
         <h1>{t('welcome')}</h1>
         <p>{t('currentLocale', { locale })}</p>
         <Button>{t('save')}</Button>
       </div>
     );
   }

Component Integration
~~~~~~~~~~~~~~~~~~~~~

Components automatically use translations when available:

.. code-block:: typescript

   // Form components with i18n
   function ContactForm() {
     const t = useTranslations('forms');

     return (
       <Form>
         <FormField
           name="email"
           render={({ field }) => (
             <FormItem>
               <FormLabel>{t('email')}</FormLabel>
               <FormControl>
                 <Input placeholder={t('emailPlaceholder')} {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
         <Button type="submit">{t('submit')}</Button>
       </Form>
     );
   }

   // Navigation with i18n
   function Navigation() {
     const t = useTranslations('navigation');

     return (
       <NavigationMenu>
         <NavigationMenuList>
           <NavigationMenuItem>
             <NavigationMenuLink href="/dashboard">
               {t('dashboard')}
             </NavigationMenuLink>
           </NavigationMenuItem>
           <NavigationMenuItem>
             <NavigationMenuLink href="/settings">
               {t('settings')}
             </NavigationMenuLink>
           </NavigationMenuItem>
         </NavigationMenuList>
       </NavigationMenu>
     );
   }

Translation Files
-----------------

Translation files are organized by namespace and locale:

.. code-block:: text

   messages/
   ├── en-GB/
   │   ├── common.json
   │   ├── navigation.json
   │   ├── forms.json
   │   └── dashboard.json
   ├── de/
   │   ├── common.json
   │   ├── navigation.json
   │   ├── forms.json
   │   └── dashboard.json
   └── ...

Common Translations
~~~~~~~~~~~~~~~~~~~

.. code-block:: json

   // messages/en-GB/common.json
   {
     "save": "Save",
     "cancel": "Cancel",
     "delete": "Delete",
     "edit": "Edit",
     "loading": "Loading...",
     "error": "Error",
     "success": "Success",
     "confirm": "Confirm",
     "close": "Close",
     "next": "Next",
     "previous": "Previous",
     "search": "Search",
     "filter": "Filter",
     "clear": "Clear",
     "submit": "Submit"
   }

   // messages/de/common.json
   {
     "save": "Speichern",
     "cancel": "Abbrechen",
     "delete": "Löschen",
     "edit": "Bearbeiten",
     "loading": "Wird geladen...",
     "error": "Fehler",
     "success": "Erfolgreich",
     "confirm": "Bestätigen",
     "close": "Schließen",
     "next": "Weiter",
     "previous": "Zurück",
     "search": "Suchen",
     "filter": "Filter",
     "clear": "Löschen",
     "submit": "Senden"
   }

Navigation Translations
~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: json

   // messages/en-GB/navigation.json
   {
     "home": "Home",
     "dashboard": "Dashboard",
     "settings": "Settings",
     "profile": "Profile",
     "logout": "Logout",
     "menu": "Menu"
   }

   // messages/af/navigation.json
   {
     "home": "Tuis",
     "dashboard": "Kontrolepaneel",
     "settings": "Instellings",
     "profile": "Profiel",
     "logout": "Teken uit",
     "menu": "Kieslys"
   }

Form Translations
~~~~~~~~~~~~~~~~~

.. code-block:: json

   // messages/en-GB/forms.json
   {
     "email": "Email",
     "emailPlaceholder": "Enter your email address",
     "password": "Password",
     "passwordPlaceholder": "Enter your password",
     "firstName": "First Name",
     "lastName": "Last Name",
     "phoneNumber": "Phone Number",
     "address": "Address",
     "validation": {
       "required": "This field is required",
       "invalidEmail": "Please enter a valid email address",
       "passwordTooShort": "Password must be at least 8 characters",
       "passwordsDoNotMatch": "Passwords do not match"
     }
   }

Locale-Aware Formatting
-----------------------

Components automatically format numbers, dates, and currencies according to the current locale.

Number Formatting
~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { useLocale } from 'next-intl';

   function StatCard({ value }: { value: number }) {
     const locale = useLocale();

     const formatNumber = (num: number) => {
       return new Intl.NumberFormat(locale, {
         notation: num >= 1000000 ? 'compact' : 'standard',
         maximumFractionDigits: 1,
       }).format(num);
     };

     return (
       <Card>
         <CardContent>
           <div className="text-2xl font-bold">
             {formatNumber(value)}
           </div>
         </CardContent>
       </Card>
     );
   }

   // Results:
   // en-GB: 1,234,567 → 1.2M
   // de: 1.234.567 → 1,2 Mio.
   // gsw-CH: 1'234'567 → 1.2 Mio.

Currency Formatting
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function PriceDisplay({ amount, currency = 'EUR' }: { amount: number; currency?: string }) {
     const locale = useLocale();

     const formatCurrency = (value: number) => {
       return new Intl.NumberFormat(locale, {
         style: 'currency',
         currency,
       }).format(value);
     };

     return (
       <span className="font-semibold">
         {formatCurrency(amount)}
       </span>
     );
   }

   // Results:
   // en-GB: €1,234.56
   // de: 1.234,56 €
   // gsw-CH: CHF 1'234.56

Date Formatting
~~~~~~~~~~~~~~~

.. code-block:: typescript

   function DateDisplay({ date }: { date: Date }) {
     const locale = useLocale();

     const formatDate = (date: Date) => {
       return new Intl.DateTimeFormat(locale, {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
       }).format(date);
     };

     const formatRelativeTime = (date: Date) => {
       const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
       const diffInDays = Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
       return rtf.format(diffInDays, 'day');
     };

     return (
       <div>
         <div>{formatDate(date)}</div>
         <div className="text-sm text-muted-foreground">
           {formatRelativeTime(date)}
         </div>
       </div>
     );
   }

   // Results:
   // en-GB: 15 March 2024, yesterday
   // de: 15. März 2024, gestern
   // zu: 15 Mashi 2024, izolo

Language Switcher
-----------------

The LanguageSwitcher component provides an intuitive way for users to change languages.

Basic Usage
~~~~~~~~~~~

.. code-block:: typescript

   import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

   // In header or navigation
   <Header>
     <div className="flex items-center space-x-4">
       <Navigation />
       <LanguageSwitcher />
     </div>
   </Header>

   // Compact variant
   <LanguageSwitcher variant="compact" />

   // With custom styling
   <LanguageSwitcher className="border-2" />

Features
~~~~~~~~

* **Flag Icons**: Visual representation of each language
* **Native Names**: Languages shown in their native script
* **Keyboard Navigation**: Full keyboard accessibility
* **Smooth Transitions**: Animated language switching
* **Persistence**: Remembers user's language preference

Implementation
~~~~~~~~~~~~~~

.. code-block:: typescript

   function LanguageSwitcher({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
     const locale = useLocale();
     const router = useRouter();
     const pathname = usePathname();

     const languages = [
       { code: 'en-GB', name: 'English', flag: '🇬🇧' },
       { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
       { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
       { code: 'ro', name: 'Română', flag: '🇷🇴' },
       { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
       { code: 'gsw-CH', name: 'Schwiizerdütsch', flag: '🇨🇭' },
     ];

     const handleLanguageChange = (newLocale: string) => {
       const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
       router.push(newPath);
     };

     if (variant === 'compact') {
       return (
         <Select value={locale} onValueChange={handleLanguageChange}>
           <SelectTrigger className="w-20">
             <SelectValue />
           </SelectTrigger>
           <SelectContent>
             {languages.map((lang) => (
               <SelectItem key={lang.code} value={lang.code}>
                 {lang.flag} {lang.code.toUpperCase()}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
       );
     }

     return (
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button variant="outline" size="sm">
             {languages.find(l => l.code === locale)?.flag} {locale.toUpperCase()}
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent>
           {languages.map((lang) => (
             <DropdownMenuItem
               key={lang.code}
               onClick={() => handleLanguageChange(lang.code)}
             >
               {lang.flag} {lang.name}
             </DropdownMenuItem>
           ))}
         </DropdownMenuContent>
       </DropdownMenu>
     );
   }

Cultural Adaptations
--------------------

Beyond translation, components adapt to cultural conventions:

Text Direction
~~~~~~~~~~~~~~

Components are prepared for RTL (Right-to-Left) languages:

.. code-block:: css

   /* Logical properties for RTL support */
   .component {
     margin-inline-start: 1rem;
     padding-inline-end: 0.5rem;
     border-inline-start: 1px solid;
   }

   /* RTL-specific styles */
   [dir="rtl"] .component {
     transform: scaleX(-1);
   }

Regional Preferences
~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Address format adaptation
   function AddressForm() {
     const locale = useLocale();
     const t = useTranslations('forms');

     const isGermanSpeaking = ['de', 'gsw-CH'].includes(locale);
     const isSouthAfrican = ['af', 'zu'].includes(locale);

     return (
       <div className="space-y-4">
         {isSouthAfrican && (
           <FormField name="suburb">
             <FormLabel>{t('suburb')}</FormLabel>
             <Input />
           </FormField>
         )}
         
         <div className="grid grid-cols-2 gap-4">
           <FormField name={isGermanSpeaking ? 'plz' : 'postcode'}>
             <FormLabel>{t(isGermanSpeaking ? 'plz' : 'postcode')}</FormLabel>
             <Input />
           </FormField>
           <FormField name="city">
             <FormLabel>{t('city')}</FormLabel>
             <Input />
           </FormField>
         </div>
       </div>
     );
   }

Phone Number Formatting
~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function PhoneInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
     const locale = useLocale();

     const formatPhoneNumber = (phone: string) => {
       // Remove all non-digits
       const digits = phone.replace(/\D/g, '');

       switch (locale) {
         case 'de':
           // German format: +49 30 12345678
           return digits.replace(/(\d{2})(\d{2})(\d{8})/, '+$1 $2 $3');
         case 'gsw-CH':
           // Swiss format: +41 44 123 45 67
           return digits.replace(/(\d{2})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
         case 'af':
         case 'zu':
           // South African format: +27 11 123 4567
           return digits.replace(/(\d{2})(\d{2})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
         default:
           // UK format: +44 20 1234 5678
           return digits.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 $2 $3 $4');
       }
     };

     return (
       <Input
         value={formatPhoneNumber(value)}
         onChange={(e) => onChange(e.target.value)}
         placeholder={getPhonePlaceholder(locale)}
       />
     );
   }

Translation Management
----------------------

Best Practices
~~~~~~~~~~~~~~

1. **Namespace Organization**: Group related translations together
2. **Key Naming**: Use descriptive, hierarchical keys
3. **Pluralization**: Handle singular/plural forms correctly
4. **Context**: Provide context for translators
5. **Validation**: Validate translation completeness

Translation Workflow
~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Translation validation
   function validateTranslations() {
     const baseLocale = 'en-GB';
     const baseMessages = require(`./messages/${baseLocale}/common.json`);
     const locales = ['de', 'af', 'ro', 'zu', 'gsw-CH'];

     locales.forEach(locale => {
       const messages = require(`./messages/${locale}/common.json`);
       const missingKeys = findMissingKeys(baseMessages, messages);
       
       if (missingKeys.length > 0) {
         console.warn(`Missing translations in ${locale}:`, missingKeys);
       }
     });
   }

   // Translation helper
   function createTranslationHelper(namespace: string) {
     return function useT() {
       const t = useTranslations(namespace);
       
       return {
         t,
         // Helper for conditional translations
         tc: (key: string, condition: boolean, fallback?: string) => {
           return condition ? t(key) : (fallback || '');
         },
         // Helper for pluralization
         tp: (key: string, count: number) => {
           return t(key, { count });
         },
       };
     };
   }

Performance Optimization
------------------------

Translation Loading
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Lazy load translations
   async function loadTranslations(locale: string) {
     const translations = await import(`./messages/${locale}/common.json`);
     return translations.default;
   }

   // Preload critical translations
   function preloadTranslations() {
     const criticalNamespaces = ['common', 'navigation'];
     const currentLocale = getCurrentLocale();
     
     criticalNamespaces.forEach(namespace => {
       import(`./messages/${currentLocale}/${namespace}.json`);
     });
   }

Bundle Optimization
~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

   // Next.js configuration for i18n
   module.exports = {
     i18n: {
       locales: ['en-GB', 'de', 'af', 'ro', 'zu', 'gsw-CH'],
       defaultLocale: 'en-GB',
       localeDetection: true,
     },
     // Optimize translation bundles
     webpack: (config) => {
       config.optimization.splitChunks.cacheGroups.translations = {
         name: 'translations',
         test: /messages\/.*\.json$/,
         chunks: 'all',
         enforce: true,
       };
       return config;
     },
   };

Testing Internationalization
-----------------------------

Translation Testing
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   describe('Internationalization', () => {
     it('should render in different languages', () => {
       const locales = ['en-GB', 'de', 'af'];
       
       locales.forEach(locale => {
         render(
           <NextIntlProvider locale={locale} messages={messages[locale]}>
             <MyComponent />
           </NextIntlProvider>
         );
         
         // Test that content is translated
         expect(screen.getByText(messages[locale].common.save)).toBeInTheDocument();
       });
     });

     it('should format numbers correctly', () => {
       const testCases = [
         { locale: 'en-GB', number: 1234.56, expected: '1,234.56' },
         { locale: 'de', number: 1234.56, expected: '1.234,56' },
         { locale: 'gsw-CH', number: 1234.56, expected: '1'234.56' },
       ];

       testCases.forEach(({ locale, number, expected }) => {
         const formatted = new Intl.NumberFormat(locale).format(number);
         expect(formatted).toBe(expected);
       });
     });
   });

Accessibility Testing
~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Test language switching accessibility
   it('should announce language changes to screen readers', async () => {
     render(<LanguageSwitcher />);
     
     const languageButton = screen.getByRole('button', { name: /language/i });
     fireEvent.click(languageButton);
     
     const germanOption = screen.getByRole('menuitem', { name: /deutsch/i });
     fireEvent.click(germanOption);
     
     // Verify language change is announced
     await waitFor(() => {
       expect(screen.getByLabelText(/current language.*deutsch/i)).toBeInTheDocument();
     });
   });

Migration Guide
---------------

Adding New Languages
~~~~~~~~~~~~~~~~~~~~

1. **Create Translation Files**: Add new locale directory with translation files
2. **Update Configuration**: Add locale to Next.js i18n configuration
3. **Add to Language Switcher**: Include new language in switcher options
4. **Test Thoroughly**: Test all components with new locale
5. **Update Documentation**: Document any cultural adaptations needed

Updating Translations
~~~~~~~~~~~~~~~~~~~~~

1. **Update Base Language**: Modify en-GB translations first
2. **Propagate Changes**: Update all other locales
3. **Validate Completeness**: Ensure no missing translations
4. **Test Components**: Verify components work with new translations
5. **Review Cultural Adaptations**: Check if cultural changes are needed
