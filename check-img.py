from PIL import Image

p = r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772636173421.png'
img = Image.open(p).convert("RGBA")
img_small = img.resize((40, 20))
# Let's just print top colors 
colors = img.getcolors(maxcolors=1000000)
top_colors = sorted(colors, key=lambda x: x[0], reverse=True)[:5]
print("Top colors top image:", top_colors)

# Also check their sizes
for imgp in ['media__1772635909972.png', 'media__1772636081529.png']:
    img2 = Image.open(f'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/{imgp}')
    print(imgp, img2.size)
