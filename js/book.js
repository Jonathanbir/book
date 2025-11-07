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

  // // 上一頁按鈕
  // $("#prev-page").on("click", function () {
  //   $flipbook.turn("previous");
  // });

  // // 下一頁按鈕
  // $("#next-page").on("click", function () {
  //   $flipbook.turn("next");
  // });

  let isBtnDisabled;
  // 上一頁按鈕
  $("#prev-page").on("click", function () {
    if (isBtnDisabled) return; // 防止連按
    isBtnDisabled = true;
    $("#prev-page, #next-page").prop("disabled", true);
    $("#prev-page, #next-page").css("color", "#aaa");
    $("#prev-page, #next-page").css("background", "#ccc");
    $("#prev-page, #next-page").css("boxShadow", " initial");

    $flipbook.turn("previous");

    setTimeout(() => {
      isBtnDisabled = false;
      $("#prev-page, #next-page").prop("disabled", false);
      $("#prev-page, #next-page").css("color", "brown");
      $("#prev-page, #next-page").css("background", "#fff");
      $("#prev-page, #next-page").css(
        "boxShadow",
        "0 0 10px rgba(0, 0, 0, 0.2)"
      );
    }, 1500);
  });

  // 下一頁按鈕
  $("#next-page").on("click", function () {
    if (isBtnDisabled) return; // 防止連按
    isBtnDisabled = true;
    $("#prev-page, #next-page").prop("disabled", true);
    $("#prev-page, #next-page").css("color", "#aaa");
    $("#prev-page, #next-page").css("background", "#ccc");
    $("#prev-page, #next-page").css("boxShadow", " initial");

    $flipbook.turn("next");

    setTimeout(() => {
      isBtnDisabled = false;
      $("#prev-page, #next-page").css("color", "brown");
      $("#prev-page, #next-page").css("background", "#fff");
      $("#prev-page, #next-page").css(
        "boxShadow",
        "0 0 10px rgba(0, 0, 0, 0.2)"
      );
      $("#prev-page, #next-page").prop("disabled", false);
    }, 1500);
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

  $("#mute-toggle").on("click", function () {
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

  // 當頁面翻轉完成後觸發
  $("#flipbook").bind("turning", function (event, page, view) {
    console.log("page:", page);

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
      const dorSound = document.getElementById("knock");

      const door = document.querySelector(".door");
      door.addEventListener("click", () => {
        dorSound.currentTime = 0;
        dorSound.play().catch(() => {
          console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
        });
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

    if (page === 14 || page === 15) {
      $("#flipbook").append('<div class="electfan"></div>');
      setTimeout(() => {
        $(".electfan").addClass("electfan-move");
      }, 1000);
      $("#flipbook").append('<div class="bubble-bg"></div>');
      setTimeout(() => {
        $(".bubble-bg").addClass("bubble-move");
      }, 2000);
      setTimeout(() => {
        const coinSound = document.getElementById("coin-drops");
        coinSound.currentTime = 0;
        coinSound.play().catch(() => {
          console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
        });
        $(".coin01").addClass("coin-animation");
      }, 5000);
    } else {
      $("#flipbook .book-title").remove();
      $("#flipbook .electfan").remove();
      $("#flipbook .electfan-move").remove();
      $("#flipbook .bubble-bg").remove();
      $(".coin").removeClass("coin-animation");
    }

    if (page === 16 || page === 17) {
      $("#flipbook .milk-bottle-click").on("click", function () {
        $("#flipbook .cows-tongue").addClass("cows-tongue-animation");
        $("#flipbook .milk").addClass("milk-empty");
        $("#flipbook .click-milk").css("display", "none");

        const suckingSound = document.getElementById("sucking");

        suckingSound.currentTime = 0;
        suckingSound.play().catch(() => {
          console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
        });

        setTimeout(() => {
          const coinSound = document.getElementById("coin-drops");
          coinSound.currentTime = 0;
          coinSound.play().catch(() => {
            console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
          });
          $(".coin02").addClass("coin-animation");
        }, 3000);
      });
    } else {
      $("#flipbook .cows-tongue").removeClass("cows-tongue-animation");
      $("#flipbook .milk").removeClass("milk-empty");
      $(".coin02").removeClass("coin-animation");
      setTimeout(() => {
        $("#flipbook .click-milk").css("display", "block");
      }, 1000);
    }

    if (page === 18 || page === 19) {
      $("#flipbook .stethoscope").on("click", function () {
        $("#flipbook .stethoscope").addClass("stethoscope-move");
        $("#flipbook .hearing-heart").css("display", "none");

        const heartsBeatSound = document.getElementById("hearts-beat");

        setTimeout(() => {
          heartsBeatSound.currentTime = 0;
          heartsBeatSound.play().catch(() => {
            console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
          });
        }, 1000);
        setTimeout(() => {
          const coinSound = document.getElementById("coin-drops");
          coinSound.currentTime = 0;
          coinSound.play().catch(() => {
            console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
          });
          $(".coin03").addClass("coin-animation");
        }, 6000);
      });
    } else {
      $("#flipbook .stethoscope").removeClass("stethoscope-move");
      $(".coin03").removeClass("coin-animation");
      setTimeout(() => {
        $("#flipbook .hearing-heart").css("display", "block");
      }, 1000);
    }

    if (page === 20 || page === 21) {
      $("#flipbook").append('<div class="coin coin01 coin01-final"></div>');
      $("#flipbook").append('<div class="coin coin02 coin02-final"></div>');
      $("#flipbook").append('<div class="coin coin03 coin03-final"></div>');
      $("#flipbook").append('<div class="crown"></div>');
      setTimeout(() => {
        $(".coin01").addClass("coin-animation");
        $(".coin02").addClass("coin-animation");
        $(".coin03").addClass("coin-animation");
        const coinSound = document.getElementById("coin-drops");
        coinSound.currentTime = 0;
        coinSound.play().catch(() => {
          console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
        });
      }, 1000);
      setTimeout(() => {
        $(".crown").addClass("crown-animation");
        const crownSound = document.getElementById("crown-drops");
        crownSound.currentTime = 0;
        crownSound.play().catch(() => {
          console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
        });
      }, 2000);
    } else {
      $(".coin01").removeClass("coin-animation");
      $(".coin02").removeClass("coin-animation");
      $(".coin03").removeClass("coin-animation");
      $("#flipbook .crown").remove();
    }

    if (page === 26 || page === 27) {
      setTimeout(() => {
        $(".milk-hand").addClass("milk-hand-animation");
      }, 1000);
      setTimeout(() => {
        $(".milk-drop").addClass("milk-drop-show");
        const milkDropSound = document.getElementById("milk-drop");

        milkDropSound.currentTime = 0;
        milkDropSound.play().catch(() => {
          console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
        });
      }, 2700);
      setTimeout(() => {
        $(".milk-inner").addClass("milk-inner-full");
      }, 3000);
      setTimeout(() => {
        $(".milk-drop").removeClass("milk-drop-show");
      }, 6000);

      //點擊小女孩喝牛奶動畫
      $("#flipbook .girl-click-region").on("click", function () {
        $("#flipbook .click-girl").css("display", "none");
        $("#flipbook .girl-l-hand").addClass("girl-l-hand-finish");
        $("#flipbook .girl-r-hand").addClass("girl-r-hand-finish");

        setTimeout(() => {
          $(".girl-l-hand").addClass("girl-l-hand-finish-milk");
        }, 1000);
        const drinkingMilkSound = document.getElementById("drinking-milk");

        setTimeout(() => {
          drinkingMilkSound.currentTime = 0;
          drinkingMilkSound.play().catch(() => {
            console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
          });
        }, 1000);

        setTimeout(() => {
          const flowerShow = document.getElementById("flower-show");
          flowerShow.currentTime = 0;
          flowerShow.play().catch(() => {
            console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
          });
          $("#flipbook .flower01").addClass("flower01-finish");
          $("#flipbook .flower02").addClass("flower02-finish");
          $("#flipbook .flower03").addClass("flower03-finish");
          $("#flipbook .flower04").addClass("flower04-finish");
          $("#flipbook .flower05").addClass("flower05-finish");
          $("#flipbook .flower06").addClass("flower06-finish");
        }, 2500);
      });
    } else {
      $("#flipbook .click-girl").css("display", "block");
      $("#flipbook .girl-l-hand").removeClass("girl-l-hand-finish");
      $("#flipbook .girl-r-hand").removeClass("girl-r-hand-finish");
      $(".girl-l-hand").removeClass("girl-l-hand-finish-milk");
      $("#flipbook .flower01").removeClass("flower01-finish");
      $("#flipbook .flower02").removeClass("flower02-finish");
      $("#flipbook .flower03").removeClass("flower03-finish");
      $("#flipbook .flower04").removeClass("flower04-finish");
      $("#flipbook .flower05").removeClass("flower05-finish");
      $("#flipbook .flower06").removeClass("flower06-finish");
    }

    if (page === 28 || page === 29) {
      setTimeout(() => {
        $("#flipbook").append('<div class="mom-hand"></div>');
        $(".father-hand").addClass("father-hand-finish");
        $(".daughter-hand").addClass("daughter-hand-finish");
        const drinkingMilkSound = document.getElementById("drinking-milk");

        setTimeout(() => {
          drinkingMilkSound.currentTime = 0;
          drinkingMilkSound.play().catch(() => {
            console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
          });
        }, 10);
        setTimeout(() => {
          $(".mom-hand").addClass("mom-hand-finish");
        }, 10);
      }, 1000);
      setTimeout(() => {
        $(".daughter-hand").addClass("daughter-hand-empty");
        $(".father-hand").addClass("father-hand-empty");
        $(".mom-hand").addClass("mom-hand-empty");
      }, 3000);
      setTimeout(() => {
        const cowSound = document.getElementById("cow-mooing");
        cowSound.currentTime = 0;
        cowSound.play().catch(() => {
          console.log("播放被瀏覽器阻止，請點擊頁面後再播放。");
        });
        $(".cow-right").addClass("cow-right-move");
      }, 4000);
      setTimeout(() => {
        $(".mow").css("display", "block");
      }, 5000);
    } else {
      $(".father-hand").removeClass("father-hand-finish");
      $(".daughter-hand").removeClass("daughter-hand-finish");
      $(".daughter-hand").removeClass("daughter-hand-empty");
      $(".mom-hand").removeClass("mom-hand-empty");
      $(".father-hand").removeClass("father-hand-empty");
      $(".cow-right").removeClass("cow-right-move");
      $("#flipbook .mom-hand").remove();
      $(".mow").css("display", "none");
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

    let latestPage = 0;
    let playTimeout = null;

    // 頁面對應的音檔 ID 對照表
    const pageAudioMap = {
      2: "audio-1",
      3: "audio-1",
      4: "audio-2",
      5: "audio-2",
      6: "audio-3",
      7: "audio-3",
      8: "audio",
      9: "audio",
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

    // 全部暫停
    function allAudioPause() {
      document.querySelectorAll("audio").forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
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
        // 確保是最後停留頁
        if (page !== latestPage) return;

        allAudioPause();

        setTimeout(() => {
          // 播放對應音檔
          const audioId = pageAudioMap[page];
          if (audioId) {
            const audio = document.getElementById(audioId);
            if (audio) {
              audio.currentTime = 0;
              audio.play().catch(() => {
                console.log("自動播放被阻擋，請點擊頁面再播放");
              });
            }
          }
        }, 1000);

        // 播放背景音樂
        const bgAudio = document.getElementById("audio-background");
        if (bgAudio) {
          bgAudio.currentTime = 0;
          bgAudio.play().catch(() => {
            console.log("背景音樂播放被阻擋");
          });
        }
      }, 100); // 延遲播放
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
