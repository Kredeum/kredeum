// import type { PDFDocumentProxy, PDFPageProxy, RenderParameters } from "pdfjs-dist/types/src/display/api";

// // import * as pdfjs from "pdfjs-dist/build/pdf";
// import * as pdfjs from "pdfjs-dist";
// // import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// // import * as path from "path";
// // const pathToPdfJs = path.dirname(require.resolve("pdfjs-dist/package.json"));
// const pathToPdfJs = "pdfjs-dist/";

// const pdfjsGetDocument = async (data: Uint8Array): Promise<PDFDocumentProxy> => {
//   const cMapUrl = `${pathToPdfJs}/cmaps/`;
//   const cMapPacked = false;
//   const standardFontDataUrl = `${pathToPdfJs}/standard_fonts/`;
//   const document = await pdfjs.getDocument({ data, cMapUrl, cMapPacked, standardFontDataUrl }).promise;

//   // const document = await pdfjs.getDocument({ data }).promise;
//   console.log("pdfjsGetDocument ~ document:", document);
//   return document;
// };

// const pdfjsGetPage = async (data: Uint8Array, numPage: number): Promise<PDFPageProxy> => {
//   const document = await pdfjsGetDocument(data);

//   return await document.getPage(numPage);
// };

// const pdfjsCrop = async (
//   page: PDFPageProxy,
//   width: number,
//   height: number,
//   offsetX: number,
//   offsetY: number,
//   scale = 1.0
// ): Promise<Blob | undefined> => {
//   const viewport = page.getViewport({ scale, offsetX, offsetY });

//   const canvas = document.createElement("canvas");
//   canvas.width = width;
//   canvas.height = height;
//   const context = canvas.getContext("2d");
//   const renderContext = {
//     canvasContext: context,
//     viewport: viewport
//   };

//   await page.render(renderContext as unknown as RenderParameters).promise;

//   const blob: Blob = await new Promise((resolve) => canvas.toBlob(resolve));
//   return blob;
// };
import type { PDFDocumentProxy, PDFPageProxy, RenderParameters } from "pdfjs-dist/types/src/display/api";

import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// interface RenderParameters {
//   canvasContext: CanvasRenderingContext2D;
//   viewport: pdfjsLib.PageViewport;
// }

const pdfjsGetDocument = async (data: ArrayBuffer): Promise<PDFDocumentProxy> => {
  const document = await pdfjsLib.getDocument({ data }).promise;

  return document;
};

const pdfjsGetPage = async (pdfUrl: string, numPage: number): Promise<PDFPageProxy | undefined> => {
  const response = await fetch(pdfUrl);
  const pdfArrayBuffer = await response.arrayBuffer();

  const document = await pdfjsGetDocument(pdfArrayBuffer);
  const page = await document.getPage(numPage);

  return page;
};

async function pdfjsCrop(
  page: PDFPageProxy,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
  scale = 1.0
): Promise<string | undefined> {
  const viewport = page.getViewport({ scale, offsetX, offsetY });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) return;

  const renderContext: RenderParameters = {
    canvasContext: context,
    viewport: viewport
  };

  await page.render(renderContext).promise;

  const base64Image = canvas.toDataURL("image/png");

  return base64Image;
}

export { pdfjsGetDocument, pdfjsGetPage, pdfjsCrop };
