// Service Workerを登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker 登録成功:', registration);
            })
            .catch(error => {
                console.log('Service Worker 登録失敗:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0'; // 現在の入力値
    let operator = null; // 選択された演算子
    let previousInput = null; // 演算子が押される前の入力値
    let shouldResetDisplay = false; // 次の入力でディスプレイをリセットするか

    // ボタンがクリックされたときの処理
    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const value = e.target.dataset.value;
        const type = e.target.classList.contains('operator') ? 'operator' : 'number';

        handleInput(value, type);
        updateDisplay();
    });

    // 入力処理のメインロジック
    function handleInput(value, type) {
        if (value >= '0' && value <= '9') {
            handleNumber(value);
        } else if (value === '.') {
            handleDecimal();
        } else if (value === 'AC') {
            resetCalculator();
        } else if (value === '+/-') {
            toggleSign();
        } else if (value === '%') {
            calculatePercentage();
        } else if (value === '=') {
            handleEquals();
        } else { // +, -, *, /
            handleOperator(value);
        }
    }

    // 数字が押されたときの処理
    function handleNumber(value) {
        if (currentInput === '0' || shouldResetDisplay) {
            currentInput = value;
            shouldResetDisplay = false;
        } else {
            currentInput += value;
        }
    }

    // 小数点が押されたときの処理
    function handleDecimal() {
        if (shouldResetDisplay) {
            currentInput = '0.';
            shouldResetDisplay = false;
            return;
        }
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    }

    // 演算子が押されたときの処理
    function handleOperator(nextOperator) {
        if (operator && !shouldResetDisplay) {
            calculate();
        }
        previousInput = currentInput;
        operator = nextOperator;
        shouldResetDisplay = true;
    }

    // =が押されたときの処理
    function handleEquals() {
        if (!operator || !previousInput) return;
        calculate();
        operator = null;
        previousInput = null;
    }
    
    // 計算を実行
    function calculate() {
        if (!operator || previousInput === null) return;
        
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        let result = 0;
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
        }
        currentInput = result.toString();
        shouldResetDisplay = true;
    }

    // AC（オールクリア）が押されたときの処理
    function resetCalculator() {
        currentInput = '0';
        operator = null;
        previousInput = null;
        shouldResetDisplay = false;
    }

    // +/-（符号反転）が押されたときの処理
    function toggleSign() {
        currentInput = (parseFloat(currentInput) * -1).toString();
    }

    // %が押されたときの処理
    function calculatePercentage() {
        currentInput = (parseFloat(currentInput) / 100).toString();
    }
    
    // ディスプレイを更新
    function updateDisplay() {
        display.textContent = currentInput;
    }
});
