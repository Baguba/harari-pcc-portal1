const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.json') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
      .replace(/Ministry of Communication and Information Technology/g, "Innovation and Technology Agency")
      .replace(/Ministry of Communication/g, "Innovation and Technology Agency")
      .replace(/MCIT/g, "PCC")
      .replace(/mcit\.gov\.et/g, "pcc.gov.et")
      .replace(/mcit-portal/g, "pcc-portal");
      
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Updated ' + filePath);
    }
  }
});
