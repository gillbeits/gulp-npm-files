var fs = require('fs');

module.exports = function(devDependencies, packageJsonFilePath) {
  var buffer, packages, keys;
  
  buffer = fs.readFileSync(packageJsonFilePath || './package.json');
  packages = JSON.parse(buffer.toString());
  keys = [];
  
  for (key in packages.dependencies) {
    if (packages.overrides[key] && packages.overrides[key].main) {
      if (typeof packages.overrides[key].main == "string") {
        packages.overrides[key].main = [packages.overrides[key].main];
      }
      for (main in packages.overrides[key].main) {
        keys.push('./node_modules/' + key + '/' + packages.overrides[key].main[main]);
      }
    } else {
      keys.push('./node_modules/' + key + '/**/*');
    }
  }

  if (devDependencies) {
    for (key in packages.devDependencies) {
      keys.push('./node_modules/' + key + '/**/*');
    }
  }

  return keys;
};