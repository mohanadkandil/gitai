#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import inquirer from "inquirer";
import fetch from "node-fetch";
import { createSpinner } from "nanospinner";

// OPENAI API Key
let OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// main commit function that sends the request to openai
async function generateCommitMessage(prompt: string) {
  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: false,
    n: 1,
  };

  const response = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY ?? null}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  const generatedCommit = json.choices[0].text;

  return generatedCommit.replace(/(\r\n|\n|\r)/gm, "");
}

export async function main() {
  console.log(chalk.green("Welcome to gitai CLI!"));

  if (!OPENAI_API_KEY) {
    console.error(
      chalk.red(
        "Please set OPENAI_API_KEY in your environment by 'export OPENAI_API_KEY=YOUR_KEY'"
      )
    );
    process.exit(1);
  }

  // check if this is a git repository
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      encoding: "utf8",
      stdio: "ignore",
    });
  } catch {
    console.error(chalk.red("This is not a git repository."));
    process.exit(1);
  }

  const diff = execSync(
    'git diff --cached . ":(exclude)package-lock.json" ":(exclude)yarn.lock" ":(exclude)pnpm-lock.yaml"',
    {
      encoding: "utf8",
    }
  );

  // check if there's not staged changes
  if (!diff) {
    console.log(
      chalk.white(
        "No staged changes found. Make sure there are changes and run `git add .`"
      )
    );
    process.exit(1);
  }

  // check if there's too many changes, which may cause the API to fail (openai) max 8k chars
  if (diff.length > 80000) {
    console.log(
      chalk.white("Too many changes, please commit in smaller chunks")
    );
    process.exit(1);
  }

  // collect diff with prompt
  let prompt = `I want you to act like a git commit message writer. I will input a git diff and your job is to convert it into a useful commit message. Do not preface the commit with anything, return a complete sentence, and do not repeat yourself: ${diff}`;

  console.log(chalk.white("Generating commit message..."));

  // generate commit message
  const generatedCommit = await generateCommitMessage(prompt);

  console.log(
    chalk.bold("Generated commit message: ") + generatedCommit + "\n"
  );

  const commitConfirmation = async () => {
    const answer = await inquirer.prompt([
      {
        name: "commit",
        message: "Would you like to commit this message? (Y / n)",
        choices: ["Y", "y", "n"],
        default: "y",
      },
    ]);

    return handleAnswer(answer.commit === "n");
  };

  // handling answer function that will wait for 2 secs and get the message if the commit is confirmed or not
  const handleAnswer = async (isCorrect) => {
    const spinner = createSpinner("Committing...");
    spinner.start();

    if (isCorrect) {
      spinner.error({ text: "Commit cancelled" });
      process.exit(1);
    } else {
      spinner.success({ text: "Committing..." });
      execSync(`git commit -m "${generatedCommit}"`);
    }
  };

  // if the commit message is not empty, ask for confirmation and commit
  if (generatedCommit !== "") await commitConfirmation();
}
