import json, subprocess, sys, re
src = open(__import__("os").path.join(__import__("os").path.dirname(__file__), "compose-ads.py")).read()
ns = {}
exec(src.split("SERIF =")[0].replace("lang = sys.argv[1] if len(sys.argv) > 1 else \"ru\"", "lang='pt'"), ns)
TITLES, FOOT = ns["TITLES"], ns["FOOT"]
SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"; SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"
IDS = ["cc-ch02-physarum", "cc-ch05-planaria", "cc-ch03-double-slit", "ba-ch01-qubit"]
for lang in ("pt", "es"):
    for id_ in IDS:
        meta = json.load(open(f"rec/{lang}-{id_}.json")); r = meta["r"]
        x, y, w, h = [int(round(r[k])) for k in ("x", "y", "width", "height")]; w -= w % 2; h -= h % 2
        lines = TITLES[lang][id_].split("\n")
        for i, l in enumerate(lines): open(f"t{i}.txt", "w").write(l)
        open("f.txt", "w").write(FOOT[lang].split(" · ")[1])
        dur = meta["end"] - meta["start"]
        # safe zone for Reels/Stories: y 270..1245. Title 300..450, video 480..1140 max, footer 1170.
        maxh, vw = 660, 1040
        sc = f"scale='min({vw},iw*{maxh}/ih)':-2"
        ts = 62
        heads = "".join(f"drawtext=fontfile={SERIF}:textfile=t{i}.txt:fontcolor=0xF1EFE8:fontsize={ts}:x=(w-text_w)/2:y={300 + i*78}," for i in range(len(lines)))
        vf = (f"[0:v]trim=start={meta['start']:.2f}:end={meta['end']:.2f},setpts=PTS-STARTPTS,crop={w}:{h}:{x}:{y},{sc}[v];"
              f"color=c=0x0b0c10:s=1080x1920:d={dur:.2f}[bg];[bg][v]overlay=(W-w)/2:480+({maxh}-h)/2:shortest=1,"
              + heads + f"drawtext=fontfile={SANS}:textfile=f.txt:fontcolor=0xA9ABF7:fontsize=34:x=(w-text_w)/2:y=1180")
        out = f"ads/{lang}-{id_}-9x16s.mp4"
        subprocess.run(["ffmpeg","-y","-loglevel","error","-i",meta["file"],"-filter_complex",vf,"-r","30","-c:v","libx264","-pix_fmt","yuv420p","-crf","22","-movflags","+faststart","-an",out], check=True)
        print(out)
