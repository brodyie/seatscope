// concert data
var concerts = [
  { id: 1, name: "Drake", venue: "Madison Square Garden, NYC", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80", price: 180, demand: 82, genre: "hip-hop", date: Date.now() + 86400000 * 15 },
  { id: 2, name: "Travis Scott", venue: "Toyota Center, Houston", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80", price: 150, demand: 67, genre: "hip-hop", date: Date.now() + 86400000 * 8 },
  { id: 3, name: "Taylor Swift", venue: "SoFi Stadium, LA", image: "https://images.unsplash.com/photo-1501386761578-eaa54b915ac3?w=600&q=80", price: 220, demand: 96, genre: "pop", date: Date.now() + 86400000 * 4 },
  { id: 4, name: "The Weeknd", venue: "Rogers Centre, Toronto", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80", price: 200, demand: 78, genre: "r&b", date: Date.now() + 86400000 * 22 },
  { id: 5, name: "Doja Cat", venue: "Barclays Center, NYC", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80", price: 135, demand: 71, genre: "pop", date: Date.now() + 86400000 * 11 },
  { id: 6, name: "Calvin Harris", venue: "Wembley Arena, London", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80", price: 120, demand: 60, genre: "edm", date: Date.now() + 86400000 * 30 }
];

// keep track of stuff
var cart = JSON.parse(localStorage.getItem("cart")) || [];
var saved = JSON.parse(localStorage.getItem("saved")) || [];
var currentGenre = "all";
var currentConcertId = null;
var selectedSeat = null;
var filtered = [];

// run when page loads
window.onload = function() {
  // hide preloader after a sec
  setTimeout(function() {
    var pre = document.getElementById("preloader");
    pre.style.opacity = "0";
    setTimeout(function() {
      pre.style.display = "none";
    }, 500);
  }, 1000);

  filtered = concerts;
  renderCards();
  updateCart();
  renderSaved();

  // countdown updates every second
  setInterval(updateCountdowns, 1000);
};

// render the concert cards
function renderCards() {
  var container = document.getElementById("concerts");
  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results">🔍 No events found</div>';
    return;
  }

  for (var i = 0; i < filtered.length; i++) {
    var c = filtered[i];
    var isHot = c.demand >= 75;
    var isSaved = false;

    // check if saved
    for (var s = 0; s < saved.length; s++) {
      if (saved[s] === c.id) {
        isSaved = true;
      }
    }

    var hotBadge = "";
    if (isHot) {
      hotBadge = '<div class="badge-hot">🔥 Selling Fast</div>';
    } else {
      hotBadge = '<div></div>';
    }

    var heartIcon = isSaved ? "❤️" : "🤍";
    var savedClass = isSaved ? "badge-save saved" : "badge-save";

    var html = '<div class="card">';
    html += '<div class="card-img-wrap">';
    html += '<img src="' + c.image + '" alt="' + c.name + '">';
    html += '<div class="card-badges">';
    html += hotBadge;
    html += '<div class="' + savedClass + '" onclick="toggleSave(event, ' + c.id + ')">' + heartIcon + '</div>';
    html += '</div>';
    html += '<div class="countdown-bar" id="cd-' + c.id + '" data-date="' + c.date + '">';
    html += '<div class="cd-block"><div class="cd-num" id="cd-d-' + c.id + '">--</div><div class="cd-label">Days</div></div>';
    html += '<div class="cd-block"><div class="cd-num" id="cd-h-' + c.id + '">--</div><div class="cd-label">Hrs</div></div>';
    html += '<div class="cd-block"><div class="cd-num" id="cd-m-' + c.id + '">--</div><div class="cd-label">Min</div></div>';
    html += '<div class="cd-block"><div class="cd-num" id="cd-s-' + c.id + '">--</div><div class="cd-label">Sec</div></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="card-content">';
    html += '<div class="card-genre">' + c.genre + '</div>';
    html += '<h3>' + c.name + '</h3>';
    html += '<div class="card-venue">📍 ' + c.venue + '</div>';
    html += '<div class="demand-label-row"><span>Demand</span><span>' + c.demand + '%</span></div>';
    html += '<div class="demand-bar"><div class="demand-fill" style="width: ' + c.demand + '%;"></div></div>';
    html += '<div class="card-footer">';
    html += '<div class="card-price">$' + c.price + '</div>';
    html += '<button class="add-btn" onclick="openSeatModal(' + c.id + ')">Pick Seats →</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    container.innerHTML += html;
  }
}

// countdown timer
function updateCountdowns() {
  for (var i = 0; i < filtered.length; i++) {
    var c = filtered[i];
    var diff = c.date - Date.now();

    if (diff <= 0) continue;

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);

    // pad with zero if single digit
    if (days < 10) days = "0" + days;
    if (hours < 10) hours = "0" + hours;
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;

    var dEl = document.getElementById("cd-d-" + c.id);
    var hEl = document.getElementById("cd-h-" + c.id);
    var mEl = document.getElementById("cd-m-" + c.id);
    var sEl = document.getElementById("cd-s-" + c.id);

    if (dEl) dEl.innerHTML = days;
    if (hEl) hEl.innerHTML = hours;
    if (mEl) mEl.innerHTML = mins;
    if (sEl) sEl.innerHTML = secs;
  }
}

// search - runs on every keyup
function searchConcerts() {
  var query = document.getElementById("search-input").value.toLowerCase();
  filtered = [];

  for (var i = 0; i < concerts.length; i++) {
    var nameMatch = concerts[i].name.toLowerCase().indexOf(query) !== -1;
    var venueMatch = concerts[i].venue.toLowerCase().indexOf(query) !== -1;
    var genreMatch = currentGenre === "all" || concerts[i].genre === currentGenre;

    if ((nameMatch || venueMatch) && genreMatch) {
      filtered.push(concerts[i]);
    }
  }

  renderCards();
}

// filter by genre
function filterGenre(btn, genre) {
  // remove active from all buttons
  var buttons = document.getElementsByClassName("filter-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  btn.classList.add("active");

  currentGenre = genre;
  filtered = [];

  var query = document.getElementById("search-input").value.toLowerCase();

  for (var i = 0; i < concerts.length; i++) {
    var nameMatch = concerts[i].name.toLowerCase().indexOf(query) !== -1;
    var venueMatch = concerts[i].venue.toLowerCase().indexOf(query) !== -1;
    var genreMatch = genre === "all" || concerts[i].genre === genre;

    if ((nameMatch || venueMatch) && genreMatch) {
      filtered.push(concerts[i]);
    }
  }

  renderCards();
}

// sort by price low to high
function sortByPrice() {
  // bubble sort - learned this in class lol
  for (var i = 0; i < filtered.length; i++) {
    for (var j = 0; j < filtered.length - 1; j++) {
      if (filtered[j].price > filtered[j + 1].price) {
        var temp = filtered[j];
        filtered[j] = filtered[j + 1];
        filtered[j + 1] = temp;
      }
    }
  }
  renderCards();
}

// sort by demand high to low
function sortByDemand() {
  for (var i = 0; i < filtered.length; i++) {
    for (var j = 0; j < filtered.length - 1; j++) {
      if (filtered[j].demand < filtered[j + 1].demand) {
        var temp = filtered[j];
        filtered[j] = filtered[j + 1];
        filtered[j + 1] = temp;
      }
    }
  }
  renderCards();
}

// open the seat picker
function openSeatModal(id) {
  currentConcertId = id;
  selectedSeat = null;

  var concert = null;
  for (var i = 0; i < concerts.length; i++) {
    if (concerts[i].id === id) {
      concert = concerts[i];
    }
  }

  document.getElementById("seat-title").innerHTML = "Pick Your Seat — " + concert.name;
  document.getElementById("seat-venue").innerHTML = concert.venue;
  document.getElementById("vip-price").innerHTML = concert.price + 60;
  document.getElementById("std-price").innerHTML = concert.price;
  document.getElementById("bud-price").innerHTML = Math.round(concert.price * 0.65);
  document.getElementById("seat-summary-text").innerHTML = "No seat selected";

  buildSeats("vip-rows", "vip", 2, 8, concert.price + 60);
  buildSeats("std-rows", "standard", 3, 10, concert.price);
  buildSeats("bud-rows", "budget", 3, 12, Math.round(concert.price * 0.65));

  document.getElementById("seat-modal").classList.add("open");
}

// builds the seat grid
function buildSeats(containerId, type, rows, cols, price) {
  var container = document.getElementById(containerId);
  container.innerHTML = "";

  for (var r = 0; r < rows; r++) {
    var rowDiv = document.createElement("div");
    rowDiv.className = "seat-row";

    for (var c = 0; c < cols; c++) {
      var isTaken = Math.random() < 0.28;
      var btn = document.createElement("button");
      var label = String.fromCharCode(65 + r) + (c + 1);

      btn.className = "seat " + type;
      btn.innerHTML = label;

      if (isTaken) {
        btn.className += " taken";
        btn.disabled = true;
      } else {
        // this part was tricky - had to use a closure
        btn.onclick = (function(el, t, l, p) {
          return function() {
            pickSeat(el, t, l, p);
          };
        })(btn, type, label, price);
      }

      rowDiv.appendChild(btn);
    }

    container.appendChild(rowDiv);
  }
}

// when you click a seat
function pickSeat(el, type, label, price) {
  // deselect everything first
  var allSeats = document.getElementsByClassName("seat");
  for (var i = 0; i < allSeats.length; i++) {
    allSeats[i].classList.remove("selected");
  }

  el.classList.add("selected");
  selectedSeat = { type: type, label: label, price: price };
  document.getElementById("seat-summary-text").innerHTML = label + " · " + type + " · $" + price;
}

function closeSeatModal() {
  document.getElementById("seat-modal").classList.remove("open");
  selectedSeat = null;
  currentConcertId = null;
}

// add selected seat to cart
function confirmSeat() {
  if (selectedSeat === null) {
    showToast("Pick a seat first!", "error");
    return;
  }

  var concert = null;
  for (var i = 0; i < concerts.length; i++) {
    if (concerts[i].id === currentConcertId) {
      concert = concerts[i];
    }
  }

  var item = {
    cartId: Date.now(),
    name: concert.name,
    price: selectedSeat.price,
    seat: selectedSeat.label,
    type: selectedSeat.type,
    qty: 1
  };

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  closeSeatModal();
  showToast(concert.name + " · Seat " + selectedSeat.label + " added!");
}

// update cart display
function updateCart() {
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    count = count + cart[i].qty;
  }
  document.getElementById("cart-count").innerHTML = count;

  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total = total + (cart[i].price * cart[i].qty);
  }
  document.getElementById("cart-total-val").innerHTML = "$" + total;
  document.getElementById("pay-total").innerHTML = total;

  var itemsEl = document.getElementById("cart-items");

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty-msg">🎟 Your cart is empty</div>';
    return;
  }

  itemsEl.innerHTML = "";

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var itemHtml = '<div class="cart-item">';
    itemHtml += '<div>';
    itemHtml += '<h4>' + item.name + '</h4>';
    itemHtml += '<div class="cart-item-sub">$' + item.price + ' per ticket</div>';
    itemHtml += '<div class="cart-seat-label">Seat ' + item.seat + ' · ' + item.type + '</div>';
    itemHtml += '</div>';
    itemHtml += '<div class="cart-item-right">';
    itemHtml += '<div class="cart-item-price">$' + (item.price * item.qty) + '</div>';
    itemHtml += '<div class="qty-controls">';
    itemHtml += '<button class="qty-btn" onclick="changeQty(' + item.cartId + ', -1)">−</button>';
    itemHtml += '<span class="qty-num">' + item.qty + '</span>';
    itemHtml += '<button class="qty-btn" onclick="changeQty(' + item.cartId + ', 1)">+</button>';
    itemHtml += '</div>';
    itemHtml += '<button class="remove-item-btn" onclick="removeItem(' + item.cartId + ')">🗑</button>';
    itemHtml += '</div>';
    itemHtml += '</div>';
    itemsEl.innerHTML += itemHtml;
  }
}

function changeQty(cartId, delta) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].cartId === cartId) {
      cart[i].qty = cart[i].qty + delta;
      if (cart[i].qty < 1) {
        cart[i].qty = 1;
      }
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function removeItem(cartId) {
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].cartId !== cartId) {
      newCart.push(cart[i]);
    }
  }
  cart = newCart;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function toggleCart() {
  var panel = document.getElementById("cart-panel");
  if (panel.classList.contains("open")) {
    panel.classList.remove("open");
  } else {
    panel.classList.add("open");
  }
}

// save / unsave events
function toggleSave(event, id) {
  event.stopPropagation();

  var alreadySaved = false;
  for (var i = 0; i < saved.length; i++) {
    if (saved[i] === id) {
      alreadySaved = true;
    }
  }

  if (alreadySaved) {
    var newSaved = [];
    for (var i = 0; i < saved.length; i++) {
      if (saved[i] !== id) {
        newSaved.push(saved[i]);
      }
    }
    saved = newSaved;
    showToast("Removed from saved");
  } else {
    saved.push(id);
    showToast("❤️ Event saved!");
  }

  localStorage.setItem("saved", JSON.stringify(saved));
  renderSaved();
  renderCards();
}

function renderSaved() {
  var section = document.getElementById("saved-section");
  var grid = document.getElementById("saved-grid");

  if (saved.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  grid.innerHTML = "";

  for (var i = 0; i < saved.length; i++) {
    var concert = null;
    for (var j = 0; j < concerts.length; j++) {
      if (concerts[j].id === saved[i]) {
        concert = concerts[j];
      }
    }
    if (concert === null) continue;

    var pill = '<div class="saved-pill">';
    pill += '<div>';
    pill += '<div class="saved-pill-name">' + concert.name + '</div>';
    pill += '<div class="saved-pill-price">From $' + Math.round(concert.price * 0.65) + '</div>';
    pill += '</div>';
    pill += '<button class="saved-remove" onclick="toggleSave(event, ' + concert.id + ')">✕</button>';
    pill += '</div>';
    grid.innerHTML += pill;
  }
}

// checkout
function openCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }
  document.getElementById("checkout-form").style.display = "block";
  document.getElementById("success-screen").style.display = "none";
  document.getElementById("checkout-modal").classList.add("open");
  // close cart panel too
  document.getElementById("cart-panel").classList.remove("open");
}

function closeCheckout() {
  document.getElementById("checkout-modal").classList.remove("open");
}

function processPayment() {
  var name = document.getElementById("f-name").value;
  var email = document.getElementById("f-email").value;
  var card = document.getElementById("f-card").value;
  var exp = document.getElementById("f-exp").value;
  var cvv = document.getElementById("f-cvv").value;

  // basic check - make sure nothing is empty
  if (name === "" || email === "" || card.length < 19 || exp.length < 5 || cvv.length < 3) {
    showToast("Please fill in all fields!", "error");
    return;
  }

  document.getElementById("checkout-form").style.display = "none";
  document.getElementById("success-screen").style.display = "block";

  // clear cart after purchase
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();

  setTimeout(function() {
    closeCheckout();
  }, 4000);
}

// auto format card number with spaces
function formatCard(el) {
  var val = el.value.replace(/\D/g, "");
  var formatted = "";
  for (var i = 0; i < val.length && i < 16; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += " ";
    }
    formatted += val[i];
  }
  el.value = formatted;
}

// auto format expiry MM/YY
function formatExp(el) {
  var val = el.value.replace(/\D/g, "");
  if (val.length >= 3) {
    el.value = val.substring(0, 2) + "/" + val.substring(2, 4);
  } else {
    el.value = val;
  }
}

// toast notification
function showToast(msg, type) {
  var toast = document.getElementById("toast");
  toast.innerHTML = msg;
  toast.style.display = "block";
  toast.className = "";

  if (type === "error") {
    toast.className = "error";
  }

  setTimeout(function() {
    toast.style.display = "none";
  }, 2500);
}

// dark/light toggle
function toggleTheme() {
  var body = document.body;
  var btn = document.getElementById("theme-btn");

  if (body.classList.contains("light")) {
    body.classList.remove("light");
    btn.innerHTML = "🌙";
  } else {
    body.classList.add("light");
    btn.innerHTML = "☀️";
  }
}

function scrollToConcerts() {
  document.getElementById("events-section").scrollIntoView({ behavior: "smooth" });
}