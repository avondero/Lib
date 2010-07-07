/*--------------------------------------------------------------------------*
 *
 *  Defil JavaScript, version 1.0
 *  Copyright (c) 2010 T@nu$
 *
 *  Defil is freely distributable under the terms of an MIT-style license.
 *  
 *
 *--------------------------------------------------------------------------*/

if(typeof(Prototype) == "undefined"){
    throw "Defil requires Prototype to be loaded.";
}
else
{
	var Defil = Class.create({
		initialize: function(target,listURLImages) {
			var options = Object.extend({
				withEffect: true,
				indexFirstImage: 0,
				interval: 1,
				width: '',
				height: '',
				start: false,
				style: {},
				id: 'imageDefil',
				asc: true,
				goToBlind: false,
				loop: false
			}, arguments[2] || {});
			
			options.interval = (options.interval > 1 || options.interval == 0)?options.interval:1;
			this.isRunning = false;
			this.options = options;
			
			
			if(this.options.withEffect && this.options.goToBlind){
				Effect.BlindLeft = function(element) {
					element = $(element);
					element.makeClipping();
					return new Effect.Scale(element, 0,
						Object.extend({ scaleContent: false,
							scaleY: false,
							scaleMode: 'box',
							scaleContent: false,
							restoreAfterFinish: true,
							afterSetup: function(effect) {
								effect.element.makeClipping().setStyle({
									height: effect.dims[0] + 'px'
								}).show();
							},
							afterFinishInternal: function(effect) {
								effect.element.hide().undoClipping();
							}
						}, arguments[1] || { })
					);
				};
				
				Effect.BlindRight = function(element) {
					element = $(element);
					var elementDimensions = element.getDimensions();
					return new Effect.Scale(element, 100, Object.extend({
						scaleContent: false,
						scaleY: false,
						scaleFrom: 0,
						scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
						restoreAfterFinish: true,
						afterSetup: function(effect) {
							effect.element.makeClipping().setStyle({
								width: '0px',
								height: effect.dims[0] + 'px',
								float: 'right'
							}).show();
						},
						afterFinishInternal: function(effect) {
							effect.element.undoClipping().setStyle({
								float: 'none'
							});
						}
					}, arguments[1] || { }));
				};
				
				$w('blindLeft blindRight').each(
					function(effect) {
						Effect.Methods[effect] = function(element, options){
							element = $(element);
							Effect[effect.charAt(0).toUpperCase() + effect.substring(1)](element, options);
							return element;
						};
					}
				);
				
				Element.addMethods(Effect.Methods);
			
			}
			
			
			this.target = $(target);
			this.target.setStyle({
				height: this.options.height + 'px',
				width: this.options.width + 'px'
			});
			
			this.listImages = $(listURLImages).collect(function(url){
				return (function(){
					var i = new Image();
					i.src = url;
					return i
					})();
			});
			
			this.img = new Element('img', {
				id: this.options.id,
				src: this.listImages[this.options.indexFirstImage].src,
				index: this.options.indexFirstImage,
			});
			this.setTaille(this.listImages[this.options.indexFirstImage]);
			this.img.setStyle(this.options.imageStyle);
			this.target.insert(this.img);
			if(this.options.interval && this.options.start){
				this.isRunning = true;
				this.timer = new PeriodicalExecuter(this.suivant.bind(this), this.options.interval);
			}
		},
		
		suivant: function(){
			if(this.options.withEffect)
				this.img.fade({
					duration: 0.5,
					afterFinish: function(){
						if(this._prec) this.options.asc = !this.options.asc;
						if(this.options.asc){
							this.changeSrcAsc();
						}else{
							this.changeSrcDesc();
						}
						if(this._prec) {
							this.options.asc = !this.options.asc;
							this._prec = null;
						}
						this.img.appear({
							duration: 0.5
						});
					}.bind(this)
				});
			else
				if(this.options.asc){
					this.changeSrcAsc();
				}else{
					this.changeSrcDesc();
				}
		},
		
		precedent: function(){
			this._prec = true;
			this.suivant();
		},
		
		goTo: function(index){
			//console.log('<# Avant Chgt --> ' + this.img.attributes["index"].value + ' #>');
			if(this.options.withEffect)
				new Effect[(this.options.goToBlind)?'BlindLeft':'Fade'](this.img,{
					duration: 0.5,
					afterFinish: function(){
						var i = new Image();
						i.src = this.listImages[index-1].src;
						this.img.src = i.src;
						this.img.attributes["index"].value = index-1;
						this.setTaille(i);
						//console.log('<# Après Chgt --> ' + this.img.attributes["index"].value + ' #>');
						new Effect[(this.options.goToBlind)?'BlindRight':'Appear'](this.img,{
							duration: 0.5
						});
					}.bind(this)
				});
			else{
				var i = new Image();
				i.src = this.listImages[index-1].src;
				this.img.src = i.src;
				this.img.attributes["index"].value = index-1;
				this.setTaille(i);
			}
			
		},
		
		first: function(){
			this.goTo(1);
		},
		
		last: function(){
			this.goTo(this.listImages.length);
		},
		
		changeSrcAsc: function(){
			var i = new Image();
			//console.log('<# Avant Chgt --> ' + this.img.attributes["index"].value + ' #>');
			if(parseInt(this.img.attributes["index"].value) == this.listImages.length - 1){
				if(this.options.loop){
					i.src = this.listImages[0].src;
					this.img.src = i.src
					this.img.attributes["index"].value = 0;
				}else{
					i.src = this.listImages[this.img.attributes["index"].value].src;
					this.img.src = i.src
				}
			}
			else{
				i.src = this.listImages[parseInt(this.img.attributes["index"].value)+1].src;
				this.img.src = i.src;
				this.img.attributes["index"].value = parseInt(this.img.attributes["index"].value) + 1;
			};
			this.setTaille(i);
			//console.log('<# Après Chgt --> ' + this.img.attributes["index"].value + ' #>');

		},
		
		changeSrcDesc: function(){
			var i = new Image();
			//console.log('<# Avant Chgt --> ' + this.img.attributes["index"].value + ' #>');
			if(parseInt(this.img.attributes["index"].value) == 0){
				if(this.options.loop){
					i.src = this.listImages[this.listImages.length - 1].src;
					this.img.src = i.src;
					this.img.attributes["index"].value = this.listImages.length - 1;
				}else{
					i.src = this.listImages[this.img.attributes["index"].value].src;
					this.img.src = i.src
				}
			}
			else{
				i.src = this.listImages[parseInt(this.img.attributes["index"].value)-1].src;
				this.img.src = i.src;
				this.img.attributes["index"].value = parseInt(this.img.attributes["index"].value) - 1;
			};
			this.setTaille(i);
			//console.log('<# Après Chgt --> ' + this.img.attributes["index"].value + ' #>');
	
		},
		
		setTaille: function(i){
			
			this.img.width = i.width;
			this.img.height = i.height;
			
			var wt = this.target.getWidth();
			var ht = this.target.getHeight();
			
			if(i.width > wt) {
				this.img.width = wt;
				this.img.height = (wt/i.width)*i.height;
			}
			
			if(i.height > ht) {
				this.img.height = ht;
				this.img.width = (ht/i.height)*i.width;
			}
		},

		start: function(){
			if(this.isRunning){
				throw 'The timer is already running';
				return;
			}
			if(!this.timer){
				if(!this.options.interval || !this.options.loop){
					throw 'The timer cannot start';
					return;
				}
				this.isRunning = true;
				this.timer = new PeriodicalExecuter(this.suivant.bind(this), this.options.interval);
			}else{
				this.isRunning = true;
				this.timer.registerCallback();
			}
		},
		
		stop: function(){
			if(!this.timer){
				throw 'The option interval == 0';
				return;
			}
			this.isRunning = false;
			this.timer.stop();
		}
		
	});
	
	Defil.Version = '1.0';
}