import { useEffect } from 'react';

declare global {
  interface Window {
    cloudinary: any;
    uploadWidgets: {[key: string]: any};
  }
}

interface CloudinaryUploadWidgetProps {
  onSuccess: (url: string) => void;
  resourceType?: 'image' | 'raw' | 'auto';
  buttonText?: string;
  className?: string;
  widgetId: string;
}

export function CloudinaryUploadWidget({
  onSuccess,
  resourceType = 'image',
  buttonText = 'Upload File',
  className = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
  widgetId
}: CloudinaryUploadWidgetProps) {
  useEffect(() => {
    // Khởi tạo object uploadWidgets nếu chưa tồn tại
    if (!window.uploadWidgets) {
      window.uploadWidgets = {};
    }

    // Kiểm tra script cloudinary
    if (!window.cloudinary) {
      console.error('Cloudinary script not loaded');
      return;
    }

    // Tạo widget với cấu hình phù hợp
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dhbm18zbs',
        uploadPreset: 'portfolio_preset',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: resourceType, // 'raw' cho PDF, 'image' cho ảnh
        maxFileSize: 10000000,
        folder: widgetId === 'profile' ? 'profile_photos' : 'resumes',
        tags: [widgetId],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log(`Upload successful to ${widgetId}:`, result.info);
          
          let finalUrl = result.info.secure_url;
          
          // Nếu đây là resume (PDF) thì thêm tham số fl_attachment
          if (widgetId === 'resume' && resourceType === 'raw') {
            finalUrl = finalUrl.replace('/upload/', '/upload/fl_attachment/');
          }
          
          onSuccess(finalUrl);
        }
        if (error) {
          console.error(`Upload error in ${widgetId}:`, error);
        }
      }
    );

    // Lưu widget bằng ID
    window.uploadWidgets[widgetId] = widget;

    // Cleanup
    return () => {
      if (window.uploadWidgets && window.uploadWidgets[widgetId]) {
        delete window.uploadWidgets[widgetId];
      }
    };
  }, [onSuccess, resourceType, widgetId]);

  return (
    <button
      type="button"
      onClick={() => window.uploadWidgets[widgetId].open()}
      className={className}
    >
      {buttonText}
    </button>
  );
}