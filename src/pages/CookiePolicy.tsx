import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Shield, BarChart, Lock } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Cookie className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Politique de Cookies</h1>
            <p className="text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Introduction */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground">
                Ce site utilise des cookies pour améliorer votre expérience de navigation,
                analyser l'utilisation du site et vous proposer des fonctionnalités personnalisées.
              </p>
            </CardContent>
          </Card>

          {/* What are cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                Qu'est-ce qu'un cookie ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone)
                lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et
                préférences pendant une période donnée.
              </p>
            </CardContent>
          </Card>

          {/* Types of cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Types de cookies utilisés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Essential Cookies */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-lg">1. Cookies Essentiels (Obligatoires)</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground pl-7 space-y-1">
                  <li><strong>access_token</strong> - Maintient votre session utilisateur connectée</li>
                  <li><strong>cookie-consent</strong> - Enregistre votre choix concernant les cookies</li>
                  <li>Durée de conservation : 7 jours (session), permanent (consentement)</li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">2. Cookies d'Analyse (Optionnels)</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Ces cookies nous aident à comprendre comment les visiteurs utilisent le site.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground pl-7 space-y-1">
                  <li>Nombre de visiteurs</li>
                  <li>Pages les plus consultées</li>
                  <li>Temps passé sur le site</li>
                  <li>Pays d'origine des visiteurs</li>
                  <li>Durée de conservation : 30 jours</li>
                </ul>
              </div>

              {/* Third-party Cookies */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-lg">3. Cookies Tiers</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Cookies déposés par des services externes que nous utilisons :
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground pl-7 space-y-1">
                  <li><strong>Cloudinary</strong> - Hébergement et optimisation des images</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How to manage cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Gérer vos préférences de cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Vous pouvez à tout moment modifier vos préférences de cookies :
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li>
                  <strong>Via notre bannière</strong> : Supprimez votre choix en effaçant les données du site,
                  la bannière réapparaîtra
                </li>
                <li>
                  <strong>Via votre navigateur</strong> : Consultez les paramètres de votre navigateur pour
                  bloquer ou supprimer les cookies
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ <strong>Attention :</strong> Le refus ou la suppression de certains cookies peut affecter
                  le fonctionnement du site (par exemple, vous ne pourrez plus rester connecté).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your rights */}
          <Card>
            <CardHeader>
              <CardTitle>Vos droits (RGPD)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification de vos données</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit d'opposition au traitement de vos données</li>
                <li>Droit à la portabilité de vos données</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pour toute question concernant notre politique de cookies ou pour exercer vos droits,
                vous pouvez nous contacter via notre{' '}
                <a href="/contact" className="text-primary hover:underline">
                  formulaire de contact
                </a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
