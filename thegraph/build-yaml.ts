import { runHandlebars } from "@utils/runHandlebars";

const main = async (): Promise<void> => {
  await runHandlebars(
    "../thegraph/subgraph.yaml_handlebar",
    "../thegraph/subgraph.yaml"
  );
};

main().catch(console.error);
