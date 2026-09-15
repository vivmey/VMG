import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Mail, MapPin, Facebook, Instagram, Send } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { templateConfig } from '@/template.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('contactTitle'), description: t('contactDescription') };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Nous écrire"
        subtitle="Une question, une suggestion, une envie de s'engager ? Réponse sous 48h en moyenne."
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Contact form */}
            <div className="lg:col-span-2">
              <h2 className="text-[24px] md:text-[28px] font-serif text-navy mb-6">
                Formulaire de contact
              </h2>
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                action={`/${locale}/contact?success=1`}
                className="space-y-5"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Ne pas remplir : <input name="bot-field" />
                  </label>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-[13px] font-medium text-navy mb-2 block">Nom</span>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-medium text-navy mb-2 block">Email</span>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[13px] font-medium text-navy mb-2 block">Sujet</span>
                  <select
                    name="subject"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors bg-white"
                  >
                    <option value="">— Choisir un sujet —</option>
                    <option value="adhesion">Adhésion</option>
                    <option value="don">Don</option>
                    <option value="benevolat">Bénévolat</option>
                    <option value="aide-alimentaire">Aide alimentaire</option>
                    <option value="evenement">Événement</option>
                    <option value="presse">Presse / partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-[13px] font-medium text-navy mb-2 block">Message</span>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors resize-y"
                  />
                </label>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white h-[52px] px-7 rounded-xl inline-flex items-center gap-3 text-[15px] font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* Contact infos */}
            <aside className="space-y-6">
              <div className="bg-light rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-navy">Email</h3>
                </div>
                <a
                  href={`mailto:${templateConfig.contact.email}`}
                  className="text-[14px] text-body hover:text-primary transition-colors"
                >
                  {templateConfig.contact.email}
                </a>
              </div>

              <div className="bg-light rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-navy">Adresse</h3>
                </div>
                <p className="text-[14px] text-body">{templateConfig.contact.address}</p>
                <p className="text-[12px] text-body/70 mt-2">
                  {templateConfig.hours.permanence}
                </p>
              </div>

              <div className="bg-light rounded-2xl p-6">
                <h3 className="text-[15px] font-semibold text-navy mb-3">Réseaux sociaux</h3>
                <div className="flex gap-3">
                  <a
                    href={templateConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full bg-white text-navy hover:bg-primary hover:text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={templateConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full bg-white text-navy hover:bg-primary hover:text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
