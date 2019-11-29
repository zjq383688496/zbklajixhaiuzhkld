(function(g) {

g.VM = {
	el: '#vApp',
	data: {
	}
}
g.WD = {
	__getClass: function(obj) {
		return Object.prototype.toString.call(obj).slice(8, -1)
	},
	// Object继承
	extend: function(org, obj) {
		var me = this
		for (var v in obj) {
			if (!org[v]) {
				org[v] = obj[v]
			} else {
				var typeO = me.__getClass(org[v]),
					typeN = me.__getClass(obj[v])
				if (typeO === typeO && typeO === 'Object') {
					me.extend(org[v], obj[v])
				} else {
					org[v] = obj[v]
				}
			}
		}
		return org
	},
	merge: function(org, now) {
		for (var v in org) {
			if (org[v]) now[v] = org[v]
		}
	}
}

}(window));
