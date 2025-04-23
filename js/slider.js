let autoSlideInterval;
$(function () {
  const $slider = $(".sliderImg ul");
  const $slides = $slider.find("li");
  const slideCount = $slides.length;
  let currentIndex = 0;
  const slideColors = [
    "#a4d95d",
    "#FC8D50",
    "#60CC97",
    "#f9b8d5",
    "#F8B4D3",
    "#aadb72",
    "#aeda77",
  ];

  function updateSlides() {
    $slides.removeClass("active prev next prev2 next2 slider-transition");

    const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
    const nextIndex = (currentIndex + 1) % slideCount;
    const prev2Index = (currentIndex - 2 + slideCount) % slideCount;
    const next2Index = (currentIndex + 2) % slideCount;

    $slides.eq(currentIndex).addClass("active slider-transition");
    $slides.eq(prevIndex).addClass("prev slider-transition");
    $slides.eq(nextIndex).addClass("next slider-transition");
    $slides.eq(prev2Index).addClass("prev2 slider-transition");
    $slides.eq(next2Index).addClass("next2 slider-transition");

    // 애니메이션 끝난 뒤 transition 클래스 제거
    // Remove only from non-active/visible slides to keep active animations intact
    setTimeout(() => {
      $slides
        .not(".active")
        .not(".prev")
        .not(".next")
        .not(".prev2")
        .not(".next2")
        .removeClass("slider-transition");
    }, 1400); // transition duration과 동일

    // 슬라이드에 맞는 배경색 동기화
    const color = slideColors[currentIndex % slideColors.length];
    $(".sliderback, .navAll").css("background-color", color);
  }

  function moveSlider(index) {
    // Make the slider loop infinitely
    currentIndex = (index + slideCount) % slideCount;
    updateSlides();
  }

  $(".slider-next").click(function () {
    moveSlider(currentIndex + 1);
    resetAutoSlide();
  });

  $(".slider-prev").click(function () {
    moveSlider(currentIndex - 1);
    resetAutoSlide();
  });

  updateSlides(); // initialize

  // 자동 슬라이드
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      moveSlider(currentIndex + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  startAutoSlide();
});

// ===== MD 추천 도서 슬라이더 =====
$(function () {
  const $bookList = $(".mdbook .bookbox2 .book2");
  const $bookItems = $bookList.find(".activebook");
  const $prevBtn = $(".mdbook .carousel-prev");
  const $nextBtn = $(".mdbook .carousel-next");
  const itemsPerPage = 5;
  const totalItems = $bookItems.length;
  let currentIndex = 0;

  function updateMdSlider() {
    const offset = currentIndex * -100;
    $bookList.css("transform", `translateX(${offset}%)`);
  }

  $nextBtn.click(() => {
    if (currentIndex < Math.ceil(totalItems / itemsPerPage) - 1) {
      currentIndex++;
      updateMdSlider();
    }
  });

  $prevBtn.click(() => {
    if (currentIndex > 0) {
      currentIndex--;
      updateMdSlider();
    }
  });
});
