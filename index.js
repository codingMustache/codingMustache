import { writeFile, appendFile } from "node:fs/promises";

try {
    const req = await fetch("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
    });
    const { joke } = await req.json();

    const template = `
Hello I'm Jorge and I love making things on the internet


**Joke of the day:**    ${joke}
`;
    await appendFile("README.md", template, { flag: "w+" });
    console.log(joke);
} catch (e) {
    console.error();
}
