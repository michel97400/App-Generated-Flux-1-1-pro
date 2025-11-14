import React, { useEffect, useState } from "react";
import './LoaderCompteJeu.css';

const messages = [
  "Dressage des licornes…",
  "Vérification du stock de cookies…",
  "Réveil du hamster serveur…",
  "Polissage des arcs-en-ciel…",
  "Recherche du bouton magique…",
  "Optimisation du swag…",
  "Câlin aux octets…",
];

const backgrounds = [
  'linear-gradient(90deg, #e91e63 0%, #ff9747ff 100%)',
  'linear-gradient(90deg, #1d7eceff 0%, #1ca0bdff 100%)',
  'linear-gradient(90deg, #69933aff 0%, #9ba72bff 100%)',
  'linear-gradient(90deg, #a36404ff 0%, #ce9c06ff 100%)',
  'linear-gradient(90deg, #9c27b0 0%, #e040fb 100%)',
  'linear-gradient(90deg, #00bcd4 0%, #4dd0e1 100%)',

];

const LoaderCompteJeu: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < messages.length - 1) {
      const baseDelay = 1400;
      const delay = Math.max(500, baseDelay - index * 120);
      const timer = setTimeout(() => setIndex(index + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [index]);

  const bgStyle = {
    background: backgrounds[index % backgrounds.length]
  };

  return (
    <div className="loader-jeu-card">
      <div className="loader-jeu-content">
        <div className="loader-jeu-spinner">
          <span aria-label="chargement">Chargement du profil</span>
            <span className="loader-jeu-patience">Veuillez patienter...</span>
        </div>
        <div className="loader-jeu-message" style={bgStyle}>
          {messages[index]}
        </div>
          <div className="loader-jeu-circle-spinner"></div>
      </div>
    </div>
  );
};

export default LoaderCompteJeu;
