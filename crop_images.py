from PIL import Image

def crop_transparent(image_path):
    img = Image.open(image_path).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        img_cropped = img.crop(bbox)
        img_cropped.save(image_path)
        print(f"Cropped {image_path} to {bbox}")
    else:
        print(f"Empty image {image_path}")

crop_transparent(r'c:/Users/Charbel/.gemini/antigravity/playground/fusion-magnetosphere/strategy-portfolio/public/images/partners/ftmo.png')
crop_transparent(r'c:/Users/Charbel/.gemini/antigravity/playground/fusion-magnetosphere/strategy-portfolio/public/images/partners/bybit.png')
