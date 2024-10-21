window.onload = function() {

    /** ライツアウトのチェックボックス要素リスト */
    var lightsList = Array.prototype.slice.call(document.getElementsByClassName("light"));
    /** Start/Stop ボタンオブジェクト */
    var toggleButton = document.getElementById("toggle");
    /** Shuffle ボタンオブジェクト */
    var shuffleButton = document.getElementById("shuffle");
    /** ボードのサイズ */
    var sizeOfBoard = 5;
    /** ゲーム中をあらわすフラグ */
    var inGame = false;
/** 開始時間 */
    let startTime = null;
    /** タイマーID */
    let timer = null;

    // 経過時間をフォーマットする関数
    function formatTime(milliseconds) {
        const seconds = (milliseconds / 1000).toFixed(2); // 秒に変換して小数点以下2桁にフォーマット
        return `${seconds} sec`;
    }

    // 経過時間を更新する関数
    function updateElapsedTime() {
        const currentTime = new Date(); // 現在の時間を取得
        const elapsedMilliseconds = currentTime.getTime() - startTime.getTime(); // 経過時間をミリ秒単位で計算
        document.getElementById('elapsed-time').textContent = formatTime(elapsedMilliseconds);
    }
    // 各チェックボックスに対してクリック時イベントを定義
    for (var i = 0; i < lightsList.length; ++i) {
        lightsList[i].onclick = function() {
            executeElement(this);
        }
    }

    // Start/Stop ボタンを押した時のイベント
    toggleButton.onclick = function() {
        if (!inGame) {
            // ゲーム未開始/停止中
            startTime = new Date(); // 開始時間を記録
            timer = setInterval(updateElapsedTime, 10); // 0.01秒ごとに経過時間を更新
            inGame = true;
            toggleButton.innerHTML = "Stop";
        } else {
            // ゲーム中
            clearInterval(timer); // タイマーを停止
            /*timer = null;*/
            inGame = false;
            toggleButton.innerHTML = "Start";
        }
    }

    // Shuffle ボタンを押下した時のイベント
    shuffleButton.onclick = function() {
        // ゲーム中でなければシャッフルする
        if(!inGame){
        	shuffleLights();
            for (var i = 0; i < lightsList.length; ++i){
                var shuffle = Math.random();
                if(shuffle < 0.5){
                    lightsList[i].checked = "checked";
                } else{
                    lightsList[i].checked = "";
                }
            }
        } else{
            shuffle.disabled = true;
        }
    }
    
         // ランダムにライトをシャッフルして故障させる
function shuffleLights() {
    // すべてのチェックボックスを表示状態にリセット
    lightsList.forEach(function(light) {
        light.style.display = "inline"; // 再表示
        light.removeAttribute("data-broken"); // 故障状態を解除
    });

    // ランダムに故障するライトの数を決定
    var numOfBrokenLights = Math.floor(Math.random() * 4);

    for (var i = 0; i < numOfBrokenLights; ++i) {
        var randomIndex = Math.floor(Math.random() * lightsList.length);
        var light = lightsList[randomIndex];
        light.setAttribute("data-broken", "true");
        light.style.display = "none"; // 故障させて非表示にする
    }
}
    // ゲーム終了判定
    function isGameOver() {
        for (var i = 0; i < lightsList.length; ++i) {
            if (lightsList[i].checked) {
                return false;
            }
        }
        return true;
    }

    // チェックボックスクリック時に呼び出されるイベント
    function executeElement(element) {
        // ゲーム未開始/停止中は、四方の反転処理を行わない
        if (!inGame) {
            return;
        }

        // クリックされたチェックボックスの番号を取得
        var index = lightsList.indexOf(element);

        // クリックしたところの上のマスの状態を反転する
        var aboveIndex = index - sizeOfBoard;
        if (index > (sizeOfBoard - 1)) { // index > 4
            if (lightsList[aboveIndex].checked) {
                lightsList[aboveIndex].checked = false;
            } else {
                lightsList[aboveIndex].checked = true;
            }
        }

        // クリックしたところの左のマスの状態を反転する
        var leftIndex = index - 1;
        if ((index % sizeOfBoard) != 0) { // (index % 5) != 0
            if (lightsList[leftIndex].checked) {
                lightsList[leftIndex].checked = false;
            } else {
                lightsList[leftIndex].checked = true;
            }
        }

        // クリックしたところの右のマスの状態を反転する
        var rightIndex = index + 1;
        if ((index % sizeOfBoard) != (sizeOfBoard - 1)) { // (index % 5) != 4
            if (lightsList[rightIndex].checked) {
                lightsList[rightIndex].checked = false;
            } else {
                lightsList[rightIndex].checked = true;
            }
        }

        // クリックしたところの下のマスの状態を反転する
        var belowIndex = index + sizeOfBoard;
        if (index < (lightsList.length - sizeOfBoard)) { // index < 20
            if (lightsList[belowIndex].checked) {
                lightsList[belowIndex].checked = false;
            } else {
                lightsList[belowIndex].checked = true;
            }
        }

        // ゲームの終了判定を行う
        if (isGameOver()) {
            toggleButton.click();
            //終了時刻
            /*var endtime=new Date();*/
            //かかった時間を計算
            var cleartime=timer;
            //クリアタイムに応じてメッセージを変更
            if(cleartime<1.00){
                alert("もはや君は人類を超越している!");
            }else if(cleartime<10.00){
                alert("おめでとう。この町でNo1の実力だ!"+cleartime);
            }else if(cleartime<20.00){
                alert("おめでとう。この村でトップレベルだね!");
            }else{
                alert("おめでとう!");
            }  
            timer = null;
        }
    }
};