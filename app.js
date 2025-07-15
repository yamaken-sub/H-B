// app.js

document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const resetButton = document.getElementById('reset-button');
    const guessesList = document.getElementById('guesses-list');
    const messageBox = document.getElementById('message-box');

    let secretNumber = ''; // 秘密の数字
    let attempts = 0;      // 試行回数

    // 秘密の数字を生成する関数
    function generateSecretNumber() {
        const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let number = '';
        // 4桁のユニークな数字を生成
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            number += digits[randomIndex];
            digits.splice(randomIndex, 1); // 使用した数字は削除
        }
        return number;
    }

    // ゲームを初期化する関数
    function initializeGame() {
        secretNumber = generateSecretNumber();
        attempts = 0;
        guessesList.innerHTML = '<p class="text-gray-500 text-center text-sm">まだ推測はありません。</p>';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
        showMessage(''); // メッセージをクリア
        console.log('秘密の数字:', secretNumber); // デバッグ用
    }

    // メッセージを表示する関数
    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `bg-blue-50 text-blue-800 p-3 rounded-lg text-center text-sm font-medium message-fade-in`; // デフォルトはinfo
        if (type === 'error') {
            messageBox.className = `bg-red-50 text-red-800 p-3 rounded-lg text-center text-sm font-medium message-fade-in`;
        } else if (type === 'success') {
            messageBox.className = `bg-green-50 text-green-800 p-3 rounded-lg text-center text-sm font-medium message-fade-in`;
        }
        messageBox.classList.remove('hidden');
        // メッセージが空の場合は非表示にする
        if (message === '') {
            messageBox.classList.add('hidden');
        }
    }

    // 推測を処理する関数
    function handleGuess() {
        const guess = guessInput.value;

        // 入力値のバリデーション
        if (guess.length !== 4 || !/^\d+$/.test(guess)) {
            showMessage('4桁の数字を入力してください。', 'error');
            return;
        }

        // 重複する数字がないかチェック
        const uniqueDigits = new Set(guess.split(''));
        if (uniqueDigits.size !== 4) {
            showMessage('重複する数字は入力できません。', 'error');
            return;
        }

        attempts++;
        let hits = 0;
        let blows = 0;

        // ヒットとブローを計算
        for (let i = 0; i < 4; i++) {
            if (guess[i] === secretNumber[i]) {
                hits++;
            } else if (secretNumber.includes(guess[i])) {
                blows++;
            }
        }

        // 推測結果をリストに追加
        const guessItem = document.createElement('div');
        guessItem.className = 'flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-gray-200';
        guessItem.innerHTML = `
            <span class="font-mono text-gray-700 text-lg">${guess}</span>
            <span class="font-semibold text-gray-800">${hits} ヒット, ${blows} ブロー</span>
        `;
        // "まだ推測はありません。"のメッセージがあれば削除
        if (guessesList.querySelector('p.text-gray-500')) {
            guessesList.innerHTML = '';
        }
        guessesList.prepend(guessItem); // 最新の推測を上に追加

        guessInput.value = ''; // 入力フィールドをクリア
        showMessage(''); // メッセージをクリア

        // ゲーム終了条件のチェック
        if (hits === 4) {
            showMessage(`おめでとうございます！ ${attempts} 回で正解しました！`, 'success');
            guessInput.disabled = true;
            guessButton.disabled = true;
        }
    }

    // イベントリスナーの設定
    guessButton.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleGuess();
        }
    });
    resetButton.addEventListener('click', initializeGame);

    // サービスワーカーの登録
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('サービスワーカー登録成功:', registration.scope);
                })
                .catch(error => {
                    console.error('サービスワーカー登録失敗:', error);
                });
        });
    }

    // ゲームの初期化
    initializeGame();
});
