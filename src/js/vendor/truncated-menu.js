;
(function($, window, undefined) {

    var pluginName = 'truncatedMenu',
        document = window.document,
        defaults = {
            visibleItems: "",
            hiddenItems: "",
            moreItem: ""
        };

    function Plugin(element, options) {
        this.element = element;

        this.settings = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function() {
            var truncate = this.getTruncate();

            truncate();
            $(window).resize(truncate);
        },
        getTruncate: function() {
            var $list = $(this.element),
                $moreItem = $(this.settings.moreItem),
                $hiddenList = $moreItem.children('ul'),
                $hiddenItems = $(this.settings.hiddenItems).add($hiddenList.children('li')),
                $visibleItems = $(this.settings.visibleItems).add($moreItem),
                visibleItemsWidth = 0,
                listItems = [];

            if ($list.length === 0) {
                return false;
            }

            if ($moreItem.length === 0) {
                $moreItem = $('li[class="menu-item-more"]').appendTo($list);
            }

            if ($hiddenList.length === 0) {
                $hiddenList = $('ul').appendTo($moreItem);
            }

            // get list items and widths
            $list.children('li').not($hiddenItems).each(function() {
                listItems.push({
                    element: this,
                    $element: $(this),
                    width: $(this).outerWidth(true) + 1 // buffer against rounding errors
                });
            });

            // get required visible items width
            $visibleItems.each(function() {
                visibleItemsWidth += $(this).outerWidth(true);
                // console.log($(this).text() + " = " + $(this).outerWidth(true));
            });

            if ($hiddenList.children().length === 0) {
                $moreItem.addClass('hide');
            }

            return function() {
                var listWidth = $list.width(),
                    visible = [],
                    hidden = [],
                    sum = visibleItemsWidth;

                console.log("sum = " + sum);

                for (var i = 0; i < listItems.length; i++) {
                    var listItem = listItems[i].element,
                        $listItem = listItems[i].$element,
                        listItemWidth = listItems[i].width;

                    if (!$listItem.is($visibleItems)) {
                        sum += listItemWidth;
                    }

                    if (sum < listWidth || $listItem.is($visibleItems)) {
                        visible.push(listItem);
                        if (!$listItem.is($visibleItems)) {
                            console.log("+ " + listItemWidth + " (" + $listItem.text() + ")" + " = " + sum + " < " + listWidth);
                        }
                    } else {
                        hidden.push(listItem);
                    }
                }

                $hiddenItems.each(function() {
                    hidden.push(this);
                });

                if (hidden.length > 0) {
                    $moreItem.removeClass('hide');
                } else {
                    $moreItem.addClass('hide');
                }

                $list.empty().append(visible);
                $hiddenList.empty().append(hidden);
            };
        }
    });

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

}(jQuery, window));