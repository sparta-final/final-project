export enum paymentStatus {
  //  결제대기, 결제완료, 결제취소, 결제실패
  WAITING = '결제대기',
  SUCCESS = '결제완료',
  CANCEL = '결제취소',
  FAIL = '결제실패',
  // 'forgery', 'paid', 'uncancelled', 'cancelled', 'failed', 'ready'
}
