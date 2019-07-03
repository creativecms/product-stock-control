;(function($) {
    'use strict';
    $.productStockControl = function(options) {
        
        var settings = $.extend({}, {
            tableName: 'm_products_products',
            attr: 'data-product-stock-control',
            quantityAttr: 'data-product-stock-control--quantity',
            quantityHiddenClassName: 'hidden',
            disabledAttr: 'data-product-stock-control--disabled',
            hiddenAttr: 'data-product-stock-control--hidden',
            singularLabel: 'item left',
            pluralLabel: 'items left',
            outOfStockMessage: '<span class="label label-danger">Out of stock</span>'
        }, options);
        
        var els = document.querySelectorAll('[' + settings.attr + ']');
        if (els.length === 0) {
            return;
        }
        
        var productIds = [];
        
        setParameterSettings();
        setProductIds();
        disableElements();
        updateQuantities();
        setInterval(function() {
            updateQuantities();
        }, 3000);
        
        function setParameterSettings() {
            var params = {
                tableName: 'data-table-name',
                singularLabel: 'data-singular-label',
                pluralLabel: 'data-plural-label'
            };
            if (els.length) {
                var el = els[0];
                Object.keys(params).map(function(settingName, index) {
                    var attrName = params[settingName];
                    if (el.hasAttribute(attrName)) {
                        settings[settingName] = el.getAttribute(attrName);
                    }
                });
            }
        }
        
        function setProductIds() {
            els.forEach(function(el) {
                var productId = parseInt(el.getAttribute(settings.attr));
                productIds.push(productId);
            });
        }
        
        function disableElements() {
            $('[' + settings.disabledAttr + ']').attr('disabled', true);
            $('[' + settings.hiddenAttr + ']').css('display', 'none');
        }
        
        function updateQuantities() {
            var url = '/controller/product/quantity?' + $.param({
                tableName: settings.tableName,
                productIds: productIds
            });
            $.get(url, function(items) {
                els.forEach(function(el) {
                    var productId = parseInt(el.getAttribute(settings.attr));
                    items.forEach(function(obj) {
                        if (
                            obj.id === productId
                            // The quantity is null when stock tracking is disabled.
                            && obj.stockQuantity !== null
                        ) {
                            var msg = obj.stockQuantity ? obj.stockQuantity + ' ' + (obj.stockQuantity === 1 ? settings.singularLabel : settings.pluralLabel) : settings.outOfStockMessage;
                            $(el).find('[' + settings.quantityAttr + ']').removeClass(settings.quantityHiddenClassName).html(msg);
                            
                            if (obj.stockQuantity) {
                                $(el).find('[' + settings.disabledAttr + ']').attr('disabled', false);
                                $(el).find('[' + settings.hiddenAttr + ']').css('display', 'inline');
                            }
                        }
                    });
                });
            });
        }
    };
})(jQuery);