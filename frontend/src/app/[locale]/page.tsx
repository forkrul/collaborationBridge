import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const t = useTranslations('common');
  const tNav = useTranslations('navigation');
  const tDashboard = useTranslations('dashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Language Switcher */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{tNav('home')}</h1>
        <LanguageSwitcher variant="compact" />
      </header>

      {/* Welcome Section */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>{tDashboard('welcome', { name: 'User' })}</CardTitle>
            <CardDescription>
              Modern web application with internationalization support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-2xl font-bold text-blue-600">1,234</h3>
                <p className="text-sm text-muted-foreground">{tDashboard('stats.users')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-2xl font-bold text-green-600">€45,678</h3>
                <p className="text-sm text-muted-foreground">{tDashboard('stats.revenue')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-2xl font-bold text-orange-600">567</h3>
                <p className="text-sm text-muted-foreground">{tDashboard('stats.orders')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-2xl font-bold text-purple-600">+12%</h3>
                <p className="text-sm text-muted-foreground">{tDashboard('stats.growth')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Navigation Section */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>{tNav('dashboard')}</CardTitle>
            <CardDescription>
              Quick access to main application features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">
                {tNav('dashboard')}
              </Button>
              <Button variant="outline">
                {tNav('profile')}
              </Button>
              <Button variant="outline">
                {tNav('settings')}
              </Button>
              <Button variant="outline">
                {tNav('login')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Language Demo Section */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Language Support Demo</CardTitle>
            <CardDescription>
              This application supports 6 languages with full localization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Supported Languages:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>🇿🇦 Afrikaans (af)</li>
                  <li>🇬🇧 English (UK) (en-GB)</li>
                  <li>🇩🇪 German (de)</li>
                  <li>🇷🇴 Romanian (ro)</li>
                  <li>🇿🇦 isiZulu (zu)</li>
                  <li>🇨🇭 Swiss German (gsw-CH)</li>
                </ul>
              </div>
              <div className="pt-4">
                <LanguageSwitcher variant="default" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
