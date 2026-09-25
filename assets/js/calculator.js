/**
 * FastFund - Loan Calculator
 * Amortization and cost calculation
 */

document.addEventListener('DOMContentLoaded', () => {
  const calcForm = document.getElementById('calculatorForm');
  if (!calcForm) return;

  const amountInput = document.getElementById('calcAmount');
  const termInput = document.getElementById('calcTerm');
  const rateInput = document.getElementById('calcRate');
  const amountRange = document.getElementById('calcAmountRange');
  const rateRange = document.getElementById('calcRateRange');

  const monthlyPaymentEl = document.getElementById('resultMonthly');
  const totalRepaymentEl = document.getElementById('resultTotal');
  const totalInterestEl = document.getElementById('resultInterest');
  const principalBar = document.getElementById('barPrincipal');

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Paint the filled part of a range track
  const paintRange = (range) => {
    if (!range) return;
    const min = parseFloat(range.min);
    const max = parseFloat(range.max);
    const pct = ((parseFloat(range.value) - min) / (max - min)) * 100;
    range.style.setProperty('--fill', `${Math.min(100, Math.max(0, pct))}%`);
  };

  // Keep a number input and its slider in sync
  const linkRange = (input, range) => {
    if (!range) return;
    range.addEventListener('input', () => {
      input.value = range.value;
      paintRange(range);
      calculateLoan();
    });
    input.addEventListener('input', () => {
      range.value = input.value;
      paintRange(range);
    });
    paintRange(range);
  };

  const calculateLoan = () => {
    const P = parseFloat(amountInput.value);
    const months = parseInt(termInput.value);
    const annualRate = parseFloat(rateInput.value);

    if (isNaN(P) || isNaN(months) || isNaN(annualRate) || P <= 0 || months <= 0) {
      monthlyPaymentEl.textContent = '$0';
      totalRepaymentEl.textContent = '$0';
      totalInterestEl.textContent = '$0';
      if (principalBar) principalBar.style.width = '100%';
      return;
    }

    // Monthly interest rate
    const r = (annualRate / 100) / 12;
    const n = months;

    let M = 0;
    if (r === 0) {
      M = P / n;
    } else {
      M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalRepayment = M * n;
    const totalInterest = totalRepayment - P;

    monthlyPaymentEl.textContent = formatCurrency(M);
    totalRepaymentEl.textContent = formatCurrency(totalRepayment);
    totalInterestEl.textContent = formatCurrency(totalInterest);
    if (principalBar) principalBar.style.width = `${(P / totalRepayment) * 100}%`;
  };

  // Listen for changes
  linkRange(amountInput, amountRange);
  linkRange(rateInput, rateRange);
  amountInput.addEventListener('input', calculateLoan);
  termInput.addEventListener('change', calculateLoan);
  rateInput.addEventListener('input', calculateLoan);

  // Initial calculation
  calculateLoan();
});
