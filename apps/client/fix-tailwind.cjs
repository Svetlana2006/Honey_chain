const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/Svetlana/Honey_chain/client/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  
  // Replace arbitrary color vars with standard classes
  // e.g. text-[color:var(--color-primary)] -> text-primary
  content = content.replace(/\[color:var\(--color-([a-zA-Z0-9\-]+)\)\]/g, '$1');

  if (content !== orig) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
