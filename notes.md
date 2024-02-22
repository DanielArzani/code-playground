# Code Playground

## Resources

[Joshua Comeau](https://www.joshwcomeau.com/react/next-level-playground/)
[Sandpack with Tailwind](https://www.tybarho.com/articles/tailwind-plus-sandpack-playground-component)
[Tutorial](https://davidmyers.dev/blog/how-to-build-a-code-editor-with-codemirror-6-and-typescript/introduction)

## Security Considerations

Rendering code directly into an iframe can pose security risks, especially if the code is not sanitized or comes from untrusted sources. Since your application is primarily for demonstration purposes on your blog, this might be less of a concern, but it's something to be aware of.

## Where I left off

- Have code from fancy-editor be connected to an iframe

- Add Html, css and js tabs (_perhaps where the top left buttons are_)

- Break up the fancy css into chunks since its too large and takes a while to save

- Look up how to use the sandbox attribute on the iframe for security reasons

## To Fix

- Each editor should be using the same number of lines, meaning, deleting one line in HTML should delete it in both css and js
