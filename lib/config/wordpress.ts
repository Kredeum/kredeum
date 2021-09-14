import wordpressJson from "../../config/wordpress.json";

type WordPress = {
  version: { latest: string; stable: string };
};

const wordpress = wordpressJson as WordPress;

export { wordpress, WordPress };
