// https://github.com/reactjser/vue3-virtual-scroll-list/blob/main/src/virtual-list.tsx

function VisualList(props) {
  
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
    range.value = virtual.getRange();
  };
}
