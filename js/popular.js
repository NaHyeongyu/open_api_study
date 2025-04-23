$(function () {
  // 버튼 클릭 이벤트 설정
  $(".populartype ul li button").click(function () {
    $(".populartype ul li button").removeClass("popularchecked");
    $(this).addClass("popularchecked");

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
        const popularBooks = document.querySelector(".popularbooks");
        popularBooks.innerHTML = "";

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
          popularBooks.appendChild(bookbox);
        });
        document
          .querySelectorAll(".popularbooks .bookbox")
          .forEach((el, index) => {
            if (index >= 5) el.style.display = "none";
          });
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  });

  setTimeout(() => {
    $(".populartype ul li button.popularchecked").trigger("click");
  }, 0);
});
