const {describe} = require('mocha');
const testGenerator = require('markdown-it-testgen');

describe('Converts handles to links', () => {
  const md = require('markdown-it')().use(require('../index.js'));

  testGenerator('./test/fixtures/handle.txt', md);
});

describe('Converts handles to links using specified prefix', () => {
  const md = require('markdown-it')().use(require('../index.js'));

  testGenerator('./test/fixtures/handle-custom-prefix.txt', md);
});

describe('Converts handles to links with optional attributes', () => {
  const md = require('markdown-it')().use(require('../index.js'), {
    attributes: {
      rel: 'nofollow',
    },
  });

  testGenerator('./test/fixtures/option-attributes.txt', md);
});

describe('Converts handles to links with no additional attributes', () => {
  const md = require('markdown-it')().use(require('../index.js'), {
    attributes: false,
  });

  testGenerator('./test/fixtures/option-attributes-false.txt', md);
});

describe('Converts handles to links with many additional attributes', () => {
  const md = require('markdown-it')().use(require('../index.js'), {
    attributes: {
      class: 'handle',
      rel: 'external nofollow',
      target: '_blank',
    },
  });

  testGenerator('./test/fixtures/option-attributes-many.txt', md);
});

describe('Converts handles to links using prefixes option', () => {
  const md = require('markdown-it')().use(require('../index.js'), {
    prefixes: {
      'flickr.com': 'people/',
    },
  });

  testGenerator('./test/fixtures/option-prefixes.txt', md);
});

describe('Converts handles to links with linkify enabled', () => {
  const md = require('markdown-it')({
    linkify: true,
  }).use(require('../index.js'));

  testGenerator('./test/fixtures/handle-linkify.txt', md);
});
