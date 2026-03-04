from PIL import Image

for i, p in enumerate([r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772635909972.png', r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772636081529.png']):
    img = Image.open(p).convert("RGBA")
    colors = img.getcolors(maxcolors=1000000)
    top_colors = sorted(colors, key=lambda x: x[0], reverse=True)[:5]
    print(f"Image {i} top colors:", top_colors)

