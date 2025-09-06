/**
 * Joke
 */
const { joke } = await (
    await fetch("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
    })
).json();
export default `## Joke of the Day\n\n${joke}`;
