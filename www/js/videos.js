(function(global, $) {
  "use strict";

  console.log('videos')

    window.addEventListener('DOMContentLoaded', init, {once: true});

    var TIME_SLICE = 5 // minutes
    var SLOT_DURATION = 30 // minutes
    var config = {
      programmeUrl: "https://participez-2016.capitoledulibre.org/planning/program/public/?format=xml",
      ponyConfUrl: "https://participez-2016.capitoledulibre.org",
    }

    function getChildText(parent, elemTagName) {
      return parent.getElementsByTagName(elemTagName)[0].textContent
    }

    function fetchProgram(callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          callback(xhr.responseXML);
        }
        xhr.onerror = function() {
          console.error("Error while getting program XML.", xhr.status, xhr.statusText);
        }
        xhr.open("GET", config.programmeUrl);
        xhr.responseType = "document";
        xhr.send();
    }

    function renderTrackDiv(track, index) {
        var html = '';
        html = '<section id="track-' + index + '">' +
            '<header class="col-xs-12">' +
            '<h3>' + track + '</h3>'
            '</header>' +
            '</section>';
        return html;
    }


    function renderVideoEvent(event, index) {
        var html = '';
        html = '<div class="col-xs-12 col-sm-6 col-md-4">' +
            '<div class="coverage media-video">' +
            '<header>' +
            '<h4>' + event.title + '</h4>' +
            '<small>' + event.persons.join(', ') + '</small>' +
            '</header>' +
            '<video width="360" height="200" controls="controls" preload="none">' +
            '<source src="' +
            event.video +
            '" type="video/mp4"/>' +
            '</video>' +
            '</div>' +
            '</div>';
        if ((index + 1) % 3 === 0) {
            html += '<div class="clearfix"></div>';
        }
        return html;
    }

    function listVideos(programXML) {

      var eventsByTrack = {};
      var eventElems = programXML.getElementsByTagName('event');

      Array.forEach(eventElems, function(eventElem) {
          var event = {
              id: parseInt(eventElem.getAttribute('id')),
              slug: getChildText(eventElem, 'slug'),
              title: getChildText(eventElem, 'title'),
              track: getChildText(eventElem, 'track'),
              type: getChildText(eventElem, 'type'),
          };
          event.persons = Array.map(eventElem.getElementsByTagName('person'), function(personElem) {
              return personElem.textContent
          });
          Array.forEach(eventElem.getElementsByTagName('link'), function(linkElem) {
              // Just need video
              if (linkElem.getAttribute('tag') === 'video') {
                  event.video = linkElem.textContent;
                  if (!(event.track in eventsByTrack)) {
                    eventsByTrack[event.track] = [];
                  }
                  eventsByTrack[event.track].push(event);
              }
          });
      });

      // Display for each track its events
      var trackId = 0;
      for (var track in eventsByTrack) {
          trackId ++;
          $('.videos').append(renderTrackDiv (track, trackId));
          eventsByTrack[track].forEach(function (event, index) {
              $('.videos #track-' + trackId).append(renderVideoEvent (event, index));
          });
      }
    }

    function init() {
      fetchProgram(listVideos)
    }

})(window, jQuery)
