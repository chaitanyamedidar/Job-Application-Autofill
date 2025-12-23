# Icon Files

The current icon files are SVG placeholders renamed as PNG. For production use, you should create proper PNG files.

## How to Create Proper Icons

### Option 1: Using Online Tools
1. Visit [Favicon Generator](https://favicon.io/) or [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload a base image or create an icon
3. Download PNG files in required sizes: 16x16, 32x32, 48x48, 128x128

### Option 2: Using Design Software
1. **Figma/Sketch/Adobe Illustrator**: Design a 128x128 icon
2. Export in PNG format at required sizes
3. Use a checkmark or form-related icon design

### Option 3: Using Command Line (ImageMagick)
```bash
# If you have ImageMagick installed
convert -size 128x128 xc:none -fill "#667eea" -draw "roundrectangle 0,0,128,128,20,20" -fill white -stroke white -strokewidth 8 -draw "polyline 32,64 48,80 96,32" icon128.png
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 32x32 icon32.png
convert icon128.png -resize 16x16 icon16.png
```

## Current Icons
The current icons are SVG files with `.png` extension. Chrome may display them, but for best compatibility:
- Replace with actual PNG files
- Use consistent branding colors
- Ensure icons are visible on both light and dark backgrounds
- Follow Chrome Web Store icon guidelines

## Design Recommendations
- Use simple, recognizable shapes
- High contrast for visibility
- Consistent color scheme (#667eea purple/blue theme)
- Checkmark or form-related symbolism
