ctrl.vo.isOpen = ctrl.observer(true);
// JSON객체 사용
ctrl.vo.toggle = {
  open: ctrl.observer(false),
  close: ctrl.observer(true)
};
