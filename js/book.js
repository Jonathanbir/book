$(function () {
  const $flipbook = $("#flipbook");

  const bookHeight = window.innerHeight;
  const bookWidth = bookHeight * (1200 / 600); // 保持原始比例 1200:600

  console.log("新的寬高:", bookWidth, bookHeight);
  $(window).on("resize", function () {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    $("#flipbook").turn("size", newWidth, newHeight);
  });

  const screenWidth = screen.width;
  const screenHeight = screen.height;
  console.log("手機新的寬高:", bookWidth, bookHeight);
  console.log("瀏覽器的寬高:", screenWidth, screenHeight);

  const vh = window.visualViewport.height;
  function updateHeight() {
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  // 頁面初次載入
  updateHeight();

  // 當手機旋轉或尺寸改變
  window.addEventListener("resize", updateHeight);

  function isSafari() {
    const ua = navigator.userAgent;

    return /^((?!chrome|crios|android).)*safari/i.test(ua);
  }

  if (isSafari()) {
    console.log("這是 Safari");
  }

  function isIOSChrome() {
    const ua = navigator.userAgent;

    // Android Chrome 或 iOS Chrome (CriOS)
    return ua.includes("CriOS");
  }

  function isAndroidChrome() {
    const ua = navigator.userAgent;

    // Android Chrome 或 iOS Chrome (CriOS)
    return ua.includes("Chrome");
  }

  if (isIOSChrome()) {
    console.log("這是 ios Chrome");
  }

  if (isAndroidChrome()) {
    console.log("這是 android Chrome");
  }

  if (!window.matchMedia("(max-height: 500px)").matches) {
    $flipbook.turn({
      width: 1200,
      height: 600,
      autoCenter: true,
    });
  } else {
    // call on load & on orientation change
    window.addEventListener("load", maybeShowSwipeHint);
    window.addEventListener("orientationchange", () =>
      setTimeout(maybeShowSwipeHint, 300)
    );

    // 顯示提示（只在第一次進站顯示）
    function showFullscreenHint() {
      // window.alert("請向下滑一下即可全螢幕觀看");
      if (localStorage.getItem("fullscreenHintShown")) return;

      const hint = document.getElementById("swipe-fullscreen-hint");
      hint.classList.add("show");

      // 記錄下次不要再顯示
      localStorage.setItem("fullscreenHintShown", "true");
    }

    // 隱藏提示
    function hideFullscreenHint() {
      const hint = document.getElementById("swipe-fullscreen-hint");
      hint.classList.remove("show");
    }

    // 檢查使用者是否滑動（手動觸發全螢幕）
    let touchStartY = 0;

    window.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    });

    window.addEventListener("touchmove", (e) => {
      const deltaY = e.touches[0].clientY - touchStartY;

      if (deltaY > 20) {
        hideFullscreenHint();

        // 觸發微小滾動 → Android/Safari 會隱藏網址列
        window.scrollTo(0, 1);
      }
    });

    window.addEventListener("load", () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      setTimeout(showFullscreenHint, 600);
    });

    if (isSafari()) {
      // 初始化 safri turn.js
      $flipbook.turn({
        width: "100vw",
        height: "100vh",
        // height: "80vh",
        autoCenter: true,
      });
      // $("#left-down-corner,#right-down-corner").css("bottom", "18vh");
      $("#left-down-corner,#right-down-corner").css("bottom", "0vh");
      $("#flipbook").css("marginTop", "1vh");
    }

    if (isIOSChrome()) {
      // 初始化 chorme turn.js
      $flipbook.turn({
        width: "100vw",
        height: "100vh",
        autoCenter: true,
      });
      $("#left-down-corner,#right-down-corner").css("bottom", "0vh");
      $("#flipbook").css("marginTop", "1vh");
    }

    if (isAndroidChrome()) {
      // 初始化 chorme turn.js
      $flipbook.turn({
        width: "100vw",
        height: "100vh",
        autoCenter: true,
      });
      // $("#left-down-corner,#right-down-corner").css("bottom", "0");
      // $("#flipbook").css("marginTop", "1vh");
    }
  }

  //翻轉手機提示
  function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    document.getElementById("rotate-notice").style.display = isPortrait
      ? "block"
      : "none";
  }

  // 初始檢查
  checkOrientation();

  // 當裝置旋轉時重新檢查
  window.addEventListener("resize", checkOrientation);

  // 當裝置旋轉時重新載入
  let previous = window.orientation;

  window.addEventListener("orientationchange", function () {
    const current = window.orientation;

    // 0 或 180 = 直向
    // 90 或 -90 = 橫向
    if (
      (previous === 0 || previous === 180) &&
      (current === 90 || current === -90)
    ) {
      location.reload();
    }

    previous = current;
  });

  // ---------- Swipe hint 功能 ----------
  const swipeHint = document.getElementById("swipe-hint");
  const swipeClose = swipeHint && swipeHint.querySelector(".swipe-close");

  function showSwipeHint() {
    if (!swipeHint) return;
    $(".swipe-cotainer").show();
    swipeHint.classList.add("show");
    swipeHint.setAttribute("aria-hidden", "false");
  }

  function hideSwipeHint() {
    if (!swipeHint) return;

    swipeHint.classList.remove("show");
    swipeHint.setAttribute("aria-hidden", "true");
    $(".swipe-pointer").show();
    $(".arrow").show();
  }

  // 綁一次性使用者互動：若使用者觸碰畫面視為已知，消失
  function bindSwipeHintDismiss() {
    const userDismiss = () => {
      hideSwipeHint();
      window.removeEventListener("touchstart", userDismiss);
      window.removeEventListener("mousedown", userDismiss);
    };
    window.addEventListener("touchstart", userDismiss, { passive: true });
    window.addEventListener("mousedown", userDismiss);
  }

  // 阻止點擊穿透整個提示層
  swipeHint.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
  });

  if (swipeClose) swipeClose.addEventListener("click", hideSwipeHint);

  // 判斷是否要顯示（只在手機或小螢幕顯示）
  function maybeShowSwipeHint() {
    const isMobileLike = /Mobi|Android|iPhone|iPad|Mobile/i.test(
      navigator.userAgent
    );
    if (!isMobileLike) return;
    // 若橫向或寬高比例小於某值，也可判斷
    // 這裡示範：若寬>高度（橫向）或高度小於 500 則顯示
    const w = window.innerWidth,
      h = window.innerHeight;
    if (w > h || h < 600) {
      showSwipeHint(); // 顯示 5 秒
      bindSwipeHintDismiss();
    }
  }

  // ---------- custom alert（覆寫 window.alert） ----------
  const customAlertEl = document.getElementById("custom-alert");
  const customAlertMsg = document.getElementById("custom-alert-message");
  const customAlertOk = document.getElementById("custom-alert-ok");

  function showCustomAlert(message, options = {}) {
    if (!customAlertEl) {
      // fallback
      window.origAlert(message);
      return;
    }
    customAlertMsg.textContent = message ?? "";
    customAlertEl.classList.add("show");
    customAlertEl.setAttribute("aria-hidden", "false");

    // focus button for accessibility
    customAlertOk.focus();

    // return a Promise to allow awaiting if needed
    return new Promise((resolve) => {
      function closeHandler() {
        customAlertEl.classList.remove("show");
        customAlertEl.setAttribute("aria-hidden", "true");
        customAlertOk.removeEventListener("click", closeHandler);
        document.removeEventListener("keydown", keyHandler);
        resolve();
      }
      function keyHandler(e) {
        if (e.key === "Enter" || e.key === "Escape") closeHandler();
      }
      customAlertOk.addEventListener("click", closeHandler);
      document.addEventListener("keydown", keyHandler);
    });
  }

  // 保留原生 alert 作 fallback
  window.origAlert = window.alert;
  // 覆寫
  window.alert = function (msg) {
    // 如果你想保留同步行為可以用 xhr alert fallback，這裡用非同步替代
    showCustomAlert(String(msg));
  };

  let startMoveY = 0;

  window.addEventListener("touchstart", function (e) {
    startMoveY = e.touches[0].clientY;
  });

  window.addEventListener("touchmove", function (e) {
    const currentY = e.touches[0].clientY;

    // 手指往上滑 = currentY < startMoveY
    if (startMoveY - currentY > 50) {
      onSwipeUp();
    }
  });

  function onSwipeUp() {
    $(".swipe-pointer").hide();
    $(".arrow").hide();
  }

  window.addEventListener("touchmove", () => {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollTop + viewportHeight + 5 >= pageHeight) {
      onReachBottom();
    }
  });

  function onReachBottom() {
    // 你要執行的動作
    $(".swipe-cotainer").hide();
  }

  // 禁止滑鼠拖曳翻頁（但保留角落點擊）
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // 監聽滑鼠或觸控開始事件
  $flipbook.on("mousedown touchstart", function (e) {
    const evt = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
    isDragging = true;
    startX = evt.clientX;
    startY = evt.clientY;
  });

  // 監聽移動事件（阻止拖曳）
  $flipbook.on("mousemove touchmove", function (e) {
    if (!isDragging) return;
    const evt = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
    const dx = Math.abs(evt.clientX - startX);
    const dy = Math.abs(evt.clientY - startY);

    // 如果移動超過 10px，表示使用者在拖曳 → 阻止翻頁
    if (dx > 10 || dy > 10) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });

  // 釋放滑鼠（重置狀態）
  $flipbook.on("mouseup touchend", function () {
    isDragging = false;
  });

  $("#cover").on("click", function () {
    $("#flipbook").turn("next");
  });

  let isBtnDisabled;

  function btnDisabled() {
    isBtnDisabled = true;
    $(".next-page").addClass("disabled-btn");
    $(".next-page").prop("disabled", true);
    $(".next-page, #right-up-corner, #right-down-corner")
      .on("mouseenter", function () {
        $(".next-page-hint").addClass("next-page-hint-show");
      })
      .on("mouseleave", function () {
        $(".next-page-hint").removeClass("next-page-hint-show");
      });

    if (window.matchMedia("(max-height: 500px)").matches) {
      $("#right-down-corner").css("color", "##969696");
      $("#right-down-corner").prop("disabled", true);
    }
  }

  function btnUnDisabled() {
    isBtnDisabled = false;
    $(".next-page").removeClass("disabled-btn");
    $(".next-page").prop("disabled", false);
    $(".next-page, #right-up-corner, #right-down-corner").on(
      "mouseenter",
      function () {
        $(".next-page-hint").removeClass("next-page-hint-show");
      }
    );
  }

  function btnPreviousDisabled() {
    let count = 3;
    let countMobile = 3;
    const prevBtn = $(".prev-page")[0];
    const prevMobileBtn = $("#left-down-corner")[0];

    // 每秒更新一次按鈕文字
    prevBtn.innerText = count + "秒";

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        prevBtn.innerText = count + "秒";
      } else {
        clearInterval(timer);
        prevBtn.innerText = "上一頁";
      }
    }, 1000);

    if (window.matchMedia("(max-height: 500px)").matches) {
      // 每秒更新一次按鈕文字
      prevMobileBtn.innerText = countMobile + "秒";
      $("#left-down-corner").css("color", "##969696");

      const timerMobile = setInterval(() => {
        countMobile--;
        if (countMobile > 0) {
          prevMobileBtn.innerText = countMobile + "秒";
        } else {
          clearInterval(timerMobile);
          prevMobileBtn.innerText = "上一頁";
          $("#left-down-corner").css("color", "#000");
        }
      }, 1000);
    }

    $(".prev-page").prop("disabled", true);
    $(".prev-page").addClass("disabled-btn");
    setTimeout(() => {
      $(".prev-page").removeClass("disabled-btn");
      $(".prev-page").prop("disabled", false);
    }, 3000);
  }

  function allBtnDisabled() {
    let count = 3;
    let countMobile = 3;
    const prevBtn = $(".prev-page")[0];
    const nextBtn = $(".next-page")[0];

    const prevMobileBtn = $("#left-down-corner")[0];
    const nextMobileBtn = $("#right-down-corner")[0];

    // 每秒更新一次按鈕文字
    prevBtn.innerText = count + "秒";
    nextBtn.innerText = count + "秒";

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        prevBtn.innerText = count + "秒";
        nextBtn.innerText = count + "秒";
      } else {
        clearInterval(timer);
        prevBtn.innerText = "上一頁";
        nextBtn.innerText = "下一頁";
      }
    }, 1000);

    if (window.matchMedia("(max-height: 500px)").matches) {
      // 每秒更新一次按鈕文字
      prevMobileBtn.innerText = countMobile + "秒";
      nextMobileBtn.innerText = countMobile + "秒";
      $("#left-down-corner,#right-down-corner").css("color", "##969696");

      const timerMobile = setInterval(() => {
        countMobile--;
        if (countMobile > 0) {
          prevMobileBtn.innerText = countMobile + "秒";
          nextMobileBtn.innerText = countMobile + "秒";
        } else {
          clearInterval(timerMobile);
          prevMobileBtn.innerText = "上一頁";
          nextMobileBtn.innerText = "下一頁";
          $("#left-down-corner,#right-down-corner").css("color", "#000");
        }
      }, 1000);
    }

    // $(".prev-page, .next-page").prop("disabled", true);
    // $(".prev-page, .next-page").addClass("disabled-btn");
    setTimeout(() => {
      $(".prev-page, .next-page").removeClass("disabled-btn");
      $(".prev-page, .next-page").prop("disabled", false);
    }, 3000);
  }

  // 上一頁按鈕
  $(".prev-page").on("click", function () {
    $flipbook.turn("previous");
  });

  // 下一頁按鈕
  $(".next-page").on("click", function () {
    $flipbook.turn("next");
  });

  // 鍵盤方向鍵控制翻頁
  $(document).on("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      $flipbook.turn("previous");
    } else if (e.key === "ArrowRight") {
      $flipbook.turn("next");
    }
  });

  //靜音按鈕
  let isMuted = false;

  $(".mute-toggle,.mute-mobile-toggle").on("click", function () {
    isMuted = !isMuted;

    // 控制所有 audio 是否靜音
    $("audio").prop("muted", isMuted);

    // 切換 icon + 文字
    if (isMuted) {
      if (!window.matchMedia("(max-height: 500px)").matches) {
        $(".mute-toggle").css("color", "#fff");
        $(".mute-toggle").css("background", "#ccc");
        $(".mute-toggle").html('<i class="fas fa-volume-up"></i> 開啟');
      } else {
        $(".mute-mobile-toggle").css("background", "#fff");
        $(".mute-mobile-toggle").html('<i class="fas fa-volume-mute"></i>');
      }
    } else {
      if (!window.matchMedia("(max-height: 500px)").matches) {
        $(".mute-toggle").css("color", "brown");
        $(".mute-toggle").css("background", "#fff");
        $(".mute-toggle").html('<i class="fas fa-volume-mute"></i> 關閉');
      } else {
        $(".mute-mobile-toggle").css("background", "rgba(169, 169, 169, 0.2)");
        $(".mute-mobile-toggle").html('<i class="fas fa-volume-up"></i>');
      }
    }
  });

  function allAudioPause() {
    $("audio").each(function () {
      this.pause();
    });
  }

  // 統一音效播放函式（避免重複 code）
  function playAudio(id, delay = 0) {
    const audio = document.getElementById(id);
    if (!audio) return;

    // 用 muted 屬性控制輸出，不中斷播放
    audio.muted = isMuted;

    setTimeout(() => {
      audio.currentTime = 0;
      audio.play().catch(() => {
        console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
      });
    }, delay);
  }

  // 監聽 mouseup，更新目前頁碼狀態
  let currentPage = 1;

  // 當頁面翻轉完成後觸發
  $("#flipbook").bind("turning", function (event, page, view) {
    console.log("page:", page);
    let canFlipPrev = false; // 初始禁止往前翻頁
    let canFlipNext = false; // 初始禁止往後翻頁

    function isCanNotFlipPrev() {
      if (!window.matchMedia("(max-height: 500px)").matches) {
        $("#left-up-corner")
          .off("click") // 移除舊的
          .on("click", function () {
            if (!canFlipPrev) {
              return;
            }
            $("#flipbook").turn("previous");
          });
      }

      $("#left-down-corner")
        .off("click") // 移除舊的
        .on("click", function () {
          if (!canFlipPrev) {
            return;
          }
          $("#flipbook").turn("previous");
        });
    }

    function isCanNotFlipNext() {
      if (!window.matchMedia("(max-height: 500px)").matches) {
        $("#right-up-corner")
          .off("click")
          .on("click", function () {
            if (!canFlipNext) {
              return;
            }
            $("#flipbook").turn("next");
          });
      }

      $("#right-down-corner")
        .off("click")
        .on("click", function () {
          if (!canFlipNext) {
            return;
          }
          $("#flipbook").turn("next");
        });
    }

    function isCanNotFlip() {
      isCanNotFlipPrev();
      isCanNotFlipNext();
    }

    currentPage = page;

    if (page === 1) {
      isCanNotFlip();
      setTimeout(() => {
        canFlipNext = true;
      }, 3000);
      let count = 3;
      $(".next-page").prop("disabled", true);
      $(".next-page").addClass("disabled-btn");
      const prevBtn = $(".next-page")[0];

      // 每秒更新一次按鈕文字
      prevBtn.innerText = count + "秒";

      const timer = setInterval(() => {
        count--;
        if (count > 0) {
          prevBtn.innerText = count + "秒";
        } else {
          clearInterval(timer);
          prevBtn.innerText = "下一頁";
        }
      }, 1000);
      setTimeout(() => {
        $(".next-page").removeClass("disabled-btn");
        $(".next-page").prop("disabled", false);
      }, 3000);

      $(".prev-page").addClass("disabled-btn");
    }

    if (page === 2 || page === 3) {
    } else {
    }

    if (page === 1 || page === 4) {
      $("#flipbook .cloud01").remove();
    }

    if (page === 4 || page === 5) {
      $(".eyes-ball").addClass("eyes-ball-animation");
      $(".eyes-left").addClass("eyes-big-animation");
      $(".eyes-right").addClass("eyes-big-animation");
      $(".dialog5").addClass("dialog5-animation");
    } else {
      $(".eyes-ball").removeClass("eyes-ball-animation");
      $(".dialog5").removeClass("dialog5-animation");
    }

    if (page === 6 || page === 7) {
      const door = document.querySelector(".door");
      $("#flipbook").append('<div class="tree1"></div>');
      $("#flipbook").append('<div class="tree2"></div>');
      $("#flipbook").append('<div class="tree3"></div>');
      $("#flipbook").append('<div class="cloud2"></div>');
      $("#flipbook").append('<div class="bubble5"></div>');
      $("#flipbook").append('<div class="star5"></div>');
      $("#flipbook").append('<div class="door-bg door-common"></div>');
      $("#flipbook").append('<div class="door door-common"></div>');
      $("#flipbook").append('<div class="peoples"></div>');
      $("#flipbook .door").on("click", () => {
        $(".knock").css("display", "none");
        playAudio("knock", 0);
        $(".door").addClass("door-opening");
        $(".peoples").addClass("peoples-open");
        $(".tree1").addClass("tree-fade-in");
        setTimeout(() => {
          $(".cloud1").addClass("cloud-fade-in");
          $(".cloud2").addClass("cloud-fade-in");
          $(".cloud3").addClass("cloud-fade-in");
          $(".tree2").addClass("tree-fade-in");
        }, 3000);
        setTimeout(() => {
          $(".tree3").addClass("tree-fade-in");
        }, 5000);
        setTimeout(() => {
          $(".bubble5").addClass("bubble-fade-in");
        }, 7000);
        setTimeout(() => {
          $(".star5").addClass("star-fade-in");
          $(".dialog8").addClass("dialog8-animation");
        }, 9000);
        playAudio("audio-4-click", 0);
      });
    } else {
      $("#flipbook .tree1").remove();
      $("#flipbook .tree2").remove();
      $("#flipbook .tree3").remove();
      $("#flipbook .cloud2").remove();
      $("#flipbook .door-common").remove();
      $("#flipbook .peoples").remove();
      $("#flipbook .bubble5").remove();
      $("#flipbook .star5").remove();
      $(".door").removeClass("door-opening");
      $(".peoples").removeClass("peoples-open");
      $(".tree1").removeClass("tree-fade-in");
      $(".tree2").removeClass("tree-fade-in");
      $(".tree3").removeClass("tree-fade-in");
      $(".cloud1").removeClass("cloud-fade-in");
      $(".cloud2").removeClass("cloud-fade-in");
      $(".cloud3").removeClass("cloud-fade-in");
      $(".dialog8").removeClass("dialog8-animation");
    }

    if (page === 8 || page === 9) {
      $("#flipbook").append('<div class="mom-daughter"></div>');
      $("#flipbook").append('<div class="bubble7"></div>');
      $("#flipbook").append('<div class="star7"></div>');
      setTimeout(() => {
        $(".eyes-ball-7").addClass("eyes-ball-animation");
        $(".mom-daughter").addClass("mom-daughter-animation");
      }, 8000);
      $(".foot1").addClass("foot1-animation");
      $(".foot2").addClass("foot2-animation");
      $(".foot3").addClass("foot3-animation");
      $(".foot4").addClass("foot4-animation");
      $(".foot5").addClass("foot5-animation");
      $(".dialog10").addClass("dialog10-animation");
      setTimeout(() => {
        $(".bubble7").addClass("bubble-fade-in");
      }, 9000);
      setTimeout(() => {
        $(".star7").addClass("star-fade-in");
      }, 10000);
    }

    if (page === 7 || page === 10) {
      $(".foot1").removeClass("foot1-animation");
      $(".foot2").removeClass("foot2-animation");
      $(".foot3").removeClass("foot3-animation");
      $(".foot4").removeClass("foot4-animation");
      $(".foot5").removeClass("foot5-animation");
      $(".dialog10").removeClass("dialog10-animation");
      $(".eyes-ball-7").removeClass("eyes-ball-animation");
      $(".mom-daughter").removeClass("mom-daughter-animation");
      $(".bubble7").removeClass("bubble-fade-in");
      $(".star7").removeClass("star-fade-in");
      $("#flipbook .mom-daughter").remove();
      $("#flipbook .bubble7").remove();
      $("#flipbook .star7").remove();
    }

    if (page === 10 || page === 11) {
      $(".list").addClass("list-animation");
      setTimeout(() => {
        $(".cloud-01").addClass("cloud-animation");
        $(".cloud-02").addClass("cloud-animation");
      }, 50);
      $("#flipbook").append('<div class="rainbow"></div>');
      $("#flipbook").append('<div class="star12"></div>');
      $("#flipbook").append('<div class="bubble5"></div>');
      if (window.matchMedia("(max-height: 500px)").matches) {
        $(".rainbow").css("width", bookWidth);
        $(".rainbow").css("height", bookHeight);
      }

      $("#flipbook").append('<div class="cloud-group"></div>');
      $("#flipbook").append('<div class="cow05"></div>');
      $("#flipbook").append('<div class="list-board"></div>');
      $("#flipbook").append('<div class="list"></div>');

      setTimeout(() => {
        $(".bubble5").addClass("bubble5-fade-in");
      }, 1000);
      setTimeout(() => {
        $(".star12").addClass("star-fade-in");
      }, 2000);
    } else {
      $("#flipbook .star12").remove();
      // $("#flipbook .bubble5").remove();
    }

    if (page === 9 || page === 12) {
      $(".list").removeClass("list-animation");
      $(".cloud-01").removeClass("cloud-animation");
      $(".cloud-02").removeClass("cloud-animation");
      $("#flipbook .rainbow").remove();
      $("#flipbook .cloud-group").remove();
      $("#flipbook .cow05").remove();
      $("#flipbook .list-board").remove();
      $("#flipbook .list").remove();
    }

    // 確保元素只 append 一次
    let fanAndBubbleCreated = false;
    let milkClickBound = false;

    if (page === 12 || page === 13) {
      // 只建立一次，避免 DOM 爆掉
      if (!fanAndBubbleCreated) {
        fanAndBubbleCreated = true;
        $("#flipbook").append(`<div class="electfan"></div>
                           <div class="bubble-bg"></div>
                           <div class="check-box"></div>
                           </div>`);

        $(".book-section").append(`
                           <div class="popup-board-bg">
                              <div class="popup-close-btn">x</div>
                            </div>
                           <div class="popup-board"></div>`);
      }

      setTimeout(() => $(".electfan").addClass("electfan-move"), 500);
      setTimeout(() => $(".bubble-bg").addClass("bubble-move"), 1200);
      setTimeout(() => $(".coin01").addClass("coin-animation"), 15000);

      $(".check-box").on("click", function () {
        $(".popup-board-bg").css("display", "block");
        $(".popup-board").css("display", "block");
      });

      $(".popup-board").on("click", function () {
        $(".popup-board-bg").css("display", "none");
        $(".popup-board").css("display", "none");
      });

      $(".popup-board-bg").on("click", function () {
        $(".popup-board-bg").css("display", "none");
        $(".popup-board").css("display", "none");
      });
    } else {
      $(".electfan").removeClass("electfan-move");
      $(".bubble-bg").removeClass("bubble-move");
      $(".coin01").removeClass("coin-animation");
      $("#flipbook .electfan").remove();
      $("#flipbook .bubble-bg").remove();
      $("#flipbook .check-box").remove();
      $(".book-section .popup-board-bg").remove();
      $(".book-section .popup-board").remove();
    }

    if (page === 14 || page === 15) {
      isCanNotFlip();
      setTimeout(() => {
        canFlipPrev = true;
      }, 3000);
      // 避免多次 click＝動作卡、音效重複
      if (!milkClickBound) {
        milkClickBound = true;
        btnPreviousDisabled();
        btnDisabled();

        $("#flipbook").append(`<div class="check-box"></div>`);
        $(".book-section").append(`
                           <div class="popup-board-bg">
                              <div class="popup-close-btn">x</div>
                            </div>
                           <div class="popup-board"></div>`);

        $(".check-box").on("click", function () {
          $(".popup-board-bg").css("display", "block");
          $(".popup-board").css("display", "block");
        });

        $(".popup-board").on("click", function () {
          $(".popup-board-bg").css("display", "none");
          $(".popup-board").css("display", "none");
        });

        $(".popup-board-bg").on("click", function () {
          $(".popup-board-bg").css("display", "none");
          $(".popup-board").css("display", "none");
        });

        setTimeout(() => {
          $(".click-milk").show();
        }, 13000);

        $("#flipbook .click-milk").on("click", function () {
          $(".cows-tongue").addClass("cows-tongue-animation");
          $(".milk").addClass("milk-empty");
          $(".click-milk").hide();

          playAudio("sucking-coin", 0);

          setTimeout(() => {
            $(".coin02").addClass("coin-animation");
          }, 10000);
          setTimeout(() => {
            btnUnDisabled();
            canFlipNext = true;
            $("#right-down-corner").css("color", "#000");
            $("#right-down-corner").prop("disabled", false);
          }, 12000);
        });
      }
    } else {
      $(".cows-tongue").removeClass("cows-tongue-animation");
      $(".milk").removeClass("milk-empty");
      $(".coin02").removeClass("coin-animation");
    }

    // 全域：避免重複 append coin 與 crown
    let stethoscopeBound = false;

    // 第 18–19 頁：聽心跳 + 投錢
    if (page === 16 || page === 17) {
      isCanNotFlip();
      setTimeout(() => {
        canFlipPrev = true;
      }, 3000);
      // 只綁一次 click，不會因翻頁重複綁定
      if (!stethoscopeBound) {
        stethoscopeBound = true;
        btnPreviousDisabled();
        btnDisabled();
        setTimeout(() => {
          $("#flipbook").append(`<div class="girl"></div>`);
          $("#flipbook").append(`<div class="nurse-hand"></div>`);
        }, 200);
        $("#flipbook").append(`<div class="check-box"></div>`);
        $(".book-section").append(`
                           <div class="popup-board-bg">
                              <div class="popup-close-btn">x</div>
                            </div>
                           <div class="popup-board"></div>`);

        $(".check-box").on("click", function () {
          $(".popup-board-bg").css("display", "block");
          $(".popup-board").css("display", "block");
        });

        $(".popup-board").on("click", function () {
          $(".popup-board-bg").css("display", "none");
          $(".popup-board").css("display", "none");
        });

        $(".popup-board-bg").on("click", function () {
          $(".popup-board-bg").css("display", "none");
          $(".popup-board").css("display", "none");
        });

        setTimeout(() => {
          $("#flipbook .hearing-heart").show();
          $(".stethoscope").removeClass("disabled");
        }, 15000);

        $("#flipbook .hearing-heart").on("click", function () {
          $(".stethoscope").addClass("stethoscope-move");
          $(".cow-heart").addClass("heart-beat-animation");
          $("#flipbook .hearing-heart").hide();

          playAudio("hearts-coin", 1000);

          setTimeout(() => {
            $(".coin03").addClass("coin-animation");
          }, 13000);
          setTimeout(() => {
            btnUnDisabled();
            canFlipNext = true;
            $("#right-down-corner").css("color", "#000");
            $("#right-down-corner").prop("disabled", false);
          }, 14000);
        });
      }
    } else {
      $(".stethoscope").addClass("disabled");
      $("#flipbook .stethoscope").removeClass("stethoscope-move");
      $(".cow-heart").removeClass("heart-beat-animation");
      $(".coin03").removeClass("coin-animation");
      $("#flipbook .girl").remove();
      $("#flipbook .nurse-hand").remove();
    }

    // 第 20–21 頁：獲得皇冠 + 投硬幣動畫
    if (page === 18 || page === 19) {
      $("#flipbook").append(`
      <div class="coin-all  coin01-final"></div>
      <div class="coin-all coin02-final"></div>
      <div class="coin-all coin03-final"></div>
      <div class="crown"></div>
    `);

      setTimeout(() => {
        $(".coin01-final, .coin02-final, .coin03-final").addClass(
          "coin-all-animation"
        );
      }, 1200);

      setTimeout(() => {
        $(".crown").addClass("crown-animation");
      }, 2500);
    } else {
      $(".coin01-final, .coin02-final, .coin03-final").removeClass(
        "coin-all-animation"
      );
      $(".crown").removeClass("crown-animation");
      $("#flipbook .crown").remove();
    }

    // 第 22–23 頁：小女孩夢境 + 浮出夢境
    if (page === 20 || page === 21) {
      $("#flipbook").append(`<div class="dream04"></div>`);
      $("#flipbook").append(`<div class="dialog8 dialog22"></div>`);
      $("#flipbook").append(`<div class="star22"></div>`);
      setTimeout(() => {
        $(".dream01").addClass("dream-animation");
      }, 1000);
      setTimeout(() => {
        $(".dream02").addClass("dream-animation");
      }, 2000);
      setTimeout(() => {
        $(".dream03").addClass("dream-animation");
      }, 3000);
      setTimeout(() => {
        $(".dream04").addClass("dream-animation");
      }, 4000);
      setTimeout(() => {
        $(".star22").addClass("dialog22-animation");
      }, 5000);
      setTimeout(() => {
        $(".dialog8").addClass("dialog22-animation");
      }, 6000);
    } else {
      $(".dream04").remove();
      $(".dialog22").remove();
      $(".star22").remove();
      $(".dream01").removeClass("dream-animation");
      $(".dream02").removeClass("dream-animation");
      $(".dream03").removeClass("dream-animation");
      $(".dream04").removeClass("dream-animation");
      $(".dialog8").removeClass("dialog22-animation");
      $(".star22").removeClass("dialog22-animation");
    }

    if (page === 22 || page === 23) {
      setTimeout(() => {
        $(".cow-alarm").addClass("cow-alarm-animation");
      }, 2000);
    } else {
      $(".cow-alarm").removeClass("cow-alarm-animation");
    }

    // 重置該頁面的所有動畫與音效
    function resetMilkPage() {
      $(".click-girl").hide();
      // $(".girl-click-region").addClass("disabled");
      $(".milk-hand").removeClass("milk-hand-animation");
      $(".milk-inner").removeClass("milk-inner-full");
      $(".milk-drop").removeClass("milk-drop-show");
      $(".girl-l-hand").removeClass("girl-l-hand-empty");
      $(".girl-l-hand").removeClass("girl-l-hand-finish");
      $(".girl-r-hand").removeClass("girl-r-hand-finish");
      $(".girl-l-hand-finish-milk").removeClass("girl-l-hand-finished-milk");
      $(".milk-stains").removeClass("milk-stains-show");

      for (let i = 1; i <= 6; i++) {
        $(`.flower0${i}`).removeClass(`flower0${i}-finish`);
      }

      // $(".girl-click-region").removeClass("played"); // ✅ 允許重複進入頁面動畫

      $("audio").each(function () {
        this.pause();
      });
    }

    // 牛奶倒動畫流程
    function startMilkAnimation() {
      $(".milk-hand").addClass("milk-hand-animation");

      setTimeout(() => {
        $(".milk-drop").addClass("milk-drop-show");
      }, 1700);

      setTimeout(() => {
        $(".milk-inner").addClass("milk-inner-full");
      }, 3000);

      setTimeout(() => {
        $(".milk-drop").removeClass("milk-drop-show");
      }, 5000);
    }

    // 小女孩喝奶動畫流程（只綁一次，不堆疊）
    $(".click-girl")
      .off("click")
      .on("click", function () {
        if ($(this).hasClass("played")) return;
        $(this).addClass("played");

        $(".click-girl").hide();
        $(".girl-l-hand").addClass("girl-l-hand-finish");
        $(".girl-r-hand").addClass("girl-r-hand-finish");

        playAudio("girl-drink-milk", 0);

        setTimeout(() => {
          $(".girl-l-hand").addClass("girl-l-hand-empty");
          $(".girl-l-hand-finish-milk").addClass("girl-l-hand-finished-milk");
          playAudio("drinking-milk", 0);
        }, 1000);

        setTimeout(() => {
          $(".milk-stains").addClass("milk-stains-show");
        }, 1200);

        setTimeout(() => {
          for (let i = 1; i <= 6; i++) {
            $(`.flower0${i}`).addClass(`flower0${i}-finish`);
          }
          playAudio("flower-show", 0);
        }, 2300);

        setTimeout(() => {
          btnUnDisabled();
          canFlipNext = true;
          $("#right-down-corner").css("color", "#000");
          $("#right-down-corner").prop("disabled", false);
        }, 7000);
      });

    // Animation flow — page 28/29
    function startFamilyAnimation() {
      $(".father-hand").addClass("father-hand-finish");
      $(".daughter-hand").addClass("daughter-hand-finish");
      $(".mom-hand").addClass("mom-hand-finish");

      setTimeout(() => {
        $(".father-hand-empty").addClass("father-hand-empty-move");
        $(".daughter-hand-empty").addClass("daughter-hand-empty-move");
        $(".mom-hand-empty").addClass("mom-hand-empty-move");
      }, 2000);

      setTimeout(() => {
        $(".father-hand").addClass("father-hand-remove");
        $(".daughter-hand").addClass("daughter-hand-remove");
        $(".mom-hand").addClass("mom-hand-remove");
        $(".father-hand-empty").addClass("father-hand-empty-finish");
        $(".daughter-hand-empty").addClass("daughter-hand-empty-finish");
        $(".mom-hand-empty").addClass("mom-hand-empty-finish");
      }, 2550);

      setTimeout(() => {
        $(".dad-milk-ink ").addClass("dad-milk-ink-show ");
        $(".girls-milk-ink ").addClass("girls-milk-ink-show ");
      }, 3000);

      setTimeout(() => {
        $(".cow-right").addClass("cow-right-move");
      }, 3000);

      setTimeout(() => {
        $(".mow").show();
      }, 3800);
    }

    // Reset function
    // 重置家人手部與牛相關動畫狀態
    function resetFamilyPage() {
      const removeClasses = [
        // 手部完成、移除
        "father-hand-finish",
        "daughter-hand-finish",
        "father-hand-remove",
        "daughter-hand-remove",
        "mom-hand-finish",
        "mom-hand-remove",

        // 空手動畫
        "father-hand-empty-finish",
        "father-hand-empty-move",
        "daughter-hand-empty-finish",
        "daughter-hand-empty-move",
        "mom-hand-empty-move",
        "mom-hand-empty-finish",

        // 墨水效果
        "dad-milk-ink-show",
        "girls-milk-ink-show",

        // 牛移動動畫
        "cow-right-move",
      ];

      // 批次移除所有指定 class
      $(
        ".father-hand, .daughter-hand, .mom-hand, .father-hand-empty, .daughter-hand-empty, .mom-hand-empty, .dad-milk-ink, .girls-milk-ink, .cow-right"
      ).removeClass(removeClasses.join(" "));

      // 隱藏叫聲
      $(".mow").hide();
    }

    // 翻到該頁才開始動作
    $("#flipbook").bind("turned", function (event, page) {
      if (page === 24 || page === 25) {
        isCanNotFlip();
        setTimeout(() => {
          canFlipPrev = true;
        }, 3000);
        btnPreviousDisabled();
        btnDisabled();

        resetMilkPage(); // 每次重進頁面重置一次
        // $(".girl-click-region").removeClass("played");

        setTimeout(() => {
          // $(".girl-click-region").removeClass("disabled");
          $(".click-girl").show();
        }, 9000);

        startMilkAnimation();
      } else {
        resetMilkPage();
      }
    });

    // Turn.js event
    $("#flipbook").bind("turning", function (event, page) {
      if (page === 26 || page === 27) {
        if (!$(".mom-hand").length) {
          setTimeout(() => {
            $("#flipbook").append('<div class="mom-hand"></div>');
            $("#flipbook").append('<div class="mom-hand-empty"></div>');
          }, 500);
          setTimeout(() => {
            $(".mom-hand").addClass("mom-hand-finish");
          }, 550);
        }
      } else {
        $(".mom-hand").removeClass("mom-hand-finish mom-hand-empty");
        $(".mom-hand").remove();
        $(".mom-hand-empty").remove();
      }

      if (page === 28) {
        let count = 3;
        $(".prev-page").prop("disabled", true);
        $(".prev-page").addClass("disabled-btn");
        const prevBtn = $(".prev-page")[0];

        // 每秒更新一次按鈕文字
        prevBtn.innerText = count + "秒";

        const timer = setInterval(() => {
          count--;
          if (count > 0) {
            prevBtn.innerText = count + "秒";
          } else {
            clearInterval(timer);
            prevBtn.innerText = "上一頁";
          }
        }, 1000);
        setTimeout(() => {
          $(".prev-page").removeClass("disabled-btn");
          $(".prev-page").prop("disabled", false);
        }, 3000);

        $(".next-page").addClass("disabled-btn");
      }
    });

    $("#flipbook").bind("turned", function (event, page) {
      if (page === 26 || page === 27) {
        startFamilyAnimation();
      } else {
        resetFamilyPage();
      }
    });

    if (
      page !== 1 &&
      page !== 16 &&
      page !== 17 &&
      page !== 18 &&
      page !== 19 &&
      page !== 26 &&
      page !== 27 &&
      page !== 30
    ) {
      allBtnDisabled();
      isCanNotFlip();
      // 延遲三秒後才能翻頁
      setTimeout(() => {
        canFlipPrev = true;
        canFlipNext = true;
      }, 3000);
    }

    let playTimeout;
    let latestPage = 1;

    // 頁面對應的音檔 ID 對照表
    const pageAudioMap = {
      2: "audio-2",
      3: "audio-2",
      4: "audio-3",
      5: "audio-3",
      6: "audio-4",
      7: "audio-4",
      8: "audio-5",
      9: "audio-5",
      10: "audio-6",
      11: "audio-6",
      12: "audio-7",
      13: "audio-7",
      14: "audio-8",
      15: "audio-8",
      16: "audio-9",
      17: "audio-9",
      18: "audio-10",
      19: "audio-10",
      20: "audio-11",
      21: "audio-11",
      22: "audio-12",
      23: "audio-12",
      24: "audio-13",
      25: "audio-13",
      26: "audio-14",
      27: "audio-14",
    };

    // 停止所有音樂
    function allAudioPause() {
      $("audio").each(function () {
        this.pause();
        this.currentTime = 0;
      });
    }

    // 翻頁事件
    $("#flipbook").bind("turned", function (event, page) {
      latestPage = page;

      // 書本定位
      if (page === 1) {
        document.querySelector(".book-section").style.left = "-20%";
      } else if (page === 30) {
        document.querySelector(".book-section").style.left = "17%";
      } else {
        document.querySelector(".book-section").style.left = "0px";
      }

      // 若已有計時器，清除
      if (playTimeout) clearTimeout(playTimeout);

      playTimeout = setTimeout(() => {
        if (page !== latestPage) return; // 防止快速切頁

        allAudioPause();

        setTimeout(() => {
          const audioId = pageAudioMap[page];
          if (audioId) {
            const audio = document.getElementById(audioId);
            if (audio) {
              audio.currentTime = 0;
              audio.muted = isMuted; // 🔸 關鍵：重新套用靜音狀態
              audio.play().catch(() => {
                console.log("自動播放被阻擋，請點擊頁面再播放");
              });
            }
          }
        }, 1000);
      }, 100);
    });

    $("#flipbook").on("mouseup", function (e) {
      const page = $("#flipbook").turn("page");
      console.log("目前頁面是：" + page);
      const offset = $(this).offset();
      const x = e.pageX - offset.left;
      const y = e.pageY - offset.top;
      const width = $(this).width();
      const height = $(this).height();

      // 定義一個共用函式，清除特定元素
      function clearFlipbookElements() {
        const selectors = [
          ".book-title",
          ".cloud01",
          ".rainbow",
          ".cloud-group",
          ".cow05",
          ".list-board",
          ".list",
          ".electfan",
          ".electfan-move",
          ".bubble-bg",
          ".mom-hand",
        ];

        // 用 forEach 逐一移除
        selectors.forEach((selector) => {
          $("#flipbook " + selector).remove();
        });
      }

      // 假設右下角 50x50 px
      if (x > width - 50 && y > height - 50) {
        clearFlipbookElements();
        const nextPage = currentPage + 1;
        $flipbook.turn("page", nextPage);
        $(".coin").removeClass("coin-animation");
        setTimeout(() => {
          $("#flipbook .click-milk").css("display", "block");
        }, 1000);
      } // 右上角 (top-right)
      else if (x > width - 50 && y < 50) {
        clearFlipbookElements();
        const nextPage = currentPage + 1;
        $flipbook.turn("page", nextPage);
        $(".coin").removeClass("coin-animation");
        setTimeout(() => {
          $("#flipbook .click-milk").css("display", "block");
        }, 1000);
      } // 左下角 (bottom-left)
      else if (x < 50 && y > height - 50) {
        clearFlipbookElements();
        const previousPage = currentPage - 1;
        $flipbook.turn("page", previousPage);
        $(".coin").removeClass("coin-animation");
        setTimeout(() => {
          $("#flipbook .click-milk").css("display", "block");
        }, 1000);
      } // 左上角 (top-left)
      else if (x < 50 && y < 50) {
        clearFlipbookElements();
        const previousPage = currentPage - 1;
        $flipbook.turn("page", previousPage);
        $(".coin").removeClass("coin-animation");
        setTimeout(() => {
          $("#flipbook .click-milk").css("display", "block");
        }, 1000);
      }
    });

    // $('#flipbook').bind('start', function (event, pageObject, corner) {
    //   if (corner) {
    //     $('#flipbook .book-title').remove();
    //     $('#flipbook .cloud01').remove();
    //     // 在這裡加入你想做的 JS
    //     console.log('右下角被點擊，準備翻頁: 第 ' + pageObject.next + ' 頁');
    //     // 你也可以改變 `pageObject.next = …` 或加入其他動畫、音效
    //   }
    // });
  });

  // let touchStartX = 0;
  // let touchEndX = 0;

  // const flipbook = document.getElementById('flipbook');

  // flipbook.addEventListener('touchstart', function (e) {
  //   touchStartX = e.changedTouches[0].screenX;
  // });

  // flipbook.addEventListener('touchend', function (e) {
  //   touchEndX = e.changedTouches[0].screenX;
  //   handleSwipe();
  // });

  // function handleSwipe() {
  //   const swipeDistance = touchEndX - touchStartX;

  //   if (Math.abs(swipeDistance) < 30) {
  //     // 忽略太短的滑動
  //     return;
  //   }

  //   if (swipeDistance < 0) {
  //     // 向左滑（下一頁）
  //     $('#flipbook').turn('next');
  //   } else {
  //     // 向右滑（上一頁）
  //     $('#flipbook').turn('previous');
  //   }
  // }
});
