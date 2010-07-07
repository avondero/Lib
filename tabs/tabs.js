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
	Element.addMethods('li', {
				ongletActif: function(element){
					element.removeClassName('ongletPassif');
					element.addClassName('ongletActif');
				},
				
				ongletPassif: function(element){
					element.removeClassName('ongletActif');
					element.addClassName('ongletPassif');
				}
			});
				
	var Tabs = Class.create({
		initialize: function(idListe) {
			this.tabs = $(idListe);
			this.tabs.setStyle({
				listStyle: 'none'
			});

			$A(this.tabs.children).each(function(tab, index){
				
				$(tab.attributes["idPanel"].value).addClassName('panelTab');
				tab.setStyle({
					cssFloat: 'left'
				});
				
				$(tab.attributes["idPanel"].value).hide();
				$(tab.attributes["idPanel"].value).setStyle({
					border: '1px solid white',
					marginTop: '0px',
					textIndent: '0px',
					paddingTop: '1px'
				});
						
				tab.ongletPassif();
				tab.observe("click", function(event){
					$A(this.parentNode.children).each(function(tab){
						var panel = $(tab.attributes["idPanel"].value);
						panel.hide();
						
						tab.ongletPassif();
						tab.setStyle({
							MozBorderRadius: '5px 5px 0px 0px',
							borderRadius: '5px 5px 0px 0px'
						});
					});
					tab.ongletActif();
					$(tab.attributes["idPanel"].value).show();
					var current = this.parentNode.children[index];
					if(current.previous())
						current.previous().setStyle({
							MozBorderRadius: '5px 0px 0px 0px',
							borderRadius: '5px 0px 0px 0px'
						});
					
					if(current.next())
						current.next().setStyle({
							MozBorderRadius: '0px 5px 0px 0px',
							borderRadius: '0px 5px 0px 0px'
						});
				});
			});
						
			this.tabs.children[0].ongletActif();
			this.tabs.children[1].setStyle({
						MozBorderRadius: '0px 5px 0px 0px',
						borderRadius: '0px 5px 0px 0px',
					});
			$(this.tabs.children[0].attributes["idPanel"].value).show();
			
			this.tabs.wrap('div', {id: this.tabs.id + '_headerTabs'});
			if(Prototype.Browser.IE)
			{
				$(this.tabs.id + '_headerTabs').setStyle({
					width: this.tabs.getWidth() + 'px',
					height: this.tabs.firstChild.getHeight() - 1 + 'px'
				});
			}
			else
			{
				$(this.tabs.id + '_headerTabs').setStyle({
					width: this.tabs.getWidth() + 'px',
					height: this.tabs.firstElementChild.getHeight() - 1 + 'px'
				});
			}
		}
	});
	
	Tabs.Version = '1.0';
	
};