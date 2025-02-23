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
  