# PNPM GitHub Action

Action to setup PNPM based dependencies with caching

```yaml
jobs:
  my_job:
    steps:
      - name: Install NodeJS dependencies
        uses: './.github/actions/pnpm'
```
