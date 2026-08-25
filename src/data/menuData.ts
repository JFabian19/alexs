export interface PriceOption {
  label: string;
  price: number;
}

export interface Dish {
  nombre: string;
  descripcion?: string;
  prices: PriceOption[];
  destacado?: boolean;
}

export interface Category {
  id: string;
  nombre: string;
  eyebrow: string;
  items: Dish[];
}

const trio = (chica: number, mediana: number, familiar: number): PriceOption[] => [
  { label: "Chica", price: chica },
  { label: "Mediana", price: mediana },
  { label: "Familiar", price: familiar },
];

const uno = (price: number): PriceOption[] => [{ label: "Porción", price }];

export const DEFAULT_MENU_DATA: Category[] = [
  {
    id: "sudados",
    nombre: "Sudados",
    eyebrow: "Calientitos y sabrosos",
    items: [
      { nombre: "Sudado de pescado", descripcion: "Preparado con la pesca del día.", prices: trio(40, 50, 60), destacado: true },
      { nombre: "Sudado mixto", descripcion: "Pescado con mariscos.", prices: trio(40, 55, 65) },
      { nombre: "Sudado de filete", descripcion: "Pescado en filete.", prices: trio(50, 60, 80) },
      { nombre: "Sudado mixto de filete", descripcion: "Filete de pescado con mariscos.", prices: trio(55, 65, 85) },
      { nombre: "Parihuela", descripcion: "Pescado con variedad de mariscos.", prices: trio(40, 55, 65), destacado: true },
    ],
  },
  {
    id: "chicharrones",
    nombre: "Chicharrones",
    eyebrow: "Crujientes para compartir",
    items: [
      { nombre: "Chicharrón de pota", prices: trio(30, 40, 50) },
      { nombre: "Chicharrón de pescado", prices: trio(40, 50, 60) },
      { nombre: "Chicharrón mixto", descripcion: "Pescado y mariscos.", prices: trio(50, 60, 75), destacado: true },
    ],
  },
  {
    id: "jaleas",
    nombre: "Jaleas",
    eyebrow: "El sabor del mar en una fuente",
    items: [
      { nombre: "Jalea de pescado", descripcion: "Pescado frito con chicharrón de pescado.", prices: trio(50, 60, 70) },
      { nombre: "Jalea mixta", descripcion: "Pescado con mariscos.", prices: trio(55, 65, 80), destacado: true },
      { nombre: "Jalea especial", descripcion: "Preparada con pescado en filete.", prices: trio(60, 70, 80) },
      { nombre: "Jalea especial mixta", descripcion: "Filete de pescado con mariscos.", prices: trio(65, 75, 85) },
      { nombre: "Encebollado de pescado", prices: trio(40, 50, 60) },
      { nombre: "Pescado a lo macho", descripcion: "Pescado frito con salsa de mariscos.", prices: trio(40, 50, 60) },
    ],
  },
  {
    id: "ceviches",
    nombre: "Ceviches",
    eyebrow: "Frescos, cítricos y al momento",
    items: [
      { nombre: "Ceviche de pota", prices: trio(30, 40, 50) },
      { nombre: "Ceviche de pescado", prices: trio(40, 50, 60), destacado: true },
      { nombre: "Ceviche mixto", descripcion: "Pescado con mariscos.", prices: trio(40, 55, 65) },
      { nombre: "Tiradito", descripcion: "Láminas de pescado bañadas en salsa de ají amarillo.", prices: trio(40, 50, 60) },
    ],
  },
  {
    id: "ceviches-nortenos",
    nombre: "Ceviches norteños",
    eyebrow: "Recetas con identidad piurana",
    items: [
      { nombre: "Ceviche de caballa", prices: trio(40, 50, 60), destacado: true },
      { nombre: "Encebichado de caballa", prices: trio(30, 40, 50) },
      { nombre: "Encebichado de pescado blanco", prices: trio(40, 50, 60) },
    ],
  },
  {
    id: "arroces",
    nombre: "Arroces",
    eyebrow: "Contundentes y llenos de sabor",
    items: [
      { nombre: "Chaufa de pescado", prices: trio(20, 40, 60) },
      { nombre: "Chaufa de mariscos", prices: trio(25, 45, 65) },
      { nombre: "Arroz con mariscos", prices: trio(25, 45, 65), destacado: true },
      { nombre: "Arroz con pescado frito", prices: trio(20, 40, 60) },
    ],
  },
  {
    id: "fuentes-marinas",
    nombre: "Fuentes marinas",
    eyebrow: "Combinaciones para disfrutar juntos",
    items: [
      { nombre: "Ronda marina", descripcion: "Ceviche + chicharrón + arroz con mariscos + chaufa de mariscos + leche de tigre.", prices: trio(60, 70, 80), destacado: true },
      { nombre: "Trío marino", descripcion: "Ceviche + chicharrón + arroz con mariscos.", prices: trio(50, 60, 70) },
      { nombre: "Dúo marino", descripcion: "Ceviche de pescado + chicharrón de pescado.", prices: trio(40, 50, 60) },
    ],
  },
  {
    id: "nortenos",
    nombre: "Norteños",
    eyebrow: "Clásicos de nuestra tierra",
    items: [
      { nombre: "Seco de Chabelo", prices: trio(30, 40, 50), destacado: true },
      { nombre: "Carne aliñada", prices: trio(30, 40, 50) },
      { nombre: "Arroz con pato", prices: trio(30, 50, 75) },
      { nombre: "Seco de carnero", prices: trio(25, 50, 75) },
      { nombre: "Pollo a la parrilla", prices: trio(20, 40, 60) },
    ],
  },
  {
    id: "especiales",
    nombre: "Especiales",
    eyebrow: "Sabores tradicionales",
    items: [
      { nombre: "Trucha frita", prices: [{ label: "Personal", price: 20 }, { label: "Mediana", price: 40 }] },
      { nombre: "Cuy frito", prices: [{ label: "Personal", price: 25 }, { label: "Cuy entero", price: 50 }], destacado: true },
    ],
  },
  {
    id: "porciones",
    nombre: "Porciones",
    eyebrow: "El acompañamiento perfecto",
    items: [
      { nombre: "Sarandaja", prices: uno(5) },
      { nombre: "Cancha", prices: uno(5) },
      { nombre: "Yuca", prices: uno(5) },
      { nombre: "Camote", prices: uno(5) },
      { nombre: "Mote", prices: uno(5) },
      { nombre: "Arroz", prices: uno(5) },
      { nombre: "Chifle", prices: uno(5) },
      { nombre: "Cancha con yuca", prices: uno(7) },
      { nombre: "Camote con yuca", prices: uno(7) },
      { nombre: "Sarandaja con ensalada", prices: uno(7) },
      { nombre: "Camote con mote", prices: uno(7) },
      { nombre: "Ensalada criolla", prices: uno(8) },
    ],
  },
  {
    id: "bebidas",
    nombre: "Bebidas",
    eyebrow: "Para refrescar la mesa",
    items: [
      { nombre: "Gaseosa chica", prices: uno(4) },
      { nombre: "Gaseosa 1/2 litro", prices: uno(5) },
      { nombre: "Gaseosa 1 litro", prices: uno(8) },
      { nombre: "Gaseosa 1 1/2 litro", prices: uno(10) },
      { nombre: "Gaseosa 3 litros", prices: uno(18) },
      { nombre: "Cerveza Cristal", prices: uno(9) },
      { nombre: "Cerveza Pilsen", prices: uno(9) },
      { nombre: "Cerveza de trigo", prices: uno(10) },
      { nombre: "Cerveza negra", prices: uno(10) },
      { nombre: "Agua mineral", prices: uno(3) },
      { nombre: "Refresco de maracuyá", prices: uno(10) },
      { nombre: "Chicha morada", prices: uno(10) },
      { nombre: "Chicha de jora", prices: uno(10) },
      { nombre: "Leche de tigre", prices: uno(15), destacado: true },
    ],
  },
];
