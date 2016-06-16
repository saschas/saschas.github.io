THREE.OrbitControls = function(e, t) {
    function n() {
        return 2 * Math.PI / 60 / 60 * u.autoRotateSpeed
    }

    function o() {
        return Math.pow(.95, u.zoomSpeed)
    }

    function a(e) {
        if (u.enabled !== !1) {
            if (e.preventDefault(), 0 === e.button) {
                if (u.noRotate === !0) return;
                V = w.ROTATE, m.set(e.clientX, e.clientY)
            } else if (1 === e.button) {
                if (u.noZoom === !0) return;
                V = w.DOLLY, v.set(e.clientX, e.clientY)
            } else if (2 === e.button) {
                if (u.noPan === !0) return;
                V = w.PAN, b.set(e.clientX, e.clientY)
            }
            u.domElement.addEventListener("mousemove", i, !1), u.domElement.addEventListener("mouseup", s, !1)
        }
    }

    function i(e) {
        if (u.enabled !== !1) {
            e.preventDefault();
            var t = u.domElement === document ? u.domElement.body : u.domElement;
            if (V === w.ROTATE) {
                if (u.noRotate === !0) return;
                p.set(e.clientX, e.clientY), f.subVectors(p, m), u.rotateLeft(2 * Math.PI * f.x / t.clientWidth * u.rotateSpeed), u.rotateUp(2 * Math.PI * f.y / t.clientHeight * u.rotateSpeed), m.copy(p)
            } else if (V === w.DOLLY) {
                if (u.noZoom === !0) return;
                O.set(e.clientX, e.clientY), g.subVectors(O, v), g.y > 0 ? u.dollyIn() : u.dollyOut(), v.copy(O)
            } else if (V === w.PAN) {
                if (u.noPan === !0) return;
                T.set(e.clientX, e.clientY), y.subVectors(T, b), u.pan(y), b.copy(T)
            }
            u.update()
        }
    }

    function s() {
        u.enabled !== !1 && (u.domElement.removeEventListener("mousemove", i, !1), u.domElement.removeEventListener("mouseup", s, !1), V = w.NONE)
    }

    function c(e) {
        if (u.enabled !== !1 && u.noZoom !== !0) {
            var t = 0;
            e.wheelDelta ? t = e.wheelDelta : e.detail && (t = -e.detail), t > 0 ? u.dollyOut() : u.dollyIn()
        }
    }

    function r(e) {
        if (u.enabled !== !1 && u.noKeys !== !0 && u.noPan !== !0) {
            var t = !1;
            switch (e.keyCode) {
                case u.keys.UP:
                    u.pan(new THREE.Vector2(0, u.keyPanSpeed)), t = !0;
                    break;
                case u.keys.BOTTOM:
                    u.pan(new THREE.Vector2(0, -u.keyPanSpeed)), t = !0;
                    break;
                case u.keys.LEFT:
                    u.pan(new THREE.Vector2(u.keyPanSpeed, 0)), t = !0;
                    break;
                case u.keys.RIGHT:
                    u.pan(new THREE.Vector2(-u.keyPanSpeed, 0)), t = !0
            }
            t && u.update()
        }
    }

    function h(e) {
        if (u.enabled !== !1) switch (e.touches.length) {
            case 1:
                if (u.noRotate === !0) return;
                V = w.TOUCH_ROTATE, m.set(e.touches[0].pageX, e.touches[0].pageY);
                break;
            case 2:
                if (u.noZoom === !0) return;
                V = w.TOUCH_DOLLY;
                var t = e.touches[0].pageX - e.touches[1].pageX,
                    n = e.touches[0].pageY - e.touches[1].pageY,
                    o = Math.sqrt(t * t + n * n);
                v.set(0, o);
                break;
            case 3:
                if (u.noPan === !0) return;
                V = w.TOUCH_PAN, b.set(e.touches[0].pageX, e.touches[0].pageY);
                break;
            default:
                V = w.NONE
        }
    }

    function l(e) {
        if (u.enabled !== !1) {
            e.preventDefault(), e.stopPropagation();
            var t = u.domElement === document ? u.domElement.body : u.domElement;
            switch (e.touches.length) {
                case 1:
                    if (u.noRotate === !0) return;
                    if (V !== w.TOUCH_ROTATE) return;
                    p.set(e.touches[0].pageX, e.touches[0].pageY), f.subVectors(p, m), u.rotateLeft(2 * Math.PI * f.x / t.clientWidth * u.rotateSpeed), u.rotateUp(2 * Math.PI * f.y / t.clientHeight * u.rotateSpeed), m.copy(p);
                    break;
                case 2:
                    if (u.noZoom === !0) return;
                    if (V !== w.TOUCH_DOLLY) return;
                    var n = e.touches[0].pageX - e.touches[1].pageX,
                        o = e.touches[0].pageY - e.touches[1].pageY,
                        a = Math.sqrt(n * n + o * o);
                    O.set(0, a), g.subVectors(O, v), g.y > 0 ? u.dollyOut() : u.dollyIn(), v.copy(O);
                    break;
                case 3:
                    if (u.noPan === !0) return;
                    if (V !== w.TOUCH_PAN) return;
                    T.set(e.touches[0].pageX, e.touches[0].pageY), y.subVectors(T, b), u.pan(y), b.copy(T);
                    break;
                default:
                    V = w.NONE
            }
        }
    }

    function d() {
        u.enabled !== !1 && (V = w.NONE)
    }
    this.object = e, this.domElement = void 0 !== t ? t : document, this.enabled = !0, this.target = new THREE.Vector3, this.center = this.target, this.noZoom = !1, this.zoomSpeed = 1, this.minDistance = 0, this.maxDistance = 1 / 0, this.noRotate = !1, this.rotateSpeed = 1, this.noPan = !1, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.noKeys = !1, this.keys = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40
    };
    var u = this,
        E = 1e-6,
        m = new THREE.Vector2,
        p = new THREE.Vector2,
        f = new THREE.Vector2,
        b = new THREE.Vector2,
        T = new THREE.Vector2,
        y = new THREE.Vector2,
        v = new THREE.Vector2,
        O = new THREE.Vector2,
        g = new THREE.Vector2,
        R = 0,
        H = 0,
        L = 1,
        P = new THREE.Vector3,
        M = new THREE.Vector3,
        w = {
            NONE: -1,
            ROTATE: 0,
            DOLLY: 1,
            PAN: 2,
            TOUCH_ROTATE: 3,
            TOUCH_DOLLY: 4,
            TOUCH_PAN: 5
        },
        V = w.NONE,
        k = {
            type: "change"
        };
    this.rotateLeft = function(e) {
        void 0 === e && (e = n()), H -= e //+
    }, this.rotateUp = function(e) {
        void 0 === e && (e = n()), R -= e
    }, this.panLeft = function(e) {
        var t = new THREE.Vector3,
            n = this.object.matrix.elements;
        t.set(n[0], n[1], n[2]), t.multiplyScalar(-e), P.add(t)
    }, this.panUp = function(e) {
        var t = new THREE.Vector3,
            n = this.object.matrix.elements;
        t.set(n[4], n[5], n[6]), t.multiplyScalar(e), P.add(t)
    }, this.pan = function(e) {
        var t = u.domElement === document ? u.domElement.body : u.domElement;
        if (void 0 !== u.object.fov) {
            var n = u.object.position,
                o = n.clone().sub(u.target),
                a = o.length();
            a *= Math.tan(u.object.fov / 2 * Math.PI / 180), u.panLeft(2 * e.x * a / t.clientHeight), u.panUp(2 * e.y * a / t.clientHeight)
        } else void 0 !== u.object.top ? (u.panLeft(e.x * (u.object.right - u.object.left) / t.clientWidth), u.panUp(e.y * (u.object.top - u.object.bottom) / t.clientHeight)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.")
    }, this.dollyIn = function(e) {
        void 0 === e && (e = o()), L /= e
    }, this.dollyOut = function(e) {
        void 0 === e && (e = o()), L *= e
    }, this.update = function() {
        var e = this.object.position,
            t = e.clone().sub(this.target),
            o = Math.atan2(t.x, t.z),
            a = Math.atan2(Math.sqrt(t.x * t.x + t.z * t.z), t.y);
        this.autoRotate && this.rotateLeft(n()), o += H, a += R, a = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, a)), a = Math.max(E, Math.min(Math.PI - E, a));
        var i = t.length() * L;
        i = Math.max(this.minDistance, Math.min(this.maxDistance, i)), this.target.add(P), t.x = i * Math.sin(a) * Math.sin(o), t.y = i * Math.cos(a), t.z = i * Math.sin(a) * Math.cos(o), e.copy(this.target).add(t), this.object.lookAt(this.target), H = 0, R = 0, L = 1, P.set(0, 0, 0), M.distanceTo(this.object.position) > 0 && (this.dispatchEvent(k), M.copy(this.object.position))
    }, this.domElement.addEventListener("mousedown", a, !1), this.domElement.addEventListener("mousewheel", c, !1), this.domElement.addEventListener("DOMMouseScroll", c, !1), this.domElement.addEventListener("keydown", r, !1), this.domElement.addEventListener("touchstart", h, !1), this.domElement.addEventListener("touchend", d, !1), this.domElement.addEventListener("touchmove", l, !1)
}, THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);