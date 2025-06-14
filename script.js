const config = {
    apiUrl: "https://api.deriv.com",
    botActive: false,
    currentBalance: 0,
    trades: []
};

const apiTokenInput = document.getElementById('apiToken');
const connectBtn = document.getElementById('connectBtn');
const startBotBtn = document.getElementById('startBotBtn');
const stopBotBtn = document.getElementById('stopBotBtn');
const logContainer = document.getElementById('logContainer');
const symbolSelect = document.getElementById('symbol');
const tradeTypeSelect = document.getElementById('tradeType');
const amountInput = document.getElementById('amount');
const strategySelect = document.getElementById('strategy');

connectBtn.addEventListener('click', connectToAPI);
startBotBtn.addEventListener('click', startBot);
stopBotBtn.addEventListener('click', stopBot);

function connectToAPI() {
    const apiToken = apiTokenInput.value.trim();

    if (!apiToken) {
        logMessage("please enter your API token", "error");
        return;
    }

    logMessage("Connecting to Deriv API...", "info");

    setTimeout(() => {
        config.apiToken = apiToken;
        logMessage("Successfully connected to Deriv API", "success");
        startBotBtn.disabled = false;
    }, 1000);
}

function startBot() {
    if (config.botActive) return;

    config.botActive = true;
    startBotBtn.disabled = true;
    stopBotBtn.disabled = false;

    logMessage("Trading bot started", "success");

    config.botInterval = setInterval(executeTrade, 5000);
}

function stopBot() {
    if (!config.botActive) return;

    clearInterval(config.botInterval);
    config.botActive = false;
    startBotBtn.disabled = false;
    stopBotBtn.disabled = true;

    logMessage("Trading bot stopped", "info")
}

function executeTrade() {
    const symbol = symbolSelect.value;
    const tradeType = tradeTypeSelect.value;
    const amount = parseFloat(amountInput.value);
    const strategy = strategySelect.value;

    if (!symbol || !tradeType || isNaN(amount)) {
        logMessage("Invalid trade parameters", "error");
        return;
    }

    logMessage('placing ${tradeType} trade on ${symbol} for $${amount}...', "info");

    simulateTrade(symbol, tradeType, amount, strategy);
}

function simulateTrade(symbol, tradeType, amount, strategy) {
    setTimeout(() => {
        const isWin = Math.random() > 0.5;
        const payout = isWin ? amount * 0.95 : -amount;

        config.currentBalance += payout;

        const trade = {
            id: Date.now(),
            symbol,
            tradeType,
            amount,
            strategy,
            result: isWin ? "win" : "loss",
            payout,
            timestamp: new Date().toISOString()
        };

        config.trades.push(trade);

        const resultClass = isWin ? "profit" : "loss";
        logMessage('Trade ${trade.id}: ${tradeType} on ${symbol} ${isWin ? "won" : "lost"} - Payout: $${payout.toFixed(2)} (Balance: $${config.currentBalance.toFixed(2)})', resultClass);

        if (strategy === "martingale" && !isWin) {
            amountInput.value = (amount * 2).toFixed(2);
            logMessage("Martingale strategy: doubling next trade amount", "info");
        } else {
            amountInput.value = document.getElementById('amount').defaultValue;
        }
    }, 1000);
}

function logMessage(message, type = "info") {
    const entry = document.createElement('div');
    entry.className = 'log-entry ${type}';
    entry.textContent = '[${new Date().toLocaleTimeString()}] ${message}';
    logContainer.scrollTop = logContainer.scrollHeight;
}

startBotBtn.disabled = true;