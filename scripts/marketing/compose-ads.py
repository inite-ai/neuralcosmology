import json, subprocess, os, sys
lang = sys.argv[1] if len(sys.argv) > 1 else "ru"
TITLES = {
 "ru": {
  "cc-ch02-physarum": "Слизевик без мозга\nстроит сеть, как у Вселенной",
  "cc-ch03-double-slit": "Посмотрите на фотон,\nи полосы исчезнут",
  "cc-ch04-murmuration": "700 птиц, три правила,\nни одного вожака",
  "cc-comp-rule110": "Восемь клеток,\nкоторые могут вычислить всё",
  "cc-comp-life": "Четыре правила,\nи из пустоты ползут фигуры",
  "cs-ch06-hot-fullerenes": "Нагрейте молекулу,\nи волна исчезнет",
  "ba-ch01-qubit": "Четырнадцать раз подряд:\nодин шанс из 16 384",
  "cc-ch05-planaria": "Разрежьте червя,\nи вырастут две головы",
 },
 "en": {
  "cc-ch02-physarum": "A brainless slime mould\nbuilds a network like the cosmos",
  "cc-ch03-double-slit": "Look at the photon\nand the fringes vanish",
  "cc-ch04-murmuration": "700 birds, three rules,\nno leader",
  "cc-comp-rule110": "Eight cells that can\ncompute anything",
  "cc-comp-life": "Four rules, and shapes\ncrawl out of nothing",
  "cs-ch06-hot-fullerenes": "Heat a molecule\nand its wave disappears",
  "ba-ch01-qubit": "Fourteen in a row:\none chance in 16,384",
  "cc-ch05-planaria": "Cut the worm,\ngrow two heads",
 },
}
FOOT = {"ru": "Попробуйте сами · neuralcosmology.com/ru/experiments", "en": "Try it yourself · neuralcosmology.com/en/experiments"}
SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"
os.makedirs("marketing/ads", exist_ok=True)
for id_, title in TITLES[lang].items():
    meta = json.load(open(f"marketing/rec/{lang}-{id_}.json"))
    r = meta["r"]; x, y, w, h = [int(round(r[k])) for k in ("x", "y", "width", "height")]
    w -= w % 2; h -= h % 2
    for i, line in enumerate(title.split("\n")): open(f"t{i}.txt", "w").write(line)
    open("f.txt", "w").write(FOOT[lang])
    dur = meta["end"] - meta["start"]
    for fmt, (W, H, vw, ts, ty, fy) in {"1x1": (1080, 1080, 1000, 50, 60, 1030), "9x16": (1080, 1920, 1040, 70, 220, 1800)}.items():
        out = f"marketing/ads/{lang}-{id_}-{fmt}.mp4"
        lines = title.split("\n")
        heads = "".join(f"drawtext=fontfile={SERIF}:textfile=t{i}.txt:fontcolor=0xF1EFE8:fontsize={ts}:x=(w-text_w)/2:y={ty + i * int(ts * 1.25)}," for i in range(len(lines)))
        vf = (f"[0:v]trim=start={meta['start']:.2f}:end={meta['end']:.2f},setpts=PTS-STARTPTS,crop={w}:{h}:{x}:{y},scale={vw}:-2[v];"
              f"color=c=0x0b0c10:s={W}x{H}:d={dur:.2f}[bg];"
              f"[bg][v]overlay=(W-w)/2:(H-h)/2+{40 if fmt == '1x1' else 30}:shortest=1,"
              + heads
              + f"drawtext=fontfile={SANS}:textfile=f.txt:fontcolor=0xA9ABF7:fontsize={30 if fmt == '1x1' else 36}:x=(w-text_w)/2:y={fy}")
        cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", meta["file"], "-filter_complex", vf, "-r", "30", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "22", "-movflags", "+faststart", "-an", out]
        subprocess.run(cmd, check=True)
        print(out)
