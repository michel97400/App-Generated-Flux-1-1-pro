

import React, { useRef, useEffect } from "react";
import "./Home.css";

const mockImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
];

function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

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
      <div className="image-row-scroll" ref={scrollRef}>
        {mockImages.map((img, idx) => (
          <div className="image-card" key={idx}>
            <img src={img} alt={`Générée ${idx + 1}`} />
          </div>
        ))}
      </div>
    </>
  );
}

export default HomePage;
