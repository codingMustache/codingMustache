const res = await fetch(
    "https://opentdb.com/api.php?amount=1&category=18&type=multiple",
);
const json = await res.json();
const { question, incorrect_answers, correct_answer } = json.results[0];
const ansArr = [...incorrect_answers, correct_answer]
    .sort(() => Math.random() - 0.5)
    .map((e, i) => ` ${i + 1}. ${e}\n`)
    .join("");
export default `
## Daily Trivia\n\n${question}\n${ansArr}
<details>
  <summary>Answer</summary>
  ${correct_answer}
</details>
`;
