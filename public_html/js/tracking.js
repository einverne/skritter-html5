/*** errorception ***/
(function(_, e, rr, s) {
    _errs = [s];
    var c = _.onerror;
    _.onerror = function() {
        var a = arguments;
        _errs.push(a);
        c && c.apply(this, a);
    };
    var b = function() {
        var c = e.createElement(rr), b = e.getElementsByTagName(rr)[0];
        c.src = "//beacon.errorception.com/" + s + ".js";
        c.async = !0;
        b.parentNode.insertBefore(c, b);
    };
    _.addEventListener ? _.addEventListener("load", b, !1) : _.attachEvent("onload", b);
})
        (window, document, "script", "51e23f206fdb191b3e000110");


/*** google analytics ***/
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-4642573-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
        