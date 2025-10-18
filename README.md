# Image to WebP Converter - Chrome Extension

A powerful Chrome extension that converts PNG, JPG, and JPEG images to WebP format directly in your browser. This extension provides both a user-friendly popup interface and context menu integration for seamless image conversion.

## Features

- 🖼️ **Multiple Input Formats**: Supports PNG, JPG, and JPEG images
- 🎯 **WebP Output**: Converts images to modern WebP format for better compression
- 🎛️ **Quality Control**: Adjustable quality settings (1-100%)
- 📁 **Drag & Drop**: Easy file selection with drag and drop support
- 🖱️ **Context Menu**: Right-click on images to convert them instantly
- 📄 **Batch Processing**: Convert multiple images at once
- 📊 **Progress Tracking**: Real-time conversion progress and file size comparison
- 💾 **Direct Download**: Converted images download automatically
- 🎨 **Modern UI**: Beautiful, responsive interface

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Create Icon Files**: First, you need to create the required PNG icon files:
   - Go to the `icons/` directory
   - Follow the instructions in `icons/README.md` to convert `icon.svg` to PNG files
   - Create: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

2. **Load the Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension directory (`39-image-converter-chrome-extension`)

3. **Pin the Extension** (optional):
   - Click the puzzle piece icon in Chrome toolbar
   - Pin the "Image to WebP Converter" extension

### Method 2: Package and Install

1. Create the icon files as described above
2. Go to `chrome://extensions/`
3. Click "Pack extension"
4. Select the extension directory
5. Install the generated `.crx` file

## Usage

### Popup Interface

1. **Click the extension icon** in your browser toolbar
2. **Add images** by:
   - Dragging and dropping files onto the upload area
   - Clicking the upload area to browse for files
3. **Adjust quality** using the slider (1-100%)
4. **Click "Convert to WebP"** to start conversion
5. **Download** the converted files using the download buttons

### Context Menu Integration

1. **Right-click on any image** on a webpage
2. **Select "Convert to WebP"** from the context menu
3. The image will be converted and downloaded automatically

### Batch Conversion

1. **Right-click on any webpage** (not on an image)
2. **Select "Convert all images on page to WebP"**
3. All convertible images on the page will be processed

## File Structure

```
39-image-converter-chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── background.js          # Background service worker
├── content.js             # Content script for web pages
├── icons/                 # Extension icons
│   ├── icon.svg          # Source SVG icon
│   ├── icon16.png        # 16x16 icon (create this)
│   ├── icon32.png        # 32x32 icon (create this)
│   ├── icon48.png        # 48x48 icon (create this)
│   ├── icon128.png       # 128x128 icon (create this)
│   └── README.md         # Icon creation instructions
├── main.js               # Original Node.js script
├── package.json          # Node.js dependencies
└── README.md             # This file
```

## Technical Details

### Technologies Used

- **Manifest V3**: Latest Chrome extension standard
- **Canvas API**: For image conversion to WebP
- **Chrome APIs**: Downloads, Context Menus, Tabs
- **Modern JavaScript**: ES6+ features, async/await
- **CSS3**: Modern styling with gradients and animations

### Browser Compatibility

- Chrome 88+ (Manifest V3 support)
- Edge 88+ (Chromium-based)
- Other Chromium-based browsers

### Performance

- **Client-side conversion**: No server upload required
- **Memory efficient**: Processes images in chunks
- **Fast conversion**: Uses native Canvas API
- **Quality control**: Adjustable compression settings

## Development

### Prerequisites

- Chrome browser with developer mode enabled
- Basic understanding of Chrome extension development

### Local Development

1. Make changes to the extension files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test the changes

### Debugging

- **Popup**: Right-click extension icon → "Inspect popup"
- **Background**: Go to `chrome://extensions/` → Click "service worker"
- **Content Script**: Use browser dev tools on any webpage

## Permissions

The extension requires these permissions:

- `contextMenus`: For right-click menu integration
- `downloads`: To save converted images
- `activeTab`: To interact with current webpage

## Limitations

- **CORS restrictions**: Some images may not convert due to cross-origin policies
- **File size**: Very large images may cause memory issues
- **Format support**: Only converts PNG, JPG, JPEG to WebP
- **Browser only**: Requires Chrome/Chromium-based browser

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Ensure all icon files are present
3. Verify the extension is properly loaded
4. Try refreshing the extension in `chrome://extensions/`

## Changelog

### Version 1.0.0
- Initial release
- Popup interface with drag & drop
- Context menu integration
- Batch conversion support
- Quality adjustment
- Progress tracking
- Direct download functionality
