document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const images = document.querySelectorAll(".carousel img");
  const prevBtn = document.querySelector(".left-btn");
  const nextBtn = document.querySelector(".right-btn");

  if (!carousel || images.length === 0) {
    console.error("Carousel elements not found.");
    return;
  }

  let index = 0;
  const totalImages = images.length;

  function getSlideWidth() {
    return images[0].clientWidth;
  }

  function updateSlide() {
    const slideWidth = getSlideWidth();
    carousel.style.transform = `translateX(${-index * slideWidth}px)`;
  }

  function nextSlide() {
    index = (index + 1) % totalImages;
    updateSlide();
  }

  function prevSlide() {
    index = (index - 1 + totalImages) % totalImages;
    updateSlide();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const btnColor = document.getElementById("btnColor");
  const btnDepth = document.getElementById("btnDepth");
  const btnPointCloud = document.getElementById("btnPointCloud");

  const canvas1 = document.getElementById("canvas1");
  const canvas2 = document.getElementById("canvas2");

  const colorImages = {
      canvas1: "media/logos/asulogo.png",
      canvas2: "media/logos/meteorstudiologo.jpeg",
  };

  const depthImages = {
      canvas1: "media/test_only/depth_frame_0006.png",
      canvas2: "media/test_only/depth_frame_0006.png",
  };

  function showOverlay(imageSrc, canvas) {
      let overlay = canvas.querySelector(".overlay");
      if (!overlay) {
          overlay = document.createElement("img");
          overlay.classList.add("overlay");
          canvas.appendChild(overlay);
      }
      overlay.src = imageSrc;
      overlay.style.display = "block";
  }

  function removeOverlay(canvas) {
      const overlay = canvas.querySelector(".overlay");
      if (overlay) {
          overlay.style.display = "none";
      }
  }

  btnColor.addEventListener("click", function () {
      showOverlay(colorImages.canvas1, canvas1);
      showOverlay(colorImages.canvas2, canvas2);

      btnColor.style.display = "none";
      btnDepth.style.display = "none";
      btnPointCloud.style.display = "inline-block";
  });

  btnDepth.addEventListener("click", function () {
      showOverlay(depthImages.canvas1, canvas1);
      showOverlay(depthImages.canvas2, canvas2);

      btnColor.style.display = "none"; 
      btnDepth.style.display = "none"; 
      btnPointCloud.style.display = "inline-block"; 
  });

  btnPointCloud.addEventListener("click", function () {
      removeOverlay(canvas1);
      removeOverlay(canvas2);

      btnPointCloud.style.display = "none";
      btnColor.style.display = "inline-block"; 
      btnDepth.style.display = "inline-block"; 
  });
});  

document.addEventListener("DOMContentLoaded", function () {
  const scrollWrapper = document.querySelector(".scroll-wrapper");
  const leftBtn = document.querySelector(".cm-left-btn");
  const rightBtn = document.querySelector(".cm-right-btn");

  const scrollAmount = 300;

  leftBtn.addEventListener("click", () => {
      scrollWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
      scrollWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  let isDown = false;
  let startX;
  let scrollLeft;

  scrollWrapper.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX - scrollWrapper.offsetLeft;
      scrollLeft = scrollWrapper.scrollLeft;
  });

  scrollWrapper.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - scrollWrapper.offsetLeft;
      const walk = (x - startX) * 2;
      scrollWrapper.scrollLeft = scrollLeft - walk;
  });

  scrollWrapper.addEventListener("touchend", () => {
      isDown = false;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const tooltips = document.querySelectorAll(".tooltip");
  const descriptionBox = document.getElementById("parameter-description");

  tooltips.forEach(tooltip => {
      tooltip.addEventListener("mouseenter", () => {
          const description = tooltip.getAttribute("data-description");
          descriptionBox.textContent = description;
      });

      tooltip.addEventListener("mouseleave", () => {
          descriptionBox.textContent = "Hover over a parameter to see its definition.";
      });

      tooltip.addEventListener("click", () => {
          const description = tooltip.getAttribute("data-description");
          descriptionBox.textContent = description;
      });
  });
});
