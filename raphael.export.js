/*
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function() {
  /**
   * Escape string for XML interpolation
   * @param s the string
   * @returns string escaped
   */
  function escape(s) {
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
      value = callback.call(this, array[i], i);
      if (value !== null) mapped.push(value);
    }
    return mapped;
  }

  /**
   * Creates a tag
   * @param name the tag name, e.g., 'text'
   * @param attrs the attribute string, e.g., 'name="val1"'
   * @param content the content string inside the tag
   * @returns string
   */
  function tag(name, attrs, content) {
    return '<' + name + ' ' + attrs + '>' +  content + '</' + name + '>';
  }
  
  /**
   * Generic SVG element serializer
   * Correctly tested with text and tspan elements
   * @param node the Raphael SVGElement
   * @return string the serialized XML
   */
  function generic_svg_serializer(node, i) {
    if (typeof node.nodeName === 'undefined') {
      return null;
    }
    if (node.nodeName === '#text') {
      return node.nodeValue;
    }
    
    var attrs =  map(node.attributes, function(attribute, i) {
      if (i.match(/\d+/) === false || attribute.value === undefined) return null;
      return attribute.name + '="' + escape(attribute.value) + '"';
    }).join(' ');
    
    return tag(node.nodeName, attrs, map(node.childNodes, generic_svg_serializer));
  }
  
  function vml_serializer(node) {
    if (node.type === 'text') {
      return tag(
        'text',
        map(node.attrs, function(value, name) {
          if (name === 'text' || name === 'w' || name == 'h' ) return null;
          return name + '="' + escape(value.toString()) + '"';
        }).join(' '),
        tag('tspan', '', node.attrs['text'])
      );
    }
  }
  
	Raphael.fn.toSVG = function() {
		var
			paper = this,
			svg   = '<svg style="overflow: hidden; position: relative;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + paper.width + '" version="1.1" height="' + paper.height + '">'
			;

		for ( var node = paper.bottom; node != null; node = node.next ) {
		  if (node.type === 'text') {
		    svg += Raphael.svg === true ? generic_svg_serializer(node.node) : vml_serializer(node);
		    continue;
		  }
		  
			var attrs = '';

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
					attrs += ' ' + name + '="' + escape(node.attrs[i].toString()) + '"';
				}
			}

			svg += '<' + node.type + ' transform="matrix(' + node.matrix.toString().replace(/^matrix\(|\)$/g, '') + ')"' + attrs + '></' + node.type + '>';
		}

		svg += '</svg>';

		return svg;
	};
})();
