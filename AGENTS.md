# Orchard UI Codex Agent Instructions

This AGENTS.md provides guidance for using Codex (or similar AI assistants) with the **orchard-ui** repository. Follow these instructions to run tests, lint, format code, and create pull requests that comply with the project’s CI and style conventions.

## Running Tests (Vitest)

This project uses Vitest for unit tests. The `test` script in *package.json* is defined as `vitest run`. To execute all tests, run:

```
run: yarn test
```

The README shows running tests via `yarn test`. The above command runs the Vitest runner over the codebase and reports any test failures. Ensure all tests pass before committing.

## Running Linters (ESLint)

Code linting is handled by ESLint. The `lint` script is set to run `eslint .`. To check the codebase for lint errors, run:

```
run: yarn lint
```

This will use the ESLint configuration in `eslint.config.mjs`, which includes the recommended JavaScript and TypeScript rules and ignores the `dist/` folder. Fix any reported issues or formatting problems. (You can optionally add `--fix` to auto-apply safe fixes, e.g. `yarn lint --fix`.)

## Code Formatting

This project uses Prettier for code formatting. The `format` script runs `prettier --write .`, using the shared Prettier config (`@smolpack/prettier-config`) specified in *package.json*. To auto-format all source files, run:

```
run: yarn format
```

This will reformat code according to the project’s style rules. Running this before commits ensures consistent formatting.

## Pull Request Guidelines

When creating pull requests, follow these conventions:

* **Title:** Use a concise, imperative title summarizing the change (e.g. “Add home-view strategy” or “Fix bug in floor-view”).
* **Description:** In the PR body, clearly explain *what* was changed and *why*, referencing any relevant issues (e.g. “Closes #123”). Provide context or screenshots if needed.
* **Formatting:** Follow existing commit/PR style. Prefer present-tense or imperative mood (e.g. “Fix…” not “Fixed…”).
* **Standards:** Ensure your changes adhere to the project’s coding standards (see ESLint/Prettier rules above).

These instructions about PR titles and messages align with the Codex AGENTS.md specification, which advises including clear PR guidelines for agents.

## Continuous Integration (GitHub Actions)

The repository uses GitHub Actions for CI (`.github/workflows/node.js.yml`). On pushes or PRs to `main`, it runs tests on Node.js versions 18.x, 20.x, and 22.x. The key steps are:

```
run: yarn install
run: yarn lint
run: yarn test
run: yarn run build
```

These commands install dependencies, run linting, execute tests, and build the production bundle. (The `build` script uses Rslib: `rslib build`.) Codex should replicate this sequence to ensure compatibility. In practice, just running `yarn build` after tests is sufficient to verify CI will pass.  Always ensure all CI steps succeed locally (or via the Codex sandbox) before finalizing a change.

**Sources:** The instructions above are based on the project’s configuration and CI workflows. See *package.json* and *README* for scripts, the ESLint config, and the GitHub Actions YAML files. These references show exactly how to run and format code in this repo.
