const fs = require('fs');
const path = require('path');

module.exports = {
  get: (pagePath) => {
    if (pagePath.slice(-1) != '/') pagePath += '/';
    let files = fs.readdirSync(pagePath);
    files = files.filter((file) => {
      if (file == '_app.ts') return false;
      const stat = fs.lstatSync(pagePath + file);
      return stat.isFile();
    });

    const paths = files.map((file) => {
      if (file == 'index.tsx') {
        return {
          link: '',
          name: 'Home'
        };
      } else {
        const link = path.parse(file).name;
        const capitalized = link.charAt(0).toUpperCase() + link.slice(1);
        return {
          link: link,
          name: capitalized
        };
      }
    });
    return paths;
  }
};
