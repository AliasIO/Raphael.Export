/*
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function() {
	Raphael.fn.toSVG = function() {
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
					var attr = node.attrs[i].toString();

					// Escape string for XML interpolation
					var replace = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', '\'': 'apos' };

					for ( entity in replace ) {
						attr = attr.replace(new RegExp(entity, 'g'), '&' + replace[entity] + ';');
					}

					attrs += ' ' + name + '="' + attr + '"';
				}
			}

			svg += '<' + node.type + ' transform="matrix(' + node.matrix.toString().replace(/^matrix\(|\)$/g, '') + ')"' + attrs + '></' + node.type + '>';
		}

		svg += '</svg>';

		return svg;
	};
})();
