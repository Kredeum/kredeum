import type { Canvas, CanvasRenderingContext2D } from "canvas";
import { createCanvas } from "canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.js";
import fs from "fs";

type CanvasAndContextType = {
  canvas: Canvas;
  context: CanvasRenderingContext2D;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/ban-types
const NodeCanvasFactory = () => {};

NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width: number, height: number): CanvasAndContextType {
    if (!(width > 0 && height > 0)) throw new Error("Invalid canvas size");

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return { canvas, context };
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext: CanvasAndContextType, width: number, height: number): void {
    if (!canvasAndContext.canvas) throw new Error("Canvas is not specified");
    if (!(width > 0 && height > 0)) throw new Error("Invalid canvas size");

    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext: CanvasAndContextType): void {
    if (!canvasAndContext.canvas) throw new Error("Canvas is not specified");

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
};

// Some PDFs need external cmaps.
const CMAP_URL = "./node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;

// Where the standard fonts are located.
const STANDARD_FONT_DATA_URL = "./node_modules/pdfjs-dist/standard_fonts/";

const canvasFactory = {};

const pdfPath = "pdf/WP.pdf";
const pngPath = "png/WP.png";
const data = new Uint8Array(fs.readFileSync(pdfPath));

// Load the PDF file.
const loadingTask = getDocument({
  data,
  cMapUrl: CMAP_URL,
  cMapPacked: CMAP_PACKED,
  standardFontDataUrl: STANDARD_FONT_DATA_URL,
  canvasFactory
});

const main = async () => {
  const pdfDocument = await loadingTask.promise;
  console.log("# PDF document loaded.");
  // Get the first page.
  const page = await pdfDocument.getPage(1);
  // Render the page on a Node canvas with 100% scale.
  const viewport = page.getViewport({
    scale: 1.0,
    offsetX: -89,
    offsetY: -179
  });
  const canvasAndContext: CanvasAndContextType = canvasFactory.create(437, 437) as CanvasAndContextType;
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport
  };

  const renderTask = page.render(renderContext);
  await renderTask.promise;
  // Convert the canvas to an image buffer.
  const image = canvasAndContext.canvas.toBuffer();
  fs.writeFile(pngPath, image, function (error) {
    if (error) {
      console.error(`Error: ${error.toString()}`);
    } else {
      console.log("Finished converting first page of PDF file to a PNG image.");
    }
  });
  // Release page resources.
  page.cleanup();
};

main().catch(console.error);
