from PIL import Image
import os

def process_logo(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # item is (R, G, B, A)
            r, g, b, a = item
            
            # If the pixel is very dark (r,g,b all less than 50), it is the background
            if r < 80 and g < 80 and b < 80:
                newData.append((0, 0, 0, 0))
            else:
                # To prevent faint dark fringes around anti-aliased edges:
                # We can boost the brightness of semi-dark pixels or make them semi-transparent
                if (r < 180 and g < 180 and b < 180) and not (r > 200 and g > 150 and b < 50):
                     # Not yellow, but grey. Let's make it white but with transparency = lightness
                     lightness = int((r + g + b) / 3)
                     newData.append((255, 255, 255, lightness))
                else:
                     newData.append(item)
                
        img.putdata(newData)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        img.save(output_path, "PNG")
        print(f"Processed {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error {input_path}: {e}")

# The new transparent files from 4:54 PM (or rather, the ones that had backgrounds)
src1 = r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772635909972.png'  # FTMO
src2 = r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772636081529.png'  # Bybit
dest_dir = r'c:/Users/Charbel/.gemini/antigravity/playground/fusion-magnetosphere/strategy-portfolio/public/images/partners'

process_logo(src1, dest_dir + '/ftmo.png')
process_logo(src2, dest_dir + '/bybit.png')
