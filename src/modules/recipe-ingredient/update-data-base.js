const sqlite = require('sqlite3').verbose();
const makeSlug = require('slug');
const data = require('./ingredients.json');

function mysql_real_escape_string(str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
      default:
        return char;
    }
  });
}

const db = new sqlite.Database('./main_db.sqlite3');

const values = data
  .map(
    (item, index) =>
      `('${index}', '${mysql_real_escape_string(item.title)}', '${makeSlug(
        item.title,
        { trim: true, replacement: '_' },
      )}', '${item.validAmountTypes.join(',')}')`,
  )
  .join(', ');
const request = `INSERT INTO "recipe_ingredient_entity" ("id", "name", "slug", "amountTypes") VALUES ${values};`;

console.log(request);
db.run(request);

console.log(db.run('SELECT * FROM "recipe_ingredient_entity"'));

db.close();
