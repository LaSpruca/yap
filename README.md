# Yap 
*Yet Another Pointless framework*

This is just a small little expirement to try and see if I can make some sort
of JS framework using Signals.

Example usage can be found in [main.ts](src/main.ts).

This is not a serious project, just something I wanted to try and make. 


## What can you do with yap?

The first thing that you should know about is the store.

```ts
import { create_store } from "yap";

const hello = create_store("World");

// Update the value of hello
hello("World");

// Get the value of hello
console.log(hello());
```

You can also use `create_effect` which will subscribe to all stores called within
it and run again

```ts
improt { create_store, create_effect } from "yap";

const a = create_store("a");

create_effect(() => console.log(a()));

a("b");
```

The following code will print `a`, `b`. This is because create effect runs your
effect when it's created to make sure it get setup correctly. Make sure that 
all stores you want to subscribe to are called during the first run, to make sure
that they are listened to. No, I have not added untracking yet lol.


