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
   * @param s the string
   * @returns string escaped
   */
  function escapeXML(s) {
    var replace = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', '\'': 'apos' };

    for (var entity in replace ) {
      s = s.replace(new RegExp(entity, 'g'), '&' + replace[entity] + ';');
    }
    return s;
  }
  
  /**
   * Generic map function
   * @param array the array to be mapped
   * @param callback the callback function(element) 
   * @returns array
   */
  function map(array, callback) {
    var mapped = new Array;
    for(var i in array) {
      var value = callback.call(this, array[i], i);
      if (value !== null) mapped.push(value);
    }
    return mapped;
  }

  /**
   * Utility method for creating a tag
   * @param name the tag name, e.g., 'text'
   * @param attrs the attribute string, e.g., name1="val1" name2="val2"
   * @param content the content string inside the tag
   * @returns string
   */
  function tag(name, attrs, content) {
    return '<' + name + ' ' + attrs + '>' +  content + '</' + name + '>';
  }

  /**
   * @return object the style object
   */
  function extractStyle(node) {
    return {
      font : {
        family : node.attrs.font.replace(/^.*?"(\w+)".*$/, '$1'),
        size : typeof node.attrs['font-size'] === 'undefined' ? null : node.attrs['font-size']
      }
    };
  }
  
  /**
   * @param style object from style()
   * @return string
   */
  function style2string(style) {
    // TODO figure out what is 'normal'
    return "font: normal normal normal 10px/normal " + style.font.family
      +  (style.font.size === null ? '' : '; font-size: ' + style.font.size + "px")
      ;
  }
  
  /**
   * Computes tspan dy using font size. This formula was empircally determined 
   * using a best-fit line. Works well in both VML and SVG browsers.
   * @param fontSize number
   * @return number
   */
  function computeTSpanDy(fontSize) {
    if (fontSize === null) {
      fontSize = 10;
    }
    return fontSize * 4.5 / 13;
  }
  
  var serializer = {
    'text' : function(node) {
        style = extractStyle(node);
        return tag(
          'text',
          
          'style="text-anchor: middle; ' + style2string(style) + ';" ' + map(node.attrs, function(value, name) {
            if (name === 'text' || name === 'w' || name == 'h' ) return null;
            if (name === 'font-size') value = value + 'px';
              
            return name + '="' + escapeXML(value.toString()) + '"';
          }).join(' '),
          
          tag('tspan', 'dy="' + computeTSpanDy(style.font.size) + '"', node.attrs['text'])
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
			if (typeof serializer[node.type] === 'function') {
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
