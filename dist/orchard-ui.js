/*! For license information please see orchard-ui.js.LICENSE.txt */
const ElementInternalsShim = class {
    get shadowRoot() {
        return this.__host.__shadowRoot;
    }
    constructor(_host){
        this.ariaAtomic = '';
        this.ariaAutoComplete = '';
        this.ariaBrailleLabel = '';
        this.ariaBrailleRoleDescription = '';
        this.ariaBusy = '';
        this.ariaChecked = '';
        this.ariaColCount = '';
        this.ariaColIndex = '';
        this.ariaColSpan = '';
        this.ariaCurrent = '';
        this.ariaDescription = '';
        this.ariaDisabled = '';
        this.ariaExpanded = '';
        this.ariaHasPopup = '';
        this.ariaHidden = '';
        this.ariaInvalid = '';
        this.ariaKeyShortcuts = '';
        this.ariaLabel = '';
        this.ariaLevel = '';
        this.ariaLive = '';
        this.ariaModal = '';
        this.ariaMultiLine = '';
        this.ariaMultiSelectable = '';
        this.ariaOrientation = '';
        this.ariaPlaceholder = '';
        this.ariaPosInSet = '';
        this.ariaPressed = '';
        this.ariaReadOnly = '';
        this.ariaRequired = '';
        this.ariaRoleDescription = '';
        this.ariaRowCount = '';
        this.ariaRowIndex = '';
        this.ariaRowSpan = '';
        this.ariaSelected = '';
        this.ariaSetSize = '';
        this.ariaSort = '';
        this.ariaValueMax = '';
        this.ariaValueMin = '';
        this.ariaValueNow = '';
        this.ariaValueText = '';
        this.role = '';
        this.form = null;
        this.labels = [];
        this.states = new Set();
        this.validationMessage = '';
        this.validity = {};
        this.willValidate = true;
        this.__host = _host;
    }
    checkValidity() {
        console.warn("`ElementInternals.checkValidity()` was called on the server.This method always returns true.");
        return true;
    }
    reportValidity() {
        return true;
    }
    setFormValue() {}
    setValidity() {}
};
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
    if ("m" === kind) throw new TypeError("Private method is not writable");
    if ("a" === kind && !f) throw new TypeError("Private accessor was defined without a setter");
    if ("function" == typeof state ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return "a" === kind ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
    if ("a" === kind && !f) throw new TypeError("Private accessor was defined without a getter");
    if ("function" == typeof state ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return "m" === kind ? f : "a" === kind ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Event_cancelable, _Event_bubbles, _Event_composed, _Event_defaultPrevented, _Event_timestamp, _Event_propagationStopped, _Event_type, _Event_target, _Event_isBeingDispatched, _a, _CustomEvent_detail, _b;
const isCaptureEventListener = (options)=>'boolean' == typeof options ? options : options?.capture ?? false;
const NONE = 0;
const CAPTURING_PHASE = 1;
const AT_TARGET = 2;
const BUBBLING_PHASE = 3;
const EventTargetShim = class {
    constructor(){
        this.__eventListeners = new Map();
        this.__captureEventListeners = new Map();
    }
    addEventListener(type, callback, options) {
        if (null == callback) return;
        const eventListenersMap = isCaptureEventListener(options) ? this.__captureEventListeners : this.__eventListeners;
        let eventListeners = eventListenersMap.get(type);
        if (void 0 === eventListeners) {
            eventListeners = new Map();
            eventListenersMap.set(type, eventListeners);
        } else if (eventListeners.has(callback)) return;
        const normalizedOptions = 'object' == typeof options && options ? options : {};
        normalizedOptions.signal?.addEventListener('abort', ()=>this.removeEventListener(type, callback, options));
        eventListeners.set(callback, normalizedOptions ?? {});
    }
    removeEventListener(type, callback, options) {
        if (null == callback) return;
        const eventListenersMap = isCaptureEventListener(options) ? this.__captureEventListeners : this.__eventListeners;
        const eventListeners = eventListenersMap.get(type);
        if (void 0 !== eventListeners) {
            eventListeners.delete(callback);
            if (!eventListeners.size) eventListenersMap.delete(type);
        }
    }
    dispatchEvent(event) {
        const composedPath = [
            this
        ];
        let parent = this.__eventTargetParent;
        if (event.composed) while(parent){
            composedPath.push(parent);
            parent = parent.__eventTargetParent;
        }
        else while(parent && parent !== this.__host){
            composedPath.push(parent);
            parent = parent.__eventTargetParent;
        }
        let stopPropagation = false;
        let stopImmediatePropagation = false;
        let eventPhase = NONE;
        let target = null;
        let tmpTarget = null;
        let currentTarget = null;
        const originalStopPropagation = event.stopPropagation;
        const originalStopImmediatePropagation = event.stopImmediatePropagation;
        Object.defineProperties(event, {
            target: {
                get () {
                    return target ?? tmpTarget;
                },
                ...enumerableProperty
            },
            srcElement: {
                get () {
                    return event.target;
                },
                ...enumerableProperty
            },
            currentTarget: {
                get () {
                    return currentTarget;
                },
                ...enumerableProperty
            },
            eventPhase: {
                get () {
                    return eventPhase;
                },
                ...enumerableProperty
            },
            composedPath: {
                value: ()=>composedPath,
                ...enumerableProperty
            },
            stopPropagation: {
                value: ()=>{
                    stopPropagation = true;
                    originalStopPropagation.call(event);
                },
                ...enumerableProperty
            },
            stopImmediatePropagation: {
                value: ()=>{
                    stopImmediatePropagation = true;
                    originalStopImmediatePropagation.call(event);
                },
                ...enumerableProperty
            }
        });
        const invokeEventListener = (listener, options, eventListenerMap)=>{
            if ('function' == typeof listener) listener(event);
            else if ('function' == typeof listener?.handleEvent) listener.handleEvent(event);
            if (options.once) eventListenerMap.delete(listener);
        };
        const finishDispatch = ()=>{
            currentTarget = null;
            eventPhase = NONE;
            return !event.defaultPrevented;
        };
        const captureEventPath = composedPath.slice().reverse();
        target = this.__host && event.composed ? null : this;
        const retarget = (eventTargets)=>{
            tmpTarget = this;
            while(tmpTarget.__host && eventTargets.includes(tmpTarget.__host))tmpTarget = tmpTarget.__host;
        };
        for (const eventTarget of captureEventPath){
            if (!target && (!tmpTarget || tmpTarget === eventTarget.__host)) retarget(captureEventPath.slice(captureEventPath.indexOf(eventTarget)));
            currentTarget = eventTarget;
            eventPhase = eventTarget === event.target ? AT_TARGET : CAPTURING_PHASE;
            const captureEventListeners = eventTarget.__captureEventListeners.get(event.type);
            if (captureEventListeners) for (const [listener, options] of captureEventListeners){
                invokeEventListener(listener, options, captureEventListeners);
                if (stopImmediatePropagation) return finishDispatch();
            }
            if (stopPropagation) return finishDispatch();
        }
        const bubbleEventPath = event.bubbles ? composedPath : [
            this
        ];
        tmpTarget = null;
        for (const eventTarget of bubbleEventPath){
            if (!target && (!tmpTarget || eventTarget === tmpTarget.__host)) retarget(bubbleEventPath.slice(0, bubbleEventPath.indexOf(eventTarget) + 1));
            currentTarget = eventTarget;
            eventPhase = eventTarget === event.target ? AT_TARGET : BUBBLING_PHASE;
            const captureEventListeners = eventTarget.__eventListeners.get(event.type);
            if (captureEventListeners) for (const [listener, options] of captureEventListeners){
                invokeEventListener(listener, options, captureEventListeners);
                if (stopImmediatePropagation) return finishDispatch();
            }
            if (stopPropagation) break;
        }
        return finishDispatch();
    }
};
const EventTargetShimWithRealType = EventTargetShim;
const enumerableProperty = {
    __proto__: null
};
enumerableProperty.enumerable = true;
Object.freeze(enumerableProperty);
const EventShim = (_a = class {
    constructor(type, options = {}){
        _Event_cancelable.set(this, false);
        _Event_bubbles.set(this, false);
        _Event_composed.set(this, false);
        _Event_defaultPrevented.set(this, false);
        _Event_timestamp.set(this, Date.now());
        _Event_propagationStopped.set(this, false);
        _Event_type.set(this, void 0);
        _Event_target.set(this, void 0);
        _Event_isBeingDispatched.set(this, void 0);
        this.NONE = NONE;
        this.CAPTURING_PHASE = CAPTURING_PHASE;
        this.AT_TARGET = AT_TARGET;
        this.BUBBLING_PHASE = BUBBLING_PHASE;
        if (0 === arguments.length) throw new Error("The type argument must be specified");
        if ('object' != typeof options || !options) throw new Error('The "options" argument must be an object');
        const { bubbles, cancelable, composed } = options;
        __classPrivateFieldSet(this, _Event_cancelable, !!cancelable, "f");
        __classPrivateFieldSet(this, _Event_bubbles, !!bubbles, "f");
        __classPrivateFieldSet(this, _Event_composed, !!composed, "f");
        __classPrivateFieldSet(this, _Event_type, `${type}`, "f");
        __classPrivateFieldSet(this, _Event_target, null, "f");
        __classPrivateFieldSet(this, _Event_isBeingDispatched, false, "f");
    }
    initEvent(_type, _bubbles, _cancelable) {
        throw new Error('Method not implemented.');
    }
    stopImmediatePropagation() {
        this.stopPropagation();
    }
    preventDefault() {
        __classPrivateFieldSet(this, _Event_defaultPrevented, true, "f");
    }
    get target() {
        return __classPrivateFieldGet(this, _Event_target, "f");
    }
    get currentTarget() {
        return __classPrivateFieldGet(this, _Event_target, "f");
    }
    get srcElement() {
        return __classPrivateFieldGet(this, _Event_target, "f");
    }
    get type() {
        return __classPrivateFieldGet(this, _Event_type, "f");
    }
    get cancelable() {
        return __classPrivateFieldGet(this, _Event_cancelable, "f");
    }
    get defaultPrevented() {
        return __classPrivateFieldGet(this, _Event_cancelable, "f") && __classPrivateFieldGet(this, _Event_defaultPrevented, "f");
    }
    get timeStamp() {
        return __classPrivateFieldGet(this, _Event_timestamp, "f");
    }
    composedPath() {
        return __classPrivateFieldGet(this, _Event_isBeingDispatched, "f") ? [
            __classPrivateFieldGet(this, _Event_target, "f")
        ] : [];
    }
    get returnValue() {
        return !__classPrivateFieldGet(this, _Event_cancelable, "f") || !__classPrivateFieldGet(this, _Event_defaultPrevented, "f");
    }
    get bubbles() {
        return __classPrivateFieldGet(this, _Event_bubbles, "f");
    }
    get composed() {
        return __classPrivateFieldGet(this, _Event_composed, "f");
    }
    get eventPhase() {
        return __classPrivateFieldGet(this, _Event_isBeingDispatched, "f") ? _a.AT_TARGET : _a.NONE;
    }
    get cancelBubble() {
        return __classPrivateFieldGet(this, _Event_propagationStopped, "f");
    }
    set cancelBubble(value) {
        if (value) __classPrivateFieldSet(this, _Event_propagationStopped, true, "f");
    }
    stopPropagation() {
        __classPrivateFieldSet(this, _Event_propagationStopped, true, "f");
    }
    get isTrusted() {
        return false;
    }
}, _Event_cancelable = new WeakMap(), _Event_bubbles = new WeakMap(), _Event_composed = new WeakMap(), _Event_defaultPrevented = new WeakMap(), _Event_timestamp = new WeakMap(), _Event_propagationStopped = new WeakMap(), _Event_type = new WeakMap(), _Event_target = new WeakMap(), _Event_isBeingDispatched = new WeakMap(), _a.NONE = NONE, _a.CAPTURING_PHASE = CAPTURING_PHASE, _a.AT_TARGET = AT_TARGET, _a.BUBBLING_PHASE = BUBBLING_PHASE, _a);
Object.defineProperties(EventShim.prototype, {
    initEvent: enumerableProperty,
    stopImmediatePropagation: enumerableProperty,
    preventDefault: enumerableProperty,
    target: enumerableProperty,
    currentTarget: enumerableProperty,
    srcElement: enumerableProperty,
    type: enumerableProperty,
    cancelable: enumerableProperty,
    defaultPrevented: enumerableProperty,
    timeStamp: enumerableProperty,
    composedPath: enumerableProperty,
    returnValue: enumerableProperty,
    bubbles: enumerableProperty,
    composed: enumerableProperty,
    eventPhase: enumerableProperty,
    cancelBubble: enumerableProperty,
    stopPropagation: enumerableProperty,
    isTrusted: enumerableProperty
});
const CustomEventShim = (_b = class extends EventShim {
    constructor(type, options = {}){
        super(type, options);
        _CustomEvent_detail.set(this, void 0);
        __classPrivateFieldSet(this, _CustomEvent_detail, options?.detail ?? null, "f");
    }
    initCustomEvent(_type, _bubbles, _cancelable, _detail) {
        throw new Error('Method not implemented.');
    }
    get detail() {
        return __classPrivateFieldGet(this, _CustomEvent_detail, "f");
    }
}, _CustomEvent_detail = new WeakMap(), _b);
Object.defineProperties(CustomEventShim.prototype, {
    detail: enumerableProperty
});
const EventShimWithRealType = EventShim;
const CustomEventShimWithRealType = CustomEventShim;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ globalThis.Event ??= EventShimWithRealType;
globalThis.CustomEvent ??= CustomEventShimWithRealType;
const attributes = new WeakMap();
const attributesForElement = (element)=>{
    let attrs = attributes.get(element);
    if (void 0 === attrs) attributes.set(element, attrs = new Map());
    return attrs;
};
const ElementShim = class extends EventTargetShimWithRealType {
    constructor(){
        super(...arguments);
        this.__shadowRootMode = null;
        this.__shadowRoot = null;
        this.__internals = null;
    }
    get attributes() {
        return Array.from(attributesForElement(this)).map(([name, value])=>({
                name,
                value
            }));
    }
    get shadowRoot() {
        if ('closed' === this.__shadowRootMode) return null;
        return this.__shadowRoot;
    }
    get localName() {
        return this.constructor.__localName;
    }
    get tagName() {
        return this.localName?.toUpperCase();
    }
    setAttribute(name, value) {
        attributesForElement(this).set(name, String(value));
    }
    removeAttribute(name) {
        attributesForElement(this).delete(name);
    }
    toggleAttribute(name, force) {
        if (this.hasAttribute(name)) {
            if (void 0 === force || !force) {
                this.removeAttribute(name);
                return false;
            }
        } else {
            if (void 0 !== force && !force) return false;
            this.setAttribute(name, '');
        }
        return true;
    }
    hasAttribute(name) {
        return attributesForElement(this).has(name);
    }
    attachShadow(init) {
        const shadowRoot = {
            host: this
        };
        this.__shadowRootMode = init.mode;
        if (init && 'open' === init.mode) this.__shadowRoot = shadowRoot;
        return shadowRoot;
    }
    attachInternals() {
        if (null !== this.__internals) throw new Error("Failed to execute 'attachInternals' on 'HTMLElement': ElementInternals for the specified element was already attached.");
        const internals = new ElementInternalsShim(this);
        this.__internals = internals;
        return internals;
    }
    getAttribute(name) {
        const value = attributesForElement(this).get(name);
        return value ?? null;
    }
};
const HTMLElementShim = class extends ElementShim {
};
const HTMLElementShimWithRealType = HTMLElementShim;
globalThis.litServerRoot ??= Object.defineProperty(new HTMLElementShimWithRealType(), 'localName', {
    get () {
        return 'lit-server-root';
    }
});
const CustomElementRegistryShim = class {
    constructor(){
        this.__definitions = new Map();
    }
    define(name, ctor) {
        if (this.__definitions.has(name)) {
            if ('development' === process.env.NODE_ENV) console.warn(`'CustomElementRegistry' already has "${name}" defined. This may have been caused by live reload or hot module replacement in which case it can be safely ignored.\nMake sure to test your application with a production build as repeat registrations will throw in production.`);
            else throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': the name "${name}" has already been used with this registry`);
        }
        ctor.__localName = name;
        this.__definitions.set(name, {
            ctor,
            observedAttributes: ctor.observedAttributes ?? []
        });
    }
    get(name) {
        const definition = this.__definitions.get(name);
        return definition?.ctor;
    }
};
const CustomElementRegistryShimWithRealType = CustomElementRegistryShim;
const ssr_dom_shim_customElements = new CustomElementRegistryShimWithRealType();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const css_tag_t = globalThis, css_tag_e = css_tag_t.ShadowRoot && (void 0 === css_tag_t.ShadyCSS || css_tag_t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, css_tag_s = Symbol(), css_tag_o = new WeakMap;
class css_tag_n {
    constructor(t, e, o){
        if (this._$cssResult$ = !0, o !== css_tag_s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t, this.t = e;
    }
    get styleSheet() {
        let t = this.o;
        const s = this.t;
        if (css_tag_e && void 0 === t) {
            const e = void 0 !== s && 1 === s.length;
            e && (t = css_tag_o.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet).replaceSync(this.cssText), e && css_tag_o.set(s, t));
        }
        return t;
    }
    toString() {
        return this.cssText;
    }
}
const css_tag_r = (t)=>new css_tag_n("string" == typeof t ? t : t + "", void 0, css_tag_s), S = (s, o)=>{
    if (css_tag_e) s.adoptedStyleSheets = o.map((t)=>t instanceof CSSStyleSheet ? t : t.styleSheet);
    else for (const e of o){
        const o = document.createElement("style"), n = css_tag_t.litNonce;
        void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
    }
}, css_tag_c = css_tag_e || void 0 === css_tag_t.CSSStyleSheet ? (t)=>t : (t)=>t instanceof CSSStyleSheet ? ((t)=>{
        let e = "";
        for (const s of t.cssRules)e += s.cssText;
        return css_tag_r(e);
    })(t) : t;
const { is: reactive_element_r, defineProperty: reactive_element_h, getOwnPropertyDescriptor: reactive_element_o, getOwnPropertyNames: reactive_element_n, getOwnPropertySymbols: reactive_element_a, getPrototypeOf: reactive_element_c } = Object, reactive_element_l = globalThis;
reactive_element_l.customElements ??= ssr_dom_shim_customElements;
const p = reactive_element_l.trustedTypes, reactive_element_d = p ? p.emptyScript : "", reactive_element_u = reactive_element_l.reactiveElementPolyfillSupport, reactive_element_f = (t, s)=>t, b = {
    toAttribute (t, s) {
        switch(s){
            case Boolean:
                t = t ? reactive_element_d : null;
                break;
            case Object:
            case Array:
                t = null == t ? t : JSON.stringify(t);
        }
        return t;
    },
    fromAttribute (t, s) {
        let i = t;
        switch(s){
            case Boolean:
                i = null !== t;
                break;
            case Number:
                i = null === t ? null : Number(t);
                break;
            case Object:
            case Array:
                try {
                    i = JSON.parse(t);
                } catch (t) {
                    i = null;
                }
        }
        return i;
    }
}, reactive_element_y = (t, s)=>!reactive_element_r(t, s), m = {
    attribute: !0,
    type: String,
    converter: b,
    reflect: !1,
    hasChanged: reactive_element_y
};
Symbol.metadata ??= Symbol("metadata"), reactive_element_l.litPropertyMetadata ??= new WeakMap;
class g extends (globalThis.HTMLElement ?? HTMLElementShimWithRealType) {
    static addInitializer(t) {
        this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
        return this.finalize(), this._$Eh && [
            ...this._$Eh.keys()
        ];
    }
    static createProperty(t, s = m) {
        if (s.state && (s.attribute = !1), this._$Ei(), this.elementProperties.set(t, s), !s.noAccessor) {
            const i = Symbol(), e = this.getPropertyDescriptor(t, i, s);
            void 0 !== e && reactive_element_h(this.prototype, t, e);
        }
    }
    static getPropertyDescriptor(t, s, i) {
        const { get: e, set: r } = reactive_element_o(this.prototype, t) ?? {
            get () {
                return this[s];
            },
            set (t) {
                this[s] = t;
            }
        };
        return {
            get () {
                return e?.call(this);
            },
            set (s) {
                const h = e?.call(this);
                r.call(this, s), this.requestUpdate(t, h, i);
            },
            configurable: !0,
            enumerable: !0
        };
    }
    static getPropertyOptions(t) {
        return this.elementProperties.get(t) ?? m;
    }
    static _$Ei() {
        if (this.hasOwnProperty(reactive_element_f("elementProperties"))) return;
        const t = reactive_element_c(this);
        t.finalize(), void 0 !== t.l && (this.l = [
            ...t.l
        ]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
        if (this.hasOwnProperty(reactive_element_f("finalized"))) return;
        if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(reactive_element_f("properties"))) {
            const t = this.properties, s = [
                ...reactive_element_n(t),
                ...reactive_element_a(t)
            ];
            for (const i of s)this.createProperty(i, t[i]);
        }
        const t = this[Symbol.metadata];
        if (null !== t) {
            const s = litPropertyMetadata.get(t);
            if (void 0 !== s) for (const [t, i] of s)this.elementProperties.set(t, i);
        }
        this._$Eh = new Map;
        for (const [t, s] of this.elementProperties){
            const i = this._$Eu(t, s);
            void 0 !== i && this._$Eh.set(i, t);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(t) {
        const s = [];
        if (Array.isArray(t)) {
            const e = new Set(t.flat(1 / 0).reverse());
            for (const t of e)s.unshift(css_tag_c(t));
        } else void 0 !== t && s.push(css_tag_c(t));
        return s;
    }
    static _$Eu(t, s) {
        const i = s.attribute;
        return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
    }
    constructor(){
        super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
    }
    _$Ev() {
        this._$ES = new Promise((t)=>this.enableUpdating = t), this._$AL = new Map, this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t)=>t(this));
    }
    addController(t) {
        (this._$EO ??= new Set).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
    }
    removeController(t) {
        this._$EO?.delete(t);
    }
    _$E_() {
        const t = new Map, s = this.constructor.elementProperties;
        for (const i of s.keys())this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
        t.size > 0 && (this._$Ep = t);
    }
    createRenderRoot() {
        const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return S(t, this.constructor.elementStyles), t;
    }
    connectedCallback() {
        this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t)=>t.hostConnected?.());
    }
    enableUpdating(t) {}
    disconnectedCallback() {
        this._$EO?.forEach((t)=>t.hostDisconnected?.());
    }
    attributeChangedCallback(t, s, i) {
        this._$AK(t, i);
    }
    _$EC(t, s) {
        const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
        if (void 0 !== e && !0 === i.reflect) {
            const r = (void 0 !== i.converter?.toAttribute ? i.converter : b).toAttribute(s, i.type);
            this._$Em = t, null == r ? this.removeAttribute(e) : this.setAttribute(e, r), this._$Em = null;
        }
    }
    _$AK(t, s) {
        const i = this.constructor, e = i._$Eh.get(t);
        if (void 0 !== e && this._$Em !== e) {
            const t = i.getPropertyOptions(e), r = "function" == typeof t.converter ? {
                fromAttribute: t.converter
            } : void 0 !== t.converter?.fromAttribute ? t.converter : b;
            this._$Em = e, this[e] = r.fromAttribute(s, t.type), this._$Em = null;
        }
    }
    requestUpdate(t, s, i) {
        if (void 0 !== t) {
            if (i ??= this.constructor.getPropertyOptions(t), !(i.hasChanged ?? reactive_element_y)(this[t], s)) return;
            this.P(t, s, i);
        }
        !1 === this.isUpdatePending && (this._$ES = this._$ET());
    }
    P(t, s, i) {
        this._$AL.has(t) || this._$AL.set(t, s), !0 === i.reflect && this._$Em !== t && (this._$Ej ??= new Set).add(t);
    }
    async _$ET() {
        this.isUpdatePending = !0;
        try {
            await this._$ES;
        } catch (t) {
            Promise.reject(t);
        }
        const t = this.scheduleUpdate();
        return null != t && await t, !this.isUpdatePending;
    }
    scheduleUpdate() {
        return this.performUpdate();
    }
    performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
            if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
                for (const [t, s] of this._$Ep)this[t] = s;
                this._$Ep = void 0;
            }
            const t = this.constructor.elementProperties;
            if (t.size > 0) for (const [s, i] of t)!0 !== i.wrapped || this._$AL.has(s) || void 0 === this[s] || this.P(s, this[s], i);
        }
        let t = !1;
        const s = this._$AL;
        try {
            t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((t)=>t.hostUpdate?.()), this.update(s)) : this._$EU();
        } catch (s) {
            throw t = !1, this._$EU(), s;
        }
        t && this._$AE(s);
    }
    willUpdate(t) {}
    _$AE(t) {
        this._$EO?.forEach((t)=>t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
    }
    _$EU() {
        this._$AL = new Map, this.isUpdatePending = !1;
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this._$ES;
    }
    shouldUpdate(t) {
        return !0;
    }
    update(t) {
        this._$Ej &&= this._$Ej.forEach((t)=>this._$EC(t, this[t])), this._$EU();
    }
    updated(t) {}
    firstUpdated(t) {}
}
g.elementStyles = [], g.shadowRootOptions = {
    mode: "open"
}, g[reactive_element_f("elementProperties")] = new Map, g[reactive_element_f("finalized")] = new Map, reactive_element_u?.({
    ReactiveElement: g
}), (reactive_element_l.reactiveElementVersions ??= []).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const lit_html_t = globalThis, lit_html_i = lit_html_t.trustedTypes, lit_html_s = lit_html_i ? lit_html_i.createPolicy("lit-html", {
    createHTML: (t)=>t
}) : void 0, lit_html_e = "$lit$", lit_html_h = `lit$${Math.random().toFixed(9).slice(2)}$`, lit_html_o = "?" + lit_html_h, lit_html_n = `<${lit_html_o}>`, lit_html_r = void 0 === lit_html_t.document ? {
    createTreeWalker: ()=>({})
} : document, lit_html_l = ()=>lit_html_r.createComment(""), lit_html_c = (t)=>null === t || "object" != typeof t && "function" != typeof t, lit_html_a = Array.isArray, lit_html_u = (t)=>lit_html_a(t) || "function" == typeof t?.[Symbol.iterator], lit_html_d = "[ \t\n\f\r]", lit_html_f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, lit_html_v = /-->/g, _ = />/g, lit_html_m = RegExp(`>|${lit_html_d}(?:([^\\s"'>=/]+)(${lit_html_d}*=${lit_html_d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), lit_html_p = /'/g, lit_html_g = /"/g, $ = /^(?:script|style|textarea|title)$/i, lit_html_y = (t)=>(i, ...s)=>({
            _$litType$: t,
            strings: i,
            values: s
        }), w = (lit_html_y(1), lit_html_y(2), lit_html_y(3), Symbol.for("lit-noChange")), E = Symbol.for("lit-nothing"), A = new WeakMap, C = lit_html_r.createTreeWalker(lit_html_r, 129);
function P(t, i) {
    if (!lit_html_a(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== lit_html_s ? lit_html_s.createHTML(i) : i;
}
const V = (t, i)=>{
    const s = t.length - 1, o = [];
    let r, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = lit_html_f;
    for(let i = 0; i < s; i++){
        const s = t[i];
        let a, u, d = -1, y = 0;
        for(; y < s.length && (c.lastIndex = y, u = c.exec(s), null !== u);)y = c.lastIndex, c === lit_html_f ? "!--" === u[1] ? c = lit_html_v : void 0 !== u[1] ? c = _ : void 0 !== u[2] ? ($.test(u[2]) && (r = RegExp("</" + u[2], "g")), c = lit_html_m) : void 0 !== u[3] && (c = lit_html_m) : c === lit_html_m ? ">" === u[0] ? (c = r ?? lit_html_f, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? lit_html_m : '"' === u[3] ? lit_html_g : lit_html_p) : c === lit_html_g || c === lit_html_p ? c = lit_html_m : c === lit_html_v || c === _ ? c = lit_html_f : (c = lit_html_m, r = void 0);
        const x = c === lit_html_m && t[i + 1].startsWith("/>") ? " " : "";
        l += c === lit_html_f ? s + lit_html_n : d >= 0 ? (o.push(a), s.slice(0, d) + lit_html_e + s.slice(d) + lit_html_h + x) : s + lit_html_h + (-2 === d ? i : x);
    }
    return [
        P(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")),
        o
    ];
};
class N {
    constructor({ strings: t, _$litType$: s }, n){
        let r;
        this.parts = [];
        let c = 0, a = 0;
        const u = t.length - 1, d = this.parts, [f, v] = V(t, s);
        if (this.el = N.createElement(f, n), C.currentNode = this.el.content, 2 === s || 3 === s) {
            const t = this.el.content.firstChild;
            t.replaceWith(...t.childNodes);
        }
        for(; null !== (r = C.nextNode()) && d.length < u;){
            if (1 === r.nodeType) {
                if (r.hasAttributes()) for (const t of r.getAttributeNames())if (t.endsWith(lit_html_e)) {
                    const i = v[a++], s = r.getAttribute(t).split(lit_html_h), e = /([.?@])?(.*)/.exec(i);
                    d.push({
                        type: 1,
                        index: c,
                        name: e[2],
                        strings: s,
                        ctor: "." === e[1] ? H : "?" === e[1] ? I : "@" === e[1] ? L : R
                    }), r.removeAttribute(t);
                } else t.startsWith(lit_html_h) && (d.push({
                    type: 6,
                    index: c
                }), r.removeAttribute(t));
                if ($.test(r.tagName)) {
                    const t = r.textContent.split(lit_html_h), s = t.length - 1;
                    if (s > 0) {
                        r.textContent = lit_html_i ? lit_html_i.emptyScript : "";
                        for(let i = 0; i < s; i++)r.append(t[i], lit_html_l()), C.nextNode(), d.push({
                            type: 2,
                            index: ++c
                        });
                        r.append(t[s], lit_html_l());
                    }
                }
            } else if (8 === r.nodeType) {
                if (r.data === lit_html_o) d.push({
                    type: 2,
                    index: c
                });
                else {
                    let t = -1;
                    for(; -1 !== (t = r.data.indexOf(lit_html_h, t + 1));)d.push({
                        type: 7,
                        index: c
                    }), t += lit_html_h.length - 1;
                }
            }
            c++;
        }
    }
    static createElement(t, i) {
        const s = lit_html_r.createElement("template");
        return s.innerHTML = t, s;
    }
}
function lit_html_S(t, i, s = t, e) {
    if (i === w) return i;
    let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
    const o = lit_html_c(i) ? void 0 : i._$litDirective$;
    return h?.constructor !== o && (h?._$AO?.(!1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = lit_html_S(t, h._$AS(t, i.values), h, e)), i;
}
class M {
    constructor(t, i){
        this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
    }
    get parentNode() {
        return this._$AM.parentNode;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    u(t) {
        const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? lit_html_r).importNode(i, !0);
        C.currentNode = e;
        let h = C.nextNode(), o = 0, n = 0, l = s[0];
        for(; void 0 !== l;){
            if (o === l.index) {
                let i;
                2 === l.type ? i = new k(h, h.nextSibling, this, t) : 1 === l.type ? i = new l.ctor(h, l.name, l.strings, this, t) : 6 === l.type && (i = new z(h, this, t)), this._$AV.push(i), l = s[++n];
            }
            o !== l?.index && (h = C.nextNode(), o++);
        }
        return C.currentNode = lit_html_r, e;
    }
    p(t) {
        let i = 0;
        for (const s of this._$AV)void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
    }
}
class k {
    get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, i, s, e){
        this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? !0;
    }
    get parentNode() {
        let t = this._$AA.parentNode;
        const i = this._$AM;
        return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
    }
    get startNode() {
        return this._$AA;
    }
    get endNode() {
        return this._$AB;
    }
    _$AI(t, i = this) {
        t = lit_html_S(this, t, i), lit_html_c(t) ? t === E || null == t || "" === t ? (this._$AH !== E && this._$AR(), this._$AH = E) : t !== this._$AH && t !== w && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : lit_html_u(t) ? this.k(t) : this._(t);
    }
    O(t) {
        return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
        this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
    }
    _(t) {
        this._$AH !== E && lit_html_c(this._$AH) ? this._$AA.nextSibling.data = t : this.T(lit_html_r.createTextNode(t)), this._$AH = t;
    }
    $(t) {
        const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = N.createElement(P(s.h, s.h[0]), this.options)), s);
        if (this._$AH?._$AD === e) this._$AH.p(i);
        else {
            const t = new M(e, this), s = t.u(this.options);
            t.p(i), this.T(s), this._$AH = t;
        }
    }
    _$AC(t) {
        let i = A.get(t.strings);
        return void 0 === i && A.set(t.strings, i = new N(t)), i;
    }
    k(t) {
        lit_html_a(this._$AH) || (this._$AH = [], this._$AR());
        const i = this._$AH;
        let s, e = 0;
        for (const h of t)e === i.length ? i.push(s = new k(this.O(lit_html_l()), this.O(lit_html_l()), this, this.options)) : s = i[e], s._$AI(h), e++;
        e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
    }
    _$AR(t = this._$AA.nextSibling, i) {
        for(this._$AP?.(!1, !0, i); t && t !== this._$AB;){
            const i = t.nextSibling;
            t.remove(), t = i;
        }
    }
    setConnected(t) {
        void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
    }
}
class R {
    get tagName() {
        return this.element.tagName;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    constructor(t, i, s, e, h){
        this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String), this.strings = s) : this._$AH = E;
    }
    _$AI(t, i = this, s, e) {
        const h = this.strings;
        let o = !1;
        if (void 0 === h) t = lit_html_S(this, t, i, 0), o = !lit_html_c(t) || t !== this._$AH && t !== w, o && (this._$AH = t);
        else {
            const e = t;
            let n, r;
            for(t = h[0], n = 0; n < h.length - 1; n++)r = lit_html_S(this, e[s + n], i, n), r === w && (r = this._$AH[n]), o ||= !lit_html_c(r) || r !== this._$AH[n], r === E ? t = E : t !== E && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
        }
        o && !e && this.j(t);
    }
    j(t) {
        t === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
    }
}
class H extends R {
    constructor(){
        super(...arguments), this.type = 3;
    }
    j(t) {
        this.element[this.name] = t === E ? void 0 : t;
    }
}
class I extends R {
    constructor(){
        super(...arguments), this.type = 4;
    }
    j(t) {
        this.element.toggleAttribute(this.name, !!t && t !== E);
    }
}
class L extends R {
    constructor(t, i, s, e, h){
        super(t, i, s, e, h), this.type = 5;
    }
    _$AI(t, i = this) {
        if ((t = lit_html_S(this, t, i, 0) ?? E) === w) return;
        const s = this._$AH, e = t === E && s !== E || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== E && (s === E || e);
        e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
        "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
}
class z {
    constructor(t, i, s){
        this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t) {
        lit_html_S(this, t);
    }
}
const Z = lit_html_t.litHtmlPolyfillSupport;
Z?.(N, k), (lit_html_t.litHtmlVersions ??= []).push("3.2.1");
const j = (t, i, s)=>{
    const e = s?.renderBefore ?? i;
    let h = e._$litPart$;
    if (void 0 === h) {
        const t = s?.renderBefore ?? null;
        e._$litPart$ = h = new k(i.insertBefore(lit_html_l(), t), t, void 0, s ?? {});
    }
    return h._$AI(t), h;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class lit_element_r extends g {
    constructor(){
        super(...arguments), this.renderOptions = {
            host: this
        }, this._$Do = void 0;
    }
    createRenderRoot() {
        const t = super.createRenderRoot();
        return this.renderOptions.renderBefore ??= t.firstChild, t;
    }
    update(t) {
        const s = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = j(s, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
        super.connectedCallback(), this._$Do?.setConnected(!0);
    }
    disconnectedCallback() {
        super.disconnectedCallback(), this._$Do?.setConnected(!1);
    }
    render() {
        return w;
    }
}
lit_element_r._$litElement$ = !0, lit_element_r["finalized"] = !0, globalThis.litElementHydrateSupport?.({
    LitElement: lit_element_r
});
const lit_element_i = globalThis.litElementPolyfillSupport;
lit_element_i?.({
    LitElement: lit_element_r
});
(globalThis.litElementVersions ??= []).push("4.1.1");
var package_namespaceObject = {
    u2: "orchard-ui"
};
const NAME = 'Orchard UI';
const CUSTOM_ELEMENT_NAME = package_namespaceObject.u2;
class AutomationCardStrategy {
    static async generate(automationEntity) {
        return {
            type: 'tile',
            entity: automationEntity.uniqueIdentifier,
            state_content: [
                'state',
                'last_triggered'
            ],
            grid_options: {
                columns: 12
            }
        };
    }
}
class AutomationSectionStrategy {
    static async generate(home, floor) {
        return {
            type: 'grid',
            cards: await this.generateCards(home, floor),
            column_span: AutomationsViewStrategy.maxColumns(home)
        };
    }
    static async generateCards(home, floor) {
        const cards = [];
        const automationEntities = home.entitiesWithDomains([
            'automation'
        ]).sort((entityA, entityB)=>entityA.state.lastTriggered.getDate() - entityB.state.lastTriggered.getDate());
        if (floor) {
            cards.push({
                type: 'heading',
                heading: floor.name,
                icon: floor.icon,
                heading_style: 'title'
            });
            for (const area of floor.areas){
                const areaAutomationEntities = area.entitiesWithDomains([
                    'automation'
                ]);
                if (0 !== areaAutomationEntities.length) {
                    cards.push({
                        type: 'heading',
                        heading: area.name,
                        icon: area.icon,
                        heading_style: 'subtitle'
                    });
                    for (const areaAutomationEntity of areaAutomationEntities)cards.push(await AutomationCardStrategy.generate(areaAutomationEntity));
                }
            }
            return cards;
        }
        cards.push({
            type: 'heading',
            heading: 'Home',
            icon: 'mdi:home',
            heading_style: 'title'
        });
        const noAreaAutomationEntities = automationEntities.filter((entity)=>!entity.areaIdentifier);
        for (const automationEntity of noAreaAutomationEntities)cards.push(await AutomationCardStrategy.generate(automationEntity));
        return cards;
    }
}
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class State {
    get uniqueIdentifier() {
        return this.hassState.entity_id;
    }
    get localizedDescription() {
        return this.hassState.attributes.friendly_name || '';
    }
    get characteristicType() {
        return this.hassState.attributes.device_class || '';
    }
    get units() {
        return this.hassState.attributes.unit_of_measurement;
    }
    constructor(home, state){
        _define_property(this, "home", void 0);
        _define_property(this, "hassState", void 0);
        this.home = home;
        this.hassState = state;
    }
}
function entity_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class Entity {
    get name() {
        return this.hassEntity.name || '';
    }
    get icon() {
        return this.hassEntity.icon || void 0;
    }
    get uniqueIdentifier() {
        return this.hassEntity.entity_id;
    }
    get characteristics() {
        return [
            this.state
        ];
    }
    get serviceType() {
        return this.domain;
    }
    get accessory() {
        return this.device;
    }
    get identifier() {
        return this.uniqueIdentifier.split('.')[1];
    }
    get areaIdentifier() {
        var _this_device;
        if (this.hassEntity.area_id) return this.hassEntity.area_id;
        if (null === (_this_device = this.device) || void 0 === _this_device ? void 0 : _this_device.area) return this.device.area.uniqueIdentifier;
    }
    get deviceIdentifier() {
        return this.hassEntity.device_id || void 0;
    }
    get area() {
        return this.home.areas.find((area)=>this.areaIdentifier === area.uniqueIdentifier);
    }
    get hidden() {
        return this.hassEntity.hidden ?? false;
    }
    get state() {
        if (!this.cahce.state) this.cahce.state = new State(this.home, this.home.hass.states[this.hassEntity.entity_id]);
        return this.cahce.state;
    }
    get device() {
        return this.home.devices.find((device)=>device.uniqueIdentifier === this.deviceIdentifier);
    }
    get domain() {
        return this.hassEntity.entity_id.split('.')[0];
    }
    get platform() {
        return this.hassEntity.platform;
    }
    constructor(home, entity){
        entity_define_property(this, "home", void 0);
        entity_define_property(this, "hassEntity", void 0);
        entity_define_property(this, "cahce", {});
        this.home = home;
        this.hassEntity = entity;
    }
}
function device_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class Device {
    get uniqueIdentifier() {
        return this.hassDevice.id;
    }
    get name() {
        return this.hassDevice.name || '';
    }
    get room() {
        return this.area;
    }
    get isBlocked() {
        return null !== this.hassDevice.disabled_by;
    }
    get services() {
        return this.entities;
    }
    get manufacturer() {
        return this.hassDevice.manufacturer || void 0;
    }
    get model() {
        return this.hassDevice.model || void 0;
    }
    get identifiers() {
        return this.hassDevice.identifiers;
    }
    get area() {
        return this.home.areas.find((area)=>area.uniqueIdentifier === this.hassDevice.area_id);
    }
    get entities() {
        return this.home.entities.filter((entity)=>entity.deviceIdentifier === this.uniqueIdentifier);
    }
    entitiesWithDomains(domains) {
        return this.entities.filter((entity)=>domains.includes(entity.domain));
    }
    constructor(home, device){
        device_define_property(this, "home", void 0);
        device_define_property(this, "hassDevice", void 0);
        this.home = home;
        this.hassDevice = device;
    }
}
const WEATHERKIT_PLATFORM = 'weatherkit';
const MAGIC_AREAS_PLATFORM = 'magic_areas';
const MAGIC_AREAS_GLOBAL_DEVICE_ID = 'magic_area_device_global';
const MAGIC_AREAS_FLOOR_DEVICE_ID = 'magic_area_device_${floor.uniqueIdentifier}';
const MAGIC_AREAS_AREA_DEVICE_ID = 'magic_area_device_${area.uniqueIdentifier}';
const MAGIC_AREA_AREA_LIGHT_GROUP_ALL_ENTITY_ID = 'light.magic_areas_light_groups_${area.uniqueIdentifier}_all_lights';
const MAGIC_AREAS_AREA_LIGHT_GROUP_ENTITY_IDS = {
    overhead: 'light.magic_areas_light_groups_${area.uniqueIdentifier}_overhead_lights',
    sleep: 'light.magic_areas_light_groups_${area.uniqueIdentifier}_sleep_lights',
    accent: 'light.magic_areas_light_groups_${area.uniqueIdentifier}_accent_lights',
    task: 'light.magic_areas_light_groups_${area.uniqueIdentifier}_task_lights'
};
function floor_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class Floor {
    get name() {
        return this.hassFloor.name;
    }
    get uniqueIdentifier() {
        return this.hassFloor.floor_id;
    }
    get rooms() {
        return this.areas;
    }
    get icon() {
        return this.hassFloor.icon || void 0;
    }
    get level() {
        return this.hassFloor.level ?? void 0;
    }
    get areas() {
        return this.home.areas.filter((area)=>area.floorIdentifier === this.uniqueIdentifier);
    }
    entitiesWithDomains(domains) {
        const entities = [];
        for (const area of this.areas)entities.push(...area.entitiesWithDomains(domains));
        return entities;
    }
    get climateEntity() {
        const magicAreasAreaDevice = this.home.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_FLOOR_DEVICE_ID.replace('${floor.uniqueIdentifier}', this.uniqueIdentifier)));
        if (magicAreasAreaDevice) {
            const magicAreasAreaClimateEntities = magicAreasAreaDevice.entitiesWithDomains([
                'climate'
            ]);
            if (magicAreasAreaClimateEntities.length > 0) return magicAreasAreaClimateEntities[0];
        }
        const climateEntities = this.entitiesWithDomains([
            'climate'
        ]);
        if (1 === climateEntities.length) return climateEntities[0];
    }
    get lightEntity() {
        const magicAreasAreaDevice = this.home.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_FLOOR_DEVICE_ID.replace('${floor.uniqueIdentifier}', this.uniqueIdentifier)));
        if (magicAreasAreaDevice) {
            const magicAreasAreaLightEntities = magicAreasAreaDevice.entitiesWithDomains([
                'light'
            ]);
            if (magicAreasAreaLightEntities.length > 0) return magicAreasAreaLightEntities[0];
        }
        const lightEntities = this.entitiesWithDomains([
            'light'
        ]);
        if (1 === lightEntities.length) return lightEntities[0];
    }
    get lockEntity() {
        const magicAreasAreaDevice = this.home.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_FLOOR_DEVICE_ID.replace('${floor.uniqueIdentifier}', this.uniqueIdentifier)));
        if (magicAreasAreaDevice) {
            const magicAreasAreaLockEntities = magicAreasAreaDevice.entitiesWithDomains([
                'lock'
            ]);
            if (magicAreasAreaLockEntities.length > 0) return magicAreasAreaLockEntities[0];
        }
        const lockEntities = this.entitiesWithDomains([
            'lock'
        ]);
        if (1 === lockEntities.length) return lockEntities[0];
    }
    get mediaPlayerEntity() {
        const magicAreasAreaDevice = this.home.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_FLOOR_DEVICE_ID.replace('${floor.uniqueIdentifier}', this.uniqueIdentifier)));
        if (magicAreasAreaDevice) {
            const magicAreasAreaMediaPlayerEntities = magicAreasAreaDevice.entitiesWithDomains([
                'media_player'
            ]);
            if (magicAreasAreaMediaPlayerEntities.length > 0) return magicAreasAreaMediaPlayerEntities[0];
        }
        const mediaPlayerEntities = this.entitiesWithDomains([
            'media_player'
        ]);
        if (1 === mediaPlayerEntities.length) return mediaPlayerEntities[0];
    }
    constructor(home, floor){
        floor_define_property(this, "home", void 0);
        floor_define_property(this, "hassFloor", void 0);
        this.home = home;
        this.hassFloor = floor;
    }
}
function area_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class Area {
    get name() {
        return this.hassArea.name;
    }
    get uniqueIdentifier() {
        return this.hassArea.area_id;
    }
    get accessories() {
        return this.devices;
    }
    get floorIdentifier() {
        return this.hassArea.floor_id || void 0;
    }
    get icon() {
        return this.hassArea.icon || void 0;
    }
    get devices() {
        return this.home.devices.filter((device)=>device.hassDevice.area_id === this.uniqueIdentifier);
    }
    get entities() {
        return this.home.entities.filter((entity)=>entity.areaIdentifier === this.uniqueIdentifier);
    }
    entitiesWithDomains(domains) {
        return this.entities.filter((entity)=>domains.includes(entity.domain));
    }
    get climateEntity() {
        const magicAreasAreaDevice = this.home.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_AREA_DEVICE_ID.replace('${area.uniqueIdentifier}', this.uniqueIdentifier)));
        if (magicAreasAreaDevice) {
            const magicAreasAreaClimateEntities = magicAreasAreaDevice.entitiesWithDomains([
                'climate'
            ]);
            if (magicAreasAreaClimateEntities.length > 0) return magicAreasAreaClimateEntities[0];
        }
        const climateEntities = this.entitiesWithDomains([
            'climate'
        ]);
        if (1 === climateEntities.length) return climateEntities[0];
    }
    get lightEntityGroups() {
        const magicAreasAreaDevice = this.home.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_AREA_DEVICE_ID.replace('${area.uniqueIdentifier}', this.uniqueIdentifier)));
        if (magicAreasAreaDevice) {
            const magicAreasAreaLightGroupEntities = magicAreasAreaDevice.entitiesWithDomains([
                'light'
            ]).filter((entity)=>Object.values(MAGIC_AREAS_AREA_LIGHT_GROUP_ENTITY_IDS).includes(entity.uniqueIdentifier.replace(this.uniqueIdentifier, '${area.uniqueIdentifier}')));
            if (magicAreasAreaLightGroupEntities.length > 1) return magicAreasAreaLightGroupEntities;
            const magicAreaLightGroupEntityIds = [
                ...magicAreasAreaLightGroupEntities.map((entity)=>entity.uniqueIdentifier)
            ];
            const lightEntities = this.entitiesWithDomains([
                'light'
            ]).filter((entity)=>!magicAreaLightGroupEntityIds.includes(entity.uniqueIdentifier) || entity.uniqueIdentifier === MAGIC_AREA_AREA_LIGHT_GROUP_ALL_ENTITY_ID.replace('${area.uniqueIdentifier}', this.uniqueIdentifier));
            return lightEntities;
        }
        return [];
    }
    get lockEntity() {
        const magicAreasAreaDevice = this.home.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_AREA_DEVICE_ID.replace('${area.uniqueIdentifier}', this.uniqueIdentifier)));
        if (magicAreasAreaDevice) {
            const magicAreasAreaClimateEntities = magicAreasAreaDevice.entitiesWithDomains([
                'lock'
            ]);
            if (magicAreasAreaClimateEntities.length > 0) return magicAreasAreaClimateEntities[0];
        }
        const climateEntities = this.entitiesWithDomains([
            'lock'
        ]);
        if (1 === climateEntities.length) return climateEntities[0];
    }
    constructor(home, area){
        area_define_property(this, "home", void 0);
        area_define_property(this, "hassArea", void 0);
        this.home = home;
        this.hassArea = area;
    }
}
function user_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class User {
    get name() {
        return this.hassUser.name;
    }
    get uniqueIdentifier() {
        return this.hassUser.id;
    }
    constructor(home, user){
        user_define_property(this, "home", void 0);
        user_define_property(this, "hassUser", void 0);
        this.home = home;
        this.hassUser = user;
    }
}
function automation_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class AutomationState extends State {
    get lastTriggered() {
        return new Date(this.hassState.attributes.last_triggered);
    }
    constructor(home, hassState){
        super(home, hassState), automation_define_property(this, "hassState", void 0);
        this.hassState = hassState;
    }
}
function climate_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class ClimateState extends State {
    get fanModes() {
        return this.hassState.attributes.fan_modes || [];
    }
    constructor(home, hassState){
        super(home, hassState), climate_define_property(this, "hassState", void 0);
        this.hassState = hassState;
    }
}
function light_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class LightState extends State {
    get supportedColorModes() {
        return this.hassState.attributes.supported_color_modes || [];
    }
    constructor(home, hassState){
        super(home, hassState), light_define_property(this, "hassState", void 0);
        this.hassState = hassState;
    }
}
class AutomationEntity extends Entity {
    get state() {
        if (!this.cahce.state) this.cahce.state = new AutomationState(this.home, this.home.hass.states[this.hassEntity.entity_id]);
        return this.cahce.state;
    }
}
class ClimateEntity extends Entity {
    get state() {
        if (!this.cahce.state) this.cahce.state = new ClimateState(this.home, this.home.hass.states[this.hassEntity.entity_id]);
        return this.cahce.state;
    }
}
class LightEntity extends Entity {
    get state() {
        if (!this.cahce.state) this.cahce.state = new LightState(this.home, this.home.hass.states[this.hassEntity.entity_id]);
        return this.cahce.state;
    }
}
function home_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class Home {
    static createConfig(partialConfig = {}) {
        const config = {
            areas: []
        };
        if (partialConfig.areas) {
            for (const area of partialConfig.areas)if (null == area ? void 0 : area.id) config.areas.push({
                id: area.id
            });
        }
        return config;
    }
    get name() {
        return this.hass.config.location_name;
    }
    get rooms() {
        return this.areas;
    }
    get zones() {
        return this.floors;
    }
    get accessories() {
        return this.devices;
    }
    servicesWithTypes(serviceTypes) {
        return this.entitiesWithDomains(serviceTypes);
    }
    get state() {
        return this.hass.config.state;
    }
    get currentUser() {
        if (!this.cache.currentUser) {
            if (!this.hass.user) throw new Error();
            this.cache.currentUser = new User(this, this.hass.user);
        }
        return this.cache.currentUser;
    }
    get panelUrl() {
        return this.hass.panelUrl;
    }
    get areas() {
        if (!this.cache.areas) this.cache.areas = Object.values(this.hass.areas).map((area)=>new Area(this, area)).sort((areaA, areaB)=>{
            const indexA = this.config.areas.findIndex((configArea)=>configArea.id === areaA.uniqueIdentifier) ?? this.config.areas.length;
            const indexB = this.config.areas.findIndex((configArea)=>configArea.id === areaB.uniqueIdentifier) ?? this.config.areas.length;
            return indexA - indexB;
        });
        return this.cache.areas;
    }
    get floors() {
        if (!this.cache.floors) this.cache.floors = Object.values(this.hass.floors).map((floor)=>new Floor(this, floor)).sort((floorA, floorB)=>{
            const levelA = floorA.level ?? Object.keys(this.hass.floors).length;
            const levelB = floorB.level ?? Object.keys(this.hass.floors).length;
            return levelA - levelB;
        });
        return this.cache.floors;
    }
    get devices() {
        if (!this.cache.devices) this.cache.devices = Object.values(this.hass.devices).map((device)=>new Device(this, device));
        return this.cache.devices;
    }
    entitiesWithDomains(domains) {
        return this.entities.filter((entity)=>domains.includes(entity.domain));
    }
    get entities() {
        if (!this.cache.entities) this.cache.entities = Object.values(this.hass.entities).map((entity)=>{
            switch(entity.entity_id.split('.')[0]){
                case 'automation':
                    return new AutomationEntity(this, entity);
                case 'climate':
                    return new ClimateEntity(this, entity);
                case 'light':
                    return new LightEntity(this, entity);
                default:
                    return new Entity(this, entity);
            }
        }).sort((entityA, entityB)=>{
            const indexA = this.config.areas.findIndex((configArea)=>configArea.id === entityA.areaIdentifier) ?? this.config.areas.length;
            const indexB = this.config.areas.findIndex((configArea)=>configArea.id === entityB.areaIdentifier) ?? this.config.areas.length;
            return indexA - indexB;
        });
        return this.cache.entities;
    }
    get weatherEntity() {
        const weatherEntities = this.entitiesWithDomains([
            'weather'
        ]);
        if (weatherEntities.length > 0) {
            const weatherKitEntity = weatherEntities.find((entity)=>entity.platform === WEATHERKIT_PLATFORM);
            if (weatherKitEntity) return weatherKitEntity;
            return weatherEntities[0];
        }
    }
    get climateEntity() {
        const magicAreasGlobalDevice = this.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID));
        if (magicAreasGlobalDevice) {
            const magicAreasGlobalClimateEntities = magicAreasGlobalDevice.entitiesWithDomains([
                'climate'
            ]);
            if (magicAreasGlobalClimateEntities.length > 0) return magicAreasGlobalClimateEntities[0];
        }
        const climateEntities = this.entitiesWithDomains([
            'climate'
        ]);
        if (1 === climateEntities.length) return climateEntities[0];
    }
    get temperatureEntity() {
        const magicAreasGlobalDevice = this.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID));
        if (magicAreasGlobalDevice) {
            const magicAreasGlobalTemperatureEntities = magicAreasGlobalDevice.entities.filter((entity)=>'temperature' === entity.state.characteristicType);
            if (magicAreasGlobalTemperatureEntities.length > 0) return magicAreasGlobalTemperatureEntities[0];
        }
        const temperatureEntities = this.entities.filter((entity)=>'temperature' === entity.state.characteristicType);
        if (1 === temperatureEntities.length) return temperatureEntities[0];
    }
    get humidityEntity() {
        const magicAreasGlobalDevice = this.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID));
        if (magicAreasGlobalDevice) {
            const magicAreasGlobalHumidityEntities = magicAreasGlobalDevice.entities.filter((entity)=>'humidity' === entity.state.characteristicType);
            if (magicAreasGlobalHumidityEntities.length > 0) return magicAreasGlobalHumidityEntities[0];
        }
        const humidityEntities = this.entities.filter((entity)=>'humidity' === entity.state.characteristicType);
        if (1 === humidityEntities.length) return humidityEntities[0];
    }
    get coverEntity() {
        const magicAreasGlobalDevice = this.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID));
        if (magicAreasGlobalDevice) {
            const magicAreasGlobalCoverEntities = magicAreasGlobalDevice.entitiesWithDomains([
                'cover'
            ]);
            if (magicAreasGlobalCoverEntities.length > 0) return magicAreasGlobalCoverEntities[0];
        }
        const coverEntities = this.entitiesWithDomains([
            'cover'
        ]);
        if (1 === coverEntities.length) return coverEntities[0];
    }
    get lightEntity() {
        const magicAreasGlobalDevice = this.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID));
        if (magicAreasGlobalDevice) {
            const magicAreasGlobalLightEntities = magicAreasGlobalDevice.entitiesWithDomains([
                'light'
            ]);
            if (magicAreasGlobalLightEntities.length > 0) return magicAreasGlobalLightEntities[0];
        }
        const lightEntities = this.entitiesWithDomains([
            'light'
        ]);
        if (1 === lightEntities.length) return lightEntities[0];
    }
    get lockEntity() {
        const magicAreasGlobalDevice = this.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID));
        if (magicAreasGlobalDevice) {
            const magicAreasGlobalLockEntities = magicAreasGlobalDevice.entitiesWithDomains([
                'lock'
            ]);
            if (magicAreasGlobalLockEntities.length > 0) return magicAreasGlobalLockEntities[0];
        }
        const lockEntities = this.entitiesWithDomains([
            'lock'
        ]);
        if (1 === lockEntities.length) return lockEntities[0];
    }
    get mediaPlayerEntity() {
        const magicAreasGlobalDevice = this.devices.find((device)=>device.identifiers.find((identifiers)=>identifiers[0] === MAGIC_AREAS_PLATFORM && identifiers[1] === MAGIC_AREAS_GLOBAL_DEVICE_ID));
        if (magicAreasGlobalDevice) {
            const magicAreasGlobalMediaPlayerEntities = magicAreasGlobalDevice.entitiesWithDomains([
                'media_player'
            ]);
            if (magicAreasGlobalMediaPlayerEntities.length > 0) return magicAreasGlobalMediaPlayerEntities[0];
        }
        const mediaPlayerEntities = this.entitiesWithDomains([
            'media_player'
        ]);
        if (1 === mediaPlayerEntities.length) return mediaPlayerEntities[0];
    }
    get co2SignalEntity() {
        const co2SignalDevices = this.devices.filter((device)=>device.identifiers.some((identifiers)=>'co2signal' === identifiers[0]));
        if (co2SignalDevices.length > 0) {
            const co2SignalEntities = [];
            for (const co2SignalDevice of co2SignalDevices){
                const co2SignalDeviceEntities = co2SignalDevice.entities.filter((entity)=>'%' === entity.state.units);
                if (co2SignalDeviceEntities.length > 0) co2SignalEntities.push(...co2SignalDeviceEntities);
            }
            if (co2SignalEntities.length > 0) return co2SignalEntities[0];
        }
    }
    get wasteEntity() {
        const wasteEntities = this.entitiesWithDomains([
            'calendar'
        ]).filter((entity)=>entity.name.includes('waste'));
        if (wasteEntities.length > 0) return wasteEntities[0];
    }
    constructor(hass, config = {}){
        home_define_property(this, "hass", void 0);
        home_define_property(this, "config", {
            areas: []
        });
        home_define_property(this, "cache", {});
        this.hass = hass;
        this.config = Home.createConfig(config);
    }
}
function createConfigAreas(partialConfig) {
    const config = {
        areas: []
    };
    if (partialConfig.areas) {
        for (const area of partialConfig.areas)if (area && area.id) config.areas.push({
            id: area.id
        });
    }
    return config;
}
class AutomationsViewStrategy extends g {
    static async generate(partialConfig, hass) {
        const config = this.createConfig(partialConfig);
        const home = new Home(hass, config);
        const view = {
            badges: await this.generateBadges(),
            sections: await this.generateSections(home)
        };
        return view;
    }
    static createConfig(partialConfig) {
        return {
            ...createConfigAreas(partialConfig)
        };
    }
    static async generateBadges() {
        return [];
    }
    static async generateSections(home) {
        const sections = [
            await AutomationSectionStrategy.generate(home)
        ];
        for (const floor of home.floors)sections.push(await AutomationSectionStrategy.generate(home, floor));
        return sections;
    }
    static maxColumns(home) {
        let maxColumns = 1;
        for (const floor of home.zones)for (const area of floor.rooms){
            const areaAutomationEntities = area.entitiesWithDomains([
                'automation'
            ]);
            if (areaAutomationEntities.length > 0) {
                maxColumns = maxColumns++;
                break;
            }
        }
        return maxColumns;
    }
}
customElements.define(`ll-strategy-view-${CUSTOM_ELEMENT_NAME}-automations`, AutomationsViewStrategy);
class ClimateBadgeStrategy {
    static async generate(climateEntity) {
        return {
            type: 'entity',
            entity: climateEntity.uniqueIdentifier,
            name: climateEntity.name,
            icon: climateEntity.icon || 'mdi:fan',
            show_name: true
        };
    }
}
class WeatherBadgeStrategy {
    static async generate(weatherEntity) {
        return {
            type: 'entity',
            entity: weatherEntity.uniqueIdentifier,
            name: weatherEntity.name,
            show_name: true,
            state_content: [
                'state',
                'temperature'
            ]
        };
    }
}
class LightsBadgeStrategy {
    static async generate(lightEntity) {
        return {
            type: 'entity',
            entity: lightEntity.uniqueIdentifier,
            name: lightEntity.name,
            icon: lightEntity.icon || 'mdi:lightbulb-group',
            show_name: true,
            state_content: [
                'state'
            ]
        };
    }
}
class SecurityBadgeStrategy {
    static async generate(securityEntity) {
        return {
            type: 'entity',
            entity: securityEntity.uniqueIdentifier,
            name: securityEntity.name,
            icon: securityEntity.icon || 'mdi:lock',
            show_name: true,
            state_content: [
                'state'
            ]
        };
    }
}
class SpeakersTvsBadgeStrategy {
    static async generate(mediaPlayerEntity) {
        return {
            type: 'entity',
            entity: mediaPlayerEntity.uniqueIdentifier,
            name: mediaPlayerEntity.name,
            icon: mediaPlayerEntity.icon || 'mdi:television-speaker',
            show_name: true,
            visibility: [
                {
                    condition: 'or',
                    conditions: [
                        {
                            condition: 'state',
                            entity: mediaPlayerEntity.uniqueIdentifier,
                            state: 'on'
                        },
                        {
                            condition: 'state',
                            entity: mediaPlayerEntity.uniqueIdentifier,
                            state: 'playing'
                        },
                        {
                            condition: 'state',
                            entity: mediaPlayerEntity.uniqueIdentifier,
                            state: 'buffering'
                        }
                    ]
                }
            ]
        };
    }
}
class ClimateCardStrategy {
    static async generate(climateEntity) {
        return {
            type: 'tile',
            entity: climateEntity.uniqueIdentifier,
            name: climateEntity.name,
            control: 'climate',
            features: await this.generateFeatures(climateEntity)
        };
    }
    static async generateFeatures(climateEntity) {
        const features = [
            {
                type: 'climate-hvac-modes',
                style: 'icons',
                hvac_modes: [
                    'off',
                    'auto',
                    'heat',
                    'fan_only',
                    'cool',
                    'dry'
                ]
            }
        ];
        if (climateEntity.state.fanModes.length > 0) features.push({
            type: 'climate-fan-modes',
            style: 'dropdown'
        });
        features.push({
            type: 'target-temperature'
        });
        return features;
    }
}
class FloorHeadingCardStrategy {
    static async generate(floor) {
        return {
            type: 'heading',
            heading: floor.name,
            icon: floor.icon,
            tap_action: {
                action: 'navigate',
                navigation_path: `/${floor.uniqueIdentifier}`
            },
            badges: await this.generateBadges(floor)
        };
    }
    static async generateBadges(floor) {
        const promises = [];
        if (floor.climateEntity) promises.push(ClimateBadgeStrategy.generate(floor.climateEntity));
        if (floor.lightEntity) promises.push(LightsBadgeStrategy.generate(floor.lightEntity));
        if (floor.lockEntity) promises.push(SecurityBadgeStrategy.generate(floor.lockEntity));
        if (floor.mediaPlayerEntity) promises.push(SpeakersTvsBadgeStrategy.generate(floor.mediaPlayerEntity));
        return [
            ...await Promise.all(promises)
        ];
    }
}
class LightCardStrategy {
    static async generate(lightEntity) {
        return {
            type: 'tile',
            entity: lightEntity.uniqueIdentifier,
            features: await this.generateFeatures(lightEntity),
            visibility: [
                {
                    condition: 'or',
                    conditions: [
                        {
                            condition: 'state',
                            entity: lightEntity.uniqueIdentifier,
                            state: 'on'
                        },
                        {
                            condition: 'state',
                            entity: 'sun.sun',
                            state: 'below_horizon'
                        }
                    ]
                },
                {
                    condition: 'state',
                    entity: lightEntity.uniqueIdentifier,
                    state_not: 'unavailable'
                }
            ]
        };
    }
    static async generateFeatures(lightEntity) {
        const features = [];
        if (lightEntity.state.supportedColorModes.includes('brightness')) features.push({
            type: 'light-brightness'
        });
        if (lightEntity.state.supportedColorModes.includes('color_temp')) features.push({
            type: 'light-brightness'
        }, {
            type: 'light-color-temp'
        });
        return features;
    }
}
class SecurityCardStrategy {
    static async generate(lockEntity) {
        return {
            type: 'tile',
            entity: lockEntity.uniqueIdentifier,
            features: [
                {
                    type: 'lock-commands'
                }
            ]
        };
    }
}
class SpeakerTvCardStrategy {
    static async generate(mediaPlayerEntity) {
        return {
            type: 'tile',
            entity: mediaPlayerEntity.uniqueIdentifier,
            features: [
                {
                    type: 'media-player-volume-slider'
                }
            ],
            visibility: [
                {
                    condition: 'or',
                    conditions: [
                        {
                            condition: 'state',
                            entity: mediaPlayerEntity.uniqueIdentifier,
                            state: 'on'
                        },
                        {
                            condition: 'state',
                            entity: mediaPlayerEntity.uniqueIdentifier,
                            state: 'playing'
                        },
                        {
                            condition: 'state',
                            entity: mediaPlayerEntity.uniqueIdentifier,
                            state: 'buffering'
                        }
                    ]
                }
            ]
        };
    }
}
class SwitchCardStrategy {
    static async generate(switchEntity) {
        return {
            type: 'tile',
            entity: switchEntity.uniqueIdentifier
        };
    }
}
class FloorSectionStrategy {
    static async generate(floor) {
        return {
            type: 'grid',
            cards: await this.generateCards(floor)
        };
    }
    static async generateCards(floor) {
        const promises = [
            FloorHeadingCardStrategy.generate(floor)
        ];
        for (const area of floor.areas)for (const climateService of area.entitiesWithDomains([
            'climate'
        ]))promises.push(ClimateCardStrategy.generate(climateService));
        for (const area of floor.areas)if (area.lightEntityGroups.length > 0) for (const lightEntity of area.lightEntityGroups)promises.push(LightCardStrategy.generate(lightEntity));
        else for (const lightEntity of area.entitiesWithDomains([
            'light'
        ]))promises.push(LightCardStrategy.generate(lightEntity));
        for (const area of floor.areas){
            const lockEntities = area.entitiesWithDomains([
                'lock'
            ]);
            if (lockEntities) for (const lockEntity of lockEntities)promises.push(SecurityCardStrategy.generate(lockEntity));
        }
        for (const room of floor.rooms){
            const mediaPlayerEntities = room.entitiesWithDomains([
                'media_player'
            ]);
            if (mediaPlayerEntities) for (const mediaPlayerEntity of mediaPlayerEntities)promises.push(SpeakerTvCardStrategy.generate(mediaPlayerEntity));
        }
        for (const room of floor.rooms){
            const switchEntities = room.entitiesWithDomains([
                'switch'
            ]).filter((entity)=>!entity.hidden);
            if (switchEntities) for (const switchEntity of switchEntities)promises.push(SwitchCardStrategy.generate(switchEntity));
        }
        return [
            ...await Promise.all(promises)
        ];
    }
}
class WasteBadgeStrategy {
    static async generate(wasteEntity) {
        return {
            type: 'entity',
            entity: wasteEntity.uniqueIdentifier,
            name: 'Waste',
            show_name: true,
            state_content: [
                'message'
            ]
        };
    }
}
class EnergyBadgeStrategy {
    static async generate(co2SignalEntity) {
        return {
            type: 'entity',
            entity: co2SignalEntity.uniqueIdentifier,
            name: co2SignalEntity.name,
            icon: co2SignalEntity.icon || 'mdi:lightning-bolt',
            color: 'light-green',
            show_name: true
        };
    }
}
class CameraCardStrategy {
    static async generate(cameraEntity) {
        return {
            type: 'picture-entity',
            entity: cameraEntity.uniqueIdentifier,
            camera_image: cameraEntity.uniqueIdentifier,
            show_name: false,
            show_state: false,
            camera_view: 'live'
        };
    }
}
class CamerasSectionStrategy {
    static async generate(home, cameraEntities) {
        return {
            type: 'grid',
            cards: await this.generateCards(cameraEntities),
            column_span: HomeViewStrategy.maxColumns(home.floors)
        };
    }
    static async generateCards(cameraEntities) {
        const cards = [
            {
                type: 'heading',
                heading: 'Cameras',
                icon: 'mdi:video',
                tap_action: {
                    action: 'navigate',
                    navigation_path: "/cameras"
                }
            }
        ];
        const promises = [];
        for (const camera of cameraEntities)promises.push(CameraCardStrategy.generate(camera));
        cards.push(...await Promise.all(promises));
        return cards;
    }
}
class HomeViewStrategy extends g {
    static async generate(config, hass) {
        const home = new Home(hass, this.createConfig(config));
        const [badges, sections] = await Promise.all([
            this.generateBadges(home),
            this.generateSections(home)
        ]);
        return {
            badges,
            sections
        };
    }
    static createConfig(partialConfig) {
        return {
            ...createConfigAreas(partialConfig)
        };
    }
    static async generateBadges(home) {
        const promises = [];
        if (home.weatherEntity) promises.push(WeatherBadgeStrategy.generate(home.weatherEntity));
        if (home.climateEntity) promises.push(ClimateBadgeStrategy.generate(home.climateEntity));
        if (home.lightEntity) promises.push(LightsBadgeStrategy.generate(home.lightEntity));
        if (home.lockEntity) promises.push(SecurityBadgeStrategy.generate(home.lockEntity));
        if (home.mediaPlayerEntity) promises.push(SpeakersTvsBadgeStrategy.generate(home.mediaPlayerEntity));
        if (home.co2SignalEntity) promises.push(EnergyBadgeStrategy.generate(home.co2SignalEntity));
        if (home.wasteEntity) promises.push(WasteBadgeStrategy.generate(home.wasteEntity));
        return [
            ...await Promise.all(promises)
        ];
    }
    static async generateSections(home) {
        const promises = [];
        const cameraEntities = home.entitiesWithDomains([
            'camera'
        ]);
        if (cameraEntities.length > 0) promises.push(CamerasSectionStrategy.generate(home, cameraEntities));
        for (const floor of home.floors)promises.push(FloorSectionStrategy.generate(floor));
        return [
            ...await Promise.all(promises)
        ];
    }
    static maxColumns(floors) {
        return Math.max(floors.length, 1);
    }
}
customElements.define(`ll-strategy-view-${CUSTOM_ELEMENT_NAME}-home`, HomeViewStrategy);
function home_dashboard_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class HomeDashboardStrategy extends g {
    static async generate(partialConfig, hass) {
        const config = this.createConfig(partialConfig);
        const home = new Home(hass, config);
        console.info(this.logPrefix, 'Config', config);
        console.info(this.logPrefix, 'Home', home);
        return {
            views: await this.generateViews(home, config)
        };
    }
    static createConfig(partialConfig) {
        return HomeViewStrategy.createConfig(partialConfig);
    }
    static async generateViews(home, config) {
        var _home_climateEntity, _home_lightEntity, _home_lockEntity, _home_mediaPlayerEntity;
        const views = [
            {
                type: 'sections',
                title: 'Home',
                path: 'home',
                icon: 'mdi:home',
                max_columns: HomeViewStrategy.maxColumns(home.zones),
                strategy: {
                    type: `custom:${CUSTOM_ELEMENT_NAME}-home`,
                    ...config
                }
            },
            {
                type: 'sections',
                title: 'Automations',
                icon: 'mdi:alarm',
                max_columns: AutomationsViewStrategy.maxColumns(home),
                strategy: {
                    type: `custom:${CUSTOM_ELEMENT_NAME}-automations`,
                    ...config
                }
            },
            {
                type: 'sections',
                title: 'Climate',
                path: 'climate',
                icon: (null === (_home_climateEntity = home.climateEntity) || void 0 === _home_climateEntity ? void 0 : _home_climateEntity.icon) || 'mdi:fan',
                strategy: {
                    type: `custom:${CUSTOM_ELEMENT_NAME}-climate`,
                    ...config
                }
            },
            {
                type: 'sections',
                title: 'Lights',
                path: 'lights',
                icon: (null === (_home_lightEntity = home.lightEntity) || void 0 === _home_lightEntity ? void 0 : _home_lightEntity.icon) || 'mdi:lightbulb-group',
                strategy: {
                    type: `custom:${CUSTOM_ELEMENT_NAME}-lights`,
                    ...config
                }
            },
            {
                type: 'sections',
                title: 'Security',
                path: 'security',
                icon: (null === (_home_lockEntity = home.lockEntity) || void 0 === _home_lockEntity ? void 0 : _home_lockEntity.icon) || 'mdi:lock',
                strategy: {
                    type: `custom:${CUSTOM_ELEMENT_NAME}-security`,
                    ...config
                }
            },
            {
                type: 'sections',
                title: 'Speakers & TVs',
                path: 'speakers-tvs',
                icon: (null === (_home_mediaPlayerEntity = home.mediaPlayerEntity) || void 0 === _home_mediaPlayerEntity ? void 0 : _home_mediaPlayerEntity.icon) || 'mdi:television-speaker',
                strategy: {
                    type: `custom:${CUSTOM_ELEMENT_NAME}-speakers-tvs`,
                    ...config
                }
            }
        ];
        return views;
    }
}
home_dashboard_define_property(HomeDashboardStrategy, "logPrefix", `${NAME} - Home Dashboard Strategy`);
customElements.define(`ll-strategy-${CUSTOM_ELEMENT_NAME}-home`, HomeDashboardStrategy);
class ClimateViewStrategy extends g {
    static async generate(config, hass) {
        const home = new Home(hass);
        const promises = [
            this.generateBadges(home),
            this.generateSections(home)
        ];
        const [badges, sections] = await Promise.all(promises);
        return {
            badges: badges,
            sections: sections
        };
    }
    static async generateBadges(home) {
        return [];
    }
    static async generateSections(home) {
        return [];
    }
}
customElements.define(`ll-strategy-view-${CUSTOM_ELEMENT_NAME}-climate`, ClimateViewStrategy);
class LightsViewStrategy extends g {
    static async generate(config, hass) {
        const [badges, sections] = await Promise.all([
            this.generateBadges(config, hass),
            this.generateSections(config, hass)
        ]);
        return {
            badges: badges,
            sections: sections
        };
    }
    static async generateBadges(config, hass) {
        return [];
    }
    static async generateSections(config, hass) {
        return [];
    }
}
customElements.define(`ll-strategy-view-${CUSTOM_ELEMENT_NAME}-lights`, LightsViewStrategy);
class SecurityViewStrategy extends g {
    static async generate(config, hass) {
        const view = {
            badges: await this.generateBadges(config, hass),
            sections: await this.generateSections(config, hass)
        };
        return view;
    }
    static async generateBadges(config, hass) {
        return [];
    }
    static async generateSections(config, hass) {
        return [];
    }
}
customElements.define(`ll-strategy-view-${CUSTOM_ELEMENT_NAME}-security`, SecurityViewStrategy);
class SpeakersTvsViewStrategy extends g {
    static async generate(config, hass) {
        const view = {
            badges: await this.generateBadges(config, hass),
            sections: await this.generateSections(config, hass)
        };
        return view;
    }
    static async generateBadges(config, hass) {
        return [];
    }
    static async generateSections(config, hass) {
        return [];
    }
}
customElements.define(`ll-strategy-view-${CUSTOM_ELEMENT_NAME}-speakers-tvs`, SpeakersTvsViewStrategy);
class FloorDashboardStrategy extends g {
    static async generate(config, hass) {
        if (!config.floor_id) return {
            views: []
        };
        const floor = hass.floors[config.floor_id];
        if (!floor) return {
            views: []
        };
        return {
            views: await this.generateViews({
                floor: floor,
                areas: config.areas
            }, hass)
        };
    }
    static async generateViews(config, hass) {
        const floor = config.floor;
        const views = [
            {
                type: 'sections',
                title: config.floor.floor_id,
                path: config.floor.floor_id,
                icon: config.floor.icon || void 0,
                max_columns: 2,
                strategy: {
                    type: `custom:${CUSTOM_ELEMENT_NAME}-floor`,
                    floor_id: config.floor.floor_id
                }
            }
        ];
        let areas = Object.values(hass.areas).filter((area)=>area.floor_id === floor.floor_id);
        if (config.areas && config.areas.length > 0) areas = areas.filter((area)=>{
            var _config_areas;
            return null === (_config_areas = config.areas) || void 0 === _config_areas ? void 0 : _config_areas.some((configArea)=>configArea.area_id === area.area_id);
        });
        for (const area of areas)views.push({
            type: 'sections',
            title: area.name,
            path: area.area_id,
            strategy: {
                type: `custom:${CUSTOM_ELEMENT_NAME}-room`,
                area_id: area.area_id
            }
        });
        return views;
    }
}
customElements.define(`ll-strategy-${CUSTOM_ELEMENT_NAME}-floor`, FloorDashboardStrategy);
class FloorViewStrategy extends g {
    static async generate(config, hass) {
        if (!config.floor_id) return {};
        const view = {
            badges: await this.generateBadges(config, hass),
            sections: await this.generateSections(config, hass)
        };
        return view;
    }
    static async generateBadges(config, hass) {
        return [];
    }
    static async generateSections(config, hass) {
        return [];
    }
}
customElements.define(`ll-strategy-view-${CUSTOM_ELEMENT_NAME}-floor`, FloorViewStrategy);
class RoomViewStrategy extends g {
    static async generate(config, hass) {
        const view = {
            badges: await this.generateBadges(config, hass),
            sections: await this.generateSections(config, hass)
        };
        return view;
    }
    static async generateBadges(config, hass) {
        return [];
    }
    static async generateSections(config, hass) {
        return [];
    }
}
customElements.define(`ll-strategy-view-${CUSTOM_ELEMENT_NAME}-room`, RoomViewStrategy);
export { AutomationsViewStrategy, ClimateViewStrategy, FloorDashboardStrategy, FloorViewStrategy, HomeDashboardStrategy, HomeViewStrategy, LightsViewStrategy, RoomViewStrategy, SecurityViewStrategy, SpeakersTvsViewStrategy };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JjaGFyZC11aS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL29yY2hhcmQtdWkvLi9ub2RlX21vZHVsZXMvQGxpdC1sYWJzL3Nzci1kb20tc2hpbS9saWIvZWxlbWVudC1pbnRlcm5hbHMuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL25vZGVfbW9kdWxlcy9AbGl0LWxhYnMvc3NyLWRvbS1zaGltL2xpYi9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL25vZGVfbW9kdWxlcy9AbGl0LWxhYnMvc3NyLWRvbS1zaGltL2luZGV4LmpzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9ub2RlX21vZHVsZXMvQGxpdC9yZWFjdGl2ZS1lbGVtZW50L25vZGUvY3NzLXRhZy5qcyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vbm9kZV9tb2R1bGVzL0BsaXQvcmVhY3RpdmUtZWxlbWVudC9ub2RlL3JlYWN0aXZlLWVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL25vZGVfbW9kdWxlcy9saXQtaHRtbC9ub2RlL2xpdC1odG1sLmpzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9ub2RlX21vZHVsZXMvbGl0LWVsZW1lbnQvbGl0LWVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9jb25maWcudHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9zdHJhdGVnaWVzL2NhcmRzL2F1dG9tYXRpb24tY2FyZC50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vc3JjL3N0cmF0ZWdpZXMvc2VjdGlvbnMvYXV0b21hdGlvbnMtc2VjdGlvbi50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vbm9kZV9tb2R1bGVzL0BzbW9scGFjay9oYXNza2l0L2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vc3JjL3N0cmF0ZWdpZXMvdmlld3MvYXV0b21hdGlvbnMtdmlldy50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vc3JjL3N0cmF0ZWdpZXMvYmFkZ2VzL2NsaW1hdGUtYmFkZ2UudHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9zdHJhdGVnaWVzL2JhZGdlcy93ZWF0aGVyLWJhZGdlLnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy9iYWRnZXMvbGlnaHRzLWJhZGdlLnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy9iYWRnZXMvc2VjdXJpdHktYmFkZ2UudHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9zdHJhdGVnaWVzL2JhZGdlcy9zcGVha2Vycy10dnMtYmFkZ2UudHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9zdHJhdGVnaWVzL2NhcmRzL2NsaW1hdGUtY2FyZC50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vc3JjL3N0cmF0ZWdpZXMvY2FyZHMvZmxvb3ItaGVhZGluZy1jYXJkLnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy9jYXJkcy9saWdodC1jYXJkLnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy9jYXJkcy9zZWN1cml0eS1jYXJkLnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy9jYXJkcy9zcGVha2VyLXR2LWNhcmQudHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9zdHJhdGVnaWVzL2NhcmRzL3N3aXRjaC1jYXJkLnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy9zZWN0aW9ucy9mbG9vci1zZWN0aW9uLnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy9iYWRnZXMvd2FzdGUtYmFkZ2UudHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9zdHJhdGVnaWVzL2JhZGdlcy9lbmVyZ3ktYmFkZ2UudHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9zdHJhdGVnaWVzL2NhcmRzL2NhbWVyYS1jYXJkLnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy9zZWN0aW9ucy9jYW1lcmFzLXNlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9zdHJhdGVnaWVzL3ZpZXdzL2hvbWUtdmlldy50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vc3JjL3N0cmF0ZWdpZXMvZGFzaGJvYXJkcy9ob21lLWRhc2hib2FyZC50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vc3JjL3N0cmF0ZWdpZXMvdmlld3MvY2xpbWF0ZS12aWV3LnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy92aWV3cy9saWdodHMtdmlldy50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vc3JjL3N0cmF0ZWdpZXMvdmlld3Mvc2VjdXJpdHktdmlldy50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLXVpLy4vc3JjL3N0cmF0ZWdpZXMvdmlld3Mvc3BlYWtlcnMtdHZzLXZpZXcudHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC11aS8uL3NyYy9zdHJhdGVnaWVzL2Rhc2hib2FyZHMvZmxvb3ItZGFzaGJvYXJkLnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy92aWV3cy9mbG9vci12aWV3LnRzIiwid2VicGFjazovL29yY2hhcmQtdWkvLi9zcmMvc3RyYXRlZ2llcy92aWV3cy9yb29tLXZpZXcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjMgR29vZ2xlIExMQ1xuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEJTRC0zLUNsYXVzZVxuICovXG4vKipcbiAqIE1hcCBvZiBBUklBTWl4aW4gcHJvcGVydGllcyB0byBhdHRyaWJ1dGVzXG4gKi9cbmV4cG9ydCBjb25zdCBhcmlhTWl4aW5BdHRyaWJ1dGVzID0ge1xuICAgIGFyaWFBdG9taWM6ICdhcmlhLWF0b21pYycsXG4gICAgYXJpYUF1dG9Db21wbGV0ZTogJ2FyaWEtYXV0b2NvbXBsZXRlJyxcbiAgICBhcmlhQnJhaWxsZUxhYmVsOiAnYXJpYS1icmFpbGxlbGFiZWwnLFxuICAgIGFyaWFCcmFpbGxlUm9sZURlc2NyaXB0aW9uOiAnYXJpYS1icmFpbGxlcm9sZWRlc2NyaXB0aW9uJyxcbiAgICBhcmlhQnVzeTogJ2FyaWEtYnVzeScsXG4gICAgYXJpYUNoZWNrZWQ6ICdhcmlhLWNoZWNrZWQnLFxuICAgIGFyaWFDb2xDb3VudDogJ2FyaWEtY29sY291bnQnLFxuICAgIGFyaWFDb2xJbmRleDogJ2FyaWEtY29saW5kZXgnLFxuICAgIGFyaWFDb2xTcGFuOiAnYXJpYS1jb2xzcGFuJyxcbiAgICBhcmlhQ3VycmVudDogJ2FyaWEtY3VycmVudCcsXG4gICAgYXJpYURlc2NyaXB0aW9uOiAnYXJpYS1kZXNjcmlwdGlvbicsXG4gICAgYXJpYURpc2FibGVkOiAnYXJpYS1kaXNhYmxlZCcsXG4gICAgYXJpYUV4cGFuZGVkOiAnYXJpYS1leHBhbmRlZCcsXG4gICAgYXJpYUhhc1BvcHVwOiAnYXJpYS1oYXNwb3B1cCcsXG4gICAgYXJpYUhpZGRlbjogJ2FyaWEtaGlkZGVuJyxcbiAgICBhcmlhSW52YWxpZDogJ2FyaWEtaW52YWxpZCcsXG4gICAgYXJpYUtleVNob3J0Y3V0czogJ2FyaWEta2V5c2hvcnRjdXRzJyxcbiAgICBhcmlhTGFiZWw6ICdhcmlhLWxhYmVsJyxcbiAgICBhcmlhTGV2ZWw6ICdhcmlhLWxldmVsJyxcbiAgICBhcmlhTGl2ZTogJ2FyaWEtbGl2ZScsXG4gICAgYXJpYU1vZGFsOiAnYXJpYS1tb2RhbCcsXG4gICAgYXJpYU11bHRpTGluZTogJ2FyaWEtbXVsdGlsaW5lJyxcbiAgICBhcmlhTXVsdGlTZWxlY3RhYmxlOiAnYXJpYS1tdWx0aXNlbGVjdGFibGUnLFxuICAgIGFyaWFPcmllbnRhdGlvbjogJ2FyaWEtb3JpZW50YXRpb24nLFxuICAgIGFyaWFQbGFjZWhvbGRlcjogJ2FyaWEtcGxhY2Vob2xkZXInLFxuICAgIGFyaWFQb3NJblNldDogJ2FyaWEtcG9zaW5zZXQnLFxuICAgIGFyaWFQcmVzc2VkOiAnYXJpYS1wcmVzc2VkJyxcbiAgICBhcmlhUmVhZE9ubHk6ICdhcmlhLXJlYWRvbmx5JyxcbiAgICBhcmlhUmVxdWlyZWQ6ICdhcmlhLXJlcXVpcmVkJyxcbiAgICBhcmlhUm9sZURlc2NyaXB0aW9uOiAnYXJpYS1yb2xlZGVzY3JpcHRpb24nLFxuICAgIGFyaWFSb3dDb3VudDogJ2FyaWEtcm93Y291bnQnLFxuICAgIGFyaWFSb3dJbmRleDogJ2FyaWEtcm93aW5kZXgnLFxuICAgIGFyaWFSb3dTcGFuOiAnYXJpYS1yb3dzcGFuJyxcbiAgICBhcmlhU2VsZWN0ZWQ6ICdhcmlhLXNlbGVjdGVkJyxcbiAgICBhcmlhU2V0U2l6ZTogJ2FyaWEtc2V0c2l6ZScsXG4gICAgYXJpYVNvcnQ6ICdhcmlhLXNvcnQnLFxuICAgIGFyaWFWYWx1ZU1heDogJ2FyaWEtdmFsdWVtYXgnLFxuICAgIGFyaWFWYWx1ZU1pbjogJ2FyaWEtdmFsdWVtaW4nLFxuICAgIGFyaWFWYWx1ZU5vdzogJ2FyaWEtdmFsdWVub3cnLFxuICAgIGFyaWFWYWx1ZVRleHQ6ICdhcmlhLXZhbHVldGV4dCcsXG4gICAgcm9sZTogJ3JvbGUnLFxufTtcbi8vIFNoaW0gdGhlIGdsb2JhbCBlbGVtZW50IGludGVybmFscyBvYmplY3Rcbi8vIE1ldGhvZHMgc2hvdWxkIGJlIGZpbmUgYXMgbm9vcHMgYW5kIHByb3BlcnRpZXMgY2FuIGdlbmVyYWxseVxuLy8gYmUgd2hpbGUgb24gdGhlIHNlcnZlci5cbmV4cG9ydCBjb25zdCBFbGVtZW50SW50ZXJuYWxzU2hpbSA9IGNsYXNzIEVsZW1lbnRJbnRlcm5hbHMge1xuICAgIGdldCBzaGFkb3dSb290KCkge1xuICAgICAgICAvLyBHcmFiIHRoZSBzaGFkb3cgcm9vdCBpbnN0YW5jZSBmcm9tIHRoZSBFbGVtZW50IHNoaW1cbiAgICAgICAgLy8gdG8gZW5zdXJlIHRoYXQgdGhlIHNoYWRvdyByb290IGlzIGFsd2F5cyBhdmFpbGFibGVcbiAgICAgICAgLy8gdG8gdGhlIGludGVybmFscyBpbnN0YW5jZSBldmVuIGlmIHRoZSBtb2RlIGlzICdjbG9zZWQnXG4gICAgICAgIHJldHVybiB0aGlzLl9faG9zdFxuICAgICAgICAgICAgLl9fc2hhZG93Um9vdDtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoX2hvc3QpIHtcbiAgICAgICAgdGhpcy5hcmlhQXRvbWljID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYUF1dG9Db21wbGV0ZSA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFCcmFpbGxlTGFiZWwgPSAnJztcbiAgICAgICAgdGhpcy5hcmlhQnJhaWxsZVJvbGVEZXNjcmlwdGlvbiA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFCdXN5ID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYUNoZWNrZWQgPSAnJztcbiAgICAgICAgdGhpcy5hcmlhQ29sQ291bnQgPSAnJztcbiAgICAgICAgdGhpcy5hcmlhQ29sSW5kZXggPSAnJztcbiAgICAgICAgdGhpcy5hcmlhQ29sU3BhbiA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFDdXJyZW50ID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYURlc2NyaXB0aW9uID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYURpc2FibGVkID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYUV4cGFuZGVkID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYUhhc1BvcHVwID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYUhpZGRlbiA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFJbnZhbGlkID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYUtleVNob3J0Y3V0cyA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFMYWJlbCA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFMZXZlbCA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFMaXZlID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYU1vZGFsID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYU11bHRpTGluZSA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFNdWx0aVNlbGVjdGFibGUgPSAnJztcbiAgICAgICAgdGhpcy5hcmlhT3JpZW50YXRpb24gPSAnJztcbiAgICAgICAgdGhpcy5hcmlhUGxhY2Vob2xkZXIgPSAnJztcbiAgICAgICAgdGhpcy5hcmlhUG9zSW5TZXQgPSAnJztcbiAgICAgICAgdGhpcy5hcmlhUHJlc3NlZCA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFSZWFkT25seSA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFSZXF1aXJlZCA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFSb2xlRGVzY3JpcHRpb24gPSAnJztcbiAgICAgICAgdGhpcy5hcmlhUm93Q291bnQgPSAnJztcbiAgICAgICAgdGhpcy5hcmlhUm93SW5kZXggPSAnJztcbiAgICAgICAgdGhpcy5hcmlhUm93U3BhbiA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFTZWxlY3RlZCA9ICcnO1xuICAgICAgICB0aGlzLmFyaWFTZXRTaXplID0gJyc7XG4gICAgICAgIHRoaXMuYXJpYVNvcnQgPSAnJztcbiAgICAgICAgdGhpcy5hcmlhVmFsdWVNYXggPSAnJztcbiAgICAgICAgdGhpcy5hcmlhVmFsdWVNaW4gPSAnJztcbiAgICAgICAgdGhpcy5hcmlhVmFsdWVOb3cgPSAnJztcbiAgICAgICAgdGhpcy5hcmlhVmFsdWVUZXh0ID0gJyc7XG4gICAgICAgIHRoaXMucm9sZSA9ICcnO1xuICAgICAgICB0aGlzLmZvcm0gPSBudWxsO1xuICAgICAgICB0aGlzLmxhYmVscyA9IFtdO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uTWVzc2FnZSA9ICcnO1xuICAgICAgICB0aGlzLnZhbGlkaXR5ID0ge307XG4gICAgICAgIHRoaXMud2lsbFZhbGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fX2hvc3QgPSBfaG9zdDtcbiAgICB9XG4gICAgY2hlY2tWYWxpZGl0eSgpIHtcbiAgICAgICAgLy8gVE9ETyhhdWd1c3RqaykgQ29uc2lkZXIgYWN0dWFsbHkgaW1wbGVtZW50aW5nIGxvZ2ljLlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2xpdC9saXQvaXNzdWVzLzM3NDBcbiAgICAgICAgY29uc29sZS53YXJuKCdgRWxlbWVudEludGVybmFscy5jaGVja1ZhbGlkaXR5KClgIHdhcyBjYWxsZWQgb24gdGhlIHNlcnZlci4nICtcbiAgICAgICAgICAgICdUaGlzIG1ldGhvZCBhbHdheXMgcmV0dXJucyB0cnVlLicpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmVwb3J0VmFsaWRpdHkoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBzZXRGb3JtVmFsdWUoKSB7IH1cbiAgICBzZXRWYWxpZGl0eSgpIHsgfVxufTtcbmNvbnN0IEVsZW1lbnRJbnRlcm5hbHNTaGltV2l0aFJlYWxUeXBlID0gRWxlbWVudEludGVybmFsc1NoaW07XG5leHBvcnQgeyBFbGVtZW50SW50ZXJuYWxzU2hpbVdpdGhSZWFsVHlwZSBhcyBFbGVtZW50SW50ZXJuYWxzIH07XG5leHBvcnQgY29uc3QgSFlEUkFURV9JTlRFUk5BTFNfQVRUUl9QUkVGSVggPSAnaHlkcmF0ZS1pbnRlcm5hbHMtJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVsZW1lbnQtaW50ZXJuYWxzLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIzIEdvb2dsZSBMTENcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBCU0QtMy1DbGF1c2VcbiAqL1xudmFyIF9fY2xhc3NQcml2YXRlRmllbGRTZXQgPSAodGhpcyAmJiB0aGlzLl9fY2xhc3NQcml2YXRlRmllbGRTZXQpIHx8IGZ1bmN0aW9uIChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xufTtcbnZhciBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0ID0gKHRoaXMgJiYgdGhpcy5fX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KSB8fCBmdW5jdGlvbiAocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XG59O1xudmFyIF9FdmVudF9jYW5jZWxhYmxlLCBfRXZlbnRfYnViYmxlcywgX0V2ZW50X2NvbXBvc2VkLCBfRXZlbnRfZGVmYXVsdFByZXZlbnRlZCwgX0V2ZW50X3RpbWVzdGFtcCwgX0V2ZW50X3Byb3BhZ2F0aW9uU3RvcHBlZCwgX0V2ZW50X3R5cGUsIF9FdmVudF90YXJnZXQsIF9FdmVudF9pc0JlaW5nRGlzcGF0Y2hlZCwgX2EsIF9DdXN0b21FdmVudF9kZXRhaWwsIF9iO1xuY29uc3QgaXNDYXB0dXJlRXZlbnRMaXN0ZW5lciA9IChvcHRpb25zKSA9PiAodHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJyA/IG9wdGlvbnMgOiBvcHRpb25zPy5jYXB0dXJlID8/IGZhbHNlKTtcbi8vIEV2ZW50IHBoYXNlc1xuY29uc3QgTk9ORSA9IDA7XG5jb25zdCBDQVBUVVJJTkdfUEhBU0UgPSAxO1xuY29uc3QgQVRfVEFSR0VUID0gMjtcbmNvbnN0IEJVQkJMSU5HX1BIQVNFID0gMztcbi8vIFNoaW0gdGhlIGdsb2JhbCBFdmVudFRhcmdldCBvYmplY3RcbmNvbnN0IEV2ZW50VGFyZ2V0U2hpbSA9IGNsYXNzIEV2ZW50VGFyZ2V0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fX2V2ZW50TGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl9fY2FwdHVyZUV2ZW50TGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIH1cbiAgICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayA9PT0gdW5kZWZpbmVkIHx8IGNhbGxiYWNrID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZlbnRMaXN0ZW5lcnNNYXAgPSBpc0NhcHR1cmVFdmVudExpc3RlbmVyKG9wdGlvbnMpXG4gICAgICAgICAgICA/IHRoaXMuX19jYXB0dXJlRXZlbnRMaXN0ZW5lcnNcbiAgICAgICAgICAgIDogdGhpcy5fX2V2ZW50TGlzdGVuZXJzO1xuICAgICAgICBsZXQgZXZlbnRMaXN0ZW5lcnMgPSBldmVudExpc3RlbmVyc01hcC5nZXQodHlwZSk7XG4gICAgICAgIGlmIChldmVudExpc3RlbmVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBldmVudExpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV2ZW50TGlzdGVuZXJzTWFwLnNldCh0eXBlLCBldmVudExpc3RlbmVycyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZlbnRMaXN0ZW5lcnMuaGFzKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRPcHRpb25zID0gdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmIG9wdGlvbnMgPyBvcHRpb25zIDoge307XG4gICAgICAgIG5vcm1hbGl6ZWRPcHRpb25zLnNpZ25hbD8uYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCAoKSA9PiB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpKTtcbiAgICAgICAgZXZlbnRMaXN0ZW5lcnMuc2V0KGNhbGxiYWNrLCBub3JtYWxpemVkT3B0aW9ucyA/PyB7fSk7XG4gICAgfVxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrID09PSB1bmRlZmluZWQgfHwgY2FsbGJhY2sgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBldmVudExpc3RlbmVyc01hcCA9IGlzQ2FwdHVyZUV2ZW50TGlzdGVuZXIob3B0aW9ucylcbiAgICAgICAgICAgID8gdGhpcy5fX2NhcHR1cmVFdmVudExpc3RlbmVyc1xuICAgICAgICAgICAgOiB0aGlzLl9fZXZlbnRMaXN0ZW5lcnM7XG4gICAgICAgIGNvbnN0IGV2ZW50TGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnNNYXAuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoZXZlbnRMaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXZlbnRMaXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmICghZXZlbnRMaXN0ZW5lcnMuc2l6ZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50TGlzdGVuZXJzTWFwLmRlbGV0ZSh0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBkaXNwYXRjaEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvbXBvc2VkUGF0aCA9IFt0aGlzXTtcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuX19ldmVudFRhcmdldFBhcmVudDtcbiAgICAgICAgaWYgKGV2ZW50LmNvbXBvc2VkKSB7XG4gICAgICAgICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgY29tcG9zZWRQYXRoLnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQuX19ldmVudFRhcmdldFBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBldmVudCBpcyBub3QgY29tcG9zZWQgYW5kIHRoZSBldmVudCB3YXMgZGlzcGF0Y2hlZCBpbnNpZGVcbiAgICAgICAgICAgIC8vIHNoYWRvdyBET00sIHdlIG5lZWQgdG8gc3RvcCBiZWZvcmUgdGhlIGhvc3Qgb2YgdGhlIHNoYWRvdyBET00uXG4gICAgICAgICAgICB3aGlsZSAocGFyZW50ICYmIHBhcmVudCAhPT0gdGhpcy5fX2hvc3QpIHtcbiAgICAgICAgICAgICAgICBjb21wb3NlZFBhdGgucHVzaChwYXJlbnQpO1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5fX2V2ZW50VGFyZ2V0UGFyZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gcGF0Y2ggdmFyaW91cyBwcm9wZXJ0aWVzIHRoYXQgd291bGQgZWl0aGVyIGJlIGVtcHR5IG9yIHdyb25nXG4gICAgICAgIC8vIGluIHRoaXMgc2NlbmFyaW8uXG4gICAgICAgIGxldCBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgICAgICAgbGV0IHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICAgICAgICBsZXQgZXZlbnRQaGFzZSA9IE5PTkU7XG4gICAgICAgIGxldCB0YXJnZXQgPSBudWxsO1xuICAgICAgICBsZXQgdG1wVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgbGV0IGN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgICAgICBjb25zdCBvcmlnaW5hbFN0b3BQcm9wYWdhdGlvbiA9IGV2ZW50LnN0b3BQcm9wYWdhdGlvbjtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxTdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gPSBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb247XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGV2ZW50LCB7XG4gICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQgPz8gdG1wVGFyZ2V0O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLi4uZW51bWVyYWJsZVByb3BlcnR5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNyY0VsZW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAuLi5lbnVtZXJhYmxlUHJvcGVydHksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3VycmVudFRhcmdldDoge1xuICAgICAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRUYXJnZXQ7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAuLi5lbnVtZXJhYmxlUHJvcGVydHksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnRQaGFzZToge1xuICAgICAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50UGhhc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAuLi5lbnVtZXJhYmxlUHJvcGVydHksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcG9zZWRQYXRoOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICgpID0+IGNvbXBvc2VkUGF0aCxcbiAgICAgICAgICAgICAgICAuLi5lbnVtZXJhYmxlUHJvcGVydHksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcFByb3BhZ2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxTdG9wUHJvcGFnYXRpb24uY2FsbChldmVudCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAuLi5lbnVtZXJhYmxlUHJvcGVydHksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxTdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24uY2FsbChldmVudCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAuLi5lbnVtZXJhYmxlUHJvcGVydHksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gQW4gZXZlbnQgaGFuZGxlciBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24sIGFuIG9iamVjdCB3aXRoIGEgaGFuZGxlRXZlbnRcbiAgICAgICAgLy8gbWV0aG9kIG9yIG51bGwuIFRoaXMgZnVuY3Rpb24gdGFrZXMgY2FyZSB0byBjYWxsIHRoZSBldmVudCBoYW5kbGVyXG4gICAgICAgIC8vIGNvcnJlY3RseS5cbiAgICAgICAgY29uc3QgaW52b2tlRXZlbnRMaXN0ZW5lciA9IChsaXN0ZW5lciwgb3B0aW9ucywgZXZlbnRMaXN0ZW5lck1hcCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBsaXN0ZW5lcj8uaGFuZGxlRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5oYW5kbGVFdmVudChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5vbmNlKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lck1hcC5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBXaGVuIGFuIGV2ZW50IGlzIGZpbmlzaGVkIGJlaW5nIGRpc3BhdGNoZWQsIHdoaWNoIGNhbiBiZSBhZnRlciB0aGUgZXZlbnRcbiAgICAgICAgLy8gdHJlZSBoYXMgYmVlbiB0cmF2ZXJzZWQgb3Igc3RvcFByb3BhZ2F0aW9uL3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiBoYXNcbiAgICAgICAgLy8gYmVlbiBjYWxsZWQuIE9uY2UgdGhhdCBpcyB0aGUgY2FzZSwgdGhlIGN1cnJlbnRUYXJnZXQgYW5kIGV2ZW50UGhhc2VcbiAgICAgICAgLy8gbmVlZCB0byBiZSByZXNldCBhbmQgYSB2YWx1ZSwgcmVwcmVzZW50aW5nIHdoZXRoZXIgdGhlIGV2ZW50IGhhcyBub3RcbiAgICAgICAgLy8gYmVlbiBwcmV2ZW50ZWQsIG5lZWRzIHRvIGJlIHJldHVybmVkLlxuICAgICAgICBjb25zdCBmaW5pc2hEaXNwYXRjaCA9ICgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgICAgICAgICAgZXZlbnRQaGFzZSA9IE5PTkU7XG4gICAgICAgICAgICByZXR1cm4gIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgICAgIH07XG4gICAgICAgIC8vIEFuIGV2ZW50IHN0YXJ0cyB3aXRoIHRoZSBjYXB0dXJlIG9yZGVyLCB3aGVyZSBpdCBzdGFydHMgZnJvbSB0aGUgdG9wLlxuICAgICAgICAvLyBUaGlzIGlzIGRvbmUgZXZlbiBpZiBidWJibGVzIGlzIHNldCB0byBmYWxzZSwgd2hpY2ggaXMgdGhlIGRlZmF1bHQuXG4gICAgICAgIGNvbnN0IGNhcHR1cmVFdmVudFBhdGggPSBjb21wb3NlZFBhdGguc2xpY2UoKS5yZXZlcnNlKCk7XG4gICAgICAgIC8vIElmIHRoZSBldmVudCB0YXJnZXQsIHdoaWNoIGRpc3BhdGNoZXMgdGhlIGV2ZW50LCBpcyBlaXRoZXIgaW4gdGhlIGxpZ2h0IERPTVxuICAgICAgICAvLyBvciB0aGUgZXZlbnQgaXMgbm90IGNvbXBvc2VkLCB0aGUgdGFyZ2V0IGlzIGFsd2F5cyBpdHNlbGYuIElmIHRoYXQgaXMgbm90XG4gICAgICAgIC8vIHRoZSBjYXNlLCB0aGUgdGFyZ2V0IG5lZWRzIHRvIGJlIHJldGFyZ2V0ZWQ6IGh0dHBzOi8vZG9tLnNwZWMud2hhdHdnLm9yZy8jcmV0YXJnZXRcbiAgICAgICAgdGFyZ2V0ID0gIXRoaXMuX19ob3N0IHx8ICFldmVudC5jb21wb3NlZCA/IHRoaXMgOiBudWxsO1xuICAgICAgICBjb25zdCByZXRhcmdldCA9IChldmVudFRhcmdldHMpID0+IHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhc1xuICAgICAgICAgICAgdG1wVGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlICh0bXBUYXJnZXQuX19ob3N0ICYmIGV2ZW50VGFyZ2V0cy5pbmNsdWRlcyh0bXBUYXJnZXQuX19ob3N0KSkge1xuICAgICAgICAgICAgICAgIHRtcFRhcmdldCA9IHRtcFRhcmdldC5fX2hvc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGZvciAoY29uc3QgZXZlbnRUYXJnZXQgb2YgY2FwdHVyZUV2ZW50UGF0aCkge1xuICAgICAgICAgICAgaWYgKCF0YXJnZXQgJiYgKCF0bXBUYXJnZXQgfHwgdG1wVGFyZ2V0ID09PSBldmVudFRhcmdldC5fX2hvc3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0YXJnZXQoY2FwdHVyZUV2ZW50UGF0aC5zbGljZShjYXB0dXJlRXZlbnRQYXRoLmluZGV4T2YoZXZlbnRUYXJnZXQpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0ID0gZXZlbnRUYXJnZXQ7XG4gICAgICAgICAgICBldmVudFBoYXNlID0gZXZlbnRUYXJnZXQgPT09IGV2ZW50LnRhcmdldCA/IEFUX1RBUkdFVCA6IENBUFRVUklOR19QSEFTRTtcbiAgICAgICAgICAgIGNvbnN0IGNhcHR1cmVFdmVudExpc3RlbmVycyA9IGV2ZW50VGFyZ2V0Ll9fY2FwdHVyZUV2ZW50TGlzdGVuZXJzLmdldChldmVudC50eXBlKTtcbiAgICAgICAgICAgIGlmIChjYXB0dXJlRXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtsaXN0ZW5lciwgb3B0aW9uc10gb2YgY2FwdHVyZUV2ZW50TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGludm9rZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIsIG9wdGlvbnMsIGNhcHR1cmVFdmVudExpc3RlbmVycyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIHN0b3BzIGFueSBmb2xsb3dpbmcgaW52b2NhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb2YgYW4gZXZlbnQgaGFuZGxlciBldmVuIG9uIHRoZSBzYW1lIGV2ZW50IHRhcmdldC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2hEaXNwYXRjaCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIEV2ZW50LnN0b3BQcm9wYWdhdGlvbigpIHN0b3BzIGFueSBmb2xsb3dpbmcgaW52b2NhdGlvblxuICAgICAgICAgICAgICAgIC8vIG9mIGFuIGV2ZW50IGhhbmRsZXIgZm9yIGFueSBmb2xsb3dpbmcgZXZlbnQgdGFyZ2V0cy5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoRGlzcGF0Y2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBidWJibGVFdmVudFBhdGggPSBldmVudC5idWJibGVzID8gY29tcG9zZWRQYXRoIDogW3RoaXNdO1xuICAgICAgICB0bXBUYXJnZXQgPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50VGFyZ2V0IG9mIGJ1YmJsZUV2ZW50UGF0aCkge1xuICAgICAgICAgICAgaWYgKCF0YXJnZXQgJiZcbiAgICAgICAgICAgICAgICAoIXRtcFRhcmdldCB8fCBldmVudFRhcmdldCA9PT0gdG1wVGFyZ2V0Ll9faG9zdCkpIHtcbiAgICAgICAgICAgICAgICByZXRhcmdldChidWJibGVFdmVudFBhdGguc2xpY2UoMCwgYnViYmxlRXZlbnRQYXRoLmluZGV4T2YoZXZlbnRUYXJnZXQpICsgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudFRhcmdldCA9IGV2ZW50VGFyZ2V0O1xuICAgICAgICAgICAgZXZlbnRQaGFzZSA9IGV2ZW50VGFyZ2V0ID09PSBldmVudC50YXJnZXQgPyBBVF9UQVJHRVQgOiBCVUJCTElOR19QSEFTRTtcbiAgICAgICAgICAgIGNvbnN0IGNhcHR1cmVFdmVudExpc3RlbmVycyA9IGV2ZW50VGFyZ2V0Ll9fZXZlbnRMaXN0ZW5lcnMuZ2V0KGV2ZW50LnR5cGUpO1xuICAgICAgICAgICAgaWYgKGNhcHR1cmVFdmVudExpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2xpc3RlbmVyLCBvcHRpb25zXSBvZiBjYXB0dXJlRXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW52b2tlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lciwgb3B0aW9ucywgY2FwdHVyZUV2ZW50TGlzdGVuZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkgc3RvcHMgYW55IGZvbGxvd2luZyBpbnZvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvZiBhbiBldmVudCBoYW5kbGVyIGV2ZW4gb24gdGhlIHNhbWUgZXZlbnQgdGFyZ2V0LlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmlzaERpc3BhdGNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgc3RvcHMgYW55IGZvbGxvd2luZyBpbnZvY2F0aW9uXG4gICAgICAgICAgICAgICAgLy8gb2YgYW4gZXZlbnQgaGFuZGxlciBmb3IgYW55IGZvbGxvd2luZyBldmVudCB0YXJnZXRzLlxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2hEaXNwYXRjaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaW5pc2hEaXNwYXRjaCgpO1xuICAgIH1cbn07XG5jb25zdCBFdmVudFRhcmdldFNoaW1XaXRoUmVhbFR5cGUgPSBFdmVudFRhcmdldFNoaW07XG5leHBvcnQgeyBFdmVudFRhcmdldFNoaW1XaXRoUmVhbFR5cGUgYXMgRXZlbnRUYXJnZXQsIEV2ZW50VGFyZ2V0U2hpbVdpdGhSZWFsVHlwZSBhcyBFdmVudFRhcmdldFNoaW0sIH07XG5jb25zdCBlbnVtZXJhYmxlUHJvcGVydHkgPSB7IF9fcHJvdG9fXzogbnVsbCB9O1xuZW51bWVyYWJsZVByb3BlcnR5LmVudW1lcmFibGUgPSB0cnVlO1xuT2JqZWN0LmZyZWV6ZShlbnVtZXJhYmxlUHJvcGVydHkpO1xuLy8gVE9ETzogUmVtb3ZlIHRoaXMgd2hlbiB3ZSByZW1vdmUgc3VwcG9ydCBmb3Igdm0gbW9kdWxlcyAoLS1leHBlcmltZW50YWwtdm0tbW9kdWxlcykuXG5jb25zdCBFdmVudFNoaW0gPSAoX2EgPSBjbGFzcyBFdmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHR5cGUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAgICAgX0V2ZW50X2NhbmNlbGFibGUuc2V0KHRoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgIF9FdmVudF9idWJibGVzLnNldCh0aGlzLCBmYWxzZSk7XG4gICAgICAgICAgICBfRXZlbnRfY29tcG9zZWQuc2V0KHRoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgIF9FdmVudF9kZWZhdWx0UHJldmVudGVkLnNldCh0aGlzLCBmYWxzZSk7XG4gICAgICAgICAgICBfRXZlbnRfdGltZXN0YW1wLnNldCh0aGlzLCBEYXRlLm5vdygpKTtcbiAgICAgICAgICAgIF9FdmVudF9wcm9wYWdhdGlvblN0b3BwZWQuc2V0KHRoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgIF9FdmVudF90eXBlLnNldCh0aGlzLCB2b2lkIDApO1xuICAgICAgICAgICAgX0V2ZW50X3RhcmdldC5zZXQodGhpcywgdm9pZCAwKTtcbiAgICAgICAgICAgIF9FdmVudF9pc0JlaW5nRGlzcGF0Y2hlZC5zZXQodGhpcywgdm9pZCAwKTtcbiAgICAgICAgICAgIHRoaXMuTk9ORSA9IE5PTkU7XG4gICAgICAgICAgICB0aGlzLkNBUFRVUklOR19QSEFTRSA9IENBUFRVUklOR19QSEFTRTtcbiAgICAgICAgICAgIHRoaXMuQVRfVEFSR0VUID0gQVRfVEFSR0VUO1xuICAgICAgICAgICAgdGhpcy5CVUJCTElOR19QSEFTRSA9IEJVQkJMSU5HX1BIQVNFO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgdHlwZSBhcmd1bWVudCBtdXN0IGJlIHNwZWNpZmllZGApO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0JyB8fCAhb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIFwib3B0aW9uc1wiIGFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IGJ1YmJsZXMsIGNhbmNlbGFibGUsIGNvbXBvc2VkIH0gPSBvcHRpb25zO1xuICAgICAgICAgICAgX19jbGFzc1ByaXZhdGVGaWVsZFNldCh0aGlzLCBfRXZlbnRfY2FuY2VsYWJsZSwgISFjYW5jZWxhYmxlLCBcImZcIik7XG4gICAgICAgICAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHRoaXMsIF9FdmVudF9idWJibGVzLCAhIWJ1YmJsZXMsIFwiZlwiKTtcbiAgICAgICAgICAgIF9fY2xhc3NQcml2YXRlRmllbGRTZXQodGhpcywgX0V2ZW50X2NvbXBvc2VkLCAhIWNvbXBvc2VkLCBcImZcIik7XG4gICAgICAgICAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHRoaXMsIF9FdmVudF90eXBlLCBgJHt0eXBlfWAsIFwiZlwiKTtcbiAgICAgICAgICAgIF9fY2xhc3NQcml2YXRlRmllbGRTZXQodGhpcywgX0V2ZW50X3RhcmdldCwgbnVsbCwgXCJmXCIpO1xuICAgICAgICAgICAgX19jbGFzc1ByaXZhdGVGaWVsZFNldCh0aGlzLCBfRXZlbnRfaXNCZWluZ0Rpc3BhdGNoZWQsIGZhbHNlLCBcImZcIik7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdEV2ZW50KF90eXBlLCBfYnViYmxlcywgX2NhbmNlbGFibGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZlbnREZWZhdWx0KCkge1xuICAgICAgICAgICAgX19jbGFzc1ByaXZhdGVGaWVsZFNldCh0aGlzLCBfRXZlbnRfZGVmYXVsdFByZXZlbnRlZCwgdHJ1ZSwgXCJmXCIpO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0YXJnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfRXZlbnRfdGFyZ2V0LCBcImZcIik7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGN1cnJlbnRUYXJnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfRXZlbnRfdGFyZ2V0LCBcImZcIik7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNyY0VsZW1lbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfRXZlbnRfdGFyZ2V0LCBcImZcIik7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfRXZlbnRfdHlwZSwgXCJmXCIpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBjYW5jZWxhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX0V2ZW50X2NhbmNlbGFibGUsIFwiZlwiKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZGVmYXVsdFByZXZlbnRlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9FdmVudF9jYW5jZWxhYmxlLCBcImZcIikgJiYgX19jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfRXZlbnRfZGVmYXVsdFByZXZlbnRlZCwgXCJmXCIpO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0aW1lU3RhbXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfRXZlbnRfdGltZXN0YW1wLCBcImZcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9zZWRQYXRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX0V2ZW50X2lzQmVpbmdEaXNwYXRjaGVkLCBcImZcIikgPyBbX19jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfRXZlbnRfdGFyZ2V0LCBcImZcIildIDogW107XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHJldHVyblZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuICFfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9FdmVudF9jYW5jZWxhYmxlLCBcImZcIikgfHwgIV9fY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX0V2ZW50X2RlZmF1bHRQcmV2ZW50ZWQsIFwiZlwiKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYnViYmxlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9FdmVudF9idWJibGVzLCBcImZcIik7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNvbXBvc2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX0V2ZW50X2NvbXBvc2VkLCBcImZcIik7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGV2ZW50UGhhc2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfRXZlbnRfaXNCZWluZ0Rpc3BhdGNoZWQsIFwiZlwiKSA/IF9hLkFUX1RBUkdFVCA6IF9hLk5PTkU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNhbmNlbEJ1YmJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9FdmVudF9wcm9wYWdhdGlvblN0b3BwZWQsIFwiZlwiKTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2FuY2VsQnViYmxlKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHRoaXMsIF9FdmVudF9wcm9wYWdhdGlvblN0b3BwZWQsIHRydWUsIFwiZlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgICAgICAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHRoaXMsIF9FdmVudF9wcm9wYWdhdGlvblN0b3BwZWQsIHRydWUsIFwiZlwiKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXNUcnVzdGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBfRXZlbnRfY2FuY2VsYWJsZSA9IG5ldyBXZWFrTWFwKCksXG4gICAgX0V2ZW50X2J1YmJsZXMgPSBuZXcgV2Vha01hcCgpLFxuICAgIF9FdmVudF9jb21wb3NlZCA9IG5ldyBXZWFrTWFwKCksXG4gICAgX0V2ZW50X2RlZmF1bHRQcmV2ZW50ZWQgPSBuZXcgV2Vha01hcCgpLFxuICAgIF9FdmVudF90aW1lc3RhbXAgPSBuZXcgV2Vha01hcCgpLFxuICAgIF9FdmVudF9wcm9wYWdhdGlvblN0b3BwZWQgPSBuZXcgV2Vha01hcCgpLFxuICAgIF9FdmVudF90eXBlID0gbmV3IFdlYWtNYXAoKSxcbiAgICBfRXZlbnRfdGFyZ2V0ID0gbmV3IFdlYWtNYXAoKSxcbiAgICBfRXZlbnRfaXNCZWluZ0Rpc3BhdGNoZWQgPSBuZXcgV2Vha01hcCgpLFxuICAgIF9hLk5PTkUgPSBOT05FLFxuICAgIF9hLkNBUFRVUklOR19QSEFTRSA9IENBUFRVUklOR19QSEFTRSxcbiAgICBfYS5BVF9UQVJHRVQgPSBBVF9UQVJHRVQsXG4gICAgX2EuQlVCQkxJTkdfUEhBU0UgPSBCVUJCTElOR19QSEFTRSxcbiAgICBfYSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhFdmVudFNoaW0ucHJvdG90eXBlLCB7XG4gICAgaW5pdEV2ZW50OiBlbnVtZXJhYmxlUHJvcGVydHksXG4gICAgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOiBlbnVtZXJhYmxlUHJvcGVydHksXG4gICAgcHJldmVudERlZmF1bHQ6IGVudW1lcmFibGVQcm9wZXJ0eSxcbiAgICB0YXJnZXQ6IGVudW1lcmFibGVQcm9wZXJ0eSxcbiAgICBjdXJyZW50VGFyZ2V0OiBlbnVtZXJhYmxlUHJvcGVydHksXG4gICAgc3JjRWxlbWVudDogZW51bWVyYWJsZVByb3BlcnR5LFxuICAgIHR5cGU6IGVudW1lcmFibGVQcm9wZXJ0eSxcbiAgICBjYW5jZWxhYmxlOiBlbnVtZXJhYmxlUHJvcGVydHksXG4gICAgZGVmYXVsdFByZXZlbnRlZDogZW51bWVyYWJsZVByb3BlcnR5LFxuICAgIHRpbWVTdGFtcDogZW51bWVyYWJsZVByb3BlcnR5LFxuICAgIGNvbXBvc2VkUGF0aDogZW51bWVyYWJsZVByb3BlcnR5LFxuICAgIHJldHVyblZhbHVlOiBlbnVtZXJhYmxlUHJvcGVydHksXG4gICAgYnViYmxlczogZW51bWVyYWJsZVByb3BlcnR5LFxuICAgIGNvbXBvc2VkOiBlbnVtZXJhYmxlUHJvcGVydHksXG4gICAgZXZlbnRQaGFzZTogZW51bWVyYWJsZVByb3BlcnR5LFxuICAgIGNhbmNlbEJ1YmJsZTogZW51bWVyYWJsZVByb3BlcnR5LFxuICAgIHN0b3BQcm9wYWdhdGlvbjogZW51bWVyYWJsZVByb3BlcnR5LFxuICAgIGlzVHJ1c3RlZDogZW51bWVyYWJsZVByb3BlcnR5LFxufSk7XG4vLyBUT0RPOiBSZW1vdmUgdGhpcyB3aGVuIHdlIHJlbW92ZSBzdXBwb3J0IGZvciB2bSBtb2R1bGVzICgtLWV4cGVyaW1lbnRhbC12bS1tb2R1bGVzKS5cbmNvbnN0IEN1c3RvbUV2ZW50U2hpbSA9IChfYiA9IGNsYXNzIEN1c3RvbUV2ZW50IGV4dGVuZHMgRXZlbnRTaGltIHtcbiAgICAgICAgY29uc3RydWN0b3IodHlwZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgICBzdXBlcih0eXBlLCBvcHRpb25zKTtcbiAgICAgICAgICAgIF9DdXN0b21FdmVudF9kZXRhaWwuc2V0KHRoaXMsIHZvaWQgMCk7XG4gICAgICAgICAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHRoaXMsIF9DdXN0b21FdmVudF9kZXRhaWwsIG9wdGlvbnM/LmRldGFpbCA/PyBudWxsLCBcImZcIik7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdEN1c3RvbUV2ZW50KF90eXBlLCBfYnViYmxlcywgX2NhbmNlbGFibGUsIF9kZXRhaWwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZGV0YWlsKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX0N1c3RvbUV2ZW50X2RldGFpbCwgXCJmXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBfQ3VzdG9tRXZlbnRfZGV0YWlsID0gbmV3IFdlYWtNYXAoKSxcbiAgICBfYik7XG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhDdXN0b21FdmVudFNoaW0ucHJvdG90eXBlLCB7XG4gICAgZGV0YWlsOiBlbnVtZXJhYmxlUHJvcGVydHksXG59KTtcbmNvbnN0IEV2ZW50U2hpbVdpdGhSZWFsVHlwZSA9IEV2ZW50U2hpbTtcbmNvbnN0IEN1c3RvbUV2ZW50U2hpbVdpdGhSZWFsVHlwZSA9IEN1c3RvbUV2ZW50U2hpbTtcbmV4cG9ydCB7IEV2ZW50U2hpbVdpdGhSZWFsVHlwZSBhcyBFdmVudCwgRXZlbnRTaGltV2l0aFJlYWxUeXBlIGFzIEV2ZW50U2hpbSwgQ3VzdG9tRXZlbnRTaGltV2l0aFJlYWxUeXBlIGFzIEN1c3RvbUV2ZW50LCBDdXN0b21FdmVudFNoaW1XaXRoUmVhbFR5cGUgYXMgQ3VzdG9tRXZlbnRTaGltLCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXZlbnRzLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBCU0QtMy1DbGF1c2VcbiAqL1xuaW1wb3J0IHsgRWxlbWVudEludGVybmFsc1NoaW0gfSBmcm9tICcuL2xpYi9lbGVtZW50LWludGVybmFscy5qcyc7XG5pbXBvcnQgeyBFdmVudFRhcmdldFNoaW0sIEV2ZW50U2hpbSwgQ3VzdG9tRXZlbnRTaGltLCB9IGZyb20gJy4vbGliL2V2ZW50cy5qcyc7XG5leHBvcnQgeyBhcmlhTWl4aW5BdHRyaWJ1dGVzLCBFbGVtZW50SW50ZXJuYWxzLCBIWURSQVRFX0lOVEVSTkFMU19BVFRSX1BSRUZJWCwgfSBmcm9tICcuL2xpYi9lbGVtZW50LWludGVybmFscy5qcyc7XG5leHBvcnQgeyBDdXN0b21FdmVudCwgRXZlbnQsIEV2ZW50VGFyZ2V0IH0gZnJvbSAnLi9saWIvZXZlbnRzLmpzJztcbi8vIEluIGFuIGVtcHR5IE5vZGUuanMgdm0sIHdlIG5lZWQgdG8gcGF0Y2ggdGhlIGdsb2JhbCBjb250ZXh0LlxuLy8gVE9ETzogUmVtb3ZlIHRoZXNlIGdsb2JhbFRoaXMgYXNzaWdubWVudHMgd2hlbiB3ZSByZW1vdmUgc3VwcG9ydFxuLy8gZm9yIHZtIG1vZHVsZXMgKC0tZXhwZXJpbWVudGFsLXZtLW1vZHVsZXMpLlxuZ2xvYmFsVGhpcy5FdmVudCA/Pz0gRXZlbnRTaGltO1xuZ2xvYmFsVGhpcy5DdXN0b21FdmVudCA/Pz0gQ3VzdG9tRXZlbnRTaGltO1xuY29uc3QgYXR0cmlidXRlcyA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCBhdHRyaWJ1dGVzRm9yRWxlbWVudCA9IChlbGVtZW50KSA9PiB7XG4gICAgbGV0IGF0dHJzID0gYXR0cmlidXRlcy5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGF0dHJzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXR0cmlidXRlcy5zZXQoZWxlbWVudCwgKGF0dHJzID0gbmV3IE1hcCgpKSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbn07XG4vLyBUaGUgdHlwaW5ncyBhcm91bmQgdGhlIGV4cG9ydHMgYmVsb3cgYXJlIGEgbGl0dGxlIGZ1bmt5OlxuLy9cbi8vIDEuIFdlIHdhbnQgdGhlIGBuYW1lYCBvZiB0aGUgc2hpbSBjbGFzc2VzIHRvIG1hdGNoIHRoZSByZWFsIG9uZXMgYXQgcnVudGltZSxcbi8vICAgIGhlbmNlIGUuZy4gYGNsYXNzIEVsZW1lbnRgLlxuLy8gMi4gV2UgY2FuJ3Qgc2hhZG93IHRoZSBnbG9iYWwgdHlwZXMgd2l0aCBhIHNpbXBsZSBjbGFzcyBkZWNsYXJhdGlvbiwgYmVjYXVzZVxuLy8gICAgdGhlbiB3ZSBjYW4ndCByZWZlcmVuY2UgdGhlIGdsb2JhbCB0eXBlcyBmb3IgY2FzdGluZywgaGVuY2UgZS5nLlxuLy8gICAgYGNvbnN0IEVsZW1lbnRTaGltID0gY2xhc3MgRWxlbWVudGAuXG4vLyAzLiBXZSB3YW50IHRvIGV4cG9ydCB0aGUgY2xhc3NlcyB0eXBlZCBhcyB0aGUgcmVhbCBvbmVzLCBoZW5jZSBlLmcuXG4vLyAgICBgY29uc3QgRWxlbWVudFNoaW1XaXRoUmVhbFR5cGUgPSBFbGVtZW50U2hpbSBhcyBvYmplY3QgYXMgdHlwZW9mIEVsZW1lbnQ7YC5cbi8vIDQuIFdlIHdhbnQgdGhlIGV4cG9ydGVkIG5hbWVzIHRvIG1hdGNoIHRoZSByZWFsIG9uZXMsIGhlbmNlIGUuZy5cbi8vICAgIGBleHBvcnQge0VsZW1lbnRTaGltV2l0aFJlYWxUeXBlIGFzIEVsZW1lbnR9YC5cbmNvbnN0IEVsZW1lbnRTaGltID0gY2xhc3MgRWxlbWVudCBleHRlbmRzIEV2ZW50VGFyZ2V0U2hpbSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuX19zaGFkb3dSb290TW9kZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX19zaGFkb3dSb290ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fX2ludGVybmFscyA9IG51bGw7XG4gICAgfVxuICAgIGdldCBhdHRyaWJ1dGVzKCkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShhdHRyaWJ1dGVzRm9yRWxlbWVudCh0aGlzKSkubWFwKChbbmFtZSwgdmFsdWVdKSA9PiAoe1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICB9KSk7XG4gICAgfVxuICAgIGdldCBzaGFkb3dSb290KCkge1xuICAgICAgICBpZiAodGhpcy5fX3NoYWRvd1Jvb3RNb2RlID09PSAnY2xvc2VkJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX19zaGFkb3dSb290O1xuICAgIH1cbiAgICBnZXQgbG9jYWxOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5fX2xvY2FsTmFtZTtcbiAgICB9XG4gICAgZ2V0IHRhZ05hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsTmFtZT8udG9VcHBlckNhc2UoKTtcbiAgICB9XG4gICAgc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIC8vIEVtdWxhdGUgYnJvd3NlciBiZWhhdmlvciB0aGF0IHNpbGVudGx5IGNhc3RzIGFsbCB2YWx1ZXMgdG8gc3RyaW5nLiBFLmcuXG4gICAgICAgIC8vIGA0MmAgYmVjb21lcyBgXCI0MlwiYCBhbmQgYHt9YCBiZWNvbWVzIGBcIltvYmplY3QgT2JqZWN0XVwiXCJgLlxuICAgICAgICBhdHRyaWJ1dGVzRm9yRWxlbWVudCh0aGlzKS5zZXQobmFtZSwgU3RyaW5nKHZhbHVlKSk7XG4gICAgfVxuICAgIHJlbW92ZUF0dHJpYnV0ZShuYW1lKSB7XG4gICAgICAgIGF0dHJpYnV0ZXNGb3JFbGVtZW50KHRoaXMpLmRlbGV0ZShuYW1lKTtcbiAgICB9XG4gICAgdG9nZ2xlQXR0cmlidXRlKG5hbWUsIGZvcmNlKSB7XG4gICAgICAgIC8vIFN0ZXBzIHJlZmVyZW5jZSBodHRwczovL2RvbS5zcGVjLndoYXR3Zy5vcmcvI2RvbS1lbGVtZW50LXRvZ2dsZWF0dHJpYnV0ZVxuICAgICAgICBpZiAodGhpcy5oYXNBdHRyaWJ1dGUobmFtZSkpIHtcbiAgICAgICAgICAgIC8vIFN0ZXAgNVxuICAgICAgICAgICAgaWYgKGZvcmNlID09PSB1bmRlZmluZWQgfHwgIWZvcmNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gU3RlcCA0XG4gICAgICAgICAgICBpZiAoZm9yY2UgPT09IHVuZGVmaW5lZCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIC8vIFN0ZXAgNC4xXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgJycpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU3RlcCA0LjJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RlcCA2XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBoYXNBdHRyaWJ1dGUobmFtZSkge1xuICAgICAgICByZXR1cm4gYXR0cmlidXRlc0ZvckVsZW1lbnQodGhpcykuaGFzKG5hbWUpO1xuICAgIH1cbiAgICBhdHRhY2hTaGFkb3coaW5pdCkge1xuICAgICAgICBjb25zdCBzaGFkb3dSb290ID0geyBob3N0OiB0aGlzIH07XG4gICAgICAgIHRoaXMuX19zaGFkb3dSb290TW9kZSA9IGluaXQubW9kZTtcbiAgICAgICAgaWYgKGluaXQgJiYgaW5pdC5tb2RlID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgIHRoaXMuX19zaGFkb3dSb290ID0gc2hhZG93Um9vdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2hhZG93Um9vdDtcbiAgICB9XG4gICAgYXR0YWNoSW50ZXJuYWxzKCkge1xuICAgICAgICBpZiAodGhpcy5fX2ludGVybmFscyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZXhlY3V0ZSAnYXR0YWNoSW50ZXJuYWxzJyBvbiAnSFRNTEVsZW1lbnQnOiBgICtcbiAgICAgICAgICAgICAgICBgRWxlbWVudEludGVybmFscyBmb3IgdGhlIHNwZWNpZmllZCBlbGVtZW50IHdhcyBhbHJlYWR5IGF0dGFjaGVkLmApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGludGVybmFscyA9IG5ldyBFbGVtZW50SW50ZXJuYWxzU2hpbSh0aGlzKTtcbiAgICAgICAgdGhpcy5fX2ludGVybmFscyA9IGludGVybmFscztcbiAgICAgICAgcmV0dXJuIGludGVybmFscztcbiAgICB9XG4gICAgZ2V0QXR0cmlidXRlKG5hbWUpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzRm9yRWxlbWVudCh0aGlzKS5nZXQobmFtZSk7XG4gICAgICAgIHJldHVybiB2YWx1ZSA/PyBudWxsO1xuICAgIH1cbn07XG5jb25zdCBFbGVtZW50U2hpbVdpdGhSZWFsVHlwZSA9IEVsZW1lbnRTaGltO1xuZXhwb3J0IHsgRWxlbWVudFNoaW1XaXRoUmVhbFR5cGUgYXMgRWxlbWVudCB9O1xuY29uc3QgSFRNTEVsZW1lbnRTaGltID0gY2xhc3MgSFRNTEVsZW1lbnQgZXh0ZW5kcyBFbGVtZW50U2hpbSB7XG59O1xuY29uc3QgSFRNTEVsZW1lbnRTaGltV2l0aFJlYWxUeXBlID0gSFRNTEVsZW1lbnRTaGltO1xuZXhwb3J0IHsgSFRNTEVsZW1lbnRTaGltV2l0aFJlYWxUeXBlIGFzIEhUTUxFbGVtZW50IH07XG4vLyBGb3IgY29udmVuaWVuY2UsIHdlIHByb3ZpZGUgYSBnbG9iYWwgaW5zdGFuY2Ugb2YgYSBIVE1MRWxlbWVudCBhcyBhbiBldmVudFxuLy8gdGFyZ2V0LiBUaGlzIGZhY2lsaXRhdGVzIHJlZ2lzdGVyaW5nIGdsb2JhbCBldmVudCBoYW5kbGVyc1xuLy8gKGUuZy4gZm9yIEBsaXQvY29udGV4dCBDb250ZXh0UHJvdmlkZXIpLlxuLy8gV2UgdXNlIHRoaXMgaW4gaW4gdGhlIFNTUiByZW5kZXIgZnVuY3Rpb24uXG4vLyBOb3RlLCB0aGlzIGlzIGEgYmVzcG9rZSBlbGVtZW50IGFuZCBub3Qgc2ltcGx5IGBkb2N1bWVudGAgb3IgYHdpbmRvd2Agc2luY2Vcbi8vIHVzZXIgY29kZSByZWxpZXMgb24gdGhlc2UgYmVpbmcgdW5kZWZpbmVkIGluIHRoZSBzZXJ2ZXIgZW52aXJvbm1lbnQuXG5nbG9iYWxUaGlzLmxpdFNlcnZlclJvb3QgPz89IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXcgSFRNTEVsZW1lbnRTaGltV2l0aFJlYWxUeXBlKCksICdsb2NhbE5hbWUnLCB7XG4gICAgLy8gUGF0Y2ggbG9jYWxOYW1lIChhbmQgdGFnTmFtZSkgdG8gcmV0dXJuIGEgdW5pcXVlIG5hbWUuXG4gICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gJ2xpdC1zZXJ2ZXItcm9vdCc7XG4gICAgfSxcbn0pO1xuY29uc3QgQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5U2hpbSA9IGNsYXNzIEN1c3RvbUVsZW1lbnRSZWdpc3RyeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX19kZWZpbml0aW9ucyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgZGVmaW5lKG5hbWUsIGN0b3IpIHtcbiAgICAgICAgaWYgKHRoaXMuX19kZWZpbml0aW9ucy5oYXMobmFtZSkpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJ0N1c3RvbUVsZW1lbnRSZWdpc3RyeScgYWxyZWFkeSBoYXMgXCIke25hbWV9XCIgZGVmaW5lZC4gYCArXG4gICAgICAgICAgICAgICAgICAgIGBUaGlzIG1heSBoYXZlIGJlZW4gY2F1c2VkIGJ5IGxpdmUgcmVsb2FkIG9yIGhvdCBtb2R1bGUgYCArXG4gICAgICAgICAgICAgICAgICAgIGByZXBsYWNlbWVudCBpbiB3aGljaCBjYXNlIGl0IGNhbiBiZSBzYWZlbHkgaWdub3JlZC5cXG5gICtcbiAgICAgICAgICAgICAgICAgICAgYE1ha2Ugc3VyZSB0byB0ZXN0IHlvdXIgYXBwbGljYXRpb24gd2l0aCBhIHByb2R1Y3Rpb24gYnVpbGQgYXMgYCArXG4gICAgICAgICAgICAgICAgICAgIGByZXBlYXQgcmVnaXN0cmF0aW9ucyB3aWxsIHRocm93IGluIHByb2R1Y3Rpb24uYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBleGVjdXRlICdkZWZpbmUnIG9uICdDdXN0b21FbGVtZW50UmVnaXN0cnknOiBgICtcbiAgICAgICAgICAgICAgICAgICAgYHRoZSBuYW1lIFwiJHtuYW1lfVwiIGhhcyBhbHJlYWR5IGJlZW4gdXNlZCB3aXRoIHRoaXMgcmVnaXN0cnlgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBQcm92aWRlIHRhZ05hbWUgYW5kIGxvY2FsTmFtZSBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICAgICAgY3Rvci5fX2xvY2FsTmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX19kZWZpbml0aW9ucy5zZXQobmFtZSwge1xuICAgICAgICAgICAgY3RvcixcbiAgICAgICAgICAgIC8vIE5vdGUgaXQncyBpbXBvcnRhbnQgd2UgcmVhZCBgb2JzZXJ2ZWRBdHRyaWJ1dGVzYCBpbiBjYXNlIGl0IGlzIGEgZ2V0dGVyXG4gICAgICAgICAgICAvLyB3aXRoIHNpZGUtZWZmZWN0cywgYXMgaXMgdGhlIGNhc2UgaW4gTGl0LCB3aGVyZSBpdCB0cmlnZ2VycyBjbGFzc1xuICAgICAgICAgICAgLy8gZmluYWxpemF0aW9uLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFRPRE8oYW9tYXJrcykgVG8gYmUgc3BlYyBjb21wbGlhbnQsIHdlIHNob3VsZCBhbHNvIGNhcHR1cmUgdGhlXG4gICAgICAgICAgICAvLyByZWdpc3RyYXRpb24tdGltZSBsaWZlY3ljbGUgbWV0aG9kcyBsaWtlIGBjb25uZWN0ZWRDYWxsYmFja2AuIEZvciB0aGVtXG4gICAgICAgICAgICAvLyB0byBiZSBhY3R1YWxseSBhY2Nlc3NpYmxlIHRvIGUuZy4gdGhlIExpdCBTU1IgZWxlbWVudCByZW5kZXJlciwgdGhvdWdoLFxuICAgICAgICAgICAgLy8gd2UnZCBuZWVkIHRvIGludHJvZHVjZSBhIG5ldyBBUEkgZm9yIGFjY2Vzc2luZyB0aGVtIChzaW5jZSBgZ2V0YCBvbmx5XG4gICAgICAgICAgICAvLyByZXR1cm5zIHRoZSBjb25zdHJ1Y3RvcikuXG4gICAgICAgICAgICBvYnNlcnZlZEF0dHJpYnV0ZXM6IGN0b3Iub2JzZXJ2ZWRBdHRyaWJ1dGVzID8/IFtdLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuX19kZWZpbml0aW9ucy5nZXQobmFtZSk7XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uPy5jdG9yO1xuICAgIH1cbn07XG5jb25zdCBDdXN0b21FbGVtZW50UmVnaXN0cnlTaGltV2l0aFJlYWxUeXBlID0gQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5U2hpbTtcbmV4cG9ydCB7IEN1c3RvbUVsZW1lbnRSZWdpc3RyeVNoaW1XaXRoUmVhbFR5cGUgYXMgQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5IH07XG5leHBvcnQgY29uc3QgY3VzdG9tRWxlbWVudHMgPSBuZXcgQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5U2hpbVdpdGhSZWFsVHlwZSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEJTRC0zLUNsYXVzZVxuICovXG5jb25zdCB0PWdsb2JhbFRoaXMsZT10LlNoYWRvd1Jvb3QmJih2b2lkIDA9PT10LlNoYWR5Q1NTfHx0LlNoYWR5Q1NTLm5hdGl2ZVNoYWRvdykmJlwiYWRvcHRlZFN0eWxlU2hlZXRzXCJpbiBEb2N1bWVudC5wcm90b3R5cGUmJlwicmVwbGFjZVwiaW4gQ1NTU3R5bGVTaGVldC5wcm90b3R5cGUscz1TeW1ib2woKSxvPW5ldyBXZWFrTWFwO2NsYXNzIG57Y29uc3RydWN0b3IodCxlLG8pe2lmKHRoaXMuXyRjc3NSZXN1bHQkPSEwLG8hPT1zKXRocm93IEVycm9yKFwiQ1NTUmVzdWx0IGlzIG5vdCBjb25zdHJ1Y3RhYmxlLiBVc2UgYHVuc2FmZUNTU2Agb3IgYGNzc2AgaW5zdGVhZC5cIik7dGhpcy5jc3NUZXh0PXQsdGhpcy50PWV9Z2V0IHN0eWxlU2hlZXQoKXtsZXQgdD10aGlzLm87Y29uc3Qgcz10aGlzLnQ7aWYoZSYmdm9pZCAwPT09dCl7Y29uc3QgZT12b2lkIDAhPT1zJiYxPT09cy5sZW5ndGg7ZSYmKHQ9by5nZXQocykpLHZvaWQgMD09PXQmJigodGhpcy5vPXQ9bmV3IENTU1N0eWxlU2hlZXQpLnJlcGxhY2VTeW5jKHRoaXMuY3NzVGV4dCksZSYmby5zZXQocyx0KSl9cmV0dXJuIHR9dG9TdHJpbmcoKXtyZXR1cm4gdGhpcy5jc3NUZXh0fX1jb25zdCByPXQ9Pm5ldyBuKFwic3RyaW5nXCI9PXR5cGVvZiB0P3Q6dCtcIlwiLHZvaWQgMCxzKSxpPSh0LC4uLmUpPT57Y29uc3Qgbz0xPT09dC5sZW5ndGg/dFswXTplLnJlZHVjZSgoKGUscyxvKT0+ZSsodD0+e2lmKCEwPT09dC5fJGNzc1Jlc3VsdCQpcmV0dXJuIHQuY3NzVGV4dDtpZihcIm51bWJlclwiPT10eXBlb2YgdClyZXR1cm4gdDt0aHJvdyBFcnJvcihcIlZhbHVlIHBhc3NlZCB0byAnY3NzJyBmdW5jdGlvbiBtdXN0IGJlIGEgJ2NzcycgZnVuY3Rpb24gcmVzdWx0OiBcIit0K1wiLiBVc2UgJ3Vuc2FmZUNTUycgdG8gcGFzcyBub24tbGl0ZXJhbCB2YWx1ZXMsIGJ1dCB0YWtlIGNhcmUgdG8gZW5zdXJlIHBhZ2Ugc2VjdXJpdHkuXCIpfSkocykrdFtvKzFdKSx0WzBdKTtyZXR1cm4gbmV3IG4obyx0LHMpfSxTPShzLG8pPT57aWYoZSlzLmFkb3B0ZWRTdHlsZVNoZWV0cz1vLm1hcCgodD0+dCBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQ/dDp0LnN0eWxlU2hlZXQpKTtlbHNlIGZvcihjb25zdCBlIG9mIG8pe2NvbnN0IG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpLG49dC5saXROb25jZTt2b2lkIDAhPT1uJiZvLnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsbiksby50ZXh0Q29udGVudD1lLmNzc1RleHQscy5hcHBlbmRDaGlsZChvKX19LGM9ZXx8dm9pZCAwPT09dC5DU1NTdHlsZVNoZWV0P3Q9PnQ6dD0+dCBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQ/KHQ9PntsZXQgZT1cIlwiO2Zvcihjb25zdCBzIG9mIHQuY3NzUnVsZXMpZSs9cy5jc3NUZXh0O3JldHVybiByKGUpfSkodCk6dDtleHBvcnR7biBhcyBDU1NSZXN1bHQsUyBhcyBhZG9wdFN0eWxlcyxpIGFzIGNzcyxjIGFzIGdldENvbXBhdGlibGVTdHlsZSxlIGFzIHN1cHBvcnRzQWRvcHRpbmdTdHlsZVNoZWV0cyxyIGFzIHVuc2FmZUNTU307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jc3MtdGFnLmpzLm1hcFxuIiwiaW1wb3J0e2N1c3RvbUVsZW1lbnRzIGFzIHQsSFRNTEVsZW1lbnQgYXMgc31mcm9tXCJAbGl0LWxhYnMvc3NyLWRvbS1zaGltXCI7aW1wb3J0e2dldENvbXBhdGlibGVTdHlsZSBhcyBpLGFkb3B0U3R5bGVzIGFzIGV9ZnJvbVwiLi9jc3MtdGFnLmpzXCI7ZXhwb3J0e0NTU1Jlc3VsdCxhZG9wdFN0eWxlcyxjc3MsZ2V0Q29tcGF0aWJsZVN0eWxlLHN1cHBvcnRzQWRvcHRpbmdTdHlsZVNoZWV0cyx1bnNhZmVDU1N9ZnJvbVwiLi9jc3MtdGFnLmpzXCI7Y29uc3R7aXM6cixkZWZpbmVQcm9wZXJ0eTpoLGdldE93blByb3BlcnR5RGVzY3JpcHRvcjpvLGdldE93blByb3BlcnR5TmFtZXM6bixnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6YSxnZXRQcm90b3R5cGVPZjpjfT1PYmplY3QsbD1nbG9iYWxUaGlzO2wuY3VzdG9tRWxlbWVudHM/Pz10O2NvbnN0IHA9bC50cnVzdGVkVHlwZXMsZD1wP3AuZW1wdHlTY3JpcHQ6XCJcIix1PWwucmVhY3RpdmVFbGVtZW50UG9seWZpbGxTdXBwb3J0LGY9KHQscyk9PnQsYj17dG9BdHRyaWJ1dGUodCxzKXtzd2l0Y2gocyl7Y2FzZSBCb29sZWFuOnQ9dD9kOm51bGw7YnJlYWs7Y2FzZSBPYmplY3Q6Y2FzZSBBcnJheTp0PW51bGw9PXQ/dDpKU09OLnN0cmluZ2lmeSh0KX1yZXR1cm4gdH0sZnJvbUF0dHJpYnV0ZSh0LHMpe2xldCBpPXQ7c3dpdGNoKHMpe2Nhc2UgQm9vbGVhbjppPW51bGwhPT10O2JyZWFrO2Nhc2UgTnVtYmVyOmk9bnVsbD09PXQ/bnVsbDpOdW1iZXIodCk7YnJlYWs7Y2FzZSBPYmplY3Q6Y2FzZSBBcnJheTp0cnl7aT1KU09OLnBhcnNlKHQpfWNhdGNoKHQpe2k9bnVsbH19cmV0dXJuIGl9fSx5PSh0LHMpPT4hcih0LHMpLG09e2F0dHJpYnV0ZTohMCx0eXBlOlN0cmluZyxjb252ZXJ0ZXI6YixyZWZsZWN0OiExLGhhc0NoYW5nZWQ6eX07U3ltYm9sLm1ldGFkYXRhPz89U3ltYm9sKFwibWV0YWRhdGFcIiksbC5saXRQcm9wZXJ0eU1ldGFkYXRhPz89bmV3IFdlYWtNYXA7Y2xhc3MgZyBleHRlbmRzKGdsb2JhbFRoaXMuSFRNTEVsZW1lbnQ/P3Mpe3N0YXRpYyBhZGRJbml0aWFsaXplcih0KXt0aGlzLl8kRWkoKSwodGhpcy5sPz89W10pLnB1c2godCl9c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKXtyZXR1cm4gdGhpcy5maW5hbGl6ZSgpLHRoaXMuXyRFaCYmWy4uLnRoaXMuXyRFaC5rZXlzKCldfXN0YXRpYyBjcmVhdGVQcm9wZXJ0eSh0LHM9bSl7aWYocy5zdGF0ZSYmKHMuYXR0cmlidXRlPSExKSx0aGlzLl8kRWkoKSx0aGlzLmVsZW1lbnRQcm9wZXJ0aWVzLnNldCh0LHMpLCFzLm5vQWNjZXNzb3Ipe2NvbnN0IGk9U3ltYm9sKCksZT10aGlzLmdldFByb3BlcnR5RGVzY3JpcHRvcih0LGkscyk7dm9pZCAwIT09ZSYmaCh0aGlzLnByb3RvdHlwZSx0LGUpfX1zdGF0aWMgZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHQscyxpKXtjb25zdHtnZXQ6ZSxzZXQ6cn09byh0aGlzLnByb3RvdHlwZSx0KT8/e2dldCgpe3JldHVybiB0aGlzW3NdfSxzZXQodCl7dGhpc1tzXT10fX07cmV0dXJue2dldCgpe3JldHVybiBlPy5jYWxsKHRoaXMpfSxzZXQocyl7Y29uc3QgaD1lPy5jYWxsKHRoaXMpO3IuY2FsbCh0aGlzLHMpLHRoaXMucmVxdWVzdFVwZGF0ZSh0LGgsaSl9LGNvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwfX1zdGF0aWMgZ2V0UHJvcGVydHlPcHRpb25zKHQpe3JldHVybiB0aGlzLmVsZW1lbnRQcm9wZXJ0aWVzLmdldCh0KT8/bX1zdGF0aWMgXyRFaSgpe2lmKHRoaXMuaGFzT3duUHJvcGVydHkoZihcImVsZW1lbnRQcm9wZXJ0aWVzXCIpKSlyZXR1cm47Y29uc3QgdD1jKHRoaXMpO3QuZmluYWxpemUoKSx2b2lkIDAhPT10LmwmJih0aGlzLmw9Wy4uLnQubF0pLHRoaXMuZWxlbWVudFByb3BlcnRpZXM9bmV3IE1hcCh0LmVsZW1lbnRQcm9wZXJ0aWVzKX1zdGF0aWMgZmluYWxpemUoKXtpZih0aGlzLmhhc093blByb3BlcnR5KGYoXCJmaW5hbGl6ZWRcIikpKXJldHVybjtpZih0aGlzLmZpbmFsaXplZD0hMCx0aGlzLl8kRWkoKSx0aGlzLmhhc093blByb3BlcnR5KGYoXCJwcm9wZXJ0aWVzXCIpKSl7Y29uc3QgdD10aGlzLnByb3BlcnRpZXMscz1bLi4ubih0KSwuLi5hKHQpXTtmb3IoY29uc3QgaSBvZiBzKXRoaXMuY3JlYXRlUHJvcGVydHkoaSx0W2ldKX1jb25zdCB0PXRoaXNbU3ltYm9sLm1ldGFkYXRhXTtpZihudWxsIT09dCl7Y29uc3Qgcz1saXRQcm9wZXJ0eU1ldGFkYXRhLmdldCh0KTtpZih2b2lkIDAhPT1zKWZvcihjb25zdFt0LGldb2Ygcyl0aGlzLmVsZW1lbnRQcm9wZXJ0aWVzLnNldCh0LGkpfXRoaXMuXyRFaD1uZXcgTWFwO2Zvcihjb25zdFt0LHNdb2YgdGhpcy5lbGVtZW50UHJvcGVydGllcyl7Y29uc3QgaT10aGlzLl8kRXUodCxzKTt2b2lkIDAhPT1pJiZ0aGlzLl8kRWguc2V0KGksdCl9dGhpcy5lbGVtZW50U3R5bGVzPXRoaXMuZmluYWxpemVTdHlsZXModGhpcy5zdHlsZXMpfXN0YXRpYyBmaW5hbGl6ZVN0eWxlcyh0KXtjb25zdCBzPVtdO2lmKEFycmF5LmlzQXJyYXkodCkpe2NvbnN0IGU9bmV3IFNldCh0LmZsYXQoMS8wKS5yZXZlcnNlKCkpO2Zvcihjb25zdCB0IG9mIGUpcy51bnNoaWZ0KGkodCkpfWVsc2Ugdm9pZCAwIT09dCYmcy5wdXNoKGkodCkpO3JldHVybiBzfXN0YXRpYyBfJEV1KHQscyl7Y29uc3QgaT1zLmF0dHJpYnV0ZTtyZXR1cm4hMT09PWk/dm9pZCAwOlwic3RyaW5nXCI9PXR5cGVvZiBpP2k6XCJzdHJpbmdcIj09dHlwZW9mIHQ/dC50b0xvd2VyQ2FzZSgpOnZvaWQgMH1jb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5fJEVwPXZvaWQgMCx0aGlzLmlzVXBkYXRlUGVuZGluZz0hMSx0aGlzLmhhc1VwZGF0ZWQ9ITEsdGhpcy5fJEVtPW51bGwsdGhpcy5fJEV2KCl9XyRFdigpe3RoaXMuXyRFUz1uZXcgUHJvbWlzZSgodD0+dGhpcy5lbmFibGVVcGRhdGluZz10KSksdGhpcy5fJEFMPW5ldyBNYXAsdGhpcy5fJEVfKCksdGhpcy5yZXF1ZXN0VXBkYXRlKCksdGhpcy5jb25zdHJ1Y3Rvci5sPy5mb3JFYWNoKCh0PT50KHRoaXMpKSl9YWRkQ29udHJvbGxlcih0KXsodGhpcy5fJEVPPz89bmV3IFNldCkuYWRkKHQpLHZvaWQgMCE9PXRoaXMucmVuZGVyUm9vdCYmdGhpcy5pc0Nvbm5lY3RlZCYmdC5ob3N0Q29ubmVjdGVkPy4oKX1yZW1vdmVDb250cm9sbGVyKHQpe3RoaXMuXyRFTz8uZGVsZXRlKHQpfV8kRV8oKXtjb25zdCB0PW5ldyBNYXAscz10aGlzLmNvbnN0cnVjdG9yLmVsZW1lbnRQcm9wZXJ0aWVzO2Zvcihjb25zdCBpIG9mIHMua2V5cygpKXRoaXMuaGFzT3duUHJvcGVydHkoaSkmJih0LnNldChpLHRoaXNbaV0pLGRlbGV0ZSB0aGlzW2ldKTt0LnNpemU+MCYmKHRoaXMuXyRFcD10KX1jcmVhdGVSZW5kZXJSb290KCl7Y29uc3QgdD10aGlzLnNoYWRvd1Jvb3Q/P3RoaXMuYXR0YWNoU2hhZG93KHRoaXMuY29uc3RydWN0b3Iuc2hhZG93Um9vdE9wdGlvbnMpO3JldHVybiBlKHQsdGhpcy5jb25zdHJ1Y3Rvci5lbGVtZW50U3R5bGVzKSx0fWNvbm5lY3RlZENhbGxiYWNrKCl7dGhpcy5yZW5kZXJSb290Pz89dGhpcy5jcmVhdGVSZW5kZXJSb290KCksdGhpcy5lbmFibGVVcGRhdGluZyghMCksdGhpcy5fJEVPPy5mb3JFYWNoKCh0PT50Lmhvc3RDb25uZWN0ZWQ/LigpKSl9ZW5hYmxlVXBkYXRpbmcodCl7fWRpc2Nvbm5lY3RlZENhbGxiYWNrKCl7dGhpcy5fJEVPPy5mb3JFYWNoKCh0PT50Lmhvc3REaXNjb25uZWN0ZWQ/LigpKSl9YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHQscyxpKXt0aGlzLl8kQUsodCxpKX1fJEVDKHQscyl7Y29uc3QgaT10aGlzLmNvbnN0cnVjdG9yLmVsZW1lbnRQcm9wZXJ0aWVzLmdldCh0KSxlPXRoaXMuY29uc3RydWN0b3IuXyRFdSh0LGkpO2lmKHZvaWQgMCE9PWUmJiEwPT09aS5yZWZsZWN0KXtjb25zdCByPSh2b2lkIDAhPT1pLmNvbnZlcnRlcj8udG9BdHRyaWJ1dGU/aS5jb252ZXJ0ZXI6YikudG9BdHRyaWJ1dGUocyxpLnR5cGUpO3RoaXMuXyRFbT10LG51bGw9PXI/dGhpcy5yZW1vdmVBdHRyaWJ1dGUoZSk6dGhpcy5zZXRBdHRyaWJ1dGUoZSxyKSx0aGlzLl8kRW09bnVsbH19XyRBSyh0LHMpe2NvbnN0IGk9dGhpcy5jb25zdHJ1Y3RvcixlPWkuXyRFaC5nZXQodCk7aWYodm9pZCAwIT09ZSYmdGhpcy5fJEVtIT09ZSl7Y29uc3QgdD1pLmdldFByb3BlcnR5T3B0aW9ucyhlKSxyPVwiZnVuY3Rpb25cIj09dHlwZW9mIHQuY29udmVydGVyP3tmcm9tQXR0cmlidXRlOnQuY29udmVydGVyfTp2b2lkIDAhPT10LmNvbnZlcnRlcj8uZnJvbUF0dHJpYnV0ZT90LmNvbnZlcnRlcjpiO3RoaXMuXyRFbT1lLHRoaXNbZV09ci5mcm9tQXR0cmlidXRlKHMsdC50eXBlKSx0aGlzLl8kRW09bnVsbH19cmVxdWVzdFVwZGF0ZSh0LHMsaSl7aWYodm9pZCAwIT09dCl7aWYoaT8/PXRoaXMuY29uc3RydWN0b3IuZ2V0UHJvcGVydHlPcHRpb25zKHQpLCEoaS5oYXNDaGFuZ2VkPz95KSh0aGlzW3RdLHMpKXJldHVybjt0aGlzLlAodCxzLGkpfSExPT09dGhpcy5pc1VwZGF0ZVBlbmRpbmcmJih0aGlzLl8kRVM9dGhpcy5fJEVUKCkpfVAodCxzLGkpe3RoaXMuXyRBTC5oYXModCl8fHRoaXMuXyRBTC5zZXQodCxzKSwhMD09PWkucmVmbGVjdCYmdGhpcy5fJEVtIT09dCYmKHRoaXMuXyRFaj8/PW5ldyBTZXQpLmFkZCh0KX1hc3luYyBfJEVUKCl7dGhpcy5pc1VwZGF0ZVBlbmRpbmc9ITA7dHJ5e2F3YWl0IHRoaXMuXyRFU31jYXRjaCh0KXtQcm9taXNlLnJlamVjdCh0KX1jb25zdCB0PXRoaXMuc2NoZWR1bGVVcGRhdGUoKTtyZXR1cm4gbnVsbCE9dCYmYXdhaXQgdCwhdGhpcy5pc1VwZGF0ZVBlbmRpbmd9c2NoZWR1bGVVcGRhdGUoKXtyZXR1cm4gdGhpcy5wZXJmb3JtVXBkYXRlKCl9cGVyZm9ybVVwZGF0ZSgpe2lmKCF0aGlzLmlzVXBkYXRlUGVuZGluZylyZXR1cm47aWYoIXRoaXMuaGFzVXBkYXRlZCl7aWYodGhpcy5yZW5kZXJSb290Pz89dGhpcy5jcmVhdGVSZW5kZXJSb290KCksdGhpcy5fJEVwKXtmb3IoY29uc3RbdCxzXW9mIHRoaXMuXyRFcCl0aGlzW3RdPXM7dGhpcy5fJEVwPXZvaWQgMH1jb25zdCB0PXRoaXMuY29uc3RydWN0b3IuZWxlbWVudFByb3BlcnRpZXM7aWYodC5zaXplPjApZm9yKGNvbnN0W3MsaV1vZiB0KSEwIT09aS53cmFwcGVkfHx0aGlzLl8kQUwuaGFzKHMpfHx2b2lkIDA9PT10aGlzW3NdfHx0aGlzLlAocyx0aGlzW3NdLGkpfWxldCB0PSExO2NvbnN0IHM9dGhpcy5fJEFMO3RyeXt0PXRoaXMuc2hvdWxkVXBkYXRlKHMpLHQ/KHRoaXMud2lsbFVwZGF0ZShzKSx0aGlzLl8kRU8/LmZvckVhY2goKHQ9PnQuaG9zdFVwZGF0ZT8uKCkpKSx0aGlzLnVwZGF0ZShzKSk6dGhpcy5fJEVVKCl9Y2F0Y2gocyl7dGhyb3cgdD0hMSx0aGlzLl8kRVUoKSxzfXQmJnRoaXMuXyRBRShzKX13aWxsVXBkYXRlKHQpe31fJEFFKHQpe3RoaXMuXyRFTz8uZm9yRWFjaCgodD0+dC5ob3N0VXBkYXRlZD8uKCkpKSx0aGlzLmhhc1VwZGF0ZWR8fCh0aGlzLmhhc1VwZGF0ZWQ9ITAsdGhpcy5maXJzdFVwZGF0ZWQodCkpLHRoaXMudXBkYXRlZCh0KX1fJEVVKCl7dGhpcy5fJEFMPW5ldyBNYXAsdGhpcy5pc1VwZGF0ZVBlbmRpbmc9ITF9Z2V0IHVwZGF0ZUNvbXBsZXRlKCl7cmV0dXJuIHRoaXMuZ2V0VXBkYXRlQ29tcGxldGUoKX1nZXRVcGRhdGVDb21wbGV0ZSgpe3JldHVybiB0aGlzLl8kRVN9c2hvdWxkVXBkYXRlKHQpe3JldHVybiEwfXVwZGF0ZSh0KXt0aGlzLl8kRWomJj10aGlzLl8kRWouZm9yRWFjaCgodD0+dGhpcy5fJEVDKHQsdGhpc1t0XSkpKSx0aGlzLl8kRVUoKX11cGRhdGVkKHQpe31maXJzdFVwZGF0ZWQodCl7fX1nLmVsZW1lbnRTdHlsZXM9W10sZy5zaGFkb3dSb290T3B0aW9ucz17bW9kZTpcIm9wZW5cIn0sZ1tmKFwiZWxlbWVudFByb3BlcnRpZXNcIildPW5ldyBNYXAsZ1tmKFwiZmluYWxpemVkXCIpXT1uZXcgTWFwLHU/Lih7UmVhY3RpdmVFbGVtZW50Omd9KSwobC5yZWFjdGl2ZUVsZW1lbnRWZXJzaW9ucz8/PVtdKS5wdXNoKFwiMi4wLjRcIik7ZXhwb3J0e2cgYXMgUmVhY3RpdmVFbGVtZW50LGIgYXMgZGVmYXVsdENvbnZlcnRlcix5IGFzIG5vdEVxdWFsfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlYWN0aXZlLWVsZW1lbnQuanMubWFwXG4iLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQlNELTMtQ2xhdXNlXG4gKi9cbmNvbnN0IHQ9Z2xvYmFsVGhpcyxpPXQudHJ1c3RlZFR5cGVzLHM9aT9pLmNyZWF0ZVBvbGljeShcImxpdC1odG1sXCIse2NyZWF0ZUhUTUw6dD0+dH0pOnZvaWQgMCxlPVwiJGxpdCRcIixoPWBsaXQkJHtNYXRoLnJhbmRvbSgpLnRvRml4ZWQoOSkuc2xpY2UoMil9JGAsbz1cIj9cIitoLG49YDwke299PmAscj12b2lkIDA9PT10LmRvY3VtZW50P3tjcmVhdGVUcmVlV2Fsa2VyOigpPT4oe30pfTpkb2N1bWVudCxsPSgpPT5yLmNyZWF0ZUNvbW1lbnQoXCJcIiksYz10PT5udWxsPT09dHx8XCJvYmplY3RcIiE9dHlwZW9mIHQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQsYT1BcnJheS5pc0FycmF5LHU9dD0+YSh0KXx8XCJmdW5jdGlvblwiPT10eXBlb2YgdD8uW1N5bWJvbC5pdGVyYXRvcl0sZD1cIlsgXFx0XFxuXFxmXFxyXVwiLGY9LzwoPzooIS0tfFxcL1teYS16QS1aXSl8KFxcLz9bYS16QS1aXVtePlxcc10qKXwoXFwvPyQpKS9nLHY9Ly0tPi9nLF89Lz4vZyxtPVJlZ0V4cChgPnwke2R9KD86KFteXFxcXHNcIic+PS9dKykoJHtkfSo9JHtkfSooPzpbXiBcXHRcXG5cXGZcXHJcIidcXGA8Pj1dfChcInwnKXwpKXwkKWAsXCJnXCIpLHA9LycvZyxnPS9cIi9nLCQ9L14oPzpzY3JpcHR8c3R5bGV8dGV4dGFyZWF8dGl0bGUpJC9pLHk9dD0+KGksLi4ucyk9Pih7XyRsaXRUeXBlJDp0LHN0cmluZ3M6aSx2YWx1ZXM6c30pLHg9eSgxKSxUPXkoMiksYj15KDMpLHc9U3ltYm9sLmZvcihcImxpdC1ub0NoYW5nZVwiKSxFPVN5bWJvbC5mb3IoXCJsaXQtbm90aGluZ1wiKSxBPW5ldyBXZWFrTWFwLEM9ci5jcmVhdGVUcmVlV2Fsa2VyKHIsMTI5KTtmdW5jdGlvbiBQKHQsaSl7aWYoIWEodCl8fCF0Lmhhc093blByb3BlcnR5KFwicmF3XCIpKXRocm93IEVycm9yKFwiaW52YWxpZCB0ZW1wbGF0ZSBzdHJpbmdzIGFycmF5XCIpO3JldHVybiB2b2lkIDAhPT1zP3MuY3JlYXRlSFRNTChpKTppfWNvbnN0IFY9KHQsaSk9Pntjb25zdCBzPXQubGVuZ3RoLTEsbz1bXTtsZXQgcixsPTI9PT1pP1wiPHN2Zz5cIjozPT09aT9cIjxtYXRoPlwiOlwiXCIsYz1mO2ZvcihsZXQgaT0wO2k8cztpKyspe2NvbnN0IHM9dFtpXTtsZXQgYSx1LGQ9LTEseT0wO2Zvcig7eTxzLmxlbmd0aCYmKGMubGFzdEluZGV4PXksdT1jLmV4ZWMocyksbnVsbCE9PXUpOyl5PWMubGFzdEluZGV4LGM9PT1mP1wiIS0tXCI9PT11WzFdP2M9djp2b2lkIDAhPT11WzFdP2M9Xzp2b2lkIDAhPT11WzJdPygkLnRlc3QodVsyXSkmJihyPVJlZ0V4cChcIjwvXCIrdVsyXSxcImdcIikpLGM9bSk6dm9pZCAwIT09dVszXSYmKGM9bSk6Yz09PW0/XCI+XCI9PT11WzBdPyhjPXI/P2YsZD0tMSk6dm9pZCAwPT09dVsxXT9kPS0yOihkPWMubGFzdEluZGV4LXVbMl0ubGVuZ3RoLGE9dVsxXSxjPXZvaWQgMD09PXVbM10/bTonXCInPT09dVszXT9nOnApOmM9PT1nfHxjPT09cD9jPW06Yz09PXZ8fGM9PT1fP2M9ZjooYz1tLHI9dm9pZCAwKTtjb25zdCB4PWM9PT1tJiZ0W2krMV0uc3RhcnRzV2l0aChcIi8+XCIpP1wiIFwiOlwiXCI7bCs9Yz09PWY/cytuOmQ+PTA/KG8ucHVzaChhKSxzLnNsaWNlKDAsZCkrZStzLnNsaWNlKGQpK2greCk6cytoKygtMj09PWQ/aTp4KX1yZXR1cm5bUCh0LGwrKHRbc118fFwiPD8+XCIpKygyPT09aT9cIjwvc3ZnPlwiOjM9PT1pP1wiPC9tYXRoPlwiOlwiXCIpKSxvXX07Y2xhc3MgTntjb25zdHJ1Y3Rvcih7c3RyaW5nczp0LF8kbGl0VHlwZSQ6c30sbil7bGV0IHI7dGhpcy5wYXJ0cz1bXTtsZXQgYz0wLGE9MDtjb25zdCB1PXQubGVuZ3RoLTEsZD10aGlzLnBhcnRzLFtmLHZdPVYodCxzKTtpZih0aGlzLmVsPU4uY3JlYXRlRWxlbWVudChmLG4pLEMuY3VycmVudE5vZGU9dGhpcy5lbC5jb250ZW50LDI9PT1zfHwzPT09cyl7Y29uc3QgdD10aGlzLmVsLmNvbnRlbnQuZmlyc3RDaGlsZDt0LnJlcGxhY2VXaXRoKC4uLnQuY2hpbGROb2Rlcyl9Zm9yKDtudWxsIT09KHI9Qy5uZXh0Tm9kZSgpKSYmZC5sZW5ndGg8dTspe2lmKDE9PT1yLm5vZGVUeXBlKXtpZihyLmhhc0F0dHJpYnV0ZXMoKSlmb3IoY29uc3QgdCBvZiByLmdldEF0dHJpYnV0ZU5hbWVzKCkpaWYodC5lbmRzV2l0aChlKSl7Y29uc3QgaT12W2ErK10scz1yLmdldEF0dHJpYnV0ZSh0KS5zcGxpdChoKSxlPS8oWy4/QF0pPyguKikvLmV4ZWMoaSk7ZC5wdXNoKHt0eXBlOjEsaW5kZXg6YyxuYW1lOmVbMl0sc3RyaW5nczpzLGN0b3I6XCIuXCI9PT1lWzFdP0g6XCI/XCI9PT1lWzFdP0k6XCJAXCI9PT1lWzFdP0w6Un0pLHIucmVtb3ZlQXR0cmlidXRlKHQpfWVsc2UgdC5zdGFydHNXaXRoKGgpJiYoZC5wdXNoKHt0eXBlOjYsaW5kZXg6Y30pLHIucmVtb3ZlQXR0cmlidXRlKHQpKTtpZigkLnRlc3Qoci50YWdOYW1lKSl7Y29uc3QgdD1yLnRleHRDb250ZW50LnNwbGl0KGgpLHM9dC5sZW5ndGgtMTtpZihzPjApe3IudGV4dENvbnRlbnQ9aT9pLmVtcHR5U2NyaXB0OlwiXCI7Zm9yKGxldCBpPTA7aTxzO2krKylyLmFwcGVuZCh0W2ldLGwoKSksQy5uZXh0Tm9kZSgpLGQucHVzaCh7dHlwZToyLGluZGV4OisrY30pO3IuYXBwZW5kKHRbc10sbCgpKX19fWVsc2UgaWYoOD09PXIubm9kZVR5cGUpaWYoci5kYXRhPT09bylkLnB1c2goe3R5cGU6MixpbmRleDpjfSk7ZWxzZXtsZXQgdD0tMTtmb3IoOy0xIT09KHQ9ci5kYXRhLmluZGV4T2YoaCx0KzEpKTspZC5wdXNoKHt0eXBlOjcsaW5kZXg6Y30pLHQrPWgubGVuZ3RoLTF9YysrfX1zdGF0aWMgY3JlYXRlRWxlbWVudCh0LGkpe2NvbnN0IHM9ci5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIik7cmV0dXJuIHMuaW5uZXJIVE1MPXQsc319ZnVuY3Rpb24gUyh0LGkscz10LGUpe2lmKGk9PT13KXJldHVybiBpO2xldCBoPXZvaWQgMCE9PWU/cy5fJENvPy5bZV06cy5fJENsO2NvbnN0IG89YyhpKT92b2lkIDA6aS5fJGxpdERpcmVjdGl2ZSQ7cmV0dXJuIGg/LmNvbnN0cnVjdG9yIT09byYmKGg/Ll8kQU8/LighMSksdm9pZCAwPT09bz9oPXZvaWQgMDooaD1uZXcgbyh0KSxoLl8kQVQodCxzLGUpKSx2b2lkIDAhPT1lPyhzLl8kQ28/Pz1bXSlbZV09aDpzLl8kQ2w9aCksdm9pZCAwIT09aCYmKGk9Uyh0LGguXyRBUyh0LGkudmFsdWVzKSxoLGUpKSxpfWNsYXNzIE17Y29uc3RydWN0b3IodCxpKXt0aGlzLl8kQVY9W10sdGhpcy5fJEFOPXZvaWQgMCx0aGlzLl8kQUQ9dCx0aGlzLl8kQU09aX1nZXQgcGFyZW50Tm9kZSgpe3JldHVybiB0aGlzLl8kQU0ucGFyZW50Tm9kZX1nZXQgXyRBVSgpe3JldHVybiB0aGlzLl8kQU0uXyRBVX11KHQpe2NvbnN0e2VsOntjb250ZW50Oml9LHBhcnRzOnN9PXRoaXMuXyRBRCxlPSh0Py5jcmVhdGlvblNjb3BlPz9yKS5pbXBvcnROb2RlKGksITApO0MuY3VycmVudE5vZGU9ZTtsZXQgaD1DLm5leHROb2RlKCksbz0wLG49MCxsPXNbMF07Zm9yKDt2b2lkIDAhPT1sOyl7aWYobz09PWwuaW5kZXgpe2xldCBpOzI9PT1sLnR5cGU/aT1uZXcgayhoLGgubmV4dFNpYmxpbmcsdGhpcyx0KToxPT09bC50eXBlP2k9bmV3IGwuY3RvcihoLGwubmFtZSxsLnN0cmluZ3MsdGhpcyx0KTo2PT09bC50eXBlJiYoaT1uZXcgeihoLHRoaXMsdCkpLHRoaXMuXyRBVi5wdXNoKGkpLGw9c1srK25dfW8hPT1sPy5pbmRleCYmKGg9Qy5uZXh0Tm9kZSgpLG8rKyl9cmV0dXJuIEMuY3VycmVudE5vZGU9cixlfXAodCl7bGV0IGk9MDtmb3IoY29uc3QgcyBvZiB0aGlzLl8kQVYpdm9pZCAwIT09cyYmKHZvaWQgMCE9PXMuc3RyaW5ncz8ocy5fJEFJKHQscyxpKSxpKz1zLnN0cmluZ3MubGVuZ3RoLTIpOnMuXyRBSSh0W2ldKSksaSsrfX1jbGFzcyBre2dldCBfJEFVKCl7cmV0dXJuIHRoaXMuXyRBTT8uXyRBVT8/dGhpcy5fJEN2fWNvbnN0cnVjdG9yKHQsaSxzLGUpe3RoaXMudHlwZT0yLHRoaXMuXyRBSD1FLHRoaXMuXyRBTj12b2lkIDAsdGhpcy5fJEFBPXQsdGhpcy5fJEFCPWksdGhpcy5fJEFNPXMsdGhpcy5vcHRpb25zPWUsdGhpcy5fJEN2PWU/LmlzQ29ubmVjdGVkPz8hMH1nZXQgcGFyZW50Tm9kZSgpe2xldCB0PXRoaXMuXyRBQS5wYXJlbnROb2RlO2NvbnN0IGk9dGhpcy5fJEFNO3JldHVybiB2b2lkIDAhPT1pJiYxMT09PXQ/Lm5vZGVUeXBlJiYodD1pLnBhcmVudE5vZGUpLHR9Z2V0IHN0YXJ0Tm9kZSgpe3JldHVybiB0aGlzLl8kQUF9Z2V0IGVuZE5vZGUoKXtyZXR1cm4gdGhpcy5fJEFCfV8kQUkodCxpPXRoaXMpe3Q9Uyh0aGlzLHQsaSksYyh0KT90PT09RXx8bnVsbD09dHx8XCJcIj09PXQ/KHRoaXMuXyRBSCE9PUUmJnRoaXMuXyRBUigpLHRoaXMuXyRBSD1FKTp0IT09dGhpcy5fJEFIJiZ0IT09dyYmdGhpcy5fKHQpOnZvaWQgMCE9PXQuXyRsaXRUeXBlJD90aGlzLiQodCk6dm9pZCAwIT09dC5ub2RlVHlwZT90aGlzLlQodCk6dSh0KT90aGlzLmsodCk6dGhpcy5fKHQpfU8odCl7cmV0dXJuIHRoaXMuXyRBQS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0LHRoaXMuXyRBQil9VCh0KXt0aGlzLl8kQUghPT10JiYodGhpcy5fJEFSKCksdGhpcy5fJEFIPXRoaXMuTyh0KSl9Xyh0KXt0aGlzLl8kQUghPT1FJiZjKHRoaXMuXyRBSCk/dGhpcy5fJEFBLm5leHRTaWJsaW5nLmRhdGE9dDp0aGlzLlQoci5jcmVhdGVUZXh0Tm9kZSh0KSksdGhpcy5fJEFIPXR9JCh0KXtjb25zdHt2YWx1ZXM6aSxfJGxpdFR5cGUkOnN9PXQsZT1cIm51bWJlclwiPT10eXBlb2Ygcz90aGlzLl8kQUModCk6KHZvaWQgMD09PXMuZWwmJihzLmVsPU4uY3JlYXRlRWxlbWVudChQKHMuaCxzLmhbMF0pLHRoaXMub3B0aW9ucykpLHMpO2lmKHRoaXMuXyRBSD8uXyRBRD09PWUpdGhpcy5fJEFILnAoaSk7ZWxzZXtjb25zdCB0PW5ldyBNKGUsdGhpcykscz10LnUodGhpcy5vcHRpb25zKTt0LnAoaSksdGhpcy5UKHMpLHRoaXMuXyRBSD10fX1fJEFDKHQpe2xldCBpPUEuZ2V0KHQuc3RyaW5ncyk7cmV0dXJuIHZvaWQgMD09PWkmJkEuc2V0KHQuc3RyaW5ncyxpPW5ldyBOKHQpKSxpfWsodCl7YSh0aGlzLl8kQUgpfHwodGhpcy5fJEFIPVtdLHRoaXMuXyRBUigpKTtjb25zdCBpPXRoaXMuXyRBSDtsZXQgcyxlPTA7Zm9yKGNvbnN0IGggb2YgdCllPT09aS5sZW5ndGg/aS5wdXNoKHM9bmV3IGsodGhpcy5PKGwoKSksdGhpcy5PKGwoKSksdGhpcyx0aGlzLm9wdGlvbnMpKTpzPWlbZV0scy5fJEFJKGgpLGUrKztlPGkubGVuZ3RoJiYodGhpcy5fJEFSKHMmJnMuXyRBQi5uZXh0U2libGluZyxlKSxpLmxlbmd0aD1lKX1fJEFSKHQ9dGhpcy5fJEFBLm5leHRTaWJsaW5nLGkpe2Zvcih0aGlzLl8kQVA/LighMSwhMCxpKTt0JiZ0IT09dGhpcy5fJEFCOyl7Y29uc3QgaT10Lm5leHRTaWJsaW5nO3QucmVtb3ZlKCksdD1pfX1zZXRDb25uZWN0ZWQodCl7dm9pZCAwPT09dGhpcy5fJEFNJiYodGhpcy5fJEN2PXQsdGhpcy5fJEFQPy4odCkpfX1jbGFzcyBSe2dldCB0YWdOYW1lKCl7cmV0dXJuIHRoaXMuZWxlbWVudC50YWdOYW1lfWdldCBfJEFVKCl7cmV0dXJuIHRoaXMuXyRBTS5fJEFVfWNvbnN0cnVjdG9yKHQsaSxzLGUsaCl7dGhpcy50eXBlPTEsdGhpcy5fJEFIPUUsdGhpcy5fJEFOPXZvaWQgMCx0aGlzLmVsZW1lbnQ9dCx0aGlzLm5hbWU9aSx0aGlzLl8kQU09ZSx0aGlzLm9wdGlvbnM9aCxzLmxlbmd0aD4yfHxcIlwiIT09c1swXXx8XCJcIiE9PXNbMV0/KHRoaXMuXyRBSD1BcnJheShzLmxlbmd0aC0xKS5maWxsKG5ldyBTdHJpbmcpLHRoaXMuc3RyaW5ncz1zKTp0aGlzLl8kQUg9RX1fJEFJKHQsaT10aGlzLHMsZSl7Y29uc3QgaD10aGlzLnN0cmluZ3M7bGV0IG89ITE7aWYodm9pZCAwPT09aCl0PVModGhpcyx0LGksMCksbz0hYyh0KXx8dCE9PXRoaXMuXyRBSCYmdCE9PXcsbyYmKHRoaXMuXyRBSD10KTtlbHNle2NvbnN0IGU9dDtsZXQgbixyO2Zvcih0PWhbMF0sbj0wO248aC5sZW5ndGgtMTtuKyspcj1TKHRoaXMsZVtzK25dLGksbikscj09PXcmJihyPXRoaXMuXyRBSFtuXSksb3x8PSFjKHIpfHxyIT09dGhpcy5fJEFIW25dLHI9PT1FP3Q9RTp0IT09RSYmKHQrPShyPz9cIlwiKStoW24rMV0pLHRoaXMuXyRBSFtuXT1yfW8mJiFlJiZ0aGlzLmoodCl9aih0KXt0PT09RT90aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKHRoaXMubmFtZSk6dGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSh0aGlzLm5hbWUsdD8/XCJcIil9fWNsYXNzIEggZXh0ZW5kcyBSe2NvbnN0cnVjdG9yKCl7c3VwZXIoLi4uYXJndW1lbnRzKSx0aGlzLnR5cGU9M31qKHQpe3RoaXMuZWxlbWVudFt0aGlzLm5hbWVdPXQ9PT1FP3ZvaWQgMDp0fX1jbGFzcyBJIGV4dGVuZHMgUntjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksdGhpcy50eXBlPTR9aih0KXt0aGlzLmVsZW1lbnQudG9nZ2xlQXR0cmlidXRlKHRoaXMubmFtZSwhIXQmJnQhPT1FKX19Y2xhc3MgTCBleHRlbmRzIFJ7Y29uc3RydWN0b3IodCxpLHMsZSxoKXtzdXBlcih0LGkscyxlLGgpLHRoaXMudHlwZT01fV8kQUkodCxpPXRoaXMpe2lmKCh0PVModGhpcyx0LGksMCk/P0UpPT09dylyZXR1cm47Y29uc3Qgcz10aGlzLl8kQUgsZT10PT09RSYmcyE9PUV8fHQuY2FwdHVyZSE9PXMuY2FwdHVyZXx8dC5vbmNlIT09cy5vbmNlfHx0LnBhc3NpdmUhPT1zLnBhc3NpdmUsaD10IT09RSYmKHM9PT1FfHxlKTtlJiZ0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLm5hbWUsdGhpcyxzKSxoJiZ0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLm5hbWUsdGhpcyx0KSx0aGlzLl8kQUg9dH1oYW5kbGVFdmVudCh0KXtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLl8kQUg/dGhpcy5fJEFILmNhbGwodGhpcy5vcHRpb25zPy5ob3N0Pz90aGlzLmVsZW1lbnQsdCk6dGhpcy5fJEFILmhhbmRsZUV2ZW50KHQpfX1jbGFzcyB6e2NvbnN0cnVjdG9yKHQsaSxzKXt0aGlzLmVsZW1lbnQ9dCx0aGlzLnR5cGU9Nix0aGlzLl8kQU49dm9pZCAwLHRoaXMuXyRBTT1pLHRoaXMub3B0aW9ucz1zfWdldCBfJEFVKCl7cmV0dXJuIHRoaXMuXyRBTS5fJEFVfV8kQUkodCl7Uyh0aGlzLHQpfX1jb25zdCBXPXtNOmUsUDpoLEE6byxDOjEsTDpWLFI6TSxEOnUsVjpTLEk6ayxIOlIsTjpJLFU6TCxCOkgsRjp6fSxaPXQubGl0SHRtbFBvbHlmaWxsU3VwcG9ydDtaPy4oTixrKSwodC5saXRIdG1sVmVyc2lvbnM/Pz1bXSkucHVzaChcIjMuMi4xXCIpO2NvbnN0IGo9KHQsaSxzKT0+e2NvbnN0IGU9cz8ucmVuZGVyQmVmb3JlPz9pO2xldCBoPWUuXyRsaXRQYXJ0JDtpZih2b2lkIDA9PT1oKXtjb25zdCB0PXM/LnJlbmRlckJlZm9yZT8/bnVsbDtlLl8kbGl0UGFydCQ9aD1uZXcgayhpLmluc2VydEJlZm9yZShsKCksdCksdCx2b2lkIDAscz8/e30pfXJldHVybiBoLl8kQUkodCksaH07ZXhwb3J0e1cgYXMgXyRMSCx4IGFzIGh0bWwsYiBhcyBtYXRobWwsdyBhcyBub0NoYW5nZSxFIGFzIG5vdGhpbmcsaiBhcyByZW5kZXIsVCBhcyBzdmd9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGl0LWh0bWwuanMubWFwXG4iLCJpbXBvcnR7UmVhY3RpdmVFbGVtZW50IGFzIHR9ZnJvbVwiQGxpdC9yZWFjdGl2ZS1lbGVtZW50XCI7ZXhwb3J0KmZyb21cIkBsaXQvcmVhY3RpdmUtZWxlbWVudFwiO2ltcG9ydHtyZW5kZXIgYXMgZSxub0NoYW5nZSBhcyBzfWZyb21cImxpdC1odG1sXCI7ZXhwb3J0KmZyb21cImxpdC1odG1sXCI7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQlNELTMtQ2xhdXNlXG4gKi9jbGFzcyByIGV4dGVuZHMgdHtjb25zdHJ1Y3Rvcigpe3N1cGVyKC4uLmFyZ3VtZW50cyksdGhpcy5yZW5kZXJPcHRpb25zPXtob3N0OnRoaXN9LHRoaXMuXyREbz12b2lkIDB9Y3JlYXRlUmVuZGVyUm9vdCgpe2NvbnN0IHQ9c3VwZXIuY3JlYXRlUmVuZGVyUm9vdCgpO3JldHVybiB0aGlzLnJlbmRlck9wdGlvbnMucmVuZGVyQmVmb3JlPz89dC5maXJzdENoaWxkLHR9dXBkYXRlKHQpe2NvbnN0IHM9dGhpcy5yZW5kZXIoKTt0aGlzLmhhc1VwZGF0ZWR8fCh0aGlzLnJlbmRlck9wdGlvbnMuaXNDb25uZWN0ZWQ9dGhpcy5pc0Nvbm5lY3RlZCksc3VwZXIudXBkYXRlKHQpLHRoaXMuXyREbz1lKHMsdGhpcy5yZW5kZXJSb290LHRoaXMucmVuZGVyT3B0aW9ucyl9Y29ubmVjdGVkQ2FsbGJhY2soKXtzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpLHRoaXMuXyREbz8uc2V0Q29ubmVjdGVkKCEwKX1kaXNjb25uZWN0ZWRDYWxsYmFjaygpe3N1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCksdGhpcy5fJERvPy5zZXRDb25uZWN0ZWQoITEpfXJlbmRlcigpe3JldHVybiBzfX1yLl8kbGl0RWxlbWVudCQ9ITAscltcImZpbmFsaXplZFwiXT0hMCxnbG9iYWxUaGlzLmxpdEVsZW1lbnRIeWRyYXRlU3VwcG9ydD8uKHtMaXRFbGVtZW50OnJ9KTtjb25zdCBpPWdsb2JhbFRoaXMubGl0RWxlbWVudFBvbHlmaWxsU3VwcG9ydDtpPy4oe0xpdEVsZW1lbnQ6cn0pO2NvbnN0IG89e18kQUs6KHQsZSxzKT0+e3QuXyRBSyhlLHMpfSxfJEFMOnQ9PnQuXyRBTH07KGdsb2JhbFRoaXMubGl0RWxlbWVudFZlcnNpb25zPz89W10pLnB1c2goXCI0LjEuMVwiKTtleHBvcnR7ciBhcyBMaXRFbGVtZW50LG8gYXMgXyRMRX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1saXQtZWxlbWVudC5qcy5tYXBcbiIsImltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuZXhwb3J0IGNvbnN0IE5BTUUgPSAnT3JjaGFyZCBVSSc7XG5leHBvcnQgY29uc3QgQ1VTVE9NX0VMRU1FTlRfTkFNRSA9IHBhY2thZ2VKc29uLm5hbWU7XG4iLCIvKipcbiAqIERpc3BsYXkgYXV0b21hdGlvbnMgaW4gYSB0aWxlLlxuICovIGV4cG9ydCBjbGFzcyBBdXRvbWF0aW9uQ2FyZFN0cmF0ZWd5IHtcbiAgICAvKipcbiAgICogR2VuZXJhdGUgdGhlIGF1dG9tYXRpb24gdGlsZSBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gYXV0b21hdGlvbkVudGl0eSAtIFRoZSBhdXRvbWF0aW9uIHRvIHNob3cuXG4gICAqIEByZXR1cm5zIFRoZSBMb3ZlbGFjZSBjYXJkIGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUoYXV0b21hdGlvbkVudGl0eSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ3RpbGUnLFxuICAgICAgICAgICAgZW50aXR5OiBhdXRvbWF0aW9uRW50aXR5LnVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgICAgICBzdGF0ZV9jb250ZW50OiBbXG4gICAgICAgICAgICAgICAgJ3N0YXRlJyxcbiAgICAgICAgICAgICAgICAnbGFzdF90cmlnZ2VyZWQnXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZ3JpZF9vcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgY29sdW1uczogMTJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBdXRvbWF0aW9uQ2FyZFN0cmF0ZWd5IH0gZnJvbSAnLi4vY2FyZHMvYXV0b21hdGlvbi1jYXJkJztcbmltcG9ydCB7IEF1dG9tYXRpb25zVmlld1N0cmF0ZWd5IH0gZnJvbSAnLi4vdmlld3MvYXV0b21hdGlvbnMtdmlldyc7XG4vKipcbiAqIERpc3BsYXkgYXZhaWxhYmxlIGF1dG9tYXRpb25zIGdyb3VwZWQgYnkgYXJlYSBvciBmbG9vci5cbiAqLyBleHBvcnQgY2xhc3MgQXV0b21hdGlvblNlY3Rpb25TdHJhdGVneSB7XG4gICAgLyoqXG4gICAqIEJ1aWxkIHRoZSBzZWN0aW9uIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBob21lIC0gVGhlIGhvbWUgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSBmbG9vciAtIE9wdGlvbmFsIGZsb29yIGZpbHRlci5cbiAgICogQHJldHVybnMgTG92ZWxhY2Ugc2VjdGlvbiBjb25maWd1cmF0aW9uLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlKGhvbWUsIGZsb29yKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnZ3JpZCcsXG4gICAgICAgICAgICBjYXJkczogYXdhaXQgdGhpcy5nZW5lcmF0ZUNhcmRzKGhvbWUsIGZsb29yKSxcbiAgICAgICAgICAgIGNvbHVtbl9zcGFuOiBBdXRvbWF0aW9uc1ZpZXdTdHJhdGVneS5tYXhDb2x1bW5zKGhvbWUpXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgKiBDcmVhdGUgdGhlIGxpc3Qgb2YgYXV0b21hdGlvbiBjYXJkcy5cbiAgICpcbiAgICogQHBhcmFtIGhvbWUgLSBUaGUgaG9tZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIGZsb29yIC0gT3B0aW9uYWwgZmxvb3IgY29udGV4dC5cbiAgICogQHJldHVybnMgTGlzdCBvZiBjYXJkIGNvbmZpZ3MuXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVDYXJkcyhob21lLCBmbG9vcikge1xuICAgICAgICBjb25zdCBjYXJkcyA9IFtdO1xuICAgICAgICBjb25zdCBhdXRvbWF0aW9uRW50aXRpZXMgPSBob21lLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgJ2F1dG9tYXRpb24nXG4gICAgICAgIF0pLnNvcnQoKGVudGl0eUEsIGVudGl0eUIpPT5lbnRpdHlBLnN0YXRlLmxhc3RUcmlnZ2VyZWQuZ2V0RGF0ZSgpIC0gZW50aXR5Qi5zdGF0ZS5sYXN0VHJpZ2dlcmVkLmdldERhdGUoKSk7XG4gICAgICAgIGlmIChmbG9vcikge1xuICAgICAgICAgICAgY2FyZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2hlYWRpbmcnLFxuICAgICAgICAgICAgICAgIGhlYWRpbmc6IGZsb29yLm5hbWUsXG4gICAgICAgICAgICAgICAgaWNvbjogZmxvb3IuaWNvbixcbiAgICAgICAgICAgICAgICBoZWFkaW5nX3N0eWxlOiAndGl0bGUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYXJlYSBvZiBmbG9vci5hcmVhcyl7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJlYUF1dG9tYXRpb25FbnRpdGllcyA9IGFyZWEuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAgICAgICAgICdhdXRvbWF0aW9uJ1xuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIGlmIChhcmVhQXV0b21hdGlvbkVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FyZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdoZWFkaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGluZzogYXJlYS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBhcmVhLmljb24sXG4gICAgICAgICAgICAgICAgICAgIGhlYWRpbmdfc3R5bGU6ICdzdWJ0aXRsZSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFyZWFBdXRvbWF0aW9uRW50aXR5IG9mIGFyZWFBdXRvbWF0aW9uRW50aXRpZXMpe1xuICAgICAgICAgICAgICAgICAgICBjYXJkcy5wdXNoKGF3YWl0IEF1dG9tYXRpb25DYXJkU3RyYXRlZ3kuZ2VuZXJhdGUoYXJlYUF1dG9tYXRpb25FbnRpdHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FyZHM7XG4gICAgICAgIH1cbiAgICAgICAgY2FyZHMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgICAgICBoZWFkaW5nOiAnSG9tZScsXG4gICAgICAgICAgICBpY29uOiAnbWRpOmhvbWUnLFxuICAgICAgICAgICAgaGVhZGluZ19zdHlsZTogJ3RpdGxlJ1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgbm9BcmVhQXV0b21hdGlvbkVudGl0aWVzID0gYXV0b21hdGlvbkVudGl0aWVzLmZpbHRlcigoZW50aXR5KT0+IWVudGl0eS5hcmVhSWRlbnRpZmllcik7XG4gICAgICAgIGZvciAoY29uc3QgYXV0b21hdGlvbkVudGl0eSBvZiBub0FyZWFBdXRvbWF0aW9uRW50aXRpZXMpe1xuICAgICAgICAgICAgY2FyZHMucHVzaChhd2FpdCBBdXRvbWF0aW9uQ2FyZFN0cmF0ZWd5LmdlbmVyYXRlKGF1dG9tYXRpb25FbnRpdHkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FyZHM7XG4gICAgfVxufVxuIiwiZnVuY3Rpb24gX2RlZmluZV9wcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoa2V5IGluIG9iaikgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIGVsc2Ugb2JqW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gb2JqO1xufVxuY2xhc3MgU3RhdGUge1xuICAgIGdldCB1bmlxdWVJZGVudGlmaWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNzU3RhdGUuZW50aXR5X2lkO1xuICAgIH1cbiAgICBnZXQgbG9jYWxpemVkRGVzY3JpcHRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NTdGF0ZS5hdHRyaWJ1dGVzLmZyaWVuZGx5X25hbWUgfHwgJyc7XG4gICAgfVxuICAgIGdldCBjaGFyYWN0ZXJpc3RpY1R5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NTdGF0ZS5hdHRyaWJ1dGVzLmRldmljZV9jbGFzcyB8fCAnJztcbiAgICB9XG4gICAgZ2V0IHVuaXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNzU3RhdGUuYXR0cmlidXRlcy51bml0X29mX21lYXN1cmVtZW50O1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcihob21lLCBzdGF0ZSl7XG4gICAgICAgIF9kZWZpbmVfcHJvcGVydHkodGhpcywgXCJob21lXCIsIHZvaWQgMCk7XG4gICAgICAgIF9kZWZpbmVfcHJvcGVydHkodGhpcywgXCJoYXNzU3RhdGVcIiwgdm9pZCAwKTtcbiAgICAgICAgdGhpcy5ob21lID0gaG9tZTtcbiAgICAgICAgdGhpcy5oYXNzU3RhdGUgPSBzdGF0ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBlbnRpdHlfZGVmaW5lX3Byb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgaW4gb2JqKSBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgZWxzZSBvYmpba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiBvYmo7XG59XG5jbGFzcyBFbnRpdHkge1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNzRW50aXR5Lm5hbWUgfHwgJyc7XG4gICAgfVxuICAgIGdldCBpY29uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNzRW50aXR5Lmljb24gfHwgdm9pZCAwO1xuICAgIH1cbiAgICBnZXQgdW5pcXVlSWRlbnRpZmllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc0VudGl0eS5lbnRpdHlfaWQ7XG4gICAgfVxuICAgIGdldCBjaGFyYWN0ZXJpc3RpY3MoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLnN0YXRlXG4gICAgICAgIF07XG4gICAgfVxuICAgIGdldCBzZXJ2aWNlVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9tYWluO1xuICAgIH1cbiAgICBnZXQgYWNjZXNzb3J5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZXZpY2U7XG4gICAgfVxuICAgIGdldCBpZGVudGlmaWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy51bmlxdWVJZGVudGlmaWVyLnNwbGl0KCcuJylbMV07XG4gICAgfVxuICAgIGdldCBhcmVhSWRlbnRpZmllcigpIHtcbiAgICAgICAgdmFyIF90aGlzX2RldmljZTtcbiAgICAgICAgaWYgKHRoaXMuaGFzc0VudGl0eS5hcmVhX2lkKSByZXR1cm4gdGhpcy5oYXNzRW50aXR5LmFyZWFfaWQ7XG4gICAgICAgIGlmIChudWxsID09PSAoX3RoaXNfZGV2aWNlID0gdGhpcy5kZXZpY2UpIHx8IHZvaWQgMCA9PT0gX3RoaXNfZGV2aWNlID8gdm9pZCAwIDogX3RoaXNfZGV2aWNlLmFyZWEpIHJldHVybiB0aGlzLmRldmljZS5hcmVhLnVuaXF1ZUlkZW50aWZpZXI7XG4gICAgfVxuICAgIGdldCBkZXZpY2VJZGVudGlmaWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNzRW50aXR5LmRldmljZV9pZCB8fCB2b2lkIDA7XG4gICAgfVxuICAgIGdldCBhcmVhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob21lLmFyZWFzLmZpbmQoKGFyZWEpPT50aGlzLmFyZWFJZGVudGlmaWVyID09PSBhcmVhLnVuaXF1ZUlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBnZXQgaGlkZGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNzRW50aXR5LmhpZGRlbiA/PyBmYWxzZTtcbiAgICB9XG4gICAgZ2V0IHN0YXRlKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FoY2Uuc3RhdGUpIHRoaXMuY2FoY2Uuc3RhdGUgPSBuZXcgU3RhdGUodGhpcy5ob21lLCB0aGlzLmhvbWUuaGFzcy5zdGF0ZXNbdGhpcy5oYXNzRW50aXR5LmVudGl0eV9pZF0pO1xuICAgICAgICByZXR1cm4gdGhpcy5jYWhjZS5zdGF0ZTtcbiAgICB9XG4gICAgZ2V0IGRldmljZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG9tZS5kZXZpY2VzLmZpbmQoKGRldmljZSk9PmRldmljZS51bmlxdWVJZGVudGlmaWVyID09PSB0aGlzLmRldmljZUlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBnZXQgZG9tYWluKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNzRW50aXR5LmVudGl0eV9pZC5zcGxpdCgnLicpWzBdO1xuICAgIH1cbiAgICBnZXQgcGxhdGZvcm0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NFbnRpdHkucGxhdGZvcm07XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGhvbWUsIGVudGl0eSl7XG4gICAgICAgIGVudGl0eV9kZWZpbmVfcHJvcGVydHkodGhpcywgXCJob21lXCIsIHZvaWQgMCk7XG4gICAgICAgIGVudGl0eV9kZWZpbmVfcHJvcGVydHkodGhpcywgXCJoYXNzRW50aXR5XCIsIHZvaWQgMCk7XG4gICAgICAgIGVudGl0eV9kZWZpbmVfcHJvcGVydHkodGhpcywgXCJjYWhjZVwiLCB7fSk7XG4gICAgICAgIHRoaXMuaG9tZSA9IGhvbWU7XG4gICAgICAgIHRoaXMuaGFzc0VudGl0eSA9IGVudGl0eTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXZpY2VfZGVmaW5lX3Byb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgaW4gb2JqKSBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgZWxzZSBvYmpba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiBvYmo7XG59XG5jbGFzcyBEZXZpY2Uge1xuICAgIGdldCB1bmlxdWVJZGVudGlmaWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNzRGV2aWNlLmlkO1xuICAgIH1cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc0RldmljZS5uYW1lIHx8ICcnO1xuICAgIH1cbiAgICBnZXQgcm9vbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJlYTtcbiAgICB9XG4gICAgZ2V0IGlzQmxvY2tlZCgpIHtcbiAgICAgICAgcmV0dXJuIG51bGwgIT09IHRoaXMuaGFzc0RldmljZS5kaXNhYmxlZF9ieTtcbiAgICB9XG4gICAgZ2V0IHNlcnZpY2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcztcbiAgICB9XG4gICAgZ2V0IG1hbnVmYWN0dXJlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc0RldmljZS5tYW51ZmFjdHVyZXIgfHwgdm9pZCAwO1xuICAgIH1cbiAgICBnZXQgbW9kZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NEZXZpY2UubW9kZWwgfHwgdm9pZCAwO1xuICAgIH1cbiAgICBnZXQgaWRlbnRpZmllcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NEZXZpY2UuaWRlbnRpZmllcnM7XG4gICAgfVxuICAgIGdldCBhcmVhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob21lLmFyZWFzLmZpbmQoKGFyZWEpPT5hcmVhLnVuaXF1ZUlkZW50aWZpZXIgPT09IHRoaXMuaGFzc0RldmljZS5hcmVhX2lkKTtcbiAgICB9XG4gICAgZ2V0IGVudGl0aWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob21lLmVudGl0aWVzLmZpbHRlcigoZW50aXR5KT0+ZW50aXR5LmRldmljZUlkZW50aWZpZXIgPT09IHRoaXMudW5pcXVlSWRlbnRpZmllcik7XG4gICAgfVxuICAgIGVudGl0aWVzV2l0aERvbWFpbnMoZG9tYWlucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5maWx0ZXIoKGVudGl0eSk9PmRvbWFpbnMuaW5jbHVkZXMoZW50aXR5LmRvbWFpbikpO1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcihob21lLCBkZXZpY2Upe1xuICAgICAgICBkZXZpY2VfZGVmaW5lX3Byb3BlcnR5KHRoaXMsIFwiaG9tZVwiLCB2b2lkIDApO1xuICAgICAgICBkZXZpY2VfZGVmaW5lX3Byb3BlcnR5KHRoaXMsIFwiaGFzc0RldmljZVwiLCB2b2lkIDApO1xuICAgICAgICB0aGlzLmhvbWUgPSBob21lO1xuICAgICAgICB0aGlzLmhhc3NEZXZpY2UgPSBkZXZpY2U7XG4gICAgfVxufVxuY29uc3QgV0VBVEhFUktJVF9QTEFURk9STSA9ICd3ZWF0aGVya2l0JztcbmNvbnN0IE1BR0lDX0FSRUFTX1BMQVRGT1JNID0gJ21hZ2ljX2FyZWFzJztcbmNvbnN0IE1BR0lDX0FSRUFTX0dMT0JBTF9ERVZJQ0VfSUQgPSAnbWFnaWNfYXJlYV9kZXZpY2VfZ2xvYmFsJztcbmNvbnN0IE1BR0lDX0FSRUFTX0ZMT09SX0RFVklDRV9JRCA9ICdtYWdpY19hcmVhX2RldmljZV8ke2Zsb29yLnVuaXF1ZUlkZW50aWZpZXJ9JztcbmNvbnN0IE1BR0lDX0FSRUFTX0FSRUFfREVWSUNFX0lEID0gJ21hZ2ljX2FyZWFfZGV2aWNlXyR7YXJlYS51bmlxdWVJZGVudGlmaWVyfSc7XG5jb25zdCBNQUdJQ19BUkVBX0FSRUFfTElHSFRfR1JPVVBfQUxMX0VOVElUWV9JRCA9ICdsaWdodC5tYWdpY19hcmVhc19saWdodF9ncm91cHNfJHthcmVhLnVuaXF1ZUlkZW50aWZpZXJ9X2FsbF9saWdodHMnO1xuY29uc3QgTUFHSUNfQVJFQVNfQVJFQV9MSUdIVF9HUk9VUF9FTlRJVFlfSURTID0ge1xuICAgIG92ZXJoZWFkOiAnbGlnaHQubWFnaWNfYXJlYXNfbGlnaHRfZ3JvdXBzXyR7YXJlYS51bmlxdWVJZGVudGlmaWVyfV9vdmVyaGVhZF9saWdodHMnLFxuICAgIHNsZWVwOiAnbGlnaHQubWFnaWNfYXJlYXNfbGlnaHRfZ3JvdXBzXyR7YXJlYS51bmlxdWVJZGVudGlmaWVyfV9zbGVlcF9saWdodHMnLFxuICAgIGFjY2VudDogJ2xpZ2h0Lm1hZ2ljX2FyZWFzX2xpZ2h0X2dyb3Vwc18ke2FyZWEudW5pcXVlSWRlbnRpZmllcn1fYWNjZW50X2xpZ2h0cycsXG4gICAgdGFzazogJ2xpZ2h0Lm1hZ2ljX2FyZWFzX2xpZ2h0X2dyb3Vwc18ke2FyZWEudW5pcXVlSWRlbnRpZmllcn1fdGFza19saWdodHMnXG59O1xuZnVuY3Rpb24gZmxvb3JfZGVmaW5lX3Byb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgaW4gb2JqKSBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgZWxzZSBvYmpba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiBvYmo7XG59XG5jbGFzcyBGbG9vciB7XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NGbG9vci5uYW1lO1xuICAgIH1cbiAgICBnZXQgdW5pcXVlSWRlbnRpZmllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc0Zsb29yLmZsb29yX2lkO1xuICAgIH1cbiAgICBnZXQgcm9vbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyZWFzO1xuICAgIH1cbiAgICBnZXQgaWNvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc0Zsb29yLmljb24gfHwgdm9pZCAwO1xuICAgIH1cbiAgICBnZXQgbGV2ZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NGbG9vci5sZXZlbCA/PyB2b2lkIDA7XG4gICAgfVxuICAgIGdldCBhcmVhcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG9tZS5hcmVhcy5maWx0ZXIoKGFyZWEpPT5hcmVhLmZsb29ySWRlbnRpZmllciA9PT0gdGhpcy51bmlxdWVJZGVudGlmaWVyKTtcbiAgICB9XG4gICAgZW50aXRpZXNXaXRoRG9tYWlucyhkb21haW5zKSB7XG4gICAgICAgIGNvbnN0IGVudGl0aWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYXJlYSBvZiB0aGlzLmFyZWFzKWVudGl0aWVzLnB1c2goLi4uYXJlYS5lbnRpdGllc1dpdGhEb21haW5zKGRvbWFpbnMpKTtcbiAgICAgICAgcmV0dXJuIGVudGl0aWVzO1xuICAgIH1cbiAgICBnZXQgY2xpbWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgbWFnaWNBcmVhc0FyZWFEZXZpY2UgPSB0aGlzLmhvbWUuZGV2aWNlcy5maW5kKChkZXZpY2UpPT5kZXZpY2UuaWRlbnRpZmllcnMuZmluZCgoaWRlbnRpZmllcnMpPT5pZGVudGlmaWVyc1swXSA9PT0gTUFHSUNfQVJFQVNfUExBVEZPUk0gJiYgaWRlbnRpZmllcnNbMV0gPT09IE1BR0lDX0FSRUFTX0ZMT09SX0RFVklDRV9JRC5yZXBsYWNlKCcke2Zsb29yLnVuaXF1ZUlkZW50aWZpZXJ9JywgdGhpcy51bmlxdWVJZGVudGlmaWVyKSkpO1xuICAgICAgICBpZiAobWFnaWNBcmVhc0FyZWFEZXZpY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNBcmVhQ2xpbWF0ZUVudGl0aWVzID0gbWFnaWNBcmVhc0FyZWFEZXZpY2UuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAgICAgJ2NsaW1hdGUnXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGlmIChtYWdpY0FyZWFzQXJlYUNsaW1hdGVFbnRpdGllcy5sZW5ndGggPiAwKSByZXR1cm4gbWFnaWNBcmVhc0FyZWFDbGltYXRlRW50aXRpZXNbMF07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2xpbWF0ZUVudGl0aWVzID0gdGhpcy5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICdjbGltYXRlJ1xuICAgICAgICBdKTtcbiAgICAgICAgaWYgKDEgPT09IGNsaW1hdGVFbnRpdGllcy5sZW5ndGgpIHJldHVybiBjbGltYXRlRW50aXRpZXNbMF07XG4gICAgfVxuICAgIGdldCBsaWdodEVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgbWFnaWNBcmVhc0FyZWFEZXZpY2UgPSB0aGlzLmhvbWUuZGV2aWNlcy5maW5kKChkZXZpY2UpPT5kZXZpY2UuaWRlbnRpZmllcnMuZmluZCgoaWRlbnRpZmllcnMpPT5pZGVudGlmaWVyc1swXSA9PT0gTUFHSUNfQVJFQVNfUExBVEZPUk0gJiYgaWRlbnRpZmllcnNbMV0gPT09IE1BR0lDX0FSRUFTX0ZMT09SX0RFVklDRV9JRC5yZXBsYWNlKCcke2Zsb29yLnVuaXF1ZUlkZW50aWZpZXJ9JywgdGhpcy51bmlxdWVJZGVudGlmaWVyKSkpO1xuICAgICAgICBpZiAobWFnaWNBcmVhc0FyZWFEZXZpY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNBcmVhTGlnaHRFbnRpdGllcyA9IG1hZ2ljQXJlYXNBcmVhRGV2aWNlLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgICAgICdsaWdodCdcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKG1hZ2ljQXJlYXNBcmVhTGlnaHRFbnRpdGllcy5sZW5ndGggPiAwKSByZXR1cm4gbWFnaWNBcmVhc0FyZWFMaWdodEVudGl0aWVzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxpZ2h0RW50aXRpZXMgPSB0aGlzLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgJ2xpZ2h0J1xuICAgICAgICBdKTtcbiAgICAgICAgaWYgKDEgPT09IGxpZ2h0RW50aXRpZXMubGVuZ3RoKSByZXR1cm4gbGlnaHRFbnRpdGllc1swXTtcbiAgICB9XG4gICAgZ2V0IGxvY2tFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNBcmVhRGV2aWNlID0gdGhpcy5ob21lLmRldmljZXMuZmluZCgoZGV2aWNlKT0+ZGV2aWNlLmlkZW50aWZpZXJzLmZpbmQoKGlkZW50aWZpZXJzKT0+aWRlbnRpZmllcnNbMF0gPT09IE1BR0lDX0FSRUFTX1BMQVRGT1JNICYmIGlkZW50aWZpZXJzWzFdID09PSBNQUdJQ19BUkVBU19GTE9PUl9ERVZJQ0VfSUQucmVwbGFjZSgnJHtmbG9vci51bmlxdWVJZGVudGlmaWVyfScsIHRoaXMudW5pcXVlSWRlbnRpZmllcikpKTtcbiAgICAgICAgaWYgKG1hZ2ljQXJlYXNBcmVhRGV2aWNlKSB7XG4gICAgICAgICAgICBjb25zdCBtYWdpY0FyZWFzQXJlYUxvY2tFbnRpdGllcyA9IG1hZ2ljQXJlYXNBcmVhRGV2aWNlLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgICAgICdsb2NrJ1xuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAobWFnaWNBcmVhc0FyZWFMb2NrRW50aXRpZXMubGVuZ3RoID4gMCkgcmV0dXJuIG1hZ2ljQXJlYXNBcmVhTG9ja0VudGl0aWVzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxvY2tFbnRpdGllcyA9IHRoaXMuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAnbG9jaydcbiAgICAgICAgXSk7XG4gICAgICAgIGlmICgxID09PSBsb2NrRW50aXRpZXMubGVuZ3RoKSByZXR1cm4gbG9ja0VudGl0aWVzWzBdO1xuICAgIH1cbiAgICBnZXQgbWVkaWFQbGF5ZXJFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNBcmVhRGV2aWNlID0gdGhpcy5ob21lLmRldmljZXMuZmluZCgoZGV2aWNlKT0+ZGV2aWNlLmlkZW50aWZpZXJzLmZpbmQoKGlkZW50aWZpZXJzKT0+aWRlbnRpZmllcnNbMF0gPT09IE1BR0lDX0FSRUFTX1BMQVRGT1JNICYmIGlkZW50aWZpZXJzWzFdID09PSBNQUdJQ19BUkVBU19GTE9PUl9ERVZJQ0VfSUQucmVwbGFjZSgnJHtmbG9vci51bmlxdWVJZGVudGlmaWVyfScsIHRoaXMudW5pcXVlSWRlbnRpZmllcikpKTtcbiAgICAgICAgaWYgKG1hZ2ljQXJlYXNBcmVhRGV2aWNlKSB7XG4gICAgICAgICAgICBjb25zdCBtYWdpY0FyZWFzQXJlYU1lZGlhUGxheWVyRW50aXRpZXMgPSBtYWdpY0FyZWFzQXJlYURldmljZS5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICAgICAnbWVkaWFfcGxheWVyJ1xuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAobWFnaWNBcmVhc0FyZWFNZWRpYVBsYXllckVudGl0aWVzLmxlbmd0aCA+IDApIHJldHVybiBtYWdpY0FyZWFzQXJlYU1lZGlhUGxheWVyRW50aXRpZXNbMF07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVkaWFQbGF5ZXJFbnRpdGllcyA9IHRoaXMuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAnbWVkaWFfcGxheWVyJ1xuICAgICAgICBdKTtcbiAgICAgICAgaWYgKDEgPT09IG1lZGlhUGxheWVyRW50aXRpZXMubGVuZ3RoKSByZXR1cm4gbWVkaWFQbGF5ZXJFbnRpdGllc1swXTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoaG9tZSwgZmxvb3Ipe1xuICAgICAgICBmbG9vcl9kZWZpbmVfcHJvcGVydHkodGhpcywgXCJob21lXCIsIHZvaWQgMCk7XG4gICAgICAgIGZsb29yX2RlZmluZV9wcm9wZXJ0eSh0aGlzLCBcImhhc3NGbG9vclwiLCB2b2lkIDApO1xuICAgICAgICB0aGlzLmhvbWUgPSBob21lO1xuICAgICAgICB0aGlzLmhhc3NGbG9vciA9IGZsb29yO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFyZWFfZGVmaW5lX3Byb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgaW4gb2JqKSBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgZWxzZSBvYmpba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiBvYmo7XG59XG5jbGFzcyBBcmVhIHtcbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc0FyZWEubmFtZTtcbiAgICB9XG4gICAgZ2V0IHVuaXF1ZUlkZW50aWZpZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NBcmVhLmFyZWFfaWQ7XG4gICAgfVxuICAgIGdldCBhY2Nlc3NvcmllcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGV2aWNlcztcbiAgICB9XG4gICAgZ2V0IGZsb29ySWRlbnRpZmllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc0FyZWEuZmxvb3JfaWQgfHwgdm9pZCAwO1xuICAgIH1cbiAgICBnZXQgaWNvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc0FyZWEuaWNvbiB8fCB2b2lkIDA7XG4gICAgfVxuICAgIGdldCBkZXZpY2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob21lLmRldmljZXMuZmlsdGVyKChkZXZpY2UpPT5kZXZpY2UuaGFzc0RldmljZS5hcmVhX2lkID09PSB0aGlzLnVuaXF1ZUlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBnZXQgZW50aXRpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhvbWUuZW50aXRpZXMuZmlsdGVyKChlbnRpdHkpPT5lbnRpdHkuYXJlYUlkZW50aWZpZXIgPT09IHRoaXMudW5pcXVlSWRlbnRpZmllcik7XG4gICAgfVxuICAgIGVudGl0aWVzV2l0aERvbWFpbnMoZG9tYWlucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5maWx0ZXIoKGVudGl0eSk9PmRvbWFpbnMuaW5jbHVkZXMoZW50aXR5LmRvbWFpbikpO1xuICAgIH1cbiAgICBnZXQgY2xpbWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgbWFnaWNBcmVhc0FyZWFEZXZpY2UgPSB0aGlzLmhvbWUuZGV2aWNlcy5maW5kKChkZXZpY2UpPT5kZXZpY2UuaWRlbnRpZmllcnMuZmluZCgoaWRlbnRpZmllcnMpPT5pZGVudGlmaWVyc1swXSA9PT0gTUFHSUNfQVJFQVNfUExBVEZPUk0gJiYgaWRlbnRpZmllcnNbMV0gPT09IE1BR0lDX0FSRUFTX0FSRUFfREVWSUNFX0lELnJlcGxhY2UoJyR7YXJlYS51bmlxdWVJZGVudGlmaWVyfScsIHRoaXMudW5pcXVlSWRlbnRpZmllcikpKTtcbiAgICAgICAgaWYgKG1hZ2ljQXJlYXNBcmVhRGV2aWNlKSB7XG4gICAgICAgICAgICBjb25zdCBtYWdpY0FyZWFzQXJlYUNsaW1hdGVFbnRpdGllcyA9IG1hZ2ljQXJlYXNBcmVhRGV2aWNlLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgICAgICdjbGltYXRlJ1xuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAobWFnaWNBcmVhc0FyZWFDbGltYXRlRW50aXRpZXMubGVuZ3RoID4gMCkgcmV0dXJuIG1hZ2ljQXJlYXNBcmVhQ2xpbWF0ZUVudGl0aWVzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNsaW1hdGVFbnRpdGllcyA9IHRoaXMuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAnY2xpbWF0ZSdcbiAgICAgICAgXSk7XG4gICAgICAgIGlmICgxID09PSBjbGltYXRlRW50aXRpZXMubGVuZ3RoKSByZXR1cm4gY2xpbWF0ZUVudGl0aWVzWzBdO1xuICAgIH1cbiAgICBnZXQgbGlnaHRFbnRpdHlHcm91cHMoKSB7XG4gICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNBcmVhRGV2aWNlID0gdGhpcy5ob21lLmRldmljZXMuZmluZCgoZGV2aWNlKT0+ZGV2aWNlLmlkZW50aWZpZXJzLmZpbmQoKGlkZW50aWZpZXJzKT0+aWRlbnRpZmllcnNbMF0gPT09IE1BR0lDX0FSRUFTX1BMQVRGT1JNICYmIGlkZW50aWZpZXJzWzFdID09PSBNQUdJQ19BUkVBU19BUkVBX0RFVklDRV9JRC5yZXBsYWNlKCcke2FyZWEudW5pcXVlSWRlbnRpZmllcn0nLCB0aGlzLnVuaXF1ZUlkZW50aWZpZXIpKSk7XG4gICAgICAgIGlmIChtYWdpY0FyZWFzQXJlYURldmljZSkge1xuICAgICAgICAgICAgY29uc3QgbWFnaWNBcmVhc0FyZWFMaWdodEdyb3VwRW50aXRpZXMgPSBtYWdpY0FyZWFzQXJlYURldmljZS5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICAgICAnbGlnaHQnXG4gICAgICAgICAgICBdKS5maWx0ZXIoKGVudGl0eSk9Pk9iamVjdC52YWx1ZXMoTUFHSUNfQVJFQVNfQVJFQV9MSUdIVF9HUk9VUF9FTlRJVFlfSURTKS5pbmNsdWRlcyhlbnRpdHkudW5pcXVlSWRlbnRpZmllci5yZXBsYWNlKHRoaXMudW5pcXVlSWRlbnRpZmllciwgJyR7YXJlYS51bmlxdWVJZGVudGlmaWVyfScpKSk7XG4gICAgICAgICAgICBpZiAobWFnaWNBcmVhc0FyZWFMaWdodEdyb3VwRW50aXRpZXMubGVuZ3RoID4gMSkgcmV0dXJuIG1hZ2ljQXJlYXNBcmVhTGlnaHRHcm91cEVudGl0aWVzO1xuICAgICAgICAgICAgY29uc3QgbWFnaWNBcmVhTGlnaHRHcm91cEVudGl0eUlkcyA9IFtcbiAgICAgICAgICAgICAgICAuLi5tYWdpY0FyZWFzQXJlYUxpZ2h0R3JvdXBFbnRpdGllcy5tYXAoKGVudGl0eSk9PmVudGl0eS51bmlxdWVJZGVudGlmaWVyKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGNvbnN0IGxpZ2h0RW50aXRpZXMgPSB0aGlzLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgICAgICdsaWdodCdcbiAgICAgICAgICAgIF0pLmZpbHRlcigoZW50aXR5KT0+IW1hZ2ljQXJlYUxpZ2h0R3JvdXBFbnRpdHlJZHMuaW5jbHVkZXMoZW50aXR5LnVuaXF1ZUlkZW50aWZpZXIpIHx8IGVudGl0eS51bmlxdWVJZGVudGlmaWVyID09PSBNQUdJQ19BUkVBX0FSRUFfTElHSFRfR1JPVVBfQUxMX0VOVElUWV9JRC5yZXBsYWNlKCcke2FyZWEudW5pcXVlSWRlbnRpZmllcn0nLCB0aGlzLnVuaXF1ZUlkZW50aWZpZXIpKTtcbiAgICAgICAgICAgIHJldHVybiBsaWdodEVudGl0aWVzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgZ2V0IGxvY2tFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNBcmVhRGV2aWNlID0gdGhpcy5ob21lLmRldmljZXMuZmluZCgoZGV2aWNlKT0+ZGV2aWNlLmlkZW50aWZpZXJzLmZpbmQoKGlkZW50aWZpZXJzKT0+aWRlbnRpZmllcnNbMF0gPT09IE1BR0lDX0FSRUFTX1BMQVRGT1JNICYmIGlkZW50aWZpZXJzWzFdID09PSBNQUdJQ19BUkVBU19BUkVBX0RFVklDRV9JRC5yZXBsYWNlKCcke2FyZWEudW5pcXVlSWRlbnRpZmllcn0nLCB0aGlzLnVuaXF1ZUlkZW50aWZpZXIpKSk7XG4gICAgICAgIGlmIChtYWdpY0FyZWFzQXJlYURldmljZSkge1xuICAgICAgICAgICAgY29uc3QgbWFnaWNBcmVhc0FyZWFDbGltYXRlRW50aXRpZXMgPSBtYWdpY0FyZWFzQXJlYURldmljZS5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICAgICAnbG9jaydcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKG1hZ2ljQXJlYXNBcmVhQ2xpbWF0ZUVudGl0aWVzLmxlbmd0aCA+IDApIHJldHVybiBtYWdpY0FyZWFzQXJlYUNsaW1hdGVFbnRpdGllc1swXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjbGltYXRlRW50aXRpZXMgPSB0aGlzLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgJ2xvY2snXG4gICAgICAgIF0pO1xuICAgICAgICBpZiAoMSA9PT0gY2xpbWF0ZUVudGl0aWVzLmxlbmd0aCkgcmV0dXJuIGNsaW1hdGVFbnRpdGllc1swXTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoaG9tZSwgYXJlYSl7XG4gICAgICAgIGFyZWFfZGVmaW5lX3Byb3BlcnR5KHRoaXMsIFwiaG9tZVwiLCB2b2lkIDApO1xuICAgICAgICBhcmVhX2RlZmluZV9wcm9wZXJ0eSh0aGlzLCBcImhhc3NBcmVhXCIsIHZvaWQgMCk7XG4gICAgICAgIHRoaXMuaG9tZSA9IGhvbWU7XG4gICAgICAgIHRoaXMuaGFzc0FyZWEgPSBhcmVhO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHVzZXJfZGVmaW5lX3Byb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgaW4gb2JqKSBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgZWxzZSBvYmpba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiBvYmo7XG59XG5jbGFzcyBVc2VyIHtcbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc1VzZXIubmFtZTtcbiAgICB9XG4gICAgZ2V0IHVuaXF1ZUlkZW50aWZpZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NVc2VyLmlkO1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcihob21lLCB1c2VyKXtcbiAgICAgICAgdXNlcl9kZWZpbmVfcHJvcGVydHkodGhpcywgXCJob21lXCIsIHZvaWQgMCk7XG4gICAgICAgIHVzZXJfZGVmaW5lX3Byb3BlcnR5KHRoaXMsIFwiaGFzc1VzZXJcIiwgdm9pZCAwKTtcbiAgICAgICAgdGhpcy5ob21lID0gaG9tZTtcbiAgICAgICAgdGhpcy5oYXNzVXNlciA9IHVzZXI7XG4gICAgfVxufVxuZnVuY3Rpb24gYXV0b21hdGlvbl9kZWZpbmVfcHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiBvYmopIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICBlbHNlIG9ialtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIG9iajtcbn1cbmNsYXNzIEF1dG9tYXRpb25TdGF0ZSBleHRlbmRzIFN0YXRlIHtcbiAgICBnZXQgbGFzdFRyaWdnZXJlZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMuaGFzc1N0YXRlLmF0dHJpYnV0ZXMubGFzdF90cmlnZ2VyZWQpO1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcihob21lLCBoYXNzU3RhdGUpe1xuICAgICAgICBzdXBlcihob21lLCBoYXNzU3RhdGUpLCBhdXRvbWF0aW9uX2RlZmluZV9wcm9wZXJ0eSh0aGlzLCBcImhhc3NTdGF0ZVwiLCB2b2lkIDApO1xuICAgICAgICB0aGlzLmhhc3NTdGF0ZSA9IGhhc3NTdGF0ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBjbGltYXRlX2RlZmluZV9wcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoa2V5IGluIG9iaikgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIGVsc2Ugb2JqW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gb2JqO1xufVxuY2xhc3MgQ2xpbWF0ZVN0YXRlIGV4dGVuZHMgU3RhdGUge1xuICAgIGdldCBmYW5Nb2RlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzc1N0YXRlLmF0dHJpYnV0ZXMuZmFuX21vZGVzIHx8IFtdO1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcihob21lLCBoYXNzU3RhdGUpe1xuICAgICAgICBzdXBlcihob21lLCBoYXNzU3RhdGUpLCBjbGltYXRlX2RlZmluZV9wcm9wZXJ0eSh0aGlzLCBcImhhc3NTdGF0ZVwiLCB2b2lkIDApO1xuICAgICAgICB0aGlzLmhhc3NTdGF0ZSA9IGhhc3NTdGF0ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBsaWdodF9kZWZpbmVfcHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiBvYmopIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICBlbHNlIG9ialtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIG9iajtcbn1cbmNsYXNzIExpZ2h0U3RhdGUgZXh0ZW5kcyBTdGF0ZSB7XG4gICAgZ2V0IHN1cHBvcnRlZENvbG9yTW9kZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3NTdGF0ZS5hdHRyaWJ1dGVzLnN1cHBvcnRlZF9jb2xvcl9tb2RlcyB8fCBbXTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoaG9tZSwgaGFzc1N0YXRlKXtcbiAgICAgICAgc3VwZXIoaG9tZSwgaGFzc1N0YXRlKSwgbGlnaHRfZGVmaW5lX3Byb3BlcnR5KHRoaXMsIFwiaGFzc1N0YXRlXCIsIHZvaWQgMCk7XG4gICAgICAgIHRoaXMuaGFzc1N0YXRlID0gaGFzc1N0YXRlO1xuICAgIH1cbn1cbmNsYXNzIEF1dG9tYXRpb25FbnRpdHkgZXh0ZW5kcyBFbnRpdHkge1xuICAgIGdldCBzdGF0ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhaGNlLnN0YXRlKSB0aGlzLmNhaGNlLnN0YXRlID0gbmV3IEF1dG9tYXRpb25TdGF0ZSh0aGlzLmhvbWUsIHRoaXMuaG9tZS5oYXNzLnN0YXRlc1t0aGlzLmhhc3NFbnRpdHkuZW50aXR5X2lkXSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNhaGNlLnN0YXRlO1xuICAgIH1cbn1cbmNsYXNzIENsaW1hdGVFbnRpdHkgZXh0ZW5kcyBFbnRpdHkge1xuICAgIGdldCBzdGF0ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhaGNlLnN0YXRlKSB0aGlzLmNhaGNlLnN0YXRlID0gbmV3IENsaW1hdGVTdGF0ZSh0aGlzLmhvbWUsIHRoaXMuaG9tZS5oYXNzLnN0YXRlc1t0aGlzLmhhc3NFbnRpdHkuZW50aXR5X2lkXSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNhaGNlLnN0YXRlO1xuICAgIH1cbn1cbmNsYXNzIExpZ2h0RW50aXR5IGV4dGVuZHMgRW50aXR5IHtcbiAgICBnZXQgc3RhdGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5jYWhjZS5zdGF0ZSkgdGhpcy5jYWhjZS5zdGF0ZSA9IG5ldyBMaWdodFN0YXRlKHRoaXMuaG9tZSwgdGhpcy5ob21lLmhhc3Muc3RhdGVzW3RoaXMuaGFzc0VudGl0eS5lbnRpdHlfaWRdKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FoY2Uuc3RhdGU7XG4gICAgfVxufVxuZnVuY3Rpb24gaG9tZV9kZWZpbmVfcHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiBvYmopIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICBlbHNlIG9ialtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIG9iajtcbn1cbmNsYXNzIEhvbWUge1xuICAgIHN0YXRpYyBjcmVhdGVDb25maWcocGFydGlhbENvbmZpZyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGFyZWFzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBpZiAocGFydGlhbENvbmZpZy5hcmVhcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBhcmVhIG9mIHBhcnRpYWxDb25maWcuYXJlYXMpaWYgKG51bGwgPT0gYXJlYSA/IHZvaWQgMCA6IGFyZWEuaWQpIGNvbmZpZy5hcmVhcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogYXJlYS5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc3MuY29uZmlnLmxvY2F0aW9uX25hbWU7XG4gICAgfVxuICAgIGdldCByb29tcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJlYXM7XG4gICAgfVxuICAgIGdldCB6b25lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvb3JzO1xuICAgIH1cbiAgICBnZXQgYWNjZXNzb3JpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRldmljZXM7XG4gICAgfVxuICAgIHNlcnZpY2VzV2l0aFR5cGVzKHNlcnZpY2VUeXBlcykge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllc1dpdGhEb21haW5zKHNlcnZpY2VUeXBlcyk7XG4gICAgfVxuICAgIGdldCBzdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzcy5jb25maWcuc3RhdGU7XG4gICAgfVxuICAgIGdldCBjdXJyZW50VXNlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhY2hlLmN1cnJlbnRVc2VyKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzcy51c2VyKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuY3VycmVudFVzZXIgPSBuZXcgVXNlcih0aGlzLCB0aGlzLmhhc3MudXNlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuY3VycmVudFVzZXI7XG4gICAgfVxuICAgIGdldCBwYW5lbFVybCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzcy5wYW5lbFVybDtcbiAgICB9XG4gICAgZ2V0IGFyZWFzKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FjaGUuYXJlYXMpIHRoaXMuY2FjaGUuYXJlYXMgPSBPYmplY3QudmFsdWVzKHRoaXMuaGFzcy5hcmVhcykubWFwKChhcmVhKT0+bmV3IEFyZWEodGhpcywgYXJlYSkpLnNvcnQoKGFyZWFBLCBhcmVhQik9PntcbiAgICAgICAgICAgIGNvbnN0IGluZGV4QSA9IHRoaXMuY29uZmlnLmFyZWFzLmZpbmRJbmRleCgoY29uZmlnQXJlYSk9PmNvbmZpZ0FyZWEuaWQgPT09IGFyZWFBLnVuaXF1ZUlkZW50aWZpZXIpID8/IHRoaXMuY29uZmlnLmFyZWFzLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4QiA9IHRoaXMuY29uZmlnLmFyZWFzLmZpbmRJbmRleCgoY29uZmlnQXJlYSk9PmNvbmZpZ0FyZWEuaWQgPT09IGFyZWFCLnVuaXF1ZUlkZW50aWZpZXIpID8/IHRoaXMuY29uZmlnLmFyZWFzLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBpbmRleEEgLSBpbmRleEI7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5hcmVhcztcbiAgICB9XG4gICAgZ2V0IGZsb29ycygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhY2hlLmZsb29ycykgdGhpcy5jYWNoZS5mbG9vcnMgPSBPYmplY3QudmFsdWVzKHRoaXMuaGFzcy5mbG9vcnMpLm1hcCgoZmxvb3IpPT5uZXcgRmxvb3IodGhpcywgZmxvb3IpKS5zb3J0KChmbG9vckEsIGZsb29yQik9PntcbiAgICAgICAgICAgIGNvbnN0IGxldmVsQSA9IGZsb29yQS5sZXZlbCA/PyBPYmplY3Qua2V5cyh0aGlzLmhhc3MuZmxvb3JzKS5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBsZXZlbEIgPSBmbG9vckIubGV2ZWwgPz8gT2JqZWN0LmtleXModGhpcy5oYXNzLmZsb29ycykubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGxldmVsQSAtIGxldmVsQjtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLmZsb29ycztcbiAgICB9XG4gICAgZ2V0IGRldmljZXMoKSB7XG4gICAgICAgIGlmICghdGhpcy5jYWNoZS5kZXZpY2VzKSB0aGlzLmNhY2hlLmRldmljZXMgPSBPYmplY3QudmFsdWVzKHRoaXMuaGFzcy5kZXZpY2VzKS5tYXAoKGRldmljZSk9Pm5ldyBEZXZpY2UodGhpcywgZGV2aWNlKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLmRldmljZXM7XG4gICAgfVxuICAgIGVudGl0aWVzV2l0aERvbWFpbnMoZG9tYWlucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5maWx0ZXIoKGVudGl0eSk9PmRvbWFpbnMuaW5jbHVkZXMoZW50aXR5LmRvbWFpbikpO1xuICAgIH1cbiAgICBnZXQgZW50aXRpZXMoKSB7XG4gICAgICAgIGlmICghdGhpcy5jYWNoZS5lbnRpdGllcykgdGhpcy5jYWNoZS5lbnRpdGllcyA9IE9iamVjdC52YWx1ZXModGhpcy5oYXNzLmVudGl0aWVzKS5tYXAoKGVudGl0eSk9PntcbiAgICAgICAgICAgIHN3aXRjaChlbnRpdHkuZW50aXR5X2lkLnNwbGl0KCcuJylbMF0pe1xuICAgICAgICAgICAgICAgIGNhc2UgJ2F1dG9tYXRpb24nOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEF1dG9tYXRpb25FbnRpdHkodGhpcywgZW50aXR5KTtcbiAgICAgICAgICAgICAgICBjYXNlICdjbGltYXRlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDbGltYXRlRW50aXR5KHRoaXMsIGVudGl0eSk7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGlnaHQnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExpZ2h0RW50aXR5KHRoaXMsIGVudGl0eSk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFbnRpdHkodGhpcywgZW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuc29ydCgoZW50aXR5QSwgZW50aXR5Qik9PntcbiAgICAgICAgICAgIGNvbnN0IGluZGV4QSA9IHRoaXMuY29uZmlnLmFyZWFzLmZpbmRJbmRleCgoY29uZmlnQXJlYSk9PmNvbmZpZ0FyZWEuaWQgPT09IGVudGl0eUEuYXJlYUlkZW50aWZpZXIpID8/IHRoaXMuY29uZmlnLmFyZWFzLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4QiA9IHRoaXMuY29uZmlnLmFyZWFzLmZpbmRJbmRleCgoY29uZmlnQXJlYSk9PmNvbmZpZ0FyZWEuaWQgPT09IGVudGl0eUIuYXJlYUlkZW50aWZpZXIpID8/IHRoaXMuY29uZmlnLmFyZWFzLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBpbmRleEEgLSBpbmRleEI7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5lbnRpdGllcztcbiAgICB9XG4gICAgZ2V0IHdlYXRoZXJFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IHdlYXRoZXJFbnRpdGllcyA9IHRoaXMuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAnd2VhdGhlcidcbiAgICAgICAgXSk7XG4gICAgICAgIGlmICh3ZWF0aGVyRW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgd2VhdGhlcktpdEVudGl0eSA9IHdlYXRoZXJFbnRpdGllcy5maW5kKChlbnRpdHkpPT5lbnRpdHkucGxhdGZvcm0gPT09IFdFQVRIRVJLSVRfUExBVEZPUk0pO1xuICAgICAgICAgICAgaWYgKHdlYXRoZXJLaXRFbnRpdHkpIHJldHVybiB3ZWF0aGVyS2l0RW50aXR5O1xuICAgICAgICAgICAgcmV0dXJuIHdlYXRoZXJFbnRpdGllc1swXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgY2xpbWF0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgbWFnaWNBcmVhc0dsb2JhbERldmljZSA9IHRoaXMuZGV2aWNlcy5maW5kKChkZXZpY2UpPT5kZXZpY2UuaWRlbnRpZmllcnMuZmluZCgoaWRlbnRpZmllcnMpPT5pZGVudGlmaWVyc1swXSA9PT0gTUFHSUNfQVJFQVNfUExBVEZPUk0gJiYgaWRlbnRpZmllcnNbMV0gPT09IE1BR0lDX0FSRUFTX0dMT0JBTF9ERVZJQ0VfSUQpKTtcbiAgICAgICAgaWYgKG1hZ2ljQXJlYXNHbG9iYWxEZXZpY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNHbG9iYWxDbGltYXRlRW50aXRpZXMgPSBtYWdpY0FyZWFzR2xvYmFsRGV2aWNlLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgICAgICdjbGltYXRlJ1xuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAobWFnaWNBcmVhc0dsb2JhbENsaW1hdGVFbnRpdGllcy5sZW5ndGggPiAwKSByZXR1cm4gbWFnaWNBcmVhc0dsb2JhbENsaW1hdGVFbnRpdGllc1swXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjbGltYXRlRW50aXRpZXMgPSB0aGlzLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgJ2NsaW1hdGUnXG4gICAgICAgIF0pO1xuICAgICAgICBpZiAoMSA9PT0gY2xpbWF0ZUVudGl0aWVzLmxlbmd0aCkgcmV0dXJuIGNsaW1hdGVFbnRpdGllc1swXTtcbiAgICB9XG4gICAgZ2V0IHRlbXBlcmF0dXJlRW50aXR5KCkge1xuICAgICAgICBjb25zdCBtYWdpY0FyZWFzR2xvYmFsRGV2aWNlID0gdGhpcy5kZXZpY2VzLmZpbmQoKGRldmljZSk9PmRldmljZS5pZGVudGlmaWVycy5maW5kKChpZGVudGlmaWVycyk9PmlkZW50aWZpZXJzWzBdID09PSBNQUdJQ19BUkVBU19QTEFURk9STSAmJiBpZGVudGlmaWVyc1sxXSA9PT0gTUFHSUNfQVJFQVNfR0xPQkFMX0RFVklDRV9JRCkpO1xuICAgICAgICBpZiAobWFnaWNBcmVhc0dsb2JhbERldmljZSkge1xuICAgICAgICAgICAgY29uc3QgbWFnaWNBcmVhc0dsb2JhbFRlbXBlcmF0dXJlRW50aXRpZXMgPSBtYWdpY0FyZWFzR2xvYmFsRGV2aWNlLmVudGl0aWVzLmZpbHRlcigoZW50aXR5KT0+J3RlbXBlcmF0dXJlJyA9PT0gZW50aXR5LnN0YXRlLmNoYXJhY3RlcmlzdGljVHlwZSk7XG4gICAgICAgICAgICBpZiAobWFnaWNBcmVhc0dsb2JhbFRlbXBlcmF0dXJlRW50aXRpZXMubGVuZ3RoID4gMCkgcmV0dXJuIG1hZ2ljQXJlYXNHbG9iYWxUZW1wZXJhdHVyZUVudGl0aWVzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRlbXBlcmF0dXJlRW50aXRpZXMgPSB0aGlzLmVudGl0aWVzLmZpbHRlcigoZW50aXR5KT0+J3RlbXBlcmF0dXJlJyA9PT0gZW50aXR5LnN0YXRlLmNoYXJhY3RlcmlzdGljVHlwZSk7XG4gICAgICAgIGlmICgxID09PSB0ZW1wZXJhdHVyZUVudGl0aWVzLmxlbmd0aCkgcmV0dXJuIHRlbXBlcmF0dXJlRW50aXRpZXNbMF07XG4gICAgfVxuICAgIGdldCBodW1pZGl0eUVudGl0eSgpIHtcbiAgICAgICAgY29uc3QgbWFnaWNBcmVhc0dsb2JhbERldmljZSA9IHRoaXMuZGV2aWNlcy5maW5kKChkZXZpY2UpPT5kZXZpY2UuaWRlbnRpZmllcnMuZmluZCgoaWRlbnRpZmllcnMpPT5pZGVudGlmaWVyc1swXSA9PT0gTUFHSUNfQVJFQVNfUExBVEZPUk0gJiYgaWRlbnRpZmllcnNbMV0gPT09IE1BR0lDX0FSRUFTX0dMT0JBTF9ERVZJQ0VfSUQpKTtcbiAgICAgICAgaWYgKG1hZ2ljQXJlYXNHbG9iYWxEZXZpY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNHbG9iYWxIdW1pZGl0eUVudGl0aWVzID0gbWFnaWNBcmVhc0dsb2JhbERldmljZS5lbnRpdGllcy5maWx0ZXIoKGVudGl0eSk9PidodW1pZGl0eScgPT09IGVudGl0eS5zdGF0ZS5jaGFyYWN0ZXJpc3RpY1R5cGUpO1xuICAgICAgICAgICAgaWYgKG1hZ2ljQXJlYXNHbG9iYWxIdW1pZGl0eUVudGl0aWVzLmxlbmd0aCA+IDApIHJldHVybiBtYWdpY0FyZWFzR2xvYmFsSHVtaWRpdHlFbnRpdGllc1swXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBodW1pZGl0eUVudGl0aWVzID0gdGhpcy5lbnRpdGllcy5maWx0ZXIoKGVudGl0eSk9PidodW1pZGl0eScgPT09IGVudGl0eS5zdGF0ZS5jaGFyYWN0ZXJpc3RpY1R5cGUpO1xuICAgICAgICBpZiAoMSA9PT0gaHVtaWRpdHlFbnRpdGllcy5sZW5ndGgpIHJldHVybiBodW1pZGl0eUVudGl0aWVzWzBdO1xuICAgIH1cbiAgICBnZXQgY292ZXJFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNHbG9iYWxEZXZpY2UgPSB0aGlzLmRldmljZXMuZmluZCgoZGV2aWNlKT0+ZGV2aWNlLmlkZW50aWZpZXJzLmZpbmQoKGlkZW50aWZpZXJzKT0+aWRlbnRpZmllcnNbMF0gPT09IE1BR0lDX0FSRUFTX1BMQVRGT1JNICYmIGlkZW50aWZpZXJzWzFdID09PSBNQUdJQ19BUkVBU19HTE9CQUxfREVWSUNFX0lEKSk7XG4gICAgICAgIGlmIChtYWdpY0FyZWFzR2xvYmFsRGV2aWNlKSB7XG4gICAgICAgICAgICBjb25zdCBtYWdpY0FyZWFzR2xvYmFsQ292ZXJFbnRpdGllcyA9IG1hZ2ljQXJlYXNHbG9iYWxEZXZpY2UuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAgICAgJ2NvdmVyJ1xuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAobWFnaWNBcmVhc0dsb2JhbENvdmVyRW50aXRpZXMubGVuZ3RoID4gMCkgcmV0dXJuIG1hZ2ljQXJlYXNHbG9iYWxDb3ZlckVudGl0aWVzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvdmVyRW50aXRpZXMgPSB0aGlzLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgJ2NvdmVyJ1xuICAgICAgICBdKTtcbiAgICAgICAgaWYgKDEgPT09IGNvdmVyRW50aXRpZXMubGVuZ3RoKSByZXR1cm4gY292ZXJFbnRpdGllc1swXTtcbiAgICB9XG4gICAgZ2V0IGxpZ2h0RW50aXR5KCkge1xuICAgICAgICBjb25zdCBtYWdpY0FyZWFzR2xvYmFsRGV2aWNlID0gdGhpcy5kZXZpY2VzLmZpbmQoKGRldmljZSk9PmRldmljZS5pZGVudGlmaWVycy5maW5kKChpZGVudGlmaWVycyk9PmlkZW50aWZpZXJzWzBdID09PSBNQUdJQ19BUkVBU19QTEFURk9STSAmJiBpZGVudGlmaWVyc1sxXSA9PT0gTUFHSUNfQVJFQVNfR0xPQkFMX0RFVklDRV9JRCkpO1xuICAgICAgICBpZiAobWFnaWNBcmVhc0dsb2JhbERldmljZSkge1xuICAgICAgICAgICAgY29uc3QgbWFnaWNBcmVhc0dsb2JhbExpZ2h0RW50aXRpZXMgPSBtYWdpY0FyZWFzR2xvYmFsRGV2aWNlLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgICAgICdsaWdodCdcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKG1hZ2ljQXJlYXNHbG9iYWxMaWdodEVudGl0aWVzLmxlbmd0aCA+IDApIHJldHVybiBtYWdpY0FyZWFzR2xvYmFsTGlnaHRFbnRpdGllc1swXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsaWdodEVudGl0aWVzID0gdGhpcy5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICdsaWdodCdcbiAgICAgICAgXSk7XG4gICAgICAgIGlmICgxID09PSBsaWdodEVudGl0aWVzLmxlbmd0aCkgcmV0dXJuIGxpZ2h0RW50aXRpZXNbMF07XG4gICAgfVxuICAgIGdldCBsb2NrRW50aXR5KCkge1xuICAgICAgICBjb25zdCBtYWdpY0FyZWFzR2xvYmFsRGV2aWNlID0gdGhpcy5kZXZpY2VzLmZpbmQoKGRldmljZSk9PmRldmljZS5pZGVudGlmaWVycy5maW5kKChpZGVudGlmaWVycyk9PmlkZW50aWZpZXJzWzBdID09PSBNQUdJQ19BUkVBU19QTEFURk9STSAmJiBpZGVudGlmaWVyc1sxXSA9PT0gTUFHSUNfQVJFQVNfR0xPQkFMX0RFVklDRV9JRCkpO1xuICAgICAgICBpZiAobWFnaWNBcmVhc0dsb2JhbERldmljZSkge1xuICAgICAgICAgICAgY29uc3QgbWFnaWNBcmVhc0dsb2JhbExvY2tFbnRpdGllcyA9IG1hZ2ljQXJlYXNHbG9iYWxEZXZpY2UuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAgICAgJ2xvY2snXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGlmIChtYWdpY0FyZWFzR2xvYmFsTG9ja0VudGl0aWVzLmxlbmd0aCA+IDApIHJldHVybiBtYWdpY0FyZWFzR2xvYmFsTG9ja0VudGl0aWVzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxvY2tFbnRpdGllcyA9IHRoaXMuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAnbG9jaydcbiAgICAgICAgXSk7XG4gICAgICAgIGlmICgxID09PSBsb2NrRW50aXRpZXMubGVuZ3RoKSByZXR1cm4gbG9ja0VudGl0aWVzWzBdO1xuICAgIH1cbiAgICBnZXQgbWVkaWFQbGF5ZXJFbnRpdHkoKSB7XG4gICAgICAgIGNvbnN0IG1hZ2ljQXJlYXNHbG9iYWxEZXZpY2UgPSB0aGlzLmRldmljZXMuZmluZCgoZGV2aWNlKT0+ZGV2aWNlLmlkZW50aWZpZXJzLmZpbmQoKGlkZW50aWZpZXJzKT0+aWRlbnRpZmllcnNbMF0gPT09IE1BR0lDX0FSRUFTX1BMQVRGT1JNICYmIGlkZW50aWZpZXJzWzFdID09PSBNQUdJQ19BUkVBU19HTE9CQUxfREVWSUNFX0lEKSk7XG4gICAgICAgIGlmIChtYWdpY0FyZWFzR2xvYmFsRGV2aWNlKSB7XG4gICAgICAgICAgICBjb25zdCBtYWdpY0FyZWFzR2xvYmFsTWVkaWFQbGF5ZXJFbnRpdGllcyA9IG1hZ2ljQXJlYXNHbG9iYWxEZXZpY2UuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAgICAgJ21lZGlhX3BsYXllcidcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKG1hZ2ljQXJlYXNHbG9iYWxNZWRpYVBsYXllckVudGl0aWVzLmxlbmd0aCA+IDApIHJldHVybiBtYWdpY0FyZWFzR2xvYmFsTWVkaWFQbGF5ZXJFbnRpdGllc1swXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZWRpYVBsYXllckVudGl0aWVzID0gdGhpcy5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICdtZWRpYV9wbGF5ZXInXG4gICAgICAgIF0pO1xuICAgICAgICBpZiAoMSA9PT0gbWVkaWFQbGF5ZXJFbnRpdGllcy5sZW5ndGgpIHJldHVybiBtZWRpYVBsYXllckVudGl0aWVzWzBdO1xuICAgIH1cbiAgICBnZXQgY28yU2lnbmFsRW50aXR5KCkge1xuICAgICAgICBjb25zdCBjbzJTaWduYWxEZXZpY2VzID0gdGhpcy5kZXZpY2VzLmZpbHRlcigoZGV2aWNlKT0+ZGV2aWNlLmlkZW50aWZpZXJzLnNvbWUoKGlkZW50aWZpZXJzKT0+J2NvMnNpZ25hbCcgPT09IGlkZW50aWZpZXJzWzBdKSk7XG4gICAgICAgIGlmIChjbzJTaWduYWxEZXZpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGNvMlNpZ25hbEVudGl0aWVzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNvMlNpZ25hbERldmljZSBvZiBjbzJTaWduYWxEZXZpY2VzKXtcbiAgICAgICAgICAgICAgICBjb25zdCBjbzJTaWduYWxEZXZpY2VFbnRpdGllcyA9IGNvMlNpZ25hbERldmljZS5lbnRpdGllcy5maWx0ZXIoKGVudGl0eSk9PiclJyA9PT0gZW50aXR5LnN0YXRlLnVuaXRzKTtcbiAgICAgICAgICAgICAgICBpZiAoY28yU2lnbmFsRGV2aWNlRW50aXRpZXMubGVuZ3RoID4gMCkgY28yU2lnbmFsRW50aXRpZXMucHVzaCguLi5jbzJTaWduYWxEZXZpY2VFbnRpdGllcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY28yU2lnbmFsRW50aXRpZXMubGVuZ3RoID4gMCkgcmV0dXJuIGNvMlNpZ25hbEVudGl0aWVzWzBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCB3YXN0ZUVudGl0eSgpIHtcbiAgICAgICAgY29uc3Qgd2FzdGVFbnRpdGllcyA9IHRoaXMuZW50aXRpZXNXaXRoRG9tYWlucyhbXG4gICAgICAgICAgICAnY2FsZW5kYXInXG4gICAgICAgIF0pLmZpbHRlcigoZW50aXR5KT0+ZW50aXR5Lm5hbWUuaW5jbHVkZXMoJ3dhc3RlJykpO1xuICAgICAgICBpZiAod2FzdGVFbnRpdGllcy5sZW5ndGggPiAwKSByZXR1cm4gd2FzdGVFbnRpdGllc1swXTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoaGFzcywgY29uZmlnID0ge30pe1xuICAgICAgICBob21lX2RlZmluZV9wcm9wZXJ0eSh0aGlzLCBcImhhc3NcIiwgdm9pZCAwKTtcbiAgICAgICAgaG9tZV9kZWZpbmVfcHJvcGVydHkodGhpcywgXCJjb25maWdcIiwge1xuICAgICAgICAgICAgYXJlYXM6IFtdXG4gICAgICAgIH0pO1xuICAgICAgICBob21lX2RlZmluZV9wcm9wZXJ0eSh0aGlzLCBcImNhY2hlXCIsIHt9KTtcbiAgICAgICAgdGhpcy5oYXNzID0gaGFzcztcbiAgICAgICAgdGhpcy5jb25maWcgPSBIb21lLmNyZWF0ZUNvbmZpZyhjb25maWcpO1xuICAgIH1cbn1cbmV4cG9ydCB7IEF1dG9tYXRpb25FbnRpdHksIEF1dG9tYXRpb25TdGF0ZSwgQ2xpbWF0ZUVudGl0eSwgQ2xpbWF0ZVN0YXRlLCBEZXZpY2UsIEVudGl0eSwgRmxvb3IsIEhvbWUsIExpZ2h0RW50aXR5LCBMaWdodFN0YXRlLCBTdGF0ZSB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29uZmlnQXJlYXMocGFydGlhbENvbmZpZykge1xuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgYXJlYXM6IFtdXG4gICAgfTtcbiAgICBpZiAocGFydGlhbENvbmZpZy5hcmVhcykge1xuICAgICAgICBmb3IgKGNvbnN0IGFyZWEgb2YgcGFydGlhbENvbmZpZy5hcmVhcyl7XG4gICAgICAgICAgICBpZiAoYXJlYSAmJiBhcmVhLmlkKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLmFyZWFzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogYXJlYS5pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25maWc7XG59XG4iLCJpbXBvcnQgeyBSZWFjdGl2ZUVsZW1lbnQgfSBmcm9tICdsaXQnO1xuaW1wb3J0IHsgQ1VTVE9NX0VMRU1FTlRfTkFNRSB9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBBdXRvbWF0aW9uU2VjdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi4vc2VjdGlvbnMvYXV0b21hdGlvbnMtc2VjdGlvbic7XG5pbXBvcnQgeyBIb21lIH0gZnJvbSAnQHNtb2xwYWNrL2hhc3NraXQnO1xuaW1wb3J0IHsgY3JlYXRlQ29uZmlnQXJlYXMgfSBmcm9tICcuLi8uLi91dGlscyc7XG4vKipcbiAqIFNob3cgYXV0b21hdGlvbnMgZ3JvdXBlZCBieSBmbG9vciBhbmQgYXJlYS5cbiAqLyBleHBvcnQgY2xhc3MgQXV0b21hdGlvbnNWaWV3U3RyYXRlZ3kgZXh0ZW5kcyBSZWFjdGl2ZUVsZW1lbnQge1xuICAgIC8qKlxuICAgKiBCdWlsZCB0aGUgYXV0b21hdGlvbnMgdmlldy5cbiAgICpcbiAgICogQHBhcmFtIHBhcnRpYWxDb25maWcgLSBQYXJ0aWFsIGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgZGFzaGJvYXJkLlxuICAgKiBAcGFyYW0gaGFzcyAtIEhvbWUgQXNzaXN0YW50IGluc3RhbmNlLlxuICAgKiBAcmV0dXJucyBMb3ZlbGFjZSB2aWV3IGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUocGFydGlhbENvbmZpZywgaGFzcykge1xuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmNyZWF0ZUNvbmZpZyhwYXJ0aWFsQ29uZmlnKTtcbiAgICAgICAgY29uc3QgaG9tZSA9IG5ldyBIb21lKGhhc3MsIGNvbmZpZyk7XG4gICAgICAgIGNvbnN0IHZpZXcgPSB7XG4gICAgICAgICAgICBiYWRnZXM6IGF3YWl0IHRoaXMuZ2VuZXJhdGVCYWRnZXMoKSxcbiAgICAgICAgICAgIHNlY3Rpb25zOiBhd2FpdCB0aGlzLmdlbmVyYXRlU2VjdGlvbnMoaG9tZSlcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICAgIC8qKlxuICAgKiBOb3JtYWxpemUgdGhlIGF1dG9tYXRpb25zIHZpZXcgY29uZmlnLlxuICAgKlxuICAgKiBAcGFyYW0gcGFydGlhbENvbmZpZyAtIFBhcnRpYWwgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMgQ29tcGxldGVkIGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgY3JlYXRlQ29uZmlnKHBhcnRpYWxDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmNyZWF0ZUNvbmZpZ0FyZWFzKHBhcnRpYWxDb25maWcpXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgKiBDdXJyZW50bHkgdGhlcmUgYXJlIG5vIGJhZGdlcyBmb3IgdGhlIGF1dG9tYXRpb25zIHZpZXcuXG4gICAqXG4gICAqIEByZXR1cm5zIEVtcHR5IGFycmF5IG9mIGJhZGdlcy5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZUJhZGdlcygpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvKipcbiAgICogQ3JlYXRlIGF1dG9tYXRpb24gc2VjdGlvbnMgZm9yIGhvbWUgYW5kIGVhY2ggZmxvb3IuXG4gICAqXG4gICAqIEBwYXJhbSBob21lIC0gSG9tZSBjb250ZXh0LlxuICAgKiBAcmV0dXJucyBBcnJheSBvZiBzZWN0aW9uIGNvbmZpZ3MuXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVTZWN0aW9ucyhob21lKSB7XG4gICAgICAgIGNvbnN0IHNlY3Rpb25zID0gW1xuICAgICAgICAgICAgYXdhaXQgQXV0b21hdGlvblNlY3Rpb25TdHJhdGVneS5nZW5lcmF0ZShob21lKVxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IGZsb29yIG9mIGhvbWUuZmxvb3JzKXtcbiAgICAgICAgICAgIHNlY3Rpb25zLnB1c2goYXdhaXQgQXV0b21hdGlvblNlY3Rpb25TdHJhdGVneS5nZW5lcmF0ZShob21lLCBmbG9vcikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWN0aW9ucztcbiAgICB9XG4gICAgLyoqXG4gICAqIERldGVybWluZSBjb2x1bW4gY291bnQgZm9yIHRoZSB2aWV3IGdyaWQuXG4gICAqXG4gICAqIEBwYXJhbSBob21lIC0gSG9tZSBjb250ZXh0LlxuICAgKiBAcmV0dXJucyBOdW1iZXIgb2YgY29sdW1ucy5cbiAgICovIHN0YXRpYyBtYXhDb2x1bW5zKGhvbWUpIHtcbiAgICAgICAgbGV0IG1heENvbHVtbnMgPSAxO1xuICAgICAgICBmb3IgKGNvbnN0IGZsb29yIG9mIGhvbWUuem9uZXMpe1xuICAgICAgICAgICAgZm9yIChjb25zdCBhcmVhIG9mIGZsb29yLnJvb21zKXtcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhQXV0b21hdGlvbkVudGl0aWVzID0gYXJlYS5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICAgICAgICAgJ2F1dG9tYXRpb24nXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyZWFBdXRvbWF0aW9uRW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhDb2x1bW5zID0gbWF4Q29sdW1ucysrO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heENvbHVtbnM7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKGBsbC1zdHJhdGVneS12aWV3LSR7Q1VTVE9NX0VMRU1FTlRfTkFNRX0tYXV0b21hdGlvbnNgLCBBdXRvbWF0aW9uc1ZpZXdTdHJhdGVneSk7XG4iLCIvKipcbiAqIEJ1aWxkIGEgYmFkZ2UgZm9yIGNsaW1hdGUgZW50aXRpZXMgbGlrZSB0aGVybW9zdGF0cyBvciBmYW5zLlxuICovIGV4cG9ydCBjbGFzcyBDbGltYXRlQmFkZ2VTdHJhdGVneSB7XG4gICAgLyoqXG4gICAqIENyZWF0ZSB0aGUgTG92ZWxhY2UgY29uZmlndXJhdGlvbiBmb3IgYSBjbGltYXRlIGJhZGdlLlxuICAgKlxuICAgKiBAcGFyYW0gY2xpbWF0ZUVudGl0eSAtIFRoZSBlbnRpdHkgcmVwcmVzZW50aW5nIHRoZSBjbGltYXRlIGRldmljZS5cbiAgICogQHJldHVybnMgVGhlIGJhZGdlIGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUoY2xpbWF0ZUVudGl0eSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2VudGl0eScsXG4gICAgICAgICAgICBlbnRpdHk6IGNsaW1hdGVFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgIG5hbWU6IGNsaW1hdGVFbnRpdHkubmFtZSxcbiAgICAgICAgICAgIGljb246IGNsaW1hdGVFbnRpdHkuaWNvbiB8fCAnbWRpOmZhbicsXG4gICAgICAgICAgICBzaG93X25hbWU6IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCIvKipcbiAqIEJ1aWxkIGEgd2VhdGhlciBiYWRnZSBjb25maWd1cmF0aW9uLlxuICovIGV4cG9ydCBjbGFzcyBXZWF0aGVyQmFkZ2VTdHJhdGVneSB7XG4gICAgLyoqXG4gICAqIEdlbmVyYXRlIGEgYmFkZ2UgcmVwcmVzZW50aW5nIHRoZSB3ZWF0aGVyIGVudGl0eS5cbiAgICpcbiAgICogQHBhcmFtIHdlYXRoZXJFbnRpdHkgLSBUaGUgd2VhdGhlciBlbnRpdHkgdG8gZGlzcGxheS5cbiAgICogQHJldHVybnMgVGhlIGJhZGdlIGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUod2VhdGhlckVudGl0eSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2VudGl0eScsXG4gICAgICAgICAgICBlbnRpdHk6IHdlYXRoZXJFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgIG5hbWU6IHdlYXRoZXJFbnRpdHkubmFtZSxcbiAgICAgICAgICAgIHNob3dfbmFtZTogdHJ1ZSxcbiAgICAgICAgICAgIHN0YXRlX2NvbnRlbnQ6IFtcbiAgICAgICAgICAgICAgICAnc3RhdGUnLFxuICAgICAgICAgICAgICAgICd0ZW1wZXJhdHVyZSdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCIvKipcbiAqIEJ1aWxkIExvdmVsYWNlIGJhZGdlIGNvbmZpZ3MgZm9yIGxpZ2h0IGVudGl0aWVzLlxuICovIGV4cG9ydCBjbGFzcyBMaWdodHNCYWRnZVN0cmF0ZWd5IHtcbiAgICAvKipcbiAgICogQ3JlYXRlIGEgYmFkZ2UgdGhhdCBkaXNwbGF5cyBhIGxpZ2h0IGVudGl0eS5cbiAgICpcbiAgICogQHBhcmFtIGxpZ2h0RW50aXR5IC0gVGhlIGxpZ2h0IHRvIHJlbmRlci5cbiAgICogQHJldHVybnMgVGhlIGJhZGdlIGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUobGlnaHRFbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdlbnRpdHknLFxuICAgICAgICAgICAgZW50aXR5OiBsaWdodEVudGl0eS51bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICAgICAgbmFtZTogbGlnaHRFbnRpdHkubmFtZSxcbiAgICAgICAgICAgIGljb246IGxpZ2h0RW50aXR5Lmljb24gfHwgJ21kaTpsaWdodGJ1bGItZ3JvdXAnLFxuICAgICAgICAgICAgc2hvd19uYW1lOiB0cnVlLFxuICAgICAgICAgICAgc3RhdGVfY29udGVudDogW1xuICAgICAgICAgICAgICAgICdzdGF0ZSdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCIvKipcbiAqIEdlbmVyYXRlIGJhZGdlcyBmb3Igc2VjdXJpdHkgcmVsYXRlZCBlbnRpdGllcy5cbiAqLyBleHBvcnQgY2xhc3MgU2VjdXJpdHlCYWRnZVN0cmF0ZWd5IHtcbiAgICAvKipcbiAgICogQnVpbGQgdGhlIGJhZGdlIGNvbmZpZ3VyYXRpb24gZm9yIGEgbG9jayBvciBhbGFybSBlbnRpdHkuXG4gICAqXG4gICAqIEBwYXJhbSBzZWN1cml0eUVudGl0eSAtIFRoZSBzZWN1cml0eSBlbnRpdHkgdG8gZGlzcGxheS5cbiAgICogQHJldHVybnMgVGhlIGdlbmVyYXRlZCBiYWRnZSBjb25maWd1cmF0aW9uLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlKHNlY3VyaXR5RW50aXR5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnZW50aXR5JyxcbiAgICAgICAgICAgIGVudGl0eTogc2VjdXJpdHlFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgIG5hbWU6IHNlY3VyaXR5RW50aXR5Lm5hbWUsXG4gICAgICAgICAgICBpY29uOiBzZWN1cml0eUVudGl0eS5pY29uIHx8ICdtZGk6bG9jaycsXG4gICAgICAgICAgICBzaG93X25hbWU6IHRydWUsXG4gICAgICAgICAgICBzdGF0ZV9jb250ZW50OiBbXG4gICAgICAgICAgICAgICAgJ3N0YXRlJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qKlxuICogU3RyYXRlZ3kgZm9yIGdlbmVyYXRpbmcgYmFkZ2VzIGZvciBzcGVha2VycyBvciB0ZWxldmlzaW9ucy5cbiAqLyBleHBvcnQgY2xhc3MgU3BlYWtlcnNUdnNCYWRnZVN0cmF0ZWd5IHtcbiAgICAvKipcbiAgICogQnVpbGQgdGhlIGJhZGdlIGNvbmZpZ3VyYXRpb24gZm9yIG1lZGlhIHBsYXllciBlbnRpdGllcy5cbiAgICpcbiAgICogQHBhcmFtIG1lZGlhUGxheWVyRW50aXR5IC0gVGhlIG1lZGlhIHBsYXllciB0byBkaXNwbGF5LlxuICAgKiBAcmV0dXJucyBUaGUgcmVzdWx0aW5nIGJhZGdlIGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUobWVkaWFQbGF5ZXJFbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdlbnRpdHknLFxuICAgICAgICAgICAgZW50aXR5OiBtZWRpYVBsYXllckVudGl0eS51bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICAgICAgbmFtZTogbWVkaWFQbGF5ZXJFbnRpdHkubmFtZSxcbiAgICAgICAgICAgIGljb246IG1lZGlhUGxheWVyRW50aXR5Lmljb24gfHwgJ21kaTp0ZWxldmlzaW9uLXNwZWFrZXInLFxuICAgICAgICAgICAgc2hvd19uYW1lOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJpbGl0eTogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiAnb3InLFxuICAgICAgICAgICAgICAgICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiAnc3RhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudGl0eTogbWVkaWFQbGF5ZXJFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogJ29uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246ICdzdGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5OiBtZWRpYVBsYXllckVudGl0eS51bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiAncGxheWluZydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiAnc3RhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudGl0eTogbWVkaWFQbGF5ZXJFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogJ2J1ZmZlcmluZydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCIvKipcbiAqIFJlbmRlciBjb250cm9scyBmb3IgY2xpbWF0ZSBkZXZpY2VzLlxuICovIGV4cG9ydCBjbGFzcyBDbGltYXRlQ2FyZFN0cmF0ZWd5IHtcbiAgICAvKipcbiAgICogQnVpbGQgYSBjbGltYXRlIGNvbnRyb2wgY2FyZC5cbiAgICpcbiAgICogQHBhcmFtIGNsaW1hdGVFbnRpdHkgLSBUaGUgY2xpbWF0ZSBlbnRpdHkgdG8gY29udHJvbC5cbiAgICogQHJldHVybnMgVGhlIExvdmVsYWNlIGNhcmQgY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZShjbGltYXRlRW50aXR5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAndGlsZScsXG4gICAgICAgICAgICBlbnRpdHk6IGNsaW1hdGVFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgIG5hbWU6IGNsaW1hdGVFbnRpdHkubmFtZSxcbiAgICAgICAgICAgIGNvbnRyb2w6ICdjbGltYXRlJyxcbiAgICAgICAgICAgIGZlYXR1cmVzOiBhd2FpdCB0aGlzLmdlbmVyYXRlRmVhdHVyZXMoY2xpbWF0ZUVudGl0eSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEJ1aWxkIGEgbGlzdCBvZiBmZWF0dXJlcyBmb3IgdGhlIGNsaW1hdGUgY2FyZC5cbiAgICpcbiAgICogQHBhcmFtIGNsaW1hdGVFbnRpdHkgLSBUaGUgY2xpbWF0ZSBlbnRpdHkgdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMgVGhlIGZlYXR1cmVzIHRvIGVuYWJsZS5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZUZlYXR1cmVzKGNsaW1hdGVFbnRpdHkpIHtcbiAgICAgICAgY29uc3QgZmVhdHVyZXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2NsaW1hdGUtaHZhYy1tb2RlcycsXG4gICAgICAgICAgICAgICAgc3R5bGU6ICdpY29ucycsXG4gICAgICAgICAgICAgICAgaHZhY19tb2RlczogW1xuICAgICAgICAgICAgICAgICAgICAnb2ZmJyxcbiAgICAgICAgICAgICAgICAgICAgJ2F1dG8nLFxuICAgICAgICAgICAgICAgICAgICAnaGVhdCcsXG4gICAgICAgICAgICAgICAgICAgICdmYW5fb25seScsXG4gICAgICAgICAgICAgICAgICAgICdjb29sJyxcbiAgICAgICAgICAgICAgICAgICAgJ2RyeSdcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICAgIGlmIChjbGltYXRlRW50aXR5LnN0YXRlLmZhbk1vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZlYXR1cmVzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdjbGltYXRlLWZhbi1tb2RlcycsXG4gICAgICAgICAgICAgICAgc3R5bGU6ICdkcm9wZG93bidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZlYXR1cmVzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ3RhcmdldC10ZW1wZXJhdHVyZSdcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmZWF0dXJlcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDbGltYXRlQmFkZ2VTdHJhdGVneSB9IGZyb20gJy4uL2JhZGdlcy9jbGltYXRlLWJhZGdlJztcbmltcG9ydCB7IExpZ2h0c0JhZGdlU3RyYXRlZ3kgfSBmcm9tICcuLi9iYWRnZXMvbGlnaHRzLWJhZGdlJztcbmltcG9ydCB7IFNlY3VyaXR5QmFkZ2VTdHJhdGVneSB9IGZyb20gJy4uL2JhZGdlcy9zZWN1cml0eS1iYWRnZSc7XG5pbXBvcnQgeyBTcGVha2Vyc1R2c0JhZGdlU3RyYXRlZ3kgfSBmcm9tICcuLi9iYWRnZXMvc3BlYWtlcnMtdHZzLWJhZGdlJztcbi8qKlxuICogU3RyYXRlZ3kgZm9yIGhlYWRpbmcgY2FyZHMgdGhhdCBpbnRyb2R1Y2UgYSBmbG9vci5cbiAqLyBleHBvcnQgY2xhc3MgRmxvb3JIZWFkaW5nQ2FyZFN0cmF0ZWd5IHtcbiAgICAvKipcbiAgICogR2VuZXJhdGUgdGhlIGhlYWRpbmcgY2FyZCBmb3IgYSBmbG9vci5cbiAgICpcbiAgICogQHBhcmFtIGZsb29yIC0gVGhlIGZsb29yIHRvIHJlcHJlc2VudC5cbiAgICogQHJldHVybnMgVGhlIGNhcmQgY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZShmbG9vcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2hlYWRpbmcnLFxuICAgICAgICAgICAgaGVhZGluZzogZmxvb3IubmFtZSxcbiAgICAgICAgICAgIGljb246IGZsb29yLmljb24sXG4gICAgICAgICAgICB0YXBfYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnbmF2aWdhdGUnLFxuICAgICAgICAgICAgICAgIG5hdmlnYXRpb25fcGF0aDogYC8ke2Zsb29yLnVuaXF1ZUlkZW50aWZpZXJ9YFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJhZGdlczogYXdhaXQgdGhpcy5nZW5lcmF0ZUJhZGdlcyhmbG9vcilcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEJ1aWxkIGZsb29yIGxldmVsIGJhZGdlcyBmb3IgdGhlIGhlYWRpbmcgY2FyZC5cbiAgICpcbiAgICogQHBhcmFtIGZsb29yIC0gVGhlIGZsb29yIHRvIHJlbmRlci5cbiAgICogQHJldHVybnMgTGlzdCBvZiBiYWRnZXMgdG8gc2hvdy5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZUJhZGdlcyhmbG9vcikge1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAgICAgICBpZiAoZmxvb3IuY2xpbWF0ZUVudGl0eSkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChDbGltYXRlQmFkZ2VTdHJhdGVneS5nZW5lcmF0ZShmbG9vci5jbGltYXRlRW50aXR5KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZsb29yLmxpZ2h0RW50aXR5KSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKExpZ2h0c0JhZGdlU3RyYXRlZ3kuZ2VuZXJhdGUoZmxvb3IubGlnaHRFbnRpdHkpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmxvb3IubG9ja0VudGl0eSkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChTZWN1cml0eUJhZGdlU3RyYXRlZ3kuZ2VuZXJhdGUoZmxvb3IubG9ja0VudGl0eSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmbG9vci5tZWRpYVBsYXllckVudGl0eSkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChTcGVha2Vyc1R2c0JhZGdlU3RyYXRlZ3kuZ2VuZXJhdGUoZmxvb3IubWVkaWFQbGF5ZXJFbnRpdHkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLi4uYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgICAgIF07XG4gICAgfVxufVxuIiwiLyoqXG4gKiBCdWlsZCB0aWxlcyBmb3IgbGlnaHQgY29udHJvbHMuXG4gKi8gZXhwb3J0IGNsYXNzIExpZ2h0Q2FyZFN0cmF0ZWd5IHtcbiAgICAvKipcbiAgICogR2VuZXJhdGUgYSBjYXJkIGZvciBhIGxpZ2h0IGVudGl0eS5cbiAgICpcbiAgICogQHBhcmFtIGxpZ2h0RW50aXR5IC0gVGhlIGxpZ2h0IHRvIGNvbnRyb2wuXG4gICAqIEByZXR1cm5zIFRoZSBjYXJkIGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUobGlnaHRFbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICd0aWxlJyxcbiAgICAgICAgICAgIGVudGl0eTogbGlnaHRFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgIGZlYXR1cmVzOiBhd2FpdCB0aGlzLmdlbmVyYXRlRmVhdHVyZXMobGlnaHRFbnRpdHkpLFxuICAgICAgICAgICAgdmlzaWJpbGl0eTogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiAnb3InLFxuICAgICAgICAgICAgICAgICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiAnc3RhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudGl0eTogbGlnaHRFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogJ29uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246ICdzdGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5OiAnc3VuLnN1bicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6ICdiZWxvd19ob3Jpem9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogJ3N0YXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiBsaWdodEVudGl0eS51bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZV9ub3Q6ICd1bmF2YWlsYWJsZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgKiBEZXRlcm1pbmUgd2hpY2ggbGlnaHQgZmVhdHVyZXMgdG8gZXhwb3NlLlxuICAgKlxuICAgKiBAcGFyYW0gbGlnaHRFbnRpdHkgLSBUaGUgbGlnaHQgZW50aXR5IHRvIGluc3BlY3QuXG4gICAqIEByZXR1cm5zIFRoZSBmZWF0dXJlIGxpc3QgZm9yIHRoZSBjYXJkLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlRmVhdHVyZXMobGlnaHRFbnRpdHkpIHtcbiAgICAgICAgY29uc3QgZmVhdHVyZXMgPSBbXTtcbiAgICAgICAgaWYgKGxpZ2h0RW50aXR5LnN0YXRlLnN1cHBvcnRlZENvbG9yTW9kZXMuaW5jbHVkZXMoJ2JyaWdodG5lc3MnKSkge1xuICAgICAgICAgICAgZmVhdHVyZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2xpZ2h0LWJyaWdodG5lc3MnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlnaHRFbnRpdHkuc3RhdGUuc3VwcG9ydGVkQ29sb3JNb2Rlcy5pbmNsdWRlcygnY29sb3JfdGVtcCcpKSB7XG4gICAgICAgICAgICBmZWF0dXJlcy5wdXNoKC4uLltcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaWdodC1icmlnaHRuZXNzJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGlnaHQtY29sb3ItdGVtcCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmVhdHVyZXM7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBCdWlsZCBhIHRpbGUgZm9yIGxvY2sgZW50aXRpZXMuXG4gKi8gZXhwb3J0IGNsYXNzIFNlY3VyaXR5Q2FyZFN0cmF0ZWd5IHtcbiAgICAvKipcbiAgICogQ3JlYXRlIGEgY2FyZCBmb3IgYSBzZWN1cml0eSBsb2NrLlxuICAgKlxuICAgKiBAcGFyYW0gbG9ja0VudGl0eSAtIFRoZSBsb2NrIG9yIGFsYXJtIGVudGl0eS5cbiAgICogQHJldHVybnMgVGhlIGNhcmQgY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZShsb2NrRW50aXR5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAndGlsZScsXG4gICAgICAgICAgICBlbnRpdHk6IGxvY2tFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgIGZlYXR1cmVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbG9jay1jb21tYW5kcydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiLyoqXG4gKiBCdWlsZCB0aWxlcyBmb3IgbWVkaWEgcGxheWVyIGNvbnRyb2wuXG4gKi8gZXhwb3J0IGNsYXNzIFNwZWFrZXJUdkNhcmRTdHJhdGVneSB7XG4gICAgLyoqXG4gICAqIENyZWF0ZSBhIHRpbGUgZm9yIGEgc3BlYWtlciBvciBUViBlbnRpdHkuXG4gICAqXG4gICAqIEBwYXJhbSBtZWRpYVBsYXllckVudGl0eSAtIFRoZSBtZWRpYSBwbGF5ZXIgdG8gcmVuZGVyLlxuICAgKiBAcmV0dXJucyBUaGUgY2FyZCBjb25maWd1cmF0aW9uLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlKG1lZGlhUGxheWVyRW50aXR5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAndGlsZScsXG4gICAgICAgICAgICBlbnRpdHk6IG1lZGlhUGxheWVyRW50aXR5LnVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgICAgICBmZWF0dXJlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21lZGlhLXBsYXllci12b2x1bWUtc2xpZGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB2aXNpYmlsaXR5OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246ICdvcicsXG4gICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246ICdzdGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5OiBtZWRpYVBsYXllckVudGl0eS51bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiAnb24nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogJ3N0YXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHk6IG1lZGlhUGxheWVyRW50aXR5LnVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6ICdwbGF5aW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246ICdzdGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5OiBtZWRpYVBsYXllckVudGl0eS51bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiAnYnVmZmVyaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qKlxuICogUmVuZGVyIGEgc2ltcGxlIHN3aXRjaCB0aWxlLlxuICovIGV4cG9ydCBjbGFzcyBTd2l0Y2hDYXJkU3RyYXRlZ3kge1xuICAgIC8qKlxuICAgKiBDcmVhdGUgYSBjYXJkIGZvciBhIHN3aXRjaCBlbnRpdHkuXG4gICAqXG4gICAqIEBwYXJhbSBzd2l0Y2hFbnRpdHkgLSBUaGUgc3dpdGNoIHRvIHJlbmRlci5cbiAgICogQHJldHVybnMgVGhlIGNhcmQgY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZShzd2l0Y2hFbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICd0aWxlJyxcbiAgICAgICAgICAgIGVudGl0eTogc3dpdGNoRW50aXR5LnVuaXF1ZUlkZW50aWZpZXJcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDbGltYXRlQ2FyZFN0cmF0ZWd5IH0gZnJvbSAnLi4vY2FyZHMvY2xpbWF0ZS1jYXJkJztcbmltcG9ydCB7IEZsb29ySGVhZGluZ0NhcmRTdHJhdGVneSB9IGZyb20gJy4uL2NhcmRzL2Zsb29yLWhlYWRpbmctY2FyZCc7XG5pbXBvcnQgeyBMaWdodENhcmRTdHJhdGVneSB9IGZyb20gJy4uL2NhcmRzL2xpZ2h0LWNhcmQnO1xuaW1wb3J0IHsgU2VjdXJpdHlDYXJkU3RyYXRlZ3kgfSBmcm9tICcuLi9jYXJkcy9zZWN1cml0eS1jYXJkJztcbmltcG9ydCB7IFNwZWFrZXJUdkNhcmRTdHJhdGVneSB9IGZyb20gJy4uL2NhcmRzL3NwZWFrZXItdHYtY2FyZCc7XG5pbXBvcnQgeyBTd2l0Y2hDYXJkU3RyYXRlZ3kgfSBmcm9tICcuLi9jYXJkcy9zd2l0Y2gtY2FyZCc7XG4vKipcbiAqIEJ1aWxkIGEgc2VjdGlvbiBzdW1tYXJpemluZyBhbiBlbnRpcmUgZmxvb3IuXG4gKi8gZXhwb3J0IGNsYXNzIEZsb29yU2VjdGlvblN0cmF0ZWd5IHtcbiAgICAvKipcbiAgICogR2VuZXJhdGUgYSBMb3ZlbGFjZSBzZWN0aW9uIGZvciB0aGUgcHJvdmlkZWQgZmxvb3IuXG4gICAqXG4gICAqIEBwYXJhbSBmbG9vciAtIEZsb29yIHRvIHJlbmRlci5cbiAgICogQHJldHVybnMgVGhlIHNlY3Rpb24gY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZShmbG9vcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2dyaWQnLFxuICAgICAgICAgICAgY2FyZHM6IGF3YWl0IHRoaXMuZ2VuZXJhdGVDYXJkcyhmbG9vcilcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAqIENyZWF0ZSBhbGwgY2FyZHMgYmVsb25naW5nIHRvIHRoZSBmbG9vciBzZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZmxvb3IgLSBGbG9vciBjb250ZXh0LlxuICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgY2FyZHMuXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVDYXJkcyhmbG9vcikge1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtcbiAgICAgICAgICAgIEZsb29ySGVhZGluZ0NhcmRTdHJhdGVneS5nZW5lcmF0ZShmbG9vcilcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBhcmVhIG9mIGZsb29yLmFyZWFzKXtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2xpbWF0ZVNlcnZpY2Ugb2YgYXJlYS5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICAgICAnY2xpbWF0ZSdcbiAgICAgICAgICAgIF0pKXtcbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKENsaW1hdGVDYXJkU3RyYXRlZ3kuZ2VuZXJhdGUoY2xpbWF0ZVNlcnZpY2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGFyZWEgb2YgZmxvb3IuYXJlYXMpe1xuICAgICAgICAgICAgaWYgKGFyZWEubGlnaHRFbnRpdHlHcm91cHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbGlnaHRFbnRpdHkgb2YgYXJlYS5saWdodEVudGl0eUdyb3Vwcyl7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goTGlnaHRDYXJkU3RyYXRlZ3kuZ2VuZXJhdGUobGlnaHRFbnRpdHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbGlnaHRFbnRpdHkgb2YgYXJlYS5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICAgICAgICAgJ2xpZ2h0J1xuICAgICAgICAgICAgICAgIF0pKXtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChMaWdodENhcmRTdHJhdGVneS5nZW5lcmF0ZShsaWdodEVudGl0eSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGFyZWEgb2YgZmxvb3IuYXJlYXMpe1xuICAgICAgICAgICAgY29uc3QgbG9ja0VudGl0aWVzID0gYXJlYS5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICAgICAnbG9jaydcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKGxvY2tFbnRpdGllcykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbG9ja0VudGl0eSBvZiBsb2NrRW50aXRpZXMpe1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKFNlY3VyaXR5Q2FyZFN0cmF0ZWd5LmdlbmVyYXRlKGxvY2tFbnRpdHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByb29tIG9mIGZsb29yLnJvb21zKXtcbiAgICAgICAgICAgIGNvbnN0IG1lZGlhUGxheWVyRW50aXRpZXMgPSByb29tLmVudGl0aWVzV2l0aERvbWFpbnMoW1xuICAgICAgICAgICAgICAgICdtZWRpYV9wbGF5ZXInXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGlmIChtZWRpYVBsYXllckVudGl0aWVzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBtZWRpYVBsYXllckVudGl0eSBvZiBtZWRpYVBsYXllckVudGl0aWVzKXtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChTcGVha2VyVHZDYXJkU3RyYXRlZ3kuZ2VuZXJhdGUobWVkaWFQbGF5ZXJFbnRpdHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByb29tIG9mIGZsb29yLnJvb21zKXtcbiAgICAgICAgICAgIGNvbnN0IHN3aXRjaEVudGl0aWVzID0gcm9vbS5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICAgICAnc3dpdGNoJ1xuICAgICAgICAgICAgXSkuZmlsdGVyKChlbnRpdHkpPT4hZW50aXR5LmhpZGRlbik7XG4gICAgICAgICAgICBpZiAoc3dpdGNoRW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN3aXRjaEVudGl0eSBvZiBzd2l0Y2hFbnRpdGllcyl7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goU3dpdGNoQ2FyZFN0cmF0ZWd5LmdlbmVyYXRlKHN3aXRjaEVudGl0eSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLi4uYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgICAgIF07XG4gICAgfVxufVxuIiwiLyoqXG4gKiBEaXNwbGF5IHVwY29taW5nIHdhc3RlIGNvbGxlY3Rpb24gaW5mb3JtYXRpb24uXG4gKi8gZXhwb3J0IGNsYXNzIFdhc3RlQmFkZ2VTdHJhdGVneSB7XG4gICAgLyoqXG4gICAqIEdlbmVyYXRlIGNvbmZpZ3VyYXRpb24gZm9yIGEgd2FzdGUgZW50aXR5IGJhZGdlLlxuICAgKlxuICAgKiBAcGFyYW0gd2FzdGVFbnRpdHkgLSBUaGUgd2FzdGUgc2NoZWR1bGUgZW50aXR5LlxuICAgKiBAcmV0dXJucyBUaGUgYmFkZ2UgY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZSh3YXN0ZUVudGl0eSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2VudGl0eScsXG4gICAgICAgICAgICBlbnRpdHk6IHdhc3RlRW50aXR5LnVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgICAgICBuYW1lOiAnV2FzdGUnLFxuICAgICAgICAgICAgc2hvd19uYW1lOiB0cnVlLFxuICAgICAgICAgICAgc3RhdGVfY29udGVudDogW1xuICAgICAgICAgICAgICAgICdtZXNzYWdlJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qKlxuICogR2VuZXJhdGUgYSBMb3ZlbGFjZSBiYWRnZSBmcm9tIGEgQ0/igoIgc2lnbmFsIGVudGl0eS5cbiAqLyBleHBvcnQgY2xhc3MgRW5lcmd5QmFkZ2VTdHJhdGVneSB7XG4gICAgLyoqXG4gICAqIEJ1aWxkIHRoZSBMb3ZlbGFjZSBiYWRnZSBjb25maWd1cmF0aW9uIGZvciBlbmVyZ3kgdXNhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBjbzJTaWduYWxFbnRpdHkgLSBUaGUgZW50aXR5IHRoYXQgdHJhY2tzIENP4oKCIHNpZ25hbC5cbiAgICogQHJldHVybnMgVGhlIGJhZGdlIGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUoY28yU2lnbmFsRW50aXR5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnZW50aXR5JyxcbiAgICAgICAgICAgIGVudGl0eTogY28yU2lnbmFsRW50aXR5LnVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgICAgICBuYW1lOiBjbzJTaWduYWxFbnRpdHkubmFtZSxcbiAgICAgICAgICAgIGljb246IGNvMlNpZ25hbEVudGl0eS5pY29uIHx8ICdtZGk6bGlnaHRuaW5nLWJvbHQnLFxuICAgICAgICAgICAgY29sb3I6ICdsaWdodC1ncmVlbicsXG4gICAgICAgICAgICBzaG93X25hbWU6IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCIvKipcbiAqIFN0cmF0ZWd5IGZvciByZW5kZXJpbmcgY2FtZXJhIHRpbGVzLlxuICovIGV4cG9ydCBjbGFzcyBDYW1lcmFDYXJkU3RyYXRlZ3kge1xuICAgIC8qKlxuICAgKiBCdWlsZCBhIGNhcmQgZm9yIGEgY2FtZXJhIGVudGl0eS5cbiAgICpcbiAgICogQHBhcmFtIGNhbWVyYUVudGl0eSAtIFRoZSBjYW1lcmEgdG8gZGlzcGxheS5cbiAgICogQHJldHVybnMgVGhlIExvdmVsYWNlIGNhcmQgY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZShjYW1lcmFFbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdwaWN0dXJlLWVudGl0eScsXG4gICAgICAgICAgICBlbnRpdHk6IGNhbWVyYUVudGl0eS51bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICAgICAgY2FtZXJhX2ltYWdlOiBjYW1lcmFFbnRpdHkudW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgIHNob3dfbmFtZTogZmFsc2UsXG4gICAgICAgICAgICBzaG93X3N0YXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGNhbWVyYV92aWV3OiAnbGl2ZSdcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW1lcmFDYXJkU3RyYXRlZ3kgfSBmcm9tICcuLi9jYXJkcy9jYW1lcmEtY2FyZCc7XG5pbXBvcnQgeyBIb21lVmlld1N0cmF0ZWd5IH0gZnJvbSAnLi4vdmlld3MvaG9tZS12aWV3Jztcbi8qKlxuICogUmVuZGVyIGEgc2VjdGlvbiBsaXN0aW5nIGFsbCBjYW1lcmEgZW50aXRpZXMuXG4gKi8gZXhwb3J0IGNsYXNzIENhbWVyYXNTZWN0aW9uU3RyYXRlZ3kge1xuICAgIC8qKlxuICAgKiBCdWlsZCB0aGUgY2FtZXJhIHNlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBob21lIC0gVGhlIGhvbWUgcmVwcmVzZW50YXRpb24uXG4gICAqIEBwYXJhbSBjYW1lcmFFbnRpdGllcyAtIExpc3Qgb2YgY2FtZXJhIGVudGl0aWVzIHRvIHNob3cuXG4gICAqIEByZXR1cm5zIFNlY3Rpb24gY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZShob21lLCBjYW1lcmFFbnRpdGllcykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2dyaWQnLFxuICAgICAgICAgICAgY2FyZHM6IGF3YWl0IHRoaXMuZ2VuZXJhdGVDYXJkcyhjYW1lcmFFbnRpdGllcyksXG4gICAgICAgICAgICBjb2x1bW5fc3BhbjogSG9tZVZpZXdTdHJhdGVneS5tYXhDb2x1bW5zKGhvbWUuZmxvb3JzKVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICogQ3JlYXRlIHRoZSBjYW1lcmEgY2FyZHMgZm9yIHRoZSBzZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gY2FtZXJhRW50aXRpZXMgLSBDYW1lcmFzIHRvIGRpc3BsYXkuXG4gICAqIEByZXR1cm5zIEFycmF5IG9mIGNhbWVyYSBjYXJkcy5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZUNhcmRzKGNhbWVyYUVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IGNhcmRzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdoZWFkaW5nJyxcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiAnQ2FtZXJhcycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ21kaTp2aWRlbycsXG4gICAgICAgICAgICAgICAgdGFwX2FjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICduYXZpZ2F0ZScsXG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25fcGF0aDogYC9jYW1lcmFzYFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBjYW1lcmEgb2YgY2FtZXJhRW50aXRpZXMpe1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChDYW1lcmFDYXJkU3RyYXRlZ3kuZ2VuZXJhdGUoY2FtZXJhKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FyZHMucHVzaCguLi5hd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcykpO1xuICAgICAgICByZXR1cm4gY2FyZHM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUmVhY3RpdmVFbGVtZW50IH0gZnJvbSAnbGl0JztcbmltcG9ydCB7IEhvbWUgfSBmcm9tICdAc21vbHBhY2svaGFzc2tpdCc7XG5pbXBvcnQgeyBDVVNUT01fRUxFTUVOVF9OQU1FIH0gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7IENsaW1hdGVCYWRnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYmFkZ2VzL2NsaW1hdGUtYmFkZ2UnO1xuaW1wb3J0IHsgV2VhdGhlckJhZGdlU3RyYXRlZ3kgfSBmcm9tICcuLi9iYWRnZXMvd2VhdGhlci1iYWRnZSc7XG5pbXBvcnQgeyBMaWdodHNCYWRnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYmFkZ2VzL2xpZ2h0cy1iYWRnZSc7XG5pbXBvcnQgeyBTZWN1cml0eUJhZGdlU3RyYXRlZ3kgfSBmcm9tICcuLi9iYWRnZXMvc2VjdXJpdHktYmFkZ2UnO1xuaW1wb3J0IHsgU3BlYWtlcnNUdnNCYWRnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYmFkZ2VzL3NwZWFrZXJzLXR2cy1iYWRnZSc7XG5pbXBvcnQgeyBGbG9vclNlY3Rpb25TdHJhdGVneSB9IGZyb20gJy4uL3NlY3Rpb25zL2Zsb29yLXNlY3Rpb24nO1xuaW1wb3J0IHsgV2FzdGVCYWRnZVN0cmF0ZWd5IH0gZnJvbSAnLi4vYmFkZ2VzL3dhc3RlLWJhZGdlJztcbmltcG9ydCB7IEVuZXJneUJhZGdlU3RyYXRlZ3kgfSBmcm9tICcuLi9iYWRnZXMvZW5lcmd5LWJhZGdlJztcbmltcG9ydCB7IGNyZWF0ZUNvbmZpZ0FyZWFzIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ2FtZXJhc1NlY3Rpb25TdHJhdGVneSB9IGZyb20gJy4uL3NlY3Rpb25zL2NhbWVyYXMtc2VjdGlvbic7XG4vKipcbiAqIFN0cmF0ZWd5IGZvciB0aGUgbWFpbiBob21lIHZpZXcgY29udGFpbmluZyBmbG9vcnMgYW5kIHN5c3RlbSBiYWRnZXMuXG4gKi8gZXhwb3J0IGNsYXNzIEhvbWVWaWV3U3RyYXRlZ3kgZXh0ZW5kcyBSZWFjdGl2ZUVsZW1lbnQge1xuICAgIC8qKlxuICAgKiBCdWlsZCB0aGUgdmlldyBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gY29uZmlnIC0gVXNlciBwcm92aWRlZCBwYXJ0aWFsIGNvbmZpZy5cbiAgICogQHBhcmFtIGhhc3MgLSBIb21lIEFzc2lzdGFudCBjb25uZWN0aW9uLlxuICAgKiBAcmV0dXJucyBUaGUgTG92ZWxhY2UgdmlldyBjb25maWd1cmF0aW9uLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlKGNvbmZpZywgaGFzcykge1xuICAgICAgICBjb25zdCBob21lID0gbmV3IEhvbWUoaGFzcywgdGhpcy5jcmVhdGVDb25maWcoY29uZmlnKSk7XG4gICAgICAgIGNvbnN0IFtiYWRnZXMsIHNlY3Rpb25zXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCYWRnZXMoaG9tZSksXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlU2VjdGlvbnMoaG9tZSlcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWRnZXMsXG4gICAgICAgICAgICBzZWN0aW9uc1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICogUmVzb2x2ZSBkZWZhdWx0cyBmb3IgdGhlIHZpZXcgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHBhcnRpYWxDb25maWcgLSBQYXJ0aWFsIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIENvbXBsZXRlZCBjb25maWd1cmF0aW9uLlxuICAgKi8gc3RhdGljIGNyZWF0ZUNvbmZpZyhwYXJ0aWFsQ29uZmlnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5jcmVhdGVDb25maWdBcmVhcyhwYXJ0aWFsQ29uZmlnKVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICogR2VuZXJhdGUgYWxsIGJhZGdlcyBzaG93biBvbiB0aGUgaG9tZSB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gaG9tZSAtIFRoZSBob21lIGluc3RhbmNlLlxuICAgKiBAcmV0dXJucyBBcnJheSBvZiBiYWRnZSBjb25maWdzLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlQmFkZ2VzKGhvbWUpIHtcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgaWYgKGhvbWUud2VhdGhlckVudGl0eSkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChXZWF0aGVyQmFkZ2VTdHJhdGVneS5nZW5lcmF0ZShob21lLndlYXRoZXJFbnRpdHkpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG9tZS5jbGltYXRlRW50aXR5KSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKENsaW1hdGVCYWRnZVN0cmF0ZWd5LmdlbmVyYXRlKGhvbWUuY2xpbWF0ZUVudGl0eSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChob21lLmxpZ2h0RW50aXR5KSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKExpZ2h0c0JhZGdlU3RyYXRlZ3kuZ2VuZXJhdGUoaG9tZS5saWdodEVudGl0eSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChob21lLmxvY2tFbnRpdHkpIHtcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goU2VjdXJpdHlCYWRnZVN0cmF0ZWd5LmdlbmVyYXRlKGhvbWUubG9ja0VudGl0eSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChob21lLm1lZGlhUGxheWVyRW50aXR5KSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKFNwZWFrZXJzVHZzQmFkZ2VTdHJhdGVneS5nZW5lcmF0ZShob21lLm1lZGlhUGxheWVyRW50aXR5KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhvbWUuY28yU2lnbmFsRW50aXR5KSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKEVuZXJneUJhZGdlU3RyYXRlZ3kuZ2VuZXJhdGUoaG9tZS5jbzJTaWduYWxFbnRpdHkpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG9tZS53YXN0ZUVudGl0eSkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChXYXN0ZUJhZGdlU3RyYXRlZ3kuZ2VuZXJhdGUoaG9tZS53YXN0ZUVudGl0eSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAuLi5hd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgICAgXTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBzZWN0aW9ucyBmb3IgZWFjaCBmbG9vciBhbmQgY2FtZXJhIGdyb3VwLlxuICAgKlxuICAgKiBAcGFyYW0gaG9tZSAtIEhvbWUgY29udGV4dC5cbiAgICogQHJldHVybnMgTGlzdCBvZiBzZWN0aW9uIGNvbmZpZ3MuXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVTZWN0aW9ucyhob21lKSB7XG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgICAgIGNvbnN0IGNhbWVyYUVudGl0aWVzID0gaG9tZS5lbnRpdGllc1dpdGhEb21haW5zKFtcbiAgICAgICAgICAgICdjYW1lcmEnXG4gICAgICAgIF0pO1xuICAgICAgICBpZiAoY2FtZXJhRW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChDYW1lcmFzU2VjdGlvblN0cmF0ZWd5LmdlbmVyYXRlKGhvbWUsIGNhbWVyYUVudGl0aWVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBmbG9vciBvZiBob21lLmZsb29ycyl7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKEZsb29yU2VjdGlvblN0cmF0ZWd5LmdlbmVyYXRlKGZsb29yKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC4uLmF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgICAgICBdO1xuICAgIH1cbiAgICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBtYXhpbXVtIG51bWJlciBvZiBjb2x1bW5zIGFsbG93ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBmbG9vcnMgLSBGbG9vcnMgd2l0aGluIHRoZSBob21lLlxuICAgKiBAcmV0dXJucyBUaGUgbnVtYmVyIG9mIGNvbHVtbnMuXG4gICAqLyBzdGF0aWMgbWF4Q29sdW1ucyhmbG9vcnMpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGZsb29ycy5sZW5ndGgsIDEpO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZShgbGwtc3RyYXRlZ3ktdmlldy0ke0NVU1RPTV9FTEVNRU5UX05BTUV9LWhvbWVgLCBIb21lVmlld1N0cmF0ZWd5KTtcbiIsImZ1bmN0aW9uIF9kZWZpbmVfcHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cbmltcG9ydCB7IFJlYWN0aXZlRWxlbWVudCB9IGZyb20gJ2xpdCc7XG5pbXBvcnQgeyBDVVNUT01fRUxFTUVOVF9OQU1FLCBOQU1FIH0gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7IEF1dG9tYXRpb25zVmlld1N0cmF0ZWd5IH0gZnJvbSAnLi4vdmlld3MvYXV0b21hdGlvbnMtdmlldyc7XG5pbXBvcnQgeyBIb21lVmlld1N0cmF0ZWd5IH0gZnJvbSAnLi4vdmlld3MvaG9tZS12aWV3JztcbmltcG9ydCB7IEhvbWUgfSBmcm9tICdAc21vbHBhY2svaGFzc2tpdCc7XG4vKipcbiAqIEdlbmVyYXRlIGEgbXVsdGktdmlldyBkYXNoYm9hcmQgZm9yIHRoZSBlbnRpcmUgaG9tZS5cbiAqLyBleHBvcnQgY2xhc3MgSG9tZURhc2hib2FyZFN0cmF0ZWd5IGV4dGVuZHMgUmVhY3RpdmVFbGVtZW50IHtcbiAgICAvKipcbiAgICogQnVpbGQgdGhlIExvdmVsYWNlIGRhc2hib2FyZCBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gcGFydGlhbENvbmZpZyAtIE9wdGlvbmFsIG92ZXJyaWRlIHZhbHVlcy5cbiAgICogQHBhcmFtIGhhc3MgLSBUaGUgSG9tZSBBc3Npc3RhbnQgY29ubmVjdGlvbi5cbiAgICogQHJldHVybnMgVGhlIGZpbmFsIGRhc2hib2FyZCBjb25maWd1cmF0aW9uLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlKHBhcnRpYWxDb25maWcsIGhhc3MpIHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jcmVhdGVDb25maWcocGFydGlhbENvbmZpZyk7XG4gICAgICAgIGNvbnN0IGhvbWUgPSBuZXcgSG9tZShoYXNzLCBjb25maWcpO1xuICAgICAgICBjb25zb2xlLmluZm8odGhpcy5sb2dQcmVmaXgsICdDb25maWcnLCBjb25maWcpO1xuICAgICAgICBjb25zb2xlLmluZm8odGhpcy5sb2dQcmVmaXgsICdIb21lJywgaG9tZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2aWV3czogYXdhaXQgdGhpcy5nZW5lcmF0ZVZpZXdzKGhvbWUsIGNvbmZpZylcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAqIE5vcm1hbGl6ZSB0aGUgaW5wdXQgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHBhcnRpYWxDb25maWcgLSBDb25maWcgdmFsdWVzIHN1cHBsaWVkIGJ5IHRoZSB1c2VyLlxuICAgKiBAcmV0dXJucyBUaGUgY29tcGxldGVkIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgKi8gc3RhdGljIGNyZWF0ZUNvbmZpZyhwYXJ0aWFsQ29uZmlnKSB7XG4gICAgICAgIHJldHVybiBIb21lVmlld1N0cmF0ZWd5LmNyZWF0ZUNvbmZpZyhwYXJ0aWFsQ29uZmlnKTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBkYXNoYm9hcmQgdmlld3MuXG4gICAqXG4gICAqIEBwYXJhbSBob21lIC0gVGhlIGhvbWUgcmVwcmVzZW50YXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgLSBUaGUgcHJvY2Vzc2VkIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIFRoZSB2aWV3IGNvbmZpZ3VyYXRpb25zLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlVmlld3MoaG9tZSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBfaG9tZV9jbGltYXRlRW50aXR5LCBfaG9tZV9saWdodEVudGl0eSwgX2hvbWVfbG9ja0VudGl0eSwgX2hvbWVfbWVkaWFQbGF5ZXJFbnRpdHk7XG4gICAgICAgIGNvbnN0IHZpZXdzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzZWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdIb21lJyxcbiAgICAgICAgICAgICAgICBwYXRoOiAnaG9tZScsXG4gICAgICAgICAgICAgICAgaWNvbjogJ21kaTpob21lJyxcbiAgICAgICAgICAgICAgICBtYXhfY29sdW1uczogSG9tZVZpZXdTdHJhdGVneS5tYXhDb2x1bW5zKGhvbWUuem9uZXMpLFxuICAgICAgICAgICAgICAgIHN0cmF0ZWd5OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGBjdXN0b206JHtDVVNUT01fRUxFTUVOVF9OQU1FfS1ob21lYCxcbiAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQXV0b21hdGlvbnMnLFxuICAgICAgICAgICAgICAgIGljb246ICdtZGk6YWxhcm0nLFxuICAgICAgICAgICAgICAgIG1heF9jb2x1bW5zOiBBdXRvbWF0aW9uc1ZpZXdTdHJhdGVneS5tYXhDb2x1bW5zKGhvbWUpLFxuICAgICAgICAgICAgICAgIHN0cmF0ZWd5OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGBjdXN0b206JHtDVVNUT01fRUxFTUVOVF9OQU1FfS1hdXRvbWF0aW9uc2AsXG4gICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3NlY3Rpb25zJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0NsaW1hdGUnLFxuICAgICAgICAgICAgICAgIHBhdGg6ICdjbGltYXRlJyxcbiAgICAgICAgICAgICAgICBpY29uOiAoKF9ob21lX2NsaW1hdGVFbnRpdHkgPSBob21lLmNsaW1hdGVFbnRpdHkpID09PSBudWxsIHx8IF9ob21lX2NsaW1hdGVFbnRpdHkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9ob21lX2NsaW1hdGVFbnRpdHkuaWNvbikgfHwgJ21kaTpmYW4nLFxuICAgICAgICAgICAgICAgIHN0cmF0ZWd5OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGBjdXN0b206JHtDVVNUT01fRUxFTUVOVF9OQU1FfS1jbGltYXRlYCxcbiAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnTGlnaHRzJyxcbiAgICAgICAgICAgICAgICBwYXRoOiAnbGlnaHRzJyxcbiAgICAgICAgICAgICAgICBpY29uOiAoKF9ob21lX2xpZ2h0RW50aXR5ID0gaG9tZS5saWdodEVudGl0eSkgPT09IG51bGwgfHwgX2hvbWVfbGlnaHRFbnRpdHkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9ob21lX2xpZ2h0RW50aXR5Lmljb24pIHx8ICdtZGk6bGlnaHRidWxiLWdyb3VwJyxcbiAgICAgICAgICAgICAgICBzdHJhdGVneToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBgY3VzdG9tOiR7Q1VTVE9NX0VMRU1FTlRfTkFNRX0tbGlnaHRzYCxcbiAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnU2VjdXJpdHknLFxuICAgICAgICAgICAgICAgIHBhdGg6ICdzZWN1cml0eScsXG4gICAgICAgICAgICAgICAgaWNvbjogKChfaG9tZV9sb2NrRW50aXR5ID0gaG9tZS5sb2NrRW50aXR5KSA9PT0gbnVsbCB8fCBfaG9tZV9sb2NrRW50aXR5ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfaG9tZV9sb2NrRW50aXR5Lmljb24pIHx8ICdtZGk6bG9jaycsXG4gICAgICAgICAgICAgICAgc3RyYXRlZ3k6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogYGN1c3RvbToke0NVU1RPTV9FTEVNRU5UX05BTUV9LXNlY3VyaXR5YCxcbiAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnU3BlYWtlcnMgJiBUVnMnLFxuICAgICAgICAgICAgICAgIHBhdGg6ICdzcGVha2Vycy10dnMnLFxuICAgICAgICAgICAgICAgIGljb246ICgoX2hvbWVfbWVkaWFQbGF5ZXJFbnRpdHkgPSBob21lLm1lZGlhUGxheWVyRW50aXR5KSA9PT0gbnVsbCB8fCBfaG9tZV9tZWRpYVBsYXllckVudGl0eSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2hvbWVfbWVkaWFQbGF5ZXJFbnRpdHkuaWNvbikgfHwgJ21kaTp0ZWxldmlzaW9uLXNwZWFrZXInLFxuICAgICAgICAgICAgICAgIHN0cmF0ZWd5OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGBjdXN0b206JHtDVVNUT01fRUxFTUVOVF9OQU1FfS1zcGVha2Vycy10dnNgLFxuICAgICAgICAgICAgICAgICAgICAuLi5jb25maWdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiB2aWV3cztcbiAgICB9XG59XG5fZGVmaW5lX3Byb3BlcnR5KEhvbWVEYXNoYm9hcmRTdHJhdGVneSwgXCJsb2dQcmVmaXhcIiwgYCR7TkFNRX0gLSBIb21lIERhc2hib2FyZCBTdHJhdGVneWApO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKGBsbC1zdHJhdGVneS0ke0NVU1RPTV9FTEVNRU5UX05BTUV9LWhvbWVgLCBIb21lRGFzaGJvYXJkU3RyYXRlZ3kpO1xuIiwiaW1wb3J0IHsgUmVhY3RpdmVFbGVtZW50IH0gZnJvbSAnbGl0JztcbmltcG9ydCB7IENVU1RPTV9FTEVNRU5UX05BTUUgfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHsgSG9tZSB9IGZyb20gJ0BzbW9scGFjay9oYXNza2l0Jztcbi8qKlxuICogVmlldyBzdHJhdGVneSBmb3IgZGlzcGxheWluZyBjbGltYXRlIGRldmljZXMuXG4gKi8gZXhwb3J0IGNsYXNzIENsaW1hdGVWaWV3U3RyYXRlZ3kgZXh0ZW5kcyBSZWFjdGl2ZUVsZW1lbnQge1xuICAgIC8qKlxuICAgKiBCdWlsZCB0aGUgY2xpbWF0ZSB2aWV3IGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWcgLSBWaWV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgKiBAcGFyYW0gaGFzcyAtIEhvbWUgQXNzaXN0YW50IGluc3RhbmNlLlxuICAgKiBAcmV0dXJucyBUaGUgdmlldyBjb25maWd1cmF0aW9uLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlKGNvbmZpZywgaGFzcykge1xuICAgICAgICBjb25zdCBob21lID0gbmV3IEhvbWUoaGFzcyk7XG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJhZGdlcyhob21lKSxcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVTZWN0aW9ucyhob21lKVxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBbYmFkZ2VzLCBzZWN0aW9uc10gPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWRnZXM6IGJhZGdlcyxcbiAgICAgICAgICAgIHNlY3Rpb25zOiBzZWN0aW9uc1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICogR2VuZXJhdGUgYmFkZ2VzIGZvciB0aGUgY2xpbWF0ZSB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gaG9tZSAtIFJlcHJlc2VudGF0aW9uIG9mIHRoZSBob21lLlxuICAgKiBAcmV0dXJucyBBcnJheSBvZiBiYWRnZSBjb25maWdzLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlQmFkZ2VzKGhvbWUpIHtcbiAgICAgICAgdm9pZCBob21lO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIC8qKlxuICAgKiBCdWlsZCB0aGUgc2VjdGlvbnMgZm9yIHRoZSBjbGltYXRlIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBob21lIC0gUmVwcmVzZW50YXRpb24gb2YgdGhlIGhvbWUuXG4gICAqIEByZXR1cm5zIFNlY3Rpb24gY29uZmlndXJhdGlvbiBhcnJheS5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZVNlY3Rpb25zKGhvbWUpIHtcbiAgICAgICAgdm9pZCBob21lO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKGBsbC1zdHJhdGVneS12aWV3LSR7Q1VTVE9NX0VMRU1FTlRfTkFNRX0tY2xpbWF0ZWAsIENsaW1hdGVWaWV3U3RyYXRlZ3kpO1xuIiwiaW1wb3J0IHsgUmVhY3RpdmVFbGVtZW50IH0gZnJvbSAnbGl0JztcbmltcG9ydCB7IENVU1RPTV9FTEVNRU5UX05BTUUgfSBmcm9tICcuLi8uLi9jb25maWcnO1xuLyoqXG4gKiBSZW5kZXIgYSB2aWV3IGxpc3RpbmcgYWxsIGxpZ2h0cy5cbiAqLyBleHBvcnQgY2xhc3MgTGlnaHRzVmlld1N0cmF0ZWd5IGV4dGVuZHMgUmVhY3RpdmVFbGVtZW50IHtcbiAgICAvKipcbiAgICogQnVpbGQgdGhlIGxpZ2h0cyB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gY29uZmlnIC0gVmlldyBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIGhhc3MgLSBIb21lIEFzc2lzdGFudCBpbnN0YW5jZS5cbiAgICogQHJldHVybnMgVGhlIExvdmVsYWNlIHZpZXcgY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZShjb25maWcsIGhhc3MpIHtcbiAgICAgICAgY29uc3QgW2JhZGdlcywgc2VjdGlvbnNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUJhZGdlcyhjb25maWcsIGhhc3MpLFxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVNlY3Rpb25zKGNvbmZpZywgaGFzcylcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWRnZXM6IGJhZGdlcyxcbiAgICAgICAgICAgIHNlY3Rpb25zOiBzZWN0aW9uc1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICogUHJvZHVjZSB0aGUgYmFkZ2VzIGZvciB0aGUgbGlnaHRzIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWcgLSBWaWV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgKiBAcGFyYW0gaGFzcyAtIEhvbWUgQXNzaXN0YW50IGluc3RhbmNlLlxuICAgKiBAcmV0dXJucyBBcnJheSBvZiBiYWRnZSBjb25maWdzLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlQmFkZ2VzKGNvbmZpZywgaGFzcykge1xuICAgICAgICB2b2lkIGNvbmZpZztcbiAgICAgICAgdm9pZCBoYXNzO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIC8qKlxuICAgKiBHZW5lcmF0ZSBzZWN0aW9uIGNvbmZpZ3VyYXRpb25zIGZvciB0aGUgbGlnaHRzIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWcgLSBWaWV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgKiBAcGFyYW0gaGFzcyAtIEhvbWUgQXNzaXN0YW50IGluc3RhbmNlLlxuICAgKiBAcmV0dXJucyBMaXN0IG9mIHNlY3Rpb24gY29uZmlncy5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZVNlY3Rpb25zKGNvbmZpZywgaGFzcykge1xuICAgICAgICB2b2lkIGNvbmZpZztcbiAgICAgICAgdm9pZCBoYXNzO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKGBsbC1zdHJhdGVneS12aWV3LSR7Q1VTVE9NX0VMRU1FTlRfTkFNRX0tbGlnaHRzYCwgTGlnaHRzVmlld1N0cmF0ZWd5KTtcbiIsImltcG9ydCB7IFJlYWN0aXZlRWxlbWVudCB9IGZyb20gJ2xpdCc7XG5pbXBvcnQgeyBDVVNUT01fRUxFTUVOVF9OQU1FIH0gZnJvbSAnLi4vLi4vY29uZmlnJztcbi8qKlxuICogVmlldyBzdHJhdGVneSBkaXNwbGF5aW5nIHNlY3VyaXR5IGRldmljZXMuXG4gKi8gZXhwb3J0IGNsYXNzIFNlY3VyaXR5Vmlld1N0cmF0ZWd5IGV4dGVuZHMgUmVhY3RpdmVFbGVtZW50IHtcbiAgICAvKipcbiAgICogQnVpbGQgdGhlIHNlY3VyaXR5IHZpZXcgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZyAtIFZpZXcgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAqIEBwYXJhbSBoYXNzIC0gSG9tZSBBc3Npc3RhbnQgaW5zdGFuY2UuXG4gICAqIEByZXR1cm5zIFRoZSBMb3ZlbGFjZSB2aWV3IGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUoY29uZmlnLCBoYXNzKSB7XG4gICAgICAgIGNvbnN0IHZpZXcgPSB7XG4gICAgICAgICAgICBiYWRnZXM6IGF3YWl0IHRoaXMuZ2VuZXJhdGVCYWRnZXMoY29uZmlnLCBoYXNzKSxcbiAgICAgICAgICAgIHNlY3Rpb25zOiBhd2FpdCB0aGlzLmdlbmVyYXRlU2VjdGlvbnMoY29uZmlnLCBoYXNzKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdmlldztcbiAgICB9XG4gICAgLyoqXG4gICAqIENyZWF0ZSBiYWRnZXMgZm9yIHRoZSBzZWN1cml0eSB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gY29uZmlnIC0gVmlldyBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIGhhc3MgLSBIb21lIEFzc2lzdGFudCBpbnN0YW5jZS5cbiAgICogQHJldHVybnMgQXJyYXkgb2YgYmFkZ2UgY29uZmlncy5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZUJhZGdlcyhjb25maWcsIGhhc3MpIHtcbiAgICAgICAgdm9pZCBjb25maWc7XG4gICAgICAgIHZvaWQgaGFzcztcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvKipcbiAgICogQnVpbGQgc2VjdGlvbnMgZm9yIHRoZSBzZWN1cml0eSB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gY29uZmlnIC0gVmlldyBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIGhhc3MgLSBIb21lIEFzc2lzdGFudCBpbnN0YW5jZS5cbiAgICogQHJldHVybnMgU2VjdGlvbiBjb25maWd1cmF0aW9uIGxpc3QuXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVTZWN0aW9ucyhjb25maWcsIGhhc3MpIHtcbiAgICAgICAgdm9pZCBjb25maWc7XG4gICAgICAgIHZvaWQgaGFzcztcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZShgbGwtc3RyYXRlZ3ktdmlldy0ke0NVU1RPTV9FTEVNRU5UX05BTUV9LXNlY3VyaXR5YCwgU2VjdXJpdHlWaWV3U3RyYXRlZ3kpO1xuIiwiaW1wb3J0IHsgUmVhY3RpdmVFbGVtZW50IH0gZnJvbSAnbGl0JztcbmltcG9ydCB7IENVU1RPTV9FTEVNRU5UX05BTUUgfSBmcm9tICcuLi8uLi9jb25maWcnO1xuLyoqXG4gKiBWaWV3IHN0cmF0ZWd5IGZvciBhbGwgc3BlYWtlciBhbmQgVFYgZW50aXRpZXMuXG4gKi8gZXhwb3J0IGNsYXNzIFNwZWFrZXJzVHZzVmlld1N0cmF0ZWd5IGV4dGVuZHMgUmVhY3RpdmVFbGVtZW50IHtcbiAgICAvKipcbiAgICogQnVpbGQgdGhlIHNwZWFrZXJzIGFuZCBUVnMgdmlldy5cbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZyAtIFZpZXcgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAqIEBwYXJhbSBoYXNzIC0gSG9tZSBBc3Npc3RhbnQgaW5zdGFuY2UuXG4gICAqIEByZXR1cm5zIFRoZSBMb3ZlbGFjZSB2aWV3IGNvbmZpZ3VyYXRpb24uXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGUoY29uZmlnLCBoYXNzKSB7XG4gICAgICAgIGNvbnN0IHZpZXcgPSB7XG4gICAgICAgICAgICBiYWRnZXM6IGF3YWl0IHRoaXMuZ2VuZXJhdGVCYWRnZXMoY29uZmlnLCBoYXNzKSxcbiAgICAgICAgICAgIHNlY3Rpb25zOiBhd2FpdCB0aGlzLmdlbmVyYXRlU2VjdGlvbnMoY29uZmlnLCBoYXNzKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdmlldztcbiAgICB9XG4gICAgLyoqXG4gICAqIENyZWF0ZSBiYWRnZXMgZm9yIHRoZSBzcGVha2VycyBhbmQgVFZzIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWcgLSBWaWV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgKiBAcGFyYW0gaGFzcyAtIEhvbWUgQXNzaXN0YW50IGluc3RhbmNlLlxuICAgKiBAcmV0dXJucyBBcnJheSBvZiBiYWRnZSBjb25maWdzLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlQmFkZ2VzKGNvbmZpZywgaGFzcykge1xuICAgICAgICB2b2lkIGNvbmZpZztcbiAgICAgICAgdm9pZCBoYXNzO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIC8qKlxuICAgKiBHZW5lcmF0ZSBzZWN0aW9ucyBmb3IgdGhlIHNwZWFrZXJzIGFuZCBUVnMgdmlldy5cbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZyAtIFZpZXcgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAqIEBwYXJhbSBoYXNzIC0gSG9tZSBBc3Npc3RhbnQgaW5zdGFuY2UuXG4gICAqIEByZXR1cm5zIFNlY3Rpb24gY29uZmlndXJhdGlvbiBsaXN0LlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlU2VjdGlvbnMoY29uZmlnLCBoYXNzKSB7XG4gICAgICAgIHZvaWQgY29uZmlnO1xuICAgICAgICB2b2lkIGhhc3M7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoYGxsLXN0cmF0ZWd5LXZpZXctJHtDVVNUT01fRUxFTUVOVF9OQU1FfS1zcGVha2Vycy10dnNgLCBTcGVha2Vyc1R2c1ZpZXdTdHJhdGVneSk7XG4iLCJpbXBvcnQgeyBSZWFjdGl2ZUVsZW1lbnQgfSBmcm9tICdsaXQnO1xuaW1wb3J0IHsgQ1VTVE9NX0VMRU1FTlRfTkFNRSB9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG4vKipcbiAqIFN0cmF0ZWd5IGZvciBkYXNoYm9hcmRzIHRoYXQgZm9jdXMgb24gYSBzaW5nbGUgZmxvb3IuXG4gKi8gZXhwb3J0IGNsYXNzIEZsb29yRGFzaGJvYXJkU3RyYXRlZ3kgZXh0ZW5kcyBSZWFjdGl2ZUVsZW1lbnQge1xuICAgIC8qKlxuICAgKiBCdWlsZCB0aGUgZGFzaGJvYXJkIGNvbmZpZ3VyYXRpb24gZm9yIG9uZSBmbG9vci5cbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZyAtIFRoZSB1c2VyIHByb3ZpZGVkIGNvbmZpZy5cbiAgICogQHBhcmFtIGhhc3MgLSBIb21lIEFzc2lzdGFudCBpbnN0YW5jZS5cbiAgICogQHJldHVybnMgVGhlIExvdmVsYWNlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlKGNvbmZpZywgaGFzcykge1xuICAgICAgICBpZiAoIWNvbmZpZy5mbG9vcl9pZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2aWV3czogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmxvb3IgPSBoYXNzLmZsb29yc1tjb25maWcuZmxvb3JfaWRdO1xuICAgICAgICBpZiAoIWZsb29yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHZpZXdzOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmlld3M6IGF3YWl0IHRoaXMuZ2VuZXJhdGVWaWV3cyh7XG4gICAgICAgICAgICAgICAgZmxvb3I6IGZsb29yLFxuICAgICAgICAgICAgICAgIGFyZWFzOiBjb25maWcuYXJlYXNcbiAgICAgICAgICAgIH0sIGhhc3MpXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgKiBDcmVhdGUgdGhlIHZpZXdzIGZvciBlYWNoIHJvb20gb24gYSBmbG9vci5cbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZyAtIEZsb29yIGFuZCBvcHRpb25hbCBhcmVhIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSBoYXNzIC0gSG9tZSBBc3Npc3RhbnQgaW5zdGFuY2UuXG4gICAqIEByZXR1cm5zIEFycmF5IG9mIHZpZXcgY29uZmlndXJhdGlvbnMuXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVWaWV3cyhjb25maWcsIGhhc3MpIHtcbiAgICAgICAgY29uc3QgZmxvb3IgPSBjb25maWcuZmxvb3I7XG4gICAgICAgIGNvbnN0IHZpZXdzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzZWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdGl0bGU6IGNvbmZpZy5mbG9vci5mbG9vcl9pZCxcbiAgICAgICAgICAgICAgICBwYXRoOiBjb25maWcuZmxvb3IuZmxvb3JfaWQsXG4gICAgICAgICAgICAgICAgaWNvbjogY29uZmlnLmZsb29yLmljb24gfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1heF9jb2x1bW5zOiAyLFxuICAgICAgICAgICAgICAgIHN0cmF0ZWd5OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGBjdXN0b206JHtDVVNUT01fRUxFTUVOVF9OQU1FfS1mbG9vcmAsXG4gICAgICAgICAgICAgICAgICAgIGZsb29yX2lkOiBjb25maWcuZmxvb3IuZmxvb3JfaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICAgIGxldCBhcmVhcyA9IE9iamVjdC52YWx1ZXMoaGFzcy5hcmVhcykuZmlsdGVyKChhcmVhKT0+YXJlYS5mbG9vcl9pZCA9PT0gZmxvb3IuZmxvb3JfaWQpO1xuICAgICAgICBpZiAoY29uZmlnLmFyZWFzICYmIGNvbmZpZy5hcmVhcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhcmVhcyA9IGFyZWFzLmZpbHRlcigoYXJlYSk9PntcbiAgICAgICAgICAgICAgICB2YXIgX2NvbmZpZ19hcmVhcztcbiAgICAgICAgICAgICAgICByZXR1cm4gKF9jb25maWdfYXJlYXMgPSBjb25maWcuYXJlYXMpID09PSBudWxsIHx8IF9jb25maWdfYXJlYXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jb25maWdfYXJlYXMuc29tZSgoY29uZmlnQXJlYSk9PmNvbmZpZ0FyZWEuYXJlYV9pZCA9PT0gYXJlYS5hcmVhX2lkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgYXJlYSBvZiBhcmVhcyl7XG4gICAgICAgICAgICB2aWV3cy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBhcmVhLm5hbWUsXG4gICAgICAgICAgICAgICAgcGF0aDogYXJlYS5hcmVhX2lkLFxuICAgICAgICAgICAgICAgIHN0cmF0ZWd5OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGBjdXN0b206JHtDVVNUT01fRUxFTUVOVF9OQU1FfS1yb29tYCxcbiAgICAgICAgICAgICAgICAgICAgYXJlYV9pZDogYXJlYS5hcmVhX2lkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZpZXdzO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZShgbGwtc3RyYXRlZ3ktJHtDVVNUT01fRUxFTUVOVF9OQU1FfS1mbG9vcmAsIEZsb29yRGFzaGJvYXJkU3RyYXRlZ3kpO1xuIiwiaW1wb3J0IHsgUmVhY3RpdmVFbGVtZW50IH0gZnJvbSAnbGl0JztcbmltcG9ydCB7IENVU1RPTV9FTEVNRU5UX05BTUUgfSBmcm9tICcuLi8uLi9jb25maWcnO1xuLyoqXG4gKiBTdHJhdGVneSBmb3IgcmVuZGVyaW5nIGEgc2luZ2xlIGZsb29yIHZpZXcuXG4gKi8gZXhwb3J0IGNsYXNzIEZsb29yVmlld1N0cmF0ZWd5IGV4dGVuZHMgUmVhY3RpdmVFbGVtZW50IHtcbiAgICAvKipcbiAgICogQnVpbGQgdGhlIHZpZXcgcmVwcmVzZW50aW5nIG9uZSBmbG9vci5cbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZyAtIFZpZXcgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIGhhc3MgLSBIb21lIEFzc2lzdGFudCBpbnN0YW5jZS5cbiAgICogQHJldHVybnMgVGhlIHZpZXcgY29uZmlndXJhdGlvbi5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZShjb25maWcsIGhhc3MpIHtcbiAgICAgICAgaWYgKCFjb25maWcuZmxvb3JfaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2aWV3ID0ge1xuICAgICAgICAgICAgYmFkZ2VzOiBhd2FpdCB0aGlzLmdlbmVyYXRlQmFkZ2VzKGNvbmZpZywgaGFzcyksXG4gICAgICAgICAgICBzZWN0aW9uczogYXdhaXQgdGhpcy5nZW5lcmF0ZVNlY3Rpb25zKGNvbmZpZywgaGFzcylcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICAgIC8qKlxuICAgKiBHZW5lcmF0ZSBiYWRnZXMgc2hvd24gYXQgdGhlIHRvcCBvZiB0aGUgZmxvb3Igdmlldy5cbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZyAtIFZpZXcgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIGhhc3MgLSBIb21lIEFzc2lzdGFudCBpbnN0YW5jZS5cbiAgICogQHJldHVybnMgQmFkZ2UgY29uZmlndXJhdGlvbiBhcnJheS5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZUJhZGdlcyhjb25maWcsIGhhc3MpIHtcbiAgICAgICAgdm9pZCBjb25maWc7XG4gICAgICAgIHZvaWQgaGFzcztcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvKipcbiAgICogQnVpbGQgdGhlIHNlY3Rpb25zIGZvciB0aGUgZmxvb3Igdmlldy5cbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZyAtIFZpZXcgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIGhhc3MgLSBIb21lIEFzc2lzdGFudCBpbnN0YW5jZS5cbiAgICogQHJldHVybnMgU2VjdGlvbiBjb25maWd1cmF0aW9uIGFycmF5LlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlU2VjdGlvbnMoY29uZmlnLCBoYXNzKSB7XG4gICAgICAgIHZvaWQgY29uZmlnO1xuICAgICAgICB2b2lkIGhhc3M7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoYGxsLXN0cmF0ZWd5LXZpZXctJHtDVVNUT01fRUxFTUVOVF9OQU1FfS1mbG9vcmAsIEZsb29yVmlld1N0cmF0ZWd5KTtcbiIsImltcG9ydCB7IFJlYWN0aXZlRWxlbWVudCB9IGZyb20gJ2xpdCc7XG5pbXBvcnQgeyBDVVNUT01fRUxFTUVOVF9OQU1FIH0gZnJvbSAnLi4vLi4vY29uZmlnJztcbi8qKlxuICogU3RyYXRlZ3kgdG8gc2hvdyBkZXZpY2VzIGFuZCBpbmZvcm1hdGlvbiBmb3IgYSBzaW5nbGUgcm9vbS5cbiAqLyBleHBvcnQgY2xhc3MgUm9vbVZpZXdTdHJhdGVneSBleHRlbmRzIFJlYWN0aXZlRWxlbWVudCB7XG4gICAgLyoqXG4gICAqIEJ1aWxkIHRoZSByb29tIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWcgLSBSb29tIHZpZXcgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIGhhc3MgLSBIb21lIEFzc2lzdGFudCBpbnN0YW5jZS5cbiAgICogQHJldHVybnMgTG92ZWxhY2UgdmlldyBjb25maWd1cmF0aW9uLlxuICAgKi8gc3RhdGljIGFzeW5jIGdlbmVyYXRlKGNvbmZpZywgaGFzcykge1xuICAgICAgICBjb25zdCB2aWV3ID0ge1xuICAgICAgICAgICAgYmFkZ2VzOiBhd2FpdCB0aGlzLmdlbmVyYXRlQmFkZ2VzKGNvbmZpZywgaGFzcyksXG4gICAgICAgICAgICBzZWN0aW9uczogYXdhaXQgdGhpcy5nZW5lcmF0ZVNlY3Rpb25zKGNvbmZpZywgaGFzcylcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICAgIC8qKlxuICAgKiBDcmVhdGUgYmFkZ2VzIGZvciB0aGUgcm9vbSB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gY29uZmlnIC0gUm9vbSB2aWV3IGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSBoYXNzIC0gSG9tZSBBc3Npc3RhbnQgaW5zdGFuY2UuXG4gICAqIEByZXR1cm5zIEFycmF5IG9mIGJhZGdlIGNvbmZpZ3MuXG4gICAqLyBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVCYWRnZXMoY29uZmlnLCBoYXNzKSB7XG4gICAgICAgIHZvaWQgY29uZmlnO1xuICAgICAgICB2b2lkIGhhc3M7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEJ1aWxkIHRoZSBzZWN0aW9ucyBmb3IgdGhlIHJvb20gdmlldy5cbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZyAtIFJvb20gdmlldyBjb25maWd1cmF0aW9uLlxuICAgKiBAcGFyYW0gaGFzcyAtIEhvbWUgQXNzaXN0YW50IGluc3RhbmNlLlxuICAgKiBAcmV0dXJucyBTZWN0aW9uIGNvbmZpZ3VyYXRpb24gbGlzdC5cbiAgICovIHN0YXRpYyBhc3luYyBnZW5lcmF0ZVNlY3Rpb25zKGNvbmZpZywgaGFzcykge1xuICAgICAgICB2b2lkIGNvbmZpZztcbiAgICAgICAgdm9pZCBoYXNzO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKGBsbC1zdHJhdGVneS12aWV3LSR7Q1VTVE9NX0VMRU1FTlRfTkFNRX0tcm9vbWAsIFJvb21WaWV3U3RyYXRlZ3kpO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFzREE7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SEE7Ozs7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBR0E7QUFHQTtBQUdBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFLQTtBQUVBO0FBS0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFLQTtBQUVBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwWEE7Ozs7QUFJQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBSUE7QUFFQTtBQU9BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBUUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7O0FBS0E7QUFDQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUM5S0E7Ozs7QUFJQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUNMQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FDQUE7Ozs7QUFJQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUNKQTs7OztBQUlBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7QUNKQTtBQUNBO0FDQUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUNQQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFHQTtBQUdBO0FBR0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FDM0RBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQU1BO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUdBO0FBR0E7QUFHQTtBQUdBO0FBR0E7QUFHQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4R0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFRQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFFQTtBQUNBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFHQTtBQUNBO0FBT0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFHQTtBQUNBO0FBT0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFHQTtBQUNBO0FBT0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQU9BO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQU9BO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUdBO0FBQ0E7QUFPQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUdBO0FBQ0E7QUFPQTtBQUdBO0FBQ0E7QUFDQTtBQUNBIn0=
