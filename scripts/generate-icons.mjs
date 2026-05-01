import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const sizes = [180, 192, 512];

for (const size of sizes) {
  const png = createIconPng(size);
  writeFileSync(`assets/icons/life-os-icon-${size}.png`, png);
}

function createIconPng(size) {
  const data = Buffer.alloc((size * 4 + 1) * size);

  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 4 + 1);
    data[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const offset = row + 1 + x * 4;
      const color = pixelFor(size, x, y);
      data[offset] = color[0];
      data[offset + 1] = color[1];
      data[offset + 2] = color[2];
      data[offset + 3] = color[3];
    }
  }

  const chunks = [
    chunk('IHDR', ihdr(size, size)),
    chunk('IDAT', deflateSync(data)),
    chunk('IEND', Buffer.alloc(0)),
  ];

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    ...chunks,
  ]);
}

function pixelFor(size, x, y) {
  const scale = size / 512;
  const bg = [250, 250, 248, 255];
  const panel = [242, 240, 235, 255];
  const border = [212, 208, 200, 255];
  const accent = [193, 127, 89, 255];
  const muted = [185, 178, 167, 255];
  const softAccent = [244, 222, 209, 255];

  const px = x / scale;
  const py = y / scale;

  if (roundedRect(px, py, 82, 96, 348, 320, 44)) return panel;
  if (roundedRectStroke(px, py, 82, 96, 348, 320, 44, 8)) return border;
  if (capsule(px, py, 128, 170, 148, 18)) return accent;
  if (capsule(px, py, 128, 226, 256, 14)) return muted;
  if (capsule(px, py, 128, 278, 212, 14)) return muted;
  if (capsule(px, py, 128, 330, 152, 14)) return muted;
  if (circle(px, py, 348, 330, 42)) return softAccent;
  if (circle(px, py, 348, 330, 18)) return accent;

  return bg;
}

function roundedRect(x, y, left, top, width, height, radius) {
  const right = left + width;
  const bottom = top + height;
  const cx = Math.max(left + radius, Math.min(x, right - radius));
  const cy = Math.max(top + radius, Math.min(y, bottom - radius));
  return x >= left && x <= right && y >= top && y <= bottom && circle(x, y, cx, cy, radius);
}

function roundedRectStroke(x, y, left, top, width, height, radius, stroke) {
  return roundedRect(x, y, left - stroke, top - stroke, width + stroke * 2, height + stroke * 2, radius + stroke)
    && !roundedRect(x, y, left, top, width, height, radius);
}

function capsule(x, y, left, centerY, width, height) {
  const radius = height / 2;
  return roundedRect(x, y, left, centerY - radius, width, height, radius);
}

function circle(x, y, cx, cy, radius) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

function ihdr(width, height) {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = 8;
  data[9] = 6;
  data[10] = 0;
  data[11] = 0;
  data[12] = 0;
  return data;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
