import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, ChevronRight, X, Trash2, Utensils, Phone, Loader2, Gift, Star, Waves, MapPin, Fish } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSheetData, submitSheetData, SheetDish, SheetCategory, SHEET_ID } from './services/googleSheets';
import { DEFAULT_MENU_DATA } from './data/menuData';

// ==========================================
// 📋 CONFIGURACIÓN DE ALEX'S - COCINA MARINA Y NORTEÑA
// ==========================================
const RESTAURANTE_NAME = "Alexs";
const RESTAURANTE_SLOGAN = "Cocina Marina & Norteña · Piura / Catacaos";
const WHATSAPP_NUMBER = "51922609958";
const PHONE_PRIMARY = "922 609 958";
const PHONE_SECONDARY = "940 594 920";
const ADDRESS = "Calle Las Lilas N.° 107-105, Urb. La Alborada, Comas (Esq. con Av. Sinchi Roca)";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Calle Las Lilas 107 Comas")}`;
const LOGO_PATH = "/logo-alexs.png";
const MARQUEE_TEXT = "🐟 ¡BIENVENIDOS A ALEXS! • CEVICHES AL MOMENTO, SUDADOS Y PLATOS NORTEÑOS • PEDIDOS AL 922 609 958 / 940 594 920 • ";
// ==========================================

interface PriceOption {
  label: string;
  price: number;
}

interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  prices: PriceOption[];
  destacado?: boolean;
}

interface Category {
  id: string;
  nombre: string;
  eyebrow?: string;
  items: Dish[];
}

interface CartItem {
  key: string;
  nombre: string;
  presentacion: string;
  precio: number;
  cantidad: number;
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // States for Birthday Form
  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [isSubmittingBirthday, setIsSubmittingBirthday] = useState(false);
  const [birthdaySuccess, setBirthdaySuccess] = useState(false);
  const [birthdayData, setBirthdayData] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: '',
    distrito: '',
    correo: ''
  });

  // States for Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewData, setReviewData] = useState({
    estrellasMozo: 0,
    estrellasComida: 0,
    comentario: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!SHEET_ID) {
          setCategories(DEFAULT_MENU_DATA);
          if (DEFAULT_MENU_DATA.length > 0) {
            setActiveCategory(DEFAULT_MENU_DATA[0].id);
          }
          return;
        }

        const [cats, dishes] = await Promise.all([
          fetchSheetData<SheetCategory>('Categorías'),
          fetchSheetData<SheetDish>('Platos')
        ]);

        if (cats.length === 0 && dishes.length === 0) {
          setCategories(DEFAULT_MENU_DATA);
          if (DEFAULT_MENU_DATA.length > 0) {
            setActiveCategory(DEFAULT_MENU_DATA[0].id);
          }
          return;
        }

        const formattedCategories: Category[] = cats.map(c => ({
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'),
          nombre: c.nombre,
          items: dishes
            .filter(d => d.categoría === c.nombre)
            .map(d => {
              const numPrice = parseFloat(d.precio.replace(/[^0-9.]/g, '')) || 0;
              return {
                nombre: d['nombre del plato'],
                descripcion: d.descripción,
                prices: [{ label: 'Porción', price: numPrice }],
                imagen: d['URL de imagen'] || undefined
              };
            })
        }));

        setCategories(formattedCategories);
        if (formattedCategories.length > 0) {
          setActiveCategory(formattedCategories[0].id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setCategories(DEFAULT_MENU_DATA);
        if (DEFAULT_MENU_DATA.length > 0) {
          setActiveCategory(DEFAULT_MENU_DATA[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.cantidad, 0), [cart]);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0), [cart]);

  const addToCart = (dish: Dish, option: PriceOption) => {
    const key = `${dish.nombre}-${option.label}-${option.price}`;
    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i =>
          i.key === key ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [
        ...prev,
        {
          key,
          nombre: dish.nombre,
          presentacion: option.label,
          precio: option.price,
          cantidad: 1
        }
      ];
    });
  };

  const updateQuantity = (key: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.key === key) {
            const newQty = i.cantidad + delta;
            return newQty > 0 ? { ...i, cantidad: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const sendToWhatsApp = () => {
    if (!cart.length) return;
    let message = `*Hola ${RESTAURANTE_NAME}, deseo realizar este pedido:*\n\n`;
    cart.forEach(item => {
      message += `• ${item.cantidad} x ${item.nombre} — ${item.presentacion} (S/. ${item.precio.toFixed(2)})\n`;
    });
    message += `\n*TOTAL ESTIMADO: S/. ${total.toFixed(2)}*\n\n¿Me confirman disponibilidad y tiempo de entrega / atención?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBirthdaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBirthday(true);
    const success = await submitSheetData('Cumpleaños', {
      timestamp: new Date().toLocaleString('es-PE'),
      nombre: birthdayData.nombre,
      telefono: birthdayData.telefono,
      fechaNacimiento: birthdayData.fechaNacimiento,
      distrito: birthdayData.distrito,
      correo: birthdayData.correo || 'No indicado'
    });
    
    setIsSubmittingBirthday(false);
    if (success) {
      setBirthdaySuccess(true);
      setTimeout(() => {
        setShowBirthdayForm(false);
        setBirthdaySuccess(false);
        setBirthdayData({ nombre: '', telefono: '', fechaNacimiento: '', distrito: '', correo: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tus datos. Por favor, inténtalo de nuevo.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewData.estrellasMozo === 0 || reviewData.estrellasComida === 0) {
      alert("Por favor califica ambas opciones con estrellas.");
      return;
    }

    setIsSubmittingReview(true);
    const success = await submitSheetData('Reseñas', {
      timestamp: new Date().toLocaleString('es-PE'),
      estrellasMozo: reviewData.estrellasMozo,
      estrellasComida: reviewData.estrellasComida,
      comentario: reviewData.comentario || 'Sin comentarios'
    });
    
    setIsSubmittingReview(false);
    if (success) {
      setReviewSuccess(true);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccess(false);
        setReviewData({ estrellasMozo: 0, estrellasComida: 0, comentario: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tu reseña. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-slogan text-primary font-bold tracking-widest uppercase text-xs">Cargando el mejor sabor de Alexs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-50 px-4 py-3 flex justify-between items-center border-b border-primary/10 shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src={LOGO_PATH} 
            alt="Alexs" 
            className="w-11 h-11 object-contain rounded-full shadow-sm border border-primary/20 bg-white p-0.5" 
          />
          <div className="flex flex-col items-start">
            <h1 className="font-title text-[22px] font-bold text-primary leading-none tracking-tight">{RESTAURANTE_NAME}</h1>
            <span className="font-slogan text-[10px] text-accent font-bold tracking-wider mt-0.5">Piura · Catacaos</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            title="Ver Ubicación"
            className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 cursor-pointer transition-colors"
          >
            <MapPin size={19} />
          </motion.a>
          <motion.a
            href={`tel:${PHONE_PRIMARY.replace(/\s+/g, '')}`}
            whileTap={{ scale: 0.95 }}
            title="Llamar"
            className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 cursor-pointer transition-colors"
          >
            <Phone size={19} />
          </motion.a>
          <motion.button
            onClick={() => cartCount > 0 && setShowSummary(true)}
            whileTap={{ scale: 0.95 }}
            aria-label="Ver carrito"
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center relative cursor-pointer shadow-md shadow-primary/30"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-accent text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1 shadow">
                {cartCount}
              </span>
            )}
          </motion.button>
        </div>
      </header>

      {/* Marquee Ticker */}
      <div className="w-full bg-primary py-2 overflow-hidden flex items-center shadow-inner">
        <div className="animate-marquee flex gap-6 text-white font-slogan font-bold text-[11px] tracking-widest uppercase whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span key={i}>{MARQUEE_TEXT}</span>
          ))}
        </div>
      </div>

      {/* Birthday CTA Banner */}
      <div className="px-4 pt-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: ["0px 0px 0px 0px rgba(3,75,134,0.4)", "0px 0px 18px 6px rgba(3,75,134,0)", "0px 0px 0px 0px rgba(3,75,134,0)"] 
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => setShowBirthdayForm(true)}
          className="w-full bg-gradient-to-r from-primary via-[#0088cc] to-primary text-white py-3 px-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-[11px] uppercase tracking-wide border border-white/20 relative overflow-hidden group text-center shadow-md cursor-pointer"
        >
          <div className="absolute inset-0 shimmer opacity-25 mix-blend-overlay"></div>
          <Gift size={18} className="animate-bounce shrink-0 text-yellow-300" />
          <span>¡Celebra tu cumpleaños con nosotros! 🐟 <span className="text-yellow-300 font-black underline">Regístrate aquí</span> y recibe una cortesía especial en Alexs. 🎁</span>
        </motion.button>
      </div>

      {/* Hero Branding Card with Logo */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative w-full rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-[#02315b] via-[#034b86] to-[#0088cc] flex flex-col items-center justify-center text-center p-5 border border-primary/20">
          <div className="absolute top-2 right-3 opacity-15 text-white pointer-events-none">
            <Waves size={100} />
          </div>
          <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-xl flex items-center justify-center mb-2 border-2 border-white/90">
            <img src={LOGO_PATH} alt="Logo Alexs" className="w-full h-full object-contain rounded-full" />
          </div>
          <h2 className="font-title text-2xl font-bold text-white tracking-wide drop-shadow-sm">{RESTAURANTE_NAME}</h2>
          <p className="text-blue-100 text-xs font-medium tracking-wider">{RESTAURANTE_SLOGAN}</p>
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-[11px] font-semibold border border-white/20"
          >
            <span>📞 Pedidos: {PHONE_PRIMARY} · {PHONE_SECONDARY}</span>
          </a>
        </div>
      </div>

      {/* Categories Sticky Bar */}
      <div className="px-4 py-3 sticky top-[65px] bg-white/95 backdrop-blur-md z-40 border-b border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-[11px] font-category font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer
                ${activeCategory === cat.id
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                  : 'bg-gray-50 text-dark border-gray-200 hover:border-primary/40 hover:text-primary'
                }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dishes List */}
      <main className="flex-1 overflow-y-auto pb-32 px-4">
        {categories.map(cat => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-8 pt-4 scroll-mt-28">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Utensils className="text-primary wave-icon" size={20} />
                <h3 className="font-category font-bold text-primary text-[24px] leading-none tracking-wide category-underline">
                  {cat.nombre}
                </h3>
              </div>
              {cat.eyebrow && <p className="text-[11px] text-gray-500 font-medium ml-7">{cat.eyebrow}</p>}
            </div>

            {/* Grid 2 Columnas de Platos idéntico al diseño */}
            <div className="grid grid-cols-2 gap-3">
              {cat.items.map((dish, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                >
                  {/* Espacio para imagen del plato */}
                  <div className="bg-primary/5 aspect-square flex items-center justify-center relative overflow-hidden p-3 border-b border-gray-100 group">
                    {dish.imagen ? (
                      <img src={dish.imagen} alt={dish.nombre} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <Fish size={24} className="text-primary/40 mb-1" />
                        <span className="font-dish font-bold text-[10px] text-primary/70 uppercase tracking-wider text-center">
                          ACA VA A IMAGEN
                        </span>
                      </div>
                    )}
                    {dish.destacado && (
                      <span className="absolute top-2 right-2 bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        ⭐ Top
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3 flex flex-col flex-1">
                    <h4 className="font-dish font-bold text-dark text-[13px] leading-snug mb-1">
                      {dish.nombre}
                    </h4>
                    {dish.descripcion && (
                      <p className="text-[10px] text-gray-500 leading-tight mb-2 line-clamp-2">
                        {dish.descripcion}
                      </p>
                    )}
                    
                    <div className="flex-1"></div>

                    {/* Manejo de precios (1 precio o selector de Chica/Mediana/Familiar) */}
                    {dish.prices.length === 1 ? (
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                        <span className="font-dish font-bold text-primary text-[15px] whitespace-nowrap">
                          S/. {dish.prices[0].price.toFixed(2)}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => addToCart(dish, dish.prices[0])}
                          className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-200 shrink-0 cursor-pointer"
                        >
                          <Plus size={16} strokeWidth={2.8} />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 mt-2 pt-1.5 border-t border-gray-100">
                        {dish.prices.map((opt) => (
                          <div key={opt.label} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded-lg">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-gray-600">{opt.label}:</span>
                              <span className="text-[11px] font-bold text-primary">S/. {opt.price}</span>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => addToCart(dish, opt)}
                              aria-label={`Agregar ${dish.nombre} ${opt.label}`}
                              className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-200 shrink-0 cursor-pointer"
                            >
                              <Plus size={13} strokeWidth={3} />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {/* Review Banner */}
        <section className="mt-8 mb-4 border border-primary/15 bg-primary/5 rounded-3xl p-5 text-center shadow-sm">
          <h3 className="font-title text-primary font-bold text-[22px] leading-tight mb-2">¿Cómo estuvo tu experiencia?</h3>
          <p className="text-[11px] text-gray-600 mb-4 px-2">Tu opinión nos ayuda a mantener viva la auténtica sazón norteña y el mejor servicio en Alexs.</p>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReviewForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 mx-auto w-full hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Star size={18} className="fill-yellow-400 text-yellow-400" />
            Calificar Restaurante
          </motion.button>
        </section>

        {/* Footer & Contacts */}
        <footer className="mt-8 pt-8 pb-8 border-t border-gray-200 flex flex-col items-center justify-center text-center">
          <img src={LOGO_PATH} alt="Logo Alexs" className="w-24 h-24 object-contain rounded-full shadow-md border border-primary/20 mb-3 bg-white p-1" />
          <p className="font-title text-2xl font-bold text-primary mb-1">{RESTAURANTE_NAME}</p>
          <p className="text-xs text-secondary font-semibold mb-4">{RESTAURANTE_SLOGAN}</p>
          
          <div className="flex flex-col gap-1.5 text-xs text-dark font-medium mb-4 bg-gray-50 px-5 py-3.5 rounded-2xl border border-gray-100 w-full max-w-xs text-left">
            <p className="font-bold text-primary uppercase text-[10px] tracking-wider mb-1 text-center">Contacto y Pedidos</p>
            <p>📱 <strong>WhatsApp:</strong> <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="font-bold text-primary hover:underline">{PHONE_PRIMARY}</a></p>
            <p>📞 <strong>Teléfono 2:</strong> <span className="font-bold text-dark">{PHONE_SECONDARY}</span></p>
            <p>📍 <strong>Dirección:</strong> <a href={MAPS_URL} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-primary">{ADDRESS}</a></p>
          </div>

          <p className="text-[11px] text-gray-400 font-medium">© 2026 Alexs. Tradición Marina & Norteña.</p>
        </footer>

        {/* Tyma Solutions Credit */}
        <div className="bg-dark py-5 flex flex-col items-center justify-center -mx-4">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1 opacity-50 text-white/50">Digital Menu Experience</p>
          <a 
            href="https://tymasolutions.lat/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-bold text-sm tracking-tight text-white/90 hover:text-white transition-colors"
          >
            Powered by <span className="text-accent font-black">TYMA</span> Solutions
          </a>
        </div>
      </main>

      {/* Floating Bottom Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && !showSummary && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40"
          >
            <button
              onClick={() => setShowSummary(true)}
              className="w-full bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-between font-bold text-sm hover:bg-primary/95 transition-all cursor-pointer border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 px-2.5 py-1 rounded-full text-xs">
                  {cartCount} {cartCount === 1 ? 'ítem' : 'ítems'}
                </div>
                <span>Ver Mi Pedido</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base text-yellow-300 font-black">S/. {total.toFixed(2)}</span>
                <ChevronRight size={18} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-primary" size={20} />
                  <h3 className="font-title text-xl font-bold text-dark">Mi Pedido</h3>
                </div>
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 divide-y divide-gray-100">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Tu carrito está vacío.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.key} className="py-3 flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-dish font-bold text-dark text-sm">{item.nombre}</h4>
                        <span className="text-xs text-primary font-semibold">{item.presentacion} · S/. {item.precio.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.key, -1)}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-dark shadow-sm hover:bg-gray-50 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.key, 1)}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-dark shadow-sm hover:bg-gray-50 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => updateQuantity(item.key, -item.cantidad)}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-base">
                    <span className="font-bold text-gray-600">Total Estimado:</span>
                    <span className="font-title text-2xl font-bold text-primary">S/. {total.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 text-center">La disponibilidad y tiempos se confirman directamente por WhatsApp.</p>
                  <button
                    onClick={sendToWhatsApp}
                    className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] transition-colors cursor-pointer"
                  >
                    <span>Enviar Pedido por WhatsApp</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Birthday Modal Form */}
      <AnimatePresence>
        {showBirthdayForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl border border-primary/20"
            >
              <button
                onClick={() => setShowBirthdayForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              {birthdaySuccess ? (
                <div className="text-center py-6">
                  <Gift className="w-16 h-16 text-primary mx-auto mb-3 animate-bounce" />
                  <h3 className="font-title text-2xl text-primary font-bold mb-2">¡Registro Exitoso!</h3>
                  <p className="text-sm text-gray-600">Te esperamos en tu mes de cumpleaños para engreírte con una sorpresa especial de Alexs.</p>
                </div>
              ) : (
                <form onSubmit={handleBirthdaySubmit} className="flex flex-col gap-3">
                  <div className="text-center mb-1">
                    <Gift className="w-10 h-10 text-primary mx-auto mb-1" />
                    <h3 className="font-title text-xl text-primary font-bold">Club de Cumpleañeros</h3>
                    <p className="text-[11px] text-gray-500">Regístrate y recibe una cortesía marina en tu día especial.</p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Nombres y Apellidos *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej. Carlos Mendoza"
                      value={birthdayData.nombre}
                      onChange={e => setBirthdayData({ ...birthdayData, nombre: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-primary bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">WhatsApp / Teléfono *</label>
                    <input
                      required
                      type="tel"
                      placeholder="Ej. 987654321"
                      value={birthdayData.telefono}
                      onChange={e => setBirthdayData({ ...birthdayData, telefono: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-primary bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Fecha de Nacimiento *</label>
                    <input
                      required
                      type="date"
                      value={birthdayData.fechaNacimiento}
                      onChange={e => setBirthdayData({ ...birthdayData, fechaNacimiento: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-primary bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Distrito de Residencia *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej. Comas, Los Olivos, etc."
                      value={birthdayData.distrito}
                      onChange={e => setBirthdayData({ ...birthdayData, distrito: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-primary bg-gray-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBirthday}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-primary/30 mt-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/90"
                  >
                    {isSubmittingBirthday ? <Loader2 size={16} className="animate-spin" /> : 'Registrarme para mi cortesía'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal Form */}
      <AnimatePresence>
        {showReviewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl border border-primary/20"
            >
              <button
                onClick={() => setShowReviewForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              {reviewSuccess ? (
                <div className="text-center py-6">
                  <Star className="w-16 h-16 text-yellow-400 mx-auto mb-3 fill-yellow-400 animate-bounce" />
                  <h3 className="font-title text-2xl text-primary font-bold mb-2">¡Muchas Gracias!</h3>
                  <p className="text-sm text-gray-600">Tu opinión nos ayuda a seguir mejorando cada día.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div className="text-center mb-1">
                    <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
                    <h3 className="font-title text-xl text-primary font-bold">Tu Opinión nos Importa</h3>
                    <p className="text-[11px] text-gray-500">Califícanos para seguir brindándote la mejor atención.</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5 text-center">Atención y Servicio del Personal</label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={28}
                          onClick={() => setReviewData({ ...reviewData, estrellasMozo: star })}
                          className={`cursor-pointer transition-colors ${
                            star <= reviewData.estrellasMozo ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5 text-center">Sabor y Calidad de la Comida</label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={28}
                          onClick={() => setReviewData({ ...reviewData, estrellasComida: star })}
                          className={`cursor-pointer transition-colors ${
                            star <= reviewData.estrellasComida ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Comentario u Observación (Opcional)</label>
                    <textarea
                      rows={2}
                      placeholder="Cuéntanos más detalles..."
                      value={reviewData.comentario}
                      onChange={e => setReviewData({ ...reviewData, comentario: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-primary bg-gray-50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-primary/30 mt-1 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/90"
                  >
                    {isSubmittingReview ? <Loader2 size={16} className="animate-spin" /> : 'Enviar Calificación'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

