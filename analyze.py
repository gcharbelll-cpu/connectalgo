from PIL import Image

for i, p in enumerate([r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772635909972.png', r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772636081529.png']):
    img = Image.open(p).convert("RGBA")
    print(f"Image {i}: Top-left pixel is {img.getpixel((0,0))}")

