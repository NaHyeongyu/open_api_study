$(function () {
  const printDate = $(".date");

  function updateDate() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;
    printDate.text(today);
  }

  function scheduleMidnightUpdate() {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
      updateDate();
      setInterval(updateDate, 24 * 60 * 60 * 1000); // 매일 24시간마다 반복
    }, timeUntilMidnight);
  }

  updateDate(); // 초기 날짜 출력
  scheduleMidnightUpdate(); // 다음 정각 갱신 예약

  // 도서 api호출
  fetch("https://dapi.kakao.com/v3/search/book?query=자바스크립트", {
    headers: {
      Authorization: "KakaoAK 8da443483254de2b1f9f4190858682cb",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const todaysBooks = document.querySelector(".todaysbooks");
      todaysBooks.innerHTML = ""; //초기화

      data.documents.slice(0, 5).forEach((book) => {
        const bookbox = document.createElement("div");
        bookbox.classList.add("bookbox");

        const booksDiv = document.createElement("div");
        booksDiv.id = "books";
        //출력
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
        todaysBooks.appendChild(bookbox);
      });
    })
    .catch((error) => {
      console.error("에러 발생:", error);
    });
});
