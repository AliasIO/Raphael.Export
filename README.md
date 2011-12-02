RAPHAEL.EXPORT
=============
Export Raphaël paper objects to SVG. Also works in browsers that don't support SVG.

EXAMPLE
-------

    <script type="text/javascript" src="raphael-min.js"></script>
    <script type="text/javascript" src="raphael.export.js"></script>
    
    <div id="foo"></div>
    <div id="bar"></div>
    
    <script type="text/javascript">
      var paper = Raphael('foo');
      
      var rect = paper
          .rect(50, 40, 50, 50)
          .attr('fill', '#f00')
          .transform('s2')
          .rotate(10)
          ;
      
      var svg = paper.toSVG();
        
  	  document.getElementById('bar').innerHTML = svg;
    </script>
