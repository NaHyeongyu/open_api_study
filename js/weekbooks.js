// 주간 베스트 셀러 슬라이더 (5개씩, 무한루프, 애니메이션)
$(function () {
  // fetch 주간 베스트 셀러 데이터
  fetch(`https://dapi.kakao.com/v3/search/book?query=파이썬&size=10`, {
    headers: {
      Authorization: "KakaoAK 8da443483254de2b1f9f4190858682cb",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const slider = $(".weekwrap");
      // 기존 weekbox 모두 제거
      slider.empty();
      data.documents.forEach((item) => {
        const box = $(`
          <div class="weekbox">
            <img src="${item.thumbnail}" alt="${item.title}" />
          </div>
        `);
        slider.append(box);
      });

      // 이후 슬라이더 로직은 기존대로 이어짐
      const $slider = $(".weekwrap");
      const $slideList = $slider.find(".weekbox");
      const slideCount = $slideList.length;
      const visibleSlides = 5;
      let currentIndex = 0;

      // 각 weekbox의 너비(마진 포함)
      const slideWidth = $slideList.outerWidth(true);
      const totalWidth = slideWidth * slideCount;

      // .weekwrap의 부모(.week-view 등)가 overflow:hidden이어야 함
      $slider.css("width", slideWidth * visibleSlides + "px");
      $slider.parent().css("overflow", "hidden");

      // .weekwrap 자체의 width는 전체 슬라이드(복제 포함)에 맞게 설정
      $slider.css("display", "flex");
      $slider.css("transition", "transform 0.5s ease-in-out");

      // 슬라이드 복제 (앞뒤로 visibleSlides개)
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

      let $allSlides = $slider.find(".weekbox");
      let totalSlideCount = $allSlides.length;

      // 초기 위치: 앞에 복제된 슬라이드만큼 왼쪽으로 이동
      let position = -slideWidth * visibleSlides;
      $slider.css("transform", `translateX(${position}px)`);

      let isAnimating = false;

      function moveSlide(dir) {
        if (isAnimating) return;
        isAnimating = true;
        if (dir === "next") {
          currentIndex++;
          position -= slideWidth;
        } else {
          currentIndex--;
          position += slideWidth;
        }
        $slider.css({
          transform: `translateX(${position}px)`,
          transition: "transform 0.5s ease-in-out",
        });

        setTimeout(() => {
          if (currentIndex >= slideCount) {
            currentIndex = 0;
            position = -slideWidth * visibleSlides;
            $slider.css({
              transform: `translateX(${position}px)`,
              transition: "none",
            });
          } else if (currentIndex < 0) {
            currentIndex = slideCount - 1;
            position = -slideWidth * slideCount;
            $slider.css({
              transform: `translateX(${position}px)`,
              transition: "none",
            });
          }
          isAnimating = false;
        }, 500);
      }

      // 이벤트 바인딩
      $(".prevbutton")
        .off("click")
        .on("click", () => moveSlide("prev"));
      $(".nextbutton")
        .off("click")
        .on("click", () => moveSlide("next"));
    });
});
