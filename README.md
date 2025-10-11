# Qissaa - Photography Portfolio Website

A professional, elegant portfolio website designed to showcase photography work with smooth animations and modern design.

## Features

✨ **Hero Section**: Full-screen video background with logo overlay  
📸 **Two Portfolio Sections**: Personal and Commissioned work  
🎬 **Mixed Media Support**: Display both photos and videos  
🌊 **Smooth Scroll Animations**: Engaging parallax and fade-in effects  
📱 **Fully Responsive**: Works seamlessly on all devices  
⚫ **Professional Black Design**: Clean, minimalist aesthetic  

## Quick Start

### Required Assets

Before launching the website, make sure you have this file in your project folder:

1. **for web.mp4** - Your hero section video

### File Structure

```
Utkarsh portfolio/
├── index.html              # Main homepage
├── personal.html           # Personal work gallery
├── commissioned.html       # Commissioned work gallery
├── styles.css             # All styling
├── script.js              # Animations & interactions
├── for web.mp4            # Hero video
└── README.md              # This file
```

## Adding Your Own Content

### 1. Replace Placeholder Images

In `personal.html` and `commissioned.html`, replace the placeholder Unsplash images with your own:

```html
<!-- Replace this: -->
<div class="gallery-item" data-aos="fade-up">
    <img src="https://images.unsplash.com/photo-XXXXX" alt="Personal work 1">
    <div class="gallery-item-overlay"></div>
</div>

<!-- With your own image: -->
<div class="gallery-item" data-aos="fade-up">
    <img src="path/to/your/image.jpg" alt="Your work description">
    <div class="gallery-item-overlay"></div>
</div>
```

### 2. Adding Videos

To add video content:

```html
<div class="gallery-item" data-aos="fade-up">
    <video muted loop playsinline onmouseenter="this.play()" onmouseleave="this.pause()">
        <source src="path/to/your/video.mp4" type="video/mp4">
    </video>
    <div class="gallery-item-overlay">
        <span class="play-icon">▶</span>
    </div>
</div>
```

### 3. Organizing Your Media

Recommended folder structure for your media files:

```
Utkarsh portfolio/
├── images/
│   ├── personal/
│   │   ├── photo1.jpg
│   │   ├── photo2.jpg
│   │   └── ...
│   └── commissioned/
│       ├── photo1.jpg
│       ├── photo2.jpg
│       └── ...
├── videos/
│   ├── personal/
│   │   └── video1.mp4
│   └── commissioned/
│       └── video1.mp4
└── ...
```

## Launching the Website

### Option 1: Local Testing

Simply open `index.html` in your web browser to test locally.

### Option 2: Using a Local Server (Recommended)

For better video playback and testing:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server
```

Then visit `http://localhost:8000` in your browser.

### Option 3: Deploy Online

You can deploy this website to:
- **Netlify**: Drag and drop your folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to a GitHub repo and enable Pages
- **AWS S3**: Upload as a static website

## Customization

### Colors

To change the color scheme, edit these CSS variables in `styles.css`:

```css
:root {
    --primary-black: #000000;
    --secondary-black: #0a0a0a;
    --accent-white: #ffffff;
    --overlay-black: rgba(0, 0, 0, 0.5);
}
```

### Animations

All animations are controlled in `script.js`. You can adjust:
- Scroll animation speeds
- Parallax intensity
- Fade-in delays
- Card hover effects

### Typography

To change fonts, update the `font-family` in `styles.css`:

```css
body {
    font-family: 'Your-Font', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}
```

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Performance Tips

1. **Optimize Images**: Compress images before uploading (recommended: WebP format)
2. **Video Compression**: Keep hero video under 10MB for faster loading
3. **Lazy Loading**: Already implemented for gallery images
4. **Image Dimensions**: Recommended aspect ratio: 3:4 for gallery items

## Troubleshooting

### Video Not Playing
- Check video format (MP4 is most compatible)
- Ensure video path is correct
- Try a different browser

### Animations Not Working
- Clear browser cache
- Check JavaScript console for errors
- Ensure script.js is loading properly

### Images Not Showing
- Verify file paths are correct
- Check image file names (case-sensitive)
- Ensure images are in the correct folder

## Credits

**Design & Development**: Custom portfolio website for Utkarsh Singh  
**Animations**: Vanilla JavaScript with Intersection Observer API  
**Typography**: Playfair Display & Cormorant Garamond (Google Fonts)  

## License

This website is created for Utkarsh Singh Photography Portfolio. All rights reserved.

---

**Need Help?** Check that all file paths are correct and assets are in place. Happy showcasing! 📸

