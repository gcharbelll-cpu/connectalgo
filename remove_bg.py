from PIL import Image
import os

def remove_bg(input_path, output_path, tolerance=40):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            if item[0] < tolerance and item[1] < tolerance and item[2] < tolerance:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        img.save(output_path, "PNG")
        print(f"Processed {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error {input_path}: {e}")

src1 = r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772635614269.png'
src2 = r'c:/Users/Charbel/.gemini/antigravity/brain/84d1685c-983c-4db5-afd6-7f967a1f688b/media__1772635670501.png'
dest_dir = r'c:/Users/Charbel/.gemini/antigravity/playground/fusion-magnetosphere/strategy-portfolio/public/images/partners'
remove_bg(src1, dest_dir + '/bybit.png')
remove_bg(src2, dest_dir + '/ftmo.png')
