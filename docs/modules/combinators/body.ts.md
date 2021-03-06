---
title: combinators/body.ts
nav_order: 2
parent: Modules
---

## body overview

`body` combinator: sets body on a `Req` and returns a `Req`.

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [withBody](#withbody)

---

# combinators

## withBody

Sets the provided `body` (automatically converted to string when JSON) on `Req` init object and returns the updated `Req`.

**Signature**

```ts
export declare function withBody<A>(body: unknown): (req: Req<A>) => Req<A>
```

Added in v3.0.0
