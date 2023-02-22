// https://github.com/reactjser/vue3-virtual-scroll-list/blob/main/src/virtual-list.tsx

function VisualList(props) {

  let range
  
  const getUniqueIdFromDataSources = () => {
    const { dataKey, dataSources = [] } = props;
    return dataSources.map((dataSource) =>
      typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey]
    );
  };

  const onRangeChanged = (newRange) => {
    range.value = newRange;
  };

  const installVirtual = () => {
    virtual = new Virtual(
      {
        slotHeaderSize: 0,
        slotFooterSize: 0,
        keeps: props.keeps,
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
      itemScopedSlots
    } = props

    for (let index = start; index <= end; index ++) {
      const dataSource = dataSources[index]
      if (dataSource) {
        const uniquekey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]
        if (typeof uniquekey === 'string' || typeof uniquekey === 'number') {
          slots.push()
        }
      }
    }
  }
}
