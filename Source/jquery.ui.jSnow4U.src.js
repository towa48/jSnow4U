/************************************************************************
 * <description>jSnow4U - jQuery UI snowfall widget</description>
 * <copyright file="jquery.ui.jSnow4U.src.js">
 *     Copyright (c) 2011 Anton Prilepskiy. All rights reserved.
 * </copyright>
 * <license>MIT or GNU GPL v2</license>
 * <description>Based on Snowmaker script (c) 2003 Peter Gehrig</description>
 * <author>Anton Prilepskiy</author>
 * <email>towa48@gmail.com</email>
 * <cvs>$Id$</cvs>
 ************************************************************************/

(function ($) {
    // ECMA5 Strict Mode
    "use strict";

    $.widget("ui.jSnow4U", {
        options: {
			// Set the number of snowflakes (more than 30 - 40 not recommended)
			snowmax: 35,
			// Set the colors for the snow. Add as many colors as you like
			snowcolor: ["#aaaacc", "#ddddFF", "#ccccDD"],
			// Set the fonts, that create the snowflakes. Add as many fonts as you like
			snowtype: ["Arial Black", "Arial Narrow", "Times", "Comic Sans MS"],
			// Set the letter that creates your snowflake (recommended:*)
			snowletter: "*",
			// Set the speed of sinking (recommended values range from 0.3 to 2)
			sinkspeed: 0.6,
			// Set the maximal-size of your snowflaxes
			snowmaxsize: 22,
			// Set the minimal-size of your snowflaxes
			snowminsize: 8,
			// Set the snowing-zone
			// Set 1 for all-over-snowing, set 2 for left-side-snowing 
			// Set 3 for center-snowing, set 4 for right-side-snowing
			snowingzone: 1
		},
		_po: {
			div: null,
			snow: [],
			marginbottom: 0,
			marginright: 0,
			timer: null,
			crds: [],
			x_mv: [],
			lftrght: []
		},
		_create: function () {
			// extend jQuery.browser
			$.browser.netscape = document.getElementById&&!document.all;
			
			this._po.div = $("<div/>").attr("id", "ui-jsnow4u");
			var html = '', i;
			for (i = 0; i <= this.options.snowmax; i++) {
				html += "<span id='ui-jsnow4u-s"+i+"' style='position:absolute;top:-"+this.options.snowmaxsize+"'>"+this.options.snowletter+"</span>";
			}
			this._po.div.html(html);
			
			$("body").append(this._po.div);
			this._initSnow();
		},
		_randomMaker: function (range) {
			return Math.floor(range*Math.random());
		},
		_initSnow: function () {
			var i, snowsizerange;
			if ($.browser.msie || $.browser.opera) {
				this._po.marginbottom = document.body.clientHeight;
				this._po.marginright = document.body.clientWidth;
			} else if ($.browser.netscape) {
				// netscape, firefox
				this._po.marginbottom = window.innerHeight;
				this._po.marginright = window.innerWidth;
			}
			
			snowsizerange = this.options.snowmaxsize - this.options.snowminsize;
			
			for (i = 0; i <= this.options.snowmax; i++) {
				this._po.crds[i] = 0;                      
				this._po.lftrght[i] = Math.random()*15;         
				this._po.x_mv[i] = 0.03 + Math.random()/10;
				
				this._po.snow[i] = this._po.div.find("#ui-jsnow4u-s"+i);
				this._po.snow[i][0].style.fontFamily = this.options.snowtype[this._randomMaker(this.options.snowtype.length)];
				this._po.snow[i][0].size = this._randomMaker(snowsizerange) + this.options.snowminsize;
				this._po.snow[i][0].style.fontSize = this._po.snow[i][0].size;
				this._po.snow[i][0].style.color = this.options.snowcolor[this._randomMaker(this.options.snowcolor.length)];
				this._po.snow[i][0].sink = this.options.sinkspeed*this._po.snow[i][0].size/5;
				
				if (this.options.snowingzone == 1) {
					this._po.snow[i][0].posx = this._randomMaker(this._po.marginright-this._po.snow[i][0].size)
				} else if (this.options.snowingzone == 2) {
					this._po.snow[i][0].posx = this._randomMaker(this._po.marginright/2-this._po.snow[i][0].size)
				} else if (this.options.snowingzone == 3) {
					this._po.snow[i][0].posx = this._randomMaker(this._po.marginright/2-this._po.snow[i][0].size) + this._po.marginright/4
				} else if (this.options.snowingzone == 4) {
					this._po.snow[i][0].posx = this._randomMaker(this._po.marginright/2-this._po.snow[i][0].size) + this._po.marginright/2
				}
				
				this._po.snow[i][0].posy = this._randomMaker(6*this._po.marginbottom-this._po.marginbottom-6*this._po.snow[i][0].size);
				this._po.snow[i].css("left", this._po.snow[i].posx);
				this._po.snow[i].css("top", this._po.snow[i].posy);
			}
			
			this._moveSnow();
		},
		_moveSnow: function () {
			var self = this, i;
			for (i = 0; i <= this.options.snowmax; i++) {
				this._po.crds[i] += this._po.x_mv[i];
				this._po.snow[i][0].posy += this._po.snow[i][0].sink;
				this._po.snow[i].css("left", this._po.snow[i][0].posx + this._po.lftrght[i]*Math.sin(this._po.crds[i]));
				this._po.snow[i].css("top", this._po.snow[i][0].posy);
				
				if (this._po.snow[i][0].posy >= this._po.marginbottom-6*this._po.snow[i][0].size || parseInt(this._po.snow[i][0].style.left) > (this._po.marginright-3*this._po.lftrght[i])) {
					if (this.options.snowingzone == 1) {
						this._po.snow[i][0].posx = this._randomMaker(this._po.marginright - this._po.snow[i][0].size)
					} else if (this.options.snowingzone == 2) {
						this._po.snow[i][0].posx = this._randomMaker(this._po.marginright/2-this._po.snow[i][0].size)
					} else if (this.options.snowingzone == 3) {
						this._po.snow[i][0].posx = this._randomMaker(this._po.marginright/2-this._po.snow[i][0].size) + this._po.marginright/4
					} else if (this.options.snowingzone == 4) {
						this._po.snow[i][0].posx = this._randomMaker(this._po.marginright/2-this._po.snow[i][0].size) + this._po.marginright/2
					}
					
					this._po.snow[i][0].posy = 0
				}
			}
			
			this._po.timer = setTimeout(function () {
				self._moveSnow();
			}, 50);
		},
		_setOption: function (key, value) {
            this.options[key] = value;
        },
        destroy: function () {
        }
    });
})(jQuery);