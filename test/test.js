import {describe} from 'mocha';
import markdownit from 'markdown-it'
import testGenerator from 'markdown-it-testgen';
import handle from '../index.js'

describe('Converts handles to links', () => {
  const md = markdownit()
  md.use(handle);

  testGenerator('./test/fixtures/handle.txt', md);
});

describe('Converts handles to links using specified prefix', () => {
  const md = markdownit()
  md.use(handle);

  testGenerator('./test/fixtures/handle-custom-prefix.txt', md);
});

describe('Converts handles to links with optional attributes', () => {
  const md = markdownit()
  md.use(handle, {
    attributes: {
      rel: 'nofollow',
    },
  });

  testGenerator('./test/fixtures/option-attributes.txt', md);
});

describe('Converts handles to links with no additional attributes', () => {
  const md = markdownit()
  md.use(handle, {
    attributes: false,
  });

  testGenerator('./test/fixtures/option-attributes-false.txt', md);
});

describe('Converts handles to links with many additional attributes', () => {
  const md = markdownit()
  md.use(handle, {
    attributes: {
      class: 'handle',
      rel: 'external nofollow',
      target: '_blank',
    },
  });

  testGenerator('./test/fixtures/option-attributes-many.txt', md);
});

describe('Converts handles to links using prefixes option', () => {
  const md = markdownit()
  md.use(handle, {
    prefixes: {
      'flickr.com': 'people/',
    },
  });

  testGenerator('./test/fixtures/option-prefixes.txt', md);
});

describe('Converts handles to links with linkify enabled', () => {
  const md = markdownit({
    linkify: true,
  })
  md.use(handle);

  testGenerator('./test/fixtures/handle-linkify.txt', md);
});
