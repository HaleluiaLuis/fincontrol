let txCounter = 0;
let invCounter = 0;
let apprCounter = 0;

export function nextTransactionId() {
  txCounter += 1;
  return `trans-${txCounter}`;
}

export function nextInvoiceId() {
  invCounter += 1;
  return `inv-${invCounter}`;
}

export function nextApprovalId() {
  apprCounter += 1;
  return `app-${apprCounter}`;
}
