! function(a) {
    function b(a) {
        return "[id=" + a.attr("id") + "][name=" + a.attr("name") + "]"
    }
    a.fn.sisyphus = function(c) {
        var d = a.map(this, function(c) {
                return b(a(c))
            }).join(),
            e = Sisyphus.getInstance(d);
        return e.protect(this, c), e
    };
    var c = {};
    c.isAvailable = function() {
        if ("object" == typeof a.jStorage) return !0;
        try {
            return localStorage.getItem
        } catch (b) {
            return !1
        }
    }, c.set = function(b, c) {
        if ("object" == typeof a.jStorage) a.jStorage.set(b, c + "");
        else try {
            localStorage.setItem(b, c + "")
        } catch (d) {}
    }, c.get = function(b) {
        if ("object" == typeof a.jStorage) {
            var c = a.jStorage.get(b);
            return c ? c.toString() : c
        }
        return localStorage.getItem(b)
    }, c.remove = function(b) {
        "object" == typeof a.jStorage ? a.jStorage.deleteKey(b) : localStorage.removeItem(b)
    }, Sisyphus = function() {
        function f() {
            return {
                setInstanceIdentifier: function(a) {
                    this.identifier = a
                },
                getInstanceIdentifier: function() {
                    return this.identifier
                },
                setInitialOptions: function(b) {
                    var d = {
                        excludeFields: [],
                        customKeySuffix: "",
                        locationBased: !1,
                        timeout: 0,
                        autoRelease: !0,
                        onBeforeSave: function() {},
                        onSave: function() {},
                        onBeforeRestore: function() {},
                        onRestore: function() {},
                        onRelease: function() {}
                    };
                    this.options = this.options || a.extend(d, b), this.browserStorage = c
                },
                setOptions: function(b) {
                    this.options = this.options || this.setInitialOptions(b), this.options = a.extend(this.options, b)
                },
                protect: function(b, c) {
                    this.setOptions(c), b = b || {};
                    var f = this;
                    if (this.targets = this.targets || [], f.options.name ? this.href = f.options.name : this.href = location.hostname + location.pathname + location.search + location.hash, this.targets = a.merge(this.targets, b), this.targets = a.unique(this.targets), this.targets = a(this.targets), !this.browserStorage.isAvailable()) return !1;
                    var g = f.options.onBeforeRestore.call(f);
                    if ((void 0 === g || g) && f.restoreAllData(), this.options.autoRelease && f.bindReleaseData(), !d.started[this.getInstanceIdentifier()])
                        if (f.isCKEditorPresent()) var h = setInterval(function() {
                            e.isLoaded && (clearInterval(h), f.bindSaveData(), d.started[f.getInstanceIdentifier()] = !0)
                        }, 100);
                        else f.bindSaveData(), d.started[f.getInstanceIdentifier()] = !0
                },
                isCKEditorPresent: function() {
                    return this.isCKEditorExists() ? (e.isLoaded = !1, e.on("instanceReady", function() {
                        e.isLoaded = !0
                    }), !0) : !1
                },
                isCKEditorExists: function() {
                    return "undefined" != typeof e
                },
                findFieldsToProtect: function(a) {
                    return a.find(":input").not(":submit").not(":reset").not(":button").not(":file").not(":password").not(":disabled").not("[readonly]")
                },
                bindSaveData: function() {
                    var c = this;
                    c.options.timeout && c.saveDataByTimeout(), c.targets.each(function() {
                        var d = b(a(this));
                        c.findFieldsToProtect(a(this)).each(function() {
                            if (-1 !== a.inArray(this, c.options.excludeFields)) return !0;
                            var e = a(this),
                                f = (c.options.locationBased ? c.href : "") + d + b(e) + c.options.customKeySuffix;
                            (e.is(":text") || e.is("textarea")) && (c.options.timeout || c.bindSaveDataImmediately(e, f)), c.bindSaveDataOnChange(e)
                        })
                    })
                },
                saveAllData: function() {
                    var c = this;
                    c.targets.each(function() {
                        var d = b(a(this)),
                            f = {};
                        c.findFieldsToProtect(a(this)).each(function() {
                            var g = a(this);
                            if (-1 !== a.inArray(this, c.options.excludeFields) || void 0 === g.attr("name") && void 0 === g.attr("id")) return !0;
                            var h = (c.options.locationBased ? c.href : "") + d + b(g) + c.options.customKeySuffix,
                                i = g.val();
                            if (g.is(":checkbox")) {
                                var j = g.attr("name");
                                if (void 0 !== j && -1 !== j.indexOf("[")) {
                                    if (f[j] === !0) return;
                                    i = [], a("[name='" + j + "']:checked").each(function() {
                                        i.push(a(this).val())
                                    }), f[j] = !0
                                } else i = g.is(":checked");
                                c.saveToBrowserStorage(h, i, !1)
                            } else if (g.is(":radio")) g.is(":checked") && (i = g.val(), c.saveToBrowserStorage(h, i, !1));
                            else if (c.isCKEditorExists()) {
                                var k = e.instances[g.attr("name")] || e.instances[g.attr("id")];
                                k ? (k.updateElement(), c.saveToBrowserStorage(h, g.val(), !1)) : c.saveToBrowserStorage(h, i, !1)
                            } else c.saveToBrowserStorage(h, i, !1)
                        })
                    }), c.options.onSave.call(c)
                },
                restoreAllData: function() {
                    var c = this,
                        d = !1;
                    c.targets.each(function() {
                        var e = a(this),
                            f = b(a(this));
                        c.findFieldsToProtect(e).each(function() {
                            if (-1 !== a.inArray(this, c.options.excludeFields)) return !0;
                            var e = a(this),
                                g = (c.options.locationBased ? c.href : "") + f + b(e) + c.options.customKeySuffix,
                                h = c.browserStorage.get(g);
                            null !== h && (c.restoreFieldsData(e, h), d = !0)
                        })
                    }), d && c.options.onRestore.call(c)
                },
                restoreFieldsData: function(a, b) {
                    if (void 0 === a.attr("name") && void 0 === a.attr("id")) return !1;
                    var c = a.attr("name");
                    !a.is(":checkbox") || "false" === b || void 0 !== c && -1 !== c.indexOf("[") ? !a.is(":checkbox") || "false" !== b || void 0 !== c && -1 !== c.indexOf("[") ? a.is(":radio") ? a.val() === b && a.prop("checked", !0) : void 0 === c || -1 === c.indexOf("[") ? a.val(b) : (b = b.split(","), a.val(b)) : a.prop("checked", !1) : a.prop("checked", !0)
                },
                bindSaveDataImmediately: function(a, b) {
                    var c = this;
                    if ("onpropertychange" in a ? a.get(0).onpropertychange = function() {
                            c.saveToBrowserStorage(b, a.val())
                        } : a.get(0).oninput = function() {
                            c.saveToBrowserStorage(b, a.val())
                        }, this.isCKEditorExists()) {
                        var d = e.instances[a.attr("name")] || e.instances[a.attr("id")];
                        d && d.document.on("keyup", function() {
                            d.updateElement(), c.saveToBrowserStorage(b, a.val())
                        })
                    }
                },
                saveToBrowserStorage: function(a, b, c) {
                    var d = this,
                        e = d.options.onBeforeSave.call(d);
                    (void 0 === e || e !== !1) && (c = void 0 === c ? !0 : c, this.browserStorage.set(a, b), c && "" !== b && this.options.onSave.call(this))
                },
                bindSaveDataOnChange: function(a) {
                    var b = this;
                    a.change(function() {
                        b.saveAllData()
                    })
                },
                saveDataByTimeout: function() {
                    var a = this,
                        b = a.targets;
                    setTimeout(function() {
                        function b() {
                            a.saveAllData(), setTimeout(b, 1e3 * a.options.timeout)
                        }
                        return b
                    }(b), 1e3 * a.options.timeout)
                },
                bindReleaseData: function() {
                    var c = this;
                    c.targets.each(function() {
                        var d = a(this),
                            e = b(d);
                        a(this).bind("submit reset", function() {
                            c.releaseData(e, c.findFieldsToProtect(d))
                        })
                    })
                },
                manuallyReleaseData: function() {
                    var c = this;
                    c.targets.each(function() {
                        var d = a(this),
                            e = b(d);
                        c.releaseData(e, c.findFieldsToProtect(d))
                    })
                },
                releaseData: function(c, e) {
                    var f = !1,
                        g = this;
                    d.started[g.getInstanceIdentifier()] = !1, e.each(function() {
                        if (-1 !== a.inArray(this, g.options.excludeFields)) return !0;
                        var d = a(this),
                            e = (g.options.locationBased ? g.href : "") + c + b(d) + g.options.customKeySuffix;
                        g.browserStorage.remove(e), f = !0
                    }), f && g.options.onRelease.call(g)
                }
            }
        }
        var d = {
                instantiated: [],
                started: []
            },
            e = window.CKEDITOR;
        return {
            getInstance: function(a) {
                return d.instantiated[a] || (d.instantiated[a] = f(), d.instantiated[a].setInstanceIdentifier(a), d.instantiated[a].setInitialOptions()), a ? d.instantiated[a] : d.instantiated[a]
            },
            free: function() {
                return d = {
                    instantiated: [],
                    started: []
                }, null
            },
            version: "1.1.3"
        }
    }()
}(jQuery);

$(function() {
    $("form").sisyphus();
});