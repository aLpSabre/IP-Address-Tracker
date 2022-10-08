# Frontend Mentor - IP address tracker solution

This is a solution to the [IP address tracker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
- [Author](#author)


## Overview

### The challenge

Users should be able to:

- View the optimal layout for each page depending on their device's screen size
- See their own IP address on the map on the initial page load
- Search for any IP addresses or domains and see the key-information and location

--I also added this functionalies: 

Users should be able to:
- Search for any IP addresses or domains in n both formats IPv4 and IPv6 
- See the instructions to use the application at their first visit
- See the ip adresses that they searched for before in the ip tracker
- See the information about the marker, when they clicked on it
- Delete the markers 

### Screenshot
-💻 Desktop-View
![](./gifs/desktop-gif.gif)

![](./gifs/desktop-gif-2.gif)

-📱 Mobile-View
![](./gifs/mobile-view.gif)


### Links

- Solution URL: [click here.](https://github.com/aLpSabre/IP-Adress-Tracker)
- Live Site URL: [click here.](https://ip-trackerr.netlify.app/)

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Bootstrap
- Flexbox
- Mobile-first workflow
- JavaScript-DOM 

### What I learned

I have learned how to fetch data from an API with asyn functions and use special methods from the API's


```js
const getIP = async function (ip) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);

    if (res.error) {
      renderError();
      throw new Error(`${res.status}`);
    }
    const data = await res.json();
    renderData(data);
  }
  catch (error) {
    
  }
}
```
### Useful resources

- [Leaflet JS Library](https://leafletjs.com/examples/quick-start/) -I used this JS Library for the interactive map on the project.
- [IAPI](https://ipapi.co/) -I used this API to get the informations about IP's.
- [Ipify](https://www.ipify.org/) -I used this API to get the informations about IP's.
- [JAWG](https://www.jawg.io/docs/) -I used the tile for the map with Leaflet.
- [Leaflet Providers](https://github.com/leaflet-extras/leaflet-providers) -An extension to Leaflet that contains configurations for various free tile providers.

## Author

- Frontend Mentor - [@alpbrace](https://www.frontendmentor.io/profile/alpbrace)
