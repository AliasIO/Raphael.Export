/*
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

Raphael.fn.export = function() {
	var svg = '<svg style="overflow: hidden; position: relative;" xmlns="http://www.w3.org/2000/svg" width="' + this.width + '" version="1.1" height="' + this.height + '">';

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
			}

			attrs += ' ' + name + '="' + node.attrs[i] + '"';
		}

		svg += '<' + node.type + ' transform="' + node.matrix + '"' + attrs + '></' + node.type + '>';
	}

	svg += '</svg>';

	return svg;
}
