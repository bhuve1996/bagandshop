var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
  .on('shopify:section:load', this._onSectionLoad.bind(this))
  .on('shopify:section:unload', this._onSectionUnload.bind(this))
  .on('shopify:section:select', this._onSelect.bind(this))
  .on('shopify:section:deselect', this._onDeselect.bind(this))
  .on('shopify:block:select', this._onBlockSelect.bind(this))
  .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = (instance.id === evt.detail.sectionId);

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/* ================ SECTION ================ */

window.theme = window.theme || {};
theme.Header = (function() { 
  var cache = {}; 
  function init() {
    $('.notice-toplink .btn-close').on('click', function(){ 
      createCookie('noticetoplink', 'true', 1);  
      var hide = { opacity: 0, transition: 'opacity 0.3s' };
      $('.notice-toplink').css(hide).slideUp(500);
      setTimeout(function(){ 
        $('.notice-toplink').hide();
      }, 700); 
    }); 
    if(readCookie('noticetoplink') == null) { 
      $('.notice-toplink').show(); 
    } 
    $(".search-area a.search-icon").click(function (e) {  
      $(".top-links-icon").parent().children("ul.links").removeClass("show"); 
      if ($('#search_mini_form').is('.show')) { 
        $('#search_mini_form').removeClass('show'); 
      }
      else{ 
        $('#search_mini_form').addClass('show'); 
      } 
      e.stopPropagation();
    });  
    $(".top-links-icon").click(function(e){ 
      $(".search-area a.search-icon").parent().children("#search_mini_form").removeClass("show"); 
      if($(this).parent().children("ul.links").hasClass("show")){
        $(this).parent().children("ul.links").removeClass("show");
      }
      else
        $(this).parent().children("ul.links").addClass("show");
      e.stopPropagation();
    });
    $(".search-area a.search-icon").parent().click(function(e){
      e.stopPropagation();
    })  
    $(".mini-cart").hover(function() {
      var $cartWrapper = $(this).children().children('.cart-wrapper');
      var $cartIcon = $(this).find('.icon-cart-header');
      var iconOffset = $cartIcon.offset();
      var iconHeight = $cartIcon.outerHeight();
      var headerHeight = $('.header-container').outerHeight();
      var isSticky = $('.header-container').hasClass('sticky-header');
      
      // Clear any existing timeout
      if (window.cartCloseTimeout) {
        clearTimeout(window.cartCloseTimeout);
        window.cartCloseTimeout = null;
      }
      
      // Force cart wrapper to be visible and properly positioned
      $cartWrapper.addClass('cart-popup-active');
      
      // Move cart wrapper to body to avoid carousel overflow clipping
      if ($cartWrapper.parent().is('body') === false) {
        $cartWrapper.appendTo('body');
        // Mark this cart wrapper as the active one
        $cartWrapper.attr('data-cart-active', 'true');
      }
      
      $cartWrapper.css({
        'position': 'fixed',
        'z-index': '2147483647',
        'display': 'block',
        'visibility': 'visible',
        'opacity': '1'
      });
      
      // Calculate proper positioning based on header state
      var topPosition;
      if (isSticky) {
        // For sticky header, position relative to viewport
        topPosition = (iconOffset.top + iconHeight + 10);
      } else {
        // For non-sticky header, position relative to header
        topPosition = (headerHeight + 10);
      }
      
      // Ensure minimum top position to avoid going off-screen
      var minTop = 70; // Minimum distance from top of viewport
      topPosition = Math.max(topPosition, minTop);
      
      // Position the dropdown with proper z-index and positioning
      $cartWrapper.css({
        'position': 'fixed',
        'top': topPosition + 'px',
        'right': ($(window).width() - iconOffset.left - $cartIcon.outerWidth()) + 'px',
        'z-index': '2147483647',
        'display': 'block',
        'visibility': 'visible',
        'opacity': '1',
        'background-color': '#fff',
        'border-width': '2px 0 0',
        'border-style': 'solid',
        'border-color': '#08c',
        'color': '#777',
        'box-shadow': '0 2px 8px rgba(0,0,0,0.5)',
        'width': '300px',
        'margin-top': '10px'
      });
      
      // Force button styling with multiple approaches for maximum compatibility
      var $viewBtn = $cartWrapper.find('.cart-checkout .actions .btn-button.view-cart');
      var $checkoutBtn = $cartWrapper.find('.cart-checkout .actions .btn-button.checkout-cart');
      
      // Method 1: Inline style attribute
      $viewBtn.attr('style', 'background-color: #ff4d4f !important; color: white !important; border: 1px solid #ff4d4f !important;');
      $checkoutBtn.attr('style', 'background-color: #ff4d4f !important; color: white !important; border: 1px solid #ff4d4f !important;');
      
      // Method 2: CSS method as backup
      $viewBtn.css({
        'background-color': '#ff4d4f !important',
        'color': 'white !important',
        'border': '1px solid #ff4d4f !important'
      });
      $checkoutBtn.css({
        'background-color': '#ff4d4f !important',
        'color': 'white !important',
        'border': '1px solid #ff4d4f !important'
      });
      
      // Make total amount text black
      $cartWrapper.find('.cart-checkout .cart-info .subtotal .price').css('color', 'black !important');
      $cartWrapper.find('.cart-checkout .cart-info .subtotal .price .money').css('color', 'black !important');
      
      $cartWrapper.fadeIn(200);
      
      // Force cart wrapper to stay on top after fade in
      setTimeout(function() {
        $cartWrapper.css({
          'position': 'fixed',
          'z-index': '2147483647',
          'background-color': '#fff',
          'border-width': '2px 0 0',
          'border-style': 'solid',
          'border-color': '#08c',
          'color': '#777',
          'box-shadow': '0 2px 8px rgba(0,0,0,0.5)',
          'width': '300px',
          'margin-top': '10px'
        });
        
        // Apply styling to cart content elements
        $cartWrapper.find('.cart-inner').css('padding', '0');
        $cartWrapper.find('.cart-inner-content').css('padding', '0');
        $cartWrapper.find('.cart-content ul').css({
          'margin': '0',
          'padding': '0 20px',
          'outline': 'none'
        });
        $cartWrapper.find('.cart-content ul li.item-cart').css({
          'padding': '20px 0',
          'border-bottom': '1px solid #eee',
          'float': 'left',
          'width': '100%'
        });
        $cartWrapper.find('.cart-content ul li.item-cart .product-image').css({
          'border-width': '0',
          'padding': '0',
          'border-radius': '0',
          'background-color': '#fff',
          'float': 'left',
          'width': '80px'
        });
        $cartWrapper.find('.cart-content ul li.item-cart .product-image img').css({
          'width': '100%',
          'height': 'auto'
        });
        $cartWrapper.find('.cart-content ul li.item-cart .product-details').css({
          'margin-left': '90px',
          'text-align': 'left',
          'position': 'relative'
        });
        $cartWrapper.find('.cart-content ul li.item-cart .product-details .product-name').css({
          'margin': '0 0 10px',
          'padding-right': '20px'
        });
        $cartWrapper.find('.cart-content ul li.item-cart .product-details .product-name a').css({
          'outline': 'none',
          'text-decoration': 'none',
          'line-height': '23px',
          'font-size': '14px',
          'font-weight': '400',
          'color': '#444'
        });
        $cartWrapper.find('.cart-content ul li.item-cart .product-details .items').css({
          'margin': '0 0 15px',
          'line-height': '1',
          'font-size': '14px'
        });
        $cartWrapper.find('.cart-content ul li.item-cart .product-details .access').css({
          'margin': '0',
          'padding': '0',
          'position': 'absolute',
          'top': '0',
          'right': '0'
        });
        $cartWrapper.find('.cart-content ul li.item-cart .product-details .access .btn-remove').css({
          'background-image': 'none',
          'background-color': 'transparent',
          'color': '#7B7B7B',
          'font-weight': 'normal',
          'height': '16px',
          'line-height': '16px',
          'outline': 'medium none',
          'text-decoration': 'none'
        });
        $cartWrapper.find('.cart-checkout').css({
          'padding': '20px',
          'border-top': '1px solid #eee'
        });
        $cartWrapper.find('.cart-checkout .cart-info').css('margin-bottom', '15px');
        $cartWrapper.find('.cart-checkout .cart-info .subtotal').css({
          'display': 'flex',
          'justify-content': 'space-between',
          'align-items': 'center',
          'margin': '0',
          'font-size': '16px',
          'font-weight': '600'
        });
        $cartWrapper.find('.cart-checkout .actions').css({
          'display': 'flex',
          'gap': '10px'
        });
        $cartWrapper.find('.cart-checkout .actions .btn-button').css({
          'flex': '1',
          'padding': '10px 15px',
          'text-align': 'center',
          'text-decoration': 'none',
          'border-radius': '4px',
          'font-size': '14px',
          'font-weight': '500',
          'transition': 'all 0.3s ease'
        });
        // Force button styling with multiple approaches for maximum compatibility
        var $viewBtn = $cartWrapper.find('.cart-checkout .actions .btn-button.view-cart');
        var $checkoutBtn = $cartWrapper.find('.cart-checkout .actions .btn-button.checkout-cart');
        
        // Method 1: Inline style attribute
        $viewBtn.attr('style', 'background-color: #ff4d4f !important; color: white !important; border: 1px solid #ff4d4f !important;');
        $checkoutBtn.attr('style', 'background-color: #ff4d4f !important; color: white !important; border: 1px solid #ff4d4f !important;');
        
        // Method 2: CSS method as backup
        $viewBtn.css({
          'background-color': '#ff4d4f !important',
          'color': 'white !important',
          'border': '1px solid #ff4d4f !important'
        });
        $checkoutBtn.css({
          'background-color': '#ff4d4f !important',
          'color': 'white !important',
          'border': '1px solid #ff4d4f !important'
        });
        
        // Method 3: Apply styles again after a short delay to ensure persistence
        setTimeout(function() {
          $viewBtn.attr('style', 'background-color: #ff4d4f !important; color: white !important; border: 1px solid #ff4d4f !important;');
          $checkoutBtn.attr('style', 'background-color: #ff4d4f !important; color: white !important; border: 1px solid #ff4d4f !important;');
          
          // Make total amount text black
          $cartWrapper.find('.cart-checkout .cart-info .subtotal .price').css('color', 'black !important');
          $cartWrapper.find('.cart-checkout .cart-info .subtotal .price .money').css('color', 'black !important');
        }, 100);
      }, 250);
      
      // Add hover functionality to the cart popup itself
      $cartWrapper.hover(
        function() {
          // Clear timeout when hovering over popup
          if (window.cartCloseTimeout) {
            clearTimeout(window.cartCloseTimeout);
            window.cartCloseTimeout = null;
          }
        },
        function() {
          // Add delay when leaving popup
          window.cartCloseTimeout = setTimeout(function() {
            var $cartWrapper = $('body > .cart-wrapper[data-cart-active="true"]');
            if ($cartWrapper.length === 0) {
              $cartWrapper = $('.mini-cart .cart-wrapper');
            }
            
            $cartWrapper.fadeOut(200, function() {
              $cartWrapper.removeClass('cart-popup-active');
              $cartWrapper.removeAttr('data-cart-active');
              
              if ($cartWrapper.parent().is('body')) {
                $('.mini-cart .cart-container').append($cartWrapper);
              }
            });
          }, 200);
        }
      );
      
    }, function() {
      // Add delay before closing to allow user to move to popup
      window.cartCloseTimeout = setTimeout(function() {
        // Find the cart wrapper that was moved to body
        var $cartWrapper = $('body > .cart-wrapper[data-cart-active="true"]');
        if ($cartWrapper.length === 0) {
          $cartWrapper = $('.mini-cart .cart-wrapper');
        }
        
        $cartWrapper.fadeOut(200, function() {
          // Remove the active class and data attribute after fade out
          $cartWrapper.removeClass('cart-popup-active');
          $cartWrapper.removeAttr('data-cart-active');
          
          // Move cart wrapper back to original position after fade out
          if ($cartWrapper.parent().is('body')) {
            $('.mini-cart .cart-container').append($cartWrapper);
          }
        });
      }, 300); // 300ms delay
    });
    
    // Handle window resize to reposition cart popup if visible
    $(window).resize(function() {
      var $visibleCart = $('.mini-cart .cart-wrapper:visible');
      if ($visibleCart.length) {
        var $cartIcon = $('.mini-cart .icon-cart-header');
        var iconOffset = $cartIcon.offset();
        var iconHeight = $cartIcon.outerHeight();
        var headerHeight = $('.header-container').outerHeight();
        var isSticky = $('.header-container').hasClass('sticky-header');
        
        // Ensure cart wrapper is in body
        if ($visibleCart.parent().is('body') === false) {
          $visibleCart.appendTo('body');
        }
        
        var topPosition;
        if (isSticky) {
          topPosition = (iconOffset.top + iconHeight + 10);
        } else {
          topPosition = (headerHeight + 10);
        }
        
        var minTop = 70;
        topPosition = Math.max(topPosition, minTop);
        
        $visibleCart.css({
          'top': topPosition + 'px',
          'right': ($(window).width() - iconOffset.left - $cartIcon.outerWidth()) + 'px'
        });
      }
    }); 
    $("html,body").click(function(e){  
      $(".top-links-icon").parent().children("ul.links").removeClass("show");
      $(".search-area a.search-icon").parent().children("#search_mini_form").removeClass("show");
      
      // Close cart popup when clicking outside
      if (!$(e.target).closest('.mini-cart').length) {
        var $cartWrapper = $('body > .cart-wrapper[data-cart-active="true"]');
        if ($cartWrapper.length === 0) {
          $cartWrapper = $('.mini-cart .cart-wrapper');
        }
        
        $cartWrapper.fadeOut(200, function() {
          // Remove the active class and data attribute after fade out
          $cartWrapper.removeClass('cart-popup-active');
          $cartWrapper.removeAttr('data-cart-active');
          
          // Move cart wrapper back to original position after fade out
          if ($cartWrapper.parent().is('body')) {
            $('.mini-cart .cart-container').append($cartWrapper);
          }
        });
      }
    });  
    $('.menu-icon, .mobile-nav-overlay').click(function(event) {
      if(!$('body').hasClass('md-mobile-menu'))
        $('body').addClass('md-mobile-menu');
      if(!$('body').hasClass('mobile-nav-shown')) {
        $('body').addClass('mobile-nav-shown', function() { 
          setTimeout(function(){
            $(document).one("click",function(e) {
              var target = e.target;
              if (!$(target).is('.mobile-nav') && !$(target).parents().is('.mobile-nav')) {
                $('body').removeClass('mobile-nav-shown');
              }
            });  
          }, 111);
        });
      } else{
        $('body').removeClass('mobile-nav-shown');
        $(".mobile-nav").removeClass("show");
      }
    });
    $(".header-container .dropdown-menu .menu-container>a").click(function(){ 
      if ($(this).next().find('.side-menu').hasClass("show")) {
        $(this).next().find('.side-menu').removeClass("show");
      } else {
        $(this).next().find('.side-menu').addClass("show");
      } 
      if($(window).width()<=991){
        if ($(".mobile-nav").hasClass("show")) {
          $(".mobile-nav").removeClass("show");
          $(".mobile-nav").slideUp();
          $('body').removeClass('mobile-nav-shown'); 
        } else {
          $(".mobile-nav").addClass("show");
          $(".mobile-nav").slideDown();
          $('body').addClass('mobile-nav-shown', function() { 
            setTimeout(function(){
              $(document).one("click",function(e) {
                var target = e.target;
                if (!$(target).is('.mobile-nav') && !$(target).parents().is('.mobile-nav')) {
                  $('body').removeClass('mobile-nav-shown');
                }
              });  
            }, 111);
          });
        }
      }
    });
    if($('.template-index').find('.sidebar').length > 0) {
      var sidebar = $('.template-index').find('.sidebar'); 
      if($(sidebar).hasClass('f-left') && $('.template-index').find('.header-container.type2').length == 0){
        setTimeout(function(){
          $(sidebar).css('padding-top', $('.side-menu').height()+65);
        }, 300);  
        $(window).resize(function(){
          $(sidebar).css('padding-top', $('.side-menu').height()+65);
        });
      }
    }
  }  
  function unload() {} 
  return {
    init: init,
    unload: unload
  };
})();
theme.HeaderSection = (function() { 
  function Header() {
    theme.Header.init(); 
  } 
  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function() {
      theme.Header.unload();
    }
  }); 
  return Header;
})();

window.theme = window.theme || {};
theme.Slideshow = (function(){
  this.$container = null;
  function slideshow(el){
    this.$container = $(el);
    if(this.$container.hasClass('owl-carousel')){
      var data_carousel = this.$container.parent().find('.data-slideshow'); 
      if(data_carousel.data('auto')) {
        var autoplay = true;
        var autoplayTime = data_carousel.data('auto');
      }else{
        var autoplay = false;
        var autoplayTime = 5000;
      }    
      if(data_carousel.data('transition') == 'fade' && data_carousel.data('transition') != ''){
        var transition = 'fadeOut';
      }else {
        var transition = false;
      }
      this.$container.owlCarousel({
        items: 1, 
        smartSpeed: 300, // Faster, smoother transitions
        autoplay: autoplay,
        lazyLoad: true,
        autoplayTimeout:autoplayTime,
        autoplayHoverPause: true,
        animateOut: transition,
        loop: true,
        dots: data_carousel.data('paging'),  
        nav: data_carousel.data('nav'),
        navText: [data_carousel.data('prev'),data_carousel.data('next')],
        thumbs: true,
        thumbImage: false,
        thumbsPrerendered: true,
        thumbContainerClass: 'owl-thumbs',
        thumbItemClass: 'owl-thumb-item',
        touchDrag: true,
        mouseDrag: true,
        pullDrag: true,
        freeDrag: false,
        touchClass: 'owl-touch',
        grabClass: 'owl-grab',
        // Enhanced smoothness settings
        slideTransition: 'ease-in-out',
        animateIn: 'fadeIn',
        animateOut: 'fadeOut'
      }); 
    }
    if(this.$container.parents(".full-screen-slider").length > 0) {
      fullScreenInit();
      // Debounce resize events to prevent excessive recalculations
      var resizeTimer;
      $(window).resize( function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          fullScreenInit();
        }, 250);
      });
    }
  }
  function fullScreenInit(){
    var s_width = $(window).innerWidth();
    var s_height = $(window).innerHeight();
    var s_ratio = s_width/s_height;
    var v_width=320;
    var v_height=240;
    var v_ratio = v_width/v_height;
    $(".full-screen-slider div.item").css("position","relative");
    $(".full-screen-slider div.item").css("overflow","hidden");
    $(".full-screen-slider div.item").width(s_width);
    $(".full-screen-slider div.item").height(s_height);
    $(".full-screen-slider div.item > video").css("position","absolute");
    $(".full-screen-slider div.item > video").bind("loadedmetadata",function(){
      v_width = this.videoWidth;
      v_height = this.videoHeight;
      v_ratio = v_width/v_height;
      if(s_ratio>=v_ratio){
        $(this).width(s_width);
        $(this).height("");
        $(this).css("left","0px");
        $(this).css("top",(s_height-s_width/v_width*v_height)/2+"px");
      }else{
        $(this).width("");
        $(this).height(s_height);
        $(this).css("left",(s_width-s_height/v_height*v_width)/2+"px");
        $(this).css("top","0px");
      }
      $(this).get(0).play();
    });
  }
  return slideshow;
})();  
theme.BrandSlider = (function(){
  this.$container = null;
  function brandsInit(el){
    this.$container = $(el);   
    if(this.$container.find('.owl-carousel').length > 0){
      carouselSlider(this.$container.find('.owl-carousel')); 
    } 
  }
  return brandsInit;
})();
theme.CollectionSlider = (function(){
  this.$container = null;
  function collectionInit(el){
    this.$container = $(el);   
    if(this.$container.find('.owl-carousel').length > 0){
      carouselSlider(this.$container.find('.owl-carousel')); 
    } 
  }
  return collectionInit;
})();  
theme.CollectionProducts = (function(){
  this.$container = null;
  function collectionproducts(el){
    this.$container = $(el);  
    if(this.$container.find('.owl-carousel').length > 0){   
      this.$container.find('.owl-carousel').each(function(){
        carouselSlider($(this)); 
      }); 
    }  
    this.$container.find(".lazy").lazyload({
      effect : "fadeIn",
      data_attribute: "src",
      threshold: 200, // Load images 200px before they come into view
      failure_limit: 10 // Prevent infinite loading attempts
    }); 
    if(this.$container.find('.category-products .products-grid').length>0){
      productGridSetup();
    }
    productReview();
    countDownInit();  
    if(this.$container.find('.product-image-area .more-views-verticle').length > 0){
      this.$container.find('.product-image-area .more-views-verticle').each(function(){ 
        verticalCarosel($(this));
      });
    }
    qtyInit();
  }
  return collectionproducts;
})(); 
theme.CollectionFilterTab = (function(){
  this.$container = null;
  function filtertab(el){
    this.$container = $(el);
    if(this.$container.find('.owl-carousel').length > 0){
      this.$container.find('.owl-carousel').each(function(){
        carouselSlider($(this)); 
      }); 
    }  
    this.$container.find(".lazy").lazyload({
      effect : "fadeIn",
      data_attribute: "src",
      threshold: 200, // Load images 200px before they come into view
      failure_limit: 10 // Prevent infinite loading attempts
    });   
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) { 
      var $tab = $(this).attr('href');
      $($tab).find('img[data-src]').each(function () {
        $(this).attr('src', $(this).attr('data-src'));
      });
    });
    if(this.$container.find('.category-products .products-grid').length>0){
      productGridSetup();
    }
    productReview();
    countDownInit();
    if(this.$container.find('.product-image-area .more-views-verticle').length > 0){
      this.$container.find('.product-image-area .more-views-verticle').each(function(){ 
        verticalCarosel($(this));
      });
    }
    qtyInit(); 
  } 
  return filtertab;
})();
theme.ProductsMasonryGrid = (function(){
  this.$container = null;
  function masonryInit(el){
    this.$container = $(el); 
    var $container = this.$container.find('.products-masonry-grid');
    var numb = this.$container.find('.infinite-scrolling').data('show');  
    if($container.length > 0){  
      $container.imagesLoaded(function(){
        $container.show();
        $container.packery({
          itemSelector: ".grid-item",
          columnWidth: ".grid-sizer",
          percentPosition: true
        });
      }); 
      setTimeout(function() { 
        $container.animate({
          opacity: 1
        }, 200);
      },1000);
    } 
    $(el).find('.infinite-scrolling a').click(function() { 
      $(this).parent().addClass('loading');
      if ($(el).find('.products-grid .item:hidden').length > 0) {
        $(el).find('.products-grid .item:hidden:lt('+numb+')').each(function() { 
          $(this).find('img[data-src]').each(function () {
            $(this).attr('src', $(this).attr('data-src'));
          });   
          var show = { opacity: 1, transition: 'opacity 0.3s' };
          $(this).show().css(show); 
          $container.packery('layout'); 
        });       
        $("window").scroll();
        if ($(el).find('.products-grid .item:hidden').length == 0) {
          $(el).find('.infinite-scrolling a').text(frontendData.loadMoreText);              
        }
      }
      setTimeout(function() { 
        $(el).find('.infinite-scrolling').removeClass('loading');
      },1000);
      
    });
    this.$container.find(".lazy").lazyload({
      effect : "fadeIn",
      data_attribute: "src",
      threshold: 200, // Load images 200px before they come into view
      failure_limit: 10 // Prevent infinite loading attempts
    });  
    countDownInit();   
  }
  return masonryInit;
})();

theme.slideshows = {};
theme.SlideshowSection = (function() {
  function SlideshowSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#slideshow-section-' + sectionId; 
    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }
  return SlideshowSection;
})();
theme.SlideshowSection.prototype = _.assignIn({}, theme.SlideshowSection.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  } 
});
  
theme.brandslider = {};
theme.BrandSliderSection = (function(){
  function BrandSliderSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var brandslider = this.blogtestimonial = '#brands-slider-' + sectionId; 
    theme.brandslider[brandslider] = new theme.BrandSlider(brandslider);
  } 
  return BrandSliderSection;
})(); 
theme.BrandSliderSection.prototype = _.assignIn({}, theme.BrandSliderSection.prototype, {
  onUnload: function() {
    delete theme.brandslider[this.brandslider];
  } 
});

theme.collectionslider = {};
theme.CollectionSliderSection = (function(){
  function CollectionSliderSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var collectionslider = this.collectionslider = '#collection-slider-' + sectionId; 
    theme.collectionslider[collectionslider] = new theme.CollectionSlider(collectionslider);
  } 
  return CollectionSliderSection;
})(); 
theme.CollectionSliderSection.prototype = _.assignIn({}, theme.CollectionSliderSection.prototype, {
  onUnload: function() {
    delete theme.collectionslider[this.collectionslider];
  } 
});
   
theme.collectionproducts = {};
theme.CollectionProductsSection = (function(){
  function CollectionProductsSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var collectionproducts = this.collectionproducts = '#filter-products-' + sectionId; 
    theme.collectionproducts[collectionproducts] = new theme.CollectionProducts(collectionproducts);
  } 
  return CollectionProductsSection;
})(); 
theme.CollectionProductsSection.prototype = _.assignIn({}, theme.CollectionProductsSection.prototype, {
  onUnload: function() {
    delete theme.collectionproducts[this.collectionproducts];
  } 
});
 
theme.collectionfilter = {};
theme.CollectionFillterTabSection = (function(){
  function CollectionFillterTabSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var collectionfilter = this.collectionfilter = '#collection-filter-' + sectionId; 
    theme.collectionfilter[collectionfilter] = new theme.CollectionFilterTab(collectionfilter);
  } 
  return CollectionFillterTabSection;
})(); 
theme.CollectionFillterTabSection.prototype = _.assignIn({}, theme.CollectionFillterTabSection.prototype, {
  onUnload: function() {
    delete theme.collectionfilter[this.collectionfilter];
  } 
});

theme.productsmasonry = {};
theme.ProductsMasonrySection = (function(){
  function ProductsMasonrySection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var productsmasonry = this.productsmasonry = '#filter-products-masonry-' + sectionId; 
    theme.productsmasonry[productsmasonry] = new theme.ProductsMasonryGrid(productsmasonry);
  } 
  return ProductsMasonrySection;
})();
theme.ProductsMasonrySection.prototype = _.assignIn({}, theme.ProductsMasonrySection.prototype, {
  onUnload: function() {
    delete theme.productsmasonry[this.productsmasonry];
  } 
});

function carouselSlider(el){
  var carousel = el,
      data_carousel = carousel.parent().find('.data-carousel');  
  
  if(data_carousel.data('auto')) {
    var autoplay = true;
    var autoplayTime = data_carousel.data('auto');
  }else{
    var autoplay = false;
    var autoplayTime = 5000;
  }  
  var item_320 = data_carousel.data('320')? data_carousel.data('320') : 1;
  var item_480 = data_carousel.data('480')? data_carousel.data('480') : 1;
  var item_640 = data_carousel.data('640')? data_carousel.data('640') : 1;
  var item_768 = data_carousel.data('768')? data_carousel.data('768') : 1;
  var item_992 = data_carousel.data('992')? data_carousel.data('992') : 1;
  var item_1200 = data_carousel.data('1200')? data_carousel.data('1200') : 1; 
  var item_1600 = data_carousel.data('1600')? data_carousel.data('1600') : data_carousel.data('1200'); 
  carousel.owlCarousel({
    items: data_carousel.data('items'), 
    smartSpeed: 300, // Faster, smoother transitions
    autoplay: autoplay,
    lazyLoad: true,
    autoplayTimeout:autoplayTime,
    autoplayHoverPause: true,
    dots: data_carousel.data('paging'), 
    margin: data_carousel.data('margin'),
    nav: data_carousel.data('nav'),
    navText: [data_carousel.data('prev'),data_carousel.data('next')],
    touchDrag: true,
    mouseDrag: true,
    pullDrag: true,
    freeDrag: false,
    touchClass: 'owl-touch',
    grabClass: 'owl-grab',
    // Enhanced smoothness settings
    slideTransition: 'ease-in-out',
    responsive: { 
      0: {
        items:item_320
      },
      480: {
        items:item_480
      },
      640: {
        items:item_640
      },
      768: {
        items:item_768
      },
      992: {
        items:item_992
      },
      1200: {
        items:item_1200
      },
      1600: {
        items:item_1600
      }
    } 
  });
  carousel.on('changed.owl.carousel', function(event) {
    var index      = event.item.index; 
    var item = carousel.find('.owl-item')[index];
    carousel.find('.owl-item').removeClass('current');
    $(item).addClass('current');
  })
  
  // Touch events are now handled properly by Owl Carousel's built-in touch support
  if(data_carousel.data('navcustom')){  
    $(data_carousel.data('navcustom') +' .owl-next').click(function(){ 
      carousel.trigger('next.owl.carousel');
    })
    $(data_carousel.data('navcustom') +' .owl-prev').click(function(){
      carousel.trigger('prev.owl.carousel');
    })
  }
}
function productGridSetup(){
  $('.category-products .products-grid li.item:nth-child(2n)').addClass('nth-child-2n');
  $('.category-products .products-grid li.item:nth-child(2n+1)').addClass('nth-child-2np1');
  $('.category-products .products-grid li.item:nth-child(3n)').addClass('nth-child-3n');
  $('.category-products .products-grid li.item:nth-child(3n+1)').addClass('nth-child-3np1');
  $('.category-products .products-grid li.item:nth-child(4n)').addClass('nth-child-4n');
  $('.category-products .products-grid li.item:nth-child(4n+1)').addClass('nth-child-4np1');
  $('.category-products .products-grid li.item:nth-child(5n)').addClass('nth-child-5n');
  $('.category-products .products-grid li.item:nth-child(5n+1)').addClass('nth-child-5np1');
  $('.category-products .products-grid li.item:nth-child(6n)').addClass('nth-child-6n');
  $('.category-products .products-grid li.item:nth-child(6n+1)').addClass('nth-child-6np1');
  $('.category-products .products-grid li.item:nth-child(7n)').addClass('nth-child-7n');
  $('.category-products .products-grid li.item:nth-child(7n+1)').addClass('nth-child-7np1');
  $('.category-products .products-grid li.item:nth-child(8n)').addClass('nth-child-8n');
  $('.category-products .products-grid li.item:nth-child(8n+1)').addClass('nth-child-8np1');  
}
function colorSwatchGrid(){
  $('.configurable-swatch-list li a').on('mouseenter', function(e){
    e.preventDefault();   
    var productImage = $(this).parents('.item-area').find('.product-image-area').find('.product-image');  
    productImage.find('img.main').attr('src', $(this).data('image'));  
  });
}
function productReview(){ 
  if ($(".spr-badge").length > 0) {
    SPR.registerCallbacks();
    SPR.initRatingHandler();
    SPR.initDomEls();
    SPR.loadProducts();
    SPR.loadBadges();
  }
}
function qtyInit(){
  $('.qtyplus').click(function(e){
    // Stop acting like a button
    e.preventDefault(); 
    // Get its current value
    var currentVal = parseInt($(this).parent('form').find('input[name="quantity"]').val()); 
    // If is not undefined
    if (!isNaN(currentVal)) {
      // Increment
      $(this).parent('form').find('input[name="quantity"]').val(currentVal + 1);
    } else {
      // Otherwise put a 0 there
      $(this).parent('form').find('input[name="quantity"]').val(0);
    }
  });
  // This button will decrement the value till 0
  $(".qtyminus").click(function(e) {
    // Stop acting like a button
    e.preventDefault();
    // Get the field name
    fieldName = $(this).attr('field');
    // Get its current value
    var currentVal = parseInt($(this).parent('form').find('input[name="quantity"]').val());
    // If it isn't undefined or its greater than 0
    if (!isNaN(currentVal) && currentVal > 0) {
      // Decrement one
      $(this).parent('form').find('input[name="quantity"]').val(currentVal - 1);
    } else {
      // Otherwise put a 0 there
      $(this).parent('form').find('input[name="quantity"]').val(0);
    }
  });
} 
function countDownInit(){
  if($('.product-date').length>0){
    $('.product-date').each(function(i,item){
      var date = $(item).attr('data-date');
      var countdown = { 
        "yearText": window.date_text.year_text,
        "monthText": window.date_text.month_text,
        "weekText": window.date_text.week_text,
        "dayText": window.date_text.day_text,
        "hourText": window.date_text.hour_text,
        "minText": window.date_text.min_text,
        "secText": window.date_text.sec_text,
        "yearSingularText": window.date_text.year_singular_text,
        "monthSingularText": window.date_text.month_singular_text,
        "weekSingularText": window.date_text.week_singular_text,
        "daySingularText": window.date_text.day_singular_text,
        "hourSingularText": window.date_text.hour_singular_text,
        "minSingularText": window.date_text.min_singular_text,
        "secSingularText": window.date_text.sec_singular_text
      };
      var template = '<div class="day"><span class="no">%d</span><span class="text">%td</span></div><div class="hours"><span class="no">%h</span><span class="text">%th</span></div><div class="min"><span class="no">%i</span><span class="text">%ti</span></div><div class="second"><span class="no">%s</span><span class="text">%ts</span></div>';
      if(date){
        var config = {date: date};
        $.extend(config, countdown); 
        if(template){
          config.template = template;
        }
        $(item).countdown(config);
      }
    });
  } 
}
function verticalCarosel(carousel){ 
  var count = carousel.find('.verticl-carousel a').length; 
  getThumb(carousel);
  if (count <= 3) {
    carousel.find('.more-views-nav').hide();
  }  
  carousel.find(".more-views-prev").on("click", function () {
    if (!carousel.find(".verticl-carousel").is(':animated')) {
      var bottom = carousel.find(".verticl-carousel > a:last-child");
      var clone = carousel.find(".verticl-carousel > a:last-child").clone();
      clone.prependTo(carousel.find(".verticl-carousel"));
      carousel.find(".verticl-carousel").animate({
        "top": "-=85"
      }, 0).stop().animate({
        "top": '+=85'
      }, 300, function () {
        bottom.remove();
      }); 
      getThumb(carousel);
    }  
  });
  carousel.find(".more-views-next").on("click", function () { 
    if (!carousel.find(".verticl-carousel").is(':animated')) {
      var top = carousel.find(".verticl-carousel > a:first-child");
      var clone = carousel.find(".verticl-carousel > a:first-child").clone();
      clone.appendTo(carousel.find(".verticl-carousel"));
      carousel.find(".verticl-carousel").animate({
        "top": '-=85'
      }, 300, function () {
        top.remove();
        carousel.find(".verticl-carousel").animate({
          "top": "+=85"
        }, 0);
      }); 
      getThumb(carousel);
    }
  }); 
}
function getThumb(carousel){
  carousel.find('.product-image-thumbs a').click(function(e){
    e.preventDefault();   
    var productImage = $(this).parents('.product-image-area').find('.product-image');  
    productImage.find('img.main').attr('src', $(this).data('image'));  
  });
}
function createCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}
function readCookie(name) {
  var nameEQ = escape(name) + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
  }
  return null;
}
function eraseCookie(name) {
  createCookie(name, "", -1);
}
$(document).ready(function() {
  var sections = new theme.Sections(); 
  sections.register('header-section', theme.HeaderSection); 
  sections.register('slideshow-section', theme.SlideshowSection);   
  sections.register('brands-slider-section', theme.BrandSliderSection); 
  sections.register('collection-slider-section', theme.CollectionSliderSection);  
  sections.register('filter-products-section', theme.CollectionProductsSection);   
  sections.register('collection-filter-section', theme.CollectionFillterTabSection); 
  sections.register('filter-products-masonry-section', theme.ProductsMasonrySection); 
});

var SW = SW || {};
(function ($) {  
  var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
  var $window = $(window),
      body = $("body"),
      deviceAgent = navigator.userAgent.toLowerCase(),
      isMobileAlt = deviceAgent.match(/(iphone|ipod|ipad|android|iemobile)/),
      imageZoomThreshold = 20;
  var loading = false;
  var infinite_loaded_count = 1; 
  SW.megamenu = {
    init: function(){
      $(".main-navigation .top-navigation .static-dropdown .menu-wrap-sub, .main-navigation .top-navigation .m-dropdown .menu-wrap-sub").each(function(){
        $(this).css("left","-9999px");
        $(this).css("right","auto");
      });
      $('.main-navigation').find("li.m-dropdown .menu-wrap-sub ul > li.parent").mouseover(function(){
        var popup = $(this).children(".menu-wrap-sub");
        var w_width = $(window).innerWidth();
		
        if(popup) {
          var pos = $(this).offset();
          var c_width = $(popup).outerWidth();
          if(w_width <= pos.left + $(this).outerWidth() + c_width) {
            $(popup).css("left","auto");
            $(popup).css("right","100%");
            
          } else {
            $(popup).css("left","100%");
            $(popup).css("right","auto");
            
          }
        }
      });
      $('.main-navigation').find("li.static-dropdown.parent,li.m-dropdown.parent").mouseover(function(){
        var popup = $(this).children(".menu-wrap-sub");
        var w_width = $(window).innerWidth();
        if(popup) {
          var pos = $(this).offset();
          var c_width = $(popup).outerWidth();
          if(w_width <= pos.left + $(this).outerWidth() + c_width) {
            $(popup).css("left","auto");
            $(popup).css("right","0");
            
          } else {
            $(popup).css("left","20px");
            $(popup).css("right","auto");
            
          }
        }
      });
      $(window).resize(function(){
        $(".main-navigation .top-navigation .static-dropdown .menu-wrap-sub, .main-navigation .top-navigation .m-dropdown .menu-wrap-sub").each(function(){
          $(this).css("left","-9999px");
          $(this).css("right","auto");
        });
      }); 
    }
  }; 
  SW.page = {
    init: function() {
      if($('body').find('#resultLoading').attr('id') != 'resultLoading'){
        $('body').append('<div id="resultLoading" style="display:none"><div class="spinner"><div class="circle"></i></div><div class="bg"></div></div>');
      }  
      if($('#popup_newsletter').length > 0){
        var newsletter = $('#popup_newsletter'); 
        SW.page.newsletterPopupInit(newsletter);
      }   
      SW.page.setVisualState();
      $('.smart_input').on('change', function() {
        'use strict';
        SW.page.setVisualState();
      }); 
      SW.page.setSelect(); 
      if($('.carousel-init.owl-carousel').length > 0) {
        var carousel = $('.carousel-init.owl-carousel');
        carousel.each(function(){ 
          carouselSlider($(this));
        }); 
      } 
      $(".checkout-info .shipping a").click(function() { 
        if ($(this).hasClass('collapsed')) { 
          $(this).parent().removeClass('closed');
        } else { 
          $(this).parent().addClass('closed'); 
        }  
      }); 
    },  
    newsletterPopupInit: function(newsletter){
      $('#popup_newsletter .subcriper_label input').on('click', function(){
        if($(this).parent().find('input:checked').length){
          createCookie('newsletterSubscribe', 'true', 1);
        } else {
          readCookie('newsletterSubscribe'); 
        }
      });
      $('#popup_newsletter .input-box button.button').on('click', function(){
        var button = $(this);
        setTimeout(function(){
          if(!button.parent().find('input#popup-newsletter').hasClass('validation-failed')){ 
            createCookie('newsletterSubscribe', 'true', 1);
          }
        }, 500);
      });  
      if (readCookie('newsletterSubscribe') == null) {
        setTimeout(function(){
          $.magnificPopup.open({
            items: {
              src: $('#popup_newsletter'),
              type: 'inline'
            },
            mainClass: 'mfp-move-from-top',
            removalDelay: 200,
            midClick: true 
          });
        }, newsletterData.delay); 
      }  
    }, 
    translateBlock: function(blockSelector) {
      if (multi_language && translator.isLang2()) {
        translator.doTranslate(blockSelector);
      }
    },
    translateText: function(str) {
      if (!multi_language || str.indexOf("|") < 0)
        return str;

      if (multi_language) {
        var textArr = str.split("|");
        if (translator.isLang2())
          return textArr[1];
        return textArr[0];
      }          
    },
    setVisualState: function(){
      'use strict';
      $('.smart_input').each(function() {
        'use strict';
        var $value = $(this).val();
        if ($(this).is(':checked')) {
          $(this).next().addClass("checked");
        } else {
          $(this).next().removeClass("checked");
        }
      });
    },
    setSelect: function() {
      'use strict';
      if (($.isFunction($.fn.selectize))) { 
        if ($('.bootstrap-select').length) {
          $('.bootstrap-select').selectize();
        }
      }
    } 
  };
  SW.collection = {
    init: function() { 
      productGridSetup();
      /*
      if($('.product-deal .product-date').length > 0){
        var productsDeal = $('.product-date');
        productsDeal.each(function(){
          SW.collection.productDealInit($(this));
        });
      }*/
      SW.collection.layoutSwitch(); 
      if (readCookie('products-listmode') != null) {
        SW.collection.layoutListInit();
      } 
      $(document).on("click", ".close-box", function(){
        $(this).parents('.box-popup').removeClass('show');
      })
      $(document).on("click", ".add-to-wishlist", function(e){ 
        e.preventDefault();
        SW.collection.addToWishlist($(this));
      });
      $(document).on("click", ".remove-wishlist", function(e){ 
        e.preventDefault();
        SW.collection.removeWishlist($(this));
      });   
      $(document).on("click", ".btn-remove-cart", function(e) {
      	e.preventDefault();
        SW.collection.removeCartInit($(this).data('id'));
      }); 
      $(document).on("click", ".filter-bar a", function(e) {
        e.preventDefault();
        if ($('.filter-option-group').is('.open')) { 
          $('.filter-option-group').removeClass('open'); 
        }
        else{ 
          $('.filter-option-group').addClass('open'); 
        } 
      }); 
      /* moving action links into product image area */
      $(".move-action .item .details-area .actions").each(function(){
        $(this).parents('.item-area').children(".product-image-area").append($(this));
      });
      $("[data-with-product]").each(function(){
      	SW.collection.prevNextProductData($(this));
      });
      SW.collection.addToCart();
      SW.collection.buyNow();
      SW.collection.quickshopInit(); 
      SW.collection.sidebarMenuInit();
      SW.collection.layerFilterInit();
      colorSwatchGrid();  
      SW.collection.tabInfinityScrollInit();
      countDownInit();
      SW.collection.initInfiniteScrolling();
      SW.collection.sidebarInitToggle();
      SW.collection.sidebarCategoryInitToggle();
      qtyInit();
    },  
    animateItems: function(productsInstance) {
      productsInstance.find(".product").each(function(aj) {
        $(this).css('opacity', 1);
        $(this).addClass("item-animated");
        $(this).delay(aj * 200).animate({
          opacity: 1
        }, 500, "easeOutExpo", function() {
          $(this).addClass("item-animated")
        });
      });
    },
    layoutSwitch: function() {
      var isSwitchingLayout = false;
      $(document).on('click', 'span.layout-opt', function(e) {
        var products = $('#products-grid'),
            selectedLayout = $(this).data('layout'),
            columns = products.data('columns');

        $('.toolbar .view-mode .layout-opt').removeClass('active');
        $(this).addClass('active');
        eraseCookie('products-listmode'); 
        if (readCookie('products-listmode') == null) {
          createCookie('products-listmode', selectedLayout, 10);
        } 
        if (isSwitchingLayout) {
          return;
        }
        isSwitchingLayout = true;
        products.animate({
          'opacity': 0
        }, 300);
        setTimeout(function() {
          $('body.template-collection').removeAttr('class').addClass('template-collection');
          $('body.template-collection').addClass('layout-' + selectedLayout);
          
          if(selectedLayout == 'grid-extended') {
            $('body.layout-grid-extended').find('.products-grid').removeAttr('class').addClass('products-grid').addClass('columns4');
          }else{ 
            $('body.template-collection').find('.products-grid').removeAttr('class').addClass('products-grid').addClass('columns'+columns);
          }
          if ( $('.products-grid').length > 0 ) {
            $('.products-grid').children().css('min-height','0');
          }  
          productGridSetup(); 
          products.animate({
            'opacity': 1
          }, 200);
          isSwitchingLayout = false;
        }, 300);
        e.preventDefault();
      });
    },
    layoutListInit: function(){
      var products = $('#products-grid'),
          listmode = readCookie('products-listmode'),
          columns = products.data('columns');
      products.css('opacity',0);
      $('.toolbar .view-mode span').removeClass('active');
      $('.toolbar .view-mode span[data-layout="'+listmode+'"]').addClass('active');
      $('body.template-collection').removeAttr ('class').addClass('template-collection'); 
      $('body.template-collection').addClass('layout-'+listmode); 
      if(listmode == 'grid-extended') {
        $('body.layout-grid-extended').find('.products-grid').removeAttr('class').addClass('products-grid').addClass('columns4');
      }else{ 
        $('body.template-collection').find('.products-grid').removeAttr('class').addClass('products-grid').addClass('columns'+columns);
      }
      setTimeout(function() {
        products.animate({
          'opacity': 1
        }, 200);
      }, 300);
    },
    productDealInit: function(productDeal){ 
      var date = productDeal.data('date');
      if(date){
        var config = {date: date};
        $.extend(config, countdown); 
        $.extend(config, countdownConfig);
        if(countdownTemplate){
          config.template = countdownTemplate;
        }
        productDeal.countdown(config); 
      }
    },
    quickshopInit: function(){ 
      $(document).on("initproduct", "#product-form", function() { 
        var product_handle = $(this).data('id');
        var template = $('.product-view'); 
        Shopify.getProduct(product_handle, function(product) {
          template.find('.product-shop').attr('id', 'product-' + product.id);
          template.find('.product-form').attr('id', 'product-actions-' + product.id);
          template.find('.product-form .product-options select').attr('id', 'product-select-' + product.id);
          SW.collection.createSwatch(product, template);
        });
      });
      $("#product-form").trigger("initproduct");  
      $(document).on("click", ".quickview", function() {
        var $prod = $(this).closest(".product");
        eval($prod.find("[data-id^=product-block-json-]").html());
        var template = $prod.find("[data-id^=product-block-template-]").html();
        return $.magnificPopup.open({
          items: {
            src: [template].join(""),
            type: 'inline'
          },
          mainClass: 'mfp-move-from-top',
          removalDelay: 200,
          midClick: true, 
          preloader: true,
          callbacks: { 
            open: function() {
              SW.verticleScroll.init();
              if($('.carousel-init.owl-carousel').length > 0) {
                var carousel = $('.carousel-init.owl-carousel');
                carousel.each(function(){ 
                  carouselSlider($(this));
                }); 
              } 
              SW.productMediaManager.init();
              $("#product-form").trigger("initproduct");
              countDownInit(); 
              SW.page.translateBlock('.quick-view');
              if(frontendData.enableCurrency) { 
                currenciesCallbackSpecial(".quick-view span.money");
              }
              productReview();
            },
            close: function() {
              SW.productMediaManager.destroyZoom();
            }
          },
        }); 
      }); 
    },
    createSwatch: function(product, layout){
      if (product.variants.length >= 1) { //multiple variants
        for (var i = 0; i < product.variants.length; i++) {
          var variant = product.variants[i];
          var option = '<option value="' + variant.id + '">' + variant.title + '</option>'; 
          layout.find('form.product-form > select').append(option);
        }
        new Shopify.OptionSelectors("product-select-" + product.id, {
          product: product,
          onVariantSelected: SW.collection.selectCallback
        });

        //start of quickview variant;
        var filePath = asset_url.substring(0, asset_url.lastIndexOf('/'));
        var assetUrl = asset_url.substring(0, asset_url.lastIndexOf('/'));
        var options = "";
        for (var i = 0; i < product.options.length; i++) {
          options += '<div class="swatch clearfix" data-option-index="' + i + '">';
          options += '<div class="header">' + product.options[i].name + '</div>';
          var is_color = false;
          if (/Color|Colour/i.test(product.options[i].name)) {
            is_color = true;
          }
          var optionValues = new Array();
          for (var j = 0; j < product.variants.length; j++) {
            var variant = product.variants[j];
            var value = variant.options[i];
            var valueHandle = SW.collection.convertToSlug(value);
            var forText = 'swatch-' + i + '-' + valueHandle; 
            if (optionValues.indexOf(value) < 0) {
              //not yet inserted
              options += '<div data-value="' + value + '" class="swatch-element '+(is_color ? "color" : "")+' ' + (is_color ? "color" : "") + valueHandle + (variant.available ? ' available ' : ' soldout ') + '">';
			  
              if (is_color) {
                options += '<div class="tooltip">' + value + '</div>';
              }
              options += '<input id="' + forText + '" type="radio" name="option-' + i + '" value="' + value + '" ' + (j == 0 ? ' checked ' : '') + (variant.available ? '' : ' disabled') + ' />';
              
              if (is_color) {
                options += '<label for="' + forText + '" style="background-color: ' + valueHandle + '; background-image: url(' + filePath + valueHandle + '.png)"><img class="crossed-out" src="' + assetUrl + 'soldout.png" /></label>';
              } else {
                options += '<label for="' + forText + '">' + value + '<img class="crossed-out" src="' + assetUrl + 'soldout.png" /></label>';
              }
              options += '</div>';
              if (variant.available) {
                $('.product-view .swatch[data-option-index="' + i + '"] .' + valueHandle).removeClass('soldout').addClass('available').find(':radio').removeAttr('disabled');
              }
              optionValues.push(value);
            }
          }
          options += '</div>';
        }  
        if(swatch_color_enable){ 
          layout.find('form.product-form .product-options > select').after(options);
          layout.find('.swatch :radio').change(function() {
            var optionIndex = $(this).closest('.swatch').attr('data-option-index');
            var optionValue = $(this).val(); 
            $(this)
            .closest('form')
            .find('.single-option-selector')
            .eq(optionIndex)
            .val(optionValue)
            .trigger('change');
          }); 
        }
        if (product.available) {
          Shopify.optionsMap = {};
          Shopify.linkOptionSelectors(product);
        }

        //end of quickview variant
      } else { //single variant
        layout.find('form.product-form .product-options > select').remove();
        var variant_field = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';
        layout.find('form.product-form').append(variant_field);
      }
    },  
    convertToSlug: function(e) { 
      return e.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    },
    selectCallback: function(variant, selector) {  
      if (variant) {
        if (variant.available) {
          if (variant.compare_at_price > variant.price) { 
            $("#price").html('<div class="price">' + Shopify.formatMoney(variant.price, money_format) + "</div>" + '<del class="price_compare">' + Shopify.formatMoney(variant.compare_at_price, money_format) + "</del>")
          } else {
            $("#price").html('<div class="price">' + Shopify.formatMoney(variant.price, money_format) + "</div>");
          }
          frontendData.enableCurrency && currenciesCallbackSpecial("#price span.money"), 
          $(".product-shop-wrapper .add-to-cart").removeClass("disabled").removeAttr("disabled").html(window.inventory_text.add_to_cart), 
          variant.inventory_management && variant.inventory_quantity <= 0 ? ($("#selected-variant").html(selector.product.title + " - " + variant.title), $("#backorder").removeClass("hidden")) : $("#backorder").addClass("hidden");
		  if (variant.inventory_management!=null) {
              if (!$(".product-inventory").attr("data-inventory-manual") && window.inventory_text && window.inventory_text.in_stock && window.inventory_text.in_stock !== 'undefined') {
              $(".product-inventory span.in-stock").text(window.inventory_text.in_stock);
              }
          } else {
              if (!$(".product-inventory").attr("data-inventory-manual") && window.inventory_text && window.inventory_text.many_in_stock && window.inventory_text.many_in_stock !== 'undefined') {
              $(".product-inventory span.in-stock").text(window.inventory_text.many_in_stock);
              }
           }
          $('.product-sku span.sku').text(variant.sku);
        }else{
          $("#backorder").addClass("hidden"), $(".product-shop-wrapper .add-to-cart").html(window.inventory_text.sold_out).addClass("disabled").attr("disabled", "disabled");
          if (!$(".product-inventory").attr("data-inventory-manual") && window.inventory_text && window.inventory_text.out_of_stock && window.inventory_text.out_of_stock !== 'undefined') {
          $(".product-inventory span.in-stock").text(window.inventory_text.out_of_stock);
          }
          $('.product-sku span.sku').empty();
        }
        if(swatch_color_enable){ 
          var form = $('#' + selector.domIdPrefix).closest('form');
          for (var i=0,length=variant.options.length; i<length; i++) {
            var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
            if (radioButton.size()) { 
              radioButton.get(0).checked = true;
            }
          } 
        }
      }
      if (variant && variant.featured_image) {
        var n = Shopify.Image.removeProtocol(variant.featured_image.src);   
        $(".product-image-thumbs .thumb-link").filter('[data-zoom-image="' + n + '"]').trigger("click"); 
      }
      variant && variant.sku ? $("#sku").removeClass("hidden").find("span").html(variant.sku) : $("#sku").addClass("hidden").find("span").html("");
    }, 
    prevNextProductData:function(el) { 
      var e = el.data("with-product"),
          t = el.find('script[type="text/template"]'),
          i = t.html();
      $.getJSON("/products/" + e + ".json", function(e) {
        var a = e.product;
        for (var o in a) i = i.replace(new RegExp("\\[" + o + "\\]", "ig"), a[o]);
        var r = a.image.src.lastIndexOf(".");
        i = i.replace(/\[img:([a-z]*)\]/gi, a.image.src.slice(0, r) + "_$1" + a.image.src.slice(r)), t.replaceWith(i)
      })
    },
    addToWishlist: function(wishlist){          
      var form = wishlist.parents('form').serialize(),
          id = wishlist.data('id'),
          all = $("body").find(".wishlist-" + id + " .add-to-wishlist");  
      $.ajax({
        type: "POST",
        url: "/contact",
        async: !0,
        data: form,
        cache: !1,
        beforeSend: function() {
          $("#resultLoading").show();
        },
        success: function() {  
          var productInfo = wishlist.closest('.product'),
              box = $('#wishlist-box'); 
          box.find(".product-link").attr("href", productInfo.find(".product-name a").attr("href")), 
            box.find(".product-img").attr("src", productInfo.find(".product-image img").attr("src")).attr("alt", productInfo.find(".product-name a").html()), 
            box.find(".product-title .product-link").html(productInfo.find(".product-name a").html()), 
            box.find(".product-price").html(productInfo.find(".price").html());
          all.each(function() { 
            $(this).removeClass("add-to-wishlist").addClass("added").attr("title", $(this).attr("data-added")), 
              $(this).find("span").html($(this).attr("data-added"));
              //$(this).find("i").removeClass("fa-heart-o").addClass("fa-heart");
          }), setTimeout(function() {
            $("#resultLoading").hide();  
            box.addClass('show'), 
              setTimeout(function() {
              box.removeClass('show');
            }, 5e3)
          }, 500)
        },
        error: function(t) {
          var box = $('#error-notice'),
              i = $.parseJSON(t.responseText);
          box.find(".heading").html(i.message), box.find(".message").html(i.description), setTimeout(function() {
            $("#resultLoading").hide(), 
              box.addClass('show'), 
              setTimeout(function() {
              box.removeClass('show');
            }, 5e3);
          }, 500);
        }
      })
    },
    removeWishlist: function(wishlist){ 
      var form = wishlist.parents('form').serialize(),
          item = wishlist.parents('.item'); 
      $.ajax({
        type: "POST",
        url: "/contact",
        data: form,
        beforeSend: function() {
          $("#resultLoading").show();
        },
        success: function() {
          $("#resultLoading").hide(), item.fadeOut(500);
        },
        error: function() {
          var box = $('#error-notice'),
              i = $.parseJSON(t.responseText);
          box.find(".heading").html(i.message), box.find(".message").html(i.description), setTimeout(function() {
            $("#resultLoading").hide(), 
              box.addClass('show'), 
              setTimeout(function() {
              box.removeClass('show');
            }, 5e3);
          }, 500);
        }
      })
    },
    addToCart: function(){  
      $(document).on("click", ".add-to-cart", function(e) {
        e.preventDefault(); 
        var a = $(this); 
        var form = a.closest("form");
        return $.ajax({
          type: "POST",
          url: "/cart/add.js",
          async: !0,
          data: form.serialize(),
          dataType: "json",
          beforeSend: function() {
            if(a.parents('.item-area').length > 0) {
              a.parents('.item-area').find(".loader-container").show();
            }else {
              $("#resultLoading").show();
            } 
          },
          error: function(t) {
            var box = $('#error-notice'),
                i = $.parseJSON(t.responseText);
            box.find(".heading").html(i.message);
            box.find(".message").html(i.description);
            setTimeout(function() {
              $(".loader-container").hide();
              $("#resultLoading").hide();
              box.addClass('show');
              setTimeout(function() {
                box.removeClass('show');
              }, 5e3);
            }, 500);
          },
          success: function(t) {
            Shopify.getCart(function(e) {
              var i = parseInt(form.find('input[name="quantity"]').val()), 
                  box = $('#cart-box');
              // Product info elements commented out - only showing success message
              // box.find(".product-link").attr("href", t.url), 
              // box.find(".product-img").attr("src", Shopify.resizeImage(t.image, "medium")).attr("alt", SW.page.translateText(t.title)), 
              // box.find(".product-title .product-link").html(SW.page.translateText(t.title)), 
              // box.find(".product-price").html(Shopify.formatMoney(t.price, money_format)),    
                frontendData.enableCurrency && currenciesCallbackSpecial("#cart-box span.money");  
              setTimeout(function() {
                $(".loader-container").hide();
                $("#resultLoading").hide();
                box.addClass('show'); 
                setTimeout(function() {
                  box.removeClass('show');
                }, 5e3)
              }, 500), SW.collection.updateCartInfo(e, ".cart-container .cart-wrapper .cart-inner-content")
            });  
            return false;
          },
          cache: !1
        });
      });
    },
    buyNow: function(){
      $(document).on("click", ".buy-now-btn", function(e) {
        e.preventDefault();
        var a = $(this);
        var form = a.closest("form");
        var productId = a.data("product-id");
        
        // Get the selected variant ID
        var variantId = form.find('select[name="id"]').val() || form.find('input[name="id"]').val();
        var quantity = form.find('input[name="quantity"]').val() || 1;
        
        // Clear cart first, then add the product and redirect to checkout
        $.ajax({
          type: "POST",
          url: "/cart/clear.js",
          dataType: "json",
          success: function() {
            // Add the product to cart
            $.ajax({
              type: "POST",
              url: "/cart/add.js",
              data: {
                id: variantId,
                quantity: quantity
              },
              dataType: "json",
              beforeSend: function() {
                $("#resultLoading").show();
              },
              success: function(t) {
                $("#resultLoading").hide();
                // Redirect to checkout
                window.location.href = "/checkout";
              },
              error: function(t) {
                $("#resultLoading").hide();
                var box = $('#error-notice'),
                    i = $.parseJSON(t.responseText);
                box.find(".heading").html(i.message);
                box.find(".message").html(i.description);
                box.addClass('show');
                setTimeout(function() {
                  box.removeClass('show');
                }, 5e3);
              }
            });
          },
          error: function() {
            $("#resultLoading").hide();
            // If clear fails, try to add directly
            $.ajax({
              type: "POST",
              url: "/cart/add.js",
              data: {
                id: variantId,
                quantity: quantity
              },
              dataType: "json",
              success: function(t) {
                window.location.href = "/checkout";
              },
              error: function(t) {
                var box = $('#error-notice'),
                    i = $.parseJSON(t.responseText);
                box.find(".heading").html(i.message);
                box.find(".message").html(i.description);
                box.addClass('show');
                setTimeout(function() {
                  box.removeClass('show');
                }, 5e3);
              }
            });
          }
        });
      });
    },
    updateCartInfo: function(cart, e){
      var c = $(e); 
      var t = $('.icon-cart-header .price');
      var d = $('.icon-cart-header .cart-total');
      if (c.length) {
      	c.empty();
        t.empty();
        $.each(cart, function(key,value){
          if(key == 'items'){
          	var $html ='';
            if(value.length){
              	t.html(Shopify.formatMoney(cart.total_price, money_format));
              	d.html('<span class="cart-qty">'+cart.item_count+'</span><span class="cart-price">'+cartData.totalNumb+'<span class="price">'+Shopify.formatMoney(cart.total_price, money_format)+'</span></span>');
              	$html += '<div class="cart-content">';
              	if($('.header-container').hasClass('type20')){
                $html += '<div class="total-count">';
                $html +=  '<span>'+cart.item_count+' '+cartData.totalNumb+'</span>';
                $html +=  '<a href="/cart" class="btn-button view-cart bordered uppercase"><span>'+cartData.buttonViewCart+'</span></a>';
                $html += '</div>';
                }
            	$html += '<ul class="clearfix">';
              	$.each(value, function(i, item) {
                  $html += '<li class="item-cart">';
                  $html += '<a class="product-image" href="'+ item.url +'"><img alt="'+ SW.page.translateText(item.title) +'" src="'+ Shopify.resizeImage(item.image, 'small') +'" /></a>';
                  $html += '<div class="product-details row-fluid show-grid">';
                  $html += '<p class="product-name"><a href="'+ item.url +'"><span>'+ SW.page.translateText(item.title) +'</span></a></p>';
                  $html += '<div class="items"><span class="price">'+item.quantity+' × <span class="amount">'+ Shopify.formatMoney(item.price, money_format) +'</span></span></div>';
                  $html += '<div class="access"><a href="javascript: void(0);" class="btn-remove btn-remove-cart" data-id="'+item.variant_id+'" title="'+cartData.removeItemLabel+'"><i class="icon-cancel"></i></a></div>';
                  $html += '</div>';
                  $html += '</li>';
                });
              	$html += '</ul>'; 
              	$html += '</div>';
              	$html += '<div class="cart-checkout">';
              	$html += '<div class="cart-info"><p class="subtotal"><span class="label">'+cartData.totalLabel+'</span><span class="price">'+Shopify.formatMoney(cart.total_price, money_format)+'</span></p></div>';
              	$html += '<div class="actions">';
              	if($('.header-container').hasClass('type20')){
              		$html += '<a href="/checkout" class="btn-button checkout-cart bordered uppercase"><span>'+cartData.buttonCheckout+'</span></a>';
                }else{
                	$html += '<a href="/cart" class="btn-button view-cart"><span>'+cartData.buttonViewCart+'</span></a> ';
              		$html += '<a href="/checkout" class="btn-button checkout-cart"><span>'+cartData.buttonCheckout+'</span></a>';
                }
              	$html += '</div>';
              	$html += '</div>';
            }else{ 
              	t.html(Shopify.formatMoney(cart.total_price, money_format)); 
                d.html('<span class="cart-qty">'+cart.item_count+'</span><span>'+cartData.totalNumb+'</span>');
              	$html += '<div class="cart-content">';
            	$html += '<p class="no-items-in-cart">'+cartData.noItemLabel+'</p>';
              	$html += '</div>';
            }
          } 
          c.append($html);
        });
      }
      if($('.icon-cart-header .cart-count').length > 0){
      	$('.icon-cart-header .cart-count').html(cart.item_count);
      }
      if(frontendData.enableCurrency){
        currenciesCallbackSpecial('.cart-wrapper .cart-inner span.money');
        currenciesCallbackSpecial('.icon-cart-header span.money');
      } 
    },
    removeCartInit: function(id,r){ 
      $.ajax({
      	type: 'POST',
        url: '/cart/change.js',
        data:  'quantity=0&id='+id,
        dataType: 'json', 
        beforeSend: function() {
          $(".cartloading").show();
        },
        success: function(t) { 
          if ((typeof r) === 'function') {
            r(t);
          }else {
            SW.collection.updateCartInfo(t, ".cart-container .cart-wrapper .cart-inner-content"); 
          	$(".cartloading").hide(); 
          }
        },
        error: function(XMLHttpRequest, textStatus) {
          Shopify.onError(XMLHttpRequest, textStatus);
        }
      }); 
    }, 
    sidebarMenuInit: function(){
      $("#mobile-menu, #categories_nav").mobileMenu({
        accordion: true,
        speed: 400,
        closedSign: 'collapse',
        openedSign: 'expand',
        mouseType: 0,
        easing: 'easeInOutQuad'
      });
    }, 
    sortbyFilter: function() {
      $(document).on("change", ".sort-by .field", function(e) {
        e.preventDefault();
        var t = $(this), i = t.val();
        Shopify.queryParams.sort_by = i;
        SW.collection.filterAjaxRequest();
      });
    },
    limitedAsFilter: function(){
      $(document).on("change", ".limited-view .field", function(e) {
        e.preventDefault();
        var t = $(this), i = t.val();
        Shopify.queryParams.view = i;
        SW.collection.filterAjaxRequest();
      });
    },
    swatchListFilter: function() {
      $(document).on("click", ".narrow-by-list .item:not(.disable), .advanced-filter .field:not(.disable)", function() {
        var e = $(this),
            t = e.find("input").val(),
            i = [];
        if (Shopify.queryParams.constraint && (i = Shopify.queryParams.constraint.split("+")), !e.hasClass("active")) {
          var a = e.parents(".layer-filter, .advanced-filter").find(".active");
          a.length > 0 && a.each(function() {
            var e = $(this).data("handle");
            if ($(this).removeClass("active"), e) {
              var t = i.indexOf(e);
              t >= 0 && i.splice(t, 1)
            }
          })
        }
        if (t) {
          var o = i.indexOf(t);
          0 > o ? (i.push(t), e.addClass("active")) : (i.splice(o, 1), e.removeClass("active"))
        } 
        i.length ? Shopify.queryParams.constraint = i.join("+") : delete Shopify.queryParams.constraint, SW.collection.filterAjaxRequest()
      });
    },
    paginationActionInit: function(){ 
      $(document).on("click", ".pagination-page a", function(e) {
        var page = $(this).attr("href").match(/page=\d+/g);
        if (page) {
          Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));
          if (Shopify.queryParams.page) {
            var newurl = SW.collection.filterCreateUrl(); 
            History.pushState({
              param: Shopify.queryParams
            }, newurl, newurl);
            SW.collection.filterGetContent(newurl); 
          }
        }
        e.preventDefault();
      }); 
    },
    layerFilterInit: function() {
      SW.collection.sortbyFilter();
      SW.collection.limitedAsFilter();
      SW.collection.paginationActionInit();
      SW.collection.swatchListFilter();
      SW.collection.layerClearAllFilter();
      SW.collection.layerClearFilter(); 
    }, 
    filterCreateUrl: function(baseLink) {
      var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');
      if (baseLink) {
        //location.href = baseLink + "?" + newQuery;
        if (newQuery != "")
          return baseLink + "?" + newQuery;
        else
          return baseLink;
      }
      return location.pathname + "?" + newQuery;
    }, 
    filterAjaxRequest: function(baseLink) { 
      delete Shopify.queryParams.page;
      var newurl = SW.collection.filterCreateUrl(baseLink); 
      History.pushState({
        param: Shopify.queryParams
      }, newurl, newurl); 
      SW.collection.filterGetContent(newurl); 
    },
    filterGetContent: function(e) {
      $.ajax({
        type: "get",
        url: e,
        beforeSend: function() {
          $("#resultLoading").show();
        },
        success: function(t) { 
          infinite_loaded_count = 0;
          var i = t.match("<title>(.*?)</title>")[1]; 
          $("#collection-main").empty().html($(t).find("#collection-main").html()),
            $(".narrow-by-list").empty().html($(t).find(".narrow-by-list").html()), 
            $(".pagination").empty().html($(t).find(".pagination").html()), 
            $(".main-breadcrumbs").empty().html($(t).find(".main-breadcrumbs").html()),  
            History.pushState({
              param: Shopify.queryParams
            }, i, e), setTimeout(function() {
              $("html,body").animate({
                scrollTop: $(".toolbar").offset().top
              }, 500)
            }, 100);
          $("#resultLoading").hide();
          if (readCookie('products-listmode') != null) {
            SW.collection.layoutListInit();
          }
          productGridSetup(); 
          SW.collection.layerClearFilter(); 
          SW.collection.layerClearAllFilter();
          colorSwatchGrid();
          SW.page.setVisualState();
          SW.collection.initInfiniteScrolling();
          SW.page.setSelect();
          SW.collection.sidebarInitToggle();
          SW.page.translateBlock('.main-wrapper');
          productReview();
          frontendData.enableCurrency && currenciesCallbackSpecial(".products-grid span.money"); 
        },
        error: function() {
          $("#resultLoading").hide();
        }
      });
    },    
    sidebarInitToggle: function() {
      if ($(".sidebar-toogle").length > 0) {
        $(".sidebar-toogle .block-title span.collapse").click(function() { 
          if ($(this).hasClass('click')) {
            $(this).removeClass('click');
            $(this).parent().removeClass('closed');
          } else { 
            $(this).parent().addClass('closed');
            $(this).addClass('click');
          } 
          $(this).parents(".sidebar-toogle").find(".sidebar-content").slideToggle();
        });
      }
    },  
    sidebarCategoryInitToggle: function() {
      if ($(".sidebar-cate-toogle").length > 0) {
        $(".sidebar-cate-toogle .block-title span.collapse").click(function() { 
          if ($(this).hasClass('click')) {
            $(this).removeClass('click');
            $(this).parent().removeClass('closed');
          } else {
            $(this).parent().addClass('closed');
            $(this).addClass('click');
          } 
          $(this).parents(".sidebar-cate-toogle").find(".sidebar-content").slideToggle();
        });
      }
    },
    layerClearFilter: function() {
      $(".narrow-by-list .narrow-item").each(function() {
        var e = $(this);
        e.find("input:checked").length > 0 && e.find(".clear").click(function(t) {
          var i = [];
          Shopify.queryParams.constraint && (i = Shopify.queryParams.constraint.split("+")), e.find("input:checked").each(function() {
            var e = jQuery(this),
                t = e.val();
            if (t) {
              var a = i.indexOf(t);
              a >= 0 && i.splice(a, 1)
            }
          }), i.length ? Shopify.queryParams.constraint = i.join("+") : delete Shopify.queryParams.constraint, SW.collection.filterAjaxRequest(), t.preventDefault()
        })
      })
    }, 
    layerClearAllFilter: function() {
      $(document).on("click", ".narrow-by-list .clearall, .filter-option-inner .clearall", function(e) {
        e.preventDefault();
        delete Shopify.queryParams.constraint, delete Shopify.queryParams.q, SW.collection.filterAjaxRequest();
      })
    },
    tabInfinityScrollInit: function(){ 
      var $maintab = $('.tab-content .category-products'), 
          $limit = $maintab.find('.data-tab').data('limit'),
          $show = $maintab.find('.data-tab').data('show'),
          $text = $maintab.find('.data-tab').data('text'),
          $translate = $maintab.find('.data-tab').data('translate'),
          $total = $maintab.find('.products-grid .item').length;  
      if(!$maintab.find('.data-tab').data('showmore')) return; 
      console.log($show);
      for(i =0; i <= $total; i++) {
        
        if(i > $show){
        	console.log(i);
        }
      }
      if($total > $limit){
      	$mainsc = $('<div/>').addClass('infinite-scrolling-homepage wow fadeIn');
        $in = $('<span/>').addClass('sc-show-more').attr("data-translate", $translate).text($text).appendTo($mainsc);
        $maintab.append($mainsc);
      } 
    }, 
    initInfiniteScrolling: function(){ 
      var scrollTimer;
      $(window).scroll(function(){
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
          if($('.infinite-loader').length > 0 && $(window).scrollTop() >= $(".infinite-loader").offset().top-$(window).height()+100){
            if(infinite_loaded_count < 2){ 
              $('.infinite-loader a').trigger('click');
            }
          }
        }, 100); // Debounce infinite scroll to prevent jumping
      });
      if ($('.infinite-loader').length > 0) {
        $('.infinite-loader a').click(function(e) {
          e.preventDefault();
          if (!$(this).hasClass('disabled')) {
            SW.collection.doInfiniteScrolling();
          }
        });
      }
    },
    doInfiniteScrolling: function() {
      var currentList = $('#collection-main .products-grid'); 
      var products = $('#products-grid'); 
      infinite_loaded_count = infinite_loaded_count + 1; 
      if (currentList) {
        var showMoreButton = $('.infinite-loader a').first();
        $.ajax({
          type: 'GET',
          url: showMoreButton.attr("href"),
          beforeSend: function() {
            $('.infinite-loader .btn-load-more').hide();
            $('.infinite-loader .loading').fadeIn(300);
          },
          success: function(data) {
            loading = false;  
            var items = $(data).find('#collection-main .products-grid .item'); 
            if (items.length > 0) {   
              
              products.append(items);
              SW.page.translateBlock("." + currentList.attr("class"));
               
              //get link of Show more
              if ($(data).find('.infinite-loader').length > 0) {
                showMoreButton.attr('href', $(data).find('.infinite-loader a').attr('href')); 
                if(infinite_loaded_count >= 2){
                  $('.infinite-loader .loading').fadeOut(300);
                  $('.infinite-loader .btn-load-more').show();
                }else{
                  $('.infinite-loader .loading').fadeOut(300);
                }
              } else {
                //no more products
                $('.infinite-loader .loading').fadeOut(300);
                showMoreButton.hide(); 
              } 
              
              if (readCookie('products-listmode') != null) {
                SW.collection.layoutListInit();
              }   
              productGridSetup(); 
              SW.collection.layerClearFilter(); 
              SW.collection.layerClearAllFilter();
              colorSwatchGrid();
              SW.page.setVisualState();  
              frontendData.enableCurrency && currenciesCallbackSpecial(".products-grid span.money");  
              productReview(); 
            }
          },
          error: function(xhr, text) { 
            $('.infinite-loader .btn-load-more').hide();
            $('.infinite-loader .loading').fadeOut(300);
          },
          dataType: "html"
        });
      }
    }
  }; 
  SW.productMediaManager = { 
    destroyZoom: function() {
      $('.zoomContainer').remove();
      $('.product-image-gallery .gallery-image').removeData('elevateZoom');
    },
    createZoom: function(image){
      SW.productMediaManager.destroyZoom();
      if(isMobileAlt){
        return;
      }
      if(image.length <= 0) { //no image found
        return;
      }
      if(image[0].naturalWidth && image[0].naturalHeight) {
        var widthDiff = image[0].naturalWidth - image.width() - imageZoomThreshold;
        var heightDiff = image[0].naturalHeight - image.height() - imageZoomThreshold;

        if(widthDiff < 0 && heightDiff < 0) {
          //image not big enough
          image.parents('.product-image').removeClass('zoom-available'); 
          return;
        } else {
          image.parents('.product-image').addClass('zoom-available');
        }
      }
      if(dataZoom.position == 'inside'){
        image.elevateZoom({
          /*gallery:'more-slides',*/
          zoomType: "inner",
          easing : true,
          cursor: "crosshair"
        });
      }else {
        image.elevateZoom({
          /*gallery:'more-slides',*/
          zoomWindowPosition: 1,
          easing : true,
          zoomWindowFadeIn: 500,
          zoomWindowFadeOut: 500,
          lensFadeIn: 500,
          lensFadeOut: 500,
          borderSize: 3,
          lensBorderSize: 2,
          lensBorderColour: "#999",
          borderColour: "#ddd"
        });
      }
      if(dataZoom.lightbox) {
        image.bind("click", function(e) {  
          var ez =   image.data('elevateZoom');
          ez.closeAll();
          $.fancybox(ez.getGalleryList());
          return false;
        }); 
      }
    },
    swapImage: function(targetImage) {
      targetImage = $(targetImage);
      targetImage.addClass('gallery-image');

      SW.productMediaManager.destroyZoom();

      var imageGallery = $('.product-image-gallery');

      if(targetImage[0].complete) { //image already loaded -- swap immediately

        imageGallery.find('.gallery-image').removeClass('visible');

        //move target image to correct place, in case it's necessary
        imageGallery.append(targetImage);

        //reveal new image
        targetImage.addClass('visible');

        //wire zoom on new image
        SW.productMediaManager.createZoom(targetImage);

      } else { //need to wait for image to load

        //add spinner
        imageGallery.addClass('loading');

        //move target image to correct place, in case it's necessary
        imageGallery.append(targetImage);

        //wait until image is loaded
        imagesLoaded(targetImage, function() {
          //remove spinner
          imageGallery.removeClass('loading');

          //hide old image
          imageGallery.find('.gallery-image').removeClass('visible');

          //reveal new image
          targetImage.addClass('visible');

          //wire zoom on new image
          SW.productMediaManager.createZoom(targetImage);
        });

      }
    },
    wireThumbnails: function() {
      //trigger image change event on thumbnail click
      $('.product-image-thumbs .thumb-link').click(function(e) {
        e.preventDefault();
        var jlink = $(this); 
        var target = $('#image-' + jlink.data('image-index')); 
        SW.productMediaManager.swapImage(target);
      });
    },
    initZoom: function() {
        SW.productMediaManager.createZoom($(".gallery-image.visible")); //set zoom on first image
    }, 
    init: function() {
      SW.productMediaManager.imageWrapper = $('.product-img-box');
      // Re-initialize zoom on viewport size change since resizing causes problems with zoom and since smaller 
      $(window).resize( function() {
        SW.productMediaManager.initZoom();
      });
      SW.productMediaManager.initZoom(); 
      SW.productMediaManager.wireThumbnails(); 
    }
  }; 
  SW.verticleScroll = {
    init: function(){  
      if($('.product-img-box .verticl-carousel').length > 0){
        var carousel = $('.product-img-box .verticl-carousel'); 
        SW.verticleScroll.carouselInit(carousel);
      }
    }, 
    carouselInit: function(carousel){
      var count = carousel.find('a').length; 
      if (count <= 3) {
        carousel.parents('.more-views-verticle').find('.more-views-nav').hide();
      }
      $(".product-img-box #carousel-up").on("click", function () {
        if (!$(".product-img-box .verticl-carousel").is(':animated')) {
          var bottom = $(".product-img-box .verticl-carousel > a:last-child");
          var clone = $(".product-img-box .verticl-carousel > a:last-child").clone();
          clone.prependTo(".product-img-box .verticl-carousel");
          $(".product-img-box .verticl-carousel").animate({
            "top": "-=90"
          }, 0).stop().animate({
            "top": '+=90'
          }, 300, function () {
            bottom.remove();
          });
          SW.productMediaManager.init();
        }
      });
      $(".product-img-box #carousel-down").on("click", function () {
        if (!$(".product-img-box .verticl-carousel").is(':animated')) {
          var top = $(".product-img-box .verticl-carousel > a:first-child");
          var clone = $(".product-img-box .verticl-carousel > a:first-child").clone();
          clone.appendTo(".product-img-box .verticl-carousel");
          $(".product-img-box .verticl-carousel").animate({
            "top": '-=90'
          }, 300, function () {
            top.remove();
            $(".product-img-box .verticl-carousel").animate({
              "top": "+=90"
            }, 0);
          });
          SW.productMediaManager.init();
        }
      });
    }
  }
  
  // Product Video Hover Functionality
  SW.productVideo = {
    init: function() {
      this.bindEvents();
    },
    
    bindEvents: function() {
      var self = this;
      
      // Handle video play button clicks
      $(document).on('click', '.product-video .video-play-button', function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.playVideo($(this).closest('.product-video'));
      });
      
      // Handle mouse enter/leave for auto-play
      $(document).on('mouseenter', '.product-image-area', function() {
        var $videoContainer = $(this).find('.product-video');
        if ($videoContainer.length) {
          self.handleMouseEnter($videoContainer);
        }
      });
      
      $(document).on('mouseleave', '.product-image-area', function() {
        var $videoContainer = $(this).find('.product-video');
        if ($videoContainer.length) {
          self.handleMouseLeave($videoContainer);
        }
      });
    },
    
    handleMouseEnter: function($videoContainer) {
      var $video = $videoContainer.find('video');
      var $playButton = $videoContainer.find('.video-play-button');
      
      // Show video container
      $videoContainer.css({
        'opacity': '1',
        'visibility': 'visible'
      });
      
      // Auto-play video immediately
      $video[0].play();
      $videoContainer.addClass('playing');
    },
    
    handleMouseLeave: function($videoContainer) {
      var $video = $videoContainer.find('video');
      var $playButton = $videoContainer.find('.video-play-button');
      
      // Pause and reset video
      $video[0].pause();
      $video[0].currentTime = 0;
      $videoContainer.removeClass('playing');
      
      // Hide video container
      $videoContainer.css({
        'opacity': '0',
        'visibility': 'hidden'
      });
    },
    
    playVideo: function($videoContainer) {
      var $video = $videoContainer.find('video');
      var $playButton = $videoContainer.find('.video-play-button');
      
      if ($video[0].paused) {
        $video[0].play();
        $videoContainer.addClass('playing');
      } else {
        $video[0].pause();
        $videoContainer.removeClass('playing');
      }
    }
  };
  
  // Carousel Swipe Detection
  SW.carouselSwipeDetector = {
    isCarouselSwipe: false,
    startX: 0,
    startY: 0,
    threshold: 10,
    
    init: function() {
      var self = this;
      
      // Detect carousel swipe start
      $(document).on('touchstart', '.owl-carousel', function(e) {
        self.startX = e.originalEvent.touches[0].clientX;
        self.startY = e.originalEvent.touches[0].clientY;
        self.isCarouselSwipe = false;
      });
      
      // Detect carousel swipe movement
      $(document).on('touchmove', '.owl-carousel', function(e) {
        if (self.startX === 0 && self.startY === 0) return;
        
        var currentX = e.originalEvent.touches[0].clientX;
        var currentY = e.originalEvent.touches[0].clientY;
        var deltaX = Math.abs(currentX - self.startX);
        var deltaY = Math.abs(currentY - self.startY);
        
        // If horizontal movement is greater than vertical, it's a carousel swipe
        if (deltaX > deltaY && deltaX > self.threshold) {
          self.isCarouselSwipe = true;
          // Prevent vertical scrolling during carousel swipe
          e.preventDefault();
        }
      });
      
      // Reset on touch end
      $(document).on('touchend', '.owl-carousel', function(e) {
        setTimeout(function() {
          self.isCarouselSwipe = false;
          self.startX = 0;
          self.startY = 0;
        }, 100);
      });
      
      // Prevent vertical scroll during carousel swipe
      $(document).on('touchmove', function(e) {
        if (self.isCarouselSwipe) {
          e.preventDefault();
        }
      });
    }
  };

  SW.productGridEqualizer = {
    init: function() {
      this.equalizeHeights();
      $(window).on('resize', this.debounce(this.equalizeHeights.bind(this), 250));
      
      // Recalculate heights when carousel items are loaded
      $(document).on('DOMNodeInserted', '.owl-carousel .owl-item', this.debounce(this.equalizeHeights.bind(this), 100));
      
      // Recalculate heights when images are loaded
      $(document).on('load', 'img', this.debounce(this.equalizeHeights.bind(this), 100));
      
      // Recalculate heights when tabs are switched
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', this.debounce(this.equalizeHeights.bind(this), 300));
      
      // Recalculate heights when owl carousel is initialized or refreshed
      $(document).on('initialized.owl.carousel refreshed.owl.carousel', '.owl-carousel', this.debounce(this.equalizeHeights.bind(this), 300));
    },
    
    equalizeHeights: function() {
      var windowWidth = $(window).width();
      
      // Don't equalize heights on mobile - let items be natural height
      if (windowWidth <= 767) {
        // Reset all heights on mobile to prevent extra space
        $('.category-products .products-grid .item').css({
          'height': 'auto',
          'min-height': 'auto'
        });
        $('.owl-carousel .owl-item .item').css({
          'height': 'auto',
          'min-height': 'auto'
        });
        return; // Exit early on mobile
      }
      
      // Equalize heights for product grid items (desktop/tablet only)
      $('.category-products .products-grid').each(function() {
        var $grid = $(this);
        var $items = $grid.find('.item');
        
        if ($items.length > 0) {
          // Reset heights first
          $items.css({
            'height': 'auto',
            'min-height': 'auto'
          });
          
          // Group items by row (assuming 4 items per row on desktop, 2 on tablet)
          var itemsPerRow = windowWidth > 991 ? 4 : 2;
          
          // Only equalize if more than 1 item per row
          if (itemsPerRow > 1) {
            for (var i = 0; i < $items.length; i += itemsPerRow) {
              var $rowItems = $items.slice(i, i + itemsPerRow);
              var maxHeight = 0;
              
              // Find the maximum height in this row
              $rowItems.each(function() {
                var height = $(this).outerHeight(true);
                if (height > maxHeight) {
                  maxHeight = height;
                }
              });
              
              // Set all items in this row to the maximum height
              if (maxHeight > 0) {
                $rowItems.css('height', maxHeight + 'px');
              }
            }
          }
        }
      });
      
      // Also equalize heights for carousel items - handle both single and multi-row layouts (desktop/tablet only)
      $('.owl-carousel').each(function() {
        var $carousel = $(this);
        var $items = $carousel.find('.owl-item');
        
        if ($items.length > 0) {
          // Reset heights first
          $items.css('height', 'auto');
          $items.find('.item').css({
            'height': 'auto',
            'min-height': 'auto'
          });
          
          // Check if this is a multi-row carousel (has .group wrapper)
          var $groups = $carousel.find('.group');
          
          if ($groups.length > 0) {
            // Multi-row layout - equalize within each group/row
            $groups.each(function() {
              var $group = $(this);
              var $groupItems = $group.find('.item');
              var maxHeight = 0;
              
              // Find max height in this group
              $groupItems.each(function() {
                var height = $(this).outerHeight(true);
                if (height > maxHeight) {
                  maxHeight = height;
                }
              });
              
              // Set all items in this group to max height
              if (maxHeight > 0) {
                $groupItems.css('min-height', maxHeight + 'px');
              }
            });
          } else {
            // Single row layout - equalize all visible items
            var maxHeight = 0;
            
            // Find the maximum height among all carousel items
            $items.each(function() {
              var $item = $(this).find('.item');
              if ($item.length > 0) {
                var height = $item.outerHeight(true);
                if (height > maxHeight) {
                  maxHeight = height;
                }
              }
            });
            
            // Set all carousel items to the maximum height
            if (maxHeight > 0) {
              $items.find('.item').css('min-height', maxHeight + 'px');
            }
          }
        }
      });
    },
    
    debounce: function(func, wait) {
      var timeout;
      return function executedFunction() {
        var later = function() {
          clearTimeout(timeout);
          func();
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  SW.stickyHeader = {
    init: function() {
      this.bindEvents();
    },
    
    bindEvents: function() {
      var self = this;
      var lastScrollTop = 0;
      var header = $('.header-container');
      var headerTop = $('.header-top');
      var isSticky = false;
      
      $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        var windowWidth = $(window).width();
        
        // Calculate header height for threshold
        var headerTopHeight = headerTop.length ? headerTop.outerHeight() : 0;
        var headerHeight = header.outerHeight();
        var totalHeaderHeight = headerTopHeight + headerHeight;
        
        // Only apply sticky behavior on mobile and tablet
        if (windowWidth <= 991) {
          if (scrollTop > totalHeaderHeight) {
            if (!isSticky) {
              // Use the already calculated total header height
              var normalHeaderHeight = totalHeaderHeight; // Total normal height
              
              // Temporarily hide header-top to measure sticky height
              headerTop.css('display', 'none');
              var stickyHeaderHeight = header.outerHeight(); // Height when sticky (without header-top)
              headerTop.css('display', ''); // Restore header-top
              
              // Create placeholder with NORMAL header height (to maintain original space)
              if (!$('.header-placeholder').length) {
                var placeholder = $('<div class="header-placeholder" style="height: ' + normalHeaderHeight + 'px; transition: height 0.3s ease;"></div>');
                header.after(placeholder);
                
                // Force a reflow to ensure placeholder is rendered
                placeholder[0].offsetHeight;
              }
              
              // Make header sticky immediately (no delay)
              header.addClass('sticky-header');
              // Hide header-top when sticky
              headerTop.css('display', 'none');
              isSticky = true;
            }
            
            // Show/hide header based on scroll direction - simplified approach
            if (scrollTop > lastScrollTop && scrollTop > 150) {
              // Scrolling down - hide header by moving it off screen
              header.css('top', '-70px');
            } else {
              // Scrolling up - show header
              header.css('top', '0');
            }
          } else {
            // At top of page - remove sticky behavior smoothly
            if (isSticky) {
              var placeholder = $('.header-placeholder');
              if (placeholder.length) {
                // First, make header unsticky but keep it in place
                header.removeClass('sticky-header');
                header.css('top', '');
                
                // Show header-top immediately to prevent jump
                headerTop.css('display', '');
                
                // Then animate placeholder height to 0
                placeholder.css('height', '0px');
                
                // Remove placeholder after animation completes
                setTimeout(function() {
                  placeholder.remove();
                  isSticky = false;
                }, 300);
              } else {
                // No placeholder, make header unsticky immediately
                header.removeClass('sticky-header');
                header.css('top', '');
                headerTop.css('display', '');
                isSticky = false;
              }
            }
          }
        } else {
          // Desktop - remove sticky behavior
          // First remove placeholder, then make header unsticky
          var placeholder = $('.header-placeholder');
          if (placeholder.length) {
            placeholder.css('height', '0px');
            setTimeout(function() {
              placeholder.remove();
              // Now make header unsticky after placeholder is removed
              header.removeClass('sticky-header');
              header.css('top', '');
              // Show header-top on desktop
              headerTop.css('display', '');
              isSticky = false;
            }, 300);
          } else {
            // No placeholder, make header unsticky immediately
            header.removeClass('sticky-header');
            header.css('top', '');
            // Show header-top on desktop
            headerTop.css('display', '');
            isSticky = false;
          }
        }
        
        lastScrollTop = scrollTop;
      });
    }
  };
  
  SW.mobileBottomBar = {
    init: function() {
      this.bindEvents();
    },
    
    bindEvents: function() {
      // Search functionality
      $('[data-search-mobile]').click(function(e) {
        e.preventDefault();
        // Trigger search overlay
        if (typeof openSearchOverlay === 'function') {
          openSearchOverlay();
        } else {
          // Fallback to search page if overlay function doesn't exist
          window.location.href = '/search';
        }
      });
      
      // Cart functionality
      $('[data-cart-sidebar]').click(function(e) {
        e.preventDefault();
        // Trigger cart drawer or redirect to cart page
        window.location.href = '/cart';
      });
      
      // Update cart count
      this.updateCartCount();
    },
    
    updateCartCount: function() {
      // Update cart count when cart changes
      $(document).on('cart:updated', function(event, cart) {
        $('[data-cart-count]').text(cart.item_count);
      });
    }
  };
  
  SW.footer = {
    init: function() {
      SW.footer.backToTopInit();
    },
    backToTopInit: function() {
      var scrollTimer;
      $(window).scroll(function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
          if ($(window).scrollTop() > 100) {
            $('#back-top').fadeIn();
          } else {
            $('#back-top').fadeOut();
          }
        }, 50); // Debounce back-to-top to prevent jumping
      });
      $('#back-top a').click(function () {
        $('body,html').animate({
          scrollTop: 0
        }, 800);
        return false;
      });
    }
  };
  SW.onReady = {
    init: function() { 
      SW.megamenu.init(); 
      SW.page.init();
      SW.collection.init(); 
      SW.footer.init();
      SW.verticleScroll.init();
      SW.productMediaManager.init();
      SW.productVideo.init();
      SW.carouselSwipeDetector.init();
      SW.productGridEqualizer.init();
      SW.stickyHeader.init();
      SW.mobileBottomBar.init();
    }
  };
  SW.onLoad = {
    init: function() {  
    }
  }; 
  $(document).ready(function(){
    SW.onReady.init();
  });
  $(window).load(function(){
    SW.onLoad.init();
  });
})(jQuery); 

// Auto-wrap carousels with container
function wrapCarousels() {
  $('.owl-carousel').each(function() {
    if (!$(this).parent().hasClass('carousel-container-wrapper')) {
      $(this).wrap('<div class="carousel-container-wrapper"></div>');
    }
  });
}

// Call this after DOM is ready
$(document).ready(function() {
  wrapCarousels();
});