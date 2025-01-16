import { DOMParser } from "xmldom";

function parseFeColorMatrixTo1DArray(svgString: string): number[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "application/xml");
  const feColorMatrix = doc.getElementsByTagName("feColorMatrix")[0];

  if (!feColorMatrix) {
    throw new Error("No <feColorMatrix> found in the provided SVG string.");
  }

  const values = feColorMatrix.getAttribute("values");
  if (!values) {
    throw new Error("No 'values' attribute found in <feColorMatrix>.");
  }

  // Split the values string into an array of numbers
  const matrixValues = values.trim().split(/\s+/).map(Number);

  return matrixValues;
}

// Example usage:
const svgString = `
<svg xmlns="http://www.w3.org/2000/svg">
  <filter id="filter" color-interpolation-filters="sRGB">
    <feColorMatrix
      type="matrix"
      values=" 0.709  0.368  0.090  0.000  0.090 
               0.167  0.849  0.080  0.000  0.080 
               0.130  0.255  0.583  0.000  0.583 
               0.000  0.000  0.000  1.000  0.000">
    </feColorMatrix>
  </filter>
</svg>`;

const matrix1D = parseFeColorMatrixTo1DArray(svgString);
console.log(matrix1D);
