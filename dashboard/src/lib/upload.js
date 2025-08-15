import axios from 'axios';

const upload = async (file) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'project'); 

  try {
    const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, data);
    const { url } = res.data;
    return url;
  } catch (err) {
    console.error('Upload Error:', err);
    throw err;
  }
};

export default upload;