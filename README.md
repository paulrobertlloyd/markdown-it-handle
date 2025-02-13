# markdown-it-handle · [![test](https://github.com/paulrobertlloyd/markdown-it-handle/actions/workflows/test.yml/badge.svg)](https://github.com/paulrobertlloyd/markdown-it-handle/actions/workflows/test.yml)

Links to users across different social networks using [`markdown-it`](https://github.com/markdown-it/markdown-it) and the handle format `@username@host`.

## Requirements

Node.js v22 or later.

## Installation

`npm install markdown-it-handle`

## Usage

```js
import markdownit from 'markdown-it'
import handle from 'markdown-it-handle'

const md = markdownit()

md.use(handle)
```

This plugin converts the format used for username handles common to federated social networks, into linked usernames.

For example, given this Markdown:

```md
@paulrobertlloyd@micro.blog, @paulrobertlloyd@twitter.com and @paulrobertlloyd@mastadon.social.
```

the following markup will be generated (lines wrapped for clarity):

```html
<p>
  <a href="https://micro.blog/paulrobertlloyd" rel="external">@paulrobertlloyd</a>,
  <a href="https://twitter.com/paulrobertlloyd" rel="external">@paulrobertlloyd</a> and
  <a href="https://mastodon.social/@paulrobertlloyd" rel="external">@paulrobertlloyd</a>.
</p>
```

This can be particularly useful if you are syndicating plain-text posts using Markdown, but rendering them on your own site as HTML.

Syndicated text containing handles will get parsed as mentions by the federated server, while readable link text is shown to readers on your own website.

## Options

### Link attributes

By default, links include a `rel="external"` attribute. To override this behaviour, set the `attributes` option to `false`:

```js
md.use(handle, {
  attributes: false
})

marked('@username@social.example')
```

This will output:

```html
<p><a href="https://social.example/@username">@username</a></p>
```

You can add or update attributes used on handle links by providing them in the `attributes` option:

```js
md.use(handle, {
  attributes: {
    class: 'handle',
    rel: 'external nofollow',
    target: '_blank',
  }
})

marked('@username@social.example')
```

This will output:

```html
<p><a href="https://social.example/@username" class="handle" rel="external nofollow" target="_blank">@username</a></p>
```

### URL prefixes

Most federated networks include the `@` symbol in profile URLs but older and non-federated networks do not. Meanwhile, some networks use a common path for user profiles. For example:

| Network | Username URL format |
| - | - |
| Mastodon | <https://server/@username> |
| Twitter | <https://twitter.com/username> |
| Flickr | <https://flickr.com/photos/username> |

By default, usernames are linked to URLs using first format using the `@` symbol. A list of common social networks that don’t use this format is provided in [/lib/prefixes.js](/lib/prefixes.js). These values can be overridden and extended.

For example, if you want a Flickr usernames to link to profile pages instead of photo pages, you can update the `prefixes` option as follows:

```js
md.use(handle, {
  prefixes: {
    'flickr.com': 'people/',
  }
})

marked('@username@flickr.com')
```

This will output:

```html
<p><a href="https://flickr.com/people/username" rel="external">@username</a></p>
```

## Releasing new versions

The recommended way to release new versions of this package is using [`np`](https://github.com/sindresorhus/np). This can be run using the following command:

```shell
npm run release
```

## Credits

Inspired by an original idea by [Cédric Aellen](https://alienlebarge.ch/notes/20230326175845/).
