import { ref, Ref, onMounted } from 'vue';

type ScrollElement = Element | Window;

const overflowScrollReg = /scroll|auto|overlay/i;
const defaultRoot = window ? window : undefined;

function isElement(node: Element) {
  const ELEMENT_NODE_TYPE = 1;
  return (
    node.tagName !== 'HTML' &&
    node.tagName !== 'BODY' &&
    node.nodeType === ELEMENT_NODE_TYPE
  );
}

// https://github.com/vant-ui/vant/issues/3823
export function getScrollParent(
  el: Element,
  root: ScrollElement | undefined = defaultRoot
) {
  let node = el;

  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      return node;
    }
    node = node.parentNode as Element;
  }

  return root;
}

export function useScrollParent(
  el: Ref<Element | undefined>,
  root: ScrollElement | undefined = defaultRoot
) {
  const scrollParent = ref<Element | Window>();

  onMounted(() => {
    if (el.value) {
      scrollParent.value = getScrollParent(el.value, root);
    }
  });

  return scrollParent;
}

type Direction = '' | 'vertical' | 'horizontal';

function getDirection(x: number, y: number) {
  if (x > y) {
    return 'horizontal';
  }
  if (y > x) {
    return 'vertical';
  }
  return '';
}

export function useTouch() {
  const startX = ref(0);
  const startY = ref(0);
  const deltaX = ref(0);
  const deltaY = ref(0);
  const offsetX = ref(0);
  const offsetY = ref(0);
  const direction = ref<Direction>('');

  const isVertical = () => direction.value === 'vertical';
  const isHorizontal = () => direction.value === 'horizontal';

  const reset = () => {
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    direction.value = '';
  };

  const start = ((event: TouchEvent) => {
    reset();
    startX.value = event.touches[0].clientX;
    startY.value = event.touches[0].clientY;
  }) as EventListener;

  const move = ((event: TouchEvent) => {
    const touch = event.touches[0];
    // safari back will set clientX to negative number
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value;
    deltaY.value = touch.clientY - startY.value;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);

    // lock direction when distance is greater than a certain value
    const LOCK_DIRECTION_DISTANCE = 10;
    if (
      !direction.value ||
      (offsetX.value < LOCK_DIRECTION_DISTANCE &&
        offsetY.value < LOCK_DIRECTION_DISTANCE)
    ) {
      direction.value = getDirection(offsetX.value, offsetY.value);
    }
  }) as EventListener;

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal,
  };
}
export function getScrollTop(el: ScrollElement): number {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset;

  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0);
}

export const stopPropagation = (event: Event) => event.stopPropagation();
export function preventDefault(event: Event, isStopPropagation?: boolean) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}