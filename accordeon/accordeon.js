/*--------------------------------------------------------------------------*
 *
 *  Accordeon JavaScript, version 1.0
 *  Copyright (c) 2010 T@nu$
 *
 *  Accordeon is freely distributable under the terms of an MIT-style license.
 *  
 *  
 *
 *--------------------------------------------------------------------------*/

if(typeof(Prototype) == "undefined")
    throw "Accordeon requires Prototype to be loaded.";
else
{

	Element.addMethods('li', {
		accordeonOuvert: function(element){
			element.setStyle({
				background: 'rgba(42,33,28,0.8) url(images/alert-overlay.png) repeat-x',
				border: '1px solid #424242',
				MozBorderRadius: '5px 5px 0px 0px',
				'borderRadius': '5px 5px 0px 0px',
				paddingLeft: '15px',
				cursor: 'pointer'
			});
		},
		
		accordeonFerme: function(element){
			element.setStyle({
				background: 'rgba(42,33,28,0.8) url(images/alert-overlay.png) repeat-x',
				border: '1px solid #424242',
				MozBorderRadius: '5px 5px 5px 5px',
				'borderRadius': '5px 5px 5px 5px',
				paddingLeft: '15px',
				cursor: 'pointer'
			});
		}
	});


	var Accordeon = Class.create({
		initialize: function(idList) {
			var options = Object.extend({
				toogle: false,
				width: '',
				height: '',
				classLi: '',
				indexOpen: undefined
			}, arguments[1] || {});
			
			this.options = options;
			
			this.accordeon = $(idList);
			var nbLi = $$('#'+this.accordeon.id+'>li').length;
			
			this.accordeon.setStyle({
				listStyle: 'none',
				width: (this.options.width)? (this.options.width + 'px'):'',
				height: (this.options.height)? (this.options.height + 'px'):''
			});
			
			$$('#'+this.accordeon.id+'>li').invoke('addClassName', 'spanLink');
			$$('#'+this.accordeon.id+'>li').invoke('accordeonFerme');
			
			$$('#'+this.accordeon.id+'>li').each(function(li, index){
				if(li.next() == null || (li.next().id != li.readAttribute('idPanel')))
				{
					var panel = $(li.readAttribute('idPanel'));
					panel.setStyle({
						overflow: 'auto',
						border: '1px solid #424242',
						MozBorderRadius: '0px 0px 5px 5px',
						borderRadius: '0px 0px 5px 5px',
						paddingLeft: '5px',
						height: (options.height)? (options.height - li.getHeight() * nbLi + 'px'):''
					});
					li.insert({after: panel.hide()});
					li.accordeonFerme();
				}
				li.observe('selectstart', function(){
					return false;
				});
				li.observe('click', function(event){
					var nextVisible = this.next().visible();
					$$('#'+this.parentNode.id+'>li').invoke('accordeonFerme');
					$$('#'+this.parentNode.id+'>div').invoke('hide');
					if(options.toggle && nextVisible)
					{
						this.accordeonFerme();
						this.next().hide();
					}
					else
					{
						this.accordeonOuvert();
						this.next().show();
					}
				});
				//console.log(li.next());
			});
			if(this.options.indexOpen-1 < $$('#'+this.accordeon.id+'>div').length)
			{
				$$('#'+this.accordeon.id+'>li')[this.options.indexOpen-1].accordeonOuvert();
				$$('#'+this.accordeon.id+'>div')[this.options.indexOpen-1].show();
			}
			else
				throw 'Index out of bounds';
		}
	});
	
	Accordeon.Version = '1.0';
}
