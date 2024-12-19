import React, { useState } from "react";
import './App.css';
import CanvasPreview from "./components/CanvasPreview";

function App() {
  const [isTwoPhotos, setIsTwoPhotos] = useState(false);
  const [isVerticalLayout, setIsVerticalLayout] = useState(true);
  const [addBeforeAfterText, setAddBeforeAfterText] = useState(true);

  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);

  const handleFileUpload = (event, setPhoto) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 400;
          const maxHeight = 300;

          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (aspectRatio > 1) {
              width = maxWidth;
              height = maxWidth / aspectRatio;
            } else {
              width = maxHeight * aspectRatio;
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          setPhoto(canvas.toDataURL("image/jpeg"));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Photo Generator</h1>

      {/* Options Section */}
      <div className="mb-4">
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={isTwoPhotos}
            onChange={(e) => setIsTwoPhotos(e.target.checked)}
            className="mr-2"
          />
          Upload 2 Photos (1 by default)
        </label>
        <br />
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={isVerticalLayout}
            onChange={(e) => setIsVerticalLayout(e.target.checked)}
            className="mr-2"
          />
          Vertical Layout (Horizontal if unchecked)
        </label>
        {isTwoPhotos && (
          <label className="block mb-2">
            <br />
            <input
              type="checkbox"
              checked={addBeforeAfterText}
              onChange={(e) => setAddBeforeAfterText(e.target.checked)}
              className="mr-2"
            />
            Add "Before" and "After" Text
          </label>
        )}
      </div>
      <br />

      {/* Upload Section */}
      <div className="mb-4">
        <div className="mb-2">
          <label>Upload Photo 1: </label>
          <input
            type="file"
            className="ml-2"
            onChange={(e) => handleFileUpload(e, setPhoto1)}
          />
        </div>
        {isTwoPhotos && (
          <div>
            <label>Upload Photo 2: </label>
            <input
              type="file"
              className="ml-2"
              onChange={(e) => handleFileUpload(e, setPhoto2)}
            />
          </div>
        )}
        <br />
      </div>

      {/* Thumbnails */}
      <div className="mb-4">
        {photo1 && (
          <img
            src={photo1}
            className="w-32 h-32 object-cover border border-gray-300 mb-2"
          />
        )}
        {isTwoPhotos && photo2 && (
          <img
            src={photo2}
            className="w-32 h-32 object-cover border border-gray-300"
          />
        )}
      </div>

      {/* Canvas Preview Section */}
      <CanvasPreview
        photo1={photo1}
        photo2={photo2}
        isVerticalLayout={isVerticalLayout}
        addBeforeAfterText={addBeforeAfterText}
      />

    </div>
  );
}

export default App;
