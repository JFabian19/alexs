import { useMemo, useState } from "react";
import {
  ChevronRight,
  Clock3,
  Fish,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Waves,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { DEFAULT_MENU_DATA, Dish, PriceOption } from "./data/menuData";

const RESTAURANT = "Alexs";
const WHATSAPP_NUMBER = "51922609958";
const PHONE_PRIMARY = "922 609 958";
const PHONE_SECONDARY = "940 594 920";
const ADDRESS = "Calle Las Lilas N.° 107-105, Urb. La Alborada, Comas";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const MARQUEE_ITEMS = [
  "Pesca del día",
  "Sabor norteño",
  "Piura · Catacaos",
  "Fuentes para compartir",
  "Pedidos por WhatsApp",
  "Ceviches al momento",
];

interface CartItem {
  key: string;
  nombre: string;
  presentacion: string;
  price: number;
  cantidad: number;
}

function InfiniteMarquee() {
  const group = (
    <div className="marquee-group" aria-hidden="true">
      {MARQUEE_ITEMS.map((item) => (
        <span className="marquee-item" key={item}>
          <span>{item}</span>
          <Fish size={15} strokeWidth={2.4} />
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee-shell" aria-label="Especialidades de Alexs">
      <div className="marquee-track">
        {group}
        {group}
      </div>
    </div>
  );
}

function formatPrice(price: number) {
  return `S/ ${price}`;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState(DEFAULT_MENU_DATA[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.cantidad, 0),
    [cart],
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.cantidad, 0),
    [cart],
  );

  const addToCart = (dish: Dish, option: PriceOption) => {
    const key = `${dish.nombre}-${option.label}-${option.price}`;
    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      }

      return [
        ...current,
        {
          key,
          nombre: dish.nombre,
          presentacion: option.label,
          price: option.price,
          cantidad: 1,
        },
      ];
    });
  };

  const changeQuantity = (key: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.key === key ? { ...item, cantidad: item.cantidad + delta } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    document.getElementById(`category-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendOrder = () => {
    if (!cart.length) return;

    const detail = cart
      .map(
        (item) =>
          `• ${item.cantidad} x ${item.nombre} — ${item.presentacion} (${formatPrice(item.price)})`,
      )
      .join("\n");
    const message = [
      `Hola ${RESTAURANT}, deseo realizar este pedido:`,
      "",
      detail,
      "",
      `Total referencial: S/ ${total.toFixed(2)}`,
      "",
      "¿Me confirman disponibilidad y tiempo de atención?",
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a href="#inicio" className="brand-lockup" aria-label="Alexs, volver al inicio">
          <img src="/logo-alexs.png" alt="Logo de Alexs" />
          <span>
            <strong>Alexs</strong>
            <small>Piura · Catacaos</small>
          </span>
        </a>

        <nav className="header-actions" aria-label="Acciones rápidas">
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="icon-link" aria-label="Ver ubicación">
            <MapPin size={19} />
          </a>
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Ver pedido, ${cartCount} productos`}>
            <ShoppingBag size={19} />
            <span className="cart-label">Mi pedido</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-sun" />
          <div className="hero-wave hero-wave-one" />
          <div className="hero-wave hero-wave-two" />

          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={16} /> Cocina marina y norteña</div>
            <h1>El norte sabe<br /><em>mejor junto al mar.</em></h1>
            <p>
              Ceviches al momento, fuentes abundantes y recetas con el sabor de
              Piura y Catacaos.
            </p>
            <div className="hero-actions">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="primary-cta">
                Pedir por WhatsApp <ChevronRight size={18} />
              </a>
              <button className="secondary-cta" onClick={() => scrollToCategory("ceviches")}>
                Ver la carta
              </button>
            </div>
            <div className="quick-facts">
              <span><Clock3 size={16} /> Preparado al momento</span>
              <span><Waves size={16} /> Pesca del día</span>
            </div>
          </div>

          <div className="hero-mark" aria-hidden="true">
            <div className="logo-orbit logo-orbit-one" />
            <div className="logo-orbit logo-orbit-two" />
            <img src="/logo-alexs.png" alt="" />
            <div className="hero-stamp">
              <strong>63</strong>
              <span>opciones</span>
            </div>
          </div>
        </section>

        <InfiniteMarquee />

        <section className="menu-intro" id="carta">
          <div>
            <span className="section-kicker">Nuestra carta</span>
            <h2>Elige tu antojo</h2>
          </div>
          <p>Selecciona la presentación y agrégala a tu pedido. Los precios están expresados en soles.</p>
        </section>

        <div className="category-nav-wrap">
          <nav className="category-nav" aria-label="Categorías del menú">
            {DEFAULT_MENU_DATA.map((category) => (
              <button
                key={category.id}
                className={activeCategory === category.id ? "active" : ""}
                onClick={() => scrollToCategory(category.id)}
              >
                {category.nombre}
              </button>
            ))}
          </nav>
        </div>

        <div className="menu-sections">
          {DEFAULT_MENU_DATA.map((category, categoryIndex) => (
            <section
              className="menu-section"
              id={`category-${category.id}`}
              key={category.id}
            >
              <div className="section-heading">
                <span>{String(categoryIndex + 1).padStart(2, "0")}</span>
                <div>
                  <p>{category.eyebrow}</p>
                  <h3>{category.nombre}</h3>
                </div>
                <Fish className="section-fish" size={28} />
              </div>

              <div className={`dish-grid ${category.id === "porciones" || category.id === "bebidas" ? "compact-grid" : ""}`}>
                {category.items.map((dish) => (
                  <article className={`dish-card ${dish.destacado ? "featured" : ""}`} key={dish.nombre}>
                    <div className="dish-topline">
                      <div>
                        {dish.destacado && <span className="popular-tag">Recomendado</span>}
                        <h4>{dish.nombre}</h4>
                        {dish.descripcion && <p>{dish.descripcion}</p>}
                      </div>
                    </div>

                    <div className="price-options">
                      {dish.prices.map((option) => (
                        <button
                          key={`${dish.nombre}-${option.label}`}
                          onClick={() => addToCart(dish, option)}
                          aria-label={`Agregar ${dish.nombre}, ${option.label}, ${formatPrice(option.price)}`}
                        >
                          <span>{option.label}</span>
                          <strong>{formatPrice(option.price)}</strong>
                          <i><Plus size={15} strokeWidth={3} /></i>
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="visit-section">
          <div className="visit-copy">
            <span className="section-kicker light">Ven a disfrutar</span>
            <h2>De Catacaos<br />a tu mesa.</h2>
            <p>{ADDRESS}</p>
            <p className="address-note">Esquina con Av. Sinchi Roca · Alt. Hospital de Collique, 3 1/2 cuadras abajo.</p>
            <div className="visit-actions">
              <a href={MAPS_URL} target="_blank" rel="noreferrer"><MapPin size={18} /> Cómo llegar</a>
              <a href="tel:+51922609958"><Phone size={18} /> {PHONE_PRIMARY}</a>
            </div>
          </div>
          <div className="visit-art" aria-hidden="true">
            <div className="visit-sun" />
            <Waves size={170} strokeWidth={1} />
            <img src="/logo-alexs.png" alt="" />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <img src="/logo-alexs.png" alt="Logo Alexs" />
          <div>
            <strong>Alexs</strong>
            <span>Piura · Catacaos</span>
          </div>
        </div>
        <div className="footer-contact">
          <span>Pedidos y recepciones</span>
          <a href="tel:+51922609958">{PHONE_PRIMARY}</a>
          <a href="tel:+51940594920">{PHONE_SECONDARY}</a>
        </div>
        <p>© 2026 Alexs. Cocina marina y norteña.</p>
      </footer>

      <AnimatePresence>
        {cartCount > 0 && !cartOpen && (
          <motion.button
            className="floating-cart"
            onClick={() => setCartOpen(true)}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
          >
            <span><ShoppingBag size={20} /> {cartCount} {cartCount === 1 ? "producto" : "productos"}</span>
            <strong>S/ {total.toFixed(2)} <ChevronRight size={18} /></strong>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div className="cart-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setCartOpen(false)}>
            <motion.aside
              className="cart-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              onMouseDown={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
            >
              <div className="cart-panel-header">
                <div>
                  <span>Tu selección</span>
                  <h2 id="cart-title">Mi pedido</h2>
                </div>
                <button onClick={() => setCartOpen(false)} aria-label="Cerrar pedido"><X size={21} /></button>
              </div>

              <div className="cart-items">
                {!cart.length && (
                  <div className="empty-cart">
                    <ShoppingBag size={38} />
                    <h3>Tu pedido está vacío</h3>
                    <p>Agrega una presentación de la carta para comenzar.</p>
                  </div>
                )}

                {cart.map((item) => (
                  <div className="cart-item" key={item.key}>
                    <div className="cart-item-copy">
                      <h3>{item.nombre}</h3>
                      <p>{item.presentacion} · {formatPrice(item.price)}</p>
                    </div>
                    <div className="quantity-control">
                      <button onClick={() => changeQuantity(item.key, -1)} aria-label={`Quitar una unidad de ${item.nombre}`}><Minus size={15} /></button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => changeQuantity(item.key, 1)} aria-label={`Agregar una unidad de ${item.nombre}`}><Plus size={15} /></button>
                    </div>
                    <button className="remove-item" onClick={() => changeQuantity(item.key, -item.cantidad)} aria-label={`Eliminar ${item.nombre}`}><Trash2 size={17} /></button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div><span>Total referencial</span><strong>S/ {total.toFixed(2)}</strong></div>
                <p>La disponibilidad y el tiempo de atención se confirman por WhatsApp.</p>
                <button onClick={sendOrder} disabled={!cart.length}>
                  Enviar pedido por WhatsApp <ChevronRight size={19} />
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
