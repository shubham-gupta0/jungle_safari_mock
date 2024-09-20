"use strict";
angular.module("website.core.humanize_duration", []),
  angular.module("website.core.settings", ["ng"]),
  angular.module("website.core.dependency", ["website.core.settings"]),
  angular
    .module("website", [
      "core.library.jsonrpc",
      "website.core",
      "website.widgets",
      "website.plugins",
      "website.moto_link",
      "moto.validation",
    ])
    .run([
      "jsonrpc",
      function (a) {
        window.websiteConfig && window.websiteConfig.apiUrl
          ? a.setBasePath(websiteConfig.apiUrl)
          : a.setBasePath("/api.php");
      },
    ]),
  angular.module("website.widgets", [
    "website.widget.contact_form",
    "website.widget.mail_chimp",
    "website.widget.auth_form",
    "website.widget.slider",
    "website.widget.grid_gallery",
    "website.widget.carousel",
    "website.widget.disqus",
    "website.widget.facebook_page_plugin",
    "website.widget.twitter",
    "website.widget.pinterest",
    "website.widget.menu",
    "website.widget.audio_player",
    "website.widget.video_player",
    "website.widget.social_buttons",
    "website.widget.map",
    "website.widget.countdown",
  ]);
try {
  angular.module("website.plugins");
} catch (a) {
  angular.module("website.plugins", []);
}
angular.module("website.core", [
  "website.core.settings",
  "website.core.dependency",
  "website.core.humanize_duration",
]),
  angular.module("website.core").config([
    "motoWebsiteSettingsServiceProvider",
    function (a) {
      window.websiteConfig &&
        angular.isObject(window.websiteConfig) &&
        a.set(window.websiteConfig);
    },
  ]),
  $("body").hasClass("moto-preview") ||
    $(document).ready(function () {
      var a =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      a >= 1040 &&
        $(window).stellar({
          horizontalScrolling: !1,
          verticalScrolling: !0,
          responsive: !0,
        }),
        new WOW().init();
    }),
  angular.module("moto.validation", []),
  angular.module("website").directive("motoBackToTopButton", [
    "$window",
    function (a) {
      var b =
        (window.websiteConfig && window.websiteConfig.back_to_top_button) || {};
      return (
        (b.enabled = !!b.enabled),
        (b.topOffset = parseInt(b.topOffset) || 300),
        (b.animationTime = parseInt(b.animationTime) || 500),
        (b.cssVisibleClass = "moto-back-to-top-button_visible"),
        {
          restrict: "EA",
          template:
            '<a ng-click="toTop($event)" class="moto-back-to-top-button-link"><span class="moto-back-to-top-button-icon"></span></a></div>',
          controller: [
            "$scope",
            "$element",
            function (c, d) {
              function e() {
                try {
                  (h = f.scrollTop() > b.topOffset),
                    h !== g &&
                      ((g = h),
                      g
                        ? d.addClass(b.cssVisibleClass)
                        : d.removeClass(b.cssVisibleClass));
                } catch (a) {}
              }
              var f = angular.element(a),
                g = null,
                h = null;
              (c.toTop = function () {
                try {
                  $("body,html").animate({ scrollTop: 0 }, b.animationTime);
                } catch (a) {}
              }),
                b.enabled && f.scroll(e);
            },
          ],
        }
      );
    },
  ]),
  angular.module("website.core.dependency").directive("motoDependencyRequire", [
    "motoDependencyService",
    function (a) {
      return {
        restrict: "A",
        link: function (b, c, d) {
          var e = d.motoDependencyRequire,
            f = e;
          try {
            (f = b.$eval(f)), angular.isUndefined(f) && (f = e);
          } catch (a) {
            f = e;
          }
          angular.isFunction(f) && (f = f()), a.require(f);
        },
      };
    },
  ]),
  angular.module("website.core.dependency").provider("motoDependencyService", [
    "motoWebsiteSettingsServiceProvider",
    function (a) {
      function b(b) {
        b = b || "en";
        var c = a.get("preferredLanguage", "en");
        return l[c] || c;
      }
      function c(a) {
        var b = [];
        for (var c in a) a[c].length > 0 && b.push(c + "=" + a[c]);
        return b.join("&");
      }
      function d() {
        return j;
      }
      function e() {
        return k;
      }
      function f(a) {
        if (angular.isArray(a))
          return void angular.forEach(a, function (a) {
            f(a);
          });
        try {
          if (!m[a]) return !1;
          var b = m[a],
            c = b.scriptId || "connector_" + a,
            e = document.getElementById(c);
          if (e) return;
          (e = document.createElement("script")),
            (e.id = c),
            (e.src = b.getUrl()),
            (e.type = "text/javascript"),
            b.preInject(e),
            d().appendChild(e),
            b.postInject(e);
        } catch (a) {
          return !1;
        }
        return !0;
      }
      function g(a) {
        return m[a];
      }
      var h = null,
        i = {},
        j = angular.element("head").get(0),
        k = angular.element("body").get(0),
        l = { en: "en_US", de: "de_DE", ru: "ru_RU" },
        m = {};
      (m = {
        disqus: {
          name: "disqus",
          urlTemplate: "//{{shortname}}.disqus.com/embed.js",
          params: {},
          setParams: function (a) {
            for (var b in a) a.hasOwnProperty(b) && this.setParam(b, a[b]);
            return this;
          },
          getParams: function () {
            return this.params;
          },
          setParam: function (a, b) {
            return (
              (this.params[a] = b), "" != b && (window["disqus_" + a] = b), this
            );
          },
          getParam: function (a, b) {
            return angular.isUndefined(this.params[a])
              ? angular.isUndefined(window["disqus_" + a])
                ? b
                : window["disqus_" + a]
              : this.params[a];
          },
          getUrl: function () {
            return this.urlTemplate.replace(
              /\{\{shortname\}\}/gi,
              this.getParam("shortname")
            );
          },
          preInject: angular.noop,
          postInject: angular.noop,
          require: function () {
            return i.require(this.name), this;
          },
        },
        facebook: {
          name: "facebook",
          scriptId: "facebook-jssdk",
          urlTemplate: "//connect.facebook.net/{{language}}/sdk.js#{{params}}",
          language: "en_US",
          getLanguage: function () {
            return this.language;
          },
          setLanguage: function (a) {
            return (this.language = a);
          },
          getUrl: function () {
            return this.urlTemplate
              .replace(/\{\{language\}\}/gi, this.getLanguage())
              .replace(/\{\{params\}\}/gi, c(this.getParams()));
          },
          params: { version: "v2.8", xfbml: "1", appId: "" },
          setParams: function (a) {
            for (var b in a) a.hasOwnProperty(b) && this.setParam(b, a[b]);
            return this;
          },
          getParams: function () {
            return this.params;
          },
          setParam: function (a, b) {
            return (this.params[a] = b), this;
          },
          getParam: function (a, b) {
            return angular.isUndefined(this.params[a]) ? b : this.params[a];
          },
          preInject: function (a) {
            var b = document.getElementById("fb-root");
            b ||
              ((b = document.createElement("div")),
              (b.id = "fb-root"),
              e().appendChild(b));
          },
          postInject: angular.noop,
          require: function () {
            return i.require(this.name), this;
          },
        },
        twitter: {
          name: "twitter",
          scriptId: "twitter-wjs",
          url: "//platform.twitter.com/widgets.js",
          getUrl: function () {
            return this.url;
          },
          params: {},
          setParams: function (a) {
            for (var b in a) a.hasOwnProperty(b) && this.setParam(b, a[b]);
            return this;
          },
          getParams: function () {
            return this.params;
          },
          setParam: function (a, b) {
            return (this.params[a] = b), this;
          },
          getParam: function (a, b) {
            return angular.isUndefined(this.params[a]) ? b : this.params[a];
          },
          preInject: angular.noop,
          postInject: angular.noop,
          require: function () {
            return i.require(this.name), this;
          },
        },
        pinterest: {
          name: "pinterest",
          scriptUrl: "//assets.pinterest.com/js/pinit.js",
          getUrl: function () {
            return this.scriptUrl;
          },
          preInject: angular.noop,
          postInject: angular.noop,
          require: function () {
            return i.require(this.name), this;
          },
        },
        linkedin: {
          name: "linkedin",
          scriptUrl: "//platform.linkedin.com/in.js",
          getUrl: function () {
            return this.scriptUrl;
          },
          preInject: function (a) {
            var c = b(),
              d = a.innerText;
            (window._DependencyServiceOnLinkedInLoad = function () {
              h && h.$emit("motoDependencyService.linkedin.loaded"),
                (window._DependencyServiceOnLinkedInLoad = function () {});
            }),
              (d += " onLoad: _DependencyServiceOnLinkedInLoad\n"),
              c && (d += " lang: " + c),
              (a.textContent = d);
          },
          postInject: angular.noop,
          require: function () {
            return i.require(this.name), this;
          },
        },
        google_plus: {
          name: "google_plus",
          scriptUrl: "https://apis.google.com/js/platform.js",
          getUrl: function () {
            return this.scriptUrl;
          },
          preInject: function (b) {
            var c = window.___gcfg || {};
            (c.lang = c.lang || a.get("preferredLanguage", "en")),
              (window.___gcfg = c);
          },
          postInject: angular.noop,
          require: function () {
            return i.require(this.name), this;
          },
        },
      }),
        (this.require = f),
        (i.require = f),
        (this.get = g),
        (i.get = g),
        (this.$get = [
          "$rootScope",
          function (a) {
            return (h = a), i;
          },
        ]);
    },
  ]),
  angular.module("website.core.humanize_duration").filter("humanizeDuration", [
    "motoHumanizeDuration",
    function (a) {
      return function (b, c, d) {
        return a.humanize(b, c, d);
      };
    },
  ]),
  angular
    .module("website.core.humanize_duration")
    .provider("motoHumanizeDuration", [
      function () {
        var a = this,
          b = {
            y: 315576e5,
            mo: 26298e5,
            w: 6048e5,
            d: 864e5,
            h: 36e5,
            m: 6e4,
            s: 1e3,
            ms: 1,
          },
          c = {
            years: "y",
            months: "mo",
            weeks: "w",
            days: "d",
            hours: "h",
            minutes: "m",
            seconds: "s",
            milliseconds: "ms",
          };
        (this.humanize = function (a, d, e) {
          var f,
            g = ">";
          return (
            (!e || humanizeDuration.getSupportedLanguages().indexOf(e) < 0) &&
              (e = "en"),
            c[d] && (d = c[d]),
            (f = humanizeDuration(a * b[d], {
              spacer: g,
              language: e,
              units: [d],
              round: !0,
            })),
            f.substr(f.indexOf(g) + g.length)
          );
        }),
          (this.$get = [
            function () {
              return a;
            },
          ]);
      },
    ]),
  angular
    .module("website.core.settings")
    .provider("motoWebsiteSettingsService", [
      function (a) {
        var b = this,
          c = {};
        (this.get = function (b, d) {
          return b === a ? c : c[b] !== a ? c[b] : d || null;
        }),
          (this.set = function (a, d) {
            if (!angular.isObject(a)) return (c[a] = d), b;
            for (var e in a) a.hasOwnProperty(e) && b.set(e, a[e]);
          }),
          (this.$get = [
            function () {
              return b;
            },
          ]);
      },
    ]),
  angular.module("website.moto_link", []).run(function () {
    var a,
      b,
      c = angular.element('[data-action="lightbox"].moto-link');
    for (a = 0; a < c.length; a++)
      (b = $(c[a])),
        b.hasClass("moto-widget-image-link")
          ? b.magnificPopup({
              type: "image",
              tClose: "",
              tLoading: "",
              zoom: { enabled: !0, duration: 400, easing: "ease-in-out" },
            })
          : b.magnificPopup({ type: "image" });
    angular.element("body").delegate(".moto-link", "click", function (a) {
      "lightbox" == angular.element(this).attr("data-action") &&
        a.preventDefault();
    });
  }),
  angular.module("website").directive("motoSticky", [
    "$window",
    "$timeout",
    function (a, b) {
      function c() {
        return window.motoDebug || !1;
      }
      function d(a) {
        if ("static" === a.options.mode) return !0;
        var b,
          c = a.isAttached || a.options.hidden ? a.$pseudoElement : a.$element,
          d = c.get(0).getBoundingClientRect(),
          e = !1,
          f = a.options.offset,
          g = parseInt(c.css("marginTop")) || 0;
        return "smallHeight" === a.options.mode
          ? ((b = Math.max(
              document.documentElement.clientHeight,
              window.innerHeight || 0
            )),
            d.top + c.outerHeight() < b)
          : ("top" === a.options.direction && (e = d.top - g <= f), e);
      }
      function e(a) {
        var b = 0;
        try {
          a.$pseudoElement.show(),
            s || a.$element.innerWidth(a.$pseudoElement.innerWidth()),
            a.options.hidden ||
              a.$pseudoElement.height(a.$element.outerHeight(!0)),
            s &&
              (a.$pseudoElement.hide(),
              a.$element
                .removeClass(o.attachedClass)
                .removeClass(o.attachedClass + "_" + a.options.direction)
                .css("width", "")
                .css("marginTop", ""),
              (b = a.$element.innerWidth()),
              a.$pseudoElement.show(),
              a.$element.innerWidth(b),
              a.$pseudoElement.innerWidth(b),
              a.$element
                .addClass(o.attachedClass)
                .addClass(o.attachedClass + "_" + a.options.direction));
        } catch (a) {
          c() && console.info("motoSticky : ERROR on syncPseudoElement", a);
        }
      }
      function f(a) {
        return (
          a.isAttached ||
            (a.$element
              .show()
              .addClass(o.attachedClass)
              .addClass(o.attachedClass + "_" + a.options.direction),
            (a.isAttached = !0)),
          e(a),
          !0
        );
      }
      function g(a) {
        return (
          a.$pseudoElement.width(a.$element.innerWidth()),
          !a.isAttached ||
            (a.$element.css("width", ""),
            (a.isAttached = !1),
            a.$element
              .removeClass(o.attachedClass)
              .removeClass(o.attachedClass + "_" + a.options.direction),
            void (a.options.hidden
              ? (a.$pseudoElement.height(0), a.$element.hide())
              : a.$pseudoElement.hide()))
        );
      }
      function h(a) {
        try {
          d(a) ? f(a) : g(a);
        } catch (a) {
          c() && console.info("motoSticky : ERROR on checkObject", a);
        }
      }
      function i(a) {
        try {
          if (
            (a || (m && b.cancel(m), (m = b(i, o.interval))),
            !r || q.length < 1)
          )
            return;
          r = !1;
          for (var d = 0, e = q.length; d < e; d++) h(q[d]);
          s = !1;
        } catch (a) {
          c() && console.info("motoSticky : ERROR on checkObjects", a);
        }
      }
      function j(a) {
        a.$pseudoElement ||
          ((a.$pseudoElement = angular.element(
            '<div class="' + o.pseudoElementClass + '"></div>'
          )),
          a.$pseudoElement.insertAfter(a.$element),
          a.options.hidden
            ? a.$pseudoElement.height(0)
            : (a.$pseudoElement.hide(),
              a.$pseudoElement.height(a.$element.outerHeight(!0)),
              a.$pseudoElement.width(a.$element.innerWidth())));
      }
      function k(a, b, d) {
        try {
          if (b.parent().closest("." + o.bootstrappedClass).length > 0)
            return c() && console.log("motoSticky : DETECTED PARENTS");
          var e = a.$eval(d.motoSticky),
            f = {
              $scope: a,
              $element: b,
              $attrs: d,
              options: angular.extend({}, p, e),
              isAttached: !1,
            };
          j(f), h(f), q.push(f);
        } catch (a) {
          c() && console.info("motoSticky : ERROR on addObject", a);
        }
      }
      function l(a) {
        "resize" === a.type && (s = !0), (r = !0);
      }
      var m,
        n = angular.element(a),
        o = {
          interval: 32,
          attachedClass: "moto-sticky__attached",
          bootstrappedClass: "moto-sticky__bootstrapped",
          pseudoElementClass: "moto-sticky-pseudo-element",
        },
        p = { hidden: !1, offset: 0, mode: "dynamic", direction: "top" },
        q = [],
        r = !0,
        s = !0;
      return (
        i(),
        n.scroll(l).resize(l),
        {
          restrict: "A",
          compile: function (a) {
            return a.addClass(o.bootstrappedClass), k;
          },
        }
      );
    },
  ]),
  angular
    .module("moto.validation")
    .directive("motoClearValidationOnChange", function () {
      return {
        restrict: "A",
        require: "?ngModel",
        link: function (a, b, c, d) {
          function e(a) {
            for (g = 0, h = f.length; g < h; g++) d.$setValidity(f[g], !0);
            return a;
          }
          var f, g, h;
          (f = a.$eval(c.motoClearValidationOnChange)),
            !f &&
              c.motoClearValidationOnChange &&
              (f = c.motoClearValidationOnChange),
            f && !angular.isArray(f) && (f = [f]),
            d.$parsers.push(e);
        },
      };
    }),
  angular
    .module("website.widget.audio_player", ["website.core"])
    .directive("motoWidgetAudioPlayer", [
      "$rootScope",
      function (a) {
        return {
          restrict: "AC",
          link: function (b, c) {
            var d,
              e,
              f = c.find(".moto-media-player-container").data("buttons");
            (d = c.find("audio")),
              (e = c.find("source")),
              d.mediaelementplayer({
                setDimensions: !1,
                alwaysShowControls: !0,
                motoTrackName: e.data("track-name") || "",
                loop: d.data("loop"),
                timeAndDurationSeparator: "<span>/</span>",
                startVolume: 1,
                playText: "",
                pauseText: "",
                stopText: "",
                features: [
                  "playpause",
                  f.stop ? "stop" : "",
                  "progress",
                  "current",
                  "duration",
                  "mototrackname",
                  "volume",
                  f.loop ? "motoloop" : "",
                  "motoskin",
                ],
                plugins: [],
                duration: e.data("track-length"),
              }),
              !a.isAnyAutoPlayStarted &&
                d.data("autoplay") &&
                ((a.isAnyAutoPlayStarted = !0), d[0].player.play());
          },
        };
      },
    ]),
  angular
    .module("website.widget.auth_form", ["core.library.jsonrpc"])
    .service("widget.AuthForm.Service", [
      "jsonrpc",
      function (a) {
        var b = a.newService("AuthService");
        this.loginToPageByPassword = b.createMethod("loginToPageByPassword");
      },
    ])
    .directive("motoWidgetAuthForm", [
      "widget.AuthForm.Service",
      "$window",
      function (a, b) {
        return {
          restrict: "C",
          scope: !0,
          link: function (c, d, e) {
            (c.request = { password: "", pageId: e.destinationPageId }),
              (c.submit = function () {
                c.request.pageId &&
                  (c.authForm.password.$setTouched(),
                  c.authForm.$valid &&
                    a
                      .loginToPageByPassword(c.request)
                      .success(function () {
                        b.location.reload();
                      })
                      .error(function (a) {
                        a && "403" == a.code
                          ? c.authForm.password.$setValidity(
                              "passwordInvalid",
                              !1
                            )
                          : c.authForm.password.$setValidity(
                              "couldNotSend",
                              !1
                            );
                      }));
              });
          },
        };
      },
    ]),
  angular
    .module("website.widget.carousel", [])
    .directive("motoCarouselOptions", function () {
      return {
        restrict: "A",
        priority: 450,
        link: function (a, b, c) {
          function d(a) {
            return (
              1 == a.itemsCount && (a.showPaginationDots = !1),
              {
                mode: "horizontal",
                auto: a.slideshowEnabled,
                pause: 1e3 * a.slideshowDelay,
                controls: a.showNextPrev,
                pager: a.showPaginationDots,
                slideWidth: a.slideWidth,
                minSlides: a.minSlides,
                maxSlides: a.maxSlides,
                moveSlides: a.moveSlides,
                slideMargin: a.margins,
                stopAutoOnClick: !0,
                shrinkItems: !0,
                onSliderLoad: function () {
                  b.closest(".moto-widget-carousel").removeClass(
                    "moto-widget-carousel-loader"
                  );
                },
              }
            );
          }
          var e = a.$eval(c.motoCarouselOptions);
          b.bxSlider(d(e));
        },
      };
    }),
  Object.prototype.hasOwnProperty("forIn") ||
    Object.defineProperty(Object.prototype, "forIn", {
      value: function (a) {
        var b,
          c = this;
        if (a) for (b in c) a(b, c[b]);
      },
      enumerable: !1,
      writable: !1,
    }),
  angular
    .module("website.widget.contact_form", [
      "core.library.jsonrpc",
      "ngFileUpload",
    ])
    .config(function () {})
    .run(function () {})
    .service("widget.ContactForm.Service", [
      "jsonrpc",
      function (a) {
        var b = a.newService("Widget.ContactForm");
        (this.sendMessage = b.createMethod("sendMessage")),
          (this.getApiPath = a.getBasePath);
      },
    ])
    .controller("widget.ContactForm.Controller", [
      "$scope",
      "$element",
      "widget.ContactForm.Service",
      "Upload",
      function (a, b, c, d) {
        function e() {
          (a.emailError = !0), (a.sending = !1);
        }
        function f(b) {
          return b.error
            ? e(b.error)
            : ((a.emailSent = !0), (a.triedToSend = !1), void (a.sending = !1));
        }
        var g,
          h,
          i = b.find("input, textarea"),
          j =
            /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
        if (
          ((a.message = {}),
          (a.placeholder = {}),
          (a.hash = ""),
          (a.attachments = []),
          (a.attachment = {}),
          i.length)
        )
          for (var k = 0, l = i.length; k < l; k++)
            (g = angular.element(i[k])),
              (h = g.attr("name")),
              h &&
                ((a.message[h] = a.message[h] || ""),
                (a.placeholder[h] = g.attr("placeholder") || h));
        (a.validateEmailOnBlur = function () {
          if (
            ((a.contactForm.email.$pristine = !1),
            "" != a.contactForm.email.$viewValue)
          ) {
            var b = j.test(a.contactForm.email.$viewValue);
            b
              ? ((a.contactForm.email.emailInvalid = !1),
                a.contactForm.email.$setValidity("pattern", !0))
              : ((a.contactForm.email.emailInvalid = !0),
                a.contactForm.email.$setValidity("pattern", !1));
          } else a.contactForm.email.emailInvalid = !1;
        }),
          (a.validateRequiredOnBlur = function (b) {
            (a.contactForm[b].$pristine = !1),
              "" == a.contactForm[b].$viewValue
                ? ((a.contactForm[b].$invalid = !0),
                  (a.contactForm.$valid = !1))
                : (a.contactForm[b].$invalid = !1);
          }),
          (a.validate = function (b) {
            "email" == b && a.validateEmailOnBlur(),
              a.validateRequiredOnBlur(b);
          }),
          (a.errors = []),
          (a.emailSent = !1),
          (a.triedToSend = !1),
          (a.submit = function () {
            a.sending ||
              ((a.emailSent = !1),
              (a.triedToSend = !0),
              (a.errors = []),
              (a.sending = !0),
              (a.emailError = !1),
              "object" == typeof a.contactForm.$error.required
                ? (a.contactForm.$error.required.forEach(function (a) {
                    (a.$dirty = !0), (a.$pristine = !1), a.$setTouched();
                  }),
                  (a.contactForm.$valid = !1))
                : (a.contactForm.$valid = !0),
              a.validate("email"),
              a.contactForm &&
              a.contactForm.$valid &&
              !a.contactForm.emailInvalid
                ? a.attachment.name
                  ? ((a.message._attachments = a.attachment.name ? 1 : 0),
                    d
                      .upload({
                        method: "POST",
                        url: c.getApiPath(),
                        file: a.attachment,
                        data: {
                          jsonrpc: "2.0",
                          id: 1,
                          method: "Widget.ContactForm.sendMessage",
                          params: {
                            message: a.message,
                            placeholder: a.placeholder,
                            hash: a.hash,
                          },
                        },
                        headers: { "X-Requested-With": "XMLHttpRequest" },
                      })
                      .success(f)
                      .error(e))
                  : c
                      .sendMessage({
                        message: a.message,
                        placeholder: a.placeholder,
                        hash: a.hash,
                      })
                      .success(f)
                      .error(e)
                : (a.sending = !1));
          });
      },
    ]),
  angular
    .module("website.widget.countdown", [
      "timer",
      "website.core.humanize_duration",
    ])
    .directive("motoWidgetCountdown", [
      "$window",
      function (a) {
        function b(a, b) {
          var c, d, e, f, g, h, i, j, k, l;
          return (
            (j = new Date()),
            j.setTime(a),
            (i = j.getMilliseconds()),
            (h = j.getSeconds()),
            (g = j.getMinutes()),
            (f = j.getHours()),
            (e = j.getDate()),
            (d = j.getMonth()),
            (c = j.getFullYear()),
            (k = new Date()),
            k.setUTCFullYear(c),
            k.setUTCDate(1),
            k.setUTCMonth(d || 0),
            k.setUTCDate(e || 1),
            k.setUTCHours(f || 0),
            k.setUTCMinutes((g || 0) - (Math.abs(b) < 30 ? 60 * b : b)),
            k.setUTCSeconds(h || 0),
            k.setUTCMilliseconds(i || 0),
            (l = k.getTime())
          );
        }
        return {
          restrict: "C",
          scope: !0,
          compile: function (c, d) {
            function e() {
              "hide" == d.onExpiry
                ? c.slideUp()
                : "redirect" == d.onExpiry &&
                  d.redirectUrl &&
                  (a.location.href = d.redirectUrl);
            }
            var f,
              g,
              h,
              i = c.children("timer"),
              j = c.find(".countdown-item-amount"),
              k = parseFloat(d.time),
              l = new Date().getTime();
            for (h = 0; h < j.length; h++)
              (f = angular.element(j[h])),
                (g = f.attr("data-ng-bind")),
                0 == h && i.attr("max-time-unit", "'" + g.slice(0, -1) + "'"),
                ["hours", "minutes", "seconds"].indexOf(g) >= 0 &&
                  f.attr("data-ng-bind", g[0] + g);
            return {
              pre: function (a) {
                "event" == d.type
                  ? (a.countdownTime = (b(k, parseFloat(d.timezone)) - l) / 1e3)
                  : (a.countdownTime = k / 1e3),
                  (!a.countdownTime ||
                    isNaN(a.countdownTime) ||
                    a.countdownTime < 0) &&
                    (a.countdownTime = 0),
                  d.onExpiry &&
                    "stop" != d.onExpiry &&
                    a.$on("timer-stopped", e);
              },
            };
          },
        };
      },
    ]),
  angular
    .module("website.widget.disqus", ["website.core"])
    .directive("motoWidgetDisqus", [
      "motoDependencyService",
      function (a) {
        var b = !1;
        return {
          restrict: "AC",
          link: function (c, d, e) {
            try {
              if (b) return d.remove();
              b = !0;
              var f = e.params || {};
              angular.isString(f) && (f = angular.fromJson(f)),
                (f.url = e.url),
                (window.disqus_config = function () {
                  this.language = f.language;
                }),
                f.use_identifier ? delete f.url : delete f.identifier,
                delete f.use_identifier,
                f &&
                  f.shortname &&
                  "" != f.shortname &&
                  a.get("disqus").setParams(f).require();
            } catch (a) {}
          },
        };
      },
    ]),
  angular
    .module("website.widget.facebook_page_plugin", ["website.core"])
    .config([
      "motoWebsiteSettingsServiceProvider",
      "motoDependencyServiceProvider",
      function (a, b) {
        try {
          var c = b.get("facebook"),
            d = a.get("preferredLanguage", "en"),
            e = { en: "en_US", de: "de_DE", ru: "ru_RU" };
          c && e[d] && c.setLanguage(e[d]);
        } catch (a) {}
      },
    ])
    .directive("motoWidgetFacebookPagePlugin", [
      "motoDependencyService",
      function (a) {
        return {
          restrict: "AC",
          link: function (b, c, d) {
            try {
              a.require("facebook");
            } catch (a) {}
          },
        };
      },
    ]),
  angular
    .module("website.widget.grid_gallery", [])
    .directive("motoGridGalleryOptions", function () {
      return {
        restrict: "A",
        priority: 450,
        link: function (a, b, c) {
          var d,
            e = a.$eval(c.motoGridGalleryOptions);
          (d = b.justifiedGallery({
            rowHeight: e.rowHeight,
            fixedHeight: e.fixedHeight,
            margins: e.margins,
            lastRow: e.lastRow,
            captions: e.showCaptions,
            cssAnimation: !0,
          })),
            e.enableLightbox &&
              d.on("jg.complete", function () {
                b.magnificPopup({
                  delegate: "a",
                  type: "image",
                  tClose: "",
                  tLoading: "",
                  gallery: {
                    enabled: !0,
                    preload: [5, 10],
                    tPrev: "",
                    tNext: "",
                    tCounter: "%curr% / %total%",
                  },
                  image: {
                    titleSrc: function (a) {
                      return (
                        angular.element(".caption", a.el.context).html() || ""
                      );
                    },
                  },
                  zoom: { enabled: !0, duration: 400, easing: "ease-in-out" },
                });
              });
        },
      };
    }),
  angular
    .module("website.widget.mail_chimp", ["core.library.jsonrpc"])
    .service("website.widget.MailChimpService", [
      "jsonrpc",
      function (a) {
        var b = a.newService("Widget.MailChimp");
        this.subscribe = b.createMethod("subscribe");
      },
    ])
    .controller("widget.MailChimp.Controller", [
      "$scope",
      "$element",
      "website.widget.MailChimpService",
      function (a, b, c) {
        function d(b) {
          (a.emailSent = !0), (a.triedToSend = !1), (a.sending = !1);
        }
        function e(b) {
          (a.emailError = !0),
            (a.sending = !1),
            b.data &&
              b.data.errors &&
              b.data.errors.detail &&
              (a.isSubscribed = b.data.errors.detail.match(
                /is already a list member/g
              ));
        }
        var f,
          g,
          h = b.find("input"),
          i =
            /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
        if (
          ((a.listId = ""),
          (a.message = {}),
          (a.emailSent = !1),
          (a.triedToSend = !1),
          (a.emailError = !1),
          (a.isSubscribed = !1),
          h.length)
        )
          for (var j = 0, k = h.length; j < k; j++)
            (f = angular.element(h[j])),
              (g = f.attr("name")),
              g && (a.message[g] = a.message[g] || "");
        (a.validateEmailOnBlur = function () {
          if (
            ((a.subscribeForm.email.$pristine = !1),
            "" != a.subscribeForm.email.$viewValue)
          ) {
            var b = i.test(a.subscribeForm.email.$viewValue);
            b
              ? ((a.subscribeForm.email.emailInvalid = !1),
                a.subscribeForm.email.$setValidity("pattern", !0))
              : ((a.subscribeForm.email.emailInvalid = !0),
                a.subscribeForm.email.$setValidity("pattern", !1));
          } else a.subscribeForm.email.emailInvalid = !1;
        }),
          (a.validateRequiredOnBlur = function (b) {
            (a.subscribeForm[b].$pristine = !1),
              "" == a.subscribeForm[b].$viewValue
                ? ((a.subscribeForm[b].$invalid = !0),
                  (a.subscribeForm.$valid = !1))
                : (a.subscribeForm[b].$invalid = !1);
          }),
          (a.validate = function (b) {
            "email" == b
              ? (a.validateEmailOnBlur(), a.validateRequiredOnBlur(b))
              : a.validateRequiredOnBlur(b);
          }),
          (a.submit = function () {
            a.sending ||
              ((a.emailSent = !1),
              (a.triedToSend = !0),
              (a.sending = !0),
              (a.emailError = !1),
              (a.isSubscribed = !1),
              "object" == typeof a.subscribeForm.$error.required
                ? (a.subscribeForm.$error.required.forEach(function (a) {
                    (a.$dirty = !0), (a.$pristine = !1), a.$setTouched();
                  }),
                  (a.subscribeForm.$valid = !1))
                : (a.subscribeForm.$valid = !0),
              a.validate("email"),
              a.subscribeForm &&
              a.subscribeForm.$valid &&
              !a.subscribeForm.emailInvalid
                ? ((a.message.list_id = a.listId || ""),
                  c.subscribe({ request: a.message }).success(d).error(e))
                : (a.sending = !1));
          });
      },
    ]),
  angular
    .module("website.widget.map", [])
    .directive("motoWidgetMap", function () {
      return {
        restrict: "C",
        priority: 450,
        link: function (a, b) {
          var c = b.find(".moto-widget-map-frame");
          b.on("click", function () {
            c.addClass("moto-widget-map-frame_active");
          }),
            b.on("mouseleave", function () {
              c.removeClass("moto-widget-map-frame_active");
            });
        },
      };
    }),
  angular
    .module("website.widget.menu", [])
    .directive("motoWidgetMenu", function () {
      return {
        restrict: "C",
        priority: 450,
        link: function (a, b) {
          var c = b.find(".moto-widget-menu-toggle-btn"),
            d = b.find(".moto-widget-menu-item-has-submenu"),
            e = d.find(".moto-widget-menu-sublist"),
            f = b.find(".moto-widget-menu-link-arrow");
          c.on("click", function (a) {
            a.preventDefault(),
              b.toggleClass("moto-widget-menu-mobile-open"),
              b.hasClass("moto-widget-menu-mobile-open") &&
                f.is(":visible") &&
                e.hide();
          }),
            d.length &&
              c.is(":visible") &&
              f.on("click", function (a) {
                a.preventDefault(),
                  $(this)
                    .closest(".moto-widget-menu-item-has-submenu")
                    .toggleClass("moto-widget-menu-item-has-submenu_opened")
                    .find("> .moto-widget-menu-sublist")
                    .toggle();
              });
        },
      };
    }),
  angular
    .module("website.widget.pinterest", ["website.core"])
    .directive("motoWidgetPinterest", [
      "motoDependencyService",
      function (a) {
        return {
          restrict: "AC",
          link: function (b, c, d) {
            try {
              a.get("pinterest").require();
            } catch (a) {}
          },
        };
      },
    ]),
  angular
    .module("website.widget.slider", [])
    .directive("motoSliderOptions", function () {
      return {
        restrict: "A",
        priority: 450,
        link: function (a, b, c) {
          function d(a) {
            return (
              1 == a.itemsCount && (a.showPaginationDots = !1),
              {
                mode: a.slideshowAnimationType,
                auto: a.slideshowEnabled,
                pause: 1e3 * a.slideshowDelay,
                controls: a.showNextPrev,
                pager: a.showPaginationDots,
                captions: a.showSlideCaptions,
                stopAutoOnClick: !0,
                onSliderLoad: function () {
                  b.closest(".moto-widget-slider").removeClass(
                    "moto-widget-slider-loader"
                  );
                },
              }
            );
          }
          var e = a.$eval(c.motoSliderOptions);
          b.bxSlider(d(e));
        },
      };
    }),
  angular
    .module("website.widget.social_buttons", ["website.core"])
    .directive("motoWidgetSocialButtons", [
      "$rootScope",
      function (a) {
        return {
          restrict: "AC",
          link: function (b, c) {
            function d() {
              try {
                var a,
                  b = c.find('li.social-button[data-name="linkedIn_share"]');
                b.length &&
                  ((b = angular.element(b.get(0))),
                  (a = angular.element(
                    b
                      .html()
                      .replace("<span", "<script")
                      .replace("</span>", "</script>")
                  )),
                  b.get(0).parentNode.replaceChild(a.get(0), b.get(0)),
                  IN.parse());
              } catch (a) {}
            }
            window.IN && angular.isFunction(window.IN.parse)
              ? d()
              : a.$on("motoDependencyService.linkedin.loaded", d);
          },
        };
      },
    ]),
  angular.module("website.widget.twitter", [
    "website.core",
    "website.widget.twitter.time_line",
  ]),
  angular
    .module("website.widget.twitter.time_line", ["ng"])
    .directive("motoWidgetTwitterTimeLine", [
      "motoDependencyService",
      function (a) {
        return {
          restrict: "AC",
          link: function (b, c, d) {
            try {
              a.require("twitter");
            } catch (a) {}
          },
        };
      },
    ]),
  angular
    .module("website.widget.video_player", ["website.core"])
    .directive("motoWidgetVideoPlayer", [
      "$rootScope",
      function (a) {
        return {
          restrict: "AC",
          link: function (b, c) {
            var d;
            (d = c.find("video")),
              d.on("loadeddata", function () {
                c
                  .removeClass("moto-media-player_not-loaded")
                  .addClass("moto-media-player_loaded"),
                  (d[0].player.options.alwaysShowControls = !1);
              }),
              d.mediaelementplayer({
                motoTrackName: d.data("title") || "",
                timeAndDurationSeparator: "<span>/</span>",
                startVolume: 1,
                playText: "",
                pauseText: "",
                alwaysShowControls: !0,
                stopText: "",
                fullscreenText: "",
                videoVolume: "horizontal",
                features: [
                  "playpause",
                  "progress",
                  "current",
                  "duration",
                  "mototrackname",
                  "volume",
                  "fullscreen",
                  "motoskin",
                ],
                plugins: [],
                duration: d.data("duration"),
              }),
              !a.isAnyAutoPlayStarted &&
                d.data("autoplay") &&
                ((a.isAnyAutoPlayStarted = !0), d[0].player.play());
          },
        };
      },
    ]);
