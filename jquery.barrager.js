// 弹幕
	+function($){
		'use strict';
		// BARRAGE CLASS DEFINITION
	
		/**
		 * @param {[Object]} {options}
		 *		{[Number]} [animDuration] 动画持续时间
		 *		{[Object]} [position] 弹幕出现位置 数组里面是百分数
		 *		{[Number]} [minNum] 弹幕出现最小条数
		 *		{[Number]} [maxNum] 弹幕最大条数
		*/
		var Barrage = function(element, tpls, options){
			this.$element  = $(element);
			this.tpls = tpls;
			this.options = $.extend({}, Barrage.defaults, options);
			this.animDuration = this.options.animDuration;
			this.position = this.options.position;
			this.minNum = this.options.minNum;
			this.maxNum = this.options.maxNum;
			this.maxInterval = this.animDuration / (this.minNum + 2);
			this.minInterval = this.animDuration / (this.maxNum + 2);
			this.len = this.tpls.length
			this.randPos = Math.floor(Math.random() * this.len);
			this.index = this.randPos;
			// 弹幕出现区域数
			var keys = [];
			for(var key in this.position){
				keys.push(key);
			}
			this.secNum = keys.length;
			/* '<li class="item">' + 
					'<img src="img/bugle.png" class="bugle" alt="喇叭">恭喜<span>'
					+ '纸哥' + '</span>获得<span>'
					+ 'iPhone7一部' + '</span>，一起为TA鼓掌！</li>'*/
			this.$barrage = this.$element.find(".barrage");
		};
		Barrage.defaults = {
			animDuration: 25000, //动画持续时间，单位：ms
			position: {          // 弹幕出现位置
				"section1": [18, 30],
				"section2": [66, 80]
			},
			minNum: 3,    //弹幕最小条数
			maxNum: 5,	  //弹幕最大条数
		};

		Barrage.prototype = {
			roll: function(){
				this.interval = Math.floor(Math.random() * (this.maxInterval - this.minInterval + 1) + this.minInterval);
				var randSec = Math.floor(Math.random() * this.secNum + 1)
				, positionSec = this.position["section" + randSec]
				, randTop = Math.floor(Math.random() * (positionSec[1] - positionSec[0] + 1) + positionSec[0])
				, $item = $(this.tpls[this.index])
				;
				if(this.randPos == 0) this.randPos = this.len;
				if(this.index !== this.randPos - 1 ){
					// ++index;
					if(++this.index >= this.len){
						this.index = 0;
					}
				}else{
					this.index = this.randPos = Math.floor(Math.random() * this.len);
				}				
				$item.css("top", randTop + "%");
				this.$barrage.append($item);
				$item.animate({"left": "-100%"}, this.animDuration, "linear", function(){
					$(this).remove();
				});
			},
			repeatRoll: function(){
				this.roll();
				var timer = setInterval($.proxy(function(){
					this.roll();
				}, this), this.interval);
			}
		};
		$.ajax({
			url:'./do.php',
			type:'post',
			data:{act:'info'},
			dataType:'json',
			success:function(data){
				var tpls=[],len=data.length;
				for(var i=0; i<len; i++){
					tpls.push('<li class="item"><img src="img/bugle.png" class="bugle" alt="喇叭">恭喜<span>'+ data[i].name + '</span>获得<span>'+ data[i].cname + '</span>，一起为TA鼓掌！</li>');
				}
			
				var barrage = new Barrage(".banner",tpls);
				barrage.repeatRoll();
			}
		});
	}(jQuery);	