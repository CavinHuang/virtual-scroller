import { ref as d, onMounted as k, onUnmounted as C, onDeactivated as $, isRef as B, watch as N, nextTick as M, onActivated as z, unref as S, defineComponent as I, useSlots as U, reactive as F, computed as G, openBlock as D, createElementBlock as E, createElementVNode as H, normalizeStyle as P, renderSlot as x, toDisplayString as K, createCommentVNode as Y } from "vue";
const j = /scroll|auto|overlay/i, b = window || void 0;
function q(e) {
  return e.tagName !== "HTML" && e.tagName !== "BODY" && e.nodeType === 1;
}
function J(e, n = b) {
  let t = e;
  for (; t && t !== n && q(t); ) {
    const { overflowY: l } = window.getComputedStyle(t);
    if (j.test(l))
      return t;
    t = t.parentNode;
  }
  return n;
}
function Q(e, n = b) {
  const t = d();
  return k(() => {
    e.value && (t.value = J(e.value, n));
  }), t;
}
function Z(e, n) {
  return e > n ? "horizontal" : n > e ? "vertical" : "";
}
function W() {
  const e = d(0), n = d(0), t = d(0), l = d(0), h = d(0), i = d(0), u = d(""), c = () => u.value === "vertical", v = () => u.value === "horizontal", f = () => {
    t.value = 0, l.value = 0, h.value = 0, i.value = 0, u.value = "";
  };
  return {
    move: (a) => {
      const m = a.touches[0];
      t.value = (m.clientX < 0 ? 0 : m.clientX) - e.value, l.value = m.clientY - n.value, h.value = Math.abs(t.value), i.value = Math.abs(l.value);
      const T = 10;
      (!u.value || h.value < T && i.value < T) && (u.value = Z(h.value, i.value));
    },
    start: (a) => {
      f(), e.value = a.touches[0].clientX, n.value = a.touches[0].clientY;
    },
    reset: f,
    startX: e,
    startY: n,
    deltaX: t,
    deltaY: l,
    offsetX: h,
    offsetY: i,
    direction: u,
    isVertical: c,
    isHorizontal: v
  };
}
function ee(e) {
  const n = "scrollTop" in e ? e.scrollTop : e.pageYOffset;
  return Math.max(n, 0);
}
const te = (e) => e.stopPropagation();
function se(e, n) {
  (typeof e.cancelable != "boolean" || e.cancelable) && e.preventDefault(), n && te(e);
}
function oe(e) {
  let n;
  k(() => {
    e(), M(() => {
      n = !0;
    });
  }), z(() => {
    n && e();
  });
}
function ne(e, n, t = {}) {
  if (!window)
    return;
  const { target: l = window, passive: h = !1, capture: i = !1 } = t;
  let u = !1, c;
  const v = (o) => {
    if (u)
      return;
    const a = S(o);
    a && !c && (a.addEventListener(e, n, {
      capture: i,
      passive: h
    }), c = !0);
  }, f = (o) => {
    if (u)
      return;
    const a = S(o);
    a && c && (a.removeEventListener(e, n, i), c = !1);
  };
  C(() => f(l)), $(() => f(l)), oe(() => v(l));
  let p;
  return B(l) && (p = N(l, (o, a) => {
    f(a), v(o);
  })), () => {
    p == null || p(), f(l), u = !0;
  };
}
const ae = {
  key: 0,
  class: "pull-refresh_text"
}, le = {
  key: 1,
  class: "loading"
}, ce = /* @__PURE__ */ I({
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
  setup(e, { emit: n }) {
    const t = e, l = 50, h = ["pulling", "loosing", "success"], i = {
      normal: "",
      loading: "",
      success: "",
      pulling: "下拉即可刷新...",
      loosing: "释放即可刷新..."
    }, u = U();
    let c;
    const v = d(), f = d(), p = Q(v), o = F({
      status: "normal",
      distance: 0,
      duration: 0
    }), a = W(), m = G(() => ({
      transitionDuration: `${o.duration}ms`,
      transform: o.distance ? `translate3d(0,${o.distance}px, 0)` : ""
    })), T = () => {
      if (t.headHeight !== l)
        return {
          height: `${t.headHeight}px`
        };
    }, _ = () => o.status !== "loading" && o.status !== "success" && !t.disabled, L = (s) => {
      const r = +(t.pullDistance || t.headHeight);
      return s > r && (s < r * 2 ? s = r + (s - r) / 2 : s = r * 1.5 + (s - r * 2) / 4), Math.round(s);
    }, g = (s, r) => {
      const A = +(t.pullDistance || t.headHeight);
      o.distance = s, r ? o.status = "loading" : s === 0 ? o.status = "normal" : s < A ? o.status = "pulling" : o.status = "loosing", n("change", {
        status: o.status,
        distance: s
      });
    }, V = () => {
      const { status: s } = o;
      return s === "normal" ? "" : t[`${s}Text`] || i[s];
    }, O = () => {
      o.status = "success", setTimeout(() => {
        g(0);
      }, +t.successDuration);
    }, y = (s) => {
      c = ee(p.value) === 0, c && (o.duration = 0, a.start(s));
    }, R = (s) => {
      _() && y(s);
    }, X = (s) => {
      if (_()) {
        c || y(s);
        const { deltaY: r } = a;
        a.move(s), c && r.value >= 0 && a.isVertical() && (se(s), g(L(r.value)));
      }
    }, w = () => {
      c && a.deltaY.value && _() && (o.duration = +t.animationDuration, o.status === "loosing" ? (g(+t.headHeight, !0), n("update:modelValue", !0), M(() => n("refresh"))) : g(0));
    };
    return N(
      () => t.modelValue,
      (s) => {
        o.duration = +t.animationDuration, s ? g(+t.headHeight, !0) : u.success || t.successText ? O() : g(0, !1);
      }
    ), ne("touchmove", X, {
      target: f
    }), (s, r) => (D(), E("div", {
      ref_key: "root",
      ref: v,
      class: "pull-refresh"
    }, [
      H("div", {
        ref_key: "track",
        ref: f,
        class: "pull-refresh__track",
        style: P(S(m)),
        "on:touchstartPassive": R,
        onTouchend: w,
        onTouchcancel: w
      }, [
        H("div", {
          class: "pull-refresh__head",
          style: P(T())
        }, [
          x(s.$slots, o.status, {}, () => [
            h.includes(o.status) ? (D(), E("div", ae, K(V()), 1)) : Y("", !0),
            o.status === "loading" ? (D(), E("div", le)) : Y("", !0)
          ])
        ], 4),
        x(s.$slots, "default")
      ], 36)
    ], 512));
  }
});
export {
  ce as PullRefresh
};
