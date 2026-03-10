$(function () {
  const $flipbook = $("#flipbook");

  const screenWidth = screen.width;
  const screenHeight = screen.height;

  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight; // 目前可視高度（含工具列收起）
  const ratio = innerWidth / innerHeight;
  const visualWidth = visualViewport.width;
  const visualHeight = visualViewport.height;

  function getBookWidth() {
    return document.querySelector("#flipbook").getBoundingClientRect().width;
  }

  const isTablet =
    window.matchMedia("(pointer: coarse)").matches &&
    innerHeight >= 460 &&
    innerHeight <= 1000;

  const vh = window.visualViewport.height;
  function updateHeight() {
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  let isBookStarted = false;
  let girlsHeadInterval = null;
  let electfanInterval = null;
  let pageFirst = false;
  let replayTimer = null;
  let replayGeneration = 0;
  let isReplaying = false;
  let pageTimers = [];

  let currentVoiceSource = null;
  let voiceToken = 0;
  let lastAudioPage = null;
  const BG_VOLUME = 0.3;
  const VOICE_VOLUME = 1.2;

  let page23Timeouts = [];
  let page45Timeouts = [];
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

  function clearPageTimers() {
    pageTimers.forEach((t) => clearTimeout(t));
    pageTimers = [];
  }

  function addPageTimeout(fn, delay) {
    const id = setTimeout(fn, delay);
    pageTimers.push(id);
  }

  //判斷是否為Android平板
  function isAndroidTablet() {
    const ua = navigator.userAgent.toLowerCase();

    const isAndroid = ua.includes("android");
    const isMobile = ua.includes("mobile");

    // Android 平板 = Android + 沒有 mobile 字樣
    return isAndroid && !isMobile;
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

  function isIPad() {
    return (
      navigator.maxTouchPoints > 1 && /iPad|Macintosh/.test(navigator.userAgent)
    );
  }

  // window.alert(
  //   "visualHeight: " +
  //     visualHeight +
  //     "\nvisualWidth: " +
  //     visualWidth +
  //     "\ninnerHeight " +
  //     innerHeight +
  //     "\ninnerWidth " +
  //     innerWidth +
  //     "\nscreenHeight " +
  //     screenHeight +
  //     "\nscreenWidth " +
  //     screenWidth +
  //     "\nisIOSChrome(): " +
  //     isIOSChrome() +
  //     "\nisAndroidChrome(): " +
  //     isAndroidChrome() +
  //     "\nisSafari(): " +
  //     isSafari() +
  //     "\nisIPad(): " +
  //     isIPad(),
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
    const response = await fetch("./mp3/background.mp3");
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    bgSource = audioContext.createBufferSource();
    bgSource.buffer = audioBuffer;
    bgSource.loop = true;

    // 接到背景音量控制
    bgSource.connect(bgGainNode);

    bgSource.start(0);
  }

  $flipbook.turn({
    width: 1200,
    height: 600,
    autoCenter: true,
  });
  if (!matchMedia("(pointer: coarse)").matches) {
    console.log("desktop mode");
  } else if (isTablet || isIPad()) {
    console.log("tablet mode");
    // 等 turn.js 完成 layout
    requestAnimationFrame(() => {
      const w = getBookWidth();
      $("#left-down-corner").hide();
      if (innerWidth > 1280) {
        $(".book-section").css({
          left: (-w / 2) * 1.01 + "px",
        });
      } else if (innerWidth > 1000 && innerWidth <= 1280) {
        $(".book-section").css({
          left: (-w / 2) * 0.85 + "px",
        });
      } else {
        $(".book-section").css({
          left: (-w / 2) * 0.85 + "px",
        });
      }

      $(".controls").hide();
      $(".book-container").css("height", window.innerHeight);
    });
  } else {
    console.log("mobile mode");
    // 等 turn.js 完成 layout
    requestAnimationFrame(() => {
      const w = getBookWidth();
      $("#left-down-corner").hide();
      $(".book-section").css({
        left: -w * 0.425 + "px",
      });
      $(".controls").hide();
      $(".book-container").css("height", window.innerHeight);
    });

    $(".pop-up-box").on("click", async function () {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      playBackground();
      setTimeout(() => {
        $(".pop-up-box").css("display", "none");
        if (!isBookStarted) {
          isBookStarted = true;
          stopVoice();
          playVoice("./mp3/01.mp3");
          $("#cover").addClass("book01-start");
          startReplayTimer(5500);
        }
      }, 200);
    });
  }

  function resizeFunction() {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    let scaleMobile;
    let scaleMobileTranslateY;

    //resize書本大小
    const wrapper = $(".book-scale-wrapper");

    let scale = 1;

    // ===== Desktop =====
    if (!isCoarse) {
      $("#flipbook").css({
        transform: "none",
        width: "1200px",
        height: "600px",
      });

      $(".book-section").css({
        transform: "none",
        width: "1200px",
        height: "600px",
      });
      console.log("進來桌機");
      return; // 直接結束
    } else if (isTablet || isIPad()) {
      console.log("進來平板");
      if (ratio < 1.2 && ratio > 1) {
        scale = 0.8; // 你要的固定值
        $("#flipbook").css({
          transform: `scale(` + scale + `) translateY(-73px)`,
        });
      } else {
        scale = 0.9; // 你要的固定值
        $("#flipbook").css({
          transform: `scale(` + scale + `) translateY(-33px)`,
        });
      }
      $(".book-section").css({
        transform: `scale(` + scale + `)`,
        width: scale * scale * 1200 + "px",
        height: scale * scale * 600 + "px",
      });
    } else {
      console.log("進來手機");
      if (innerHeight >= 320) {
        scaleMobile = 0.8;
        scaleMobileTranslateY = -76;
      } else {
        scaleMobile = 0.75;
        scaleMobileTranslateY = -96;
      }
      scale = scaleMobile; // 你要的固定值
      $(".book-section").css({
        transform: `scale(` + scale + `)`,
        width: scale * scale * 1200 + "px",
        height: scale * scale * 600 + "px",
      });

      $("#flipbook").css({
        transform:
          `scale(` + scale + `) translateY(` + scaleMobileTranslateY + `px)`,
      });
    }

    wrapper.css({
      transform: `scale(${scale})`,
    });

    // ⭐ turn.js 重新計算翻頁區域
    setTimeout(() => {
      $("#flipbook").turn("resize");
    }, 200);

    //翻轉手機提示
    const isPortrait = window.innerHeight > window.innerWidth;
    document.getElementById("rotate-notice").style.display = isPortrait
      ? "block"
      : "none";
  }

  // 初始檢查
  resizeFunction();

  // 當裝置旋轉時重新檢查
  window.addEventListener("resize", resizeFunction);

  // 當裝置旋轉時重新載入
  const orientationMedia = window.matchMedia("(orientation: portrait)");

  let reloadTimer = null;

  if (matchMedia("(pointer: coarse)").matches) {
    orientationMedia.addEventListener("change", () => {
      clearTimeout(reloadTimer);

      reloadTimer = setTimeout(() => {
        location.reload();
      }, 300); // 等旋轉動畫結束
    });
  }

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
    stopVoice();
    $("#flipbook").turn("next");
  });

  let isBtnDisabled;

  //有任務下一頁 鎖定按鈕
  function btnDisabled() {
    isBtnDisabled = true;
    $(".next-page img").attr("src", "./images/common/next-grey-img.png");
    $(".next-page").prop("disabled", true);

    if (
      window.matchMedia("(max-height: 460px)").matches ||
      isTablet ||
      isIPad()
    ) {
      $("#right-down-corner").css("color", "##969696");
      $("#right-down-corner").prop("disabled", true);
    }
  }

  //有任務下一頁 不鎖定按鈕
  function btnUnDisabled() {
    isBtnDisabled = false;
    $(".next-page img").attr("src", "./images/common/next-img.png");
    $(".next-page img").css("cursor", "pointer");
    $(".next-page").prop("disabled", false);
  }

  //上一頁按鈕 倒數三秒
  function btnPreviousDisabled() {
    console.log("btnPreviousDisabled!");
    let count = 3;
    let countMobile = 3;
    const prevMobileBtn = $("#left-down-corner")[0];

    const timer = setInterval(() => {
      count--;

      if (count > 0) {
        $(".prev-page img").attr("src", `./images/common/${count}sec.png`);
      } else {
        clearInterval(timer);
        $(".prev-page img").attr("src", "./images/common/prve-img.png");
        $(".prev-page img").css("cursor", "pointer");
      }
    }, 1000);

    if (
      window.matchMedia("(max-height: 460px)").matches ||
      isTablet ||
      isIPad()
    ) {
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
    $(".prev-page img").attr("src", "./images/common/prev-grey-img.png");
    setTimeout(() => {
      $(".prev-page img").attr("src", "./images/common/prve-img.png");
      $(".prev-page").prop("disabled", false);
    }, 3000);
  }

  //上下一頁 倒數3秒
  function allBtnDisabled(page) {
    let count = 3;
    let countMobile = 3;

    //一開始先顯示 3 秒
    $(".prev-page img").attr("src", "./images/common/3sec.png");
    $(".next-page img").attr("src", "./images/common/3sec.png");
    $(".prev-page").prop("disabled", true);
    $(".next-page").prop("disabled", true);

    const prevMobileBtn = $("#left-down-corner")[0];
    const nextMobileBtn = $("#right-down-corner")[0];

    const timer = setInterval(() => {
      count--;

      if (count > 0) {
        $(".prev-page img").attr("src", `./images/common/${count}sec.png`);
        $(".next-page img").attr("src", `./images/common/${count}sec.png`);
        $(".prev-page").prop("disabled", true);
        $(".next-page").prop("disabled", true);
      } else {
        clearInterval(timer);
        $(".prev-page img").attr("src", "./images/common/prve-img.png");
        $(".next-page img").attr("src", "./images/common/next-img.png");
        $(".prev-page").css("cursor", "pointer");
        $(".next-page").css("cursor", "pointer");
        $(".prev-page").prop("disabled", false);
        $(".next-page").prop("disabled", false);
      }
    }, 1000);

    if (page !== 6) {
      //手機版 控制按鈕
      if (
        window.matchMedia("(max-height: 460px)").matches ||
        isTablet ||
        isIPad()
      ) {
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

    setTimeout(() => {
      $(".prev-page img").attr("src", "./images/common/prve-img.png");
      $(".next-page img").attr("src", "./images/common/next-img.png");
      $(".prev-page img, .next-page img").prop("disabled", false);
    }, 3000);
  }

  // 上一頁按鈕
  $(".prev-page").on("click", function () {
    stopVoice();
    $flipbook.turn("previous");
  });

  // 下一頁按鈕
  $(".next-page").on("click", async function () {
    stopVoice();
    $flipbook.turn("next");
  });

  function startReplayTimer(delay) {
    const pageAtStart = currentPage;
    //記住這次世代
    const myGeneration = replayGeneration;

    // 清掉舊 timer
    if (replayTimer) {
      clearTimeout(replayTimer);
      replayTimer = null;
    }

    replayBtnTrunGray();

    if (isTablet || isIPad()) {
      $(".replay-mobile-btn-body").addClass("replay-mobile-btn-disabled");
    }

    if (window.matchMedia("(max-height: 460px)").matches) {
      $(".replay-mobile-btn-body").prop("disabled", true);
      $(".replay-mobile-btn-body").addClass("replay-mobile-btn-disabled");
    } else {
      // 先鎖按鈕
      $(".replay-btn").prop("disabled", true);
      $(".replay-btn img").attr("src", "./images/common/replay-grey-btn.png");
    }

    // 建立新 timer
    replayTimer = setTimeout(() => {
      //新增這行
      if (pageAtStart !== currentPage) return;
      // 如果不是最新 replay → 不准執行
      if (myGeneration !== replayGeneration) return;

      if (isTablet || isIPad()) {
        $(".replay-mobile-btn-body").prop("disabled", false);
        $(".replay-mobile-btn-body").removeClass("replay-mobile-btn-disabled");
      }

      if (window.matchMedia("(max-height: 460px)").matches) {
        $(".replay-mobile-btn-body").prop("disabled", false);
        $(".replay-mobile-btn-body").removeClass("replay-mobile-btn-disabled");
      } else {
        $(".replay-btn").prop("disabled", false);
        $(".replay-btn img").attr("src", "./images/common/replay-btn.png");
      }
    }, delay);
  }

  $(".book-cover-pc").on("click", async function () {
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    if (!isBookStarted) {
      isBookStarted = true;
      pageFirst = true;
      playBackground();
      setTimeout(() => {
        $(".prev-page img").hide();
        $(".book-cover-pc").hide();
        stopVoice();
        playVoice("./mp3/01.mp3");
        $("#cover").addClass("book01-start");
        $(".next-page img").attr("src", "./images/common/next-img.png");

        $(".prev-page").prop("disabled", true);
        $(".prev-page").show();
        $(".book-cover").remove();

        startReplayTimer(5500);

        return;
      }, 200);
    }
  });

  // 鍵盤方向鍵控制翻頁
  $(document).on("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      stopVoice();
      $flipbook.turn("previous");
    } else if (e.key === "ArrowRight") {
      stopVoice();
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
      if (isTablet || isIPad()) {
        $(".mute-mobile-toggle").css("background", "#fff");
        $(".mute-mobile-toggle").html('<i class="fas fa-volume-mute"></i>');
      }

      if (!window.matchMedia("(max-height: 460px)").matches) {
        $(".mute-toggle img").attr("src", "./images/common/mute-btn-open.png");
      } else {
        $(".mute-mobile-toggle").css("background", "#fff");
        $(".mute-mobile-toggle").html('<i class="fas fa-volume-mute"></i>');
      }
    } else {
      if (isTablet || isIPad()) {
        $(".mute-mobile-toggle").css("background", "rgba(169, 169, 169, 0.2)");
        $(".mute-mobile-toggle").html('<i class="fas fa-volume-up"></i>');
      }

      if (!window.matchMedia("(max-height: 460px)").matches) {
        $(".mute-toggle img").attr("src", "./images/common/mute-btn-close.png");
      } else {
        $(".mute-mobile-toggle").css("background", "rgba(169, 169, 169, 0.2)");
        $(".mute-mobile-toggle").html('<i class="fas fa-volume-up"></i>');
      }
    }
  });

  async function resumeAudio() {
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
  }

  async function replayCurrentPage() {
    await resumeAudio();

    stopVoice();

    lastAudioPage = null; // ⭐ 這行很重要

    playAudioByPage(currentPage);
  }

  $(".replay-btn")
    .off("click.replay")
    .on("click.replay", async function () {
      //新世代（讓舊 timer 全部失效）
      replayGeneration++;
      // 先強制變灰（避免被舊timer覆蓋）
      replayBtnTrunGray();

      clearPageTimers(); // kill 舊動畫

      isReplaying = true;

      replayCurrentPage();

      handlePage(currentPage, true);

      // page 28 專用：重新開始20秒計時
      if (currentPage === 28) {
        startReplayTimer(20000);
      }

      if (pageFirst === true) {
        startReplayTimer(5500);
        pageFirst = false;
      }

      setTimeout(() => {
        isReplaying = false;
      }, 50);
    });

  $(".replay-mobile-btn-body")
    .off("click.replay")
    .on("click.replay", async function () {
      // 只加一次！！
      replayGeneration++;

      // 立即變灰（鎖住按鈕）
      replayBtnTrunGray();

      // 清除舊動畫 timer
      clearPageTimers();

      isReplaying = true;

      replayCurrentPage();

      handlePage(currentPage, true);

      // page 28：重新計時 20 秒亮
      if (currentPage === 28) {
        startReplayTimer(20000);
      }

      // 封面用
      if (pageFirst === true) {
        startReplayTimer(5500);
        pageFirst = false;
      }

      setTimeout(() => {
        isReplaying = false;
      }, 50);
    });

  function addMilkTimeout(fn, delay) {
    const id = setTimeout(fn, delay);
    page2425Timeouts.push(id);
  }

  addMilkTimeout(() => {
    btnUnDisabled();
    canFlipNext = true;
  }, 12000);

  // 重置該頁面的所有動畫與音效
  function resetMilkPage() {
    // ⭐ 清除所有 timeout
    page2425Timeouts.forEach((id) => clearTimeout(id));
    page2425Timeouts = [];
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
    $(".milk-drop").removeClass("opacity-show");
    $(".girl-l-hand").removeClass("girl-l-hand-empty");
    $(".girl-l-hand-region").removeClass("girl-l-hand-finish");
    $(".girl-r-hand").removeClass("girl-r-hand-finish");
    $(".milk-stains").removeClass("opacity-show");
    $(".milk-drop").removeClass("opacity-show");
    $(".book25-story").removeClass("opacity-show");
    $(".book25-text").removeClass("opacity-show");
    $(".milk-flower").css("dispaly", "none");
    $(".milk-flower").removeClass("opacity-show");
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
      }, 800),
    );

    page2425Timeouts.push(
      setTimeout(() => {
        $(".milk-hand").addClass("milk-hand-animation");
      }, 2300),
    );

    page2425Timeouts.push(
      setTimeout(() => {
        $(".milk-drop").addClass("opacity-show");
      }, 3000),
    );

    page2425Timeouts.push(
      setTimeout(() => {
        $(".milk-inner").css("opacity", "1");
      }, 5300),
    );

    page2425Timeouts.push(
      setTimeout(() => {
        $(".milk-flower").addClass("opacity-show");
        $(".milk-drop").removeClass("opacity-show");
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
      }, 13500),
    );
  }

  // 第 26–27 頁 家人喝牛奶
  function startFamilyAnimation() {
    $("#flipbook").append(`
      <img class="all-milk-stains" src="./images/book/book2627/milk-stains.png" />
    `);

    $(".next-page img").show();
    page2627Timeouts.push(
      setTimeout(() => {
        $(".father-hand-region").show();
      }, 1500),
    );
    console.log(".father-hand-regionshow()!!!!");
    $(".father-hand-region").css("opacity", "1");

    page2627Timeouts.push(
      setTimeout(() => {
        $(".book26").css("opacity", "1");
        $(".book27").css("opacity", "1");
      }, 1200),
    );

    page2627Timeouts.push(
      setTimeout(() => {
        $(".text26").addClass("opacity-show");
      }, 100),
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

    page2627Timeouts.push(
      setTimeout(() => {
        $(".daughter-hand-region").addClass("daughter-hand-finish");
      }, 3500),
    );

    page2627Timeouts.push(
      setTimeout(() => {
        $(".father-hand-region").addClass("father-hand-finish");
        $(".mom-hand-region").addClass("mom-hand-finish");
      }, 3500),
    );

    page2627Timeouts.push(
      setTimeout(() => {
        $(".cheers").addClass("opacity-show");
      }, 4000),
    );

    page2627Timeouts.push(
      setTimeout(() => {
        $(".father-hand-milk").css("opacity", "0");
        $(".daughter-hand-milk").css("opacity", "0");
        $(".mom-hand-milk").css("opacity", "0");
      }, 4500),
    );

    page2627Timeouts.push(
      setTimeout(() => {
        $(".all-milk-stains ").addClass("all-milk-stains-show ");
      }, 5000),
    );

    page2627Timeouts.push(
      setTimeout(() => {
        $(".sweet-taste").addClass("opacity-show");
      }, 5500),
    );

    page2627Timeouts.push(
      setTimeout(() => {
        $(".father-hand-region").removeClass("father-hand-finish");
        $(".daughter-hand-region").removeClass("daughter-hand-finish");
        $(".mom-hand-region").removeClass("mom-hand-finish");
      }, 8000),
    );

    page2627Timeouts.push(
      setTimeout(() => {
        $(".cow-right").addClass("cow-right-move");
      }, 10500),
    );

    page2627Timeouts.push(
      setTimeout(() => {
        $(".mow").show();
      }, 13000),
    );

    startReplayTimer(16000);
  }

  // Reset function
  // 重置家人手部與牛相關動畫狀態
  function resetFamilyPage() {
    $(".book26").css("opacity", "0");
    $(".book27").css("opacity", "0");
    $(".milk-box").css("opacity", "0");
    $(".father-hand").css("opacity", "0");
    $(".father-hand-region").hide();
    $(".father-hand-region").removeClass("father-hand-finish");
    $(".father-hand-milk").css("display", "none");
    $(".father-hand-cup").css("opacity", "0");
    $(".daughter-hand").css("opacity", "0");
    $(".daughter-hand-milk").css("display", "none");
    $(".daughter-hand-cup").css("opacity", "0");
    $(".mom-hand-milk").css("opacity", "0");
    $(".cheers").removeClass("opacity-show");
    $(".text26").removeClass("opacity-show");
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

  function replayBtnTrunGray() {
    if (isTablet || isIPad()) {
      $(".replay-mobile-btn-body")
        .prop("disabled", true)
        .addClass("replay-mobile-btn-disabled");
    }

    // 可選：恢復灰色按鈕
    if (window.matchMedia("(max-height: 460px)").matches) {
      $(".replay-mobile-btn-body")
        .prop("disabled", true)
        .addClass("replay-mobile-btn-disabled");
    } else {
      $(".replay-btn").prop("disabled", true);
      $(".replay-btn img").attr("src", "./images/common/replay-grey-btn.png");
    }
  }

  function handlePage(page, replay) {
    if (currentVoiceSource) {
      currentVoiceSource.stop();
      currentVoiceSource.disconnect();
      currentVoiceSource = null;
    }

    playAudioByPage(page);

    let canFlipPrev = false; // 初始禁止往前翻頁
    let canFlipNext = false; // 初始禁止往後翻頁

    function isCanNotFlipPrev() {
      if (!window.matchMedia("(max-height: 460px)").matches) {
        console.log("pre disabled~~~~");
        $("#left-up-corner")
          .off("click") // 移除舊的
          .on("click", function () {
            if (!canFlipPrev) {
              return;
            }
            stopVoice();
            $("#flipbook").turn("previous");
          });
      }

      $("#left-down-corner")
        .off("click") // 移除舊的
        .on("click", function () {
          if (!canFlipPrev) {
            return;
          }
          stopVoice();
          $("#flipbook").turn("previous");
        });
    }

    function isCanNotFlipNext() {
      if (!window.matchMedia("(max-height: 460px)").matches) {
        $("#right-up-corner")
          .off("click")
          .on("click", function () {
            if (!canFlipNext) {
              return;
            }
            stopVoice();
            $("#flipbook").turn("next");
          });
      }

      $("#right-down-corner")
        .off("click")
        .on("click", function () {
          if (!canFlipNext) {
            return;
          }
          stopVoice();
          $("#flipbook").turn("next");
        });
    }

    function isCanNotFlip() {
      isCanNotFlipPrev();
      isCanNotFlipNext();
    }

    if (page === 1) {
      isCanNotFlip();
      setTimeout(() => {
        canFlipNext = true;
      }, 3000);

      pageFirst = true;
      let count = 3;

      $("#left-down-corner").hide();
      $(".prev-page img").hide();
      $(".next-page img").attr("src", "./images/common/next-grey-img.png");
      $(".next-page").prop("disabled", true);

      const timer = setInterval(() => {
        count--;

        if (count > 0) {
          $(".next-page img").attr("src", `./images/common/${count}sec.png`);
          $(".next-page").prop("disabled", true);
        } else {
          clearInterval(timer);
          $(".next-page img").attr("src", "./images/common/next-img.png");
          $(".next-page").css("cursor", "pointer");
          $(".next-page").prop("disabled", false);
        }
      }, 1000);

      setTimeout(() => {
        $(".next-page img").attr("src", "./images/common/next-img.png");
        $(".next-page").prop("disabled", false);
      }, 3000);
    }

    function reset23() {
      page23Timeouts.forEach((id) => clearTimeout(id));
      page23Timeouts = [];
      $(".book02").css("opacity", "0");
      $(".text02").css("opacity", "0");
      $(".book03").css("opacity", "0");
      $(".book03-title").css("opacity", "0");
      $(".girls-head03").css("opacity", "0");
      $(".girls-body03").hide();
      $(".milk03").css("opacity", "0");
      $(".hands03").css("opacity", "0");
      $("#flipbook .girls-head03").remove();
      $("#flipbook .milk03").remove();
      $("#flipbook .hands03").remove();
      $("#flipbook .book03-title").remove();
      $("#flipbook .girls-head03").remove();
    }

    if (page === 2 || page === 3) {
      if (replay) {
        reset23();
      }

      pageFirst = false;

      replayBtnTrunGray();

      $(".prev-page img").show();
      $("#left-down-corner").show();

      $("#flipbook").append(
        ` <img class="girls-head03" src="./images/book/book03/girls-head-01.png"/>       
          <img class="girls-body03" src="./images/book/book03/girls-body.png"/>     
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
          $(".girls-body03").css("opacity", "1");
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
        if (girlsHeadInterval) return; // 避免重複開 interval
        girlsHeadInterval = setInterval(() => {
          index = (index + 1) % images.length;
          img.src = images[index];
        }, 500);
      }, 1500);

      startReplayTimer(15000);
    } else {
      reset23();
    }

    if (page === 1 || page === 4) {
      if (girlsHeadInterval) {
        clearInterval(girlsHeadInterval);
        girlsHeadInterval = null;
      }
      $("#flipbook .cloud01").remove();
      $("#flipbook .book03-title").remove();
    }

    function reset45() {
      page45Timeouts.forEach((id) => clearTimeout(id));
      page45Timeouts = [];
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

    if (page === 4 || page === 5) {
      if (replay) {
        reset45();
      }

      page45Timeouts.push(
        setTimeout(() => {
          $(".book04").css("opacity", "1");
          $(".text04").css("opacity", "1");
          $(".eyes-4").css("opacity", "1");
        }, 1000),
      );

      page45Timeouts.push(
        setTimeout(() => {
          $(".eyes-ball").addClass("eyes-ball-animation");
          $(".eyes-4").addClass("eyes-big-animation");
          $(".question").addClass("question-animation");
        }, 8000),
      );

      page45Timeouts.push(
        setTimeout(() => {
          $(".book05").css("opacity", "1");
          $(".text05").css("opacity", "1");
          $(".daughter-5").css("opacity", "1");
          $(".moms-head-5").css("opacity", "1");
          $(".daughter-hand-5").css("opacity", "1");
          $(".moms-hand-5").css("opacity", "1");
        }, 22000),
      );

      page45Timeouts.push(
        setTimeout(() => {
          $(".gogo").css("opacity", "1");
        }, 28500),
      );

      startReplayTimer(31000);
    } else {
      reset45();
    }

    let doorClicked = false;
    let doorClickBound = false;

    function reset67() {
      page67Timeouts.forEach((id) => clearTimeout(id));
      page67Timeouts = [];
      doorClicked = false;
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
      $(".grass0607").removeClass("opacity-show");
      $(".tree1").removeClass("opacity-show");
      $(".tree2").removeClass("opacity-show");
      $(".tree3").removeClass("opacity-show");
      $(".cloud1").removeClass("opacity-show");
      $(".cloud2").removeClass("opacity-show");
      $(".cloud3").removeClass("opacity-show");
      $(".text06").removeClass("opacity-show");
      $(".wow").removeClass("wow-animation");
    }

    // 第 6–7 頁：點擊門跑出森林
    if (page === 6 || page === 7) {
      if (replay) {
        reset67();
      }

      replayBtnTrunGray();

      page67Timeouts.push(
        setTimeout(() => {
          $(".knock").css("opacity", "1");
          $(".door").css("opacity", "1");
        }, 1000),
      );

      isCanNotFlip();

      addPageTimeout(() => {
        canFlipPrev = true;
      }, 3000);

      if (!doorClickBound) {
        doorClickBound = true;

        $("#flipbook").append(
          `<img class="knock" src="./images/book/book0607/click-here.png"/>
          <img class="grass0607" src="./images/book/book0607/grass.png"/>
          <img class="tree1" src="./images/book/book0607/forest1.png"/>
          <img class="tree2" src="./images/book/book0607/forest2.png"/>           
          <img class="tree3" src="./images/book/book0607/forest3.png"/>         
          <img class="text06" src="./images/book/book0607/text-06.png"/>        
          <img class="cloud2" src="./images/book/book0607/cloud2.png"/>           
          <img class="bubble67" src="./images/book/book0607/milk-bubble.png"/>           
          <img class="star5" src="./images/book/book0607/shine.png"/>         
          <img class="door-bg door-common" src="./images/book/book0607/indoor.png"/>           
          <img class="door door-common" src="./images/book/book0607/door.png"/>            
          <img class="peoples" src="./images/book/book0607/mom-lin.png"/>
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
          if (doorClicked) return; // 已經點過就直接結束
          doorClicked = true;
          $(".knock").css("display", "none");
          $(".text06").addClass("opacity-show");
          $(".cloud1").addClass("opacity-show");

          page67Timeouts.push(
            setTimeout(() => {
              $(".grass0607").addClass("opacity-show");
              $(".tree1").addClass("opacity-show");
            }, 2500),
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".wow").addClass("wow-animation");
              $(".tree2").addClass("opacity-show");
              $(".door").addClass("door-opening");
              $(".peoples").addClass("peoples-open");
            }, 2500),
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".tree3").addClass("opacity-show");
              $(".cloud2").addClass("opacity-show");
              $(".cloud3").addClass("opacity-show");
            }, 4000),
          );

          page67Timeouts.push(
            setTimeout(() => {
              $(".bubble67").addClass("opacity-show");
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

          startReplayTimer(11000);
          stopVoice();
          playVoice("./mp3/04.mp3");
        });
      }
    }

    if (page === 5 || page === 8) {
      reset67();
    }

    function reset89() {
      page89Timeouts.forEach((id) => clearTimeout(id));
      page89Timeouts = [];
      $(".foot1").removeClass("foot1-animation");
      $(".foot2").removeClass("foot2-animation");
      $(".foot3").removeClass("foot3-animation");
      $(".foot4").removeClass("foot4-animation");
      $(".foot5").removeClass("foot5-animation");
      $(".mowmow").removeClass("opacity-show");
      $(".text09").removeClass("opacity-show");
      $(".eyes-ball-8").removeClass("eyes-ball-animation");
      $(".mom-daughter").removeClass("mom-daughter-animation");
      $(".bubble7").removeClass("opacity-show");
      $(".star7").removeClass("star-fade-in");
      $("#flipbook .mom-daughter").remove();
      $("#flipbook .bubble7").remove();
      $("#flipbook .star7").remove();
      $(".book08").css("opacity", "0");
      $(".book09").css("opacity", "0");
      $(".eyes-8").css("opacity", "0");
      $(".eyes-ball-8").css("opacity", "0");
    }

    if (page === 8 || page === 9) {
      if (replay) {
        reset89();
      }

      $("#flipbook").append(
        `<img class="mom-daughter" src="./images/book/book08/lin-mom.png"/>
        <img class="bubble7" src="./images/book/book08/milk-bubble.png"/>
        <img class="star7" src="./images/book/book09/shine.png"/>
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
        }, 6000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".eyes-ball-8").addClass("eyes-ball-animation");
          $(".mom-daughter").addClass("mom-daughter-animation");
        }, 9000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".text09").addClass("opacity-show");
        }, 11000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".mowmow").addClass("opacity-show");
          $(".bubble7").addClass("opacity-show");
        }, 10000),
      );

      page89Timeouts.push(
        setTimeout(() => {
          $(".star7").addClass("star-fade-in");
        }, 10000),
      );

      startReplayTimer(20000);
    }

    if (page === 7 || page === 10) {
      reset89();
    }

    function reset1011() {
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
      $(".list").removeClass("opacity-show");
      $(".cloud-01").removeClass("cloud-animation");
      $(".cloud-02").removeClass("cloud-animation");
      $(".book10-text").removeClass("opacity-show");
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

    if (page === 10 || page === 11) {
      if (replay) {
        reset1011();
      }

      $("#flipbook").append(
        ` <img class="text11" src="./images/book/book11/text11.png">
        <img class="girls-head" src="./images/book/book10/mom-lin.png"/>        
        <img class="rainbow"  src="./images/book/book11/rainbow.png"/>
        <img class="star11" src="./images/book/book11/light.png">
        <img class="bubble11" src="./images/book/book11/milk-bubble.png">
        <img class="cloud-group" src="./images/book/book11/cloud01.png">
        <img class="cow05" src="./images/book/book10/cow05.png"/>
        <img src="./images/book/book11/board.png" class="list-board"/>
        <img src="./images/book/book11/list-content.png" class="list"/>
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
          $(".bubble11").addClass("opacity-show");
        }, 800),
      );

      page1011Timeouts.push(
        setTimeout(() => {
          $(".list").addClass("opacity-show");
          $(".star11").addClass("star-fade-in");
        }, 2000),
      );

      page1011Timeouts.push(
        setTimeout(() => {
          $(".book10-text").addClass("opacity-show");
        }, 12000),
      );

      page1011Timeouts.push(
        setTimeout(() => {
          $(".text11").css("opacity", "1");
        }, 16000),
      );

      startReplayTimer(23000);
    }

    if (page === 9 || page === 12) {
      reset1011();
    }

    //跳出看板
    let popupBoard = (page) => {
      $(".check-box")
        .off("click touchstart")
        .on("click touchstart", function (e) {
          // 防止事件重複觸發（避免 click 跟 touchstart 同時跑兩次）
          e.preventDefault();
          e.stopImmediatePropagation();

          $("body").addClass("popup-open"); // 開啟 popup
          $("#flipbook").turn("disable", true);
          $(".popup-board").css("display", "block");

          if (page === 12 || page === 13) {
            if (
              window.matchMedia("(max-height: 460px)").matches ||
              isTablet ||
              isIPad()
            ) {
              $(".popup-board-bg01").css("display", "block");
              $(".popup-board-bg02, .popup-board-bg03").css("display", "none");
              $(".popup-board-bg02, .popup-board-bg03").remove();
            }
            stopVoice();
            playVoice("./mp3/07b.mp3");
          }

          if (page === 14 || page === 15) {
            if (
              window.matchMedia("(max-height: 460px)").matches ||
              isTablet ||
              isIPad()
            ) {
              $(".popup-board-bg02").css("display", "block");
              $(".popup-board-bg01, .popup-board-bg03").css("display", "none");
              $(".popup-board-bg01, .popup-board-bg03").remove();
            }
            stopVoice();
            playVoice("./mp3/08b.mp3");
          }

          if (page === 16 || page === 17) {
            if (
              window.matchMedia("(max-height: 460px)").matches ||
              isTablet ||
              isIPad()
            ) {
              $(".popup-board-bg03").css("display", "block");
              $(".popup-board-bg01, .popup-board-bg02").css("display", "none");
              $(".popup-board-bg01, .popup-board-bg02").remove();
            }
            stopVoice();
            playVoice("./mp3/09b.mp3");
          }
        });

      $(".popup-board, .popup-board-bg")
        .off("click touchstart")
        .on("click touchstart", function (e) {
          // 防止事件重複觸發（避免 click 跟 touchstart 同時跑兩次）
          e.preventDefault();
          e.stopImmediatePropagation();

          $(".popup-board").css("display", "none");
          $(".popup-board-bg").css("display", "none");
          $("body").removeClass("popup-open"); // 關閉 popup
          $("#flipbook").turn("disable", false);
          stopVoice();
        });
    };

    // 確保元素只 append 一次
    let fanAndBubbleCreated = false;
    let milkClickBound = false;

    function reset1213() {
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
      $(".star13").removeClass("star3-animation");
      $(".electfan").removeClass("electfan-move");
      $(".bubble-bg").removeClass("opacity-show");
      $(".magic-wand").removeClass("magic-wand-animation");
      $(".coin01").removeClass("coin-animation");
      $(".coin-light").removeClass("coin-light-show");
      $(".coin-hint01").removeClass("opacity-show");
      $(".check01").removeClass("opacity-show");
      $(".check01").remove();
      $(".popup-board01").css("display", "none");
      $("#flipbook .click-magic-wand").remove();
      $("#flipbook .finish-mission01").remove();
      $("#flipbook .electfan").remove();
      $("#flipbook .electfan-wind").remove();
      $("#flipbook .electfan-wind-line").remove();
      $("#flipbook .bubble-bg").remove();
      $("#flipbook .bubble12").remove();
      $(".star13").remove();
      $("#flipbook .check-box").remove();
      $(".book-section .popup-board-bg").remove();
      $(".book-section .popup-board").remove();
      $(".board13").remove();
      $(".popup-board01").remove();
      $(".popup-board-bg01").remove();
      $(".text12").remove();
      $(".check-box").hide();
    }

    if (page === 12 || page === 13) {
      if (replay) {
        reset1213();
      }

      replayBtnTrunGray();

      isCanNotFlip();

      addPageTimeout(() => {
        canFlipPrev = true;
      }, 3000);

      // 只建立一次，避免 DOM 爆掉
      if (!fanAndBubbleCreated) {
        fanAndBubbleCreated = true;
        btnPreviousDisabled();
        btnDisabled();

        $("#flipbook")
          .append(`<img class="electfan" src="./images/book/book12/electfan1.png"/>
                   <img class="text text12" src="./images/book/book12/text12.png"/>
                   <img class="electfan-wind" src="./images/book/book12/electfan-wind.png"/>
                   <img class="electfan-wind-line" src="./images/book/book12/electfan-wind-line.png"/>
                   <img class="finish-mission01" src="./images/common/finish-mission1.png"/>
                   <img class="click-magic-wand" src="./images/book/book0607/click-here.png"/>
                   <div class="click-magic-wand-box"></div>
                   <img class="bubble-bg" src="./images/book/book13/bubble-bg.png"/>
                   <img class="star13" src="./images/book/book13/star.png"/>
                   <img class="bubble12" src="./images/book/book13/milk-bubble.png"/>
                   <img class="board board13" src="./images/book/book13/board13.png"/>
                    <img class="check check01" src="./images/common/check.png" />
                   <div class="check-box"></div>
                   `);

        if (
          window.matchMedia("(max-height: 460px)").matches ||
          isTablet ||
          isIPad()
        ) {
          $("body").append(`
          <div class="popup-board popup-board01"></div>
          <div class="popup-board-bg popup-board-bg01">
        `);
        } else {
          $(".book-section").append(`
          <div class="popup-board popup-board01">
          </div>
        `);
        }
      }

      const fanImages = [
        "./images/book/book12/electfan1.png",
        "./images/book/book12/electfan2.png",
        "./images/book/book12/electfan3.png",
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
              if (electfanInterval) return; // 避免重複開 interval
              electfanInterval = setInterval(() => {
                fanIndex = (fanIndex + 1) % fanImages.length;
                fanImg.src = fanImages[fanIndex];
              }, 100);
            }, 7000),
          );

          page1213Timeouts.push(
            setTimeout(() => $(".bubble-bg").addClass("opacity-show"), 6000),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              $(".star13").addClass("star3-animation");
              $(".bubble12").addClass("opacity-show");
            }, 7000),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              $(".coin-hint01").addClass("opacity-show");
            }, 16500),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              $(".coin01").addClass("coin-animation");
              $(".coin-light").addClass("coin-light-show");
              $(".check01").addClass("opacity-show");
            }, 24500),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              btnUnDisabled();
              canFlipNext = true;
              $("#right-down-corner").css("color", "#000");
              $("#right-down-corner").prop("disabled", false);
            }, 25500),
          );

          page1213Timeouts.push(
            setTimeout(() => {
              $(".check-box").show();
              if (
                window.matchMedia("(max-height: 460px)").matches ||
                isTablet ||
                isIPad()
              ) {
                $(".popup-board-bg01").css("display", "block");
              }
              $(".popup-board01").css("display", "block");
              stopVoice();
              playVoice("./mp3/07b.mp3");
            }, 27000),
          );

          startReplayTimer(28000);
          stopVoice();
          playVoice("./mp3/07.mp3");
        },
      );
      popupBoard(page);
    }

    if (page === 11 || page === 14) {
      reset1213();
      if (electfanInterval) {
        clearInterval(electfanInterval);
        electfanInterval = null;
      }
    }

    function reset1415() {
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
      $("#flipbook .shine14").remove();
      $("#flipbook .check02").remove();
      $(".board14").remove();
      $(".popup-board02").remove();
      $(".popup-board-bg02").remove();
      $(".coin-hint02").remove();
      $(".success-hint02").removeClass("opacity-show");
      $(".cows-tongue").removeClass("cows-tongue-animation");
      $(".milk").removeClass("milk-empty");
      $(".bubble14").removeClass("opacity-show");
      $(".shine14").removeClass("shine14-animation");
      $(".coin02").removeClass("coin-animation");
      $(".coin-light02").removeClass("coin-light-show");
      $(".check02").removeClass("opacity-show");
      $(".coin-hint02").removeClass("opacity-show");
      $(".check-box").hide();
    }

    // 第 14–15 頁：餵牛奶
    if (page === 14 || page === 15) {
      if (replay) {
        reset1415();
      }

      replayBtnTrunGray();

      isCanNotFlip();

      addPageTimeout(() => {
        canFlipPrev = true;
      }, 3000);

      // 避免多次 click＝動作卡、音效重複
      if (!milkClickBound) {
        milkClickBound = true;
        btnPreviousDisabled();
        btnDisabled();

        $("#flipbook")
          .append(`<img class="small-cow" src="./images/book/book1415/cow.png"/>
          <img class="finish-mission02" src="./images/common/finish-mission2.png"/>
          <img class="board-list02" src="./images/book/book1415/board-list02.png">
          <img class="board14" src="./images/common/board.png"/>
          <img class="check check02" src="./images/common/check.png"/>
          <div class="check-box"></div>
          <img class="click-milk" src="./images/book/book0607/click-here.png"/>
          <div class="click-milk-box"></div>
          <img class="bubble14" src="./images/book/book1415/milk-bubble.png"/>     
          <img class="shine14" src="./images/book/book1415/shine.png"/>       
          <img class="coin-hint02" src="./images/book/book1415/text15.png" />
          <img class="text14" src="./images/book/book1415/text14.png"/>
           `);

        if (
          window.matchMedia("(max-height: 460px)").matches ||
          isTablet ||
          isIPad()
        ) {
          $("body").append(`
          <div class="popup-board popup-board02"></div>
          <div class="popup-board-bg popup-board-bg02">
        `);
        } else {
          $(".book-section").append(`
          <div class="popup-board popup-board02">
          </div>
        `);
        }

        page1415Timeouts.push(
          setTimeout(() => {
            $("#flipbook").append(
              `<img class="cloud14-2" src="./images/book/book1415/cloud2.png"/>      
             `,
            );
            $(".text14").css("opacity", "1");
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
            $(".small-cow ").css("opacity", "1");
          }, 1000),
        );

        page1415Timeouts.push(
          setTimeout(() => {
            $(".board-list02").addClass("opacity-show");
          }, 1000),
        );

        page1415Timeouts.push(
          setTimeout(() => {
            $(".bubble14").addClass("opacity-show");
          }, 1000),
        );

        page1415Timeouts.push(
          setTimeout(() => {
            $(".finish-mission02").css("opacity", "0");
            $(".click-milk").show();
            $(".click-milk-box").show();
          }, 15500),
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
              }, 2000),
            );

            page1415Timeouts.push(
              setTimeout(() => {
                $(".shine14").addClass("shine14-animation");
                $(".success-hint02").addClass("opacity-show");
                $(".cows-tongue").removeClass("cows-tongue-animation");
              }, 6000),
            );
            stopVoice();
            playVoice("./mp3/sucking-coin.mp3");

            page1415Timeouts.push(
              setTimeout(() => {
                $(".coin-hint02").addClass("opacity-show");
              }, 6000),
            );

            page1415Timeouts.push(
              setTimeout(() => {
                $(".check02").addClass("opacity-show");
                $(".coin02").addClass("coin-animation");
                $(".coin-light02").addClass("coin-light-show");
              }, 13000),
            );

            page1415Timeouts.push(
              setTimeout(() => {
                $(".check-box").show();
                if (
                  window.matchMedia("(max-height: 460px)").matches ||
                  isTablet ||
                  isIPad()
                ) {
                  $(".popup-board-bg02").css("display", "block");
                }
                $(".popup-board02").css("display", "block");
                stopVoice();
                playVoice("./mp3/08b.mp3");
                btnUnDisabled();
                canFlipNext = true;
                $("#right-down-corner").css("color", "#000");
                $("#right-down-corner").prop("disabled", false);
              }, 14500),
            );

            startReplayTimer(16000);
          },
        );
      }
      popupBoard(page);
    }

    if (page === 13 || page === 16) {
      reset1415();
    }

    // 全域：避免重複 append coin 與 crown
    let stethoscopeBound = false;

    function reset1617() {
      page1617Timeouts.forEach((id) => clearTimeout(id));
      page1617Timeouts = [];
      $(".book16").css("opacity", "0");
      $(".book17").css("opacity", "0");
      $(".finish-mission03").css("opacity", "0");
      $(".cloud-16-1").css("opacity", "0");
      $(".cloud-16-2").css("opacity", "0");
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
      $(".shine16").removeClass("shine16-animation");
      $(".cow-heart").removeClass("heart-beat-animation");
      $(".coin03").removeClass("coin-animation");
      $(".coin-light03").removeClass("coin-light-show");
      $(".check03").removeClass("opacity-show");
      $(".coin-hint03").removeClass("opacity-show");
      $(".dondon").removeClass("opacity-show");
      $("#flipbook .shine16").remove();
      $("#flipbook .cloud-16-2").remove();
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
      $(".popup-board-bg03").remove();
      $("#flipbook .bubble16").remove();
      $("#flipbook .dondon").remove();
      $(".check-box").hide();
    }

    // 第 16–17 頁：聽牛心跳
    if (page === 16 || page === 17) {
      if (replay) {
        reset1617();
      }

      replayBtnTrunGray();

      isCanNotFlip();

      addPageTimeout(() => {
        canFlipPrev = true;
      }, 3000);

      // 只綁一次 click，不會因翻頁重複綁定
      if (!stethoscopeBound) {
        stethoscopeBound = true;
        btnPreviousDisabled();
        btnDisabled();
        $("#flipbook").append(`
            <img class="finish-mission03" src="./images/common/finish-mission03.png"/>
            <img class="story-text16" src="./images/book/book1617/text16.png"/>
            <img class="mom-cow" src="./images/book/book1617/mom-cow.png"/>
            <img class="stethoscope disabled" src="./images/book/book1617/hand.png"/>
            <img class="cow-eyes" src="./images/book/book1617/cow-eyes-open.png"/>
            <img class="cow-heart" src="./images/book/book1617/cow-heart.png"/>
            <img class="dondon" src="./images/book/book1617/dondon.png">
            <img class="nurse-girl" src="./images/book/book1617/lin-nurse.png"/>
            <img class="click-hearing-heart" src="./images/book/book25/click-here.png"/>
            <div class="click-hearing-heart-box"></div>      
            <div class="cloud-16-2"></div>
            <div class="check-box"></div>
            <img class="board-list03" src="./images/book/book1617/board-list03.png"/>
            <img class="check check03" src="./images/common/check.png" />
            <img class="board16" src="./images/common/board.png">
            <img class="bubble16" src="./images/book/book1617/milk-bubble.png"/>
            <img class="shine16" src="./images/book/book1617/shine.png"/>
            `);

        if (
          window.matchMedia("(max-height: 460px)").matches ||
          isTablet ||
          isIPad()
        ) {
          $("body").append(`
          <div class="popup-board popup-board03"></div>
          <div class="popup-board-bg popup-board-bg03">
        `);
        } else {
          $(".book-section").append(`
          <div class="popup-board popup-board03">
          </div>
        `);
        }

        page1617Timeouts.push(
          setTimeout(() => {
            $(".story-text16").css("opacity", "1");
          }, 500),
        );

        page1617Timeouts.push(
          setTimeout(() => {
            $(".book16").css("opacity", "1");
            $(".book17").css("opacity", "1");
            $(".finish-mission03").css("opacity", "1");
            $(".cloud-16-1").css("opacity", "1");
            $(".cloud-16-2").css("opacity", "1");
            $(".cloud-16-3").css("opacity", "1");
            $(".cloud14-3").css("opacity", "1");
            $(".moutain-left").css("opacity", "1");
            $(".moutain-right").css("opacity", "1");
            $(".mom-cow").css("opacity", "1");
            $(".cow-eyes").css("opacity", "1");
            $(".cow-heart").css("opacity", "1");
            $(".stethoscope").css("opacity", "1");
            $(".board16").css("opacity", "1");
            $(".nurse-girl").css("opacity", "1");
          }, 1000),
        );

        page1617Timeouts.push(
          setTimeout(() => {
            $(".bubble16").addClass("opacity-show");
            $(".board-list03").addClass("opacity-show");
          }, 1000),
        );

        page1617Timeouts.push(
          setTimeout(() => {
            $(".finish-mission03").css("opacity", "0");
            $(".click-hearing-heart").show();
            $(".click-hearing-heart-box").show();
          }, 13500),
        );

        $(
          "#flipbook .click-hearing-heart ,#flipbook .click-hearing-heart-box ",
        ).on("click", function () {
          const cowEyesImages = [
            "./images/book/book1617/cow-eyes-open.png",
            "./images/book/book1617/cow-eyes-close.png",
          ];

          let cowEyesIndex = 0;
          const cowEyesImg = document.querySelector(".cow-eyes");

          page1617Timeouts.push(
            setInterval(() => {
              cowEyesIndex = (cowEyesIndex + 1) % cowEyesImages.length;
              cowEyesImg.src = cowEyesImages[cowEyesIndex];
            }, 500),
          );

          $(".dondon").addClass("opacity-show");
          $(".stethoscope").addClass("stethoscope-move");

          page1617Timeouts.push(
            setTimeout(() => {
              $(".cow-heart").addClass("heart-beat-animation");
            }, 1000),
          );
          $(".click-hearing-heart").hide();
          $(".click-hearing-heart-box").hide();
          $(".finish-mission03").hide();
          stopVoice();
          playVoice("./mp3/hear-coin.mp3");

          page1617Timeouts.push(
            setTimeout(() => {
              $(".shine16").addClass("shine16-animation");
            }, 4000),
          );

          page1617Timeouts.push(
            setTimeout(() => {
              $(".coin-hint03").addClass("opacity-show");
            }, 6000),
          );

          page1617Timeouts.push(
            setTimeout(() => {
              $(".check03").addClass("opacity-show");
              $(".coin03").addClass("coin-animation");
              $(".coin-light03").addClass("coin-light-show");
            }, 14000),
          );

          page1617Timeouts.push(
            setTimeout(() => {
              $(".check-box").show();
              if (
                window.matchMedia("(max-height: 460px)").matches ||
                isTablet ||
                isIPad()
              ) {
                $(".popup-board-bg03").css("display", "block");
              }
              $(".popup-board03").css("display", "block");
              stopVoice();
              playVoice("./mp3/09b.mp3");
              btnUnDisabled();
              canFlipNext = true;
              $("#right-down-corner").css("color", "#000");
              $("#right-down-corner").prop("disabled", false);
            }, 16000),
          );

          startReplayTimer(16000);
        });
      }

      popupBoard(page);
    }

    if (page === 15 || page === 18) {
      reset1617();
    }

    function reset1819() {
      page1819Timeouts.forEach((id) => clearTimeout(id));
      page1819Timeouts = [];
      $(".book18").css("opacity", "0");
      $(".book19").css("opacity", "0");
      $(".girl1819").css("opacity", "0");
      $(".coin01-final, .coin02-final, .coin03-final").removeClass(
        "coin-all-animation",
      );
      $(".book19-text").removeClass("opacity-show");
      $(".crown").removeClass("crown-animation");
      $(".crown-shine").removeClass("opacity-show");
      $(".coin-all-shine").removeClass("opacity-show");
      $(".bubble18").removeClass("opacity-show");
      $("#flipbook .bubble18").remove();
      $("#flipbook .crown").remove();
      $("#flipbook .crown-shine").remove();
      $("#flipbook .coin-all").remove();
      $("#flipbook .coin-all-shine").remove();
      $("#flipbook .girl1819").remove();
      $("#flipbook .book19-text").remove();
    }

    // 第 20–21 頁：獲得皇冠 + 投硬幣動畫
    if (page === 18 || page === 19) {
      if (replay) {
        reset1819();
      }

      $("#flipbook").append(`
      <img class="book19-text" src="./images/book/book1819/book19-text.png" />
      <img class="coin-all  coin01-final" src="./images/book/book1819/coin01.png" />
      <img class="coin-all coin02-final" src="./images/book/book1819/coin02.png" />
      <img class="coin-all coin03-final" src="./images/book/book1819/coin03.png" />
      <img class="coin-all-shine" src="./images/book/book1819/shine.png" />
      <img class="girl1819" src="./images/book/book1819/linlin.png" />
      <img class="crown" src="./images/book/book1819/crown.png" />
      <img class="crown-shine" src="./images/book/book1819/crown-shine.png" />
      <img class="bubble18" src="./images/book/book1819/milk-bubble.png" />
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
        }, 2000),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".coin-all-shine").addClass("opacity-show");
        }, 2500),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".bubble18").addClass("opacity-show");
        }, 3500),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".crown").addClass("crown-animation");
        }, 11500),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".crown-shine").addClass("opacity-show");
        }, 12500),
      );

      page1819Timeouts.push(
        setTimeout(() => {
          $(".book19-text").addClass("opacity-show");
        }, 18500),
      );

      startReplayTimer(24000);
    }

    if (page === 17 || page === 20) {
      reset1819();
    }

    function reset2021() {
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
      $(".book21-text").removeClass("opacity-show");
      $(".dream01").removeClass("opacity-show");
      $(".dream02").removeClass("opacity-show");
      $(".dream03").removeClass("opacity-show");
      $(".dream04").removeClass("opacity-show");
      $(".dialog20").removeClass("dialog20-animation");
      $(".dialog21").removeClass("dialog20-animation");
      $(".star20").removeClass("dialog20-animation");
      $(".bubble20").removeClass("opacity-show");
      $(".dream-girl").removeClass("dream-girl-animation");
    }

    // 第 20–21 頁：小女孩夢境 + 浮出夢境
    if (page === 20 || page === 21) {
      if (replay) {
        reset2021();
      }

      $("#flipbook").append(
        `<img class="dream04" src="./images/book/book2021/dream04.png"/>
        <img class="dream-light" src="./images/book/book2021/dream-light.png"/>
        <img class="story20" src="./images/book/book2021/text20.png"/>
        <img class="book21-text" src="./images/book/book2021/book21-text.png"/>
        <img class="dream-girl" src="./images/book/book2021/linlin.png"/>
        <img class="dialog20" src="./images/book/book2021/wow.png"/>
        <img class="dialog21" src="./images/book/book2021/um.png"/>
        <img class="bubble20" src="./images/book/book2021/milk-bubble.png"/>
        <img class="star20" src="./images/book/book2021/shine.png"/>
        `,
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".book20").css("opacity", "1");
          $(".book21").css("opacity", "1");
          $(".dream01").addClass("opacity-show");
          $(".dream02").addClass("opacity-show");
          $(".dream03").addClass("opacity-show");
          $(".dream04").addClass("opacity-show");
          $(".story20").addClass("opacity-show");
          $(".dream-girl").addClass("dream-girl-animation");
        }, 500),
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dialog20").addClass("opacity-show");
        }, 3500),
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".bubble20").addClass("opacity-show");
          $(".dream-light").addClass("sweet-taste-animation");
          $(".star20").addClass("dialog20-animation");
        }, 5500),
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".dialog21").addClass("opacity-show");
        }, 7500),
      );

      page2021Timeouts.push(
        setTimeout(() => {
          $(".book21-text").addClass("opacity-show");
        }, 9500),
      );

      startReplayTimer(13000);
    }

    if (page === 19 || page === 22) {
      reset2021();
    }

    function reset2223() {
      page2223Timeouts.forEach((id) => clearTimeout(id));
      page2223Timeouts = [];
      $(".book22").css("opacity", "0");
      $(".book23").css("opacity", "0");
      $(".cow-alarm ").css("opacity", "0");
      $(".sleep-girl-hand ").css("opacity", "0");
      $(".sleep-girl-arm").css("opacity", "0");
      $(".book23-text").removeClass("opacity-show");
    }

    if (page === 22 || page === 23) {
      if (replay) {
        reset2223();
      }

      page2223Timeouts.push(
        setTimeout(() => {
          $(".book22").css("opacity", "1");
          $(".book23").css("opacity", "1");
          $(".cow-alarm ").css("opacity", "1");
          $(".sleep-girl-hand").css("opacity", "1");
          $(".sleep-girl-arm").css("opacity", "1");
        }, 800),
      );

      page2223Timeouts.push(
        setTimeout(() => {
          $(".book23-text").addClass("opacity-show");
        }, 4500),
      );

      startReplayTimer(12000);
    } else {
      reset2223();
    }

    // 第 24–25 頁：點擊小女孩喝牛奶
    if (page === 24 || page === 25) {
      if (replay) {
        resetMilkPage();
      }

      replayBtnTrunGray();

      isCanNotFlip();

      addPageTimeout(() => {
        canFlipPrev = true;
      }, 3000);

      btnPreviousDisabled();
      btnDisabled();

      resetMilkPage(); // 每次重進頁面重置一次

      startMilkAnimation();
    } else {
      resetMilkPage();
    }

    if (page === 26 || page === 27) {
      if (replay) {
        resetFamilyPage();
        $(".father-hand-region").hide();
        console.log(".father-hand-region hide()!!!!");
        $(".mom-hand-region").hide();
        $(".mow").hide();
        $(".daughter-hand-region").removeClass("daughter-hand-finish");
        $(".father-hand-milk").css("opacity", "1");
        $(".daughter-hand-milk").css("opacity", "1");
        $(".mom-hand-milk").css("opacity", "1");
        $(".daughter-hand-milk").removeClass("daughter-hand-milk-empty");
        $(".sweet-taste").removeClass("opacity-show");
        startFamilyAnimation();
        setTimeout(() => {
          $(".mom-hand-region").show();
        }, 1500);
      }
    }
  }

  // 監聽 mouseup，更新目前頁碼狀態
  let currentPage = 1;

  $("#flipbook").on("turning", function (e, page) {
    stopVoice();
    currentPage = page;
    replayGeneration++; // ⭐ 直接殺死所有舊timer
    clearPageTimers(); // ⭐ 清動畫timer
  });

  // 當頁面翻轉完成後觸發
  $("#flipbook").bind("turning", function (event, page, view) {
    console.log("page:", page);
    let canFlipPrev = false; // 初始禁止往前翻頁
    let canFlipNext = false; // 初始禁止往後翻頁

    function isCanNotFlipPrev() {
      if (!window.matchMedia("(max-height: 460px)").matches) {
        $("#left-up-corner")
          .off("click") // 移除舊的
          .on("click", function () {
            if (!canFlipPrev) {
              return;
            }
            stopVoice();
            $("#flipbook").turn("previous");
          });
      }

      $("#left-down-corner")
        .off("click") // 移除舊的
        .on("click", function () {
          if (!canFlipPrev) {
            return;
          }
          stopVoice();
          $("#flipbook").turn("previous");
        });
    }

    function isCanNotFlipNext() {
      if (!window.matchMedia("(max-height: 460px)").matches) {
        $("#right-up-corner")
          .off("click")
          .on("click", function () {
            if (!canFlipNext) {
              return;
            }
            stopVoice();
            $("#flipbook").turn("next");
          });
      }

      $("#right-down-corner")
        .off("click")
        .on("click", function () {
          if (!canFlipNext) {
            return;
          }
          stopVoice();
          $("#flipbook").turn("next");
        });
    }

    function isCanNotFlip() {
      isCanNotFlipPrev();
      isCanNotFlipNext();
    }

    currentPage = page;

    handlePage(currentPage);

    // 小女孩喝奶動畫流程（只綁一次，不堆疊）
    $(".click-girl")
      .off("click")
      .on("click", function () {
        $(".book25-story").addClass("opacity-show");
        $(".flower").css("opacity", "1");

        $(".click-girl").hide();
        $(".girl-l-hand-region").addClass("girl-l-hand-finish");
        $(".girl-r-hand").addClass("girl-r-hand-finish");
        stopVoice();
        playVoice("./mp3/girl-drink.mp3");

        page2425Timeouts.push(
          setTimeout(() => {
            $(".girl-l-hand-milk").css("opacity", "0");
          }, 2000),
        );

        page2425Timeouts.push(
          setTimeout(() => {
            $(".milk-stains").addClass("opacity-show");
          }, 2200),
        );

        page2425Timeouts.push(
          setTimeout(() => {
            $(".book25-text").addClass("opacity-show");
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
            isCanNotFlipNext();
            $("#right-down-corner").css("color", "#000");
            $("#right-down-corner").prop("disabled", false);
          }, 12000),
        );
        startReplayTimer(12000);
      });

    if (page === 26 || page === 27) {
      page2627Timeouts.push(
        setTimeout(() => {
          $("#right-down-corner").show();
        }, 500),
      );

      if (!$(".mom-hand").length) {
        page2627Timeouts.push(
          setTimeout(() => {
            $("#flipbook").append(
              ' <div class="mom-hand-region"><div class="mom-hand-milk-region"><img class="mom-hand-milk" src="./images/book/book2627/milk.png"/><img class="mom-hand-cup" src="./images/book/book2627/cup.png"/></div><img class="mom-hand" src="./images/book/book2627/mom-hand.png"/></div>',
            );
          }, 1500),
        );
      }

      page2627Timeouts.push(
        setTimeout(() => {
          $(".mom-hand").css("opacity", "1");
          $(".mom-hand-milk").css("opacity", "1");
          $(".mom-hand-cup").css("opacity", "1");
        }, 2000),
      );
    }

    // 翻到該頁才開始動作
    $("#flipbook").bind("turned", function (event, page) {
      latestPage = page;
      currentPage = page;

      currentMobilePage = page;
      playAudioByPage(page);
      applyPageRule(page);

      // 書本定位
      if (!isTablet && !window.matchMedia("(max-height: 460px)").matches) {
        if (page === 1) {
          $(".book-section").css({
            left: "-300px",
          });
        } else if (page === 28) {
          $(".book-section").css({
            left: "300px",
          });
        } else {
          $(".book-section").css({
            left: "0px",
          });
        }
      } else if (isTablet || isIPad()) {
        if (page === 28) {
          requestAnimationFrame(() => {
            const w = getBookWidth();
            if (innerWidth > 1280) {
              $(".book-section").css({
                left: w * 0.32333 + "px", //388
              });
            } else if (innerWidth > 1000 && innerWidth <= 1280) {
              $(".book-section").css({
                left: w * 0.3528 + "px", //260
              });
            } else if (innerWidth > 1000) {
              $(".book-section").css({
                left: w * 0.28083 + "px", //337
              });
            } else {
              $(".book-section").css({
                left: w * 0.3528 + "px", //260
              });
            }
          });
        } else {
          $(".book-section").css({
            left: "0px",
          });
        }
      } else {
        if (page === 28) {
          requestAnimationFrame(() => {
            const w = getBookWidth();
            $(".book-section").css({
              left: w * 0.33 + "px", //260
            });
          });
        } else {
          $(".book-section").css({
            left: "0px",
          });
        }
      }

      if (
        page > 1 &&
        page !== 28 &&
        !window.matchMedia("(max-height: 460px)").matches
      ) {
        $("#right-up-corner, #right-down-corner")
          .prop("disabled", false)
          .show();
      }

      // 第 26–27 頁：家人一起喝牛奶
      if (page === 26 || page === 27) {
        startFamilyAnimation();
      } else {
        resetFamilyPage();

        $(".father-hand-region").removeClass("father-hand-finish");
        $(".daughter-hand-region").removeClass("daughter-hand-finish");
        $(".father-hand-milk").css("opacity", "1");
        $(".daughter-hand-milk").css("opacity", "1");
        $(".mom-hand-milk").css("opacity", "1");
        $(".daughter-hand-milk").removeClass("daughter-hand-milk-empty");
        $(".sweet-taste").removeClass("opacity-show");
      }

      if (isTablet || isIPad()) {
        if (page === 1) {
          const flipbookWidth = document
            .querySelector(".book-title")
            .getBoundingClientRect().width;

          $(".book-section").css({
            left: -1 * flipbookWidth + "px",
          });
        } else {
          $(".book-section").css({
            left: "0px",
          });
        }
      }
    });

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

    if (page === 25 || page === 28) {
      page2627Timeouts.forEach((id) => clearTimeout(id));
      page2627Timeouts = [];
      $(".book2627").css("opacity", "0");
      $(".book2627").remove();
      $(".all-milk-stains").remove();
      $(".mom-hand-region").remove();
      $(".mom-hand").removeClass("mom-hand-finish");
    }

    if (page === 28) {
      clearPageTimers();

      // 只有「正常翻頁」才清動畫
      if (!isReplaying) {
        clearPageTimers();
      }

      replayBtnTrunGray();

      // 一律記錄 timer
      pageTimers.push(
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
        }, 800),
      );

      $("#right-down-corner").hide();
      $(".next-page img").hide();

      isCanNotFlip();

      addPageTimeout(() => {
        canFlipPrev = true;
      }, 3000);

      let count = 3;

      $(".next-page img").attr("src", "./images/common/next-grey-img.png");
      $(".next-page").prop("disabled", true);

      $(".prev-page img").attr("src", "./images/common/prev-grey-img.png");
      $(".prev-page img").attr("src", "./images/common/3sec.png");
      $(".prev-page").prop("disabled", true);

      const interval = setInterval(() => {
        count--;

        if (count > 0) {
          $(".prev-page img").attr("src", `./images/common/${count}sec.png`);
          $(".prev-page").prop("disabled", true);
        } else {
          clearInterval(interval);
          $(".prev-page img").attr("src", "./images/common/prve-img.png");
          $(".prev-page").prop("disabled", false);
        }
      }, 1000);

      pageTimers.push(interval); //正確

      pageTimers.push(
        setTimeout(() => {
          $(".prev-page img").attr("src", "./images/common/prve-img.png");
          $(".prev-page").prop("disabled", false);
        }, 3000),
      );

      startReplayTimer(19000);
    }

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
      addPageTimeout(() => {
        canFlipPrev = true;
        canFlipNext = true;
      }, 3000);
    }

    $("#flipbook").on("mousedown touchstart", function (e) {
      if ($("body").hasClass("popup-open")) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
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

    // 第一頁：不能往回
    if (page === 1) {
      $("#left-down-corner").hide();
      canSwipePrev = false;

      if (window.matchMedia("(max-height: 460px)").matches) {
        requestAnimationFrame(() => {
          const w = getBookWidth();
          $(".book-section").css({
            left: -w * 0.53125 + "px", //326.4
          });
        });
      }
    } else {
      if (window.matchMedia("(max-height: 460px)").matches) {
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
  }

  /* ======================
   turned 事件
====================== */
  // $("#flipbook").on("turned", function (e, page) {
  //   currentMobilePage = page;
  //   playAudioByPage(page);
  //   applyPageRule(page);
  // });

  // 動態播放語音（不影響 background）
  async function playVoice(src) {
    const token = ++voiceToken;

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

      // 如果播放請求已經被新的取代
      if (token !== voiceToken) return;

      // 建立新的播放來源
      const voiceSource = audioContext.createBufferSource();
      voiceSource.buffer = audioBuffer;

      // 接到語音音量控制節點
      voiceSource.connect(voiceGainNode);
      voiceGainNode.connect(audioContext.destination);

      // 播放
      voiceSource.start(0);

      currentVoiceSource = voiceSource;

      console.log("語音播放成功");
    } catch (err) {
      console.log("語音播放失敗:", err);
    }
  }

  function stopVoice() {
    if (currentVoiceSource) {
      try {
        currentVoiceSource.stop(0);
        currentVoiceSource.disconnect();
      } catch (e) {}

      currentVoiceSource = null;
    }
  }

  function playAudioByPage(page) {
    if (page === lastAudioPage) return;
    lastAudioPage = page;
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
      stopVoice();
      $("#flipbook").turn("previous");
    }

    // 👉 向左滑：next
    if (swipeDistance < 0) {
      if (!canSwipeNext) return;
      lockFlip();
      stopVoice();
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
