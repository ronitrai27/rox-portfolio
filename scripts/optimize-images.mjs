import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.resolve("./public");

const imageFiles = [
  "aria.png",
  "clarioo.png",
  "looma.png",
  "pan-agent.png",
  "rox.png",
  "rox_circle.png",
  "rox_sofa.png",
  "rox_study.png",
  "vocalx.png",
  "wekraft.png",
];

async function optimize() {
  console.log("Optimizing images in", publicDir);

  for (const file of imageFiles) {
    const filePath = path.join(publicDir, file);
    if (!fs.existsSync(filePath)) continue;

    const statsBefore = fs.statSync(filePath);
    const buffer = fs.readFileSync(filePath);

    // Resize if wider than 1400px (project cards only need max ~1200px) and compress PNG with high compression
    const image = sharp(buffer);
    const metadata = await image.metadata();

    let pipeline = sharp(buffer);
    if (metadata.width && metadata.width > 1280) {
      pipeline = pipeline.resize({ width: 1280, withoutEnlargement: true });
    }

    // High efficiency compressed PNG (or webp)
    const optimizedBuffer = await pipeline
      .png({
        compressionLevel: 9,
        quality: 80,
        palette: true,
        effort: 8,
      })
      .toBuffer();

    fs.writeFileSync(filePath, optimizedBuffer);
    const statsAfter = fs.statSync(filePath);

    console.log(
      `✓ ${file}: ${(statsBefore.size / 1024 / 1024).toFixed(2)}MB -> ${(statsAfter.size / 1024).toFixed(1)}KB (${(
        (1 - statsAfter.size / statsBefore.size) *
        100
      ).toFixed(1)}% reduction)`
    );
  }

  console.log("Image optimization complete!");
}

optimize().catch(console.error);
