var Offlr = function(e) {
    function t(e) {
        var t = function(e) {
            r.innerHTML = e, o.element.appendChild(r);
        }, a = function() {
            o.element.contains(r) && o.element.removeChild(r);
        };
        a(), clearTimeout(n), o.element.setAttribute("data-loading", "true");
        var s = new XMLHttpRequest();
        s.open("GET", "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + o.api_key + "&tags=" + e + "&per_page=" + o.per_page + "&format=json&nojsoncallback=1", !0), 
        s.onreadystatechange = function() {
            if (4 === s.readyState) if (clearTimeout(n), 200 === s.status) {
                var e;
                o.element.setAttribute("data-loading", "false");
                try {
                    e = JSON.parse(s.responseText);
                } catch (e) {
                    return void t("Couldn't parse the data. Please try again.");
                }
                if (void 0 !== e.stat && "fail" === e.stat) return void t(e.message);
                a(), function(e) {
                    var t;
                    o.element.innerHTML = "", e.forEach(function(e, a) {
                        (t = document.createElement("div")).className = o.photoClass, t.style.backgroundImage = "url(http://farm" + e.farm + ".static.flickr.com/" + e.server + "/" + e.id + "_" + e.secret + "_m.jpg)", 
                        t.style.height = l || t.style.height, o.element.appendChild(t), 0 === a && (l = window.getComputedStyle(t, null).getPropertyValue("width"), 
                        t.style.height = l);
                    });
                }(e.photos.photo);
            } else t("Something went wrong, please try again.");
        }, n = setTimeout(function() {
            t("Slow loading... Your connection might be slow or the API is overloaded.");
        }, 5e3), s.send();
    }
    "function" != typeof NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach);
    var a = function(e) {
        throw new Error(e);
    }, o = {};
    o.element = e.element || a("You need an element to print all the good photos to."), 
    o.api_key = e.api_key || a("You need to provide a apikey"), o.per_page = e.per_page || 10, 
    o.elementClass = e.elementClass || "offlr-gallery", o.photoClass = e.photoClass || "offlr-gallery__photo", 
    o.element.className.indexOf(o.elementClass) < 0 && (o.element.className += " " + o.elementClass), 
    e.search_tag && t(e.search_tag);
    var n, l, r = document.createElement("div");
    return r.className += o.elementClass + "__message", window.addEventListener("resize", function() {
        if (o.element.firstElementChild && !(!o.element.firstElementChild.className.indexOf(o.photoClass) < 0)) {
            var e = window.getComputedStyle(o.element.firstElementChild, null).getPropertyValue("width");
            e !== l && (l = e, o.element.querySelectorAll("." + o.photoClass).forEach(function(e) {
                e.style.height = l;
            }));
        }
    }, !1), {
        search: t
    };
};