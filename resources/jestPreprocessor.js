// preprocessor.js
var fs = require('fs');
var path = require('path');
var typescript = require('typescript');
var react = require('react-tools');

var CACHE_DIR = path.join(path.resolve(__dirname + '/../build'));

function isFileNewer(a, b) {
  try {
    return fs.statSync(a).mtime > fs.statSync(b).mtime;
  } catch (ex) {
    return false;
  }
}

function compileTypeScript(filePath) {
  var options = {
    outDir: CACHE_DIR,
    noEmitOnError: true,
    target: typescript.ScriptTarget.ES5,
    module: typescript.ModuleKind.CommonJS
  };

  // re-use cached source if possible
  var outputPath = path.join(options.outDir, path.basename(filePath, '.ts')) + '.js';
  if (isFileNewer(outputPath, filePath)) {
    return fs.readFileSync(outputPath, {encoding: 'utf8'});
  }

  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }

  var host = typescript.createCompilerHost(options);
  var program = typescript.createProgram([filePath], options, host);
  var checker = typescript.createTypeChecker(program, /*fullTypeCheck*/ true);
  // resolver, host, targetSourceFile
  var result = program.emit();

  typescript.getPreEmitDiagnostics(program)
    .concat(checker.getDiagnostics())
    .concat(result.diagnostics)
    .forEach(function(diagnostic) {
      var lineChar = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      var message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.error('%s %d:%d %s', diagnostic.file.fileName, lineChar.line + 1, lineChar.character + 1, message);
    });

  var exitCode = result.emitSkipped ? 1 : 0;
  if (exitCode !== 0) {
    throw new Error('Compiling ' + filePath + ' failed');
  }

  return fs.readFileSync(outputPath, {encoding: 'utf8'});
}

module.exports = {
  process: function(src, filePath) {
    if (filePath.match(/\.ts$/) && !filePath.match(/\.d\.ts$/)) {
      return compileTypeScript(filePath);
    } else if (filePath.match(/\.js$/) && ~filePath.indexOf('/__tests__/')) {
      var result = react.transform(src, {harmony: true}).replace(
          /require\('immutable/g,
          "require('" + path.relative(path.dirname(filePath), process.cwd())
          );
      return result;
    }
    return src;
  }
};
