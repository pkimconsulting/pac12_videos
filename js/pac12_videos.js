var page = 1;

Drupal.behaviors.pac12VideosBehavior = {
  attach: function (context, settings) {
    displayVODs(1);

    (function(window, undefined) {
      var InfiniteScroll = function() {
        this.initialize = function() {
            jQuery(window).scroll(function() {
            var scrollTop = jQuery(document).scrollTop();
            var windowHeight = jQuery(window).height();
            var height = jQuery(document).height() - windowHeight;
            var scrollPercentage = (scrollTop / height);

            // if the scroll is more than 90% from the top, load more content.
            if(scrollPercentage > 0.9) {
              displayVODs(++page);
            }
          });
        };
       this.initialize();
     }
     
     jQuery(document).ready(function() {
       new InfiniteScroll();
     });

    })(window);
  }
};

function displayVODs(page) {
  jQuery.get('https://api.pac-12.com/v3/vod?page=' + page, function(data) {
    for (let key in data.programs) {
      let vod = data.programs[key];

      // Outer div
      jQuery('.vods').append('<div class="' + vod['id'] + '"></div>');

      jQuery('.' + vod['id']).append('<div class="thumbnail"><img src="' + vod['images']['tiny'] + '"></div>');
      jQuery('.' + vod['id']).append('<div class="title">' + vod['title'] + '</div>');

      // Calculate time
      let minutes = Math.floor(vod['duration'] / 60000);
      let seconds = Math.floor((vod['duration'] / 1000 - Math.floor(Math.floor(vod['duration'] / 60000) * 60)));
      seconds = seconds < 10 ? '0' + seconds: seconds;
      jQuery('.' + vod['id']).append('<div class="duration">' + minutes + ':' + seconds + '</div>');

      // Get sports list
      jQuery.get('http://api.pac-12.com/v3/sports', function(data) {
        let sport = {};
        for (let key in data.sports) {
          sport[parseInt(data.sports[key]['id'])] = data.sports[key]['name'];
        }

        // Generate program sports
        let programSports = ''
        for (let key in vod['sports']) {
          programSports += sport[vod['sports'][key]['id']] + ', ';
        }

        // Trim last space and comma
        programSports = programSports.substring(0, programSports.length - 2)

        jQuery('.' + vod['id']).append('<div class="sports">' + programSports + '</div>');
 
      });

      // Get school list
      jQuery.get('http://api.pac-12.com/v3/schools', function(data) {
        let school = {};
        for (let key in data.schools) {
          school[parseInt(data.schools[key]['id'])] = data.schools[key]['name'];
        }

        // Generate program sports
        let programSchools = ''
        for (let key in vod['schools']) {
          programSchools += school[vod['schools'][key]['id']] + ', ';
        }

        // Trim last space and comma
        programSchools = programSchools.substring(0, programSchools.length - 2)

        jQuery('.' + vod['id']).append('<div class="schools">' + programSchools + '</div>');

      });
   }
  });

}

