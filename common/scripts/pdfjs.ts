import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

import { GlobalWorkerOptions, getDocument, PageViewport } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface RenderParameters {
  canvasContext: CanvasRenderingContext2D;
  viewport: PageViewport;
}

const pdfjsGetDocument = async (data: ArrayBuffer): Promise<PDFDocumentProxy> => {
  const document = await getDocument({ data }).promise;

  return document;
};

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
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
