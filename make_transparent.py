from PIL import Image
import os

def process_image(in_path, out_path, is_ftmo=False):
    img = Image.open(in_path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    
    for item in datas:
        r, g, b, a = item
        if a == 0:
            new_data.append(item)
            continue
            
        # If FTMO, keep only white text (r,g,b > 200)
        # If Bybit, keep white (r,g,b > 200) and yellow (r>200, g>150, b<100)
        
        is_white = r > 180 and g > 180 and b > 180
        is_yellow = r > 180 and g > 120 and b < 100
        
        if is_white or (not is_ftmo and is_yellow):
            # retain the pixel but remove the grey halo
            if r > 230 and g > 230 and b > 230:
                new_data.append((255, 255, 255, a))
            elif is_yellow:
                new_data.append(item)
            else:
                # anti aliasing: mix alpha based on lightness
                light = (r+g+b)/3
                new_data.append((255, 255, 255, int(light)))
        else:
            new_data.append((0,0,0,0))
            
    img.putdata(new_data)
    img.save(out_path, "PNG")

src_ftmo = r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772635909972.png'
src_bybit = r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772636081529.png'

dest_dir = r'c:/Users/Charbel/.gemini/antigravity/playground/fusion-magnetosphere/strategy-portfolio/public/images/partners'

# Process the original files
process_image(src_ftmo, dest_dir + '/ftmo.png', is_ftmo=True)
process_image(src_bybit, dest_dir + '/bybit.png', is_ftmo=False)

print("Images brutally processed to absolute transparency.")
