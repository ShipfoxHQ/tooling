# Shipfox tooling

This monorepo includes all the tooling and common libraries used in the various [Shipfox](https://www.shipfox.io/) projects.

## Setup

### Development environment

We use [Nix](https://nixos.org/), more especially [Nix flakes](https://zero-to-nix.com/concepts/flakes). It is a cross-platform package management tool. Using it you get a consistent environment across development (on both Linux and Mac), CI, and production. To familiarize yourself with Nix, we recommend using the [Zero to Nix guide](https://zero-to-nix.com/).

Install the [Determinate Systems Nix Installer](https://github.com/DeterminateSystems/nix-installer) that feature Flakes and macOS upgrade resilience. Use the recommended curl command.

We then use [direnv](https://direnv.net/) to automatically setup the `Nix` environment directly in this repository when you navigate with your shell. Follow the [direnv setup](https://github.com/direnv/direnv?tab=readme-ov-file#basic-installation).

Once setup enable `direnv` in this repository. Open a new terminal and navigate to this directory.

```bash
# This step can be a bit slow as it pulls all the tooling
# However once done, you're ready to go !
direnv allow
```

### Development dependencies

We use [pnpm](https://pnpm.io/) as package manager, it is automatically installed by `Nix`.

Install development dependencies.

`pnpm install`

## Run

We use [Turborepo](https://turbo.build/) as a task manager for the monorepo. Therefore all commands can be triggered through it.

`pnpm turbo {command}`

Example: `pnpm turbo build`

Common commands

- `build`: Builds the package
- `check`: Runs linting / style checking
- `test`: Runs the test suite of the package
- `type`: Ensures type checking passes and generates type definitions when needed
