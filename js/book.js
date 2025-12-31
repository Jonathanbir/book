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

  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight; // 目前可視高度（含工具列收起）
  const barHeight = innerHeight - screenHeight;
  const visualWidth = visualViewport.width;
  const visualHeight = visualViewport.height;
  const widthGap = (visualWidth - visualHeight * 2) / 2;

  const vh = window.visualViewport.height;
  function updateHeight() {
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  let page67Timeouts = [];
  let page89Timeouts = [];
  let page1213Timeouts = [];
  let page1415Timeouts = [];
  let page1617Timeouts = [];
  let page1819Timeouts = [];
  let page2021Timeouts = [];
  let page2425Timeouts = [];
  let page2627Timeouts = [];

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

  function isIPad() {
    return (
      navigator.maxTouchPoints > 1 && /iPad|Macintosh/.test(navigator.userAgent)
    );
  }

  // window.alert(
  //   "visualHeight: " +
  //     visualHeight +
  //     "\nwidthGap " +
  //     widthGap / 2 +
  //     "\ninnerWidth " +
  //     innerWidth +
  //     "\nscreenHeight " +
  //     screenHeight +
  //     "\ninnerHeight " +
  //     innerHeight +
  //     "\n推算工具列高度" +
  //     barHeight +
  //     "\nisIOSChrome(): " +
  //     isIOSChrome() +
  //     "\nisAndroidChrome(): " +
  //     isAndroidChrome() +
  //     "\nisSafari(): " +
  //     isSafari() +
  //     "\nisIPad(): " +
  //     isIPad()
  // );

  if (!window.matchMedia("(max-height: 500px)").matches) {
    $flipbook.turn({
      width: 1200,
      height: 600,
      autoCenter: true,
    });
  } else {
    $(".pop-up-box").on("click", function () {
      $(".pop-up-box").css("display", "none");
    });

    if (isSafari()) {
      console.log("safari~~~");
      // 初始化 safri turn.js
      $flipbook.turn({
        width: visualHeight * 2,
        height: visualHeight,
        autoCenter: true,
      });
      $("#left-up-corner").css({
        left: widthGap + "px",
      });
      $("#left-down-corner").css({
        top: visualHeight - 100 + "px",
        left: widthGap + "px",
      });
      $("#right-up-corner").css({
        right: widthGap + "px",
      });
      $("#right-down-corner").css({
        top: visualHeight - 100 + "px",
        right: widthGap + "px",
      });
      // $("#left-down-corner,#right-down-corner").css("bottom", "18vh");
      // $("#flipbook").css("marginTop", "1vh");
    }

    if (isIOSChrome()) {
      console.log("ios Chrome~~~");
      // 初始化 chorme turn.js
      $flipbook.turn({
        width: visualHeight * 2,
        height: visualHeight,
        autoCenter: true,
      });
      $("#left-up-corner").css({
        left: widthGap + "px",
      });
      $("#left-down-corner").css({
        top: visualHeight - 100,
        left: widthGap + "px",
      });
      $("#right-up-corner").css({
        right: widthGap + "px",
      });
      $("#right-down-corner").css({
        top: visualHeight - 100,
        right: widthGap + "px",
      });
      // $("#left-down-corner,#right-down-corner").css("bottom", "8vh");
      // $("#flipbook").css("marginTop", "1vh");
    }

    if (isAndroidChrome()) {
      console.log("android Chrome~~~");
      // 初始化 chorme turn.js
      $flipbook.turn({
        width: screenHeight * 2,
        height: screenHeight,
        autoCenter: true,
      });
      $(".book").css("height", screenHeight + "px");
      $("#left-down-corner").css({
        top: screenHeight + barHeight - 100 + "px",
        left: (visualWidth - screenHeight * 2) / 2 + "px",
      });
      $("#right-down-corner").css({
        top: screenHeight + barHeight - 100 + "px",
        right: (visualWidth - screenHeight * 2) / 2 + "px",
      });
      console.log("推算工具列高度≈ ", barHeight);
      console.log("工具列高度≈ ", screenHeight);

      $(".scroll-box").css("display", "block");
      // $("#left-down-corner,#right-down-corner").css("bottom", "0vh");
      $("#flipbook").css("marginTop", barHeight);

      // call on load & on orientation change

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

  //有任務下一頁 鎖定按鈕
  function btnDisabled() {
    isBtnDisabled = true;
    $(".next-page img").attr("src", "./images/common/下一頁深藍.png");
    $(".next-page img").css("cursor", "not-allowed");
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

  //有任務下一頁 不鎖定按鈕
  function btnUnDisabled() {
    isBtnDisabled = false;
    $(".next-page img").attr("src", "./images/common/下一頁.png");
    $(".next-page img").css("cursor", "pointer");
    $(".next-page").prop("disabled", false);
    $(".next-page, #right-up-corner, #right-down-corner").on(
      "mouseenter",
      function () {
        $(".next-page-hint").removeClass("next-page-hint-show");
      }
    );
  }

  //上一頁按鈕 倒數三秒
  function btnPreviousDisabled() {
    console.log("btnPreviousDisabled!");
    let count = 3;
    let countMobile = 3;
    const prevBtn = $(".prev-page")[0];
    const prevMobileBtn = $("#left-down-corner")[0];

    const timer = setInterval(() => {
      count--;

      if (count > 0) {
        $(".prev-page img").attr("src", `./images/common/${count}秒.png`);
        $(".prev-page img").css("cursor", "not-allowed");
      } else {
        clearInterval(timer);
        $(".prev-page img").attr("src", "./images/common/上一頁.png");
        $(".prev-page img").css("cursor", "pointer");
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
    $(".prev-page img").attr("src", "./images/common/上一頁深藍.png");
    setTimeout(() => {
      $(".prev-page img").attr("src", "./images/common/上一頁.png");
      $(".prev-page").prop("disabled", false);
    }, 3000);
  }

  //上下一頁 倒數3秒
  function allBtnDisabled(page) {
    let count = 3;
    let countMobile = 3;

    //一開始先顯示 3 秒
    $(".prev-page img").attr("src", "./images/common/3秒.png");
    $(".next-page img").attr("src", "./images/common/3秒.png");
    $(".prev-page").css("cursor", "not-allowed");
    $(".next-page").css("cursor", "not-allowed");
    $(".prev-page").prop("disabled", true);
    $(".next-page").prop("disabled", true);

    const prevMobileBtn = $("#left-down-corner")[0];
    const nextMobileBtn = $("#right-down-corner")[0];

    const timer = setInterval(() => {
      count--;

      if (count > 0) {
        $(".prev-page img").attr("src", `./images/common/${count}秒.png`);
        $(".next-page img").attr("src", `./images/common/${count}秒.png`);
        $(".prev-page").css("cursor", "not-allowed");
        $(".next-page").css("cursor", "not-allowed");
        $(".prev-page").prop("disabled", true);
        $(".next-page").prop("disabled", true);
      } else {
        clearInterval(timer);
        $(".prev-page img").attr("src", "./images/common/上一頁.png");
        $(".next-page img").attr("src", "./images/common/下一頁.png");
        $(".prev-page").css("cursor", "pointer");
        $(".next-page").css("cursor", "pointer");
        $(".prev-page").prop("disabled", false);
        $(".next-page").prop("disabled", false);
      }
    }, 1000);

    if (page !== 6) {
      //手機版 控制按鈕
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
    }

    // $(".prev-page, .next-page").prop("disabled", true);
    // $(".prev-page, .next-page img").attr("src","./images/common/下一頁深藍.png");
    setTimeout(() => {
      $(".prev-page img").attr("src", "./images/common/上一頁.png");
      $(".next-page img").attr("src", "./images/common/下一頁.png");
      $(".prev-page img, .next-page img").prop("disabled", false);
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
        $(".mute-toggle img").attr("src", "./images/common/靜音按鈕開啟.png");
      } else {
        $(".mute-mobile-toggle").css("background", "#fff");
        $(".mute-mobile-toggle").html('<i class="fas fa-volume-mute"></i>');
      }
    } else {
      if (!window.matchMedia("(max-height: 500px)").matches) {
        $(".mute-toggle img").attr("src", "./images/common/靜音按鈕關閉.png");
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
      $("#left-down-corner").hide();
      isCanNotFlip();
      setTimeout(() => {
        canFlipNext = true;
      }, 3000);
      let count = 3;
      $(".next-page img").attr("src", "./images/common/下一頁深藍.png");
      $(".next-page img").css("cursor", "not-allowed");
      $(".next-page").prop("disabled", true);
      const prevBtn = $(".next-page")[0];

      $(".prev-page img").attr("src", "./images/common/上一頁深藍.png");
      $(".prev-page img").css("cursor", "not-allowed");
      $(".next-page img").attr("src", "./images/common/3秒.png");
      $(".prev-page").prop("disabled", true);

      const timer = setInterval(() => {
        count--;

        if (count > 0) {
          $(".next-page img").attr("src", `./images/common/${count}秒.png`);
          $(".next-page").css("cursor", "not-allowed");
          $(".next-page").prop("disabled", true);
        } else {
          clearInterval(timer);
          $(".next-page img").attr("src", "./images/common/下一頁.png");
          $(".next-page").css("cursor", "pointer");
          $(".next-page").prop("disabled", false);
        }
      }, 1000);

      setTimeout(() => {
        $(".next-page img").attr("src", "./images/common/下一頁.png");
        $(".next-page").prop("disabled", false);
      }, 3000);
    }

    if (page === 2 || page === 3) {
      $("#left-down-corner").show();
      setTimeout(() => {
        $(".book02").css("opacity", "1");
        $(".text-02").css("opacity", "1");
        $(".book03").css("opacity", "1");
      }, 1000);
    } else {
      $(".book02").css("opacity", "0");
      $(".text-02").css("opacity", "0");
      $(".book03").css("opacity", "0");
    }

    if (page === 1 || page === 4) {
      $("#flipbook .cloud01").remove();
    }

    if (page === 4 || page === 5) {
      setTimeout(() => {
        $(".book04").css("opacity", "1");
        $(".eyes-4").css("opacity", "1");
        $(".book05").css("opacity", "1");
        $(".daughter-5").css("opacity", "1");
        $(".moms-head-5").css("opacity", "1");
        $(".daughter-hand-5").css("opacity", "1");
        $(".moms-hand-5").css("opacity", "1");
        $(".gogo").css("opacity", "1");
      }, 1000);

      $(".eyes-ball").addClass("eyes-ball-animation");
      $(".eyes-4").addClass("eyes-big-animation");
      $(".question").addClass("question-animation");
    } else {
      $(".eyes-4").removeClass("eyes-big-animation");
      $(".question").removeClass("question-animation");
      $(".book04").css("opacity", "0");
      $(".eyes-4").css("opacity", "0");
      $(".book05").css("opacity", "0");
      $(".daughter-5").css("opacity", "0");
      $(".moms-head-5").css("opacity", "0");
      $(".daughter-hand-5").css("opacity", "0");
      $(".moms-hand-5").css("opacity", "0");
      $(".gogo").css("opacity", "0");
    }

    let doorClickBound = false;

    // 第 6–7 頁：點擊門跑出森林
    if (page === 6 || page === 7) {
      page67Timeouts.push(
        setTimeout(() => {
          $(".knock").css("opacity", "1");
          $(".door").css("opacity", "1");
        }, 1000)
      );

      isCanNotFlip();

      page67Timeouts.push(
        setTimeout(() => {
          canFlipPrev = true;
        }, 3000)
      );

      if (!doorClickBound) {
        doorClickBound = true;

        $("#flipbook").append(
          `<img class="knock" src="./images/book/book0607/點這裡.png"/>
        <img class="grass0607" src="./images/book/book0607/草地.png"/>
        <img class="tree1" src="./images/book/book0607/森林1.png"/>
        <img class="tree2" src="./images/book/book0607/森林2.png"/>           
        <img class="tree3" src="./images/book/book0607/森林3.png"/>         
        <img class="cloud2" src="./images/book/book0607/雲2.png"/>           
        <img class="bubble67" src="./images/book/book0607/牛奶泡泡.png"/>           
        <img class="star5" src="./images/book/book0607/亮晶晶.png"/>         
        <img class="door-bg door-common" src="./images/book/book0607/門內.png"/>           
        <img class="door door-common" src="./images/book/book0607/門.png"/>            
        <img class="peoples" src="./images/book/book0607/媽媽鈴鈴.png"/>
        `
        );

        page67Timeouts.push(
          setTimeout(() => {
            $(".door-bg").css("opacity", "1");
          }, 2000)
        );

        const door = document.querySelector(".door");

        btnPreviousDisabled();
        btnDisabled();

        $("#flipbook .knock").on("click", () => {
          $(".knock").css("display", "none");
          playAudio("knock", 0);
          $(".door").addClass("door-opening");
          $(".peoples").addClass("peoples-open");
          $(".grass0607").addClass("tree-fade-in");

          page67Timeouts.push(
            setTimeout(() => {
              $(".tree1").addClass("tree-fade-in");
            }, 1500)
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".cloud1").addClass("cloud-fade-in");
              $(".cloud2").addClass("cloud-fade-in");
              $(".cloud3").addClass("cloud-fade-in");
              $(".tree2").addClass("tree-fade-in");
            }, 3000)
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".tree3").addClass("tree-fade-in");
            }, 5000)
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".bubble67").addClass("bubble-fade-in");
            }, 7000)
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".star5").addClass("star-fade-in");
              $(".wow").addClass("wow-animation");
            }, 9000)
          );

          page67Timeouts.push(
            setTimeout(() => {
              btnUnDisabled();
              canFlipNext = true;
              $("#right-down-corner").css("color", "#000");
              $("#right-down-corner").prop("disabled", false);
            }, 12000)
          );

          playAudio("audio-4-click", 0);
        });
      }
    }

    if (page === 5 || page === 8) {
      page67Timeouts.forEach((id) => clearTimeout(id));
      page67Timeouts = [];
      $("#flipbook .knock").remove();
      $("#flipbook .grass0607").remove();
      $("#flipbook .tree1").remove();
      $("#flipbook .tree2").remove();
      $("#flipbook .tree3").remove();
      $("#flipbook .cloud2").remove();
      $("#flipbook .door-common").remove();
      $("#flipbook .peoples").remove();
      $("#flipbook .bubble67").remove();
      $("#flipbook .star5").remove();
      $(".door").removeClass("door-opening");
      $(".peoples").removeClass("peoples-open");
      $(".grass0607").removeClass("tree-fade-in");
      $(".tree1").removeClass("tree-fade-in");
      $(".tree2").removeClass("tree-fade-in");
      $(".tree3").removeClass("tree-fade-in");
      $(".cloud1").removeClass("cloud-fade-in");
      $(".cloud2").removeClass("cloud-fade-in");
      $(".cloud3").removeClass("cloud-fade-in");
      $(".wow").removeClass("wow-animation");
    }

    if (page === 8 || page === 9) {
      $("#flipbook").append(
        `<img class="mom-daughter" src="./images/book/book08/鈴鈴媽媽.png"/>
        <img class="bubble7" src="./images/book/book08/牛奶泡泡.png"/>
        <img class="star7" src="./images/book/book09/亮晶晶.png"/>
        `
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".book08").css("opacity", "1");
          $(".book09").css("opacity", "1");
          $(".eyes-8").css("opacity", "1");
          $(".eyes-ball-8").css("opacity", "1");
        }, 1000)
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".mom-daughter").css("opacity", "1");
        }, 1000)
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".eyes-ball-8").addClass("eyes-ball-animation");
          $(".mom-daughter").addClass("mom-daughter-animation");
        }, 8000)
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".foot1").addClass("foot1-animation");
          $(".foot2").addClass("foot2-animation");
          $(".foot3").addClass("foot3-animation");
          $(".foot4").addClass("foot4-animation");
          $(".foot5").addClass("foot5-animation");
          $(".mowmow").addClass("mowmow-animation");
        }, 0)
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".bubble7").addClass("bubble-fade-in");
        }, 9000)
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".star7").addClass("star-fade-in");
        }, 10000)
      );
    }

    if (page === 7 || page === 10) {
      page89Timeouts.forEach((id) => clearTimeout(id));
      page89Timeouts = [];
      $(".foot1").removeClass("foot1-animation");
      $(".foot2").removeClass("foot2-animation");
      $(".foot3").removeClass("foot3-animation");
      $(".foot4").removeClass("foot4-animation");
      $(".foot5").removeClass("foot5-animation");
      $(".mowmow").removeClass("mowmow-animation");
      $(".eyes-ball-8").removeClass("eyes-ball-animation");
      $(".mom-daughter").removeClass("mom-daughter-animation");
      $(".bubble7").removeClass("bubble-fade-in");
      $(".star7").removeClass("star-fade-in");
      $("#flipbook .mom-daughter").remove();
      $("#flipbook .bubble7").remove();
      $("#flipbook .star7").remove();
      $(".book08").css("opacity", "0");
      $(".book09").css("opacity", "0");
      $(".eyes-8").css("opacity", "0");
      $(".eyes-ball-8").css("opacity", "0");
    }

    if (page === 10 || page === 11) {
      $(".list").addClass("list-animation");
      setTimeout(() => {
        $(".cloud-01").addClass("cloud-animation");
        $(".cloud-02").addClass("cloud-animation");
      }, 50);
      $("#flipbook").append(
        `<img class="girls-head" src="./images/book/book10/媽媽鈴鈴.png"/>        
        <img class="rainbow"  src="./images/book/book11/彩虹.png"/>
        <img class="star11" src="./images/book/book11/亮晶晶.png">
        <img class="bubble11" src="./images/book/book11/牛奶泡泡.png">
        <img class="cloud-group" src="./images/book/book11/雲01.png">
        <img class="cow05" src="./images/book/book10/牛05.png"/>
        <img src="./images/book/book11/手.png" class="list-board"/>
        <img src="./images/book/book11/清單內容.png" class="list"/>
        `
      );

      setTimeout(() => {
        $(".book10").css("opacity", "1");
        $(".book11").css("opacity", "1");
        $(".cow01").css("opacity", "1");
        $(".cow02").css("opacity", "1");
        $(".cow03").css("opacity", "1");
        $(".cow04").css("opacity", "1");
        $(".cow05").css("opacity", "1");
        $(".cloud-group").css("opacity", "1");
        $(".cloud-01").css("opacity", "1");
        $(".cloud-02").css("opacity", "1");
        $(".list-board").css("opacity", "1");
        $(".rainbow").css("opacity", "1");
        $(".girls-head").css("opacity", "1");
      }, 1000);

      setTimeout(() => {
        $(".bubble11").addClass("bubble-fade-in");
      }, 1000);
      setTimeout(() => {
        $(".star11").addClass("star-fade-in");
      }, 2000);
    }

    if (page === 9 || page === 12) {
      $(".book10").css("opacity", "0");
      $(".book11").css("opacity", "0");
      $(".cow01").css("opacity", "0");
      $(".cow02").css("opacity", "0");
      $(".cow03").css("opacity", "0");
      $(".cow04").css("opacity", "0");
      $(".cow05").css("opacity", "0");
      $(".cloud-group").css("opacity", "0");
      $(".cloud-01").css("opacity", "0");
      $(".cloud-02").css("opacity", "0");
      $(".list-board").css("opacity", "0");
      $(".rainbow").css("opacity", "0");
      $(".girls-head").css("opacity", "0");
      $(".list").removeClass("list-animation");
      $(".cloud-01").removeClass("cloud-animation");
      $(".cloud-02").removeClass("cloud-animation");
      $("#flipbook .rainbow").remove();
      $("#flipbook .cloud-group").remove();
      $("#flipbook .girls-head").remove();
      $("#flipbook .cow05").remove();
      $("#flipbook .list-board").remove();
      $("#flipbook .list").remove();
      $("#flipbook .bubble11").remove();
      $("#flipbook .star11").remove();
    }

    // 確保元素只 append 一次
    let fanAndBubbleCreated = false;
    let milkClickBound = false;

    if (page === 12 || page === 13) {
      isCanNotFlip();
      setTimeout(() => {
        canFlipPrev = true;
      }, 3000);

      // 只建立一次，避免 DOM 爆掉
      if (!fanAndBubbleCreated) {
        fanAndBubbleCreated = true;
        btnPreviousDisabled();
        btnDisabled();

        $("#flipbook")
          .append(`<img class="electfan" src="./images/book/book12/風扇1.png"/>
                    <img class="electfan-wind" src="./images/book/book12/電風扇氣旋.png"/>
                    <img class="electfan-wind" src="./images/book/book12/風的線條.png"/>
                   <img class="finish-mission01" src="./images/common/請完成任務1.png"/>
                   <img class="click-magic-wand" src="./images/book/book0607/點這裡.png"/>
                   <img class="bubble-bg" src="./images/book/book13/水珠.png"/>
                   <img class="bubble12" src="./images/book/book13/牛奶泡泡.png"/>
                   <div class="check-box"></div>
                   `);

        $(".book-section").append(`
          <div class="popup-board-bg">
            <div class="popup-close-btn">x</div>
          </div>
          <div class="popup-board popup-board01">
          <p>
          牛⽜大部分是來自溫帶品種的荷蘭⽜，台灣夏季高溫潮溼，容易讓牛牛產生「熱緊迫」（就像人類夏天也會中暑一樣喔），牛牛胃口一不好，就會營養不足，容易生病，這就是為什麼牧場裡需要安裝風扇與灑水系統幫牛牛降溫。
          </p>
          </div>
        `);
      }

      const fanImages = [
        "./images/book/book12/風扇1.png",
        "./images/book/book12/風扇2.png",
        "./images/book/book12/風扇3.png",
      ];

      let fanIndex = 0;
      const fanImg = document.querySelector(".electfan");

      page1213Timeouts.push(
        setTimeout(() => {
          $(".book12").css("opacity", "1");
          $(".book13").css("opacity", "1");
          $(".electfan").css("opacity", "1");
          $(".magic-wand").css("opacity", "1");
          $(".click-magic-wand").css("opacity", "1");
          $(".finish-mission01").css("opacity", "1");
        }, 1000)
      );

      $("#flipbook .click-magic-wand").on("click", () => {
        $(".click-magic-wand").hide();
        $(".finish-mission01").hide();

        page1213Timeouts.push(
          setTimeout(
            () => $(".magic-wand").addClass("magic-wand-animation"),
            500
          )
        );
        page1213Timeouts.push(
          setTimeout(() => {
            $(".electfan-wind").css("opacity", "1");
            $(".electfan-wind-line").css("opacity", "1");
            setInterval(() => {
              fanIndex = (fanIndex + 1) % fanImages.length;
              fanImg.src = fanImages[fanIndex];
            }, 100);
          }, 4000)
        );
        page1213Timeouts.push(
          setTimeout(() => $(".bubble-bg").addClass("bubble-move"), 2000)
        );

        page1213Timeouts.push(
          setTimeout(() => $(".bubble12").addClass("bubble-fade-in"), 3000)
        );

        page1213Timeouts.push(
          setTimeout(() => {
            $(".coin-hint01").addClass("bubble-fade-in");
          }, 12000)
        );

        page1213Timeouts.push(
          setTimeout(() => {
            $(".coin01").addClass("coin-animation");
            $(".coin-light").addClass("coin-light-show");
            $(".check01").addClass("check-show");
          }, 15000)
        );

        page1213Timeouts.push(
          setTimeout(() => {
            btnUnDisabled();
            canFlipNext = true;
            $("#right-down-corner").css("color", "#000");
            $("#right-down-corner").prop("disabled", false);
          }, 15000)
        );

        playAudio("audio-11-click", 0);
      });

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
    }

    if (page === 11 || page === 14) {
      page1213Timeouts.forEach((id) => clearTimeout(id));
      page1213Timeouts = [];
      $(".book12").css("opacity", "0");
      $(".book13").css("opacity", "0");
      $(".electfan").css("opacity", "0");
      $(".electfan-wind").css("opacity", "0");
      $(".electfan-wind-line").css("opacity", "0");
      $(".magic-wand").css("opacity", "0");
      $(".click-magic-wand").css("opacity", "0");
      $(".finish-mission01").css("opacity", "0");
      $(".electfan").removeClass("electfan-move");
      $(".bubble-bg").removeClass("bubble-move");
      $(".magic-wand").removeClass("magic-wand-animation");
      $(".coin01").removeClass("coin-animation");
      $(".coin-light").removeClass("coin-light-show");
      $(".coin-hint01").removeClass("bubble-fade-in");
      $(".check01").removeClass("check-show");
      $("#flipbook .click-magic-wand").remove();
      $("#flipbook .finish-mission01").remove();
      $("#flipbook .electfan").remove();
      $("#flipbook .electfan-wind").remove();
      $("#flipbook .electfan-wind-line").remove();
      $("#flipbook .bubble-bg").remove();
      $("#flipbook .bubble12").remove();
      $("#flipbook .check-box").remove();
      $(".book-section .popup-board-bg").remove();
      $(".book-section .popup-board").remove();
    }

    // 第 14–15 頁：餵牛奶
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

        $("#flipbook")
          .append(`<img class="small-cow" src="./images/book/book1415/小牛.png"/>
          <img class="finish-mission02" src="./images/common/請完成任務2.png"/>
          <img class="board-list02" src="./images/book/book1415/任務清單.png">
          <img class="board14" src="./images/book/book1415/板子.png"/>
          <img class="check check02" src="./images/book/book13/綠勾.png"/>
          <div class="check-box"></div>
          <img class="click-milk" src="./images/book/book1415/點這裡.png"/>
          <img class="bubble14" src="./images/book/book1415/牛奶泡泡.png"/>          
           `);

        page1415Timeouts.push(
          setTimeout(() => {
            $("#flipbook").append(
              `<img class="cloud14-2" src="./images/book/book1415/雲2.png"/>      
             <img class="text14" src="./images/book/book1415/故事14.png"/>`
            );
          }, 300)
        );

        page1415Timeouts.push(
          setTimeout(() => {
            $(".book14").css("opacity", "1");
            $(".book15").css("opacity", "1");
            $(".finish-mission02").css("opacity", "1");
            $(".milk-bottle").css("opacity", "1");
            $(".bottle").css("opacity", "1");
            $(".milk").css("opacity", "1");
            $(".girls-hand ").css("opacity", "1");
            $(".cows-tongue").css("opacity", "1");
            $(".board14").css("opacity", "1");
            $(".cloud14-1").css("opacity", "1");
            $(".cloud14-2").css("opacity", "1");
            $(".cloud14-3").css("opacity", "1");
            $(".text14").css("opacity", "1");
            $(".small-cow ").css("opacity", "1");
          }, 1000)
        );

        $(".book-section").append(`
          <div class="popup-board-bg">
            <div class="popup-close-btn">x</div>
          </div>          
          <div class="popup-board popup-board02">
          <p>
            牛牛不只是吃牧草喔！牠們的餐點像人類一樣，有主食、也有配餐，會依據牛牛的年紀與身體狀況加入除了牧草以外的其他食物，像是小牛喝奶粉，少女牛補充蛋白質幫助發育…讓牛牛補充足夠的營養，吃得健康。
          </p>
          </div>
        `);

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

        if (window.matchMedia("(max-height: 500px)").matches) {
          if (isAndroidChrome()) {
            $(".girls-hand").css({
              right: (screenHeight * 473.9) / 609 + "px", //320.6
              bottom: (screenHeight * 75.68) / 609 + "px", //51.2
            });
          }

          if (isSafari() || isIOSChrome()) {
            $(".girls-hand").css({
              right: (visualHeight * 473.1857) / 609 + "px", //351.312
              bottom: (visualHeight * 81.124) / 609 + "px", //60.2311
            });
          }
        }

        page1415Timeouts.push(
          setTimeout(() => {
            $(".board-list02").addClass("bubble-fade-in");
          }, 1000)
        );

        page1415Timeouts.push(
          setTimeout(() => {
            $(".bubble14").addClass("bubble-fade-in");
          }, 1000)
        );

        page1415Timeouts.push(
          setTimeout(() => {
            $(".click-milk").show();
          }, 1000)
        );

        $("#flipbook .click-milk").on("click", function () {
          page1415Timeouts.push(
            setTimeout(() => {
              $(".success-hint02").addClass("bubble-fade-in");
            }, 5000)
          );
          $(".cows-tongue").addClass("cows-tongue-animation");
          $(".milk").addClass("milk-empty");
          $(".click-milk").hide();
          $(".finish-mission02").hide();

          playAudio("sucking-coin", 0);

          page1415Timeouts.push(
            setTimeout(() => {
              $(".coin-hint02").addClass("bubble-fade-in");
            }, 7000)
          );

          page1415Timeouts.push(
            setTimeout(() => {
              $(".check02").addClass("check-show");
              $(".coin02").addClass("coin-animation");
              $(".coin-light02").addClass("coin-light-show");
            }, 10000)
          );

          page1415Timeouts.push(
            setTimeout(() => {
              btnUnDisabled();
              canFlipNext = true;
              $("#right-down-corner").css("color", "#000");
              $("#right-down-corner").prop("disabled", false);
            }, 12000)
          );
        });
      }
    }

    if (page === 13 || page === 16) {
      page1415Timeouts.forEach((id) => clearTimeout(id));
      page1415Timeouts = [];
      $(".book14").css("opacity", "0");
      $(".book15").css("opacity", "0");
      $(".finish-mission02").css("opacity", "0");
      $(".milk-bottle").css("opacity", "0");
      $(".bottle").css("opacity", "0");
      $(".milk").css("opacity", "0");
      $(".girls-hand ").css("opacity", "0");
      $(".cows-tongue").css("opacity", "0");
      $(".board14").css("opacity", "0");
      $(".cloud14-1").css("opacity", "0");
      $(".cloud14-2").css("opacity", "0");
      $(".cloud14-3").css("opacity", "0");
      $(".text14").css("opacity", "0");
      $(".small-cow ").css("opacity", "0");
      $("#flipbook .finish-mission02").remove();
      $("#flipbook .cloud14-2").remove();
      $("#flipbook .text14").remove();
      $("#flipbook .click-milk").remove();
      $("#flipbook .board14").remove();
      $("#flipbook .board-list02").remove();
      $("#flipbook .small-cow").remove();
      $("#flipbook .bubble14").remove();
      $("#flipbook .check02").remove();
      $(".success-hint02").removeClass("bubble-fade-in");
      $(".cows-tongue").removeClass("cows-tongue-animation");
      $(".milk").removeClass("milk-empty");
      $(".coin02").removeClass("coin-animation");
      $(".coin-light02").removeClass("coin-light-show");
      $(".check02").removeClass("check-show");
      $(".coin-hint02").removeClass("bubble-fade-in");
    }

    // 全域：避免重複 append coin 與 crown
    let stethoscopeBound = false;

    // 第 16–17 頁：聽牛心跳
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
        $("#flipbook").append(`
            <img class="finish-mission03" src="./images/common/請完成任務3.png"/>
            <img class="story-text16" src="./images/book/book1617/故事文.png"/>
            <img class="mom-cow" src="./images/book/book1617/媽媽牛.png"/>
            <img class="stethoscope disabled" src="./images/book/book1617/手.png"/>
            <img class="cow-eyes" src="./images/book/book1617/牛眼睜開.png"/>
            <img class="cow-heart" src="./images/book/book1617/牛愛心.png"/>
            <img class="dondon" src="./images/book/book1617/咚咚.png">
            <img class="nurse-girl" src="./images/book/book1617/鈴鈴護士.png"/>
            <img class="click-hearing-heart" src="./images/book/book25/點這裡.png"/>
            <img class="board-list03" src="./images/book/book1617/任務清單.png"/>
            <img class="check check03" src="./images/book/book13/綠勾.png" />
            <img class="board16" src="./images/book/book1415/板子.png">
            <img class="bubble16" src="./images/book/book1617/牛奶泡泡.png"/>
            `);
        $("#flipbook").append(`<div class="check-box"></div>`);
        $(".book-section").append(`
          <div class="popup-board-bg">
            <div class="popup-close-btn">x</div>
          </div>             
          <div class="popup-board popup-board03">
          <p>
           牛牛是草食性動物，不會輕易表現出身體不適，所以必須透過獸醫師的專業檢查與經驗判斷才能瞭解。除了聽診、量體溫、看糞便、觸診之外，獸醫師也需要檢查牛舍、看飼料、觀察牛隻活動，幫助牧場提前預防問題。除了把關牛牛的健康，也要打造讓牛牛「吃得好、住得好」的牧場環境，才能「預防勝於治療」，減少牛牛生病的機率。
          </p>
          </div>
        `);

        page1617Timeouts.push(
          setTimeout(() => {
            $(".book16").css("opacity", "1");
            $(".book17").css("opacity", "1");
            $(".finish-mission03").css("opacity", "1");
            $(".cloud-16-0").css("opacity", "1");
            $(".cloud-16-3").css("opacity", "1");
            $(".cloud14-3").css("opacity", "1");
            $(".moutain-left").css("opacity", "1");
            $(".moutain-right").css("opacity", "1");
            $(".mom-cow").css("opacity", "1");
            $(".cow-eyes").css("opacity", "1");
            $(".cow-heart").css("opacity", "1");
            $(".stethoscope").css("opacity", "1");
            $(".board16").css("opacity", "1");
            $(".story-text16").css("opacity", "1");
            $(".nurse-girl").css("opacity", "1");
          }, 1000)
        );

        page1617Timeouts.push(
          setTimeout(() => {
            $(".bubble16").addClass("bubble-fade-in");
            $(".board-list03").addClass("bubble-fade-in");
          }, 1000)
        );

        page1617Timeouts.push(
          setTimeout(() => {
            $(".click-hearing-heart").show();
          }, 1000)
        );

        $("#flipbook .click-hearing-heart").on("click", function () {
          const cowEyesImages = [
            "./images/book/book1617/牛眼睜開.png",
            "./images/book/book1617/牛眼關閉.png",
          ];

          let cowEyesIndex = 0;
          const cowEyesImg = document.querySelector(".cow-eyes");

          page1617Timeouts.push(
            setInterval(() => {
              cowEyesIndex = (cowEyesIndex + 1) % cowEyesImages.length;
              cowEyesImg.src = cowEyesImages[cowEyesIndex];
            }, 500)
          );

          $(".dondon").addClass("bubble-fade-in");
          $(".stethoscope").addClass("stethoscope-move");
          $(".cow-heart").addClass("heart-beat-animation");
          $(".click-hearing-heart").hide();
          $(".finish-mission03").hide();

          playAudio("hearts-coin", 1000);

          page1617Timeouts.push(
            setTimeout(() => {
              $(".success-hint03").addClass("bubble-fade-in");
            }, 5000)
          );

          page1617Timeouts.push(
            setTimeout(() => {
              $(".coin-hint03").addClass("bubble-fade-in");
            }, 10000)
          );

          page1617Timeouts.push(
            setTimeout(() => {
              $(".check03").addClass("check-show");
              $(".coin03").addClass("coin-animation");
              $(".coin-light03").addClass("coin-light-show");
            }, 13000)
          );

          page1617Timeouts.push(
            setTimeout(() => {
              btnUnDisabled();
              canFlipNext = true;
              $("#right-down-corner").css("color", "#000");
              $("#right-down-corner").prop("disabled", false);
            }, 14000)
          );
        });
      }

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
    }

    if (page === 15 || page === 18) {
      page1617Timeouts.forEach((id) => clearTimeout(id));
      page1617Timeouts = [];
      $(".book16").css("opacity", "0");
      $(".book17").css("opacity", "0");
      $(".finish-mission03").css("opacity", "0");
      $(".cloud-16-0").css("opacity", "0");
      $(".cloud-16-3").css("opacity", "0");
      $(".cloud14-3").css("opacity", "0");
      $(".moutain-left").css("opacity", "0");
      $(".moutain-right").css("opacity", "0");
      $(".mom-cow").css("opacity", "0");
      $(".cow-eyes").css("opacity", "0");
      $(".cow-heart").css("opacity", "0");
      $(".stethoscope").css("opacity", "0");
      $(".board16").css("opacity", "0");
      $(".story-text16").css("opacity", "0");
      $(".nurse-girl").css("opacity", "0");
      $(".stethoscope").addClass("disabled");
      $("#flipbook .stethoscope").removeClass("stethoscope-move");
      $(".cow-heart").removeClass("heart-beat-animation");
      $(".coin03").removeClass("coin-animation");
      $(".coin-light03").removeClass("coin-light-show");
      $(".check03").removeClass("check-show");
      $(".coin-hint03").removeClass("bubble-fade-in");
      $(".success-hint03").removeClass("bubble-fade-in");
      $(".dondon").removeClass("bubble-fade-in");
      $("#flipbook .click-hearing-heart").remove();
      $("#flipbook .finish-mission03").remove();
      $("#flipbook .story-text16").remove();
      $("#flipbook .mom-cow").remove();
      $("#flipbook .stethoscope").remove();
      $("#flipbook .cow-eyes").remove();
      $("#flipbook .cow-heart").remove();
      $("#flipbook .dondon").remove();
      $("#flipbook .nurse-girl").remove();
      $("#flipbook .click-hearing-heart").remove();
      $("#flipbook .check03").remove();
      $("#flipbook .board-list03").remove();
      $("#flipbook .board16").remove();
      $("#flipbook .bubble16").remove();
      $("#flipbook .dondon").remove();
    }

    // 第 20–21 頁：獲得皇冠 + 投硬幣動畫
    if (page === 18 || page === 19) {
      $("#flipbook").append(`
      <img class="coin-all  coin01-final" src="./images/book/book1819/金幣01.png" />
      <img class="coin-all coin02-final" src="./images/book/book1819/金幣02.png" />
      <img class="coin-all coin03-final" src="./images/book/book1819/金幣03.png" />
      <img class="coin-all-shine" src="./images/book/book1819/亮晶晶.png" />
      <img class="crown" src="./images/book/book1819/好牛皇冠.png" />
      <img class="bubble18" src="./images/book/book1819/牛奶泡泡.png" />
    `);

      page1819Timeouts.push(
        setTimeout(() => {
          $(".book18").css("opacity", "1");
          $(".book19").css("opacity", "1");
        }, 1000)
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".coin01-final, .coin02-final, .coin03-final").addClass(
            "coin-all-animation"
          );
        }, 1200)
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".coin-all-shine").addClass("bubble-fade-in");
        }, 1500)
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".bubble18").addClass("bubble-fade-in");
          $(".crown").addClass("crown-animation");
        }, 2500)
      );
    }

    if (page === 17 || page === 20) {
      page1819Timeouts.forEach((id) => clearTimeout(id));
      page1819Timeouts = [];
      $(".book18").css("opacity", "0");
      $(".book19").css("opacity", "0");
      $(".coin01-final, .coin02-final, .coin03-final").removeClass(
        "coin-all-animation"
      );
      $(".crown").removeClass("crown-animation");
      $(".coin-all-shine").removeClass("bubble-fade-in");
      $(".bubble18").removeClass("bubble-fade-in");
      $("#flipbook .bubble18").remove();
      $("#flipbook .crown").remove();
      $("#flipbook .coin-all").remove();
      $("#flipbook .coin-all-shine").remove();
    }

    // 第 20–21 頁：小女孩夢境 + 浮出夢境
    if (page === 20 || page === 21) {
      $("#flipbook").append(
        `<img class="dream04" src="./images/book/book2021/夢泡04.png"/>
        <img class="dream-light" src="./images/book/book2021/夢泡光.png"/>
        <img class="story20" src="./images/book/book2021/故事20.png"/>
        <img class="dream-girl" src="./images/book/book2021/鈴鈴.png"/>
        <img class="dialog20" src="./images/book/book2021/哇!.png"/>
        <img class="dialog21" src="./images/book/book2021/嗯.png"/>
        <img class="bubble20" src="./images/book/book2021/牛奶泡泡20.png"/>
        <img class="star20" src="./images/book/book2021/亮晶晶.png"/>
        `
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".book20").css("opacity", "1");
          $(".book21").css("opacity", "1");
        }, 1000)
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dream01").addClass("dream-animation");
        }, 2000)
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dream02").addClass("dream-animation");
        }, 3000)
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dream03").addClass("dream-animation");
        }, 4000)
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dream04").addClass("dream-animation");
        }, 5000)
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dream-light").addClass("sweet-taste-animation");
          $(".story20").addClass("dream-animation");
          $(".star20").addClass("dialog20-animation");
          $(".dream-girl").addClass("dream-girl-animation");
        }, 6000)
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dialog20").addClass("dialog20-animation");
          $(".dialog21").addClass("dialog20-animation");
        }, 7000)
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".bubble20").addClass("bubble-fade-in");
        }, 9000)
      );
    }

    if (page === 19 || page === 22) {
      page2021Timeouts.forEach((id) => clearTimeout(id));
      page2021Timeouts = [];
      $(".book20").css("opacity", "0");
      $(".book21").css("opacity", "0");
      $(".dream04").remove();
      $(".dream-light").remove();
      $(".story20").remove();
      $(".dream-girl").remove();
      $(".dialog20").remove();
      $(".star20").remove();
      $(".bubble20").remove();
      $(".dialog20").remove();
      $(".dialog21").remove();
      $(".dream01").removeClass("dream-animation");
      $(".dream02").removeClass("dream-animation");
      $(".dream03").removeClass("dream-animation");
      $(".dream04").removeClass("dream-animation");
      $(".dialog20").removeClass("dialog20-animation");
      $(".dialog21").removeClass("dialog20-animation");
      $(".star20").removeClass("dialog20-animation");
      $(".bubble20").removeClass("bubble-fade-in");
      $(".dream-girl").removeClass("dream-girl-animation");
    }

    if (page === 22 || page === 23) {
      setTimeout(() => {
        $(".book22").css("opacity", "1");
        $(".book23").css("opacity", "1");
        $(".cow-alarm ").css("opacity", "1");
        $(".sleep-girl-hand").css("opacity", "1");
        $(".sleep-girl-arm").css("opacity", "1");
      }, 1000);
      setTimeout(() => {
        $(".cow-alarm").addClass("cow-alarm-animation");
      }, 2000);
    } else {
      $(".book22").css("opacity", "0");
      $(".book23").css("opacity", "0");
      $(".cow-alarm ").css("opacity", "0");
      $(".sleep-girl-hand ").css("opacity", "0");
      $(".sleep-girl-arm").css("opacity", "0");
      $(".cow-alarm").removeClass("cow-alarm-animation");
    }

    // 重置該頁面的所有動畫與音效
    function resetMilkPage() {
      $(".book24").css("opacity", "0");
      $(".book25").css("opacity", "0");
      $(".milk-hand").css("opacity", "0");
      $(".milk-cup").css("opacity", "0");
      $(".mom-right-hand").css("opacity", "0");
      $(".little-girl").css("opacity", "0");
      $(".girl-l-hand").css("opacity", "0");
      $(".girl-l-hand-milk").css("opacity", "0");
      $(".girl-l-hand-cup").css("opacity", "0");
      $(".girl-r-hand").css("opacity", "0");
      $(".flower").css("opacity", "0");
      $(".milk-inner").css("opacity", "0");
      $(".click-girl").hide();
      $(".milk-hand").removeClass("milk-hand-animation");
      $(".milk-drop").removeClass("milk-drop-show");
      $(".girl-l-hand").removeClass("girl-l-hand-empty");
      $(".girl-l-hand-region").removeClass("girl-l-hand-finish");
      $(".girl-r-hand").removeClass("girl-r-hand-finish");
      $(".milk-stains").removeClass("milk-stains-show");
      $(".milk-drop").removeClass("milk-drop-show");
      $(".milk-flower").css("dispaly", "none");
      $(".milk-flower").removeClass("milk-drop-show");
      $(".milk-smell").removeClass("milk-smell-animation");

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
      page2425Timeouts.push(
        setTimeout(() => {
          $(".book24").css("opacity", "1");
          $(".book25").css("opacity", "1");
          $(".milk-hand").css("opacity", "1");
          $(".milk-cup").css("opacity", "1");
          $(".mom-right-hand").css("opacity", "1");
          $(".little-girl").css("opacity", "1");
          $(".girl-l-hand").css("opacity", "1");
          $(".girl-l-hand-milk").css("opacity", "1");
          $(".girl-l-hand-cup").css("opacity", "1");
          $(".girl-r-hand").css("opacity", "1");
          $(".milk-flower").css("dispaly", "block");
        }, 1000)
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".flower").css("opacity", "1");
        }, 3000)
      );

      $(".milk-hand").addClass("milk-hand-animation");

      page2425Timeouts.push(
        setTimeout(() => {
          $(".milk-drop").addClass("milk-drop-show");
        }, 1700)
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".milk-inner").css("opacity", "1");
        }, 3000)
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".milk-flower").addClass("milk-drop-show");
          $(".milk-drop").removeClass("milk-drop-show");
        }, 5000)
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".milk-smell").addClass("milk-smell-animation");
        }, 6000)
      );
    }

    // 小女孩喝奶動畫流程（只綁一次，不堆疊）
    $(".click-girl")
      .off("click")
      .on("click", function () {
        if (window.matchMedia("(max-height: 500px)").matches) {
          page2425Timeouts.push(
            setTimeout(() => {
              if (isAndroidChrome()) {
                $(".girl-l-hand-finish").css({
                  top: (screenHeight * 314.276) / 609 + "px",
                  left: (screenHeight * 117.075) / 609 + "px",
                });
                $(".girl-r-hand-finish").css({
                  bottom: (screenHeight * 104.95) / 609 + "px",
                  right: (screenHeight * 212.32) / 609 + "px",
                });
              }

              if (isSafari() || isIOSChrome()) {
                $(".girl-l-hand-finish").css({
                  top: (visualHeight * 305) / 609 + "px",
                  left: (visualHeight * 125.14) / 609 + "px",
                });
                $(".girl-r-hand-finish").css({
                  bottom: (visualHeight * 114.1226) / 609 + "px",
                  right: (visualHeight * 212.13) / 609 + "px",
                });
              }
            }, 100)
          );
        }

        $(".click-girl").hide();
        $(".girl-l-hand-region").addClass("girl-l-hand-finish");
        $(".girl-r-hand").addClass("girl-r-hand-finish");

        playAudio("girl-drink-milk", 0);

        page2425Timeouts.push(
          setTimeout(() => {
            $(".girl-l-hand-milk").css("opacity", "0");
            playAudio("drinking-milk", 0);
          }, 1000)
        );

        page2425Timeouts.push(
          setTimeout(() => {
            $(".milk-stains").addClass("milk-stains-show");
          }, 1200)
        );

        page2425Timeouts.push(
          setTimeout(() => {
            for (let i = 1; i <= 6; i++) {
              $(`.flower0${i}`).addClass(`flower0${i}-finish`);
            }
            playAudio("flower-show", 0);
          }, 2300)
        );

        page2425Timeouts.push(
          setTimeout(() => {
            btnUnDisabled();
            canFlipNext = true;
            $("#right-down-corner").css("color", "#000");
            $("#right-down-corner").prop("disabled", false);
          }, 7000)
        );
      });

    // 第 26–27 頁 家人喝牛奶
    function startFamilyAnimation() {
      page2627Timeouts.push(
        setTimeout(() => {
          $(".book26").css("opacity", "1");
          $(".book27").css("opacity", "1");
        }, 1200)
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".cheers").addClass("cheers-show-animation");
          $(".milk-box").css("opacity", "1");
          $(".father-hand").css("opacity", "1");
          $(".father-hand-milk").css("display", "block");
          $(".father-hand-cup").css("opacity", "1");
          $(".daughter-hand").css("opacity", "1");
          $(".daughter-hand-milk").css("display", "block");
          $(".daughter-hand-cup").css("opacity", "1");
        }, 1500)
      );

      if (window.matchMedia("(max-height: 500px)").matches) {
        if (isAndroidChrome()) {
          $(".daughter-hand-finish").css({
            top: (screenHeight * 403.536) / 609 + "px", //273
            left: (screenHeight * 375.45) / 609 + "px", //254
          });

          page2627Timeouts.push(
            setTimeout(() => {
              $(".father-hand-finish-mb").css({
                transform:
                  `translate(` +
                  (screenHeight * -23.65) / 609 +
                  `px,` +
                  (screenHeight * -44.34) / 609 +
                  `px) rotate(-39deg)`, //transform: translate(-16px, -30px) rotate(-39deg);
              });
              $(".mom-hand-finish-mb").css({
                transform:
                  `translate(` +
                  (screenHeight * 84.255) / 609 +
                  `px,` +
                  (screenHeight * -75.386) / 609 +
                  `px) rotate(33deg)`,
              }); //transform: translate(57px, -51px) rotate(33deg);
            }, 3000)
          );
        }

        if (isSafari() || isIOSChrome()) {
          $(".daughter-hand-finish").css({
            top: (visualHeight * 404.073) / 609 + "px", //300
            left: (visualHeight * 377.1348) / 609 + "px", //280
          });

          page2627Timeouts.push(
            setTimeout(() => {
              $(".father-hand-finish-mb").css({
                transform:
                  `translate(` +
                  (visualHeight * 2.694) / 609 +
                  `px,` +
                  (visualHeight * -18.858) / 609 +
                  `px) rotate(-39deg)`, //transform: translate(2px, -14px) rotate(-39deg);
              });
              $(".mom-hand-finish-mb").css({
                transform:
                  `translate(` +
                  (visualHeight * 32.33) / 609 +
                  `px,` +
                  (visualHeight * -86.21) / 609 +
                  `px) rotate(33deg)`,
              }); //transform: translate(24px, -64px) rotate(33deg);
            }, 3000)
          );
        }
      }

      page2627Timeouts.push(
        setTimeout(() => {
          $(".daughter-hand-region").addClass("daughter-hand-finish");
        }, 3000)
      );

      if (window.matchMedia("(max-height: 500px)").matches) {
        page2627Timeouts.push(
          setTimeout(() => {
            $(".father-hand-region-mb").addClass("father-hand-finish-mb");
            $(".mom-hand-region-mb").addClass("mom-hand-finish-mb");
          }, 3000)
        );
      } else {
        page2627Timeouts.push(
          setTimeout(() => {
            $(".father-hand-region").addClass("father-hand-finish");
            $(".mom-hand-region").addClass("mom-hand-finish");
          }, 3000)
        );
      }

      page2627Timeouts.push(
        setTimeout(() => {
          $(".father-hand-milk").css("opacity", "0");
          $(".daughter-hand-milk").css("opacity", "0");
          $(".mom-hand-milk").css("opacity", "0");
        }, 4000)
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".all-milk-stains ").addClass("all-milk-stains-show ");
        }, 4000)
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".cow-right").addClass("cow-right-move");
        }, 4000)
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".sweet-taste").addClass("sweet-taste-animation");
          $(".mow").show();
        }, 4500)
      );
    }

    // Reset function
    // 重置家人手部與牛相關動畫狀態
    function resetFamilyPage() {
      $(".book26").css("opacity", "0");
      $(".book27").css("opacity", "0");
      $(".milk-box").css("opacity", "0");
      $(".father-hand").css("opacity", "0");
      $(".father-hand-milk").css("display", "none");
      $(".father-hand-cup").css("opacity", "0");
      $(".daughter-hand").css("opacity", "0");
      $(".daughter-hand-milk").css("display", "none");
      $(".daughter-hand-cup").css("opacity", "0");
      $(".mom-hand-milk").css("opacity", "0");
      $(".cheers").removeClass("cheers-show-animation");
      const removeClasses = [
        // 手部完成、移除
        "father-hand-finish",
        "daughter-hand-finish",
        "mom-hand-finish",
        "mom-hand-finish-mb",
        "father-hand-finish-mb",

        // 空手動畫
        "father-hand-milk-empty",
        "daughter-hand-milk-empty",
        "mom-hand-milk-empty",

        // 墨水效果
        "all-milk-stains-show",

        // 牛移動動畫
        "cow-right-move",
      ];

      // 批次移除所有指定 class
      $(
        ".father-hand, .daughter-hand, .mom-hand, .all-milk-stains, .girls-milk-ink, .cow-right"
      ).removeClass(removeClasses.join(" "));

      // 隱藏叫聲
      $(".mow").hide();
    }

    // 翻到該頁才開始動作
    $("#flipbook").bind("turned", function (event, page) {
      // 第 24–25 頁：點擊小女孩喝牛奶
      if (page === 24 || page === 25) {
        isCanNotFlip();
        setTimeout(() => {
          canFlipPrev = true;
        }, 3000);
        btnPreviousDisabled();
        btnDisabled();

        resetMilkPage(); // 每次重進頁面重置一次

        page2425Timeouts.push(
          setTimeout(() => {
            $(".click-girl").show();
          }, 1000)
        );

        startMilkAnimation();
      } else {
        resetMilkPage();
      }
    });

    // Turn.js event
    $("#flipbook").bind("turning", function (event, page) {
      if (page === 26 || page === 27) {
        page2627Timeouts.push(
          setTimeout(() => {
            $("#right-down-corner").show();
          }, 500)
        );

        if (window.matchMedia("(max-height: 500px)").matches) {
          page2627Timeouts.push(
            setTimeout(() => {
              $("#flipbook").append(
                ' <div class="mom-hand-region-mb"><div class="mom-hand-milk-region"><img class="mom-hand-milk" src="./images/book/book2627/牛奶.png"/><img class="mom-hand-cup" src="./images/book/book2627/空杯.png"/></div><img class="mom-hand" src="./images/book/book2627/媽媽手.png"/></div>'
              );
            }, 1500)
          );
        } else {
          if (!$(".mom-hand").length) {
            page2627Timeouts.push(
              setTimeout(() => {
                $("#flipbook").append(
                  ' <div class="mom-hand-region"><div class="mom-hand-milk-region"><img class="mom-hand-milk" src="./images/book/book2627/牛奶.png"/><img class="mom-hand-cup" src="./images/book/book2627/空杯.png"/></div><img class="mom-hand" src="./images/book/book2627/媽媽手.png"/></div>'
                );
              }, 1500)
            );
          }
        }

        page2627Timeouts.push(
          setTimeout(() => {
            $(".mom-hand").css("opacity", "1");
            $(".mom-hand-milk").css("opacity", "1");
            $(".mom-hand-cup").css("opacity", "1");
          }, 2000)
        );
      } else {
        if (window.matchMedia("(max-height: 500px)").matches) {
          $(".mom-hand-region-mb").remove();
          $(".mom-hand-region-mb").removeClass("mom-hand-finish-mb");
        } else {
          $(".mom-hand-region").remove();
          $(".mom-hand").removeClass("mom-hand-finish");
        }
      }

      if (page === 28) {
        setTimeout(() => {
          $(".book28").css("opacity", "1");
          $(".cloud-28").css("opacity", "1");
          $(".bubble-28").css("opacity", "1");
          $(".star-28").addClass("star-28-animation");
          $(".story-28").css("opacity", "1");
          $(".grass-28").css("opacity", "1");
          $(".fence-28").css("opacity", "1");
          $(".cow-28-1").css("opacity", "1");
          $(".cow-28-2").css("opacity", "1");
        }, 1000);

        $("#right-down-corner").hide();
        isCanNotFlip();
        setTimeout(() => {
          canFlipPrev = true;
        }, 3000);
        let count = 3;
        $(".next-page img").attr("src", "./images/common/下一頁深藍.png");
        $(".next-page img").css("cursor", "not-allowed");
        $(".next-page").prop("disabled", true);
        const prevBtn = $(".next-page")[0];

        $(".prev-page img").attr("src", "./images/common/上一頁深藍.png");
        $(".prev-page img").css("cursor", "not-allowed");
        $(".prev-page img").attr("src", "./images/common/3秒.png");
        $(".prev-page").prop("disabled", true);

        const timer = setInterval(() => {
          count--;

          if (count > 0) {
            $(".prev-page img").attr("src", `./images/common/${count}秒.png`);
            $(".prev-page").css("cursor", "not-allowed");
            $(".prev-page").prop("disabled", true);
          } else {
            clearInterval(timer);
            $(".prev-page img").attr("src", "./images/common/上一頁.png");
            $(".prev-page").css("cursor", "pointer");
            $(".prev-page").prop("disabled", false);
          }
        }, 1000);

        setTimeout(() => {
          $(".prev-page img").attr("src", "./images/common/上一頁.png");
          $(".prev-page").prop("disabled", false);
        }, 3000);
      }
    });

    $("#flipbook").bind("turned", function (event, page) {
      // 第 26–27 頁：家人一起喝牛奶
      if (page === 26 || page === 27) {
        startFamilyAnimation();
      } else {
        resetFamilyPage();

        if (window.matchMedia("(max-height: 500px)").matches) {
          if (isSafari() || isIOSChrome()) {
            $(".father-hand-region-mb").css({
              width: (visualHeight * 296.34) / 609 + "px", //220px
              top: (visualHeight * 360.727) / 609 + "px", //267.8px
              left: (visualHeight * 85.39) / 609 + "px", //53px
              transform: "translate(0,0) rotate(0deg)",
            });
          }
          if (isAndroidChrome()) {
            $(".father-hand-region-mb").css({
              width: (screenHeight * 325.197) / 609 + "px", //220px
              top: (screenHeight * 395.85) / 609 + "px", //267.8px
              left: (screenHeight * 78.34) / 609 + "px", //53px
              transform: "translate(0,0) rotate(0deg)",
            });
          }
        }

        $(".father-hand-region").removeClass("father-hand-finish");
        $(".daughter-hand-region").removeClass("daughter-hand-finish");
        $(".father-hand-milk").css("opacity", "1");
        $(".daughter-hand-milk").css("opacity", "1");
        $(".mom-hand-milk").css("opacity", "1");
        $(".daughter-hand-milk").removeClass("daughter-hand-milk-empty");
        $(".sweet-taste").removeClass("sweet-taste-animation");
      }
    });

    if (
      page !== 1 &&
      page !== 6 &&
      page !== 7 &&
      page !== 12 &&
      page !== 13 &&
      page !== 14 &&
      page !== 15 &&
      page !== 16 &&
      page !== 17 &&
      page !== 24 &&
      page !== 28
    ) {
      allBtnDisabled(page);
      isCanNotFlip();
      // 延遲三秒後才能翻頁
      setTimeout(() => {
        canFlipPrev = true;
        canFlipNext = true;
      }, 3000);
    }

    if (window.matchMedia("(max-height: 500px)").matches) {
      if (page === 4 || page === 5) {
        if (isSafari() || isIOSChrome()) {
          $(".moms-hand-5").css({
            bottom: (visualHeight * 153) / 609 + "px",
          });
        }
        if (isAndroidChrome()) {
          $(".moms-hand-5").css({
            bottom: (screenHeight * 153) / 609 + "px",
          });
        }
      }

      // 第 6–7 頁：點擊門跑出森林
      if (page === 6 || page === 7) {
        $("#flipbook").append(
          '<img class="clouds" src="./images/book/book0607/雲.png"/>'
        );

        if (isSafari() || isIOSChrome()) {
          $(".knock").css({
            right: (visualHeight * 296.34) / 609 + "px", //220
            bottom: (visualHeight * 188.58) / 609 + "px", //140
          });
        }
        if (isAndroidChrome()) {
          $(".knock").css({
            right: (screenHeight * 280.85) / 609 + "px", //190
            bottom: (screenHeight * 184.77) / 609 + "px", //125
          });

          if (screenHeight <= 360) {
            $(".door-common").css({
              bottom: "8%",
            });
            $(".wow").css({
              width: "15%",
              right: "65%",
              bottom: "8%",
            });
          }
        }
      } else {
        $("#flipbook .clouds").remove();
        $(".clouds").removeClass("cloud-fade-in");
      }

      if (page === 8 || page === 9) {
        if (screenHeight <= 360) {
          $(".foot").css({
            width: "15%",
          });
        }
      }

      if (page === 16 || page === 17) {
        $(".click-hearing-heart").css({
          right: (visualHeight * 180) / 609 + "px",
          bottom: (visualHeight * 70) / 609 + "px",
        });
      }
      if (isAndroidChrome()) {
        $(".click-hearing-heart").css({
          right: (screenHeight * 180) / 609 + "px",
          bottom: (screenHeight * 70) / 609 + "px",
        });
      }

      if (page === 18 || page === 19) {
        if (isSafari() || isIOSChrome()) {
          $(".crown").css({
            width: (visualHeight * 150) / 609 + "px",
            height: (visualHeight * 150) / 609 + "px",
          });
          $(".coin-all").css({
            width: (visualHeight * 130) / 609 + "px",
            height: (visualHeight * 130) / 609 + "px",
          });
        }
        if (isAndroidChrome()) {
          $(".crown").css({
            width: (screenHeight * 150) / 609 + "px",
            height: (screenHeight * 150) / 609 + "px",
          });
          $(".coin-all").css({
            width: (screenHeight * 130) / 609 + "px",
            height: (screenHeight * 130) / 609 + "px",
          });
        }
      }
      console.log("visualHeight:", visualHeight);
      console.log("screenHeight:", screenHeight);

      if (page === 24 || page === 25) {
        if (isSafari() || isIOSChrome()) {
          $(".girl-l-hand-region").css({
            top: (visualHeight * 373.1) / 609 + "px",
            left: (visualHeight * 120.14) / 609 + "px",
          });
          $(".girl-l-hand").css({
            right: (visualHeight * 59.264) / 609 + "px", //44
          });
          $(".girl-r-hand").css({
            bottom: (visualHeight * 72.177) / 609 + "px",
            right: (visualHeight * 210.576) / 609 + "px",
          });
        }
        if (isAndroidChrome()) {
          $(".girl-l-hand-region").css({
            top: (screenHeight * 363.6) / 609 + "px",
            left: (screenHeight * 117.075) / 609 + "px",
          });

          $(".girl-l-hand").css({
            right: (screenHeight * 67.404) / 609 + "px", //45.6
          });

          if (screenHeight <= 360) {
            $(".girl-l-hand-cup").css({
              bottom: (screenHeight * 144.638) / 609 + "px",
              right: (screenHeight * 42.62) / 609 + "px",
            });
            $(".girl-l-hand-milk").css({
              bottom: (screenHeight * 147.18) / 609 + "px",
              right: (screenHeight * 50.75) / 609 + "px",
            });
          } else {
            $(".girl-l-hand-cup").css({
              bottom: "54%",
            });
            $(".girl-l-hand-milk").css({
              bottom: "55%",
            });
          }

          $(".girl-l-hand").css({
            width: (screenHeight * 109.96) / 609 + "px",
          });
          $(".girl-r-hand").css({
            width: (screenHeight * 192.16) / 609 + "px",
            bottom: (screenHeight * 58.8) / 609 + "px",
            right: (screenHeight * 209.5) / 609 + "px",
          });
        }
      }

      if (page === 26 || page === 27) {
        if (isSafari() || isIOSChrome()) {
          $(".cheers").css({
            bottom: (visualHeight * 385) / 609 + "px", //259.6px
          });
          $(".milk-box").css({
            width: (visualHeight * 96.984) / 609 + "px", //72px
            top: (visualHeight * 280.176) / 609 + "px", //208px
            left: (visualHeight * 192.621) / 609 + "px", //143px
          });

          $(".father-hand-region-mb").css({
            width: (visualHeight * 296.34) / 609 + "px", //220px
            top: (visualHeight * 360.727) / 609 + "px", //267.8px
            left: (visualHeight * 85.39) / 609 + "px", //53px
          });

          $(".father-hand").css({
            width: (visualHeight * 269.4) / 609 + "px", //200px
            left: (visualHeight * 2.97) / 609 + "px", //2.2px
          });

          $(".father-hand-cup").css({
            width: (visualHeight * 66.003) / 609 + "px", //49px
            bottom: (visualHeight * -67.478) / 609 + "px", //-50px
            left: (visualHeight * 211.479) / 609 + "px", //157px
          });

          $(".father-hand-milk").css({
            width: (visualHeight * 67.35) / 609 + "px", //50px
            bottom: (visualHeight * -67.478) / 609 + "px", //-50px
            left: (visualHeight * 216.867) / 609 + "px", //161px
          });

          $(".daughter-hand-region").css({
            top: (visualHeight * 390.6) / 609 + "px", //290
            left: (visualHeight * 371.74) / 609 + "px", //276
          });

          $(".daughter-hand").css({
            width: (visualHeight * 53.88) / 609 + "px", //40px
          });

          $(".daughter-hand-cup").css({
            width: (visualHeight * 53.88) / 609 + "px", //40px
          });

          $(".daughter-hand-milk").css({
            width: (visualHeight * 53.88) / 609 + "px", //40px
            bottom: (visualHeight * -98.331) / 609 + "px", //-73
            left: (visualHeight * 35) / 609 + "px", //26px
          });

          setTimeout(() => {
            $(".mom-hand-region-mb").css({
              bottom: (visualHeight * 204.744) / 609 + "px", //152px
              right: (visualHeight * 673.5) / 609 + "px", //500px
              opacity: "1",
            });

            $(".mom-hand").css({
              width: (visualHeight * 208.785) / 609 + "px", //155px
            });

            $(".mom-hand-cup").css({
              width: (visualHeight * 53.88) / 609 + "px", //40px
              bottom: (visualHeight * -76.78) / 609 + "px", //-57px
              left: (visualHeight * 8.082) / 609 + "px", //-6px
            });

            $(".mom-hand-milk").css({
              width: (visualHeight * 53.88) / 609 + "px", //40px
              bottom: (visualHeight * -76.78) / 609 + "px", //-57px
              left: (visualHeight * 8.082) / 609 + "px", //-6px
            });
          }, 1800);
        }
        if (isAndroidChrome()) {
          $(".cheers").css({
            bottom: (screenHeight * 383.73) / 609 + "px", //259.6px
          });
          $(".milk-box").css({
            width: (screenHeight * 106.427) / 609 + "px", //72px
            top: (screenHeight * 307.456) / 609 + "px", //208px
            left: (screenHeight * 211.3765) / 609 + "px", //143px
          });

          $(".father-hand-region-mb").css({
            width: (screenHeight * 325.197) / 609 + "px", //220px
            top: (screenHeight * 395.85) / 609 + "px", //267.8px
            left: (screenHeight * 78.34) / 609 + "px", //53px
          });

          $(".father-hand").css({
            width: (screenHeight * 295.63) / 609 + "px", //200px
            left: (screenHeight * 3.25) / 609 + "px", //2.2px
          });

          $(".father-hand-cup").css({
            width: (screenHeight * 72.43) / 609 + "px", //49px
            bottom: (screenHeight * -73.91) / 609 + "px", //-50px
            left: (screenHeight * 232.07) / 609 + "px", //157px
          });

          $(".father-hand-milk").css({
            width: (screenHeight * 73.9) / 609 + "px", //50px
            bottom: (screenHeight * -73.91) / 609 + "px", //-50px
            left: (screenHeight * 237.8) / 609 + "px", //161px
          });

          $(".daughter-hand-region").css({
            top: (screenHeight * 395.85) / 609 + "px", //267.8px
            left: (screenHeight * 371.475) / 609 + "px", //251.31px
          });

          $(".daughter-hand").css({
            width: (screenHeight * 59.126) / 609 + "px", //40px
          });

          $(".daughter-hand-cup").css({
            width: (screenHeight * 59.126) / 609 + "px", //40px
          });

          $(".daughter-hand-milk").css({
            width: (screenHeight * 59.126) / 609 + "px", //40px
            bottom: (screenHeight * -107.9) / 609 + "px", //-73
            left: (screenHeight * 38.432) / 609 + "px", //26px
          });

          $(".all-milk-stains ").css({
            height: screenHeight + "px",
          });

          setTimeout(() => {
            $(".mom-hand-region-mb").css({
              bottom: (screenHeight * 224.68) / 609 + "px", //152px
              right: (screenHeight * 739.078) / 609 + "px", //500px
              opacity: "1",
            });

            $(".mom-hand").css({
              width: (screenHeight * 229.114) / 609 + "px", //155px
            });

            $(".mom-hand-cup").css({
              width: (screenHeight * 59.126) / 609 + "px", //40px
              bottom: (screenHeight * -82.255) / 609 + "px", //-57px
              left: (screenHeight * 8.869) / 609 + "px", //-6px
            });

            $(".mom-hand-milk").css({
              width: (screenHeight * 59.126) / 609 + "px", //40px
              bottom: (screenHeight * -82.255) / 609 + "px", //-57px
              left: (screenHeight * 8.869) / 609 + "px", //-6px
            });
          }, 1800);
        }
      }
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
      if (!isIPad()) {
        if (page === 1) {
          if (!window.matchMedia("(max-height: 500px)").matches) {
            $(".book-section").css({
              left: "-300px",
            });
          }
        } else if (
          page === 28 &&
          !window.matchMedia("(max-height: 500px)").matches
        ) {
          $(".book-section").css({
            left: "17%",
          });
        } else {
          $(".book-section").css({
            left: "0px",
          });
        }
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

  let canFlip = true;
  let canSwipePrev = false;
  let canSwipeNext = false;

  let touchStartX = 0;
  let touchEndX = 0;

  let currentMobilePage = 1;

  const flipbook = document.getElementById("flipbook");

  /* ======================
   頁面規則控制
====================== */
  function applyPageRule(page) {
    // 預設：全部開放
    canSwipePrev = true;
    canSwipeNext = true;

    if (isIPad() && isSafari()) {
      $(".book-section").addClass("book-section-ipad-safari");
      $(".controls").addClass("controls-ipad-safari");
    }
    if (isIPad() && isIOSChrome()) {
      $(".book-section").addClass("book-section-ipad-chorme");
      $(".controls").addClass("controls-ipad-chorme");
    }

    // 第一頁：不能往回
    if (page === 1) {
      canSwipePrev = false;
      if (isIPad() && isSafari()) {
        $(".book-section").css({
          left: (visualHeight * -240) / 609 + "px", //-342.72
          marginTop: (visualHeight * 20) / 609 + "px",
        });
      }
      if (isIPad() && isIOSChrome()) {
        $(".book-section").css({
          left: (visualHeight * -330) / 609 + "px", //-342.72
          marginTop: (visualHeight * -30) / 609 + "px",
        });
      }

      if (window.matchMedia("(max-height: 500px)").matches) {
        if (isSafari() || isIOSChrome()) {
          $(".book-section").css({
            left: (visualHeight * -312.48) / 609 + "px", //-232
          });
        }
        if (isAndroidChrome()) {
          $(".book-section").css({
            left: (screenHeight * 153) / 609 + "px",
          });
        }
      }
    } else {
      if (isIPad() && isSafari()) {
        if (page === 28) {
          $(".book-section").css({
            left: (visualHeight * 180) / 609 + "px", //-342.72
          });
        } else {
          $(".book-section").css({
            left: (visualHeight * -40) / 609 + "px",
          });
        }
      }

      if (isIPad() && isIOSChrome()) {
        if (page === 28) {
          $(".book-section").css({
            left: (visualHeight * 120) / 609 + "px", //164.46
          });
        } else {
          $(".book-section").css({
            left: (visualHeight * -120) / 609 + "px", //-342.72
          });
        }
      }
    }

    // 第 6–7 頁：點擊門跑出森林
    if (page === 6 || page === 7) {
      canSwipePrev = false;
      canSwipeNext = false;

      // 3 秒後允許往回
      setTimeout(() => {
        canSwipePrev = true;
      }, 3000);

      // 點 knock 才能準備往前
      $("#flipbook .knock").one("click", function () {
        setTimeout(() => {
          canSwipeNext = true;
        }, 12000);
      });
    }

    // 第 12-13 頁：魔法棒+電風扇
    if (page === 12 || page === 13) {
      canSwipePrev = false;
      canSwipeNext = false;

      // 3 秒後允許往回
      setTimeout(() => {
        canSwipePrev = true;
      }, 3000);

      // 點 click-magic-wand 才能準備往前
      $("#flipbook .click-magic-wand").one("click", function () {
        setTimeout(() => {
          canSwipeNext = true;
        }, 15000);
      });
    }

    // 第 14–15 頁：餵牛奶
    if (page === 14 || page === 15) {
      canSwipePrev = false;
      canSwipeNext = false;

      // 3 秒後允許往回
      setTimeout(() => {
        canSwipePrev = true;
      }, 3000);

      // 點 click-milk 才能準備往前
      $("#flipbook .click-milk").one("click", function () {
        setTimeout(() => {
          canSwipeNext = true;
        }, 12000);
      });
    }

    // 第 16–17 頁：聽牛心跳
    if (page === 16 || page === 17) {
      canSwipePrev = false;
      canSwipeNext = false;

      // 3 秒後允許往回
      setTimeout(() => {
        canSwipePrev = true;
      }, 3000);

      // 點 knock 才能準備往前
      $("#flipbook .click-hearing-heart").one("click", function () {
        setTimeout(() => {
          canSwipeNext = true;
        }, 14000);
      });
    }

    // 第 24–25 頁：點擊小女孩喝牛奶
    if (page === 24 || page === 25) {
      canSwipePrev = false;
      canSwipeNext = false;

      // 3 秒後允許往回
      setTimeout(() => {
        canSwipePrev = true;
      }, 3000);

      // 點 knock 才能準備往前
      $(".click-girl").one("click", function () {
        setTimeout(() => {
          canSwipeNext = true;
        }, 7000);
      });
    }
  }

  /* ======================
   turned 事件
====================== */
  $("#flipbook").on("turned", function (e, page) {
    currentMobilePage = page;
    applyPageRule(page);
  });

  /* ======================
   🔥 初始化補救（一開始page是undefined關鍵）
====================== */
  $(document).ready(function () {
    const initPage = $("#flipbook").turn("page") || 1;
    currentMobilePage = initPage;
    applyPageRule(initPage);
  });

  /* ======================
   touch events
====================== */
  flipbook.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  flipbook.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  /* ======================
   swipe事件
====================== */
  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) < 30) return;
    if (!canFlip) return;

    // 👉 向右滑：previous
    if (swipeDistance > 0) {
      if (!canSwipePrev) return;
      lockFlip();
      $("#flipbook").turn("previous");
    }

    // 👉 向左滑：next
    if (swipeDistance < 0) {
      if (!canSwipeNext) return;
      lockFlip();
      $("#flipbook").turn("next");
    }
  }

  /* ======================
   冷卻鎖
====================== */
  function lockFlip() {
    canFlip = false;
    setTimeout(() => {
      canFlip = true;
    }, 3000);
  }
});
