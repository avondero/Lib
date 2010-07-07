﻿var Cookies = Class.create({
    initialize: function(path, domain) {
        this.path = path || '/';
        this.domain = domain || null;
    },
	
    // Sets a cookie
    set: function(key, value, days) {
			if (typeof(key) != 'string') {
				throw "Invalid key";
				return;
			}
			if (typeof(value) != 'string' && typeof value != 'number') {
				throw "Invalid value";
				return;
			}
			if (days && typeof(days) != 'number') {
				throw "Invalid expiration time";
				return;
			}			
			var setValue = key+'='+escape(new String(value));
			if (days){
				var date = new Date();
				date.setTime(date.getTime() + (days*24*60*60*1000));
				var setExpiration = "; expires="+date.toGMTString();
			} 
			else 
				var setExpiration = "";
			var setPath = '; path=' + escape(this.path);
			var setDomain = (this.domain) ? ('; domain=' + escape(this.domain)) : '';
			var cookieString = setValue + setExpiration + setPath + setDomain;
			document.cookie = cookieString;
    },
	
    // Returns a cookie value or false
    get: function(key) {
			var keyEquals = key+"=";
	
			var value = false;
	
			document.cookie.split(';').invoke('strip').each(function(s){
				if (s.startsWith(keyEquals)) {
					value = unescape(s.substring(keyEquals.length, s.length));
					throw $break;
				}
			});
			return value;
    },
	
    // Clears a cookie
    clear: function(key) {
       this.set(key,'',-1);
    },
	
    // Clears all cookies
    clearAll: function() {
			document.cookie.split(';').collect(function(s){
					return s.split('=').first().strip();
			}).each(function(key){
					this.clear(key);
			}.bind(this));
    }
	
});

Cookies.Version = '1.0';