const answer = "APPLE";

let index = 0;
let attempts = 0;
let timer;

const appStart = () => {
  const displayGameOver = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료되었습니다";
    div.style =
      "display:flex; justify-content: center; align-items: center; position: absolute; top:40vh; width: 200px; left:38vw; background-color: white;";
    document.body.appendChild(div); //html의 바디에 div 삽입
  };

  const gameover = () => {
    //기존의 이벤트리스너를 없애주는 역할(키가 안 먹는 역할)
    window.removeEventListener("keydown", handleKeyDown);

    document
      .querySelector(".keyboard-block")
      .removeEventListener("click", handleClick);

    displayGameOver();
    //setInterval을 종료
    clearInterval(timer);
  };

  const nextLine = () => {
    if (attempts === 6) return gameover();
    attempts += 1; //row를 다음으로
    index = 0; //column을 첫번째로
  };

  const handleEnter = () => {
    let count_correction = 0;

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const input_letter = block.innerText;
      const answer_letter = answer[i];

      // 정답과 입력한 글자의 인덱스 정답 유무를 확인하는 조건문
      if (input_letter === answer_letter) {
        block.style.background = "green";
        count_correction += 1;
        block.animate(
          [
            { transform: "rotate(0) scale(1)" },
            { transform: "rotate(360deg) scale(0)" },
          ],
          {
            duration: 2000,
            iterations: 1,
          }
        );
      } //정답과 같지는 않지만 정답의 일부와 맞는지 확인
      else if (answer.includes(input_letter)) {
        block.style.background = "aqua";
      } else {
        //정답의 알파벳과 맞지 않은 블럭
        block.style.background = "gray";
      }
    }
    if (count_correction === 5) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${index}']`
      );
      gameover();
    } else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }

    if (index !== 0) index -= 1;
  };

  const handleKeyDown = (event) => {
    //키보드에서의 키 값을 대문자로
    const key = event.key.toUpperCase();

    //알파벳이 아닌 탭이나 스페이스를 피하기 위함(keycode의 예: 65, 90)
    const keyCode = event.keyCode;

    //html 셀렉터 안에서 정의해놨던 data-index
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnter();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };

  //키보드
  const handleClick = (event) => {
    const keyValue = event.target.dataset["key"];

    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (keyValue === "BACK") {
      handleKeyboardBack();
    } else if (index === 5) {
      if (keyValue === "Enter") {
        handleEnter();
      } else return;
    } else if (keyValue !== null && keyValue.length > 0) {
      thisBlock.innerText = keyValue;
      index += 1;
    }
  };

  const startTimer = () => {
    const start_time = new Date();

    const setTime = () => {
      const time_now = new Date();
      const pasted_time = new Date(time_now - start_time);

      const minute = pasted_time.getMinutes().toString();
      const second = pasted_time.getSeconds().toString();
      const timerDiv = document.querySelector("#timer");
      timerDiv.innerText = `${minute.padStart(2, "0")}:${second.padStart(
        2,
        "0"
      )}`;
    };
    // 인터벌의 아이디를 저장
    timer = setInterval(setTime, 1000);
  };

  startTimer();

  window.addEventListener("keydown", handleKeyDown);
  document
    .querySelectorAll(".keyboard-block")
    .forEach((key) => key.addEventListener("click", handleClick));
};

appStart();
