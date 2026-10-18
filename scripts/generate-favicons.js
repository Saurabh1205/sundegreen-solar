const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function createIco(pngEntries) {
  const count = pngEntries.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const header = Buffer.alloc(headerSize);

  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type 1 = icon
  header.writeUInt16LE(count, 4); // count of images

  for (let i = 0; i < count; i++) {
    const { buffer, width, height } = pngEntries[i];
    const entryOffset = 6 + i * 16;

    header.writeUInt8(width >= 256 ? 0 : width, entryOffset);
    header.writeUInt8(height >= 256 ? 0 : height, entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2); // color count
    header.writeUInt8(0, entryOffset + 3); // reserved
    header.writeUInt16LE(1, entryOffset + 4); // color planes
    header.writeUInt16LE(32, entryOffset + 6); // bits per pixel
    header.writeUInt32LE(buffer.length, entryOffset + 8); // size of image in bytes
    header.writeUInt32LE(offset, entryOffset + 12); // offset of image data

    offset += buffer.length;
  }

  return Buffer.concat([header, ...pngEntries.map(e => e.buffer)]);
}

async function generateAll() {
  console.log('1. Extracting emblem from public/sundegreen_logo.png...');
  const { data, info } = await sharp(path.join(__dirname, '../public/sundegreen_logo.png'))
    .extract({ left: 93, top: 86, width: 423, height: 338 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const rawBuf = Buffer.from(data);

  // 2. Flood-fill the white house wall (inside the house outline)
  // Seed point: (200 - 93, 310 - 86) = (107, 224)
  const seedX = 200 - 93;
  const seedY = 310 - 86;
  const visited = new Uint8Array(width * height);
  const queue = [[seedX, seedY]];
  visited[seedY * width + seedX] = 1;

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const idx = (y * width + x) * channels;
    rawBuf[idx] = 255;
    rawBuf[idx + 1] = 255;
    rawBuf[idx + 2] = 255;
    rawBuf[idx + 3] = 255;

    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nVisitedIdx = ny * width + nx;
        if (!visited[nVisitedIdx]) {
          const nIdx = (ny * width + nx) * channels;
          const a = rawBuf[nIdx + 3];
          // Flood-fill only into transparent / faint interior pixels
          if (a < 80) {
            visited[nVisitedIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // 3. De-fringe alpha edges to eliminate anti-aliased white halo on dark backgrounds
  for (let i = 0; i < rawBuf.length; i += channels) {
    const a = rawBuf[i + 3] / 255;
    if (a > 0 && a < 0.98) {
      for (let c = 0; c < 3; c++) {
        let val = (rawBuf[i + c] - 255 * (1 - a)) / a;
        val = Math.max(0, Math.min(255, Math.round(val)));
        rawBuf[i + c] = val;
      }
    }
  }

  // 4. Create Master 512x512 Transparent Emblem
  console.log('2. Creating master 512x512 transparent emblem...');
  const masterEmblemBuffer = await sharp(rawBuf, { raw: { width, height, channels } })
    .resize(460, 460, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 26, bottom: 26, left: 26, right: 26, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Save public/icon.png and src/app/icon.png
  fs.writeFileSync(path.join(__dirname, '../public/icon.png'), masterEmblemBuffer);
  fs.writeFileSync(path.join(__dirname, '../src/app/icon.png'), masterEmblemBuffer);
  console.log('Saved public/icon.png and src/app/icon.png');

  // 5. Generate transparent tab favicons (16x16, 32x32, 48x48)
  console.log('3. Generating transparent tab favicons...');
  const f16 = await sharp(masterEmblemBuffer).resize(16, 16, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  const f32 = await sharp(masterEmblemBuffer).resize(32, 32, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  const f48 = await sharp(masterEmblemBuffer).resize(48, 48, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();

  fs.writeFileSync(path.join(__dirname, '../public/favicon-16x16.png'), f16);
  fs.writeFileSync(path.join(__dirname, '../public/favicon-32x32.png'), f32);
  fs.writeFileSync(path.join(__dirname, '../public/favicon-48x48.png'), f48);

  // 6. Generate multi-resolution ICO file containing 16x16, 32x32, 48x48
  console.log('4. Generating multi-resolution favicon.ico...');
  const icoData = createIco([
    { buffer: f16, width: 16, height: 16 },
    { buffer: f32, width: 32, height: 32 },
    { buffer: f48, width: 48, height: 48 }
  ]);

  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoData);
  fs.writeFileSync(path.join(__dirname, '../src/app/favicon.ico'), icoData);
  console.log('Saved public/favicon.ico and src/app/favicon.ico');

  // 7. Generate Apple Touch Icon (180x180, opaque white background with safe zone margin)
  console.log('5. Generating apple-touch-icon.png (180x180)...');
  const appleEmblem = await sharp(masterEmblemBuffer)
    .resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const appleTouchIcon = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([{ input: appleEmblem, gravity: 'center' }])
  .png()
  .toBuffer();

  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), appleTouchIcon);
  fs.writeFileSync(path.join(__dirname, '../src/app/apple-icon.png'), appleTouchIcon);
  console.log('Saved public/apple-touch-icon.png and src/app/apple-icon.png');

  // 8. Generate Android Chrome Icons (192x192 and 512x512)
  console.log('6. Generating Android Chrome icons...');
  // 192x192:
  const pwa192Emblem = await sharp(masterEmblemBuffer)
    .resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const pwa192 = await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([{ input: pwa192Emblem, gravity: 'center' }])
  .png()
  .toBuffer();

  // 512x512:
  const pwa512Emblem = await sharp(masterEmblemBuffer)
    .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const pwa512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([{ input: pwa512Emblem, gravity: 'center' }])
  .png()
  .toBuffer();

  fs.writeFileSync(path.join(__dirname, '../public/android-chrome-192x192.png'), pwa192);
  fs.writeFileSync(path.join(__dirname, '../public/android-chrome-512x512.png'), pwa512);
  console.log('Saved android-chrome-192x192.png and android-chrome-512x512.png');

  // 9. Generate SVG favicon
  console.log('7. Generating icon.svg with high-resolution brand emblem...');
  const base64Emblem = masterEmblemBuffer.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${base64Emblem}" width="512" height="512" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
  fs.writeFileSync(path.join(__dirname, '../public/icon.svg'), svgContent);
  fs.writeFileSync(path.join(__dirname, '../src/app/icon.svg'), svgContent);
  console.log('Saved public/icon.svg and src/app/icon.svg');

  console.log('All favicon assets successfully generated!');
}

generateAll().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
