import axios from 'axios';


const compressImage = (file, minSize = 0, maxSize = 100000, hdMode = false) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = async () => {
        try {
          let width = img.width;
          let height = img.height;

          // HD mode keeps bigger dimensions
          let maxWidth = hdMode ? 2000 : 1000;
          let maxHeight = hdMode ? 2000 : 1000;

          if (width > height && width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          } else if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = Math.floor(width);
          canvas.height = Math.floor(height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          let quality = hdMode ? 0.9 : 0.85; // higher quality for HD
          let type = hdMode ? "image/jpeg" : "image/webp";

          let blob = await new Promise((res) =>
            canvas.toBlob((b) => res(b), type, quality)
          );

          // If still larger than maxSize, reduce quality (not dimensions first)
          while (blob && blob.size > maxSize && quality > 0.5) {
            quality -= 0.05;
            blob = await new Promise((res) =>
              canvas.toBlob((b) => res(b), type, quality)
            );
          }
          while (blob && blob.size > maxSize && width > 800 && height > 800) {
            width *= 0.9;
            height *= 0.9;
            canvas.width = Math.floor(width);
            canvas.height = Math.floor(height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            blob = await new Promise((res) =>
              canvas.toBlob((b) => res(b), type, quality)
            );
          }

          if (!blob) throw new Error("Compression failed");
          resolve(blob);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};
const upload = async (file, options = {}) => {
  const { minSize = 0, maxSize = 100000, hdMode = false } = options;

  try {
    const compressedBlob = await compressImage(file, minSize, maxSize, hdMode);

    const ext = hdMode ? ".jpg" : ".webp";
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.[^/.]+$/, ext),
      { type: hdMode ? "image/jpeg" : "image/webp", lastModified: Date.now() }
    );

    const data = new FormData();
    data.append("file", compressedFile);
    data.append("upload_preset", "novus project");

    const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, data);
    return res.data.url;
  } catch (err) {
    console.error("Upload Error:", err);
    throw err;
  }
};
export default upload;