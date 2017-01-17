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

    function listVideos(programXML) {

      var events = []
      var eventElems = Array.prototype.slice.call(programXML.getElementsByTagName('event'));

      eventElems.forEach(function(eventElem) {
          try {
            var event = {
              id: parseInt(eventElem.getAttribute('id')),
              slug: getChildText(eventElem, 'slug'),
              title: getChildText(eventElem, 'title'),
              track: getChildText(eventElem, 'track'),
              type: getChildText(eventElem, 'type'),
            };

            var linkElems = Array.prototype.slice.call(eventElem.getElementsByTagName('link'))
            event.links = []
            linkElems.forEach(function(linkElem) {
              if (linkElem.getAttribute('tag') === 'video') {
                event.videoLink = linkElem.textContent
                return
              }
              event.links.push(linkElem.textContent)
            })

            events.push(event);

          } catch (e) {
            console.error("Error while parsing event", eventElem, e);
          }
      })



    }

    function init() {
      fetchProgram(listVideos)
    }

})(window, jQuery)
