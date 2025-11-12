$(function () {
  const cow = document.querySelector(".cow");
  const $flipbook = $("#flipbook");

  const bookHeight = window.innerHeight;
  const bookWidth = bookHeight * (1200 / 600); // 保持原始比例 1200:600
  const width = screen.width;
  const height = screen.height;

  console.log("瀏覽器視窗寬度:", width);
  console.log("瀏覽器視窗高度:", height);
  console.log("新的寬高:", bookWidth, bookHeight);
  $(window).on("resize", function () {
    const newHeight = window.innerHeight;
    const newWidth = window.innerWidth;
    console.log("新的寬高:", newWidth, newHeight);
    $("#flipbook").turn("size", newWidth, newHeight);
  });

  if (!window.matchMedia("(max-height: 500px)").matches) {
    $flipbook.turn({
      width: 1200,
      height: 600,
      autoCenter: true,
    });
  } else {
    // 初始化 turn.js
    $flipbook.turn({
      width: 1004,
      height: 464,
      autoCenter: true,
    });
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
    $(".next-page")
      .on("mouseenter", function () {
        $(".next-page-hint").addClass("next-page-hint-show");
      })
      .on("mouseleave", function () {
        $(".next-page-hint").removeClass("next-page-hint-show");
      });
  }

  function btnUnDisabled() {
    isBtnDisabled = false;
    $(".next-page").removeClass("disabled-btn");
    $(".next-page").prop("disabled", false);
    $(".next-page").on("mouseenter", function () {
      $(".next-page-hint").removeClass("next-page-hint-show");
    });
  }

  function btnPreviousDisabled() {
    let count = 3;
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

    $(".prev-page").prop("disabled", true);
    $(".prev-page").addClass("disabled-btn");
    setTimeout(() => {
      $(".prev-page").removeClass("disabled-btn");
      $(".prev-page").prop("disabled", false);
    }, 3000);
  }

  function allBtnDisabled() {
    let count = 3;
    const prevBtn = $(".prev-page")[0];
    const nextBtn = $(".next-page")[0];

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
    $(".prev-page, .next-page").prop("disabled", true);
    $(".prev-page, .next-page").addClass("disabled-btn");
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

  $(".mute-toggle").on("click", function () {
    isMuted = !isMuted;

    // 控制所有 audio 是否靜音
    $("audio").prop("muted", isMuted);

    // 切換 icon + 文字
    if (isMuted) {
      $(this).css("color", "#fff");
      $(this).css("background", "#ccc");
      $(this).html('<i class="fas fa-volume-up"></i> 開啟');
    } else {
      $(this).css("color", "brown");
      $(this).css("background", "#fff");
      $(this).html('<i class="fas fa-volume-mute"></i> 關閉');
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

  // 當頁面翻轉完成後觸發
  $("#flipbook").bind("turning", function (event, page, view) {
    console.log("page:", page);

    if (page === 1) {
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
      setTimeout(() => {
        $("#flipbook").append('<div class="book-title"></div>');
        $("#flipbook").append('<div class="cloud cloud01"></div>');
      }, 200);
    } else {
      $("#flipbook .book-title").remove();
      $("#flipbook .cloud01").remove();
    }

    if (page === 1 || page === 4) {
      $("#flipbook .cloud01").remove();
    }

    if (page === 6 || page === 7) {
      $(".cup").addClass("cup-animation");
      $(".left-hand").addClass("left-hand-animation");
      $(".right-hand").addClass("right-hand-animation");
      $(".dialog5").addClass("dialog5-animation");
    } else {
      $(".cup").removeClass("cup-animation");
      $(".left-hand").removeClass("left-hand-animation");
      $(".right-hand").removeClass("right-hand-animation");
      $(".dialog5").removeClass("dialog5-animation");
    }

    if (page === 8 || page === 9) {
      const door = document.querySelector(".door");
      door.addEventListener("click", () => {
        playAudio("knock", 0);
        $(".door").addClass("door-opening");
        $(".peoples").addClass("peoples-open");
        $(".tree1").addClass("tree-fade-in");
        $(".tree2").addClass("tree-fade-in");
        $(".cloud1").addClass("cloud-fade-in");
        $(".cloud2").addClass("cloud-fade-in");
        $(".dialog8").addClass("dialog8-animation");
        playAudio("audio-4-click", 0);
      });
    }

    if (page === 10 || page === 11) {
      $(".foot1").addClass("foot1-animation");
      $(".foot2").addClass("foot2-animation");
      $(".foot3").addClass("foot3-animation");
      $(".foot4").addClass("foot4-animation");
      $(".foot5").addClass("foot5-animation");
      $(".dialog10").addClass("dialog10-animation");
    }

    if (page === 9 || page === 12) {
      $(".foot1").removeClass("foot1-animation");
      $(".foot2").removeClass("foot2-animation");
      $(".foot3").removeClass("foot3-animation");
      $(".foot4").removeClass("foot4-animation");
      $(".foot5").removeClass("foot5-animation");
      $(".dialog10").removeClass("dialog10-animation");
    }

    if (page === 7 || page === 10) {
      $(".door").removeClass("door-opening");
      $(".peoples").removeClass("peoples-open");
      $(".tree1").removeClass("tree-fade-in");
      $(".tree2").removeClass("tree-fade-in");
      $(".cloud1").removeClass("cloud-fade-in");
      $(".cloud2").removeClass("cloud-fade-in");
      $(".dialog8").removeClass("dialog8-animation");
    }

    if (page === 12 || page === 13) {
      $(".list").addClass("list-animation");
      setTimeout(() => {
        $(".cloud-01").addClass("cloud-animation");
        $(".cloud-02").addClass("cloud-animation");
      }, 50);
      $("#flipbook").append('<div class="rainbow"></div>');
      if (window.matchMedia("(max-height: 500px)").matches) {
        $(".rainbow").css("width", bookWidth);
        $(".rainbow").css("height", bookHeight);
      }

      $("#flipbook").append('<div class="cloud-group"></div>');
      $("#flipbook").append('<div class="cow05"></div>');
      $("#flipbook").append('<div class="list-board"></div>');
      $("#flipbook").append('<div class="list"></div>');
    }

    if (page === 11 || page === 14) {
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

    if (page === 14 || page === 15) {
      // 只建立一次，避免 DOM 爆掉
      if (!fanAndBubbleCreated) {
        fanAndBubbleCreated = true;
        $("#flipbook").append(`<div class="electfan"></div>
                           <div class="bubble-bg"></div>`);
      }

      setTimeout(() => $(".electfan").addClass("electfan-move"), 500);
      setTimeout(() => $(".bubble-bg").addClass("bubble-move"), 1200);

      setTimeout(() => $(".coin01").addClass("coin-animation"), 15000);
    } else {
      $(".electfan").removeClass("electfan-move");
      $(".bubble-bg").removeClass("bubble-move");
      $(".coin01").removeClass("coin-animation");
      $("#flipbook .electfan").remove();
      $("#flipbook .bubble-bg").remove();
    }

    if (page === 16 || page === 17) {
      // 避免多次 click＝動作卡、音效重複
      if (!milkClickBound) {
        milkClickBound = true;
        btnPreviousDisabled();
        btnDisabled();

        setTimeout(() => {
          $(".click-milk").show();
          $(".milk-bottle-click").removeClass("disabled");
        }, 13000);

        $("#flipbook .milk-bottle-click").on("click", function () {
          $(".cows-tongue").addClass("cows-tongue-animation");
          $(".milk").addClass("milk-empty");
          $(".click-milk").hide();

          playAudio("sucking-coin", 0);

          setTimeout(() => {
            $(".coin02").addClass("coin-animation");
          }, 10000);
          setTimeout(() => {
            btnUnDisabled();
          }, 12000);
        });
      }
    } else {
      $(".milk-bottle-click").addClass("disabled");
      $(".cows-tongue").removeClass("cows-tongue-animation");
      $(".milk").removeClass("milk-empty");
      $(".coin02").removeClass("coin-animation");
    }

    // 全域：避免重複 append coin 與 crown
    let stethoscopeBound = false;

    // 第 18–19 頁：聽心跳 + 投錢
    if (page === 18 || page === 19) {
      // 只綁一次 click，不會因翻頁重複綁定
      if (!stethoscopeBound) {
        stethoscopeBound = true;
        btnPreviousDisabled();
        btnDisabled();

        setTimeout(() => {
          $("#flipbook .hearing-heart").show();
          $(".stethoscope").removeClass("disabled");
        }, 15000);

        $("#flipbook .stethoscope").on("click", function () {
          $(this).addClass("stethoscope-move");
          $("#flipbook .hearing-heart").hide();

          playAudio("hearts-coin", 1000);

          setTimeout(() => {
            $(".coin03").addClass("coin-animation");
          }, 13000);
          setTimeout(() => {
            btnUnDisabled();
          }, 14000);
        });
      }
    } else {
      $(".stethoscope").addClass("disabled");
      $("#flipbook .stethoscope").removeClass("stethoscope-move");
      $(".coin03").removeClass("coin-animation");
    }

    // 第 20–21 頁：獲得皇冠 + 投硬幣動畫
    if (page === 20 || page === 21) {
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

    // 重置該頁面的所有動畫與音效
    function resetMilkPage() {
      $(".click-girl").hide();
      $(".girl-click-region").addClass("disabled");
      $(".milk-hand").removeClass("milk-hand-animation");
      $(".milk-inner").removeClass("milk-inner-full");
      $(".milk-drop").removeClass("milk-drop-show");
      $(".girl-l-hand, .girl-r-hand").removeClass(
        "girl-l-hand-finish girl-r-hand-finish girl-l-hand-finish-milk"
      );
      $(".milk-stains").removeClass("milk-stains-show");

      for (let i = 1; i <= 6; i++) {
        $(`.flower0${i}`).removeClass(`flower0${i}-finish`);
      }

      $(".girl-click-region").removeClass("played"); // ✅ 允許重複進入頁面動畫

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
    $(".girl-click-region")
      .off("click")
      .on("click", function () {
        if ($(this).hasClass("played")) return;
        $(this).addClass("played");

        $(".click-girl").hide();
        $(".girl-l-hand").addClass("girl-l-hand-finish");
        $(".girl-r-hand").addClass("girl-r-hand-finish");

        playAudio("girl-drink-milk", 0);

        setTimeout(() => {
          $(".girl-l-hand").addClass("girl-l-hand-finish-milk");
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
        }, 7000);
      });

    // 翻到該頁才開始動作
    $("#flipbook").bind("turned", function (event, page) {
      if (page === 26 || page === 27) {
        btnPreviousDisabled();
        btnDisabled();

        resetMilkPage(); // 每次重進頁面重置一次
        $(".girl-click-region").removeClass("played");

        setTimeout(() => {
          $(".girl-click-region").removeClass("disabled");
          $(".click-girl").show();
        }, 9000);

        startMilkAnimation();
      } else {
        resetMilkPage();
      }
    });

    // Reset function
    function resetFamilyPage() {
      $(".father-hand, .daughter-hand").removeClass(
        "father-hand-finish daughter-hand-finish father-hand-empty daughter-hand-empty"
      );
      $(".dad-milk-ink ").removeClass("dad-milk-ink-show ");
      $(".girls-milk-ink ").removeClass("girls-milk-ink-show ");
      $(".cow-right").removeClass("cow-right-move");
      $(".mow").hide();
    }

    // Animation flow — page 28/29
    function startFamilyAnimation() {
      $(".father-hand").addClass("father-hand-finish");
      $(".daughter-hand").addClass("daughter-hand-finish");

      setTimeout(() => {
        $(".daughter-hand").addClass("daughter-hand-empty");
        $(".father-hand").addClass("father-hand-empty");
        $(".mom-hand").addClass("mom-hand-empty");
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

    // Turn.js event
    $("#flipbook").bind("turning", function (event, page) {
      if (page === 28 || page === 29) {
        if (!$(".mom-hand").length) {
          setTimeout(() => {
            $("#flipbook").append('<div class="mom-hand"></div>');
          }, 500);
          setTimeout(() => {
            $(".mom-hand").addClass("mom-hand-finish");
          }, 550);
        }
      } else {
        $(".mom-hand").removeClass("mom-hand-finish mom-hand-empty");
        $(".mom-hand").remove();
      }

      if (page === 30) {
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
      if (page === 28 || page === 29) {
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
    }

    var $bubbles = $(".bubbles");

    function bubbles() {
      // Settings
      var min_bubble_count = 20, // Minimum number of bubbles
        max_bubble_count = 60, // Maximum number of bubbles
        min_bubble_size = 3, // Smallest possible bubble diameter (px)
        max_bubble_size = 12; // Maximum bubble blur amount (px)

      // Calculate a random number of bubbles based on our min/max
      var bubbleCount =
        min_bubble_count + Math.floor(Math.random() * (max_bubble_count + 1));

      // Create the bubbles
      for (var i = 0; i < bubbleCount; i++) {
        $bubbles.append(
          '<div class="bubble-container"><div class="bubble"></div></div>'
        );
      }

      // Now randomise the various bubble elements
      $bubbles.find(".bubble-container").each(function () {
        // Randomise the bubble positions (0 - 100%)
        var pos_rand = Math.floor(Math.random() * 101);

        // Randomise their size
        var size_rand =
          min_bubble_size + Math.floor(Math.random() * (max_bubble_size + 1));

        // Randomise the time they start rising (0-15s)
        var delay_rand = Math.floor(Math.random() * 16);

        // Randomise their speed (3-8s)
        var speed_rand = 3 + Math.floor(Math.random() * 9);

        // Random blur
        var blur_rand = Math.floor(Math.random() * 3);

        // Cache the this selector
        var $this = $(this);

        // Apply the new styles
        $this.css({
          left: pos_rand + "%",

          "-webkit-animation-duration": speed_rand + "s",
          "-moz-animation-duration": speed_rand + "s",
          "-ms-animation-duration": speed_rand + "s",
          "animation-duration": speed_rand + "s",

          "-webkit-animation-delay": delay_rand + "s",
          "-moz-animation-delay": delay_rand + "s",
          "-ms-animation-delay": delay_rand + "s",
          "animation-delay": delay_rand + "s",

          "-webkit-filter": "blur(" + blur_rand + "px)",
          "-moz-filter": "blur(" + blur_rand + "px)",
          "-ms-filter": "blur(" + blur_rand + "px)",
          filter: "blur(" + blur_rand + "px)",
        });

        $this.children(".bubble").css({
          width: size_rand + "px",
          height: size_rand + "px",
        });
      });
    }

    // In case users value their laptop battery life
    // Allow them to turn the bubbles off
    $(".bubble-toggle").click(function () {
      if ($bubbles.is(":empty")) {
        bubbles();
        $bubbles.show();
        $(this).text("Bubbles Off");
      } else {
        $bubbles.fadeOut(function () {
          $(this).empty();
        });
        $(this).text("Bubbles On");
      }

      return false;
    });

    bubbles();

    let playTimeout;
    let latestPage = 1;

    // 頁面對應的音檔 ID 對照表
    const pageAudioMap = {
      2: "audio-1",
      3: "audio-1",
      4: "audio-2",
      5: "audio-2",
      6: "audio-3",
      7: "audio-3",
      10: "audio-5",
      11: "audio-5",
      12: "audio-6",
      13: "audio-6",
      14: "audio-7",
      15: "audio-7",
      16: "audio-8",
      17: "audio-8",
      18: "audio-9",
      19: "audio-9",
      20: "audio-10",
      21: "audio-10",
      22: "audio-11",
      23: "audio-11",
      24: "audio-12",
      25: "audio-12",
      26: "audio-13",
      27: "audio-13",
      28: "audio-14",
      29: "audio-14",
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
          "mom-hand",
        ];

        // 用 forEach 逐一移除
        selectors.forEach((selector) => {
          $("#flipbook " + selector).remove();
        });
      }

      // 假設右下角 50x50 px
      if (x > width - 50 && y > height - 50) {
        console.log("右下角 click");
        clearFlipbookElements();
        const nextPage = currentPage + 1;
        $flipbook.turn("page", nextPage);
        $(".coin").removeClass("coin-animation");
        setTimeout(() => {
          $("#flipbook .click-milk").css("display", "block");
        }, 1000);
      } // 右上角 (top-right)
      else if (x > width - 50 && y < 50) {
        console.log("右上角 click");
        clearFlipbookElements();
        const nextPage = currentPage + 1;
        $flipbook.turn("page", nextPage);
        $(".coin").removeClass("coin-animation");
        setTimeout(() => {
          $("#flipbook .click-milk").css("display", "block");
        }, 1000);
      } // 左下角 (bottom-left)
      else if (x < 50 && y > height - 50) {
        console.log("左下角 click");
        clearFlipbookElements();
        const previousPage = currentPage - 1;
        $flipbook.turn("page", previousPage);
        $(".coin").removeClass("coin-animation");
        setTimeout(() => {
          $("#flipbook .click-milk").css("display", "block");
        }, 1000);
      } // 左上角 (top-left)
      else if (x < 50 && y < 50) {
        console.log("click~~~");
        console.log("左上角 click");
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
