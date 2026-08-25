from pathlib import Path
import csv

from reportlab.lib.colors import HexColor, Color
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "output"
PDF_DIR = OUT / "pdf"
ASSET_DIR = OUT / "assets"
TMP_DIR = ROOT / "tmp" / "pdfs"
PDF_PATH = PDF_DIR / "carta_alexs_redisenada.pdf"
CSV_PATH = OUT / "datos_menu_alexs.csv"
LOGO_PATH = ASSET_DIR / "logo_alexs_mejorado.png"

for directory in (OUT, PDF_DIR, ASSET_DIR, TMP_DIR):
    directory.mkdir(parents=True, exist_ok=True)


FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")
FONT_ITALIC = Path(r"C:\Windows\Fonts\segoeuii.ttf")
pdfmetrics.registerFont(TTFont("MenuRegular", str(FONT_REGULAR)))
pdfmetrics.registerFont(TTFont("MenuBold", str(FONT_BOLD)))
pdfmetrics.registerFont(TTFont("MenuItalic", str(FONT_ITALIC)))


SAND = HexColor("#FFF8EB")
PAPER = HexColor("#FFFCF5")
NAVY = HexColor("#082B45")
TEAL = HexColor("#087F83")
MINT = HexColor("#B9DED3")
CORAL = HexColor("#F05A47")
ORANGE = HexColor("#F3A23A")
GOLD = HexColor("#F7C65D")
WHITE = HexColor("#FFFFFF")
MUTED = HexColor("#5E6D70")
LINE = HexColor("#D8DDD6")


DATA = [
    {"category": "Sudados", "columns": ["Chica", "Mediana", "Familiar"], "items": [
        ("Sudado de pescado", "Pesca del día", [40, 50, 60]),
        ("Sudado mixto", "Pescado con mariscos", [40, 55, 65]),
        ("Sudado de filete", "Pescado en filete", [50, 60, 80]),
        ("Sudado mixto de filete", "Filete de pescado con mariscos", [55, 65, 85]),
        ("Parihuela", "Pescado con variedad de mariscos", [40, 55, 65]),
    ]},
    {"category": "Chicharrones", "columns": ["Chica", "Mediana", "Familiar"], "items": [
        ("Chicharrón de pota", "", [30, 40, 50]),
        ("Chicharrón de pescado", "", [40, 50, 60]),
        ("Chicharrón mixto", "Pescado y mariscos", [50, 60, 75]),
    ]},
    {"category": "Jaleas", "columns": ["Chica", "Mediana", "Familiar"], "items": [
        ("Jalea de pescado", "Pescado frito con chicharrón de pescado", [50, 60, 70]),
        ("Jalea mixta", "Pescado con mariscos", [55, 65, 80]),
        ("Jalea especial", "Pescado en filete", [60, 70, 80]),
        ("Jalea especial mixta", "Filete de pescado con mariscos", [65, 75, 85]),
        ("Encebollado de pescado", "", [40, 50, 60]),
        ("Pescado a lo macho", "Pescado frito con salsa de mariscos", [40, 50, 60]),
    ]},
    {"category": "Ceviches", "columns": ["Chica", "Mediana", "Familiar"], "items": [
        ("Ceviche de pota", "", [30, 40, 50]),
        ("Ceviche de pescado", "", [40, 50, 60]),
        ("Ceviche mixto", "Pescado con mariscos", [40, 55, 65]),
        ("Tiradito", "Láminas de pescado bañadas en salsa de ají amarillo", [40, 50, 60]),
    ]},
    {"category": "Ceviches norteños", "columns": ["Chica", "Mediana", "Familiar"], "items": [
        ("Ceviche de caballa", "", [40, 50, 60]),
        ("Encebichado de caballa", "", [30, 40, 50]),
        ("Encebichado de pescado blanco", "", [40, 50, 60]),
    ]},
    {"category": "Arroces", "columns": ["Chica", "Mediana", "Familiar"], "items": [
        ("Chaufa de pescado", "", [20, 40, 60]),
        ("Chaufa de mariscos", "", [25, 45, 65]),
        ("Arroz con mariscos", "", [25, 45, 65]),
        ("Arroz con pescado frito", "", [20, 40, 60]),
    ]},
    {"category": "Fuentes marinas", "columns": ["Chica", "Mediana", "Familiar"], "items": [
        ("Ronda marina", "Ceviche + chicharrón + arroz con mariscos + chaufa de mariscos + leche de tigre", [60, 70, 80]),
        ("Trío marino", "Ceviche + chicharrón + arroz con mariscos", [50, 60, 70]),
        ("Dúo marino", "Ceviche de pescado + chicharrón de pescado", [40, 50, 60]),
    ]},
    {"category": "Norteños", "columns": ["Chica", "Mediana", "Familiar"], "items": [
        ("Seco de Chabelo", "", [30, 40, 50]),
        ("Carne aliñada", "", [30, 40, 50]),
        ("Arroz con pato", "", [30, 50, 75]),
        ("Seco de carnero", "", [25, 50, 75]),
        ("Pollo a la parrilla", "", [20, 40, 60]),
    ]},
    {"category": "Especiales", "columns": ["Presentación", "Precio"], "items": [
        ("Trucha frita", "Personal", [20]),
        ("Trucha frita", "Mediana", [40]),
        ("Cuy frito", "Personal", [25]),
        ("Cuy frito", "Cuy entero", [50]),
    ]},
    {"category": "Porciones", "columns": ["Precio"], "items": [
        ("Sarandaja", "", [5]), ("Cancha", "", [5]), ("Yuca", "", [5]),
        ("Camote", "", [5]), ("Mote", "", [5]), ("Arroz", "", [5]),
        ("Chifle", "", [5]), ("Cancha con yuca", "", [7]),
        ("Camote con yuca", "", [7]), ("Sarandaja con ensalada", "", [7]),
        ("Camote con mote", "", [7]), ("Ensalada criolla", "", [8]),
    ]},
    {"category": "Bebidas", "columns": ["Precio"], "items": [
        ("Gaseosa chica", "", [4]), ("Gaseosa 1/2 litro", "", [5]),
        ("Gaseosa 1 litro", "", [8]), ("Gaseosa 1 1/2 litro", "", [10]),
        ("Gaseosa 3 litros", "", [18]), ("Cerveza Cristal", "", [9]),
        ("Cerveza Pilsen", "", [9]), ("Cerveza de trigo", "", [10]),
        ("Cerveza negra", "", [10]), ("Agua mineral", "", [3]),
        ("Refresco de maracuyá", "", [10]), ("Chicha morada", "", [10]),
        ("Chicha de jora", "", [10]), ("Leche de tigre", "", [15]),
    ]},
]


def copy_logo():
    source = Path(r"C:\Users\jfabi\.codex\generated_images\01a03ac7-292f-7462-87e4-af109f940c2a\exec-9e3b6119-a147-4a45-a625-6e3fa83bd7bc.png")
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        image = image.crop(bbox)
    pad = 42
    clean = Image.new("RGBA", (image.width + pad * 2, image.height + pad * 2), (0, 0, 0, 0))
    clean.alpha_composite(image, (pad, pad))
    clean.save(LOGO_PATH)


def export_csv():
    with CSV_PATH.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.writer(handle)
        writer.writerow(["Categoría", "Plato", "Descripción/Presentación", "Chica/Personal", "Mediana", "Familiar"])
        for section in DATA:
            for name, desc, prices in section["items"]:
                row = [section["category"], name, desc]
                if len(prices) == 3:
                    row += [f"S/ {prices[0]:.2f}", f"S/ {prices[1]:.2f}", f"S/ {prices[2]:.2f}"]
                else:
                    row += [f"S/ {prices[0]:.2f}", "", ""]
                writer.writerow(row)


def rounded_rect(c, x, y, w, h, radius, fill, stroke=None, stroke_width=1):
    c.setFillColor(fill)
    c.setStrokeColor(stroke or fill)
    c.setLineWidth(stroke_width)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1 if stroke else 0)


def page_background(c, page_no, title, subtitle):
    w, h = A4
    c.setFillColor(PAPER)
    c.rect(0, 0, w, h, fill=1, stroke=0)
    c.setFillColor(SAND)
    c.circle(w - 36, h - 18, 120, fill=1, stroke=0)
    c.setFillColor(Color(0.97, 0.64, 0.23, alpha=0.18))
    c.circle(w - 28, h - 30, 74, fill=1, stroke=0)
    c.setFillColor(MINT)
    c.circle(18, 75, 86, fill=1, stroke=0)
    c.setFillColor(TEAL)
    p = c.beginPath()
    p.moveTo(0, 38)
    p.curveTo(140, 75, 270, 8, 430, 45)
    p.curveTo(510, 65, 560, 53, w, 37)
    p.lineTo(w, 0)
    p.lineTo(0, 0)
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    c.setFillColor(CORAL)
    p = c.beginPath()
    p.moveTo(0, 18)
    p.curveTo(160, 48, 330, -5, w, 23)
    p.lineTo(w, 0)
    p.lineTo(0, 0)
    p.close()
    c.drawPath(p, fill=1, stroke=0)

    logo = ImageReader(str(LOGO_PATH))
    logo_w = 62 if page_no > 1 else 84
    logo_h = logo_w * 1.20
    c.drawImage(logo, 38, h - 42 - logo_h, width=logo_w, height=logo_h, mask="auto", preserveAspectRatio=True, anchor="c")
    title_x = 38 + logo_w + 18
    c.setFillColor(CORAL)
    c.setFont("MenuBold", 10)
    c.drawString(title_x, h - 50, "PIURA · CATACAOS")
    c.setFillColor(NAVY)
    c.setFont("MenuBold", 25 if page_no > 1 else 30)
    c.drawString(title_x, h - 78, title)
    c.setFillColor(MUTED)
    c.setFont("MenuRegular", 9.5)
    c.drawString(title_x, h - 96, subtitle)
    c.setStrokeColor(CORAL)
    c.setLineWidth(3)
    c.line(38, h - 121, w - 38, h - 121)

    c.setFillColor(WHITE)
    c.setFont("MenuBold", 8.5)
    c.drawString(38, 16, "Pedidos: 922 609 958 · 940 594 920")
    c.drawRightString(w - 38, 16, f"PÁGINA {page_no} · PRECIOS EN SOLES")
    return h - 143


def wrap_text(c, text, font, size, max_width):
    words = text.split()
    lines, line = [], ""
    for word in words:
        candidate = word if not line else f"{line} {word}"
        if c.stringWidth(candidate, font, size) <= max_width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def section_header(c, x, y, width, title, columns):
    rounded_rect(c, x, y - 27, width, 27, 9, NAVY)
    c.setFillColor(WHITE)
    c.setFont("MenuBold", 12)
    c.drawString(x + 12, y - 18, title.upper())
    if len(columns) == 3:
        centers = [x + width - 126, x + width - 78, x + width - 27]
        c.setFont("MenuBold", 7.2)
        for center, label in zip(centers, columns):
            c.drawCentredString(center, y - 17, label.upper())
    return y - 35


def draw_price_section(c, x, y, width, section, compact=False):
    y = section_header(c, x, y, width, section["category"], section["columns"])
    name_w = width - 153
    for index, (name, desc, prices) in enumerate(section["items"]):
        has_desc = bool(desc)
        row_h = 34 if has_desc else (26 if compact else 29)
        if index % 2 == 0:
            rounded_rect(c, x, y - row_h + 3, width, row_h - 2, 7, HexColor("#F4F2E8"))
        c.setFillColor(NAVY)
        c.setFont("MenuBold", 9.7 if compact else 10)
        c.drawString(x + 10, y - 13, name)
        if desc:
            c.setFillColor(MUTED)
            c.setFont("MenuItalic", 7.2)
            desc_lines = wrap_text(c, desc, "MenuItalic", 7.2, name_w - 10)
            for li, line in enumerate(desc_lines[:2]):
                c.drawString(x + 10, y - 23 - li * 8, line)
        centers = [x + width - 126, x + width - 78, x + width - 27]
        c.setFillColor(CORAL)
        c.setFont("MenuBold", 10.5)
        for center, price in zip(centers, prices):
            c.drawCentredString(center, y - 16, f"S/ {price}")
        y -= row_h
    return y - 12


def draw_simple_cards(c, x, y, width, section, columns=2):
    y = section_header(c, x, y, width, section["category"], [])
    gap = 10
    card_w = (width - gap * (columns - 1)) / columns
    card_h = 31
    for i, (name, desc, prices) in enumerate(section["items"]):
        col = i % columns
        row = i // columns
        cx = x + col * (card_w + gap)
        cy = y - row * (card_h + 7)
        rounded_rect(c, cx, cy - card_h + 4, card_w, card_h, 8, HexColor("#F4F2E8"))
        c.setFillColor(NAVY)
        c.setFont("MenuBold", 9)
        c.drawString(cx + 9, cy - 10, name)
        if desc:
            c.setFillColor(MUTED)
            c.setFont("MenuRegular", 7.1)
            c.drawString(cx + 9, cy - 21, desc)
        c.setFillColor(CORAL)
        c.setFont("MenuBold", 10)
        c.drawRightString(cx + card_w - 9, cy - 16, f"S/ {prices[0]}")
    rows = (len(section["items"]) + columns - 1) // columns
    return y - rows * (card_h + 7) - 6


def highlight_box(c, x, y, width, headline, body):
    rounded_rect(c, x, y - 82, width, 82, 14, CORAL)
    c.setFillColor(WHITE)
    c.setFont("MenuBold", 14)
    c.drawString(x + 16, y - 25, headline)
    c.setFont("MenuRegular", 8.6)
    for i, line in enumerate(wrap_text(c, body, "MenuRegular", 8.6, width - 32)[:4]):
        c.drawString(x + 16, y - 44 - i * 11, line)


def build_pdf():
    c = canvas.Canvas(str(PDF_PATH), pagesize=A4)
    c.setTitle("Carta Alexs - Piura Catacaos")
    c.setAuthor("Alexs")
    w, h = A4
    margin = 38
    content_w = w - margin * 2

    y = page_background(c, 1, "Sabores del mar", "Recetas marinas para compartir, con espíritu norteño")
    y = draw_price_section(c, margin, y, content_w, DATA[0])
    y = draw_price_section(c, margin, y, content_w, DATA[1])
    draw_price_section(c, margin, y, content_w, DATA[2], compact=True)
    c.showPage()

    y = page_background(c, 2, "Frescura marina", "Ceviches, arroces y combinaciones preparadas al momento")
    y = draw_price_section(c, margin, y, content_w, DATA[3])
    y = draw_price_section(c, margin, y, content_w, DATA[4])
    y = draw_price_section(c, margin, y, content_w, DATA[5])
    draw_simple_cards(c, margin, y, content_w, DATA[8], columns=2)
    c.showPage()

    y = page_background(c, 3, "Para compartir", "Fuentes abundantes y clásicos del norte")
    y = draw_price_section(c, margin, y, content_w, DATA[6])
    y = draw_price_section(c, margin, y, content_w, DATA[7])
    highlight_box(c, margin, y, content_w, "De Catacaos a tu mesa", "Una carta con alma norteña, pescado fresco y porciones para disfrutar en familia. Consulta por la pesca del día.")
    c.setFillColor(NAVY)
    c.setFont("MenuBold", 10)
    c.drawString(margin, 91, "VISÍTANOS")
    c.setFillColor(MUTED)
    c.setFont("MenuRegular", 8.4)
    address = "Calle Las Lilas N.° 107-105, Urb. La Alborada, Comas · Esquina con Av. Sinchi Roca · Alt. Hospital de Collique, 3 1/2 cuadras abajo"
    for i, line in enumerate(wrap_text(c, address, "MenuRegular", 8.4, content_w)):
        c.drawString(margin, 76 - i * 11, line)
    c.showPage()

    y = page_background(c, 4, "Para acompañar", "Porciones y bebidas para completar la experiencia")
    y = draw_simple_cards(c, margin, y, content_w, DATA[9], columns=3)
    y -= 8
    y = draw_simple_cards(c, margin, y, content_w, DATA[10], columns=2)
    highlight_box(c, margin, 126, content_w, "Haz tu pedido", "Atendemos recepciones y pedidos. Escríbenos o llámanos al 922 609 958 o al 940 594 920.")
    c.save()


if __name__ == "__main__":
    copy_logo()
    export_csv()
    build_pdf()
    print(PDF_PATH)
    print(CSV_PATH)
    print(LOGO_PATH)
