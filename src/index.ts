import { getInput, setFailed, setOutput } from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function main() {
  try {
    const accessToken = getInput('github-token');
    const { owner, repo } = context.repo;
    const issue = context.payload.issue?.number ?? context.payload.pull_request?.number ?? -1;

    if (issue === -1) {
      console.warn('Was not able to determine the related PR/Issue will perform NoOp');
      return;
    }

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
