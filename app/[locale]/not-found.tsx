import { Link } from '@/lib/i18n/routing';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-brand-red mb-4">404</h1>
        <h2 className="text-3xl font-light text-text-dark-primary mb-4">Page non trouvée</h2>
        <p className="text-text-dark-secondary mb-8 max-w-md mx-auto">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="cta-primary">
            Retour à l&apos;accueil
          </Link>
          <Link href="/blog" className="cta-outline">
            Voir le blog
          </Link>
        </div>
      </div>
    </div>
  );
}
