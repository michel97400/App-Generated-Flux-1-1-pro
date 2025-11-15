

import "./Home.css";

function HomePage() {
  return (
    <>
      <div className="home-intro">
        <h1>Bienvenue sur Good Pics Image Generator</h1>
        <p>
          Découvrez la puissance de l'IA pour générer des images uniques et créatives en un clic. Inscrivez-vous pour commencer à créer votre propre galerie !<br />
          <br />
          Vous pouvez générer des images à partir de thèmes spécifiques&nbsp;: <b>Style: Simpsons</b> <b>, manga</b> <b>, paysages futuristes</b>, <b>animaux fantastiques</b>...<br />
          Laissez libre cours à votre imagination et explorez une multitude de styles et d'univers !
        </p>
        <a href="/register" className="signup-btn">S'inscrire</a>
      </div>

      <div className="features-section">
        <h2>Pourquoi choisir Good Pics ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="card-icon">🚀</div>
            <h3>Génération Instantanée</h3>
            <p className="txt-card">Créez des images en quelques secondes grâce à notre IA avancée.<br /> <strong >Vous pouvez générer jusqu'à 3 images gratuites par jour !</strong></p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🎨</div>
            <h3>Styles Infinis</h3>
            <p className="txt-card">Du réalisme photo au fantastique, explorez des milliers de styles : manga, futuriste, vintage, et bien plus.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🖼️</div>
            <h3>Qualité Professionnelle</h3>
            <p className="txt-card">Images haute résolution prêtes à être utilisées dans vos projets personnels ou professionnels.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🌟</div>
            <h3>Créativité Sans Limites</h3>
            <p className="txt-card">Laissez votre imagination s'exprimer. De l'art abstrait aux scènes surréalistes, tout est possible.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">⚙️</div>
            <h3>Personnalisation Avancée</h3>
            <p>Ajustez les paramètres pour affiner vos images : résolution, style, détails, et plus encore.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">👥</div>
            <h3>Communauté Créative</h3>
            <p className="txt-card">Partagez vos créations, inspirez-vous des autres utilisateurs et rejoignez une communauté d'artistes IA.</p>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <h2>Comment ça marche ?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Inscrivez-vous</h3>
            <p>Créez votre compte gratuitement et accédez à toutes nos fonctionnalités.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Décrivez votre idée</h3>
            <p>Saisissez une description détaillée de l'image que vous souhaitez générer.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Générez et sauvegardez</h3>
            <p>Obtenez votre image en un instant et ajoutez-la à votre galerie personnelle.</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Prêt à créer votre première image ?</h2>
        <p>Rejoignez des milliers d'utilisateurs qui donnent vie à leurs idées avec Good Pics.</p>
        <a href="/register" className="cta-btn">Commencer maintenant</a>
      </div>
    </>
  );
}

export default HomePage;
