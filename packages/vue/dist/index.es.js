var ee = Object.defineProperty;
var te = (e, t, s) => t in e ? ee(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var S = (e, t, s) => (te(e, typeof t != "symbol" ? t + "" : t, s), s);
import { ref as p, onMounted as N, computed as q, onUpdated as se, onUnmounted as $, onDeactivated as ne, isRef as ie, watch as X, nextTick as G, onActivated as J, unref as x, defineComponent as K, useSlots as ae, reactive as oe, openBlock as R, createElementBlock as k, createElementVNode as L, normalizeStyle as V, renderSlot as M, toDisplayString as le, createCommentVNode as Y, mergeProps as re, onBeforeMount as ue, createVNode as U, normalizeClass as A, Fragment as ce, renderList as de, createBlock as he, withCtx as fe, normalizeProps as ge, guardReactiveProps as pe } from "vue";
const me = /scroll|auto|overlay/i, Q = window || void 0;
function ve(e) {
  return e.tagName !== "HTML" && e.tagName !== "BODY" && e.nodeType === 1;
}
function Se(e, t = Q) {
  let s = e;
  for (; s && s !== t && ve(s); ) {
    const { overflowY: n } = window.getComputedStyle(s);
    if (me.test(n))
      return s;
    s = s.parentNode;
  }
  return t;
}
function ye(e, t = Q) {
  const s = p();
  return N(() => {
    e.value && (s.value = Se(e.value, t));
  }), s;
}
function ze(e, t) {
  return e > t ? "horizontal" : t > e ? "vertical" : "";
}
function Te() {
  const e = p(0), t = p(0), s = p(0), n = p(0), a = p(0), u = p(0), c = p(""), f = () => c.value === "vertical", m = () => c.value === "horizontal", g = () => {
    s.value = 0, n.value = 0, a.value = 0, u.value = 0, c.value = "";
  };
  return {
    move: (o) => {
      const y = o.touches[0];
      s.value = (y.clientX < 0 ? 0 : y.clientX) - e.value, n.value = y.clientY - t.value, a.value = Math.abs(s.value), u.value = Math.abs(n.value);
      const E = 10;
      (!c.value || a.value < E && u.value < E) && (c.value = ze(a.value, u.value));
    },
    start: (o) => {
      g(), e.value = o.touches[0].clientX, t.value = o.touches[0].clientY;
    },
    reset: g,
    startX: e,
    startY: t,
    deltaX: s,
    deltaY: n,
    offsetX: a,
    offsetY: u,
    direction: c,
    isVertical: f,
    isHorizontal: m
  };
}
function xe(e) {
  const t = "scrollTop" in e ? e.scrollTop : e.pageYOffset;
  return Math.max(t, 0);
}
const Ee = (e) => e.stopPropagation();
function Ie(e, t) {
  (typeof e.cancelable != "boolean" || e.cancelable) && e.preventDefault(), t && Ee(e);
}
const Z = (e, t, s) => {
  let n = null;
  const a = q(
    () => e.horizontal ? "offsetWidth" : "offsetHeight"
  ), u = () => t.value ? t.value[a.value] : 0, c = () => {
    const { event: f, uniqueKey: m, hasInitial: g } = e;
    s(f, m, u(), g);
  };
  N(() => {
    typeof ResizeObserver < "u" && (n = new ResizeObserver(() => {
      c();
    }), t.value && n.observe(t.value));
  }), se(() => {
    c();
  }), $(() => {
    n && (n.disconnect(), n = null);
  });
};
function Re(e) {
  let t;
  N(() => {
    e(), G(() => {
      t = !0;
    });
  }), J(() => {
    t && e();
  });
}
function De(e, t, s = {}) {
  if (!window)
    return;
  const { target: n = window, passive: a = !1, capture: u = !1 } = s;
  let c = !1, f;
  const m = (r) => {
    if (c)
      return;
    const o = x(r);
    o && !f && (o.addEventListener(e, t, {
      capture: u,
      passive: a
    }), f = !0);
  }, g = (r) => {
    if (c)
      return;
    const o = x(r);
    o && f && (o.removeEventListener(e, t, u), f = !1);
  };
  $(() => g(n)), ne(() => g(n)), Re(() => m(n));
  let z;
  return ie(n) && (z = X(n, (r, o) => {
    g(o), m(r);
  })), () => {
    z == null || z(), g(n), c = !0;
  };
}
const Oe = {
  key: 0,
  class: "pull-refresh_text"
}, ke = {
  key: 1,
  class: "loading"
}, Pe = /* @__PURE__ */ K({
  __name: "PullRefresh",
  props: {
    disabled: { type: Boolean },
    modelValue: { type: Boolean },
    headHeight: { default: 50 },
    successText: null,
    pullingText: null,
    loosingText: null,
    loadingText: null,
    pullDistance: null,
    successDuration: { default: 500 },
    animationDuration: { default: 300 }
  },
  emits: ["change", "refresh", "update:modelValue"],
  setup(e, { emit: t }) {
    const s = e, n = 50, a = ["pulling", "loosing", "success"], u = {
      normal: "",
      loading: "",
      success: "",
      pulling: "下拉即可刷新...",
      loosing: "释放即可刷新..."
    }, c = ae();
    let f;
    const m = p(), g = p(), z = ye(m), r = oe({
      status: "normal",
      distance: 0,
      duration: 0
    }), o = Te(), y = q(() => ({
      transitionDuration: `${r.duration}ms`,
      transform: r.distance ? `translate3d(0,${r.distance}px, 0)` : ""
    })), E = () => {
      if (s.headHeight !== n)
        return {
          height: `${s.headHeight}px`
        };
    }, D = () => r.status !== "loading" && r.status !== "success" && !s.disabled, F = (l) => {
      const v = +(s.pullDistance || s.headHeight);
      return l > v && (l < v * 2 ? l = v + (l - v) / 2 : l = v * 1.5 + (l - v * 2) / 4), Math.round(l);
    }, I = (l, v) => {
      const i = +(s.pullDistance || s.headHeight);
      r.distance = l, v ? r.status = "loading" : l === 0 ? r.status = "normal" : l < i ? r.status = "pulling" : r.status = "loosing", t("change", {
        status: r.status,
        distance: l
      });
    }, B = () => {
      const { status: l } = r;
      return l === "normal" ? "" : s[`${l}Text`] || u[l];
    }, w = () => {
      r.status = "success", setTimeout(() => {
        I(0);
      }, +s.successDuration);
    }, P = (l) => {
      f = xe(z.value) === 0, f && (r.duration = 0, o.start(l));
    }, O = (l) => {
      D() && P(l);
    }, b = (l) => {
      if (D()) {
        f || P(l);
        const { deltaY: v } = o;
        o.move(l), f && v.value >= 0 && o.isVertical() && (Ie(l), I(F(v.value)));
      }
    }, C = () => {
      f && o.deltaY.value && D() && (r.duration = +s.animationDuration, r.status === "loosing" ? (I(+s.headHeight, !0), t("update:modelValue", !0), G(() => t("refresh"))) : I(0));
    };
    return X(
      () => s.modelValue,
      (l) => {
        r.duration = +s.animationDuration, l ? I(+s.headHeight, !0) : c.success || s.successText ? w() : I(0, !1);
      }
    ), De("touchmove", b, {
      target: g
    }), (l, v) => (R(), k("div", {
      ref_key: "root",
      ref: m,
      class: "pull-refresh"
    }, [
      L("div", {
        ref_key: "track",
        ref: g,
        class: "pull-refresh__track",
        style: V(x(y)),
        "on:touchstartPassive": O,
        onTouchend: C,
        onTouchcancel: C
      }, [
        L("div", {
          class: "pull-refresh__head",
          style: V(E())
        }, [
          M(l.$slots, r.status, {}, () => [
            a.includes(r.status) ? (R(), k("div", Oe, le(B()), 1)) : Y("", !0),
            r.status === "loading" ? (R(), k("div", ke)) : Y("", !0)
          ])
        ], 4),
        M(l.$slots, "default")
      ], 36)
    ], 512));
  }
});
var j = 2, Me = class {
  constructor(e, t) {
    S(this, "callUpdate");
    /**
     * 默认
     */
    S(this, "param", {
      keeps: 30,
      extraProps: {},
      estimateSize: 50,
      slotHeaderSize: 10,
      uniqueIds: [],
      buffer: 5
    });
    S(this, "uniqueIds", []);
    // size data
    S(this, "sizes", /* @__PURE__ */ new Map());
    S(this, "firstRangeTotalSize", 0);
    S(this, "firstRangeAverageSize", 0);
    S(this, "lastCalcIndex", 0);
    S(this, "fixedSizeValue", 0);
    S(this, "calcType", "INIT");
    // scroll data
    S(this, "offset", 0);
    S(this, "direction", "");
    // range data
    S(this, "range", /* @__PURE__ */ Object.create(null));
    console.log("init", e), this.init(e, t);
  }
  init(e, t) {
    this.param = Object.assign({}, this.param, e), this.callUpdate = t, this.uniqueIds = this.param.uniqueIds, e && this.checkRange(0, e.keeps - 1);
  }
  setUniqueIds(e = []) {
    this.uniqueIds = e;
  }
  destroy() {
    this.init(null, null);
  }
  /**
   * 当前的节点
   * @returns 
   */
  getRange() {
    const e = /* @__PURE__ */ Object.create(null);
    return this.range && (e.start = this.range.start, e.end = this.range.end, e.padFront = this.range.padFront, e.padBehind = this.range.padBehind), e;
  }
  isBehind() {
    return this.direction === "BEHIND";
  }
  isFront() {
    return this.direction === "FRONT";
  }
  /**
   * 根据start获取结束
   * @param start 
   * @returns 
   */
  getOffset(e) {
    return (e < 1 ? 0 : this.getIndexOffset(e)) + this.param.slotHeaderSize;
  }
  updateParam(e, t) {
    this.param && e in this.param && (e === "uniqueIds" && (this.sizes.forEach((s, n) => {
      t.includes(n) || this.sizes.delete(n);
    }), this.uniqueIds = t), this.param[e] = t);
  }
  /**
   * 保存各项的size
   * @param id 
   * @param size 
   */
  saveSize(e, t) {
    this.sizes.set(e, t), this.calcType === "INIT" ? (this.fixedSizeValue = t, this.calcType = "FIXED") : this.calcType === "FIXED" && this.fixedSizeValue !== t && (this.calcType = "DYNAMIC", delete this.fixedSizeValue), this.calcType !== "FIXED" && typeof this.firstRangeTotalSize < "u" && (this.sizes.size < Math.min(this.param.keeps, this.uniqueIds.length) ? (this.firstRangeTotalSize = [...this.sizes.values()].reduce(
      (s, n) => s + n,
      0
    ), this.firstRangeAverageSize = Math.round(
      this.firstRangeTotalSize / this.sizes.size
    )) : delete this.firstRangeTotalSize);
  }
  /**
   * 数据变化，需要更新指针
   */
  handleDataSourcesChange() {
    let e = this.range.start;
    this.isFront() ? e = e - j : this.isBehind() && (e = e + j), e = Math.max(e, 0), this.updateRange(this.range.start, this.getEndByStart(e));
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
  handleScroll(e) {
    this.direction = e < this.offset ? "FRONT" : "BEHIND", this.offset = e, console.log(this.param), this.param && (console.log(this.direction), this.direction === "FRONT" ? this.handleFront() : this.direction === "BEHIND" && this.handleBehind());
  }
  // ----------- public method end -----------
  handleFront() {
    var s;
    const e = this.getScrollOvers();
    if (console.log("🚀 ~ file: index.ts:225 ~ Virtual ~ handleBehind ~ overs:", e, this.range, (s = this.param) == null ? void 0 : s.buffer), e > this.range.start)
      return;
    const t = Math.max(e - this.param.buffer, 0);
    this.checkRange(t, this.getEndByStart(t));
  }
  handleBehind() {
    var t;
    const e = this.getScrollOvers();
    console.log("🚀 ~ file: index.ts:225 ~ Virtual ~ handleBehind ~ overs:", e, this.range, (t = this.param) == null ? void 0 : t.buffer), !(e < this.range.start + this.param.buffer) && this.checkRange(e, this.getEndByStart(e));
  }
  // 根据当前滚动偏移返回传递
  getScrollOvers() {
    const e = this.offset - this.param.slotHeaderSize;
    if (e <= 0)
      return 0;
    if (this.isFixedType())
      return Math.floor(e / this.fixedSizeValue);
    let t = 0, s = 0, n = 0, a = this.uniqueIds.length;
    for (; t <= a; ) {
      if (s = t + Math.floor((a - t) / 2), n = this.getIndexOffset(s), n === e)
        return s;
      n < e ? t = s + 1 : n > e && (a = s - 1);
    }
    return t > 0 ? --t : 0;
  }
  // 返回给定索引的滚动偏移量，是否可以在这里进一步提高效率？
  // 根据索引获取长度
  getIndexOffset(e) {
    if (!e)
      return 0;
    let t = 0, s = 0;
    for (let n = 0; n < e; n++)
      s = this.sizes.get(this.uniqueIds[n]), t = t + (typeof s == "number" ? s : this.getEstimateSize());
    return this.lastCalcIndex = Math.max(this.lastCalcIndex, e - 1), this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex()), t;
  }
  // 是不是fixed模式
  isFixedType() {
    return this.calcType === "FIXED";
  }
  // 获取真正的最后一个索引
  getLastIndex() {
    return this.uniqueIds.length - 1;
  }
  // 检测指针是否正确
  checkRange(e, t) {
    const s = this.param.keeps, n = this.uniqueIds.length;
    console.log(this.param, s, n, t - e < s - 1), n <= s ? (e = 0, t = this.getLastIndex()) : t - e < s - 1 && (e = t - s + 1), console.log(this.range, e), this.range.start !== e && (console.log("==+++++++++++++================="), this.updateRange(e, t));
  }
  // 更新指针
  updateRange(e, t) {
    this.range && (this.range.start = e, this.range.end = t, this.range.padFront = this.getPadFront(), this.range.padBehind = this.getPadBehind(), this.callUpdate(this.getRange()));
  }
  // 根据start获取end
  getEndByStart(e) {
    const t = e + this.param.keeps - 1;
    return Math.min(t, this.getLastIndex());
  }
  // 获取往前的距离
  getPadFront() {
    return this.isFixedType() ? this.fixedSizeValue * this.range.start : this.getIndexOffset(this.range.start);
  }
  // 获取往后的偏移距离
  getPadBehind() {
    const e = this.range.end, t = this.getLastIndex();
    return console.log("getPadBehind", e, t, this.lastCalcIndex === t, this.getEstimateSize()), this.isFixedType() ? (t - e) * this.fixedSizeValue : this.lastCalcIndex === t ? this.getIndexOffset(t) - this.getIndexOffset(e) : (t - e) * this.getEstimateSize();
  }
  // 获取预计的大小
  getEstimateSize() {
    return this.isFixedType() ? this.fixedSizeValue : this.firstRangeAverageSize || this.param.estimateSize;
  }
};
const W = /* @__PURE__ */ K({
  __name: "SlotWrap",
  props: {
    event: null,
    uniqueKey: null,
    horizontal: { type: Boolean }
  },
  emits: ["slotResize"],
  setup(e, { emit: t }) {
    const s = e, n = p(null);
    return Z(s, n, t), (a, u) => (R(), k("div", {
      key: e.uniqueKey,
      ref_key: "rootRef",
      ref: n
    }, [
      M(a.$slots, "default")
    ]));
  }
}), Ce = /* @__PURE__ */ K({
  __name: "VirtualListItem",
  props: {
    index: null,
    event: null,
    horizontal: { type: Boolean, default: !1 },
    source: null,
    uniqueKey: null,
    extraProps: { default: () => ({}) },
    scopedSlots: { default: () => ({}) },
    component: null
  },
  emits: ["itemResize"],
  setup(e, { emit: t }) {
    const s = e;
    q(() => s.component);
    const n = p(null);
    Z(s, n, t);
    const a = q(() => {
      const {
        component: u,
        extraProps: c = {},
        index: f,
        source: m,
        scopedSlots: g = {},
        uniqueKey: z
      } = s;
      return {
        ...c,
        scopedSlots: g,
        source: m,
        index: f
      };
    });
    return (u, c) => (R(), k("div", {
      ref_key: "rootRef",
      ref: n,
      key: e.uniqueKey
    }, [
      M(u.$slots, "default", re(x(a), { scopedSlots: e.scopedSlots }))
    ]));
  }
});
var H = /* @__PURE__ */ ((e) => (e.ITEM = "itemResize", e.SLOT = "slotResize", e))(H || {}), _ = /* @__PURE__ */ ((e) => (e.HEADER = "thead", e.FOOTER = "tfoot", e))(_ || {});
const be = /* @__PURE__ */ K({
  __name: "VisualList",
  props: {
    dataKey: null,
    dataSources: { default: () => [] },
    keeps: { default: 30 },
    extraProps: null,
    estimateSize: { default: 50 },
    direction: { default: "vertical" },
    start: { default: 0 },
    offset: { default: 0 },
    topThreshold: { default: 0 },
    bottomThreshold: { default: 0 },
    pageMode: { type: Boolean, default: !1 },
    wrapClass: { default: "wrap" },
    wrapStyle: null,
    headClass: null,
    footerClass: null
  },
  emits: ["scroll", "totop", "tobottom"],
  setup(e, { expose: t, emit: s }) {
    const n = e;
    let a;
    const u = n.direction === "horizontal", c = p(null), f = () => {
      const { dataKey: i, dataSources: d = [] } = n;
      return d.map(
        (h) => typeof i == "function" ? i(h) : h[i]
      );
    }, m = (i) => {
      console.log("==============", c), c.value = i;
    }, g = () => {
      a = new Me(
        {
          slotHeaderSize: 0,
          //slotFooterSize: 0,
          keeps: n.keeps,
          estimateSize: n.estimateSize,
          buffer: Math.round(n.keeps / 3),
          // recommend for a third of keeps
          uniqueIds: f(),
          extraProps: {}
        },
        m
      ), c.value = a.getRange();
    };
    X(
      () => n.dataSources.length,
      () => {
        a.updateParam("uniqueIds", f()), a.handleDataSourcesChange();
      }
    );
    const z = q(() => {
      const i = [];
      for (let d = c.value.start; d <= c.value.end; d++) {
        const h = n.dataSources[d];
        if (h) {
          const T = typeof n.dataKey == "function" ? n.dataKey(h) : h[n.dataKey];
          (typeof T == "string" || typeof T == "number") && i.push({
            index: d,
            uniqueKey: T,
            ...h
          });
        }
      }
      return i;
    }), r = (i) => a.sizes.get(i), o = p(), y = u ? "scrollLeft" : "scrollTop", E = () => n.pageMode ? document.documentElement[y] || document.body[y] : o.value ? Math.ceil(o.value[y]) : 0, D = () => {
      const i = u ? "clientWidth" : "clientHeight";
      return n.pageMode ? document.documentElement[i] || document.body[i] : o.value ? Math.ceil(o.value[i]) : 0;
    }, F = () => {
      const i = u ? "scrollWidth" : "scrollHeight";
      return n.pageMode ? document.documentElement[i] || document.body[i] : o.value ? Math.ceil(o.value[i]) : 0;
    }, I = (i, d, h, T) => {
      s("scroll", T, a.getRange()), a.isFront() && n.dataSources.length && i - n.topThreshold <= 0 ? s("totop") : a.isBehind() && i + d + n.bottomThreshold >= h && s("tobottom");
    }, B = (i) => {
      const d = E(), h = D(), T = F();
      d < 0 || d + h > T + 1 || !T || (console.log("scroll ing", d), a.handleScroll(d), I(d, h, T, i));
    };
    ue(() => {
      g();
    }), J(() => {
      O(a.offset);
    }), N(() => {
      n.start ? P(n.start) : n.offset && O(n.offset), n.pageMode && (l(), document.addEventListener("scroll", B, {
        passive: !1
      }));
    }), $(() => {
      a.destroy(), n.pageMode && document.removeEventListener("scroll", B);
    });
    const w = (i, d, h) => {
      i === _.HEADER ? a.updateParam("slotHeaderSize", d) : _.FOOTER, h && a.handleSlotSizeChange();
    }, P = (i) => {
      if (i >= n.dataSources.length - 1)
        C();
      else {
        const d = a.getOffset(i);
        O(d);
      }
    }, O = (i) => {
      n.pageMode ? (document.body[y] = i, document.documentElement[y] = i) : o.value && (o.value[y] = i);
    }, b = p(null), C = () => {
      if (b.value) {
        const i = b.value[u ? "offsetLeft" : "offsetTop"];
        O(i), setTimeout(() => {
          E() + D() < F() && C();
        }, 3);
      }
    }, l = () => {
      if (o.value) {
        const i = o.value.getBoundingClientRect(), { defaultView: d } = o.value.ownerDocument, h = u ? i.left + d.pageXOffset : i.top + d.pageYOffset;
        a.updateParam("slotHeaderSize", h);
      }
    };
    return t({
      scrollToBottom: C,
      getSizes: () => a.sizes.size,
      getSize: r,
      getOffset: E,
      getScrollSize: F,
      getClientSize: D,
      scrollToOffset: O,
      scrollToIndex: P
    }), (i, d) => (R(), k("div", {
      ref_key: "root",
      ref: o,
      onScroll: B
    }, [
      M(i.$slots, "header", {}, () => [
        U(W, {
          class: A(e.headClass),
          event: x(H).SLOT,
          "unique-key": x(_).HEADER,
          onSlotResize: w
        }, null, 8, ["class", "event", "unique-key"])
      ]),
      L("div", {
        class: A(e.wrapClass),
        style: V(e.wrapStyle)
      }, [
        (R(!0), k(ce, null, de(x(z), (h, T) => (R(), he(Ce, {
          index: h.index,
          event: x(H).ITEM,
          horizontal: u,
          "unique-key": h.uniqueKey,
          source: h.dataSource,
          "extra-props": e.extraProps
        }, {
          default: fe(() => [
            M(i.$slots, "default", ge(pe({ source: h })))
          ]),
          _: 2
        }, 1032, ["index", "event", "unique-key", "source", "extra-props"]))), 256))
      ], 6),
      M(i.$slots, "footer", {}, () => [
        U(W, {
          class: A(e.footerClass),
          event: x(H).SLOT,
          "unique-key": x(_).FOOTER,
          onSlotResize: w
        }, null, 8, ["class", "event", "unique-key"])
      ]),
      L("div", {
        ref_key: "shepherd",
        ref: b,
        style: V({
          width: u ? "0px" : "100%",
          height: u ? "100%" : "0px"
        })
      }, null, 4)
    ], 544));
  }
});
export {
  Pe as PullRefresh,
  be as VirsualList
};
