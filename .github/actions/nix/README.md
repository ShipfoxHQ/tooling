# Nix GitHub Action

Action to setup Nix based dependencies with caching

```yaml
jobs:
  my_job:
    steps:
      - name: Install Nix dependencies
        uses: './.github/actions/nix'
```
