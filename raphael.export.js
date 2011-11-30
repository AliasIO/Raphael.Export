/*
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function() {
  
// Escapes a string for XML interpolation. See http://stackoverflow.com/a/1091953/139712
// Adapted from underscore.js. See http://documentcloud.github.com/underscore/underscore.js
function escape(string) {
  return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

Raphael.fn['export'] = function() {
	var
		paper = this,
		svg   = '<svg style="overflow: hidden; position: relative;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + paper.width + '" version="1.1" height="' + paper.height + '">'
		;

	for ( var node = paper.bottom; node != null; node = node.next ) {
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
				attrs += ' ' + name + '="' + escape(node.attrs[i]) + '"';
			}

		}

		svg += '<' + node.type + ' transform="matrix(' + node.matrix.toString().replace(/^matrix\(|\)$/g, '') + ')"' + attrs + '></' + node.type + '>';
	}

	svg += '</svg>';

	return svg;
};

})();