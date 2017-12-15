var Offlr = (function (opts) { // eslint-disable-line no-unused-vars

    if (typeof NodeList.prototype.forEach !== 'function') {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    var consoleError = function (errorMessage) {
        throw new Error(errorMessage);
    };
    
    // Check if all desired values are set, and default to those which are optional.
    var options = {};
    options.element = opts.element || consoleError('You need an element to print all the good photos to.');
    options.api_key = opts.api_key || consoleError('You need to provide a apikey');
    options.per_page = opts.per_page || 10;
    options.elementClass = opts.elementClass || 'offlr-gallery';
    options.photoClass = opts.photoClass || 'offlr-gallery__photo';

    // Lets add a class to the element, if it doesn't already have one.
    if (options.element.className.indexOf(options.elementClass) < 0) {
        options.element.className += ' ' + options.elementClass;
    }

    // If a searchtag is provided, lets start a search.
    if (opts.search_tag) {
        search(opts.search_tag);
    }

    // Some globals
    var requestTimer;
    var itemWidth;
    var messageContainer = document.createElement('div');

    messageContainer.className += options.elementClass + '__message';

    /**
     * Create a search-request to Flickr API
     * @param {String} searchValue 
     */
    function search (searchValue) {

        var showMessage = function (message) {
            messageContainer.innerHTML = message;
            options.element.appendChild(messageContainer);
        };

        var clearMessages = function () {
            if (options.element.contains(messageContainer)) {
                options.element.removeChild(messageContainer);
            }
        };

        clearMessages();
        clearTimeout(requestTimer);
        options.element.setAttribute('data-loading', 'true');
        
        var searchRequest = new XMLHttpRequest();
        searchRequest.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + options.api_key + '&tags=' + searchValue + '&per_page=' + options.per_page + '&format=json&nojsoncallback=1', true);
        // To trigger slow loading and then error:
        // Add for example another r to flickr.com
        
        searchRequest.onreadystatechange = function () {
            if (searchRequest.readyState === 4) {
                
                clearTimeout(requestTimer);

                if (searchRequest.status === 200) {
                    var response;
                    options.element.setAttribute('data-loading', 'false');

                    try {
                        response = JSON.parse(searchRequest.responseText);
                    } catch (e) {
                        showMessage('Couldn\'t parse the data. Please try again.');
                        return;
                    }

                    if (typeof response.stat !== 'undefined' && response.stat === 'fail') {
                        showMessage(response.message);
                        return;
                    }
                    
                    clearMessages();
                    renderGallery(response.photos.photo);

                } else {
                    showMessage('Something went wrong, please try again.');
                }
            }
        };

        requestTimer = setTimeout(function () {
            showMessage('Slow loading... Your connection might be slow or the API is overloaded.');
        }, 5000);
        searchRequest.send();
    }

    /**
     * Render search result
     * @param {Array} photos
     */
    function renderGallery (photos) {
        var imageContainer;

        options.element.innerHTML = '';

        photos.forEach(function (photo, i) {
            imageContainer = document.createElement('div');
            imageContainer.className = options.photoClass;
            imageContainer.style.backgroundImage = 'url(http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_' + 'm.jpg)';
            imageContainer.style.height = itemWidth || imageContainer.style.height;

            options.element.appendChild(imageContainer);

            if (i === 0) {
                itemWidth = window.getComputedStyle(imageContainer, null).getPropertyValue('width');
                imageContainer.style.height = itemWidth;
            }
        });
    }

    /**
     * Window resize event
     */
    function galleryResizeEvent () {
        if (!options.element.firstElementChild || !options.element.firstElementChild.classList.contains(options.photoClass)) {
            return;
        }

        var newWidth = window.getComputedStyle(options.element.firstElementChild, null).getPropertyValue('width');
        if (newWidth !== itemWidth) {
            itemWidth = newWidth;
            options.element.querySelectorAll('.' + options.photoClass).forEach(function (item) {
                item.style.height = itemWidth;
            });
        }
    }

    window.addEventListener('resize', galleryResizeEvent, false);

    return {
        search: search
    };

});