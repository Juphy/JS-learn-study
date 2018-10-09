/*
 * 	Zoomy Zoom - jQuery plugin
 *	written by Jacob Lowe
 *	http://redeyeops.com/plugins/zoomy
 *
 *	Copyright (c) 2010 Jacob Lowe (http://redeyeoperations.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 */
jQuery.fn.zoomy = function (c) {
    function m(a) {
        a.find("img").css("height");
        a.find("img").css("width");
        var d = a.attr("href");
        a.css({position: "relative"}).append('<div class="zoomy"><img /></div>');
        var b = a.find(".zoomy");
        p(a, b);
        a.hover(function () {
            if (b.attr("id") != "brokeZoomy") {
                b.show(100);
                if (b.find("img").length) {
                    q(a, d, b);
                    setTimeout(function () {
                        if (!b.find("img").length) {
                            n(a, b);
                            k(a, b)
                        }
                    }, 150)
                } else {
                    n(a, b);
                    k(a, b)
                }
                a.find("img:first").stop().animate({opacity: 0.7}, 100)
            } else a.find("img:first").stop().animate({opacity: 1},
                100)
        }, function () {
            if (b.attr("id") != "brokeZoomy") if (!b.find("img").length) {
                setTimeout(function () {
                    b.hide()
                }, 100);
                a.find("img:first").stop().animate({opacity: 1}, 100)
            }
        }).click(function () {
            if (c.clickable === false) return false
        })
    }

    function q(a, d, b) {
        var e = a.children("img").height(), g = a.children("img").width(), f = c.zoomSize / 2;
        b.find("img").attr("src") != d && b.css({
            top: e / 2 - f,
            left: g / 2 - f
        }).find("img").attr("src", d).load(function () {
            var i = b.find("img").height(), j = b.find("img").width();
            a.attr({x: j, y: i});
            if (c.glare === true) {
                b.html("<span></span>").css({
                    "background-image": "url(" +
                        d + ")"
                });
                setTimeout(function () {
                    var o = b.children("span");
                    c.round === true ? o.css({
                        height: c.zoomSize - 20,
                        width: c.zoomSize - 20,
                        "-webkit-border-radius": c.zoomSize / 2 + "px",
                        "-moz-border-radius": c.zoomSize / 2 + "px",
                        "border-radius": c.zoomSize / 2 + "px"
                    }) : o.css({height: c.zoomSize - 20, width: c.zoomSize - 20})
                }, 100)
            } else b.html("").css({"background-image": "url(" + d + ")"});
            k(a, b)
        })
    }

    function k(a, d) {
        var b = d.offset();
        a.mousemove(function (e) {
            var g = parseInt(a.attr("x")), f = parseInt(a.attr("y")), i = a.width(), j = a.height();
            zoomSize = c.zoomSize;
            halfSize = zoomSize / 2;
            posX = e.pageX - b.left - halfSize;
            posY = e.pageY - b.top - halfSize;
            ratioX = i / g;
            ratioY = j / f;
            leftX = Math.round((e.pageX - b.left) / ratioX) - halfSize;
            topY = Math.round((e.pageY - b.top) / ratioY) - halfSize;
            stop = Math.round(halfSize - halfSize * ratioX);
            rightStop = i - zoomSize + stop;
            bottomStop = j - zoomSize + stop;
            if (-stop <= posX && -stop <= posY && rightStop >= posX && bottomStop >= posY) d.show().css({
                backgroundPosition: "-" + leftX + "px -" + topY + "px",
                left: posX,
                top: posY
            }); else if (-stop >= posX) if (-stop <= posY && bottomStop >= posY) d.show().css({
                backgroundPosition: "0px -" +
                    topY + "px", left: -stop, top: posY
            }); else if (-stop >= posY) d.show().css({
                backgroundPosition: "0px 0px",
                left: -stop,
                top: -stop
            }); else bottomStop <= posY && d.show().css({
                backgroundPosition: "0px -" + (f - zoomSize) + "px",
                left: -stop,
                top: bottomStop
            }); else if (-stop > +posY) rightStop > posX ? d.show().css({
                backgroundPosition: "-" + leftX + "px 0px",
                left: posX,
                top: -stop
            }) : d.show().css({
                backgroundPosition: "-" + (g - zoomSize) + "px 0px",
                left: rightStop,
                top: -stop
            }); else if (rightStop <= posX) bottomStop > posY ? d.show().css({
                backgroundPosition: "-" + (g -
                    zoomSize) + "px -" + topY + "px", left: rightStop, top: posY
            }) : d.show().css({
                backgroundPosition: "-" + (g - zoomSize) + "px -" + (f - zoomSize) + "px",
                left: rightStop,
                top: bottomStop
            }); else bottomStop <= posY && d.show().css({
                backgroundPosition: "-" + leftX + "px -" + (f - zoomSize) + "px",
                left: posX,
                top: bottomStop
            })
        })
    }

    function n(a, d) {
        var b = a.children("img");
        h = b.height();
        w = b.width();
        d.css({backgroundPosition: "center", left: "0px", top: "0px"}).show().parent("a").css({height: h, width: w})
    }

    function p(a, d) {
        var b = a.children("img");
        c.round === true ?
            d.css({
                height: c.zoomSize,
                width: c.zoomSize,
                "-webkit-border-radius": c.zoomSize / 2 + "px",
                "-moz-border-radius": c.zoomSize / 2 + "px",
                "border-radius": c.zoomSize / 2 + "px"
            }) : d.css({height: c.zoomSize, width: c.zoomSize}).children("span").css({
                height: c.zoomSize - 20,
                width: c.zoomSize - 20
            });
        if (b.css("float") == "left") if (a.children("img").css("margin") == "0px") a.css({
            margin: "0px",
            "float": "left"
        }); else {
            var e = a.children("img").css("margin-top");
            b.css("margin", "0px");
            a.css({margin: e, "float": "left"})
        } else if (b.css("float") == "right") if (a.children("img").css("margin") ==
            "0px") a.css({margin: "0px", "float": "right"}); else {
            e = a.children("img").css("margin-top");
            b.css("margin", "0px");
            a.css({margin: e, "float": "right"})
        } else if (a.parent("*").css("text-align") == "center") if (a.children("img").css("margin") == "0px") a.css({
            margin: "0px auto",
            display: "block"
        }); else {
            e = a.children("img").css("margin-top");
            b.css("margin", "0px");
            a.css({margin: e + " auto", display: "block"})
        } else a.css({display: "block"});
        b.load(function () {
            setTimeout(function () {
                var g = b.height(), f = b.width();
                a.css({
                    display: "block",
                    height: g, width: f, cursor: "normal"
                })
            }, 200)
        })
    }

    c = $.extend({zoomSize: 200, clickable: false, round: true, glare: true}, c);
    var l = $(this);
    l.size() > 1 ? l.each(function () {
        m($(this))
    }) : m(l)
};
