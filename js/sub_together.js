$(function () {
  fetch(`https://dapi.kakao.com/v3/search/book?query=자바&size=12`, {
    headers: {
      Authorization: "KakaoAK 8da443483254de2b1f9f4190858682cb",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const sliderView = document.querySelector(
        ".detailtogetherbook .slider-view"
      );
      const detailbookwrap = document.createElement("div");
      detailbookwrap.className = "detailbookwrap";
      sliderView.innerHTML = "";
      sliderView.appendChild(detailbookwrap);

      const books = data.documents.slice(0, 12);
      books.forEach((book) => {
        const box = document.createElement("div");
        box.className = "detailbookbox";
        box.innerHTML = `
          <a href="sub.html">
            <img src="${book.thumbnail}" alt="" />
            <h3>${book.title}</h3>
            <h4>${book.authors.join(", ")}</h4>
          </a>`;
        detailbookwrap.appendChild(box);
      });

      // 슬라이드 로직
      let currentIndex = 0;
      const itemsPerSlide = 4;
      const totalItems = books.length;
      const slideWidth = 644;
      const maxIndex = Math.ceil(totalItems / itemsPerSlide) - 1;

      document
        .querySelector(".detailtogetherbook .nextbutton1")
        .addEventListener("click", () => {
          if (currentIndex < maxIndex) {
            currentIndex++;
          } else {
            currentIndex = 0;
          }
          detailbookwrap.style.transform = `translateX(-${
            currentIndex * slideWidth
          }px)`;
        });

      document
        .querySelector(".detailtogetherbook .prevbutton1")
        .addEventListener("click", () => {
          if (currentIndex > 0) {
            currentIndex--;
          } else {
            currentIndex = maxIndex;
          }
          detailbookwrap.style.transform = `translateX(-${
            currentIndex * slideWidth
          }px)`;
        });
    })
    .catch((error) => {
      console.error("에러 발생:", error);
    });
});
