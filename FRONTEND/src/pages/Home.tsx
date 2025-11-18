



import './Home.css';

function HomePage() {
  return (<>
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
  </>);
}

export default HomePage;
