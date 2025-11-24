const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing index.html for Cordova...');

const indexPath = path.join(__dirname, '..', 'www', 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found at:', indexPath);
  console.log('📁 Looking for files in www directory:');
  const wwwPath = path.join(__dirname, '..', 'www');
  if (fs.existsSync(wwwPath)) {
    console.log(fs.readdirSync(wwwPath));
  } else {
    console.log('❌ www directory does not exist');
  }
  process.exit(1);
}

let indexContent = fs.readFileSync(indexPath, 'utf8');

console.log('📝 Original base href found:', indexContent.includes('<base href="/">') ? 'YES' : 'NO');

// Fix base href for Cordova
if (indexContent.includes('<base href="/">')) {
  indexContent = indexContent.replace('<base href="/">', '<base href="./">');
  console.log('✅ Base href changed to "./"');
} else {
  console.log('ℹ️ Base href already correct or not found');
}

// Add Cordova script if not present
if (!indexContent.includes('cordova.js')) {
  indexContent = indexContent.replace(
    '</body>',
    '  <script src="cordova.js"></script>\n</body>'
  );
  console.log('✅ Cordova script added');
} else {
  console.log('ℹ️ Cordova script already present');
}

// Add CSP meta tag if not present
if (!indexContent.includes('Content-Security-Policy')) {
  const csp = '    <meta http-equiv="Content-Security-Policy" content="default-src \'self\' data: gap: https://ssl.gstatic.com https://*.googleapis.com https://*.google.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.firebaseinstallations.googleapis.com https://*.firebaseapp.com \'unsafe-eval\' \'unsafe-inline\'; connect-src \'self\' https://*.googleapis.com https://*.google.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.firebaseinstallations.googleapis.com https://*.firebaseapp.com; style-src \'self\' \'unsafe-inline\'; media-src *; img-src \'self\' data: content:; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\';">';
  indexContent = indexContent.replace(
    '</head>',
    csp + '\n  </head>'
  );
  console.log('✅ CSP meta tag added');
} else {
  console.log('ℹ️ CSP meta tag already present - replacing with updated version');
  // Replace existing CSP with updated one
  const csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' data: gap: https://ssl.gstatic.com https://*.googleapis.com https://*.google.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.firebaseinstallations.googleapis.com https://*.firebaseapp.com \'unsafe-eval\' \'unsafe-inline\'; connect-src \'self\' https://*.googleapis.com https://*.google.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.firebaseinstallations.googleapis.com https://*.firebaseapp.com; style-src \'self\' \'unsafe-inline\'; media-src *; img-src \'self\' data: content:; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\';">';
  indexContent = indexContent.replace(
    /<meta\s+http-equiv="Content-Security-Policy"[^>]*>/,
    csp
  );
  console.log('✅ CSP meta tag updated');
}

fs.writeFileSync(indexPath, indexContent);
console.log('🎉 Cordova configuration completed!');