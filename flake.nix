{
  description = "Shipfox Monorepo Nix configuration file";

  # Flake inputs
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  # Flake outputs
  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let 
        pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };
      in
      {
        # Development environment output
        devShells =  {
          default = pkgs.mkShell {
            # The Nix packages provided in the environment
            packages = with pkgs; [
              # Node
              nodejs_22
              pnpm
            ];
          };
        };

        # run "nix build .#npackagesode.<ARCH>.node" where ARCH is any of the value returned by "nix flake show" (e.g. x86_64-linux)
        # to generate a derivation containing a symlink on the right version of node
        # the directory corresponding to the derivation is accessible through the symlink ./result
        packages = {
          node = pkgs.stdenv.mkDerivation {
            name = "node";
            src = ./.;
            buildPhase = ''
              mkdir -p $out
              {
              echo '#!/bin/sh
              ${pkgs.nodejs_22}/bin/node "$@"'
              } > $out/node
              chmod +x $out/node
            '';
          }; 
        };
      }
    );
}
