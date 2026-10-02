const fs = require('fs');
let schema = fs.readFileSync('server/prisma/schema.prisma', 'utf8');

const mapName = (name) => {
  let snake = name.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  if(snake.startsWith('_')) snake = snake.slice(1);
  if(snake.endsWith('s') || snake.endsWith('data')) {
     return 'codefolio_' + snake; 
  }
  return 'codefolio_' + snake + 's';
};

let newSchema = schema.replace(/model\s+(\w+)\s+\{([\s\S]*?)\}/g, (match, modelName, body) => {
  const mapped = mapName(modelName);
  let newBody = body.trimEnd();
  newBody += `\n\n  @@map("${mapped}")\n`;
  return `model ${modelName} {${newBody}}`;
});

fs.writeFileSync('server/prisma/schema.prisma', newSchema);
console.log('Done mapping models!');
