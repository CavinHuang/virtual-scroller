/**
 * 虚拟列表核心类
 */

const enum DIRECTION_TYPE {
  FRONT = 'FRONT', // 往上
  BEHIND = 'BEHIND', // 往下
};

const enum CALC_TYPE {
  INIT = 'INIT',
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC',
};

// 溢出多少个
const LEADING_BUFFER = 2;

export interface IParmas {
  // 虚拟列表在真实 dom 中继续呈现多少项
  keeps?: number
  extraProps?: Record<string, any>,
  // 每个项目的估计大小，如果它更接近平均大小，滚动条长度看起来更准确。建议分配自己计算的平均值。
  estimateSize?: number
  slotHeaderSize?: number
  slotFooterSize?: number
  uniqueIds?: Array<string | number>
  buffer?: number
}

type CallUpdate = (rang: RangeItem) => void

interface RangeItem {
  start: number
  end: number
  padFront: number
  padBehind: number
}

export default class Virtual {
  callUpdate!: CallUpdate | null;
  /**
   * 默认
   */
  param: IParmas | null = {
    keeps: 30,
    extraProps: {},
    estimateSize: 50,
    slotHeaderSize: 0,
    slotFooterSize: 0,
    uniqueIds: [],
    buffer: 5
  };
  uniqueIds: Array<string | number> = []
  
  // size data
  sizes: Map<any,any> = new Map();
  firstRangeTotalSize?: number = 0;
  firstRangeAverageSize: number = 0;
  lastCalcIndex: number = 0;
  fixedSizeValue?: number = 0;
  calcType: CALC_TYPE = CALC_TYPE.INIT;

  // scroll data
  offset: number = 0;
  direction: string = '';

  // range data
  range: RangeItem | null = Object.create(null);

  constructor(param: IParmas | null, callUpdate: CallUpdate | null) {
    console.log('init', param)
    this.init(param, callUpdate);
  }

  init(param: IParmas | null, callUpdate: CallUpdate | null) {
    // param data
    this.param = Object.assign({}, this.param, param);
    this.callUpdate = callUpdate;
    this.uniqueIds = this.param.uniqueIds

    // size data init
    this.sizes = new Map()
    this.firstRangeTotalSize = 0
    this.firstRangeAverageSize = 0
    this.lastCalcIndex = 0
    this.fixedSizeValue = 0
    this.calcType = CALC_TYPE.INIT

    // scroll data init
    this.offset = 0
    this.direction = ''

    // range data init
    this.range = Object.create(null)

    if (param) {
      this.checkRange(0, param.keeps - 1);
    }
  }

  setUniqueIds(uniqueIds: Array<string | number> = []) {
    this.uniqueIds = uniqueIds
  }

  destroy() {
    this.init(null, null);
  }

  /**
   * 当前的节点
   * @returns 
   */
  getRange(): RangeItem {
    const range = Object.create(null);
    if (this.range) {
      range.start = this.range.start;
      range.end = this.range.end;
      range.padFront = this.range.padFront;
      range.padBehind = this.range.padBehind;
    }
    return range;
  }

  isBehind() {
    return this.direction === DIRECTION_TYPE.BEHIND;
  }

  isFront() {
    return this.direction === DIRECTION_TYPE.FRONT;
  }

  /**
   * 根据start获取结束
   * @param start 
   * @returns 
   */
  getOffset(start: number) {
    return (
      (start < 1 ? 0 : this.getIndexOffset(start)) + (this.param?.slotHeaderSize || 0)
    );
  }

  /**
   * id变化时，找出需要删除的项
   * @param key 
   * @param value 
   */
  updateParam(key: keyof IParmas, value: any) {
    if (this.param && key in this.param) {
      if (key === 'uniqueIds') {
        this.sizes.forEach((v, key) => {
          if (!value.includes(key)) {
            this.sizes.delete(key);
          }
        });
        this.setUniqueIds(value)
      }
      this.param[key] = value;
    }
  }

  /**
   * 保存各项的size
   * @param id 
   * @param size 
   */
  saveSize(id: number | string, size: number) {
    this.sizes.set(id, size);

    // 假设大小在一开始是固定的，并记住第一个大小值
    // 如果在下一次保存时没有与此不同的尺寸值 we think it's a fixed size list, otherwise is dynamic size list
    if (this.calcType === CALC_TYPE.INIT) {
      this.fixedSizeValue = size;
      this.calcType = CALC_TYPE.FIXED;
    } else if (
      this.calcType === CALC_TYPE.FIXED &&
      this.fixedSizeValue !== size
    ) {
      this.calcType = CALC_TYPE.DYNAMIC;
      // 删除无用的属性
      delete this.fixedSizeValue;
    }

    // 仅在第第一次计算平均大小
    if (
      this.calcType !== CALC_TYPE.FIXED &&
      typeof this.firstRangeTotalSize !== 'undefined'
    ) {
      if (
        this.sizes.size <
        Math.min(this.param!.keeps, this.uniqueIds.length)
      ) {
        this.firstRangeTotalSize = [...this.sizes.values()].reduce(
          (acc, val) => acc + val,
          0,
        );
        this.firstRangeAverageSize = Math.round(
          this.firstRangeTotalSize! / this.sizes.size,
        );
      } else {
        // 删除无用属性
        delete this.firstRangeTotalSize;
      }
    }
  }

  /**
   * 数据变化，需要更新指针
   */
  handleDataSourcesChange() {
    let start = this.range!.start;

    if (this.isFront()) {
      start = start - LEADING_BUFFER;
    } else if (this.isBehind()) {
      start = start + LEADING_BUFFER;
    }

    start = Math.max(start, 0);

    this.updateRange(this.range!.start, this.getEndByStart(start));
  }

  /**
   * 单项大小变动
   */
  handleSlotSizeChange() {
    this.handleDataSourcesChange();
  }

  /**
   * 滚动时计算指针
   * @param offset 
   * @returns 
   */
  handleScroll(offset: number) {
    this.direction =
      offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND;
    this.offset = offset;

    console.log(this.param)
    
    if (!this.param) {
      return;
    }
    console.log(this.direction)

    if (this.direction === DIRECTION_TYPE.FRONT) {
      this.handleFront();
    } else if (this.direction === DIRECTION_TYPE.BEHIND) {
      this.handleBehind();
    }
  }

  // ----------- public method end -----------

  handleFront() {
    const overs = this.getScrollOvers();
    console.log("🚀 ~ file: index.ts:225 ~ Virtual ~ handleBehind ~ overs:", overs, this.range, this.param?.buffer)
    // 如果不超出范围
    if (overs > this.range!.start) {
      return;
    }

    // move up start by a buffer length, and make sure its safety
    const start = Math.max(overs - this.param!.buffer, 0);
    this.checkRange(start, this.getEndByStart(start));
  }

  handleBehind() {
    const overs = this.getScrollOvers();
    console.log("🚀 ~ file: index.ts:225 ~ Virtual ~ handleBehind ~ overs:", overs, this.range, this.param?.buffer)
    // 向上移动一段缓冲长度
    if (overs < this.range!.start + this.param!.buffer) {
      return;
    }

    this.checkRange(overs, this.getEndByStart(overs));
  }

  // 根据当前滚动偏移返回传递
  getScrollOvers() {
    // 如果header slot存在，我们需要减去它的大小
    const offset = this.offset - this.param!.slotHeaderSize;
    if (offset <= 0) {
      return 0;
    }

    // 如果是固定高度类型
    if (this.isFixedType()) {
      return Math.floor(offset / this.fixedSizeValue!);
    }

    let low = 0;
    let middle = 0;
    let middleOffset = 0;
    let high = this.uniqueIds.length || 0;

    while (low <= high) {
      // this.__bsearchCalls++
      middle = low + Math.floor((high - low) / 2);
      middleOffset = this.getIndexOffset(middle);

      if (middleOffset === offset) {
        return middle;
      } else if (middleOffset < offset) {
        low = middle + 1;
      } else if (middleOffset > offset) {
        high = middle - 1;
      }
    }

    return low > 0 ? --low : 0;
  }

  // 返回给定索引的滚动偏移量，是否可以在这里进一步提高效率？
  // 根据索引获取长度
  getIndexOffset(givenIndex: number) {
    if (!givenIndex) {
      return 0;
    }

    let offset = 0;
    let indexSize = 0;
    for (let index = 0; index < givenIndex; index++) {
      // this.__getIndexOffsetCalls++
      indexSize = this.sizes.get(this.uniqueIds[index]);
      offset =
        offset +
        (typeof indexSize === 'number' ? indexSize : this.getEstimateSize()!);
    }

    //记住最后的index
    this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
    this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex());

    return offset;
  }

  // 是不是固定高模式
  isFixedType() {
    return this.calcType === CALC_TYPE.FIXED;
  }

  // 获取真正的最后一个索引
  getLastIndex() {
    return this.uniqueIds.length - 1;
  }

  // 检测指针是否正确
  checkRange(start: number, end: number) {
    const keeps = this.param!.keeps;
    const total = this.uniqueIds.length;

    console.log(this.param, keeps, total, end - start < keeps - 1)

    // 少于需要渲染的个数
    if (total <= keeps) {
      start = 0;
      end = this.getLastIndex();
    } else if (end - start < keeps - 1) {
      // if range length is less than keeps, corrent it base on end
      start = end - keeps + 1;
    }

    console.log(this.range, start)

    if (this.range!.start !== start) {
      this.updateRange(start, end);
    }
  }

  // 更新指针
  updateRange(start: number, end: number) {
    if (this.range) {
      this.range.start = start;
      this.range.end = end;
      this.range.padFront = this.getPadFront();
      this.range.padBehind = this.getPadBehind();
      this.callUpdate!(this.getRange());
    }
  }

  // 根据start获取end
  getEndByStart(start: number) {
    const theoryEnd = start + this.param!.keeps - 1;
    const truelyEnd = Math.min(theoryEnd, this.getLastIndex());
    return truelyEnd;
  }

  // 获取往前的距离
  getPadFront() {
    if (this.isFixedType()) {
      return this.fixedSizeValue! * this.range!.start;
    } else {
      return this.getIndexOffset(this.range!.start);
    }
  }

  // 获取往后的偏移距离
  getPadBehind() {
    const end = this.range!.end;
    const lastIndex = this.getLastIndex();
    console.log('getPadBehind',  end, lastIndex, this.lastCalcIndex === lastIndex, this.getEstimateSize());
    
    if (this.isFixedType()) {
      return (lastIndex - end) * this.fixedSizeValue!;
    }

    // 如果全部计算完毕，则返回精确的偏移量
    if (this.lastCalcIndex === lastIndex) {
      return this.getIndexOffset(lastIndex) - this.getIndexOffset(end);
    } else {
      // 没有，则使用估计值
      return (lastIndex - end) * this.getEstimateSize()!;
    }
  }

  // 获取预计的大小
  getEstimateSize() {
    return this.isFixedType()
      ? this.fixedSizeValue
      : this.firstRangeAverageSize || this.param!.estimateSize;
  }
}

export {
  Virtual
}