const makeSlug = require('slug');
const data = require('./ingredients.json');

const counts = data.reduce((acc, val) => {
  const slug = makeSlug(
    val.title,
    { trim: true, replacement: '_' },
  );

  acc[slug] = Object.prototype.hasOwnProperty(acc, slug) ? acc[slug] + 1 : 1;

  return acc;
}, {});

console.log(Object.entries(counts).forEach(a => {
  if (a[1] > 1) {
    console.log(a);
  }
}));
