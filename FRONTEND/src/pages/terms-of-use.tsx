

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

function UseConditions() {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <>
            <div className="container-conditions">
                <div className="header-terms">
                    <div className="header-content">
                        <h1>Conditions Générales d'Utilisation</h1>
                        <p>Dernière mise à jour: 01/12/2025</p>
                    </div>
                </div>

                <div className="content">
                    <Section id="1" title="1. IDENTIFICATION DU PRESTATAIRE" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p><strong>Nom du site:</strong> Good Pics</p>
                        <p><strong>Exploitant:</strong> Payet Michel</p>
                        <p><strong>Adresse:</strong> 6 rue de la liberté</p>
                        <p><strong>Email de contact:</strong> michel.payet974@live.fr</p>
                        <p><strong>Téléphone:</strong> 06 92 12 34 56</p>
                        <p><strong>SIRET/SIREN:</strong> ?</p>
                    </Section>

                    <Section id="2" title="2. OBJET DU SITE" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Ce site propose une plateforme permettant aux utilisateurs de:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Créer un compte personnel</li>
                            <li>Accéder à un service de génération d'images utilisant l'intelligence artificielle</li>
                            <li>Utiliser un chatbot intégré pour des conversations assistées par IA</li>
                            <li>Gérer leurs contenus et préférences</li>
                        </ul>
                    </Section>

                    <Section id="3" title="3. CONDITIONS D'ACCÈS ET D'INSCRIPTION" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Pour accéder aux services, l'utilisateur doit:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Être âgé de 18 ans minimum (ou avoir l'âge légal requis dans votre juridiction)</li>
                            <li>Créer un compte avec des informations véridiques et exactes</li>
                            <li>Accepter les présentes conditions</li>
                            <li>Accepter la politique de confidentialité</li>
                        </ul>
                        <p style={{marginTop: '12px'}}>L'utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toute activité effectuée sous son compte.</p>
                    </Section>

                    <Section id="4" title="4. UTILISATION DU SERVICE DE GÉNÉRATION D'IMAGES" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p><strong>Droit d'utilisation:</strong> Les images générées par l'IA appartiennent à l'utilisateur qui les a générées, dans les limites prévues par la loi.</p>
                        <p style={{marginTop: '12px'}}><strong>Restrictions:</strong> L'utilisateur s'engage à ne pas utiliser le service pour générer:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Du contenu illégal, violent ou pornographique</li>
                            <li>Du contenu contrefait ou violant les droits d'auteur</li>
                            <li>Du contenu incitant à la discrimination ou à la haine</li>
                            <li>Des images usurpant l'identité de tiers</li>
                            <li>Du contenu tromeur ou frauduleux</li>
                        </ul>
                        <p style={{marginTop: '12px'}}><strong>Limites de responsabilité:</strong> [À COMPLÉTER - Nombre de générations par jour, crédits utilisés, etc.]</p>
                    </Section>

                    <Section id="5" title="5. UTILISATION DU CHATBOT IA" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p><strong>Objectif:</strong> Le chatbot est conçu pour assister l'utilisateur via conversation textuelle alimentée par l'intelligence artificielle.</p>
                        <p style={{marginTop: '12px'}}><strong>Limites:</strong> L'utilisateur reconnaît que:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Le chatbot peut commettre des erreurs ou donner des réponses inexactes</li>
                            <li>Les réponses ne remplacent pas les conseils professionnels (juridique, médical, etc.)</li>
                            <li>L'utilisateur est responsable de l'utilisation qu'il fait des informations fournies</li>
                        </ul>
                        <p style={{marginTop: '12px'}}><strong>Restrictions:</strong> L'utilisateur ne doit pas utiliser le chatbot pour:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Générer du contenu illégal ou nuisible</li>
                            <li>Harceler ou menacer d'autres personnes</li>
                            <li>Contourner les politiques de sécurité</li>
                            <li>Effectuer du spam ou de l'hameçonnage</li>
                        </ul>
                    </Section>

                    <Section id="6" title="6. DONNÉES PERSONNELLES ET CONFIDENTIALITÉ" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Le traitement des données personnelles est régi par notre Politique de Confidentialité, accessible à [À COMPLÉTER - lien].</p>
                        <p style={{marginTop: '12px'}}>Nous collectons notamment:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Informations d'inscription (email, profil)</li>
                            <li>Historique des générations d'images et conversations</li>
                        </ul>
                        <p style={{marginTop: '12px'}}>Conformément au RGPD, l'utilisateur dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données.</p>
                    </Section>

                    <Section id="7" title="7. PROPRIÉTÉ INTELLECTUELLE" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p><strong>Contenu du site:</strong> Tous les éléments du site (logo, design, textes, code source) sont la propriété exclusive du prestataire et protégés par le droit d'auteur.</p>
                        <p style={{marginTop: '12px'}}><strong>Contenus générés:</strong> [À COMPLÉTER] - Les images et contenus générés par l'IA restent la propriété de [l'utilisateur / le prestataire / à définir].</p>
                        <p style={{marginTop: '12px'}}><strong>Interdictions:</strong> L'utilisateur ne peut pas reproduire, modifier, distribuer ou exploiter commercialement le contenu du site sans autorisation écrite préalable.</p>
                    </Section>

                    <Section id="8" title="8. RESPONSABILITÉ ET LIMITATIONS" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Le prestataire s'efforce de maintenir le service en bon fonctionnement. Cependant:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Le service est fourni "tel quel" sans garantie de disponibilité continue</li>
                            <li>Le prestataire ne peut pas être tenu responsable des interruptions de service</li>
                            <li>Les résultats de l'IA ne sont pas garantis et peuvent contenir des erreurs</li>
                            <li>L'utilisateur utilise le service à ses propres risques</li>
                        </ul>
                        <p style={{marginTop: '12px'}}>Le prestataire n'est pas responsable des dommages directs ou indirects découlant de l'utilisation du service.</p>
                    </Section>

                    <Section id="9" title="9. COMPORTEMENT PROHIBÉ" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>L'utilisateur s'engage à ne pas:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Utiliser le service de manière abusive ou frauduleuse</li>
                            <li>Attaquer, pirater ou surcharger les serveurs</li>
                            <li>Usurper l'identité d'autrui</li>
                            <li>Violer les droits de propriété intellectuelle</li>
                            <li>Harceler ou menacer d'autres utilisateurs</li>
                            <li>Contourner les restrictions de sécurité</li>
                            <li>Utiliser des bots ou scripts non autorisés</li>
                        </ul>
                    </Section>

                    <Section id="10" title="10. SUSPENSION ET RÉSILIATION" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Le prestataire se réserve le droit de:</p>
                        <ul style={{marginTop: '8px'}}>
                            <li>Suspendre ou fermer un compte en cas de violation des CGU</li>
                            <li>Bloquer l'accès au service sans préavis en cas d'usage abusif</li>
                            <li>Supprimer les contenus violant ces conditions</li>
                        </ul>
                        <p style={{marginTop: '12px'}}>L'utilisateur peut résilier son compte à tout moment en contactant [À COMPLÉTER].</p>
                    </Section>

                    <Section id="11" title="11. MODIFICATION DES CONDITIONS" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Le prestataire peut modifier ces conditions générales à tout moment. Les modifications seront notifiées aux utilisateurs via [email / notification sur le site].</p>
                        <p style={{marginTop: '12px'}}>L'utilisation continue du service après la publication des modifications signifie l'acceptation des nouvelles conditions.</p>
                    </Section>

                    <Section id="12" title="12. DROIT APPLICABLE ET JURIDICTION" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p><strong>Droit applicable:</strong> Ces conditions sont régies par la loi [française / de votre juridiction].</p>
                        <p style={{marginTop: '12px'}}><strong>Tribunal compétent:</strong> En cas de litige, les tribunaux [À COMPLÉTER - exemple: de Paris] seront seuls compétents.</p>
                    </Section>

                    <Section id="13" title="13. CONTACT" expandedSections={expandedSections} onToggle={toggleSection}>
                        <p>Pour toute question ou réclamation concernant ces conditions:</p>
                        <p style={{marginTop: '12px'}}>
                            Email: [À COMPLÉTER]<br />
                            Adresse: [À COMPLÉTER]<br />
                            Téléphone: [À COMPLÉTER]
                        </p>
                    </Section>

                    <div className="footer">
                        <p>© 2024 [À COMPLÉTER]. Tous droits réservés.</p>
                        <p>Conditions mises à jour le [DATE]</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UseConditions;