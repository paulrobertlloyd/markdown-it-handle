# markdown-it-handle · [![test](https://github.com/paulrobertlloyd/markdown-it-handle/actions/workflows/test.yml/badge.svg)](https://github.com/paulrobertlloyd/markdown-it-handle/actions/workflows/test.yml)

Link to users on social networks using [`markdown-it`](https://github.com/markdown-it/markdown-it) and the `@username@host` handle format used by networks that use ActivityPub, such as Mastodon.

You can also link to users on social networks that use the [AT Protocol](https://atproto.com), such as Bluesky. In this instance, handles follow the `@username.host` format, where `host` is a personal data server (PDS).

## Requirements

Node.js v22 or later.

## Installation

`npm install markdown-it-handle`

## Usage

```js
import markdownit from "markdown-it";
import handle from "markdown-it-handle";

const md = markdownit();

md.use(handle);
```

### ActivityPub

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

### AT Protocol

This plugin converts the format used for username handles used by the AT Protocol into linked usernames.

For example, given this Markdown:

```md
@paulrobertlloyd.com but not @paulrobertlloyd.bsky.social.
```

the following markup will be generated:

```html
<p><a href="https://bsky.app/profile/paulrobertlloyd.com" rel="external">@paulrobertlloyd.com</a> but not <a href="https://bsky.app/profile/paulrobertlloyd.bsky.social" rel="external">@paulrobertlloyd.bsky.social</a>.</p>
```

Syndicated text containing handles can get parsed as mentions by an AT Protocol application, while readable link text is shown to readers on your own website.

The default AT Protocol application is `bsky.app`, but you can override this behaviour value using the `atProto.app` option.

## Options

### Link attributes

By default, links include a `rel="external"` attribute. To override this behaviour, set the `attributes` option to `false`:

```js
md.use(handle, {
  attributes: false,
});

marked("@username@social.example");
```

This will output:

```html
<p><a href="https://social.example/@username">@username</a></p>
```

You can add or update attributes used on handle links by providing them in the `attributes` option:

```js
md.use(handle, {
  attributes: {
    class: "handle",
    rel: "external nofollow",
    target: "_blank",
  },
});

marked("@username@social.example");
```

This will output:

```html
<p><a href="https://social.example/@username" class="handle" rel="external nofollow" target="_blank">@username</a></p>
```

### URL prefixes

Most federated networks include the `@` symbol in profile URLs but older and non-federated networks do not. Meanwhile, some networks use a common path for user profiles. For example:

| Network  | Username URL format                  |
| -------- | ------------------------------------ |
| Mastodon | <https://server/@username>           |
| Twitter  | <https://twitter.com/username>       |
| Flickr   | <https://flickr.com/photos/username> |

By default, usernames are linked to URLs using first format using the `@` symbol. A list of common social networks that don’t use this format is provided in [/lib/prefixes.js](/lib/prefixes.js). These values can be overridden and extended.

For example, if you want a Flickr usernames to link to profile pages instead of photo pages, you can update the `prefixes` option as follows:

```js
md.use(handle, {
  prefixes: {
    "flickr.com": "people/",
  },
});

marked("@username@flickr.com");
```

This will output:

```html
<p><a href="https://flickr.com/people/username" rel="external">@username</a></p>
```

### AT Protocol AppView

By default, AT Protocol handles link to profile pages on [bsky.app](https://bsky.app).

You can change this value using the `atProto.app` option. You can also add a custom prefix if this application uses a different URL format for profile pages:

```js
md.use(handle, {
  atProto: {
    app: "example.app"
  },
  prefixes: {
    "example.app": "users/",
  },
});

marked("@username.bsky.social");
```

This will output:

```html
<p><a href="https://example.app/users/@username.bsky.social" rel="external">@username.bsky.social</a></p>
```

## Releasing new versions

The recommended way to release new versions of this package is using [`np`](https://github.com/sindresorhus/np). This can be run using the following command:

```shell
npm run release
```

## Credits

Inspired by an original idea by [Cédric Aellen](https://alienlebarge.ch/notes/20230326175845/).
