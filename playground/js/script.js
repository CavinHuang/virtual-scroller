// https://github.com/reactjser/vue3-virtual-scroll-list/blob/main/src/virtual-list.tsx

function VisualList(props) {
  console.log('start', props)
  let range
  
  const getUniqueIdFromDataSources = () => {
    const { dataKey, dataSources = [] } = props;
    return dataSources.map((dataSource) =>
      typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey]
    );
  };

  const onRangeChanged = (newRange) => {
    range = newRange;
  };

  const installVirtual = () => {
    virtual = new Virtual.Virtual(
      {
        slotHeaderSize: 0,
        slotFooterSize: 0,
        keeps: props.keeps || 30,
        estimateSize: props.estimateSize,
        buffer: Math.round(props.keeps / 3), // recommend for a third of keeps
        uniqueIds: getUniqueIdFromDataSources(),
      },
      onRangeChanged
    );

    // sync initial range
    range = virtual.getRange();
  };

  const getRenderSlots = () => {
    const slots = []
    const { start, end } = range
    const {
      dataSources,
      dataKey,
      itemClass = 'item',
      itemStyle = {},
      extraProps = {},
      dataComponent,
      itemScopedSlots,
      uniqueKey
    } = props

    console.log("start", dataKey, start, end, dataSources);

    for (let index = start; index <= end; index ++) {
      const dataSource = dataSources[index]
      if (dataSource) {
        const uniquekey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]
        if (typeof uniquekey === 'string' || typeof uniquekey === 'number') {
          const itemElement = `<div data-key="${uniquekey}" class="${itemClass}" id="rootRef_${uniquekey}">
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
    return slots
  }

  const render = () => {
    const wrap = document.querySelector('#wrap')
    installVirtual();
    const slots = getRenderSlots()
    wrap.innerHTML = slots.join('')
  }

  return {
    render,
  };
}
