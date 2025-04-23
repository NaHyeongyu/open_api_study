$(function () {
  // 버튼 클릭 이벤트 설정
  $(".hottype ul li button").click(function () {
    $(".hottype ul li button").removeClass("hottypechecked");
    $(this).addClass("hottypechecked");

    const keyword = $(this).text().trim().substring(0, 2); // 앞 2글자 추출

    fetch(
      `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(
        keyword
      )}`,
      {
        headers: {
          Authorization: "KakaoAK 8da443483254de2b1f9f4190858682cb",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Carousel logic
        // Find hotbooks container (inside .hotbook-slider .hotbook-viewport)
        const hotBooks = document.querySelector(".hotbooks");
        hotBooks.innerHTML = "";

        data.documents.slice(0, 10).forEach((book) => {
          const bookbox = document.createElement("div");
          bookbox.classList.add("bookbox");

          const booksDiv = document.createElement("div");
          booksDiv.id = "books";

          booksDiv.innerHTML = `
            <div class="cover">
              <a href="sub.html" target="_blank">
                <img src="${book.thumbnail}" alt="책 표지" />
              </a>
            </div>
            <div class="bookinfo">
              <h3 id="booktitle">${book.title}</h3>
              <h4 id="writer">${book.authors.join(", ")}</h4>
            </div>
          `;

          bookbox.appendChild(booksDiv);
          hotBooks.appendChild(bookbox);
        });

        const hotbookBoxes = document.querySelectorAll(".hotbooks .bookbox");
        const hotContainer = document.querySelector(".hotbooks");
        const itemsPerSlide = 5;
        const totalItems = hotbookBoxes.length;
        const totalSlides = Math.ceil(totalItems / itemsPerSlide);
        const bookWidth = 210;
        let currentIndex = 0;

        // Clone first 5 for infinite effect
        for (let i = 0; i < itemsPerSlide; i++) {
          const clone = hotbookBoxes[i].cloneNode(true);
          hotContainer.appendChild(clone);
        }

        hotContainer.style.width = `${
          (totalItems + itemsPerSlide) * bookWidth
        }px`;
        hotContainer.style.display = "flex";
        hotContainer.style.transition = "transform 0.6s ease-in-out";

        function moveSlider() {
          hotContainer.style.transform = `translateX(-${
            currentIndex * bookWidth * itemsPerSlide
          }px)`;
        }

        document
          .querySelector(".hot-nextbutton")
          .addEventListener("click", () => {
            if (currentIndex >= totalSlides) {
              currentIndex = 0;
              hotContainer.style.transition = "none";
              hotContainer.style.transform = "translateX(0)";
              setTimeout(() => {
                currentIndex++;
                hotContainer.style.transition = "transform 0.6s ease-in-out";
                moveSlider();
              }, 50);
            } else {
              currentIndex++;
              moveSlider();
            }
          });

        document
          .querySelector(".hot-prevbutton")
          .addEventListener("click", () => {
            if (currentIndex <= 0) {
              currentIndex = totalSlides;
              hotContainer.style.transition = "none";
              hotContainer.style.transform = `translateX(-${
                currentIndex * bookWidth * itemsPerSlide
              }px)`;
              setTimeout(() => {
                currentIndex--;
                hotContainer.style.transition = "transform 0.6s ease-in-out";
                moveSlider();
              }, 50);
            } else {
              currentIndex--;
              moveSlider();
            }
          });
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  });

  setTimeout(() => {
    $(".hottype ul li button.hottypechecked").trigger("click");
  }, 0);
});
