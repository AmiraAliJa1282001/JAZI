import menuHeroImage from "../../assets/images/menu-hero.png";
import "./MenuHero.css";

function MenuHero() {
  return (
    <section
      className="menu-hero"
      style={{ backgroundImage: `url(${menuHeroImage})` }}
    >
      <div className="menu-hero-overlay"></div>

      <div className="menu-hero-container">
        <div className="menu-hero-content">
          <span className="menu-hero-eyebrow">
            JAZI LOBSTER CAFETERIA
          </span>

          <h1>MENU</h1>

          <div className="menu-hero-decoration">
            <span></span>
            <i></i>
            <span></span>
          </div>

          <p>All prices in AED · VAT inclusive</p>
        </div>
      </div>
    </section>
  );
}

export default MenuHero;