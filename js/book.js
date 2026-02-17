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
  const widtScreenhGap = (screenWidth - screenHeight * 2) / 2;

  const vh = window.visualViewport.height;
  function updateHeight() {
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  let isBookStarted = false;

  const BG_VOLUME = 0.3;
  const VOICE_VOLUME = 1.2;

  let page23Timeouts = [];
  let page67Timeouts = [];
  let page89Timeouts = [];
  let page1011Timeouts = [];
  let page1213Timeouts = [];
  let page1415Timeouts = [];
  let page1617Timeouts = [];
  let page1819Timeouts = [];
  let page2021Timeouts = [];
  let page2223Timeouts = [];
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

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // 背景音樂音量控制
  const bgGainNode = audioContext.createGain();
  bgGainNode.gain.value = BG_VOLUME; // 🔹 背景音量（0 ~ 1）

  // 語音音量控制
  const voiceGainNode = audioContext.createGain();
  voiceGainNode.gain.value = 1.5; // 🔹 語音音量（可超過1，但小心失真）

  // 接到輸出
  bgGainNode.connect(audioContext.destination);

  let bgSource = null;

  async function playBackground() {
    const response = await fetch("./mp3/background.wav");
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    bgSource = audioContext.createBufferSource();
    bgSource.buffer = audioBuffer;
    bgSource.loop = true;

    // 接到背景音量控制
    bgSource.connect(bgGainNode);

    bgSource.start(0);
  }

  if (!window.matchMedia("(max-height: 500px)").matches) {
    $flipbook.turn({
      width: 1200,
      height: 600,
      autoCenter: true,
    });
  } else {
    $(".pop-up-box").on("click", async function () {
      $(".pop-up-box").css("display", "none");
      if (!isBookStarted) {
        isBookStarted = true;

        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        playBackground();
        playVoice("./mp3/01.mp3");
        $("#cover").addClass("book01-start");
        console.log(voiceGainNode.gain.value);
      }
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
      console.log("widtScreenhGap;", widtScreenhGap);
      $("#left-up-corner").css({
        top: barHeight,
        left: (visualWidth - screenHeight * 2) / 2 + "px",
      });
      $("#right-up-corner").css({
        top: barHeight,
        right: (visualWidth - screenHeight * 2) / 2 + "px",
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
      navigator.userAgent,
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
    $(".next-page img").attr("src", "./images/common/下一頁灰.png");
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
      },
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
    $(".prev-page img").attr("src", "./images/common/上一頁灰.png");
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
  $(".next-page").on("click", async function () {
    if (!isBookStarted) {
      isBookStarted = true;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      playBackground();
      playVoice("./mp3/01.mp3");
      $("#cover").addClass("book01-start");
      $(".next-page img").attr("src", "./images/common/下一頁.png");
      $(".prev-page").show();
      $(".book-cover").remove();

      return;
    }

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

    if (isMuted) {
      bgGainNode.gain.value = 0;
      voiceGainNode.gain.value = 0;
    } else {
      bgGainNode.gain.value = BG_VOLUME; // 你原本背景音量
      voiceGainNode.gain.value = VOICE_VOLUME; // 你原本語音音量
    }

    // 切換 icon + 文字（保留你原本 UI）
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
      if (this.id.startsWith("audio-")) {
        this.pause();
        this.currentTime = 0;
      }
    });
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
        console.log("pre disabled~~~~");
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

      $("#left-down-corner").hide();
      $(".next-page img").attr("src", "./images/common/下一頁灰.png");
      $(".next-page img").css("cursor", "not-allowed");
      $(".next-page").prop("disabled", true);
      const prevBtn = $(".next-page")[0];

      $(".prev-page img").attr("src", "./images/common/上一頁灰.png");
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

      $("#flipbook").append(
        ` <img class="girls-head03" src="./images/book/book03/girls-head-01.png"/>       
          <img class="hands03" src="./images/book/book03/hands.png"/>        
          <img class="milk03" src="./images/book/book03/milk.png"/>       
          <img class="book03-title" src="./images/book/book03/book-title03.png"/>               
        `,
      );

      page23Timeouts.push(
        setTimeout(() => {
          $(".book02").css("opacity", "1");
          $(".text02").css("opacity", "1");
          $(".book03").css("opacity", "1");
          $(".book03-title").css("opacity", "1");
          $(".girls-head03").css("opacity", "1");
          $(".milk03").css("opacity", "1");
          $(".hands03").css("opacity", "1");
        }, 1000),
      );

      const img = document.querySelector(".girls-head03");

      const images = [
        "./images/book/book03/girls-head-01.png",
        "./images/book/book03/girls-head-02.png",
      ];

      let index = 0;

      setTimeout(() => {
        setInterval(() => {
          index = (index + 1) % images.length;
          img.src = images[index];
        }, 500);
      }, 1500);
    } else {
      page23Timeouts.forEach((id) => clearTimeout(id));
      page23Timeouts = [];
      $(".book02").css("opacity", "0");
      $(".text02").css("opacity", "0");
      $(".book03").css("opacity", "0");
      $(".book03-title").css("opacity", "0");
      $(".girls-head03").css("opacity", "0");
      $(".milk03").css("opacity", "0");
      $(".hands03").css("opacity", "0");
      $("#flipbook .girls-head03").remove();
      $("#flipbook .milk03").remove();
      $("#flipbook .hands03").remove();
      $("#flipbook .girls-head03").remove();
    }

    if (page === 1 || page === 4) {
      $("#flipbook .cloud01").remove();
      $("#flipbook .book03-title").remove();
    }

    if (page === 4 || page === 5) {
      setTimeout(() => {
        $(".book04").css("opacity", "1");
        $(".text04").css("opacity", "1");
        $(".eyes-4").css("opacity", "1");
      }, 1000);

      setTimeout(() => {
        $(".eyes-ball").addClass("eyes-ball-animation");
        $(".eyes-4").addClass("eyes-big-animation");
        $(".question").addClass("question-animation");
      }, 8000);

      setTimeout(() => {
        $(".book05").css("opacity", "1");
        $(".text05").css("opacity", "1");
        $(".daughter-5").css("opacity", "1");
        $(".moms-head-5").css("opacity", "1");
        $(".daughter-hand-5").css("opacity", "1");
        $(".moms-hand-5").css("opacity", "1");
      }, 22000);

      setTimeout(() => {
        $(".gogo").css("opacity", "1");
      }, 30000);
    } else {
      $(".eyes-4").removeClass("eyes-big-animation");
      $(".question").removeClass("question-animation");
      $(".book04").css("opacity", "0");
      $(".text04").css("opacity", "0");
      $(".text05").css("opacity", "0");
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
        }, 1000),
      );

      isCanNotFlip();

      page67Timeouts.push(
        setTimeout(() => {
          canFlipPrev = true;
        }, 3000),
      );

      if (!doorClickBound) {
        doorClickBound = true;

        $("#flipbook").append(
          `<img class="knock" src="./images/book/book0607/點這裡.png"/>
          <img class="grass0607" src="./images/book/book0607/草地.png"/>
          <img class="tree1" src="./images/book/book0607/森林1.png"/>
          <img class="tree2" src="./images/book/book0607/森林2.png"/>           
          <img class="tree3" src="./images/book/book0607/森林3.png"/>         
          <img class="text06" src="./images/book/book0607/text-06.png"/>        
          <img class="cloud2" src="./images/book/book0607/雲2.png"/>           
          <img class="bubble67" src="./images/book/book0607/牛奶泡泡.png"/>           
          <img class="star5" src="./images/book/book0607/亮晶晶.png"/>         
          <img class="door-bg door-common" src="./images/book/book0607/門內.png"/>           
          <img class="door door-common" src="./images/book/book0607/門.png"/>            
          <img class="peoples" src="./images/book/book0607/媽媽鈴鈴.png"/>
        `,
        );

        page67Timeouts.push(
          setTimeout(() => {
            $(".door-bg").css("opacity", "1");
          }, 2000),
        );

        const door = document.querySelector(".door");

        btnPreviousDisabled();
        btnDisabled();

        $("#flipbook .knock , #flipbook .door").on("click", () => {
          $(".knock").css("display", "none");
          playVoice("./mp3/knock.mp3");
          $(".text06").addClass("cloud-fade-in");
          $(".cloud1").addClass("cloud-fade-in");

          page67Timeouts.push(
            setTimeout(() => {
              $(".grass0607").addClass("tree-fade-in");
              $(".tree1").addClass("tree-fade-in");
            }, 2500),
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".wow").addClass("wow-animation");
              $(".tree2").addClass("tree-fade-in");
              $(".door").addClass("door-opening");
              $(".peoples").addClass("peoples-open");
            }, 3000),
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".tree3").addClass("tree-fade-in");
              $(".cloud2").addClass("cloud-fade-in");
              $(".cloud3").addClass("cloud-fade-in");
            }, 4000),
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".bubble67").addClass("bubble-fade-in");
            }, 6000),
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".star5").addClass("star-fade-in");
            }, 7000),
          );

          page67Timeouts.push(
            setTimeout(() => {
              btnUnDisabled();
              canFlipNext = true;
              $("#right-down-corner").css("color", "#000");
              $("#right-down-corner").prop("disabled", false);
            }, 11000),
          );

          playVoice("./mp3/04.mp3");
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
      $("#flipbook .text06").remove();
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
      $(".text06").removeClass("tree-fade-in");
      $(".wow").removeClass("wow-animation");
    }

    if (page === 8 || page === 9) {
      $("#flipbook").append(
        `<img class="mom-daughter" src="./images/book/book08/鈴鈴媽媽.png"/>
        <img class="bubble7" src="./images/book/book08/牛奶泡泡.png"/>
        <img class="star7" src="./images/book/book09/亮晶晶.png"/>
        `,
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".book08").css("opacity", "1");
          $(".book09").css("opacity", "1");
          $(".eyes-8").css("opacity", "1");
          $(".eyes-ball-8").css("opacity", "1");
        }, 1000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".mom-daughter").css("opacity", "1");
        }, 1000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".foot1").addClass("foot1-animation");
          $(".foot2").addClass("foot2-animation");
          $(".foot3").addClass("foot3-animation");
          $(".foot4").addClass("foot4-animation");
          $(".foot5").addClass("foot5-animation");
        }, 8000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".eyes-ball-8").addClass("eyes-ball-animation");
          $(".mom-daughter").addClass("mom-daughter-animation");
        }, 9000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".text09").addClass("bubble-fade-in");
        }, 11000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".mowmow").addClass("bubble-fade-in");
          $(".bubble7").addClass("bubble-fade-in");
        }, 12000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".star7").addClass("star-fade-in");
        }, 10000),
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
      $(".mowmow").removeClass("bubble-fade-in");
      $(".text09").removeClass("bubble-fade-in");
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
      $("#flipbook").append(
        ` <img class="text11" src="./images/book/book11/text11.png">
        <img class="girls-head" src="./images/book/book10/媽媽鈴鈴.png"/>        
        <img class="rainbow"  src="./images/book/book11/彩虹.png"/>
        <img class="star11" src="./images/book/book11/亮晶晶.png">
        <img class="bubble11" src="./images/book/book11/牛奶泡泡.png">
        <img class="cloud-group" src="./images/book/book11/雲01.png">
        <img class="cow05" src="./images/book/book10/牛05.png"/>
        <img src="./images/book/book11/手.png" class="list-board"/>
        <img src="./images/book/book11/清單內容.png" class="list"/>
        `,
      );

      page1011Timeouts.push(
        setTimeout(() => {
          $(".cloud-01").addClass("cloud-animation");
          $(".cloud-02").addClass("cloud-animation");
        }, 50),
      );

      page1011Timeouts.push(
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
          $(".bubble11").addClass("bubble-fade-in");
        }, 1000),
      );

      page1011Timeouts.push(
        setTimeout(() => {
          $(".list").addClass("bubble-fade-in");
          $(".star11").addClass("star-fade-in");
        }, 2000),
      );

      page1011Timeouts.push(
        setTimeout(() => {
          $(".book10-text").addClass("bubble-fade-in");
        }, 13000),
      );
    }

    page1011Timeouts.push(
      setTimeout(() => {
        $(".text11").css("opacity", "1");
      }, 17000),
    );

    let popupBoard = () => {
      $(".check-box").on("click", function () {
        $("body").addClass("popup-open"); // 開啟 popup
        $(".popup-board").css("display", "block");
      });

      $(".popup-board").on("click", function () {
        $(".popup-board").css("display", "none");
        $("body").removeClass("popup-open"); // 關閉 popup
      });

      $(".popup-board-bg").on("click", function () {
        $(".popup-board").css("display", "none");
        $("body").removeClass("popup-open"); // 關閉 popup
      });
    };

    if (page === 9 || page === 12) {
      page1011Timeouts.forEach((id) => clearTimeout(id));
      page1011Timeouts = [];
      $(".book100").css("opacity", "1");
      $(".book10").css("opacity", "0");
      $(".book110").css("opacity", "1");
      $(".book11").css("opacity", "0");
      $(".text11").css("opacity", "0");
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
      $(".list").removeClass("bubble-fade-in");
      $(".cloud-01").removeClass("cloud-animation");
      $(".cloud-02").removeClass("cloud-animation");
      $(".book10-text").removeClass("bubble-fade-in");
      $("#flipbook .rainbow").remove();
      $("#flipbook .cloud-group").remove();
      $("#flipbook .girls-head").remove();
      $("#flipbook .cow05").remove();
      $("#flipbook .list-board").remove();
      $("#flipbook .list").remove();
      $("#flipbook .bubble11").remove();
      $("#flipbook .star11").remove();
      $("#flipbook .text11").remove();
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
                   <img class="text text12" src="./images/book/book12/text12.png"/>
                   <img class="electfan-wind" src="./images/book/book12/電風扇氣旋.png"/>
                   <img class="electfan-wind" src="./images/book/book12/風的線條.png"/>
                   <img class="finish-mission01" src="./images/common/請完成任務1.png"/>
                   <img class="click-magic-wand" src="./images/book/book0607/點這裡.png"/>
                   <div class="click-magic-wand-box"></div>
                   <img class="bubble-bg" src="./images/book/book13/水珠.png"/>
                   <img class="bubble12" src="./images/book/book13/牛奶泡泡.png"/>
                   <img class="board board13" src="./images/book/book13/board13.png"/>
                    <img class="check check01" src="./images/book/book13/綠勾.png" />
                   <div class="check-box"></div>
                   `);

        $(".book-section").append(`
          <div class="popup-board popup-board01">
          </div>
        `);
      }

      if (window.matchMedia("(max-height: 500px)").matches) {
        if (isAndroidChrome()) {
          $(".magic-wand").css({
            right: (screenHeight * 103.47) / 609 + "px", //70
            bottom: (screenHeight * 182.7) / 609 + "px", //123.6
          });

          $(".click-magic-wand-box").css({
            height: (screenHeight * 162.6) / 609 + "px", //110
          });

          $(".text12").css({
            width: screenHeight + "px",
            height: screenHeight + "px",
          });

          $(".board13").css({
            width: screenHeight + "px",
            height: screenHeight + "px",
          });
        }

        if (isSafari() || isIOSChrome()) {
          $(".magic-wand").css({
            right: (visualHeight * 104.9) / 609 + "px", //78
            bottom: (visualHeight * 186.95) / 609 + "px", //139
          });

          $(".click-magic-wand-box").css({
            height: (visualHeight * 158.7) / 609 + "px", //118
          });

          $(".text12").css({
            width: visualHeight + "px",
            height: visualHeight + "px",
          });

          $(".board13").css({
            width: visualHeight + "px",
            height: visualHeight + "px",
          });
        }
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
          $(".board13").css("opacity", "1");
          $(".electfan").css("opacity", "1");
          $(".magic-wand").css("opacity", "1");
          $(".finish-mission01").css("opacity", "1");
        }, 1000),
      );

      page1213Timeouts.push(
        setTimeout(() => {
          $(".click-magic-wand").show();
          $(".click-magic-wand-box").show();
          $(".finish-mission01").hide();
        }, 4000),
      );

      $("#flipbook .click-magic-wand, #flipbook .click-magic-wand-box").on(
        "click",
        () => {
          $(".click-magic-wand").hide();
          $(".click-magic-wand-box").hide();
          $(".finish-mission01").hide();
          $(".text12").css("opacity", "1");

          page1213Timeouts.push(
            setTimeout(
              () => $(".magic-wand").addClass("magic-wand-animation"),
              5000,
            ),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              $(".electfan-wind").css("opacity", "1");
              $(".electfan-wind-line").css("opacity", "1");
              setInterval(() => {
                fanIndex = (fanIndex + 1) % fanImages.length;
                fanImg.src = fanImages[fanIndex];
              }, 100);
            }, 7000),
          );

          page1213Timeouts.push(
            setTimeout(() => $(".bubble-bg").addClass("bubble-move"), 6000),
          );

          page1213Timeouts.push(
            setTimeout(() => $(".bubble12").addClass("bubble-fade-in"), 7000),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              $(".coin-hint01").addClass("bubble-fade-in");
            }, 18000),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              $(".coin01").addClass("coin-animation");
              $(".coin-light").addClass("coin-light-show");
              $(".check01").addClass("check-show");
            }, 26000),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              btnUnDisabled();
              canFlipNext = true;
              $("#right-down-corner").css("color", "#000");
              $("#right-down-corner").prop("disabled", false);
            }, 27000),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              $(".popup-board01").css("display", "block");
            }, 27000),
          );

          playVoice("./mp3/07.mp3");
        },
      );

      popupBoard();
    }

    if (page === 11 || page === 14) {
      page1213Timeouts.forEach((id) => clearTimeout(id));
      page1213Timeouts = [];
      $(".book12").css("opacity", "0");
      $(".book13").css("opacity", "0");
      $(".board13").css("opacity", "0");
      $(".text12").css("opacity", "0");
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
      $(".popup-board01").css("display", "none");
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
      $(".board13").remove();
      $(".popup-board01").remove();
      $(".text12").remove();
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
          <img class="click-milk" src="./images/book/book0607/點這裡.png"/>
          <div class="click-milk-box"></div>
          <img class="bubble14" src="./images/book/book1415/牛奶泡泡.png"/>          
          <img class="coin-hint02" src="./images/book/book1415/text15.png" />
           `);

        page1415Timeouts.push(
          setTimeout(() => {
            $("#flipbook").append(
              `<img class="cloud14-2" src="./images/book/book1415/雲2.png"/>      
             <img class="text14" src="./images/book/book1415/故事14.png"/>`,
            );
          }, 300),
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
          }, 1000),
        );

        $(".book-section").append(`    
          <div class="popup-board popup-board02">
          </div>
        `);

        if (window.matchMedia("(max-height: 500px)").matches) {
          if (isAndroidChrome()) {
            $(".girls-hand").css({
              right: (screenHeight * 473.9) / 609 + "px", //320.6
              bottom: (screenHeight * 75.68) / 609 + "px", //51.2
            });

            $(".click-milk-box").css({
              width: (screenHeight * 132.4) / 609 + "px", //90
              height: (screenHeight * 88.26) / 609 + "px", //60
            });
          }

          if (isSafari() || isIOSChrome()) {
            $(".girls-hand").css({
              right: (visualHeight * 473.1857) / 609 + "px", //351.312
              bottom: (visualHeight * 81.124) / 609 + "px", //60.2311
            });

            $(".click-milk-box").css({
              width: (screenHeight * 121) / 609 + "px", //90
              height: (screenHeight * 80.7) / 609 + "px", //60
            });
          }
        }

        page1415Timeouts.push(
          setTimeout(() => {
            $(".board-list02").addClass("bubble-fade-in");
          }, 1000),
        );

        page1415Timeouts.push(
          setTimeout(() => {
            $(".bubble14").addClass("bubble-fade-in");
          }, 1000),
        );

        page1415Timeouts.push(
          setTimeout(() => {
            $(".finish-mission02").css("opacity", "0");
            $(".click-milk").show();
            $(".click-milk-box").show();
          }, 17000),
        );

        $("#flipbook .click-milk , #flipbook .click-milk-box ").on(
          "click",
          function () {
            $(".click-milk").hide();
            $(".click-milk-box").hide();
            $(".finish-mission02").hide();

            page1415Timeouts.push(
              setTimeout(() => {
                $(".cows-tongue").addClass("cows-tongue-animation");
                $(".milk").addClass("milk-empty");
              }, 3000),
            );

            page1415Timeouts.push(
              setTimeout(() => {
                $(".success-hint02").addClass("bubble-fade-in");
                $(".cows-tongue").removeClass("cows-tongue-animation");
              }, 6000),
            );

            playVoice("./mp3/sucking-coin.mp3");

            page1415Timeouts.push(
              setTimeout(() => {
                $(".coin-hint02").addClass("bubble-fade-in");
              }, 7000),
            );

            page1415Timeouts.push(
              setTimeout(() => {
                $(".check02").addClass("check-show");
                $(".coin02").addClass("coin-animation");
                $(".coin-light02").addClass("coin-light-show");
              }, 13000),
            );

            page1415Timeouts.push(
              setTimeout(() => {
                $(".popup-board02").css("display", "block");
                btnUnDisabled();
                canFlipNext = true;
                $("#right-down-corner").css("color", "#000");
                $("#right-down-corner").prop("disabled", false);
              }, 16000),
            );
          },
        );
      }
      popupBoard();
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
      $(".popup-board02").css("display", "none");
      $("#flipbook .finish-mission02").remove();
      $("#flipbook .cloud14-2").remove();
      $("#flipbook .text14").remove();
      $("#flipbook .click-milk").remove();
      $("#flipbook .board14").remove();
      $("#flipbook .board-list02").remove();
      $("#flipbook .small-cow").remove();
      $("#flipbook .bubble14").remove();
      $("#flipbook .check02").remove();
      $(".board14").remove();
      $(".popup-board02").remove();
      $(".coin-hint02").remove();
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
            <div class="click-hearing-heart-box"></div>
            <img class="board-list03" src="./images/book/book1617/任務清單.png"/>
            <img class="check check03" src="./images/book/book13/綠勾.png" />
            <img class="board16" src="./images/book/book1415/板子.png">
            <img class="bubble16" src="./images/book/book1617/牛奶泡泡.png"/>
            `);
        $("#flipbook").append(`<div class="check-box"></div>`);
        $(".book-section").append(`    
          <div class="popup-board popup-board03">
          </div>
        `);

        if (window.matchMedia("(max-height: 500px)").matches) {
          if (isAndroidChrome()) {
            $(".click-hearing-heart-box").css({
              width: (screenHeight * 103.47) / 609 + "px", //70
              height: (screenHeight * 66.512) / 609 + "px", //45
            });
          }

          if (isSafari() || isIOSChrome()) {
            $(".click-hearing-heart-box").css({
              width: (screenHeight * 94.15) / 609 + "px", //70
              height: (screenHeight * 60.52) / 609 + "px", //45
            });
          }
        }

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
          }, 1000),
        );

        page1617Timeouts.push(
          setTimeout(() => {
            $(".bubble16").addClass("bubble-fade-in");
            $(".board-list03").addClass("bubble-fade-in");
          }, 1000),
        );

        page1617Timeouts.push(
          setTimeout(() => {
            $(".finish-mission03").css("opacity", "0");
            $(".click-hearing-heart").show();
            $(".click-hearing-heart-box").show();
          }, 15000),
        );

        $(
          "#flipbook .click-hearing-heart ,#flipbook .click-hearing-heart-box ",
        ).on("click", function () {
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
            }, 500),
          );

          $(".dondon").addClass("bubble-fade-in");
          $(".stethoscope").addClass("stethoscope-move");

          page1617Timeouts.push(
            setTimeout(() => {
              $(".cow-heart").addClass("heart-beat-animation");
            }, 1000),
          );
          $(".click-hearing-heart").hide();
          $(".click-hearing-heart-box").hide();
          $(".finish-mission03").hide();

          playVoice("./mp3/hear-coin.mp3");

          page1617Timeouts.push(
            setTimeout(() => {
              $(".coin-hint03").addClass("bubble-fade-in");
            }, 6000),
          );

          page1617Timeouts.push(
            setTimeout(() => {
              $(".check03").addClass("check-show");
              $(".coin03").addClass("coin-animation");
              $(".coin-light03").addClass("coin-light-show");
            }, 15000),
          );

          page1617Timeouts.push(
            setTimeout(() => {
              $(".popup-board03").css("display", "block");
              btnUnDisabled();
              canFlipNext = true;
              $("#right-down-corner").css("color", "#000");
              $("#right-down-corner").prop("disabled", false);
            }, 17000),
          );
        });
      }

      popupBoard();
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
      $(".popup-board03").css("display", "none");
      $(".stethoscope").addClass("disabled");
      $("#flipbook .stethoscope").removeClass("stethoscope-move");
      $(".cow-heart").removeClass("heart-beat-animation");
      $(".coin03").removeClass("coin-animation");
      $(".coin-light03").removeClass("coin-light-show");
      $(".check03").removeClass("check-show");
      $(".coin-hint03").removeClass("bubble-fade-in");
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
      $(".popup-board03").remove();
      $("#flipbook .bubble16").remove();
      $("#flipbook .dondon").remove();
    }

    // 第 20–21 頁：獲得皇冠 + 投硬幣動畫
    if (page === 18 || page === 19) {
      $("#flipbook").append(`
      <img class="book19-text" src="./images/book/book1819/book19-text.png" />
      <img class="coin-all  coin01-final" src="./images/book/book1819/金幣01.png" />
      <img class="coin-all coin02-final" src="./images/book/book1819/金幣02.png" />
      <img class="coin-all coin03-final" src="./images/book/book1819/金幣03.png" />
      <img class="coin-all-shine" src="./images/book/book1819/亮晶晶.png" />
      <img class="girl1819" src="./images/book/book1819/鈴鈴.png" />
      <img class="crown" src="./images/book/book1819/好牛皇冠.png" />
      <img class="crown-shine" src="./images/book/book1819/皇冠光芒.png" />
      <img class="bubble18" src="./images/book/book1819/牛奶泡泡.png" />
    `);

      page1819Timeouts.push(
        setTimeout(() => {
          $(".book18").css("opacity", "1");
          $(".book19").css("opacity", "1");
          $(".girl1819").css("opacity", "1");
        }, 1000),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".coin01-final, .coin02-final, .coin03-final").addClass(
            "coin-all-animation",
          );
        }, 4000),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".coin-all-shine").addClass("bubble-fade-in");
        }, 4500),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".bubble18").addClass("bubble-fade-in");
        }, 3500),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".crown").addClass("crown-animation");
        }, 12000),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".crown-shine").addClass("bubble-fade-in");
        }, 13000),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".book19-text").addClass("bubble-fade-in");
        }, 19000),
      );
    }

    if (page === 17 || page === 20) {
      page1819Timeouts.forEach((id) => clearTimeout(id));
      page1819Timeouts = [];
      $(".book18").css("opacity", "0");
      $(".book19").css("opacity", "0");
      $(".girl1819").css("opacity", "0");
      $(".coin01-final, .coin02-final, .coin03-final").removeClass(
        "coin-all-animation",
      );
      $(".book19-text").removeClass("bubble-fade-in");
      $(".crown").removeClass("crown-animation");
      $(".crown-shine").removeClass("bubble-fade-in");
      $(".coin-all-shine").removeClass("bubble-fade-in");
      $(".bubble18").removeClass("bubble-fade-in");
      $("#flipbook .bubble18").remove();
      $("#flipbook .crown").remove();
      $("#flipbook .crown-shine").remove();
      $("#flipbook .coin-all").remove();
      $("#flipbook .coin-all-shine").remove();
      $("#flipbook .girl1819").remove();
      $("#flipbook .book19-text").remove();
    }

    // 第 20–21 頁：小女孩夢境 + 浮出夢境
    if (page === 20 || page === 21) {
      $("#flipbook").append(
        `<img class="dream04" src="./images/book/book2021/夢泡04.png"/>
        <img class="dream-light" src="./images/book/book2021/夢泡光.png"/>
        <img class="story20" src="./images/book/book2021/故事20.png"/>
        <img class="book21-text" src="./images/book/book2021/book21-text.png"/>
        <img class="dream-girl" src="./images/book/book2021/鈴鈴.png"/>
        <img class="dialog20" src="./images/book/book2021/哇!.png"/>
        <img class="dialog21" src="./images/book/book2021/嗯.png"/>
        <img class="bubble20" src="./images/book/book2021/牛奶泡泡20.png"/>
        <img class="star20" src="./images/book/book2021/亮晶晶.png"/>
        `,
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".book20").css("opacity", "1");
          $(".book21").css("opacity", "1");
          $(".dream01").addClass("dream-animation");
          $(".dream02").addClass("dream-animation");
          $(".dream03").addClass("dream-animation");
          $(".dream04").addClass("dream-animation");
          $(".story20").addClass("dream-animation");
          $(".dream-girl").addClass("dream-girl-animation");
        }, 1000),
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dialog20").addClass("bubble-fade-in");
        }, 6000),
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".bubble20").addClass("bubble-fade-in");
          $(".dream-light").addClass("sweet-taste-animation");
          $(".star20").addClass("dialog20-animation");
        }, 7000),
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dialog21").addClass("bubble-fade-in");
        }, 10000),
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".book21-text").addClass("bubble-fade-in");
        }, 11000),
      );
    }

    if (page === 19 || page === 22) {
      page2021Timeouts.forEach((id) => clearTimeout(id));
      page2021Timeouts = [];
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
      $(".book21-text").remove();
      $(".book21-text").removeClass("bubble-fade-in");
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
      page2223Timeouts.push(
        setTimeout(() => {
          $(".book22").css("opacity", "1");
          $(".book23").css("opacity", "1");
          $(".cow-alarm ").css("opacity", "1");
          $(".sleep-girl-hand").css("opacity", "1");
          $(".sleep-girl-arm").css("opacity", "1");
        }, 1000),
      );

      page2223Timeouts.push(
        setTimeout(() => {
          $(".book23-text").addClass("bubble-fade-in");
        }, 6000),
      );
    } else {
      page2223Timeouts.forEach((id) => clearTimeout(id));
      page2223Timeouts = [];
      $(".book22").css("opacity", "0");
      $(".book23").css("opacity", "0");
      $(".cow-alarm ").css("opacity", "0");
      $(".sleep-girl-hand ").css("opacity", "0");
      $(".sleep-girl-arm").css("opacity", "0");
      $(".book23-text").removeClass("bubble-fade-in");
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
      $(".book25-story").removeClass("milk-stains-show");
      $(".book25-text").removeClass("milk-stains-show");
      $(".milk-flower").css("dispaly", "none");
      $(".milk-flower").removeClass("milk-drop-show");
      $(".milk-smell").removeClass("milk-smell-animation");

      for (let i = 1; i <= 6; i++) {
        $(`.flower0${i}`).removeClass(`flower0${i}-finish`);
      }

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
        }, 1000),
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".milk-hand").addClass("milk-hand-animation");
        }, 3300),
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".milk-drop").addClass("milk-drop-show");
        }, 4000),
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".milk-inner").css("opacity", "1");
        }, 6300),
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".milk-flower").addClass("milk-drop-show");
          $(".milk-drop").removeClass("milk-drop-show");
        }, 8300),
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".milk-smell").addClass("milk-smell-animation");
        }, 9300),
      );

      page2425Timeouts.push(
        setTimeout(() => {
          $(".click-girl").show();
        }, 15000),
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
            }, 100),
          );
        }

        $(".book25-story").addClass("milk-stains-show");
        page2425Timeouts.push($(".flower").css("opacity", "1"));

        $(".click-girl").hide();
        $(".girl-l-hand-region").addClass("girl-l-hand-finish");
        $(".girl-r-hand").addClass("girl-r-hand-finish");

        playVoice("./mp3/girl-drink.mp3");

        page2425Timeouts.push(
          setTimeout(() => {
            $(".girl-l-hand-milk").css("opacity", "0");
          }, 2000),
        );

        page2425Timeouts.push(
          setTimeout(() => {
            $(".milk-stains").addClass("milk-stains-show");
          }, 2200),
        );

        page2425Timeouts.push(
          setTimeout(() => {
            $(".book25-text").addClass("milk-stains-show");
          }, 6000),
        );

        page2425Timeouts.push(
          setTimeout(() => {
            for (let i = 1; i <= 6; i++) {
              $(`.flower0${i}`).addClass(`flower0${i}-finish`);
            }
          }, 3300),
        );

        page2425Timeouts.push(
          setTimeout(() => {
            btnUnDisabled();
            canFlipNext = true;
            $("#right-down-corner").css("color", "#000");
            $("#right-down-corner").prop("disabled", false);
          }, 8000),
        );
      });

    // 第 26–27 頁 家人喝牛奶
    function startFamilyAnimation() {
      $("#flipbook").append(`
      <img class="book2627" src="./images/book/book2627/book2627.png" />
      <img class="all-milk-stains" src="./images/book/book2627/牛奶鬍.png" />
    `);

      if (window.matchMedia("(max-height: 500px)").matches) {
        if (isSafari() || isIOSChrome()) {
          $(".all-milk-stains").css({
            width: visualHeight + "px",
          });
        }

        if (isAndroidChrome()) {
          $(".all-milk-stains").css({
            width: screenHeight + "px",
          });
        }
      }

      page2627Timeouts.push(
        setTimeout(() => {
          $(".book26").css("opacity", "1");
          $(".book27").css("opacity", "1");
          $(".book2627").css("opacity", "1");
        }, 1200),
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".milk-box").css("opacity", "1");
          $(".father-hand").css("opacity", "1");
          $(".father-hand-milk").css("display", "block");
          $(".father-hand-cup").css("opacity", "1");
          $(".daughter-hand").css("opacity", "1");
          $(".daughter-hand-milk").css("display", "block");
          $(".daughter-hand-cup").css("opacity", "1");
        }, 1500),
      );

      if (window.matchMedia("(max-height: 500px)").matches) {
        if (isAndroidChrome()) {
          setTimeout(() => {
            $(".daughter-hand-finish").css({
              top: (screenHeight * 403.536) / 609 + "px", //273
              left: (screenHeight * 376.93) / 609 + "px", //254
              transform:
                `translate(` +
                (screenHeight * 0) / 609 +
                `px,` +
                (screenHeight * 0) / 609 +
                `px) rotate(-72deg)`,
            });
          }, 5000);

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
                  (screenHeight * 59.126) / 609 +
                  `px,` +
                  (screenHeight * -75.386) / 609 +
                  `px) rotate(33deg)`,
              }); //transform: translate(40px, -51px) rotate(33deg);
            }, 5000),
          );

          page2627Timeouts.push(
            setTimeout(() => {
              $(".father-hand-finish-mb").css({
                width: (screenHeight * 325.197) / 609 + "px", //220px
                top: (screenHeight * 395.85) / 609 + "px", //267.8px
                left: (screenHeight * 78.34) / 609 + "px", //53px
                transform: "translate(0,0) rotate(0deg)",
              });

              $(".daughter-hand-finish").css({
                top: (screenHeight * 395.85) / 609 + "px", //267.8px
                left: (screenHeight * 371.475) / 609 + "px", //251.31px
                transform: "translate(0,0) rotate(0deg)",
              });

              $(".mom-hand-finish-mb").css({
                bottom: (screenHeight * 224.68) / 609 + "px", //152px
                right: (screenHeight * 711) / 609 + "px", //481px
                transform: "translate(0,0) rotate(0deg)",
              });
            }, 7500),
          );
        }

        if (isSafari() || isIOSChrome()) {
          setTimeout(() => {
            $(".daughter-hand-finish").css({
              top: (visualHeight * 404.073) / 609 + "px", //300
              left: (visualHeight * 377.1348) / 609 + "px", //280
              transform:
                `translate(` +
                (screenHeight * 0) / 609 +
                `px,` +
                (screenHeight * 0) / 609 +
                `px) rotate(-72deg)`,
            });
          }, 5000);

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
            }, 5000),
          );

          page2627Timeouts.push(
            setTimeout(() => {
              $(".father-hand-finish-mb").css({
                width: (visualHeight * 296.34) / 609 + "px", //220px
                top: (visualHeight * 360.727) / 609 + "px", //267.8px
                left: (visualHeight * 85.39) / 609 + "px", //53px
                transform: "translate(0,0) rotate(0deg)",
              });

              $(".daughter-hand-finish").css({
                top: (visualHeight * 390.6) / 609 + "px", //290
                left: (visualHeight * 371.74) / 609 + "px", //276
                transform: "translate(0,0) rotate(0deg)",
              });

              $(".mom-hand-finish-mb").css({
                bottom: (visualHeight * 204.744) / 609 + "px", //152px
                right: (visualHeight * 682.88) / 609 + "px", //507px
                transform: "translate(0,0) rotate(0deg)",
              });
            }, 7500),
          );
        }
      }

      page2627Timeouts.push(
        setTimeout(() => {
          $(".cheers").addClass("bubble-fade-in");
          $(".daughter-hand-region").addClass("daughter-hand-finish");
        }, 5000),
      );

      if (window.matchMedia("(max-height: 500px)").matches) {
        page2627Timeouts.push(
          setTimeout(() => {
            $(".father-hand-region-mb").addClass("father-hand-finish-mb");
            $(".mom-hand-region-mb").addClass("mom-hand-finish-mb");
          }, 5000),
        );
      } else {
        page2627Timeouts.push(
          setTimeout(() => {
            $(".father-hand-region").addClass("father-hand-finish");
            $(".mom-hand-region").addClass("mom-hand-finish");
          }, 5000),
        );
      }

      page2627Timeouts.push(
        setTimeout(() => {
          $(".father-hand-milk").css("opacity", "0");
          $(".daughter-hand-milk").css("opacity", "0");
          $(".mom-hand-milk").css("opacity", "0");
        }, 6000),
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".all-milk-stains ").addClass("all-milk-stains-show ");
        }, 6500),
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".sweet-taste").addClass("bubble-fade-in");
        }, 7000),
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".cow-right").addClass("cow-right-move");
        }, 12000),
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".mow").show();
        }, 15000),
      );

      page2627Timeouts.push(
        setTimeout(() => {
          $(".father-hand-region").removeClass("father-hand-finish");
          $(".daughter-hand-region").removeClass("daughter-hand-finish");
          $(".mom-hand-region").removeClass("mom-hand-finish");
        }, 8000),
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
      $(".cheers").removeClass("bubble-fade-in");
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
        ".father-hand, .daughter-hand, .mom-hand, .all-milk-stains, .girls-milk-ink, .cow-right",
      ).removeClass(removeClasses.join(" "));

      // 隱藏叫聲
      $(".mow").hide();
    }

    // 翻到該頁才開始動作
    $("#flipbook").bind("turned", function (event, page) {
      if (page > 1 && !window.matchMedia("(max-height: 500px)").matches) {
        $("#right-up-corner, #right-down-corner")
          .prop("disabled", false)
          .show();
      }
      // 第 24–25 頁：點擊小女孩喝牛奶
      if (page === 24 || page === 25) {
        isCanNotFlip();
        setTimeout(() => {
          canFlipPrev = true;
        }, 3000);
        btnPreviousDisabled();
        btnDisabled();

        resetMilkPage(); // 每次重進頁面重置一次

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
          }, 500),
        );

        if (window.matchMedia("(max-height: 500px)").matches) {
          page2627Timeouts.push(
            setTimeout(() => {
              $("#flipbook").append(
                ' <div class="mom-hand-region-mb"><div class="mom-hand-milk-region"><img class="mom-hand-milk" src="./images/book/book2627/牛奶.png"/><img class="mom-hand-cup" src="./images/book/book2627/空杯.png"/></div><img class="mom-hand" src="./images/book/book2627/媽媽手.png"/></div>',
              );
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
            }, 1500),
          );
        } else {
          if (!$(".mom-hand").length) {
            page2627Timeouts.push(
              setTimeout(() => {
                $("#flipbook").append(
                  ' <div class="mom-hand-region"><div class="mom-hand-milk-region"><img class="mom-hand-milk" src="./images/book/book2627/牛奶.png"/><img class="mom-hand-cup" src="./images/book/book2627/空杯.png"/></div><img class="mom-hand" src="./images/book/book2627/媽媽手.png"/></div>',
                );
              }, 1500),
            );
          }
        }

        page2627Timeouts.push(
          setTimeout(() => {
            $(".mom-hand").css("opacity", "1");
            $(".mom-hand-milk").css("opacity", "1");
            $(".mom-hand-cup").css("opacity", "1");
          }, 2000),
        );
      }

      if (page === 25 || page === 28) {
        page2627Timeouts.forEach((id) => clearTimeout(id));
        page2627Timeouts = [];
        $(".book2627").css("opacity", "0");
        $(".book2627").remove();
        $(".all-milk-stains").remove();
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
          $(".milk28").css("opacity", "1");
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
        $(".next-page img").attr("src", "./images/common/下一頁灰.png");
        $(".next-page img").css("cursor", "not-allowed");
        $(".next-page").prop("disabled", true);
        const prevBtn = $(".next-page")[0];

        $(".prev-page img").attr("src", "./images/common/上一頁灰.png");
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

      if (page === 27) {
        $(".cloud-28").css("opacity", "0");
        $(".bubble-28").css("opacity", "0");
        $(".star-28").removeClass("star-28-animation");
        $(".story-28").css("opacity", "0");
        $(".milk28").css("opacity", "0");
        $(".grass-28").css("opacity", "0");
        $(".fence-28").css("opacity", "0");
        $(".cow-28-1").css("opacity", "0");
        $(".cow-28-2").css("opacity", "0");
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
        $(".sweet-taste").removeClass("bubble-fade-in");
      }
    });

    if (
      page !== 6 &&
      page !== 7 &&
      page !== 12 &&
      page !== 13 &&
      page !== 14 &&
      page !== 15 &&
      page !== 16 &&
      page !== 17 &&
      page !== 24
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
      if (page === 2 || page === 3) {
        if (isSafari() || isIOSChrome()) {
          $(".book03-title, .milk03, .hands03").css({
            width: visualHeight + "px",
          });

          $(".girls-head03").css({
            width: (visualHeight * 377.13) / 609 + "px", //280
            right: (visualHeight * 94.3) / 609 + "px", //70
            bottom: (visualHeight * 152.2) / 609 + "px", //113
          });
        }
        if (isAndroidChrome()) {
          $(".book03-title, .milk03, .hands03").css({
            width: screenHeight + "px",
          });

          $(".girls-head03").css({
            width: (screenHeight * 399.1) / 609 + "px", //270
            right: (screenHeight * 88.69) / 609 + "px", //60
            bottom: (screenHeight * 147.82) / 609 + "px", //100
          });
        }
      }

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
          '<img class="clouds" src="./images/book/book0607/雲.png"/>',
        );

        if (isSafari() || isIOSChrome()) {
          $(".text06").css({
            width: visualHeight + "px",
          });
          $(".knock").css({
            right: (visualHeight * 336.725) / 609 + "px", //250
            bottom: (visualHeight * 269.38) / 609 + "px", //200
          });
        }
        if (isAndroidChrome()) {
          $(".text06").css({
            width: screenHeight + "px",
          });
          $(".knock").css({
            right: (screenHeight * 331.1) / 609 + "px", //224
            bottom: (screenHeight * 273.46) / 609 + "px", //185
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

        if (isAndroidChrome()) {
          $(".text09").css({
            width: screenHeight + "px",
            height: screenHeight + "px",
          });
        }

        if (isSafari() || isIOSChrome()) {
          $(".text09").css({
            width: visualHeight + "px",
            height: visualHeight + "px",
          });
        }
      }

      if (page === 10 || page === 11) {
        if (isAndroidChrome()) {
          $(".text11").css({
            width: screenHeight + "px",
            height: screenHeight + "px",
          });
        }

        if (isSafari() || isIOSChrome()) {
          $(".text11").css({
            width: visualHeight + "px",
            height: visualHeight + "px",
          });
        }
      }

      if (page === 12 || page === 13) {
        if (isAndroidChrome()) {
          $(".finish-mission01").css({
            left: (screenHeight * 114.486) / 609 + "px", //85
            top: (screenHeight * 121.22) / 609 + "px", //90
          });

          $(".check01").css({
            right: (screenHeight * 198.07) / 609 + "px", //134
            top: (screenHeight * 177.38) / 609 + "px", //120
          });

          $(".coin-hint01").css({
            width: screenHeight + "px",
            height: screenHeight + "px",
          });
        }

        if (isSafari() || isIOSChrome()) {
          $(".finish-mission01").css({
            left: (visualHeight * 114.486) / 609 + "px", //85
            top: (visualHeight * 121.22) / 609 + "px", //90
          });

          $(".check01").css({
            right: (visualHeight * 199.34) / 609 + "px", //148
            top: (visualHeight * 179.137) / 609 + "px", //133
          });

          $(".coin-hint01").css({
            width: visualHeight + "px",
            height: visualHeight + "px",
          });
        }
      }

      if (page === 14 || page === 15) {
        if (isAndroidChrome()) {
          $(".finish-mission02").css({
            width: (screenHeight * 192.16) / 609 + "px", //130
            left: (screenHeight * 517.354) / 609 + "px", //350
            top: (screenHeight * 44.345) / 609 + "px", //30
          });

          $(".check02").css({
            right: (screenHeight * 196.65) / 609 + "px", //146
            top: (screenHeight * 215.5) / 609 + "px", //160
          });

          $(".coin-hint02").css({
            width: screenHeight + "px",
            height: screenHeight + "px",
          });
        }

        if (isSafari() || isIOSChrome()) {
          $(".finish-mission02").css({
            width: (visualHeight * 192.16) / 609 + "px", //130
            left: (visualHeight * 517.354) / 609 + "px", //350
            top: (visualHeight * 44.345) / 609 + "px", //30
          });

          $(".check02").css({
            right: (visualHeight * 196.65) / 609 + "px", //146
            top: (visualHeight * 215.5) / 609 + "px", //160
          });

          $(".coin-hint02").css({
            width: visualHeight + "px",
            height: visualHeight + "px",
          });
        }
      }

      if (page === 16 || page === 17) {
        if (isSafari() || isIOSChrome()) {
          $(".click-hearing-heart").css({
            right: (visualHeight * 180) / 609 + "px",
            bottom: (visualHeight * 70) / 609 + "px",
          });

          $(".coin-hint03").css({
            width: visualHeight + "px",
            height: visualHeight + "px",
          });

          $(".check03").css({
            top: (visualHeight * 249.176) / 609 + "px", //185
            right: (visualHeight * 184.525) / 609 + "px", //137
          });
        }

        if (isAndroidChrome()) {
          $(".click-hearing-heart").css({
            right: (screenHeight * 180) / 609 + "px",
            bottom: (screenHeight * 70) / 609 + "px",
          });

          $(".coin-hint03").css({
            width: screenHeight + "px",
            height: screenHeight + "px",
          });

          $(".check03").css({
            top: (screenHeight * 246.5) / 609 + "px", //167
          });
        }
      }

      if (page === 18 || page === 19) {
        if (isSafari() || isIOSChrome()) {
          $(".book19-text").css({
            width: visualHeight + "px",
          });
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
          $(".book19-text").css({
            width: screenHeight + "px",
          });
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

      if (page === 20 || page === 21) {
        if (isSafari() || isIOSChrome()) {
          $(".book21-text").css({
            width: visualHeight + "px",
          });
        }
        if (isAndroidChrome()) {
          $(".book21-text").css({
            width: screenHeight + "px",
          });
        }
      }

      if (page === 22 || page === 23) {
        if (isSafari() || isIOSChrome()) {
          $(".book23-text").css({
            width: visualHeight + "px",
          });
        }
        if (isAndroidChrome()) {
          $(".book23-text").css({
            width: screenHeight + "px",
          });
        }
      }

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
            transform:
              `translate(` +
              (screenHeight * 0) / 609 +
              `px,` +
              (screenHeight * 0) / 609 +
              `px) rotate(0deg)`,
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

          $(".cow-right").css({
            width: (visualHeight * 345) / 609 + "px", //250px
          });

          $(".mow").css({
            top: (visualHeight * 255.9) / 609 + "px", //190px
            right: (visualHeight * 255.9) / 609 + "px", //190px
          });

          setTimeout(() => {
            $(".mom-hand-region-mb").css({
              bottom: (visualHeight * 204.744) / 609 + "px", //152px
              right: (visualHeight * 682.88) / 609 + "px", //507px
              opacity: "1",
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
            transform:
              `translate(` +
              (screenHeight * 0) / 609 +
              `px,` +
              (screenHeight * 0) / 609 +
              `px) rotate(0deg)`,
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

          $(".cow-right").css({
            width: (screenHeight * 340) / 609 + "px", //230px
          });

          $(".mow").css({
            top: (screenHeight * 255.9) / 609 + "px", //190px
            right: (screenHeight * 255.9) / 609 + "px", //190px
          });

          $(".all-milk-stains").css({
            height: screenHeight + "px",
          });

          setTimeout(() => {
            $(".mom-hand-region-mb").css({
              bottom: (screenHeight * 224.68) / 609 + "px", //152px
              right: (screenHeight * 711) / 609 + "px", //481px
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

    // 翻頁事件
    $("#flipbook").bind("turned", function (event, page) {
      latestPage = page;

      // 書本定位
      if (!isIPad() && !window.matchMedia("(max-height: 500px)").matches) {
        if (page === 1) {
          $(".book-section").css({
            left: "-300px",
          });
        } else if (page === 28) {
          $(".book-section").css({
            left: "17%",
          });
        } else {
          $(".book-section").css({
            left: "0px",
          });
        }
      }
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
      $("#left-down-corner").hide();
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
            left: (screenHeight * -351.7) / 609 + "px", //-210
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

      if (window.matchMedia("(max-height: 500px)").matches) {
        if (isSafari() || isIOSChrome()) {
          $(".book-section").css({
            left: "0px",
          });
        }

        if (isAndroidChrome()) {
          $(".book-section").css({
            left: "0px",
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
      $("#flipbook .click-magic-wand, #flipbook .click-magic-wand-box").one(
        "click",
        function () {
          setTimeout(() => {
            canSwipeNext = true;
          }, 15000);
        },
      );
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
      $("#flipbook .click-milk, #flipbook .click-milk-box").one(
        "click",
        function () {
          setTimeout(() => {
            canSwipeNext = true;
          }, 12000);
        },
      );
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
      $(
        "#flipbook .click-hearing-heart, #flipbook .click-hearing-heart-box",
      ).one("click", function () {
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

    if (page === 28) {
      if (window.matchMedia("(max-height: 500px)").matches) {
        //     // if (isSafari() || isIOSChrome()) {
        //     //   $(".book-section").css({
        //     //     left: (visualHeight * -312.48) / 609 + "px", //-232
        //     //   });
        //     // }
        //     if (isAndroidChrome()) {
        //       $(".book-section").css({
        //         transform: `translateX(` + (screenHeight * 739.08) / 609 + `px)`, //500
        //       });
        //     }
      }
    }
  }

  /* ======================
   turned 事件
====================== */
  $("#flipbook").on("turned", function (e, page) {
    currentMobilePage = page;
    playAudioByPage(page);
    applyPageRule(page);
  });

  let latestPage = 1;

  // 停止所有音樂
  function allAudioPause() {
    $("audio").each(function () {
      if (this.id.startsWith("audio-")) {
        this.pause();
        this.currentTime = 0;
      }
    });
  }

  // 動態播放語音（不影響 background）
  let currentVoiceSource = null;

  async function playVoice(src) {
    try {
      // 如果之前有播放中的語音，先停止
      if (currentVoiceSource) {
        currentVoiceSource.stop();
        currentVoiceSource.disconnect();
        currentVoiceSource = null;
      }

      // 取得音檔
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // 建立新的播放來源
      const voiceSource = audioContext.createBufferSource();
      voiceSource.buffer = audioBuffer;

      // 接到語音音量控制節點
      voiceSource.connect(voiceGainNode);
      voiceGainNode.connect(audioContext.destination);

      // 播放
      setTimeout(() => {
        voiceSource.start(0);
      }, 1000);

      currentVoiceSource = voiceSource;

      console.log("語音播放成功");
    } catch (err) {
      console.log("語音播放失敗:", err);
    }
  }

  function playAudioByPage(page) {
    const audioFileMap = {
      1: "./mp3/01.mp3",
      2: "./mp3/02.mp3",
      3: "./mp3/02.mp3",
      4: "./mp3/03.mp3",
      5: "./mp3/03.mp3",
      6: "audio-4",
      7: "audio-4",
      8: "./mp3/05.mp3",
      9: "./mp3/05.mp3",
      10: "./mp3/06.mp3",
      11: "./mp3/06.mp3",
      12: "audio-7",
      13: "audio-7",
      14: "./mp3/08.mp3",
      15: "./mp3/08.mp3",
      16: "./mp3/09.mp3",
      17: "./mp3/09.mp3",
      18: "./mp3/10.mp3",
      19: "./mp3/10.mp3",
      20: "./mp3/11.mp3",
      21: "./mp3/11.mp3",
      22: "./mp3/12.mp3",
      23: "./mp3/12.mp3",
      24: "./mp3/13.mp3",
      25: "./mp3/13.mp3",
      26: "./mp3/14.mp3",
      27: "./mp3/14.mp3",
      28: "./mp3/15.mp3",
      // 依照你實際檔案寫
    };

    const src = audioFileMap[page];
    if (src) {
      playVoice(src);
    }
  }

  /* ======================
   🔥 初始化補救（一開始page是undefined關鍵）
====================== */
  $(document).ready(function () {
    if (!window.matchMedia("(max-height: 500px)").matches) {
      // 封面剛載入，禁用角落按鈕
      $("#right-up-corner, #right-down-corner").prop("disabled", true);

      // 如果你想同時隱藏它們（避免被 hover 或看到折角效果）
      $("#right-up-corner, #right-down-corner").hide();

      // 初始狀態改成「開啟」
      $(".next-page img").attr("src", "./images/common/開始.png");
    }

    // 取得目前頁數（預設應該是 1）
    let currentPage = $("#flipbook").turn("page") || 1;
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
