import React, { useEffect, useRef } from "react";
import { ReactComponent as Logo } from "../EagleEyeLogo.svg";
import { renderToStaticMarkup } from "react-dom/server";

const CanvasPreview = ({ photo1, photo2, isVerticalLayout, addBeforeAfterText }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!photo1) return; // Exit if no photo is uploaded

    const img1 = new Image();
    img1.src = photo1;

    img1.onload = () => {
      const imgWidth = img1.width;
      const imgHeight = img1.height;
      const borderSize = 14; // White border size

      if (photo2) {
        const img2 = new Image();
        img2.src = photo2;

        img2.onload = () => {
          // Setup canvas dimensions based on layout
          canvas.width = isVerticalLayout ? imgWidth * 2 + borderSize : imgWidth;
          canvas.height = isVerticalLayout ? imgHeight : imgHeight * 2 + borderSize;

          // Draw the first image
          ctx.drawImage(img1, 0, 0, imgWidth, imgHeight);

          // Draw the white border
          if (isVerticalLayout) {
            ctx.fillStyle = "white";
            ctx.fillRect(imgWidth, 0, borderSize, imgHeight);
            ctx.drawImage(img2, imgWidth + borderSize, 0, imgWidth, imgHeight);
          } else {
            ctx.fillStyle = "white";
            ctx.fillRect(0, imgHeight, imgWidth, borderSize);
            ctx.drawImage(img2, 0, imgHeight + borderSize, imgWidth, imgHeight);
          }

          // Add text with white box if enabled
          if (addBeforeAfterText) {
            drawTextWithBox(ctx, "BEFORE", 0, 40);
            const afterX = isVerticalLayout ? imgWidth + borderSize : 0;
            const afterY = isVerticalLayout ? 40 : imgHeight + borderSize + 40;
            drawTextWithBox(ctx, "AFTER", afterX, afterY);
          }

          // Add the company logo centered between the two images
          drawSvgLogo(ctx, canvas.width / 2, canvas.height / 2, 85, 60.25, isVerticalLayout);
        };
      } else {
        // Single photo: Set canvas size for one image + border
        canvas.width = imgWidth + borderSize * 2;
        canvas.height = imgHeight + borderSize * 2;

        // Draw the white border
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image inside the border
        ctx.drawImage(img1, borderSize, borderSize, imgWidth, imgHeight);

        // Add the company logo inside the image, centered horizontally and moved lower
        const logoY = imgHeight / 18; // Adjust the Y position (lower it into the image)
        drawSvgLogo(ctx, canvas.width / 2, borderSize + logoY, 85, 60.25, isVerticalLayout);
      }
    };
  }, [photo1, photo2, isVerticalLayout, addBeforeAfterText]);

  const drawTextWithBox = (ctx, text, x, y) => {
    // Set font and measure text size
    ctx.font = "bold 15px Arial";
    const textWidth = ctx.measureText(text).width;
    const boxHeight = 25; // Height of the white box
    const boxPadding = 10; // Padding around the text

    // Draw white rectangle aligned with the left border of the image
    ctx.fillStyle = "white";
    ctx.fillRect(x, y - boxHeight / 2, textWidth + boxPadding * 2, boxHeight);

    // Draw bold black text
    ctx.fillStyle = "black";
    const textX = x + boxPadding;
    const textY = y + 5;
    ctx.fillText(text, textX, textY);
  };

  const drawSvgLogo = (ctx, centerX, centerY, logoWidth, logoHeight, isVerticalLayout, borderSize) => {
    // Convert React SVG component to a string
    const svgMarkup = renderToStaticMarkup(<Logo />);
    const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Draw the logo
      ctx.drawImage(
        img,
        centerX - logoWidth / 2, // Center horizontally
        centerY - logoHeight / 2, // Center vertically
        logoWidth,
        logoHeight
      );

      // Add "Eagle Eye" and "Contracting" text if not vertical layout
      if (!isVerticalLayout) {
        ctx.font = "bold 15px Arial"; // Adjust text size
        ctx.fillStyle = "black"; // Text color

        // Calculate vertical alignment for text
        const textY = centerY + logoHeight / 10; // Adjust to center text with the logo

        // Calculate padding
        const padding = 10;

        // Left text: "Eagle Eye"
        const eagleText = "Eagle Eye";
        const eagleTextWidth = ctx.measureText(eagleText).width;
        const leftTextX = centerX - logoWidth / 2 - eagleTextWidth - padding;
        ctx.fillText(eagleText, leftTextX, textY);

        // Right text: "Contracting"
        const contractingText = "Contracting";
        const rightTextX = centerX + logoWidth / 2 + padding;
        ctx.fillText(contractingText, rightTextX, textY);
      }

      URL.revokeObjectURL(svgUrl); // Clean up URL object
    };
    img.src = svgUrl;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "eagle-eye-generated.png";
    link.click();
  };


  return (
    <div className="container">
      <h2>Canvas Preview</h2>
      <canvas ref={canvasRef} className="w-full h-64"></canvas>
      <div className="text-center mt-4">
        <br/>
        <button
          onClick={handleDownload}
        >
          Download Your Image
        </button>
      </div>
    </div>
  );
};

export default CanvasPreview;
