# Contributing

Thanks for improving Dependency Security Matrix Action.

## Development

```bash
npm ci
npm run check
```

The action is bundled into `dist/index.js`. After changing source files, run:

```bash
npm run build
```

Commit `dist/` changes with source changes so tagged action releases run the expected code.

## Pull Requests

- Keep changes focused.
- Add or update tests for behavior changes.
- Run `npm run check` before opening a PR.
- Update `README.md` when inputs, outputs, or behavior change.

## Release Notes

Use semantic versioning. Breaking changes require a new major tag.
