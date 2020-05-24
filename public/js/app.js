//globally defined Snapchat name and email address.
var nameValue = "Friendo";
var emailValue = "";

// ** This is the start of the Snap Kit Login Kit code **

//The code executed in this function will act when the SDK is loaded.
window.snapKitInit = function () {
  var loginButtonIconId = 'my-login-button-target';
  // Mount Login Button
  snap.loginkit.mountButton(loginButtonIconId, {
    clientId: '90c64e66-1f87-487d-bddc-03b5d012e7c3',
    redirectURI: 'http://localhost:3000/',
    scopeList: [
      'user.display_name',
      'user.bitmoji.avatar',
      'user.external_id'
    ],
    // requesting the user info from the login process
    handleResponseCallback: function() {
  snap.loginkit.fetchUserInfo().then(function(result) {
  // confirming that the user data has been retrieved
  console.log('User info:', result.data.me);

  //storing the snapchat name globally for later use
  nameValue = String(result.data.me.displayName);

  //changing the HTML for the welcome message
  document.getElementById("display_name").innerHTML = "Welcome, " + nameValue + "!";

  //changing the HTML for the bitmoji avatar
  document.getElementById("bitmoji").src = result.data.me.bitmoji.avatar;

  document.getElementById("external_id").src = result.data.me.externalId;
  }, function(err) {
    console.log(err); // Error
  });  
    },
  });
};

// Load the SDK asynchronously
(function (d, s, id) {
  var js, sjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://sdk.snapkit.com/js/v1/login.js";
  sjs.parentNode.insertBefore(js, sjs);
}(document, 'script', 'loginkit-sdk'));


//Mostly, this part generates a list of beaches and cleanups, and enables filtering results
let beachesLocations;
let cleanUpsLocations;

const getBeachesContainer = () => document.getElementById("beaches-container");
const getCleanUpsContainer = () => document.getElementById("clean-ups-container");
const getFilter = () => document.getElementById('filter');

const clearContainer = (container) => container.innerHTML = '';

const showBeaches = (beaches) => {
  const beachesContainer = getBeachesContainer();
  clearContainer(beachesContainer);

  beaches.forEach((beach) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("item");
    cardContainer.classList.add("item-container");

    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("beach");
    cardContainer.appendChild(card);

    const beachName = document.createElement("span");
    beachName.innerHTML = beach.NameMobileWeb;
    card.appendChild(beachName);

    const beachLocation = document.createElement("span");
    beachLocation.innerHTML = beach.LocationMobileWeb;
    beachLocation.classList.add("card-details");
    beachLocation.classList.add("truncate");
    card.appendChild(beachLocation);

    const county = document.createElement("span");
    county.innerHTML = beach.COUNTY;
    county.classList.add("card-details");
    card.appendChild(county);

    const subscribeContainer = document.createElement("div");
    subscribeContainer.classList.add("subscribe-container");
    card.appendChild(subscribeContainer);

    const subscribeInput = document.createElement("input")
    subscribeInput.placeholder = "Email me on the next clean up date"
    subscribeInput.classList.add("subscribe-input");
    subscribeContainer.appendChild(subscribeInput);

    const afterSubscribeMessage = document.createElement("span");
    afterSubscribeMessage.innerHTML = "Thanks for subscribing! We'll be in touch soon...";
    afterSubscribeMessage.classList.add("thanks");

    const subcribeButton = document.createElement("button");
    subcribeButton.classList.add("subscribe-btn");
    subcribeButton.innerHTML = 'Send';
    subscribeContainer.appendChild(subcribeButton);

    subcribeButton.onclick = () => {
      emailValue = String(document.getElementsByClassName("subscribe-input")[0].value);
      subscribeInput.remove()
      subcribeButton.remove()
      subscribeContainer.appendChild(afterSubscribeMessage);
      Email.send({
        Host : "smtp.elasticemail.com",
        Username : "snapkit@fastmail.com",
        Password : "E6C006E03E277BFD5F13EBE9A7CAD0764156",
        To : emailValue,
        From : "snapkit@fastmail.com",
        Subject : String("Hey, " + nameValue + "!"),
        Body : "Thanks so much for dedicating your time to clean up the beach."
    }).then(
      message => alert(message)
    );
    }

    beachesContainer.appendChild(cardContainer);
  });

  activateCarousel();
}

const showCleanUps = (cleanUps) => {
  const cleanUpsContainer = getCleanUpsContainer();
  clearContainer(cleanUpsContainer);

  cleanUps.forEach((cleanUp) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("clean-up");
    cleanUpsContainer.appendChild(card);

    const organization = document.createElement("span");
    organization.innerHTML = cleanUp.organization;
    organization.classList.add("card-details");
    card.appendChild(organization);

    const website = document.createElement("a");
    website.innerHTML = cleanUp.website || '';
    website.href = cleanUp.website;
    website.target = 'blank';
    website.classList.add("truncate");
    website.classList.add("card-details");
    card.appendChild(website);

    const county = document.createElement("span");
    county.innerHTML = cleanUp.county_region;
    county.classList.add("card-details");
    card.appendChild(county);

    const date = document.createElement("span");
    date.innerHTML = (new Date(cleanUp.cleanup_date)).toLocaleDateString();
    date.classList.add("card-details");
    card.appendChild(date);

    const time = document.createElement("span");
    time.innerHTML = cleanUp.start_time ? (cleanUp.start_time +  ' - ' + cleanUp.end_time) : '';
    time.classList.add("card-details");
    card.appendChild(time);
  });
};

const fetchBeachesInformation = () => {
  const url = "https://api.coastal.ca.gov/access/v1/locations";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      beachesLocations = data;
      showAllBeaches();
    });
};

const fetchCleanUpsInformation = () => {
  const url = "https://api.coastal.ca.gov/ccd/v1/locations";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      cleanUpsLocations = data.filter((c) => c.cleanup_date && c.county_region);
      showAllCleanUps();
    });
};

const showAllBeaches = () => {
  showBeaches(beachesLocations);
}

const showAllCleanUps = () => {
  showCleanUps(cleanUpsLocations);
}

const filterLocations = ()  => {
  const filterValue = getFilter().value;

  const filteredBeaches = beachesLocations.filter((beach) => {
    return beach.NameMobileWeb.toLowerCase().includes(filterValue.toLowerCase()) ||
    beach.COUNTY.toLowerCase().includes(filterValue.toLowerCase())
  });

  showBeaches(filteredBeaches);

  const filteredCleanUps = cleanUpsLocations.filter((beach) => {
    return beach.county_region.toLowerCase().includes(filterValue.toLowerCase());
  });

  showCleanUps(filteredCleanUps);
}

window.onload = () => {
  fetchBeachesInformation();
  fetchCleanUpsInformation();

  getFilter().onkeyup = filterLocations
}
