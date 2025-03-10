const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_URL = import.meta.env.VITE_CLOUDINARY_API_URL;

// Upload image
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(`${CLOUDINARY_API_URL}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Upload any file (PDF, etc.)
export const uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Sử dụng resource_type=auto để Cloudinary tự phát hiện loại file
    const response = await fetch(`${CLOUDINARY_API_URL}/auto/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};

// Hàm biến đổi URL hình ảnh Cloudinary
export const transformImage = (url: string, options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
    quality?: number;
  }): string => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    // Tách URL thành các phần
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return url;
    
    // Tạo chuỗi transformation
    let transform = '';
    
    if (options.width) transform += `w_${options.width},`;
    if (options.height) transform += `h_${options.height},`;
    if (options.crop) transform += `c_${options.crop},`;
    if (options.quality) transform += `q_${options.quality},`;
    
    // Xóa dấu phẩy cuối cùng nếu có
    if (transform.endsWith(',')) {
      transform = transform.slice(0, -1);
    }
    
    // Kết hợp URL với transformation
    return `${urlParts[0]}/upload/${transform}/${urlParts[1]}`;
};
