**WHY WOULD YOU DO THIS??**

First off, I do not take forking lightly. Some look down on this with questions like "why did you have to do this?", which can lead to people getting upset. I get it, but I'm not concerned with that. This is only a project for me and if anyone finds it interesting, great. If not, CCXT is your jam, no hurt feelings. Seriously, just use CCXT.

I have built a product that uses CCXT and the work that team has put in has been greatly appreciated. In fact, I followed CCXT for years waiting for the day I could transition my code base which was previously built in Java to JS - just so I could use CCXT. 

That day arrived in 2023 and so a friend and myself began the process of a rewrite. During this rewrite I had to dig into the CCXT code and saw some things that weren't 'pure' JS in nature. This was fine since they have different goals for transpiling to other languages. I also knew with this, that changes must be made in order to accommodate those other languages that JS could just do easier or better. On top of it, when there was issues, I saw the transition away from most JS to mostly Python and non-JS example. My product is not Python or PHP or C# and I wanted solutions for the language my product is built with.

Which leads me to Typescript. I'm not a fan. I moved away from Java for a number of reasons and I'm not concerned with type safety in JS. So one final goal will be to remove all the TS overhead out and get back to pure JS only. There are those that love TS, that swear by it. I've been around long enough to understand the reasons for it, but I just don't really care that much. All I can say is, meh.
So, if this horrifies you, again, CCXT is your jam.

Finally, the biggest reason is I just want a singular focus on pure JS only. I will keep the esm and cjs parts since I eventually see the Node universe moving to esm (who knows when). However, since Node is still primarily CJS, that will be my focus. I just have one goal: pure JS in a Node environment. No browser or anything else will be considered.