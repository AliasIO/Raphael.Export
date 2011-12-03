/**
 * Raphael.Export https://github.com/ElbertF/Raphael.Export
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function(R) {
	/**
	* Escapes string for XML interpolation
	* @param value string or number value to escape
	* @returns string escaped
	*/
	function escapeXML(s) {
		if ( typeof s === 'number' ) return s.toString();

		var replace = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', '\'': 'apos' };

		for ( var entity in replace ) {
			s = s.replace(new RegExp(entity, 'g'), '&' + replace[entity] + ';');
		}

		return s;
	}

	/**
	* Generic map function
	* @param iterable the array or object to be mapped
	* @param callback the callback function(element, key)
	* @returns array
	*/
	function map(iterable, callback) {
		var mapped = new Array;

		for ( var i in iterable ) {
			if ( iterable.hasOwnProperty(i) ) {
				var value = callback.call(this, iterable[i], i);

				if ( value !== null ) mapped.push(value);
			}
		}

		return mapped;
	}

	/**
	* Generic reduce function
	* @param iterable array or object to be reduced
	* @param callback the callback function(initial, element, i)
	* @param initial the initial value
	* @return the reduced value
	*/
	function reduce(iterable, callback, initial) {
		for( var i in iterable) {
			if ( iterable.hasOwnProperty(i) ) {
				initial = callback.call(this, initial, iterable[i], i);
			}
		}

		return initial;
	}

	/**
	* Utility method for creating a tag
	* @param name the tag name, e.g., 'text'
	* @param attrs the attribute string, e.g., name1="val1" name2="val2"
	* or attribute map, e.g., { name1 : 'val1', name2 : 'val2' }
	* @param content the content string inside the tag
	* @returns string of the tag
	*/
	function tag(name, attrs, content) {
		if ( typeof attrs === 'object' ) {
			attrs = map(attrs, function(element, name) {
				return name + '="' + escapeXML(element) + '"';
			}).join(' ');
		}

		return '<' + name + ' ' + attrs + '>' +  content + '</' + name + '>';
	}

	/**
	* @return object the style object
	*/
	function extractStyle(node) {
		return {
			font: {
				family: node.attrs.font.replace(/^.*?"(\w+)".*$/, '$1'),
				size:   typeof node.attrs['font-size'] === 'undefined' ? null : node.attrs['font-size']
				}
			};
	}

	/**
	* @param style object from style()
	* @return string
	*/
	function styleToString(style) {
		// TODO figure out what is 'normal'
		return 'font: normal normal normal 10px/normal ' + style.font.family + ( style.font.size === null ? '' : '; font-size: ' + style.font.size + 'px' )
		;
	}

	/**
	* Computes tspan dy using font size. This formula was empircally determined
	* using a best-fit line. Works well in both VML and SVG browsers.
	* @param fontSize number
	* @return number
	*/
	function computeTSpanDy(fontSize) {
		if ( fontSize === null ) fontSize = 10;

		return fontSize * 4.5 / 13;
	}

	var serializer = {
		'text': function(node) {
			style = extractStyle(node);

			return tag(
				'text',
				reduce(
					node.attrs,
					function(initial, value, name) {
						if ( name !== 'text' && name !== 'w' && name !== 'h' ) {
							if ( name === 'font-size') value = value + 'px';

							initial[name] = value.toString();
						}

						return initial;
					},
					{ style: 'text-anchor: middle; ' + styleToString(style) + ';' }
					),
				tag('tspan', { dy: computeTSpanDy(style.font.size) }, node.attrs['text'])
				);
		}
		// Other serializers should go here
	};

	R.fn.toSVG = function() {
		var
			paper = this,
			svg   = '<svg style="overflow: hidden; position: relative;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + paper.width + '" version="1.1" height="' + paper.height + '">'
			;

		for ( var node = paper.bottom; node != null; node = node.next ) {
			var attrs = '';

			// Use serializer
			if ( typeof serializer[node.type] === 'function' ) {
				svg += serializer[node.type](node);

				continue;
			}

			switch ( node.type ) {
				case 'image':
					attrs += ' preserveAspectRatio="none"';
					break;
			}

			for ( i in node.attrs ) {
				var name = i;

				switch ( i ) {
					case 'src':
						name = 'xlink:href';

						break;
					case 'transform':
						name = '';

						break;
				}

				if ( name ) {
					attrs += ' ' + name + '="' + escapeXML(node.attrs[i].toString()) + '"';
				}
			}

			svg += '<' + node.type + ' transform="matrix(' + node.matrix.toString().replace(/^matrix\(|\)$/g, '') + ')"' + attrs + '></' + node.type + '>';
		}

		svg += '</svg>';

		return svg;
	};
})(window.Raphael);
