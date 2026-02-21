let current = '0';
let previous = '';
let operator = null;
let shouldReset = false;
const display = document.getElementById('display');
const expression = document.getElementById('expression');
function updateDisplay(val, isResult = false) {
  let show = String(val);
  if (show.length > 12) show = parseFloat(val).toExponential(4);
  display.textContent = show;
  display.className = 'display-value' + (isResult ? ' gold' : '');
}
function appendNum(num) {
  if (shouldReset) { current = num; shouldReset = false; }
  else { current = current === '0' ? num : current + num; }
  if (current.length > 12) return;
  display.className = 'display-value';
  updateDisplay(current);
}
function appendDot() {
  if (shouldReset) { current = '0.'; shouldReset = false; }
  if (!current.includes('.')) current += '.';
  updateDisplay(current);
}
function setOperator(op) {
  if (operator && !shouldReset) calculate(true);
  previous = current;
  operator = op;
  shouldReset = true;
  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  expression.textContent = previous + ' ' + symbols[op];
  display.className = 'display-value';
}
function calculate(silent = false) {
  if (!operator || !previous) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      if (b === 0) {
        display.textContent = 'Cannot ÷ 0';
        display.className = 'display-value error';
        expression.textContent = '';
        operator = null; previous = ''; current = '0'; shouldReset = true;
        return;
      }
      result = a / b;
      break;
  }

  result = parseFloat(result.toPrecision(12));

  if (!silent) {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    expression.textContent = previous + ' ' + symbols[operator] + ' ' + current + ' =';
  }

  current = String(result);
  operator = null;
  previous = '';

  shouldReset = true;
  updateDisplay(result, !silent);
}
function clearAll() {
  current = '0';
  previous = '';
  operator = null;
  shouldReset = false;
  expression.textContent = '';
  updateDisplay('0');
}
function toggleSign() {
  current = String(parseFloat(current) * -1);
  updateDisplay(current);
}
function percentage() {
  current = String(parseFloat(current) / 100);
  updateDisplay(current);
}


document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNum(e.key);
  else if (e.key === '.') appendDot();
  else if (e.key === '+') setOperator('+');
  else if (e.key === '-') setOperator('-');
  else if (e.key === '*') setOperator('*');
  else if (e.key === '/') { e.preventDefault(); setOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') {
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay(current);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.buttons').addEventListener('click', function(e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  });
});
