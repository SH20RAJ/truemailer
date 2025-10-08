const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Ensure directories exist
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Create base SVG for the logo
const createBaseSVG = (width, height) => `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" rx="${Math.min(width, height) * 0.125}" fill="#000000"/>
  <rect x="${width * 0.1}" y="${height * 0.1}" width="${width * 0.8}" height="${height * 0.8}" rx="${Math.min(width, height) * 0.08}" fill="#f5f5dc"/>
  
  <!-- Email envelope -->
  <rect x="${width * 0.25}" y="${height * 0.3}" width="${width * 0.5}" height="${height * 0.35}" rx="${Math.min(width, height) * 0.03}" fill="none" stroke="#000000" stroke-width="${Math.max(2, width * 0.008)}"/>
  <path d="M${width * 0.25} ${height * 0.35}l${width * 0.25} ${height * 0.2} ${width * 0.25} -${height * 0.2}" stroke="#000000" stroke-width="${Math.max(2, width * 0.008)}" fill="none"/>
  
  <!-- Checkmark circle -->
  <circle cx="${width * 0.65}" cy="${height * 0.55}" r="${Math.min(width, height) * 0.08}" fill="#000000"/>
  <path d="M${width * 0.6} ${height * 0.55}l${width * 0.03} ${width * 0.03} ${width * 0.06} -${width * 0.06}" stroke="#f5f5dc" stroke-width="${Math.max(2, width * 0.012)}" fill="none"/>
  
  ${width >= 256 ? `<text x="${width * 0.5}" y="${height * 0.85}" font-family="Arial, sans-serif" font-size="${Math.max(12, width * 0.06)}" font-weight="bold" text-anchor="middle" fill="#000000">TrueMailer</text>` : ''}
</svg>
`;

// Create Open Graph image
const createOGImage = (width, height, title, subtitle) => `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#000000"/>
  
  <!-- Background pattern -->
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  
  <!-- Main content area -->
  <rect x="80" y="120" width="${width - 160}" height="${height - 240}" rx="20" fill="#f5f5dc"/>
  
  <!-- Logo -->
  <rect x="120" y="180" width="120" height="120" rx="15" fill="#000000"/>
  <rect x="132" y="192" width="96" height="96" rx="12" fill="#f5f5dc"/>
  
  <!-- Email icon in logo -->
  <rect x="150" y="220" width="60" height="40" rx="4" fill="none" stroke="#000000" stroke-width="3"/>
  <path d="M150 230l30 20 30-20" stroke="#000000" stroke-width="3" fill="none"/>
  
  <!-- Checkmark -->
  <circle cx="190" cy="250" r="12" fill="#000000"/>
  <path d="M184 250l6 6 12-12" stroke="#f5f5dc" stroke-width="3" fill="none"/>
  
  <!-- Title -->
  <text x="280" y="220" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#000000">${title}</text>
  <text x="280" y="270" font-family="Arial, sans-serif" font-size="24" fill="#666666">${subtitle}</text>
  
  <!-- Features -->
  <text x="280" y="320" font-family="Arial, sans-serif" font-size="18" fill="#333333">✓ Real-time email validation</text>
  <text x="280" y="350" font-family="Arial, sans-serif" font-size="18" fill="#333333">✓ Disposable email detection</text>
  <text x="280" y="380" font-family="Arial, sans-serif" font-size="18" fill="#333333">✓ 99.9% accuracy guarantee</text>
  <text x="280" y="410" font-family="Arial, sans-serif" font-size="18" fill="#333333">✓ Easy API integration</text>
  
  <!-- URL -->
  <text x="${width / 2}" y="${height - 60}" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#f5f5dc">truemailer.strivio.world</text>
</svg>
`;

async function generateImages() {
  console.log('🎨 Starting image generation...');

  // Ensure directories exist
  await ensureDir('public/icons');
  await ensureDir('public/screenshots');

  // PWA Icon sizes
  const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

  console.log('📱 Generating PWA icons...');
  for (const size of iconSizes) {
    const svg = createBaseSVG(size, size);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(`public/icons/icon-${size}x${size}.png`);
    console.log(`✅ Generated icon-${size}x${size}.png`);
  }

  // Apple Touch Icon
  console.log('🍎 Generating Apple Touch Icon...');
  const appleSvg = createBaseSVG(180, 180);
  await sharp(Buffer.from(appleSvg))
    .png()
    .toFile('public/icons/apple-touch-icon.png');
  console.log('✅ Generated apple-touch-icon.png');

  // Favicon
  console.log('🔖 Generating favicon...');
  const faviconSvg = createBaseSVG(32, 32);
  await sharp(Buffer.from(faviconSvg))
    .png()
    .resize(32, 32)
    .toFile('public/favicon-32x32.png');

  await sharp(Buffer.from(faviconSvg))
    .png()
    .resize(16, 16)
    .toFile('public/favicon-16x16.png');

  // Create ICO file (simplified - just use 32x32)
  await sharp(Buffer.from(faviconSvg))
    .png()
    .resize(32, 32)
    .toFile('public/favicon.ico');
  console.log('✅ Generated favicon files');

  // Open Graph images
  console.log('🌐 Generating Open Graph images...');
  const ogSvg = createOGImage(1200, 630, 'TrueMailer', 'Professional Email Validation API');
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile('public/og-image.png');
  console.log('✅ Generated og-image.png');

  // Square OG image
  const ogSquareSvg = createBaseSVG(1200, 1200);
  await sharp(Buffer.from(ogSquareSvg))
    .png()
    .toFile('public/og-image-square.png');
  console.log('✅ Generated og-image-square.png');

  // Playground OG image
  const playgroundOgSvg = createOGImage(1200, 630, 'Email Playground', 'Interactive Testing Environment');
  await sharp(Buffer.from(playgroundOgSvg))
    .png()
    .toFile('public/og-playground.png');
  console.log('✅ Generated og-playground.png');

  // Safari Pinned Tab (SVG)
  console.log('🦁 Generating Safari pinned tab...');
  const safariSvg = `
<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <path d="M2 3h12v8H2V3zm1 1v6h10V4H3zm1 1h8v1H4V5zm0 2h8v1H4V7zm0 2h5v1H4V9z"/>
  <circle cx="12" cy="9" r="2"/>
  <path d="M11 9l1 1 2-2" stroke="white" stroke-width="0.5" fill="none"/>
</svg>
  `;
  await fs.writeFile('public/icons/safari-pinned-tab.svg', safariSvg.trim());
  console.log('✅ Generated safari-pinned-tab.svg');

  // Shortcut icons
  console.log('⚡ Generating shortcut icons...');
  const validateSvg = createBaseSVG(96, 96);
  await sharp(Buffer.from(validateSvg))
    .png()
    .toFile('public/icons/shortcut-validate.png');

  const docsSvg = createBaseSVG(96, 96);
  await sharp(Buffer.from(docsSvg))
    .png()
    .toFile('public/icons/shortcut-docs.png');
  console.log('✅ Generated shortcut icons');

  // Badge and notification icons
  console.log('🔔 Generating notification icons...');
  const badgeSvg = createBaseSVG(72, 72);
  await sharp(Buffer.from(badgeSvg))
    .png()
    .toFile('public/icons/badge-72x72.png');

  // Simple checkmark icon
  const checkmarkSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="48" cy="48" r="48" fill="#22c55e"/>
  <path d="M30 48l12 12 24-24" stroke="white" stroke-width="6" fill="none"/>
</svg>
  `;
  await sharp(Buffer.from(checkmarkSvg))
    .png()
    .toFile('public/icons/checkmark.png');

  // Simple X icon
  const xmarkSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="48" cy="48" r="48" fill="#ef4444"/>
  <path d="M36 36l24 24M60 36l-24 24" stroke="white" stroke-width="6"/>
</svg>
  `;
  await sharp(Buffer.from(xmarkSvg))
    .png()
    .toFile('public/icons/xmark.png');
  console.log('✅ Generated notification icons');

  // Screenshot placeholders
  console.log('📸 Generating screenshot placeholders...');
  const desktopScreenshot = `
<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#000000"/>
  <rect x="40" y="40" width="1200" height="640" rx="8" fill="#f5f5dc"/>
  <text x="640" y="200" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#000000">TrueMailer</text>
  <text x="640" y="250" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#666666">Professional Email Validation API</text>
  <rect x="440" y="300" width="400" height="50" rx="25" fill="#000000"/>
  <text x="640" y="330" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#f5f5dc">Get Started</text>
</svg>
  `;
  await sharp(Buffer.from(desktopScreenshot))
    .png()
    .toFile('public/screenshots/desktop-home.png');

  const mobileScreenshot = `
<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="390" height="844" fill="#000000"/>
  <rect x="20" y="60" width="350" height="724" rx="8" fill="#f5f5dc"/>
  <text x="195" y="150" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#000000">Email Playground</text>
  <rect x="40" y="200" width="310" height="40" rx="8" fill="#ffffff" stroke="#000000" stroke-width="1"/>
  <text x="50" y="225" font-family="Arial, sans-serif" font-size="14" fill="#666666">test@example.com</text>
  <rect x="40" y="260" width="310" height="40" rx="8" fill="#000000"/>
  <text x="195" y="285" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#f5f5dc">Validate</text>
</svg>
  `;
  await sharp(Buffer.from(mobileScreenshot))
    .png()
    .toFile('public/screenshots/mobile-playground.png');
  console.log('✅ Generated screenshot placeholders');

  console.log('🎉 All images generated successfully!');

  // List generated files
  console.log('\n📋 Generated files:');
  console.log('PWA Icons:', iconSizes.map(s => `icon-${s}x${s}.png`).join(', '));
  console.log('Favicons: favicon.ico, favicon-16x16.png, favicon-32x32.png');
  console.log('Apple: apple-touch-icon.png');
  console.log('Open Graph: og-image.png, og-image-square.png, og-playground.png');
  console.log('Safari: safari-pinned-tab.svg');
  console.log('Shortcuts: shortcut-validate.png, shortcut-docs.png');
  console.log('Notifications: badge-72x72.png, checkmark.png, xmark.png');
  console.log('Screenshots: desktop-home.png, mobile-playground.png');
}

generateImages().catch(console.error);