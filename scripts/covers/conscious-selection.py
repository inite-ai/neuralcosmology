# Обложка «Осознанного Отбора» в системе обложек серии (ср. nk-cover.png «Небесного Кода»):
# тёмное поле, метки обреза, узкий набор вразрядку. Своей обложки у книги в godacademy нет,
# это рабочий вариант до настоящей. SVG -> PNG через rsvg-convert, затем webp (cwebp или sips).
import os, random, subprocess
random.seed(11)
W, H = 1024, 1536
BG, FG, MUTED, LINE, AMBER = "#151515", "#ece6da", "#8d877c", "#3a3835", "#d9a441"
F = "PT Sans Narrow"
T = "PT Sans Narrow"
o = []
a = o.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
a('<defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/>'
  '<feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0"/></filter></defs>')
a(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

def cross(x, y, s=10):
    a(f'<path d="M{x-s},{y} H{x+s} M{x},{y-s} V{y+s}" stroke="{MUTED}" stroke-width="1"/>')

def corner(x, y, dx, dy, s=34):
    a(f'<path d="M{x},{y+dy*s} V{y} H{x+dx*s}" fill="none" stroke="{MUTED}" stroke-width="1.5"/>')

corner(40, 40, 1, 1); corner(W - 40, 40, -1, 1); corner(40, H - 40, 1, -1); corner(W - 40, H - 40, -1, -1)

def spaced(y, text, size, fill=MUTED, spacing=8, family=F, weight="normal"):
    a(f'<text x="{W/2}" y="{y}" text-anchor="middle" font-family="{family}" font-weight="{weight}" '
      f'font-size="{size}" letter-spacing="{spacing}" fill="{fill}">{text}</text>')

spaced(112, "ОТБОР ПРОШЁЛ ДО ТОГО,", 25)
spaced(150, "КАК ВЫ ВЫБРАЛИ.", 25)
cross(W / 2, 205)
# Высокий узкий заголовок, как на «Небесном Коде»: обычный гротеск, сжатый по горизонтали.
def title(y, text, size):
    a(f'<text transform="translate({W/2},{y}) scale(0.62,1)" text-anchor="middle" font-family="{T}" '
      f'font-size="{size}" letter-spacing="14" fill="{FG}">{text}</text>')

title(372, "ОСОЗНАННЫЙ", 170)
title(512, "ОТБОР", 170)
a(f'<line x1="150" y1="548" x2="{W-150}" y2="548" stroke="{LINE}"/>')
cross(150, 548, 7); cross(W - 150, 548, 7)
spaced(612, "МИХАИЛ САВЧЕНКО", 38, FG, 14, F, "bold")
cross(W / 2, 668)

# Воронка отбора: на каждом этаже остаётся половина, до одной точки.
stages = ["ЗРЕНИЕ", "ВНИМАНИЕ", "ПАМЯТЬ", "СРЕДА", "ЭВОЛЮЦИЯ", "ГИПОТЕЗА", "ВЫБОР"]
x0, x1, top, step = 190, 790, 740, 68
for i, label in enumerate(stages):
    y = top + i * step
    n = 64 >> i
    a(f'<text x="120" y="{y+6}" text-anchor="middle" font-family="{F}" font-size="20" fill="{MUTED}">{7-i:02d}</text>')
    a(f'<line x1="150" y1="{y}" x2="{x0-16}" y2="{y}" stroke="{LINE}"/>')
    survivors = set(random.sample(range(64), n)) if n < 64 else set(range(64))
    for k in range(64):
        x = x0 + (x1 - x0) * (k + 0.5) / 64
        alive = k in survivors if i < 6 else k == 31
        if alive:
            r = 3.2 if i < 6 else 7
            a(f'<circle cx="{x:.1f}" cy="{y}" r="{r}" fill="{AMBER if i == 6 else FG}" opacity="{1 - i*0.06:.2f}"/>')
        else:
            a(f'<circle cx="{x:.1f}" cy="{y}" r="1.4" fill="{LINE}"/>')
    a(f'<line x1="{x1+16}" y1="{y}" x2="{x1+40}" y2="{y}" stroke="{LINE}"/>')
    a(f'<text x="{x1+50}" y="{y+6}" font-family="{F}" font-size="18" letter-spacing="3" fill="{AMBER if i == 6 else MUTED}">{label}</text>')

cross(W / 2, 1258)
spaced(1330, "ЧТО ОСТАЁТСЯ ПОСЛЕ ПРОВЕРКИ", 34, FG, 9, F, "bold")
a(f'<line x1="70" y1="1408" x2="{W-70}" y2="1408" stroke="{LINE}"/>')
a(f'<text x="80" y="1446" font-family="{F}" font-size="18" letter-spacing="3" fill="{MUTED}">НЕЙРОННАЯ КОСМОЛОГИЯ</text>')
a(f'<text x="80" y="1472" font-family="{F}" font-size="18" letter-spacing="3" fill="{MUTED}">КНИГА 2</text>')
a(f'<text x="{W-80}" y="1466" text-anchor="end" font-family="PT Serif" font-size="30" fill="{FG}">КН. 2</text>')
a(f'<rect width="{W}" height="{H}" filter="url(#grain)"/>')
a('</svg>')

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, "..", "..", "public", "covers")
svg = os.path.join(here, "conscious-selection.svg")
png = os.path.join(here, "conscious-selection.png")
open(svg, "w").write("\n".join(o))
subprocess.run(["rsvg-convert", "-w", str(W), "-h", str(H), svg, "-o", png], check=True)
print(png)
