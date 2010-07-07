/*--------------------------------------------------------------------------*
 *
 *  Tooltip JavaScript, version 1.0
 *  Copyright (c) 2010 T@nu$
 *
 *  Tooltip is freely distributable under the terms of an MIT-style license.
 *  
 *  To use it :
 *  	1) include this script on your page
 *  	2) insert this element somewhere in your page
 *       	<div id="<your_id>"></div> (in this case put the option 'tooltipExtern' to true and put an id to the option 'idTooltip')
 *			or let do the script.
 *		4) the end.
 *  
 *  Hook list : target-> bottomMid, topMid, leftMid, rightMid, rightUp, leftUp, bottomLeft, bottomRight, center.
 *  			tip -> inside, outside.
 *  
 *
 *--------------------------------------------------------------------------*/

if(typeof(Prototype) == "undefined")
    throw "Tooltip requires Prototype to be loaded.";
else
{
	var Tooltip = Class.create({
		initialize: function(target) {
			var options = Object.extend({
				tooltipExtern: false,
				idTooltip: false,
				nameClass: false,
				content: "",
				autoStart: true,
				mouseFollow: false,
				mouseFollowLeft: false,
				opacity: .9,
				maxWidth: 200,
				width: 200,
				zindex: 1000,
				textAlign: 'center',
				hook: {target:'', tip: ''}
			}, arguments[1] || {});
			
			this.target = $(target);
			this.target.wrap('span', {id: this.target.id + '_around'});
			$(this.target.id + '_around').setStyle({width: this.target.getWidth()+'px'});
			this.options = options;
			if(this.options.tooltipExtern) $(this.options.idTooltip).hide();
			this.initialized = false;
			this.created = false;
			this.enabled = false;
			
			if(this.options.autoStart)
				this.enable();
		},
		
		setOptions: function(options){
			this.options = Object.extend(this.options, options);
			if(!this.options.mouseFollow)
					this.tooltipPosition();
		},
		
		setHook: function(hook){
			this.options.hook = Object.extend(this.options.hook, hook);
			if(!this.options.mouseFollow)
					this.tooltipPosition();
		},
		
		setContent: function(content){
			this.tooltip.update(content);
			if(!this.options.mouseFollow)
					this.tooltipPosition();
		},
		
		tooltipPosition: function(){
			var hookTarget = this.options.hook.target;
			var hookTip = this.options.hook.tip;
						
			var tooltipWidth = this.tooltip.getWidth();
			var tooltipHeight = this.tooltip.getHeight();
			
			
			var targetWidth = this.target.getWidth();
			var targetHeight = this.target.getHeight();
			var targetTop = this.target.cumulativeOffset().top;
			var targetLeft = this.target.cumulativeOffset().left;
			
			
			if(hookTarget == 'bottomMid'){
				this.tooltip.style.left = targetLeft + targetWidth/2 - tooltipWidth/2 + 'px';
				if(hookTip == 'inside')
					this.tooltip.style.top = targetTop + targetHeight - tooltipHeight+ 'px';
				else
					this.tooltip.style.top = targetTop + targetHeight + 'px';
			}
			else
			if(hookTarget == 'topMid'){
				this.tooltip.style.left = targetLeft + targetWidth/2 - tooltipWidth/2 + 'px';
				if(hookTip == 'inside')
					this.tooltip.style.top = targetTop + 'px';
				else
					this.tooltip.style.top = targetTop - tooltipHeight + 'px';
			}
			else
			if(hookTarget == 'leftMid'){
				this.tooltip.style.top = targetTop + targetHeight/2 - tooltipHeight/2 + 'px';
				if(hookTip == 'inside')
					this.tooltip.style.left = targetLeft + 'px';
				else
					this.tooltip.style.left = targetLeft - tooltipWidth + 'px';
			}
			else
			if(hookTarget == 'rightMid'){
				this.tooltip.style.top = targetTop + targetHeight/2 - tooltipHeight/2 + 'px';
				if(hookTip == 'inside')
					this.tooltip.style.left = targetLeft + targetWidth - tooltipWidth + 'px';
				else
					this.tooltip.style.left = targetLeft + targetWidth + 'px';
			}
			else
			if(hookTarget == 'rightUp'){
				if(hookTip == 'inside')
					this.tooltip.style.top = targetTop + 'px';
				else
					this.tooltip.style.top = targetTop - tooltipHeight + 'px';
				this.tooltip.style.left = targetLeft + targetWidth - tooltipWidth + 'px';
			}
			else
			if(hookTarget == 'leftUp'){
				if(hookTip == 'inside')
					this.tooltip.style.top = targetTop + 'px';
				else
					this.tooltip.style.top = targetTop - tooltipHeight + 'px';
				this.tooltip.style.left = targetLeft + 'px';
			}
			else
			if(hookTarget == 'bottomLeft'){
				if(hookTip == 'inside')
					this.tooltip.style.top = targetTop + targetHeight - tooltipHeight+ 'px';
				else
					this.tooltip.style.top = targetTop + targetHeight + 'px';
				this.tooltip.style.left = targetLeft + 'px';
			}
			else
			if(hookTarget == 'bottomRight'){
				this.tooltip.style.left = targetLeft + targetWidth - tooltipWidth + 'px';
				if(hookTip == 'inside')
					this.tooltip.style.top = targetTop + targetHeight - tooltipHeight+ 'px';
				else
					this.tooltip.style.top = targetTop + targetHeight + 'px';
			}
			else
			if(hookTarget == 'center'){
				this.tooltip.style.left = targetLeft + targetWidth/2 - tooltipWidth/2 + 'px';
				this.tooltip.style.top = targetTop + targetHeight/2 - tooltipHeight/2 + 'px';
				
			}
			else{
				this.tooltip.style.top = targetTop + targetHeight + 'px';
				this.tooltip.style.left = targetLeft + 'px';
			}
			
		},

		enable: function(){
			this.mouse_over = this.show.bindAsEventListener(this);
			this.mouse_out = this.hide.bindAsEventListener(this);
			this.mouse_move = this.update.bindAsEventListener(this);
			$(this.target.id + '_around').observe("mouseover", this.mouse_over);
			$(this.target.id + '_around').observe("mouseout", this.mouse_out);
			this.enabled = true;
			
		},
		
		disable: function(){
			$(this.target.id + '_around').stopObserving("mouseover", this.mouse_over);
			$(this.target.id + '_around').stopObserving("mouseout", this.mouse_out);
			this.enabled = false;
		},
		
		toggleTooltip: function(){
			if(this.enabled)
				this.disable();
			else
				this.enable();
		},
		
		createTooltip: function(){
			if(!this.options.tooltipExtern)
			{
				this.tooltip = new Element('div', {
					id: (this.options.idTooltip)?this.options.idTooltip:''
					});
				this.tooltip.addClassName((this.options.nameClass)?this.options.nameClass:'');
				this.tooltip.innerHTML = this.options.content;
				if(!(this.options.idTooltip && this.options.nameClass))
					this.tooltip.setStyle({color: '#FFFFFF', backgroundColor: "#000000"});
					
				this.tooltip.setStyle({
					paddingLeft: "10px",
					paddingRight: "10px",
					position: 'absolute',
					left: 0,
					top: 0,
					textAlign: this.options.textAlign,
					display: 'none',
					zIndex: 1000,
					width: this.options.width + 'px'
				});
				
				if(Prototype.Browser.Opera)
					this.tooltip.setStyle({'borderRadius': '5px'});
				else if(Prototype.Browser.WebKit)
					this.tooltip.setStyle({'borderRadius': '5px'});
				else
					this.tooltip.setStyle({ MozBorderRadius: '5px 5px 5px 5px'});
				
				
				this.tooltip.setOpacity(this.options.opacity);
				$$('body')[0].insert(this.tooltip);
				if(this.tooltip.getWidth() > this.options.maxWidth)
					this.tooltip.setStyle({width: this.options.maxWidth+ 'px'})
				if(!this.options.mouseFollow)
					this.tooltipPosition();
					
				this.created = true;
			}
			else
			{
				if(!this.options.idTooltip){
					throw "The option : idTooltip is required!"
					return;
				}
				this.tooltip = $(this.options.idTooltip);
				this.tooltip.hide();
				this.tooltip.setStyle({position: 'absolute'})
				$$('body')[0].insert(this.tooltip);
				if(this.tooltip.getWidth() > this.options.maxWidth)
					this.tooltip.setStyle({width: this.options.maxWidth+ 'px'})
				if(!this.options.mouseFollow)
					this.tooltipPosition();
				
				this.created = true;
			}
		},
		
		show: function(event){
			event.stop();
			
			
			if(!this.created)
				this.createTooltip();
			if(this.options.mouseFollow)
				$(this.target.id + '_around').observe("mousemove", this.mouse_move);
				
				
			this.tooltip.show();
			this.initialized = true;
		},
		
		hide: function(){
			if(this.initialized){
				if(this.options.mouseFollow)
					$(this.target.id + '_around').stopObserving("mousemove", this.mouse_move);
				this.tooltip.hide();
			}
			this.initialized = false;
		},
		
		update: function(event){
			this.xCord = Event.pointerX(event);
			this.yCord = Event.pointerY(event);
			if(!this.options.mouseFollowLeft)
				if(Prototype.Browser.IE)
					if( this.xCord  + this.tooltip.getWidth() > document.body.clientWidth - 2)
						this.tooltip.style.left = this.xCord - this.tooltip.getWidth() + "px";
					else
						this.tooltip.style.left = this.xCord + "px";
				else
					if( this.xCord  + this.tooltip.getWidth() > innerWidth - 2)
						this.tooltip.style.left = this.xCord - this.tooltip.getWidth() + "px";
					else
						this.tooltip.style.left = this.xCord + "px";
			else
				if(this.xCord < this.tooltip.getWidth())
					this.tooltip.style.left = this.xCord + "px";
				else
					this.tooltip.style.left = this.xCord - this.tooltip.getWidth() + "px";
			this.tooltip.style.top = this.yCord - this.tooltip.getHeight() - 2 + "px";
		},
		
		destroy: function(){
			this.tooltip.remove();
		}
	});
	
	Tooltip.Version = '1.0';
}