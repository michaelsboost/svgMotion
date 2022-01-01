jQuery.fn.extend({
  getPath: function() {
    var pathes = [];

    this.each(function(index, element) {
      var path, $node = jQuery(element);

      while ($node.length) {
        var realNode = $node.get(0), name = realNode.localName;
        if (!name) { break; }

        name = name.toLowerCase();
        var parent = $node.parent();
        var sameTagSiblings = parent.children(name);

        if (sameTagSiblings.length > 1)
        {
          var allSiblings = parent.children();
          var index = allSiblings.index(realNode) + 1;
          if (index > 0) {
            name += ':nth-child(' + index + ')';
          }
        }

        path = name + (path ? ' > ' + path : '');
        $node = parent;
      }

      pathes.push(path);
    });

    return pathes.join(',');
  }
});