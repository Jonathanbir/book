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
    $(".pop-up-box").on("click", function () {
      $(".pop-up-box").css("display", "none");
    });

    // window.alert(
    //   "visualViewport.height: " +
    //     visualViewport.height +
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
    //     isSafari()
    // );

    if (isSafari()) {
      console.log("safari~~~");
      // 初始化 safri turn.js
      $flipbook.turn({
        width: visualHeight * 2,
        height: visualHeight,
        autoCenter: true,
      });
      $("#left-down-corner").css({
        top: visualHeight - 100 + "px",
        left: widthGap + "px",
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
      $("#left-down-corner").css({
        top: visualHeight - 100,
        left: widthGap + "px",
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
      $(".eyes-4").addClass("eyes-big-animation");
      $(".question").addClass("question-animation");
    } else {
      $(".eyes-4").removeClass("eyes-big-animation");
      $(".question").removeClass("question-animation");
    }

    if (page === 6 || page === 7) {
      const door = document.querySelector(".door");
      $("#flipbook").append('<div class="tree1"></div>');
      $("#flipbook").append('<div class="tree2"></div>');
      $("#flipbook").append('<div class="tree3"></div>');
      $("#flipbook").append('<div class="cloud2"></div>');
      $("#flipbook").append('<div class="bubble67"></div>');
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
          $(".bubble67").addClass("bubble-fade-in");
        }, 7000);
        setTimeout(() => {
          $(".star5").addClass("star-fade-in");
          $(".wow").addClass("wow-animation");
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
      $("#flipbook .bubble67").remove();
      $("#flipbook .star5").remove();
      $(".door").removeClass("door-opening");
      $(".peoples").removeClass("peoples-open");
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
        '<img class="mom-daughter" src="./images/book/book08/鈴鈴媽媽.png"/>'
      );
      $("#flipbook").append('<div class="bubble7"></div>');
      $("#flipbook").append('<div class="star7"></div>');
      setTimeout(() => {
        $(".eyes-ball-8").addClass("eyes-ball-animation");
        $(".mom-daughter").addClass("mom-daughter-animation");
      }, 8000);
      $(".foot1").addClass("foot1-animation");
      $(".foot2").addClass("foot2-animation");
      $(".foot3").addClass("foot3-animation");
      $(".foot4").addClass("foot4-animation");
      $(".foot5").addClass("foot5-animation");
      $(".mowmow").addClass("mowmow-animation");
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
      $(".mowmow").removeClass("mowmow-animation");
      $(".eyes-ball-8").removeClass("eyes-ball-animation");
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
      $("#flipbook").append(
        '<img class="girls-head" src="./images/book/book10/媽媽鈴鈴.png"/>'
      );
      $("#flipbook").append(
        '<img class="rainbow"  src="./images/book/book11/彩虹.png"/></div>'
      );
      $("#flipbook").append('<div class="star11"></div>');
      $("#flipbook").append('<div class="bubble11"></div>');
      $("#flipbook").append('<div class="cloud-group"></div>');
      $("#flipbook").append('<div class="cow05"></div>');
      $("#flipbook").append(
        '<img src="./images/book/book11/手.png" class="list-board"/>'
      );
      $("#flipbook").append(
        '<img src="./images/book/book11/清單內容.png" class="list"/>'
      );

      setTimeout(() => {
        $(".bubble11").addClass("bubble-fade-in");
      }, 1000);
      setTimeout(() => {
        $(".star11").addClass("star-fade-in");
      }, 2000);
    }

    if (page === 9 || page === 12) {
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
      // 只建立一次，避免 DOM 爆掉
      if (!fanAndBubbleCreated) {
        fanAndBubbleCreated = true;
        $("#flipbook").append(`<div class="electfan"></div>
                           <div class="bubble-bg"></div>
                           <div class="bubble12"></div>
                           <div class="check-box"></div>
                           </div>`);

        $(".book-section").append(`
                           <div class="popup-board-bg">
                              <div class="popup-close-btn">x</div>
                            </div>
                           <div class="popup-board"></div>`);
      }

      setTimeout(() => $(".magic-wand").addClass("magic-wand-animation"), 500);
      setTimeout(() => $(".electfan").addClass("electfan-move"), 1000);
      setTimeout(() => $(".bubble-bg").addClass("bubble-move"), 2000);
      setTimeout(() => $(".bubble12").addClass("bubble-fade-in"), 3000);
      setTimeout(() => {
        $(".coin-hint01").addClass("bubble-fade-in");
      }, 12000);
      setTimeout(() => {
        $(".coin01").addClass("coin-animation");
        $(".coin-light").addClass("coin-light-show");
        $(".check01").addClass("check-show");
      }, 15000);

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
      $(".magic-wand").removeClass("magic-wand-animation");
      $(".coin01").removeClass("coin-animation");
      $(".coin-light").removeClass("coin-light-show");
      $(".coin-hint01").removeClass("bubble-fade-in");
      $(".check01").removeClass("check-show");
      $("#flipbook .electfan").remove();
      $("#flipbook .bubble-bg").remove();
      $("#flipbook .bubble12").remove();
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

        $("#flipbook").append(`<div class="small-cow"></div>
          <div class="board-list02"></div>
          <div class="board14"></div>
          <div class="check check02"></div>
          <div class="check-box"></div>
          <div class="click-milk"></div>
          <div class="bubble14">`);
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
          $(".board-list02").addClass("bubble-fade-in");
        }, 1000);

        setTimeout(() => {
          $(".bubble14").addClass("bubble-fade-in");
        }, 1000);

        setTimeout(() => {
          $(".click-milk").show();
        }, 13000);

        $("#flipbook .click-milk").on("click", function () {
          setTimeout(() => {
            $(".success-hint02").addClass("bubble-fade-in");
          }, 5000);
          $(".cows-tongue").addClass("cows-tongue-animation");
          $(".milk").addClass("milk-empty");
          $(".click-milk").hide();

          playAudio("sucking-coin", 0);
          setTimeout(() => {
            $(".coin-hint02").addClass("bubble-fade-in");
          }, 7000);
          setTimeout(() => {
            $(".check02").addClass("check-show");
            $(".coin02").addClass("coin-animation");
            $(".coin-light02").addClass("coin-light-show");
          }, 10000);
          setTimeout(() => {
            btnUnDisabled();
            canFlipNext = true;
            $("#right-down-corner").css("color", "#000");
            $("#right-down-corner").prop("disabled", false);
          }, 12000);
        });
      }
    }

    if (page === 13 || page === 16) {
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
        $("#flipbook").append(`
            <div class="story-text16"></div>
            <div class="mom-cow"></div>
            <div class="stethoscope disabled"></div>
            <div class="cow-eyes"></div>
            <div class="cow-heart"></div>
            <div class="dondon"></div>
            <div class="nurse-girl"></div>
            <div class="click-hearing-heart"></div>
            <div class="board-list03"></div>   
            <div class="check check03"></div>
            <div class="board16"></div>
            <div class="bubble16"></div>
            `);
        $("#flipbook").append(`<div class="check-box"></div>`);
        $(".book-section").append(`
                           <div class="popup-board-bg">
                              <div class="popup-close-btn">x</div>
                            </div>
                           <div class="popup-board"></div>`);

        setTimeout(() => {
          $(".bubble16").addClass("bubble-fade-in");
          $(".board-list03").addClass("bubble-fade-in");
        }, 1000);

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
          $(".click-hearing-heart").show();
        }, 15000);

        $("#flipbook .click-hearing-heart").on("click", function () {
          $(".dondon").addClass("bubble-fade-in");
          $(".stethoscope").addClass("stethoscope-move");
          $(".cow-heart").addClass("heart-beat-animation");
          $(".click-hearing-heart").hide();

          playAudio("hearts-coin", 1000);

          setTimeout(() => {
            $(".success-hint03").addClass("bubble-fade-in");
          }, 5000);
          setTimeout(() => {
            $(".coin-hint03").addClass("bubble-fade-in");
          }, 10000);
          setTimeout(() => {
            $(".check03").addClass("check-show");
            $(".coin03").addClass("coin-animation");
            $(".coin-light03").addClass("coin-light-show");
          }, 13000);
          setTimeout(() => {
            btnUnDisabled();
            canFlipNext = true;
            $("#right-down-corner").css("color", "#000");
            $("#right-down-corner").prop("disabled", false);
          }, 14000);
        });
      }
    }

    if (page === 15 || page === 18) {
      $(".stethoscope").addClass("disabled");
      $("#flipbook .stethoscope").removeClass("stethoscope-move");
      $(".cow-heart").removeClass("heart-beat-animation");
      $(".coin03").removeClass("coin-animation");
      $(".coin-light03").removeClass("coin-light-show");
      $(".check03").removeClass("check-show");
      $(".coin-hint03").removeClass("bubble-fade-in");
      $(".success-hint03").removeClass("bubble-fade-in");
      $(".dondon").removeClass("bubble-fade-in");
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
      <div class="coin-all  coin01-final"></div>
      <div class="coin-all coin02-final"></div>
      <div class="coin-all coin03-final"></div>
      <div class="coin-all-shine"></div>
      <div class="crown"></div>
      <div class="bubble18"></div>
    `);

      setTimeout(() => {
        $(".coin01-final, .coin02-final, .coin03-final").addClass(
          "coin-all-animation"
        );
      }, 1200);

      setTimeout(() => {
        $(".coin-all-shine").addClass("bubble-fade-in");
      }, 1500);

      setTimeout(() => {
        $(".bubble18").addClass("bubble-fade-in");
        $(".crown").addClass("crown-animation");
      }, 2500);
    }

    if (page === 17 || page === 20) {
      $(".coin01-final, .coin02-final, .coin03-final").removeClass(
        "coin-all-animation"
      );
      $(".crown").removeClass("crown-animation");
      $(".coin-all-shine").removeClass("bubble-fade-in");
      $(".bubble18").removeClass("bubble-fade-in");
      $("#flipbook .bubble18").remove();
      $("#flipbook .crown").remove();
      $("#flipbook .coin-all-shine").remove();
    }

    // 第 22–23 頁：小女孩夢境 + 浮出夢境
    if (page === 20 || page === 21) {
      $("#flipbook").append(`<div class="dream04"></div>`);
      $("#flipbook").append(`<div class="dream-girl"></div>`);
      $("#flipbook").append(`<div class="wow dialog20"></div>`);
      $("#flipbook").append(`<div class="bubble20"></div>`);
      $("#flipbook").append(`<div class="star20"></div>`);
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
        $(".star20").addClass("dialog20-animation");
        $(".dream-girl").addClass("dream-girl-animation");
      }, 5000);
      setTimeout(() => {
        $(".wow").addClass("dialog20-animation");
      }, 6000);
      setTimeout(() => {
        $(".bubble20").addClass("bubble-fade-in");
      }, 8000);
    } else {
      $(".dream04").remove();
      $(".dream-girl").remove();
      $(".dialog20").remove();
      $(".star20").remove();
      $(".bubble20").remove();
      $(".dream01").removeClass("dream-animation");
      $(".dream02").removeClass("dream-animation");
      $(".dream03").removeClass("dream-animation");
      $(".dream04").removeClass("dream-animation");
      $(".wow").removeClass("dialog20-animation");
      $(".star20").removeClass("dialog20-animation");
      $(".bubble20").removeClass("bubble-fade-in");
      $(".dream-girl").removeClass("dream-girl-animation");
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
      $(".milk-hand").removeClass("milk-hand-animation");
      $(".milk-inner").removeClass("milk-inner-full");
      $(".milk-drop").removeClass("milk-drop-show");
      $(".girl-l-hand").removeClass("girl-l-hand-empty");
      $(".girl-l-hand-region").removeClass("girl-l-hand-finish");
      $(".girl-l-hand-milk").removeClass("girl-l-hand-empty");
      $(".girl-r-hand").removeClass("girl-r-hand-finish");
      $(".girl-l-hand-finish-milk").removeClass("girl-l-hand-finished-milk");
      $(".milk-stains").removeClass("milk-stains-show");
      $(".milk-drop").removeClass("milk-drop-show");
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
      $(".milk-hand").addClass("milk-hand-animation");

      setTimeout(() => {
        $(".milk-drop").addClass("milk-drop-show");
      }, 1700);

      setTimeout(() => {
        $(".milk-inner").addClass("milk-inner-full");
      }, 3000);

      setTimeout(() => {
        $(".milk-flower").addClass("milk-drop-show");
        $(".milk-drop").removeClass("milk-drop-show");
      }, 5000);

      setTimeout(() => {
        $(".milk-smell").addClass("milk-smell-animation");
      }, 6000);
    }

    // 小女孩喝奶動畫流程（只綁一次，不堆疊）
    $(".click-girl")
      .off("click")
      .on("click", function () {
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
        }, 100);

        $(".click-girl").hide();
        $(".girl-l-hand-region").addClass("girl-l-hand-finish");
        $(".girl-r-hand").addClass("girl-r-hand-finish");

        playAudio("girl-drink-milk", 0);

        setTimeout(() => {
          $(".girl-l-hand-milk").addClass("girl-l-hand-empty");
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
      if (window.matchMedia("(max-height: 500px)").matches) {
        setTimeout(() => {
          if (isAndroidChrome()) {
            $(".father-hand-finish").css({
              top: (screenHeight * 359.2) / 609 + "px", //243
              left: (screenHeight * 53.214) / 609 + "px", //36
            });
            $(".daughter-hand-finish").css({
              top: (screenHeight * 403.536) / 609 + "px", //273
              left: (screenHeight * 375.45) / 609 + "px", //254
            });
            $(".mom-hand-finish").css({
              transform:
                `translate(` +
                (screenHeight * 84.255) / 609 +
                `px,` +
                (screenHeight * -75.386) / 609 +
                `px) rotate(33deg)`,
            }); //transform: translate(57px, -51px) rotate(33deg);
          }

          if (isSafari() || isIOSChrome()) {
            $(".father-hand-finish").css({
              top: (visualHeight * 305) / 609 + "px",
              left: (visualHeight * 125.14) / 609 + "px",
            });
            $(".daughter-hand-finish").css({
              bottom: (visualHeight * 114.1226) / 609 + "px",
              right: (visualHeight * 212.13) / 609 + "px",
            });
          }
        }, 550);
      }
      $(".father-hand-region").addClass("father-hand-finish");
      $(".daughter-hand-region").addClass("daughter-hand-finish");
      $(".mom-hand-region").addClass("mom-hand-finish");

      setTimeout(() => {
        $(".father-hand-milk").addClass("father-hand-milk-empty");
        $(".daughter-hand-milk").addClass("daughter-hand-milk-empty");
        $(".mom-hand-milk").addClass("mom-hand-milk-empty");
      }, 2550);

      setTimeout(() => {
        $(".dad-milk-ink ").addClass("dad-milk-ink-show ");
        $(".girls-milk-ink ").addClass("girls-milk-ink-show ");
      }, 3000);

      setTimeout(() => {
        $(".cow-right").addClass("cow-right-move");
      }, 3000);

      setTimeout(() => {
        $(".sweet-taste").addClass("sweet-taste-animation");
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
        "mom-hand-finish",

        // 空手動畫
        "father-hand-milk-empty",
        "daughter-hand-milk-empty",
        "mom-hand-milk-empty",

        // 墨水效果
        "dad-milk-ink-show",
        "girls-milk-ink-show",

        // 牛移動動畫
        "cow-right-move",
      ];

      // 批次移除所有指定 class
      $(
        ".father-hand, .daughter-hand, .mom-hand, .dad-milk-ink, .girls-milk-ink, .cow-right"
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

        setTimeout(() => {
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
            $("#flipbook").append(
              ' <div class="mom-hand-region"><div class="mom-hand-milk-region"><img class="mom-hand-milk" src="./images/book/book2627/牛奶.png"/><img class="mom-hand-cup" src="./images/book/book2627/空杯.png"/></div><img class="mom-hand" src="./images/book/book2627/媽媽手.png"/></div>'
            );
          }, 500);
        }
      } else {
        $(".mom-hand").removeClass("mom-hand-finish");
        $(".mom-hand-region").remove();
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
        $(".father-hand-region").removeClass("father-hand-finish");
        $(".daughter-hand-region").removeClass("daughter-hand-finish");
        $(".father-hand-milk").removeClass("father-hand-milk-empty");
        $(".daughter-hand-milk").removeClass("daughter-hand-milk-empty");
        $(".sweet-taste").removeClass("sweet-taste-animation");
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

      if (page === 6 || page === 7) {
        $("#flipbook").append('<div class="clouds"></div>');
        setTimeout(() => {
          $(".clouds").addClass("cloud-fade-in");
        }, 3000);

        if (isSafari() || isIOSChrome()) {
          $(".knock").css({
            right: (visualHeight * 200) / 609 + "px",
            bottom: (visualHeight * 150) / 609 + "px",
          });
        }
        if (isAndroidChrome()) {
          $(".knock").css({
            right: (screenHeight * 200) / 609 + "px",
            bottom: (screenHeight * 150) / 609 + "px",
          });
        }
      } else {
        $("#flipbook .clouds").remove();
        $(".clouds").removeClass("cloud-fade-in");
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
      // console.log("visualHeight:", visualHeight);
      // console.log("screenHeight:", screenHeight);

      if (page === 24 || page === 25) {
        if (isSafari() || isIOSChrome()) {
          $(".girl-l-hand-region").css({
            top: (visualHeight * 373.1) / 609 + "px",
            left: (visualHeight * 120.14) / 609 + "px",
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
          $(".girl-l-hand-region").css({
            top: (visualHeight * 373.1) / 609 + "px",
            left: (visualHeight * 120.14) / 609 + "px",
          });
          $(".girl-r-hand").css({
            bottom: (visualHeight * 72.177) / 609 + "px",
            right: (visualHeight * 210.576) / 609 + "px",
          });
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

          $(".father-hand-region").css({
            width: (screenHeight * 325.197) / 609 + "px", //220px
            top: (screenHeight * 395.85) / 609 + "px", //267.8px
            left: (screenHeight * 78.34) / 609 + "px", //53px
          });

          $(".father-hand").css({
            width: (screenHeight * 295.63) / 609 + "px", //200px
          });

          $(".father-hand-cup").css({
            width: (screenHeight * 72.43) / 609 + "px", //49px
            bottom: (screenHeight * -88.69) / 609 + "px", //-60px
            left: (screenHeight * 232.07) / 609 + "px", //157px
          });

          $(".father-hand-milk").css({
            width: (screenHeight * 73.9) / 609 + "px", //50px
            bottom: (screenHeight * -79.82) / 609 + "px", //-54px
            left: (screenHeight * 2378) / 609 + "px", //161px
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

          setTimeout(() => {
            $(".mom-hand-region").css({
              bottom: (screenHeight * 224.68) / 609 + "px", //152px
              right: (screenHeight * 739.078) / 609 + "px", //500px
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
          }, 550);

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
      } else if (page === 28) {
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

  let canFlip = true;

  let touchStartX = 0;
  let touchEndX = 0;

  const flipbook = document.getElementById("flipbook");

  flipbook.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  flipbook.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 30) return;

    // ❌ 冷卻期間禁止翻頁
    // if (!canFlip) return;

    canFlip = false; // 鎖住翻頁

    if (swipeDistance < 0) {
      $("#flipbook").turn("next");
    } else {
      $("#flipbook").turn("previous");
    }

    // ✅ 3 秒後解除鎖定
    // setTimeout(() => {
    //   canFlip = true;
    // }, 3000);
  }
});
