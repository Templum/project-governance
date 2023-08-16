import { getInput, setFailed, setOutput } from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function main() {
  try {
    const accessToken = getInput('GITHUB_TOKEN');
    const { owner, repo } = context.repo;
    const issue = context.payload?.issue?.number ?? -1;

    // Url is taken based on GITHUB_API_URL
    const client = getOctokit(accessToken);

    const { data } = await client.rest.issues.createComment({
      issue_number: issue,
      owner,
      repo,
      body: `An friendly hello from ${context.action} and thanks for raising a PR.`,
    });

    setOutput('comment-id', data.id);
  } catch (error) {
    const reason =
      error instanceof Error
        ? error
        : typeof error?.toString() === 'function'
        ? error.toString()
        : 'Unknown issue occurred';

    setFailed(reason);
  }
}

main();
