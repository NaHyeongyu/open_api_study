$(function () {
  const weekCategoryKeywords = [
    "종합",
    "소설",
    "해외",
    "국내",
    "경제",
    "인문",
    "어린이",
    "영어",
    "계발",
    "유아",
    "요리",
    "청소년",
    "만화",
  ];
  const visibleSlides = 5;
  const $slider = $(".weekwrap");
  let slideWidth = 0;
  let currentIndex = 0;
  let position = 0;
  let isAnimating = false;

  function renderActiveBook(data) {
    const activeHTML = data.documents
      .slice(0, visibleSlides)
      .map(
        (book, i) => `
      <div class="bookcontent" style="display: ${i === 0 ? "flex" : "none"};">
        <a href="#"><img src="${book.thumbnail}" alt="${book.title}" /></a>
        <div class="textinfo">
          <span class="weekbooktitle">${book.title}</span>
          <span class="weekbookwriter">${book.authors.join(", ")}</span>
        </div>
      </div>
    `
      )
      .join("");
    $(".activebook").html(activeHTML);
  }

  function renderSlider(data) {
    $slider.empty();
    data.documents.slice(0, visibleSlides).forEach((item) => {
      const box = $(`
        <div class="weekbox">
          <img src="${item.thumbnail}" alt="${item.title}" />
        </div>
      `);
      $slider.append(box);
    });
  }

  function cloneSlides() {
    $slider
      .find(".weekbox")
      .slice(-visibleSlides)
      .clone(true)
      .prependTo($slider);
    $slider
      .find(".weekbox")
      .slice(visibleSlides, visibleSlides * 2)
      .clone(true)
      .appendTo($slider);
  }

  function resetSliderState() {
    const $allSlides = $slider.find(".weekbox");
    // Use true for outerWidth to include margin
    slideWidth = $slider.find(".weekbox").outerWidth(); // Only content width, margin handled via gap in flex
    const totalSlideCount = $allSlides.length;
    // Calculate total width: slide width + 12px gap between slides, for all slides
    const totalSliderWidth = (slideWidth + 12) * totalSlideCount - 12;

    $slider.css({
      width: `${totalSliderWidth}px`,
      // Move so that the first visible slide is flush with .weekview's left edge
      transform: `translateX(-${(slideWidth + 12) * visibleSlides}px)`,
      transition: "transform 0.5s ease-in-out",
    });
    // Ensure .weekview always displays exactly 5 slides, including gap
    $(".weekview").css(
      "width",
      `${slideWidth * visibleSlides + 12 * (visibleSlides - 1)}px`
    );

    position = -(slideWidth + 12) * visibleSlides;
    currentIndex = 0;
    $slider.find(".weekbox").removeClass("active");
    $slider.find(".weekbox").eq(visibleSlides).addClass("active");
    $(".activebook .bookcontent").hide();
    $(".activebook .bookcontent").eq(currentIndex).fadeIn(200);
  }

  function moveSlide(dir) {
    if (isAnimating) return;
    isAnimating = true;
    if (dir === "next") {
      currentIndex++;
      position -= slideWidth + 12;
    } else {
      currentIndex--;
      position += slideWidth + 12;
    }

    $slider.css({
      transform: `translateX(${position}px)`,
      transition: "transform 0.5s ease-in-out",
    });

    setTimeout(() => {
      const totalSlides = $slider.find(".weekbox").length;
      if (currentIndex >= totalSlides - visibleSlides * 2) {
        currentIndex = 0;
        position = -(slideWidth + 12) * visibleSlides;
        $slider.css({
          transform: `translateX(${position}px)`,
          transition: "none",
        });
      } else if (currentIndex < 0) {
        currentIndex = totalSlides - visibleSlides * 2 - 1;
        position = -(slideWidth + 12) * (currentIndex + visibleSlides);
        $slider.css({
          transform: `translateX(${position}px)`,
          transition: "none",
        });
      }

      $slider.find(".weekbox").removeClass("active");
      $slider
        .find(".weekbox")
        .eq(currentIndex + visibleSlides)
        .addClass("active");
      $(".activebook .bookcontent").hide();
      $(".activebook .bookcontent").eq(currentIndex).fadeIn(200);
      isAnimating = false;
    }, 500);
  }

  function loadWeekData(typeText) {
    fetch(
      `https://dapi.kakao.com/v3/search/book?query=${typeText}&size=${visibleSlides}`,
      {
        headers: {
          Authorization: "KakaoAK 8da443483254de2b1f9f4190858682cb",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        renderActiveBook(data);
        renderSlider(data);
        cloneSlides();
        resetSliderState();
        // .weekview width is now set in resetSliderState
      });
  }

  $(".weektype button").on("click", function () {
    $(".weektype button").removeClass("weekchecked");
    $(this).addClass("weekchecked");
    const index = $(this).parent().index();
    const typeText = weekCategoryKeywords[index];
    // $(".week").text(`${typeText} 베스트 셀러`);
    loadWeekData(typeText);
  });

  $(".week-prevbutton").on("click", () => moveSlide("prev"));
  $(".week-nextbutton").on("click", () => moveSlide("next"));
  setInterval(() => moveSlide("next"), 4000);

  // 초기 데이터 로드
  // $(".week").text(`${weekCategoryKeywords[0]} 베스트 셀러`);
  loadWeekData(weekCategoryKeywords[0]);
});
