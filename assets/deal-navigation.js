// // Deal slider navigation fix
// (function() {
//   // Function to initialize deal navigation
//   function initDealNavigation() {
//     // Wait for carousel to be initialized
//     setTimeout(function() {
//       $('.products-tab-deal .owl-nav-custom').each(function() {
//         var $nav = $(this);
//         var sectionId = $nav.attr('class').match(/nav-custom-(\d+)/);
//         var $carousel = $nav.closest('.products-tab-deal').find('.owl-carousel');
        
//         if ($carousel.length > 0) {
//           // Connect prev button
//           $nav.find('.owl-prev').off('click').on('click', function(e) {
//             e.preventDefault();
//             $carousel.trigger('prev.owl.carousel');
//           });
          
//           // Connect next button
//           $nav.find('.owl-next').off('click').on('click', function(e) {
//             e.preventDefault();
//             $carousel.trigger('next.owl.carousel');
//           });
          
//           console.log('Deal navigation connected for section:', sectionId ? sectionId[1] : 'unknown');
//         }
//       });
//     }, 1000);
//   }

//   // Check if jQuery is available
//   if (typeof jQuery !== 'undefined') {
//     // jQuery is already loaded, run immediately
//     $(document).ready(initDealNavigation);
//   } else {
//     // Wait for jQuery to be loaded
//     var checkJQuery = setInterval(function() {
//       if (typeof jQuery !== 'undefined') {
//         clearInterval(checkJQuery);
//         $(document).ready(initDealNavigation);
//       }
//     }, 50);
    
//     // Fallback timeout after 10 seconds
//     setTimeout(function() {
//       clearInterval(checkJQuery);
//       if (typeof jQuery !== 'undefined') {
//         $(document).ready(initDealNavigation);
//       } else {
//         console.error('jQuery not available for deal navigation');
//       }
//     }, 10000);
//   }
// })(); 