import khandlebars from "../common/scripts/khandlebars";

const main = async (): Promise<void> => {
  await khandlebars("../thegraph/subgraph.yaml_handlebar", "../thegraph/subgraph.yaml");
};

main().catch(console.error);
