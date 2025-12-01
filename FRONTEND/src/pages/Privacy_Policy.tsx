import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface SectionProps {
    id: string;
    title: string;
    children: ReactNode;
    expandedSections: Record<string, boolean>;
    onToggle: (id: string) => void;
}

function Section(props: SectionProps) {
    const { id, title, children, expandedSections, onToggle } = props;
    const isExpanded = expandedSections[id] || false;

    return (
        <div className="section">
            <button
                className="section-button"
                onClick={() => onToggle(id)}
            >
                <h2 className="section-title">{title}</h2>
                <ChevronDown
                    size={20}
                    className={`chevron ${isExpanded ? 'rotated' : ''}`}
                />
            </button>
            {isExpanded && (
                <div className="section-content">
                    {children}
                </div>
            )}
        </div>
    );
}

function Policy_Privacy() {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <>
            <div className="container-policy">
                <div className="header-policy">
                    <div className="header-content">
                        <h1>Politique de Confidentialité</h1>
                        <p>Dernière mise à jour: 01/12/2025</p>
                    </div>
                </div>

                <div className="content">
                    <Section id="1" title="1. INTRODUCTION" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Nous accordons une grande importance à la protection de vos données personnelles. Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme.</p>
                        <p style={{marginTop: '12px'}}>En accédant à notre site et en utilisant nos services, vous acceptez les pratiques décrites dans cette politique.</p>
                    </Section>

                    <Section id="2" title="2. RESPONSABLE DU TRAITEMENT DES DONNÉES" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p><strong>Nom:</strong> Payet</p>
                        <p><strong>Adresse:</strong> Michel</p>
                        <p><strong>Email:</strong> michel.payet974@live.fr</p>
                        <p><strong>Téléphone:</strong> 06 92 12 34 56</p>
                        <p style={{marginTop: '12px'}}>Pour toute question concernant vos données personnelles, veuillez nous contacter aux coordonnées ci-dessus.</p>
                    </Section>

                    <Section id="3" title="3. DONNÉES COLLECTÉES" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p><strong>Informations d'inscription:</strong></p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Adresse email</li>
                            <li>Nom et prénom</li>
                            <li>Mot de passe (crypté)</li>
                            <li>Photo de profil (optionnel)</li>
                            <li>Informations de facturation (si applicable)</li>
                        </ul>

                        <p style={{marginTop: '12px'}}><strong>Données d'utilisation:</strong></p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Historique des générations d'images</li>
                            <li>Conversations avec le chatbot IA</li>
                            <li>Prompts et requêtes utilisés</li>
                            <li>Date et heure des accès</li>
                            <li>Duré des sessions</li>
                        </ul>
                    </Section>

                    <Section id="4" title="4. BASE JURIDIQUE DU TRAITEMENT" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Nous traitons vos données personnelles sur les bases juridiques suivantes:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li><strong>Consentement:</strong> Vous avez donné votre consentement pour un ou plusieurs objectifs spécifiques</li>
                            <li><strong>Contrat:</strong> Le traitement est nécessaire pour l'exécution d'un contrat auquel vous êtes partie</li>
                            <li><strong>Obligation légale:</strong> Le traitement est nécessaire pour respecter une obligation légale</li>
                            <li><strong>Intérêts légitimes:</strong> Le traitement est nécessaire pour nos intérêts légitimes ou ceux de tiers</li>
                        </ul>
                    </Section>

                    <Section id="5" title="5. UTILISATION DES DONNÉES" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Nous utilisons vos données personnelles pour:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Créer et gérer votre compte utilisateur</li>
                            <li>Fournir les services demandés (génération d'images, chatbot IA)</li>
                            <li>Personnaliser votre expérience</li>
                            <li>Envoyer des notifications et mises à jour importantes</li>
                            <li>Traiter les paiements et facturer les services</li>
                            <li>Améliorer nos services et l'expérience utilisateur</li>
                            <li>Analyser l'utilisation de notre plateforme</li>
                            <li>Détecter et prévenir les fraudes et abus</li>
                            <li>Répondre à vos demandes et questions</li>
                            <li>Respecter nos obligations légales et réglementaires</li>
                        </ul>
                    </Section>

                    <Section id="6" title="6. PARTAGE DES DONNÉES" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Nous ne vendons jamais vos données personnelles à des tiers. Cependant, nous pouvons les partager avec:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li><strong>Prestataires de services:</strong> Hébergeurs, fournisseurs de paiement, prestataires d'analyse</li>
                            <li><strong>Partenaires technologiques:</strong> Fournisseurs d'IA et services cloud</li>
                            <li><strong>Autorités légales:</strong> Si requis par la loi ou pour protéger nos droits</li>
                            <li><strong>En cas de fusion ou acquisition:</strong> Vos données pourraient être transférées dans le contexte d'une fusion, acquisition ou vente d'actifs</li>
                        </ul>
                        <p style={{marginTop: '12px'}}>Tous nos partenaires sont tenu de respecter la confidentialité de vos données et de les traiter conformément à la loi.</p>
                    </Section>

                    <Section id="7" title="7. CONSERVATION DES DONNÉES" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et à des fins légales.</p>
                        <p style={{marginTop: '12px'}}><strong>Durée de conservation:</strong></p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Données de compte: Pendant la durée de votre compte</li>
                            <li>Historique d'utilisation: 6 mois</li>
                            <li>Données de paiement: Selon les obligations légales comptables (2 ans)</li>
                            <li>Logs techniques: 6 mois</li>
                        </ul>
                        <p style={{marginTop: '12px'}}>Vous pouvez demander la suppression de vos données à tout moment, sauf si nous avons une obligation légale de les conserver.</p>
                    </Section>

                    <Section id="8" title="8. SÉCURITÉ DES DONNÉES" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Nous mettons en place des mesures de sécurité appropriées pour protéger vos données personnelles contre l'accès non autorisé, la modification ou la destruction:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Chiffrement SSL/TLS pour les transmissions</li>
                            <li>Mots de passe cryptés</li>
                            <li>Accès limité aux données sensibles</li>
                            <li>Pare-feu et systèmes de détection d'intrusions</li>
                            <li>Sauvegardes régulières</li>
                            <li>Audit de sécurité réguliers</li>
                        </ul>
                        <p style={{marginTop: '12px'}}>Cependant, aucun système n'est 100% sécurisé. Si vous soupçonnez une violation de sécurité, veuillez nous le signaler immédiatement.</p>
                    </Section>

                    <Section id="9" title="9. VOS DROITS CONCERNANT VOS DONNÉES" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Conformément au RGPD, vous disposez des droits suivants:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li><strong>Droit d'accès:</strong> Vous pouvez demander l'accès à vos données personnelles</li>
                            <li><strong>Droit de rectification:</strong> Vous pouvez demander la correction de données inexactes</li>
                            <li><strong>Droit à l'oubli:</strong> Vous pouvez demander la suppression de vos données (sauf obligations légales)</li>
                            <li><strong>Droit à la limitation du traitement:</strong> Vous pouvez demander la limitation de l'utilisation de vos données</li>
                            <li><strong>Droit à la portabilité des données:</strong> Vous pouvez recevoir vos données dans un format structuré et courant</li>
                            <li><strong>Droit d'opposition:</strong> Vous pouvez vous opposer à certains traitements</li>
                            <li><strong>Droit de retirer le consentement:</strong> Vous pouvez retirer votre consentement à tout moment</li>
                        </ul>
                        <p style={{marginTop: '12px'}}>Pour exercer ces droits, veuillez nous contacter à michel.payet974@live.fr.</p>
                    </Section>

                    <Section id="10" title="10. COOKIES ET TECHNOLOGIES DE SUIVI" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Notre site utilise des cookies et technologies similaires pour améliorer votre expérience:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li><strong>Cookies essentiels:</strong> Nécessaires au fonctionnement du site</li>
                            <li><strong>Cookies de performance:</strong> Pour analyser l'utilisation du site</li>
                            <li><strong>Cookies de fonctionnalité:</strong> Pour mémoriser vos préférences</li>
                        </ul>
                        <p style={{marginTop: '12px'}}>Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur. Le refus de certains cookies peut affecter la fonctionnalité du site.</p>
                    </Section>

                    <Section id="11" title="11. TRANSFERTS DE DONNÉES INTERNATIONAUX" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Vos données peuvent être traitées dans des pays autres que celui où vous résidez. Ces pays peuvent avoir des lois de protection des données différentes.</p>
                        <p style={{marginTop: '12px'}}>Nous veillons à ce que les transferts internationaux bénéficient de mécanismes de protection appropriés, notamment:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Clauses contractuelles types approuvées par la Commission Européenne</li>
                            <li>Certifications adéquates de protection des données</li>
                            <li>Mesures supplémentaires de sécurité</li>
                        </ul>
                    </Section>

                    <Section id="12" title="12. DONNÉES DES MINEURS" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Notre service n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas intentionnellement des données de mineurs.</p>
                        <p style={{marginTop: '12px'}}>Si nous découvrons que nous avons collecté des données d'un mineur, nous les supprimerons immédiatement. Si vous êtes un parent ou tuteur et pensez que nous avons collecté des données d'un mineur, veuillez nous contacter immédiatement.</p>
                    </Section>

                    <Section id="13" title="13. CONTACTS ET RÉCLAMATIONS" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p><strong>Pour nous contacter:</strong></p>
                        <p style={{marginTop: '8px'}}>
                            Email: michel.payet974@live.fr<br />
                            Adresse: 6 rue de la liberté<br />
                            Téléphone: 06 92 12 34 56
                        </p>
                        <p style={{marginTop: '12px'}}><strong>Autorité de contrôle:</strong></p>
                        <p style={{marginTop: '8px'}}>
                            Vous avez le droit de déposer une réclamation auprès de l'autorité de contrôle compétente:<br />
                            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL (Commission Nationale de l'Informatique et des Libertés)</a> pour la France
                        </p>
                    </Section>

                    <Section id="14" title="14. MODIFICATIONS DE CETTE POLITIQUE" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Les modifications seront publiées sur cette page avec une date de mise à jour modifiée.</p>
                        <p style={{marginTop: '12px'}}>L'utilisation continue de notre service après les modifications signifie que vous acceptez la politique mise à jour. Nous vous recommandons de consulter régulièrement cette page.</p>
                    </Section>

                    <div className="footer">
                        <p>© 2025 Good Pics. Tous droits réservés.</p>
                        <p>Politique mise à jour le 01/12/2025</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Policy_Privacy;