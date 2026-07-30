---
title: "Building my Portfolio"
description: "How I rebuilt my personal site to feel more like a place for work in progress."
date: 2026-07-27
draft: false
---

I wanted a website that actually felt personal.

Not a template or a copy paste design, but a place that represents what I build and how I think. This post is also a living test of the blog's Markdown toolkit.

## Why Astro?

Astro is one of the frameworks I enjoy because it ships less JavaScript and makes static pages fast by default.[^performance]

Some things I like about Astro:

- Component based architecture
- Content collections
- Static generation
- A great developer experience

You can learn more in the [Astro documentation](https://astro.build).

---

## Writing with intent

Markdown supports **bold text**, *italics*, ***both together***, and ~~ideas that did not survive review~~.

Inline code stays readable too: `const site = "AarusPortfolio";`.

### Lists that stay organised

1. Decide what the page needs to say
2. Design the smallest useful system
3. Build the components
4. Write about what changed

- Frontend
  - Astro
  - TypeScript
  - CSS
- Backend
  - APIs
  - Databases

- [x] Create the content collection
- [x] Add code highlighting
- [ ] Publish the next devlog

#### A short note

Good structure is quiet. It makes the writing easier to follow without asking for attention.

> Good software is not just about writing code. It is about solving problems and creating experiences.

:::warning

Do not add a plugin just because it looks interesting. Every dependency should earn its place in the project.

:::

:::tip

Press :kbd[Ctrl] + :kbd[K] to keep a focused command palette within reach.

:::

---

## Code that reads like code

```ts
const siteName = "AarusPortfolio";
const stack = ["Astro", "TypeScript"];

export const description = `Building with ${stack.join(" and ")}.`;
console.log(siteName);
```

When a change is easier to understand as a diff, it should look like one:

```diff
- const theme = "plain";
+ const theme = "personal";
  const accent = "green";
```

| Choice | Why it matters |
| :-- | :-- |
| Content collections | Posts stay typed and organised |
| Static rendering | Pages stay quick to load |
| Shared components | The reading experience stays consistent |

![A certificate from a long learning sprint.](/images/certs/CS50P.png "A small milestone from the learning that shaped this site.")

---

## Keep improving

The goal is not to finish a portfolio once. It is to keep a useful record of the things worth learning, making, and revisiting.

[^performance]: Fast pages make it easier for the work itself to get attention.
