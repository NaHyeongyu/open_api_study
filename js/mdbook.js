$(function () {
  fetch(`https://dapi.kakao.com/v3/search/book?query=리액트}`, {
    headers: {
      Authorization: "KakaoAK 8da443483254de2b1f9f4190858682cb",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const mdBooks = document.querySelector(".mdbook");
      mdBooks.innerHTML = "";

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
        mdBooks.appendChild(bookbox);
      });

      const bookboxes = document.querySelectorAll(".mdbook .bookbox");
      const container = document.querySelector(".mdbook");
      const itemsPerSlide = 5;
      const total = bookboxes.length;
      const totalSlides = Math.ceil(total / itemsPerSlide);

      let currentIndex = 0;

      // Clone first 5 items to the end to enable infinite loop
      for (let i = 0; i < itemsPerSlide; i++) {
        const clone = bookboxes[i].cloneNode(true);
        container.appendChild(clone);
      }

      const bookWidth = 210; // 190px book + 2*10px padding
      function moveSlider() {
        container.style.transition = "transform 0.6s ease-in-out";
        container.style.transform = `translateX(-${
          currentIndex * bookWidth * itemsPerSlide
        }px)`;
      }

      document.querySelector(".md-nextbutton").addEventListener("click", () => {
        if (currentIndex >= totalSlides) {
          currentIndex = 0;
          container.style.transition = "none";
          container.style.transform = "translateX(0)";
          setTimeout(() => {
            currentIndex++;
            moveSlider();
          }, 50);
        } else {
          currentIndex++;
          moveSlider();
        }
      });

      document.querySelector(".md-prevbutton").addEventListener("click", () => {
        if (currentIndex <= 0) {
          currentIndex = totalSlides;
          container.style.transition = "none";
          container.style.transform = `translateX(-${
            currentIndex * bookWidth * itemsPerSlide
          }px)`;
          setTimeout(() => {
            currentIndex--;
            moveSlider();
          }, 50);
        } else {
          currentIndex--;
          moveSlider();
        }
      });

      // Initial width setup for flex container
      container.style.width = `${(total + itemsPerSlide) * bookWidth}px`;
      container.style.display = "flex";
    })
    .catch((error) => {
      console.error("에러 발생:", error);
    });
});
