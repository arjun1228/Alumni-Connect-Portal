import React, { useState } from 'react';
import { X } from 'lucide-react';

export const PostImageGallery = ({ images = [], fallbackImage = null }) => {
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  const imageList = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean)
    : (fallbackImage ? [fallbackImage] : []);

  if (imageList.length === 0) return null;

  const count = imageList.length;

  return (
    <>
      {count === 1 && (
        <div className="mt-3 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-96">
          <img
            src={imageList[0]}
            alt="Post attachment"
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => setSelectedImageModal(imageList[0])}
          />
        </div>
      )}

      {count === 2 && (
        <div className="mt-3 grid grid-cols-2 gap-1.5 h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
          {imageList.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Post attachment ${idx + 1}`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setSelectedImageModal(url)}
            />
          ))}
        </div>
      )}

      {count === 3 && (
        <div className="mt-3 grid grid-cols-3 gap-1.5 h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="col-span-2 h-full">
            <img
              src={imageList[0]}
              alt="Post attachment 1"
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setSelectedImageModal(imageList[0])}
            />
          </div>
          <div className="col-span-1 grid grid-rows-2 gap-1.5 h-full">
            {imageList.slice(1, 3).map((url, idx) => (
              <img
                key={idx + 1}
                src={url}
                alt={`Post attachment ${idx + 2}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setSelectedImageModal(url)}
              />
            ))}
          </div>
        </div>
      )}

      {count === 4 && (
        <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-1.5 h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
          {imageList.slice(0, 4).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Post attachment ${idx + 1}`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setSelectedImageModal(url)}
            />
          ))}
        </div>
      )}

      {count >= 5 && (
        <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-1.5 h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
          {imageList.slice(0, 3).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Post attachment ${idx + 1}`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setSelectedImageModal(url)}
            />
          ))}
          <div className="relative h-full w-full cursor-pointer group" onClick={() => setSelectedImageModal(imageList[3])}>
            <img
              src={imageList[3]}
              alt="Post attachment 4"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/70 transition-colors flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">+{count - 4} more</span>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img src={selectedImageModal} alt="Expanded view" className="max-w-full max-h-[85vh] object-contain" />
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full cursor-pointer transition-transform hover:scale-105"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
