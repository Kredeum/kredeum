import type { PDFDocumentProxy, PDFPageProxy, RenderParameters } from "pdfjs-dist/types/src/display/api";

import * as pdfjs from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { nftPin } from "@lib/nft/nft-uri";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// import * as path from "path";
// const pathToPdfJs = path.dirname(require.resolve("pdfjs-dist/package.json"));
const pathToPdfJs = "pdfjs-dist/";

const pdfjsGetDocument = async (data: Uint8Array): Promise<PDFDocumentProxy> => {
  const cMapUrl = `${pathToPdfJs}/cmaps/`;
  const cMapPacked = false;
  const standardFontDataUrl = `${pathToPdfJs}/standard_fonts/`;
  const document = await pdfjs.getDocument({ data, cMapUrl, cMapPacked, standardFontDataUrl }).promise;

  // const document = await pdfjs.getDocument({ data }).promise;
  console.log("pdfjsGetDocument ~ document:", document);
  return document;
};

const pdfjsGetPage = async (data: Uint8Array, numPage: number): Promise<PDFPageProxy> => {
  const document = await pdfjsGetDocument(data);

  return await document.getPage(numPage);
};

const pdfjsCrop = async (
  page: PDFPageProxy,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
  scale = 1.0
): Promise<Blob | undefined> => {
  const viewport = page.getViewport({ scale, offsetX, offsetY });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  await page.render(renderContext as unknown as RenderParameters).promise;

  const blob: Blob = await new Promise((resolve) => canvas.toBlob(resolve));
  return blob;
};

const pdfCropPng = async (chainId: number, pdfUrl: string): Promise<string> => {
  const pdfUri = await nftPin(chainId, pdfUrl);

  const response = await fetch(pdfUri);
  const arrayBuffer = await response.arrayBuffer();
  const pdfUint8Array = new Uint8Array(arrayBuffer);

  const page = await pdfjsGetPage(pdfUint8Array, 1);

  const pngImage = await pdfjsCrop(page, 437, 437, -89, -179);
  const pngUri = pngImage ? await nftPin(chainId, pngImage) : "";

  page.cleanup();

  return pngUri;
};

export { pdfCropPng };
