#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import inquirer from "inquirer";
import fetch from "node-fetch";

// OPENAI API Key
let OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function main() {
  console.log(chalk.green("Welcome to gitai CLI!"));

  if (!OPENAI_API_KEY) {
    console.error(
      chalk.red(
        "Please set OPENAI_API_KEY in your environment by 'export OPEN_API_KEY=YOUR_KEY'"
      )
    );
    process.exit(1);
  }
}
