if(window.frameElement) {
  var $section_list = $(parent.document.getElementsByClassName("theme-editor__add-section")),
  	  $demo_list = $(parent.document.getElementsByClassName("ui-card theme-editor__card"));
  function addImageSection(obj_type,$append,json_obj){
    if(!json_obj['images'].hasOwnProperty(obj_type)) return false;
    var image = '<img src="' + json_obj['defaulturl'] +'section/'+ json_obj['images'][obj_type] + '" alt="">',
        $image = $(image);
    $image.css({
      'width': '100%',
      'margin-top': 10
    }); 
    $append.append($image);
  } 
  function setSectionImage(json_obj){ 
    $section_list.each(function() {
      var $this = $(this),
          obj = $this.data('new-section'),
          obj_type,
          $button;
      if(!obj.type) return;
      else obj_type = obj.type;
      $button = $this.find('button').first();
      addImageSection(obj_type, $button, json_obj); 
      $button.css({ paddingRight: 15 });
      if($(parent.document.getElementsByClassName('theme-editor__subheading')).length) {
        $(parent.document.getElementsByClassName('theme-editor__subheading')).css({"font-weight": "700", "font-size":"16px", "color":"#212529"});
        $(parent.document.getElementsByClassName('theme-editor__add-section-item')).each(function(){
          $(this).find("img").length && $(this).css({"font-weight":"600"});
        });
      }
    });
  }  
  function setDemoImage(json_obj) {
    var i = 0;
    $demo_list.find('li').each(function(){ 
      i = i+1;
      var $this = $(this),
          $button = $this.find('button'); 
      if(!json_obj['demos'].hasOwnProperty(i)) return false;
      var image = '<img src="' + json_obj['defaulturl'] +'demos/'+ json_obj['demos'][i] + '" alt="">',
          $image = $(image);
      $image.css({
        'width': '100%',
        'margin-top': 10
      }); 
      $button.append($image);
      $button.css({"font-weight": "600", "font-size":"15px", "color":"#212529","text-decoration":"underline"});
    });
  }
  var json = {
    "defaulturl": "\/\/obest.org\/shopify\/techmarket\/adminpanel\/",
    "images": {
      "banner-content": "banner-content.jpg",
      "banner-fullwidth": "banner-fullwidth.jpg",
      "banner-grid": "banner-grid.jpg", 
      "collection-brands": "collection-brands.jpg", 
      "collection-linklist": "collection-linklist.jpg",
      "collection-slider": "collection-slider.jpg",
      "collection-products": "collection-products.jpg",
      "products-goups": "products-goups.jpg",
      "products-banner": "products-banner.jpg",
      "products-banner2": "products-banner2.jpg",
      "products-banner3": "products-banner3.jpg",
      "products-single-slider": "products-single-slider.jpg",
      "products-deal-slider": "products-deal-slider.jpg",
      "products-filter-tab": "products-filter-tab.jpg",
      "products-filter-tab2": "products-filter-tab2.jpg",
      "products-filter-tab3": "products-filter-tab3.jpg",
      "products-filter-tab4": "products-filter-tab4.jpg",
      "products-filter-tab5": "products-filter-tab5.jpg",
      "products-filter-tab6": "products-filter-tab6.jpg",
      "products-filter-tab7": "products-filter-tab7.jpg", 
      "products-filter-tab8": "products-filter-tab8.jpg",
      "products-masonry": "products-masonry.jpg",
      "products-tab-fixed-grid1": "products-tab-fixed-grid1.jpg",
      "products-tab-fixed-grid2": "products-tab-fixed-grid2.jpg",
      "slideshow-section": "slideshow-section.jpg",
      "slideshow-baner-right": "slideshow-baner-right.jpg"
    } 
  };
  $( document ).ready(function(){
    setSectionImage(json); 
    //setDemoImage(json);
  });
}