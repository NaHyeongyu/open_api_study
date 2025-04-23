$(function () {
  $(".toggle-btn").click(function () {
    const content = $(this).siblings(".toggle-content");
    const isOpen = content.hasClass("open");

    if (isOpen) {
      content.removeClass("open");
      $(this).text("펼쳐보기");
    } else {
      content.addClass("open");
      $(this).text("접기");
    }
  });

  function updateTotalPrice(value) {
    const unitPrice = 18000;
    const total = unitPrice * value;
    $(".totalprice").html(
      `${total.toLocaleString()}<span class="red">원</span>`
    );
    $(".selceter input, .selceter1 input").val(value);
  }

  $(".selceter button:last-child, .selceter1 button:last-child").click(
    function () {
      const input = $(".selceter input");
      let value = parseInt(input.val(), 10);
      value++;
      updateTotalPrice(value);
    }
  );

  $(".selceter button:first-child, .selceter1 button:first-child").click(
    function () {
      const input = $(".selceter input");
      let value = parseInt(input.val(), 10);
      if (value > 1) {
        value--;
        updateTotalPrice(value);
      }
    }
  );

  // 기본으로 "도서정보" 탭 활성화
  $(".detailnav button").each(function () {
    if ($(this).text().trim() === "도서정보") {
      $(this).attr("id", "detailnavchecked");
    }
  });

  // --- Tab navigation and scroll sync ---
  const tabMap = {
    도서정보: ".detailiteminfo",
    리뷰: ".detailreview",
    추천: ".detailtrendbook",
    "교환/반품/환불": ".service",
  };

  $(".detailnav button").click(function () {
    const text = $(this).text().trim();
    const target = tabMap[text];
    if (target) {
      $("html, body").animate(
        {
          scrollTop:
            $(target).offset().top - $(".detailnav").outerHeight() - 160,
        },
        400
      );
    }
  });

  $(window).on("scroll", function () {
    let scrollTop = $(window).scrollTop();
    const navOffset = $(".detailnav").offset().top;
    const navHeight = $(".detailnav").outerHeight();

    // Always evaluate sections for highlighting
    let currentSection = "";

    $.each(tabMap, function (key, selector) {
      const offset =
        $(selector).offset().top - $(".detailnav").outerHeight() - 160;
      if (scrollTop >= offset) {
        currentSection = key;
      }
    });

    $(".detailnav button").removeAttr("id");
    $(".detailnav button").each(function () {
      if ($(this).text().trim() === currentSection) {
        $(this).attr("id", "detailnavchecked");
      }
    });

    // Remove or re-add the .detailnavchecked class to "도서정보" based on scroll position
    const deactivateThreshold =
      $(".detailiteminfo").offset().top +
      $(".detailiteminfo").outerHeight() -
      200;
    const $defaultButton = $(".detailnav button").filter(function () {
      return $(this).text().trim() === "도서정보";
    });
    if (scrollTop > deactivateThreshold && currentSection !== "도서정보") {
      $defaultButton.removeClass("detailnavchecked");
    } else if (scrollTop <= deactivateThreshold) {
      $defaultButton.addClass("detailnavchecked");
    }
  });
});
