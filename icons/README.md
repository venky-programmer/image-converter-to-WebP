# Extension Icons

This directory contains the icons for the Image to WebP Converter Chrome extension.

## Required Icon Sizes

The extension requires the following PNG icon files:
- `icon16.png` - 16x16 pixels
- `icon32.png` - 32x32 pixels  
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## Creating Icons

You can create these icons from the provided `icon.svg` file using any of these methods:

### Method 1: Online SVG to PNG Converter
1. Go to an online SVG to PNG converter (like convertio.co, cloudconvert.com, or svgtopng.com)
2. Upload the `icon.svg` file
3. Convert to PNG with the required dimensions (16x16, 32x32, 48x48, 128x128)
4. Save each size with the appropriate filename

### Method 2: Using ImageMagick (if installed)
```bash
# Convert SVG to different PNG sizes
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 32x32 icon32.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

### Method 3: Using GIMP or Photoshop
1. Open `icon.svg` in GIMP or Photoshop
2. Export as PNG with the required dimensions
3. Save with the appropriate filename

### Method 4: Using Inkscape (free)
```bash
# Convert SVG to different PNG sizes
inkscape icon.svg --export-png=icon16.png --export-width=16 --export-height=16
inkscape icon.svg --export-png=icon32.png --export-width=32 --export-height=32
inkscape icon.svg --export-png=icon48.png --export-width=48 --export-height=48
inkscape icon.svg --export-png=icon128.png --export-width=128 --export-height=128
```

## Icon Design

The icon features:
- A gradient background (blue to purple)
- An image representation (mountain landscape)
- "WebP" text indicator
- Conversion arrows
- Clean, modern design suitable for browser extensions

Once you have created all four PNG files, the extension will be ready to use!
