// https://github.com/reactjser/vue3-virtual-scroll-list/blob/main/src/virtual-list.tsx

function VisualList(props) {
  console.log("start", props);
  props = Object.assign(
    {},
    {
      bottomThreshold: 0,
      direction: "vertical",
    },
    props
  );

  let range;
  let virtual;
  const isHorizontal = props.direction === "horizontal";
  const directionKey = isHorizontal ? "scrollLeft" : "scrollTop";
  const root = document.querySelector(".visual-list");
  const wrap = document.querySelector("#wrap");
  const shepherd = document.querySelector("#shepherd");

  let dataSources = props.dataSources;
  const getUniqueIdFromDataSources = () => {
    const { dataKey } = props;
    return dataSources.map((dataSource) =>
      typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey]
    );
  };

  const onRangeChanged = (newRange) => {
    console.log("range changed", newRange);
    range = newRange;
  };

  // set current scroll position to a expectant index
  const scrollToIndex = (index) => {
    // scroll to bottom
    if (index >= dataSources.length - 1) {
      scrollToBottom();
    } else {
      const offset = virtual.getOffset(index);
      scrollToOffset(offset);
    }
  };

  // set current scroll position to bottom
  const scrollToBottom = () => {
    if (shepherd) {
      const offset = shepherd[isHorizontal ? "offsetLeft" : "offsetTop"];
      scrollToOffset(offset);

      // check if it's really scrolled to the bottom
      // maybe list doesn't render and calculate to last range
      // so we need retry in next event loop until it really at bottom
      setTimeout(() => {
        if (getOffset() + getClientSize() < getScrollSize()) {
          scrollToBottom();
        }
      }, 3);
    }
  };

  // set current scroll position to a expectant offset
  const scrollToOffset = (offset) => {
    if (props.pageMode) {
      document.body[directionKey] = offset;
      document.documentElement[directionKey] = offset;
    } else {
      if (root) {
        root[directionKey] = offset;
      }
    }
  };

  const installVirtual = () => {
    const keeps = 30;
    virtual = new Virtual.Virtual(
      {
        slotHeaderSize: 0,
        slotFooterSize: 0,
        keeps,
        estimateSize: props.estimateSize,
        buffer: Math.round(keeps / 3), // recommend for a third of keeps
        uniqueIds: getUniqueIdFromDataSources(),
      },
      onRangeChanged
    );

    // sync initial range
    range = virtual.getRange();

    root.addEventListener("scroll", onScroll, false);
    setShepherdStyle()
  };

  const getRenderSlots = () => {
    const slots = [];
    const { start, end } = range;
    const {
      dataKey,
      itemClass = "item",
      itemStyle = {},
      extraProps = {},
      dataComponent,
      itemScopedSlots,
      uniqueKey,
    } = props;

    // console.log("start", dataKey, start, end, dataSources);

    for (let index = start; index <= end; index++) {
      const dataSource = dataSources[index];
      if (dataSource) {
        const uniquekey =
          typeof dataKey === "function"
            ? dataKey(dataSource)
            : dataSource[dataKey];
        if (typeof uniquekey === "string" || typeof uniquekey === "number") {
          const itemElement = `<div data-key="${uniquekey}" data-index="${index}" class="${itemClass}" id="rootRef_${uniquekey}">
            <div class="item-inner">
      <div class="head">
        <span class="index"># ${dataSource.index}</span>
        <span class="name">${dataSource.name}</span>
      </div>
      <div class="desc">${dataSource.desc}</div>
    </div>
          </div>`;
          slots.push(itemElement);
        }
      }
    }
    return slots;
  };

  const emitEvent = (offset, clientSize, scrollSize, evt) => {
    props.onScroll && props.onScroll(evt, virtual.getRange());

    if (
      virtual.isFront() &&
      !!dataSources.length &&
      offset - props.topThreshold <= 0
    ) {
      props.toTop && props.toTop();
    } else if (
      virtual.isBehind() &&
      offset + clientSize + props.bottomThreshold >= scrollSize
    ) {
      props.toBottom && props.toBottom(virtual);
    }
  };

  const getOffset = () => {
    if (props.pageMode) {
      return (
        document.documentElement[directionKey] || document.body[directionKey]
      );
    } else {
      return root ? Math.ceil(root[directionKey]) : 0;
    }
  };
  // return client viewport size
  const getClientSize = () => {
    const key = isHorizontal ? "clientWidth" : "clientHeight";
    if (props.pageMode) {
      return document.documentElement[key] || document.body[key];
    } else {
      return root ? Math.ceil(root[key]) : 0;
    }
  };
  // return all scroll size
  const getScrollSize = () => {
    const key = isHorizontal ? "scrollWidth" : "scrollHeight";
    if (props.pageMode) {
      return document.documentElement[key] || document.body[key];
    } else {
      return root ? Math.ceil(root[key]) : 0;
    }
  };

  const onScroll = (evt) => {
    const offset = getOffset();
    const clientSize = getClientSize();
    const scrollSize = getScrollSize();

    // iOS scroll-spring-back behavior will make direction mistake
    if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
      return;
    }

    virtual.handleScroll(offset);
    emitEvent(offset, clientSize, scrollSize, evt);
    updateWrapStyle();
  };

  const updateWrapStyle = () => {
    const { padFront, padBehind } = range;
    const paddingStyle = {
      padding: isHorizontal
        ? `0px ${padBehind}px 0px ${padFront}px`
        : `${padFront}px 0px ${padBehind}px`,
    };
    const { wrapStyle = {} } = props;
    const wrapperStyle = wrapStyle
      ? Object.assign({}, wrapStyle, paddingStyle)
      : paddingStyle;

    for (const key in wrapperStyle) {
      if (Object.hasOwnProperty.call(wrapperStyle, key)) {
        wrap.style[key] = wrapperStyle[key];
      }
    }
  };

  const setShepherdStyle = () => {
    shepherd.style.width = isHorizontal ? '0px' : '100%'
    shepherd.style.height = isHorizontal ? '100%' : '0px'
  }

  const render = () => {
    const slots = getRenderSlots();
    updateWrapStyle();
    wrap.innerHTML = slots.join("");
  };

  const setDataSources = (items) => {
    dataSources = items;
    // virtual.setUniqueIds(getUniqueIdFromDataSources());
    virtual.updateParam("uniqueIds", getUniqueIdFromDataSources());
    virtual.handleDataSourcesChange();
  };

  return {
    installVirtual,
    render,
    setDataSources,
    scrollToIndex,
    scrollToOffset
  };
}
