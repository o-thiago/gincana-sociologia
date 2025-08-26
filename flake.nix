{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nix-systems.url = "github:nix-systems/default";
  };

  outputs =
    {
      flake-parts,
      systems,
      ...
    }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import systems;
      perSystem =
        { pkgs, ... }:
        {
          devShells.default = pkgs.mkShell {
            packages = with pkgs; [
              bun
              biome
            ];
          };
        };
    };
}
