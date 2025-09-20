// import axios from 'axios';

// const upload = async (file) => {
//   const data = new FormData();
//   data.append('file', file);
//   data.append('upload_preset', 'novus project'); 

//   try {
//     const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, data);
//     const { url } = res.data;
//     return url;
//   } catch (err) {
//     console.error('Upload Error:', err);
//     throw err;
//   }
// };

// export default upload;


// upload.js
import axios from 'axios';

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxWidth = 1200;
        const maxHeight = 1200;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image with new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP format with quality settings
        canvas.toBlob(
          (blob) => {
            // Further compress if still too large
            if (blob.size > 100000) { // 100KB
              const quality = Math.max(0.1, 100000 / blob.size * 0.9);
              canvas.toBlob(
                (compressedBlob) => {
                  resolve(compressedBlob);
                },
                'image/webp',
                quality
              );
            } else {
              resolve(blob);
            }
          },
          'image/webp',
          0.8 // Initial quality setting
        );
      };
      
      img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
};

const upload = async (file) => {
  try {
    // Compress image before uploading
    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, ".webp"), {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    const data = new FormData();
    data.append('file', compressedFile);
    data.append('upload_preset', 'novus project'); 

    const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, data);
    const { url } = res.data;
    return url;
  } catch (err) {
    console.error('Upload Error:', err);
    throw err;
  }
};

export default upload;





// import axios from 'axios';

// const upload = async (file) => {
//   const data = new FormData();
//   data.append('file', file);
//   data.append('upload_preset', 'novus project'); // change if needed

//   try {
//     const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, data, {
//       onUploadProgress: (progressEvent) => {
//         const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//         console.log(`Upload progress: ${percent}%`);
//       },
//     });
//     return res.data.url;
//   } catch (err) {
//     console.error('Upload Error:', err);
//     throw err;
//   }
// };

// export default upload;
