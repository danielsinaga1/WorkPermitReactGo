import { useMemo } from 'react';

interface Props {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
}

/**
 * Lightweight QR Code generator using SVG.
 * Generates a simple data matrix pattern for the given value.
 * For production, install `qrcode.react` package for proper QR encoding.
 */
export default function QRCodeGenerator({ value, size = 200, bgColor = '#ffffff', fgColor = '#000000', className }: Props) {
  const modules = useMemo(() => generateQRMatrix(value), [value]);
  const cellSize = size / modules.length;

  return (
    <div className={className} style={{ display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill={bgColor} />
        {modules.map((row, y) =>
          row.map((cell, x) =>
            cell ? (
              <rect key={`${y}-${x}`} x={x * cellSize} y={y * cellSize}
                width={cellSize} height={cellSize} fill={fgColor} />
            ) : null
          )
        )}
      </svg>
      <div className="text-center text-xs text-gray-500 mt-1" style={{ maxWidth: size }}>
        {value}
      </div>
    </div>
  );
}

/**
 * Simple deterministic matrix generator based on string hash.
 * This creates a visual pattern that looks like a QR code.
 * For actual QR encoding, use the `qrcode` npm package.
 */
function generateQRMatrix(input: string): boolean[][] {
  const size = 21; // Standard QR v1 size
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (sx: number, sy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const border = y === 0 || y === 6 || x === 0 || x === 6;
        const inner = y >= 2 && y <= 4 && x >= 2 && x <= 4;
        matrix[sy + y][sx + x] = border || inner;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Data area — fill with deterministic pattern from input hash
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }

  for (let y = 9; y < size - 1; y++) {
    for (let x = 9; x < size - 1; x++) {
      if (x === 6 || y === 6) continue;
      hash = ((hash * 1103515245 + 12345) & 0x7fffffff);
      matrix[y][x] = (hash % 3) === 0;
    }
  }

  return matrix;
}
