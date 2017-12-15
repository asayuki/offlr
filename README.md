# Offlr

A Flickr gallery.
Name is from Discworlds character, Offler in the Deaths domain.

## To use
Include the module in your website like so:
```
<script type="text/javascript" src="offlr.min.js"></script>
<link rel="stylesheet" type="text/css" href="offlr.min.css">
```

And then initiate is where you feel like like so:
```
<div class="fn-offlr-div"></div>

<script type="text/javascript">
    var offlr = new Offlr({
        element: document.querySelector([element_you want to use]),
        api_key: [your_api_key]
    });
</script>
```

### Optional options

* `per_page` - Defaults to 10
* `elementClass` - Defaults to `offlr-gallery`
* `photoClass` - Defaults to `offlr-gallery__photo`
* `search_tag` - Defaults to null

### Public functions

#### search

Example: 
```
var offlr = new Offlr({
    ...
});
document.querySelector('input[name="search"]').addEventListener('change', function (e) {
    offlr.search(e.target.value);
});
```

## Development

`npm run start` to fire up Grunt to watch for changes and a http-server that serves demo/index.html
`npm run build` to build minified js and css-file.

## Todo

* Fix animation for IE/Edge. Right now its just static balls.
    * Problem should be solved by using an element with, for example, two spans instead of using pseudo-elements.
* Show titles in photos on maybe hover.
* Add ability to show large picture by clicking on image.
    * Solution: create a request to flickr.photos.getSizes to get possible sizes for that image and show the one that fits the current browser best.
* WAI-ARIA
* Extend to use other of flickr-apis functions.