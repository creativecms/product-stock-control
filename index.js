;(function($) {
    'use strict';
    $.productStockControl = function(options) {
        
        var settings = $.extend({}, {
            attr: 'data-product-stock-control',
            quantityAttr: 'data-product-stock-control--quantity',
            quantityHiddenClassName: 'hidden',
            disabledAttr: 'data-product-stock-control--disabled',
            singularLabel: 'item left',
            pluralLabel: 'items left',
            outOfStockMessage: '<span class="label label-danger">Out of stock</span>'
        }, options);
        
        var els = document.querySelectorAll('[' + settings.attr + ']');
        var productIds = [];
        
        disableElements();
        setProductIds();
        updateQuantities();
        setInterval(function() {
            updateQuantities();
        }, 3000);
        
        function setProductIds() {
            els.forEach(function(el) {
                var productId = parseInt(el.getAttribute(settings.attr));
                productIds.push(productId);
            });
        }
        
        function disableElements() {
            $('[' + settings.disabledAttr + ']').attr('disabled', true);
        }
        
        function updateQuantities() {
            var url = '/controller/product/quantity?' + $.param({
                productIds: productIds
            });
            $.get(url, function(items) {
                els.forEach(function(el) {
                    var productId = parseInt(el.getAttribute(settings.attr));
                    items.forEach(function(obj) {
                        if (obj.id === productId) {
                            var msg = obj.quantity ? obj.quantity + ' ' + (obj.quantity === 1 ? settings.singularLabel : settings.pluralLabel) : settings.outOfStockMessage;
                            $(el).find('[' + settings.quantityAttr + ']').removeClass(settings.quantityHiddenClassName).html(msg);
                            if (obj.quantity) {
                                $(el).find('[' + settings.disabledAttr + ']').attr('disabled', false);
                            }
                        }
                    });
                });
            });
        }
    };
})(jQuery);