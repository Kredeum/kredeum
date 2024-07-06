import {
  // ApplicationAccessTokenService,
  PersonalAccessTokenService,
  FleekSdk
} from "@fleek-platform/sdk";

type FileLike = {
  name: string;
  stream: () => ReadableStream;
};

const main = async () => {
  const token = new PersonalAccessTokenService({
    projectId: "",
    personalAccessToken: ""
  });

  const sdk = new FleekSdk({
    accessTokenService: token
  });

  // const projects = await sdk.projects().list();
  // console.log("projects:", projects);

  // const files = await sdk.storage().list();
  // console.log("files:", files);

  const stringToReadableStream = (str: string): ReadableStream => {
    return new ReadableStream({
      start(controller) {
        controller.enqueue(str);
        controller.close();
      }
    });
  };

  const file: FileLike = {
    name: "hellow",
    stream: () => stringToReadableStream("Bonjour, world!")
  };

  const result = await sdk.storage().uploadFile({ file });
  console.log("pin:", result);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
