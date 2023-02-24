<div align="center">
  <div>
    <img src=".github/gitai.png" alt="gitai"/>
    <h1 align="center">gitAI</h1>
  </div>
	<p>A CLI that writes your git commits with AI</p>
	<a href="https://www.npmjs.com/package/gitai"><img src="https://img.shields.io/npm/v/gitai" alt="Current version"></a>
</div>

## Setup

> The minimum supported version of Node.js is the latest v14. Check your Node.js version with `node --version`.

1. Install _gitai_:

   ```sh
   npm install -g gitai
   ```

2. Retrieve your API key from [OpenAI](https://platform.openai.com/account/api-keys)

   > Note: If you haven't already, you'll have to create an account and set up billing.

3. Set the key so aicommits can use it:

   ```sh
   set OPENAI_API_KEY=<your openai token>
   ```

4. Start committing!

   Go make some changes in any Git repo, stage them, and just run `gitai`, and see your AI generated commit message!]

## About the Tool

This CLI tool harnesses the power of OpenAI's GPT-3 to automatically generate commit messages for your latest code changes. By running git diff, the tool gathers all of the relevant changes and sends them to GPT-3 for analysis. The resulting message is returned to you, allowing you to quickly and easily document your code changes without the hassle of manual writing.

## Future tasks

- Add multiple commit messages
- Generate Conventional Commits
- Add gitemoji (optional) for users
- Use more accurate openAI model
