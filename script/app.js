function getStorageType(type) {
  return window[type];
}

function storageAvailable(type) {
  try {
    var storage = getStorageType('localStorage');
    x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    console.log(e);
    return false;
  }
}

function clearWebStorageFields(){
  console.log("Clearing");
  var 
    fields = [
      'first-name',
      'last-name',
      'age',
      'email'
    ],
    store= getStorageType('localStorage');
    if ( storageAvailable() ){
      for( var i = 0; i < fields.length; i++ ){
        store.removeItem(fields[i]);
      }
    }
}

function deleteFavItem(index){
  console.log("delete fav item " + index);
  var items = getFavItems(),
    ret = [];
  if (items && items.length){
    items.map( function ( item, ind ) {
      if ( ind !== index ){
        ret.push(item);
      }
    } );
    setFavItems(ret);
    rebuildFavList();
  }
}

function getFavItems(){
  var store= getStorageType('localStorage');
  var items = store.getItem('fav-item');
  if ( !items ){
    items = [];
  } else {
    items = JSON.parse(items);
  }
  if ( !items ){
    items = [];
  }
  return items
}

function setFavItems(p_items){
  p_items = p_items || [];
  p_items = JSON.stringify(p_items);
  if ( p_items && storageAvailable('localStorage') ){
    var store= getStorageType('localStorage');
    store.setItem('fav-item', p_items);
  }
}

function rebuildFavList(){
  var items = getFavItems(), 
    list = $('#favList');
  list.html("");
  if ( list && list.length && items && items.length ){
    items.forEach( function( item, index ){
      var cl = "";
      if ( index === 0 ){
        cl = " ui-first-child";
      } else if ( index === items.length - 1 ){
        cl = " ui-last-child";
      }
      var link = document.createElement("a");

      (function(ind) {
        link.addEventListener('click', function(){
          deleteFavItem(ind); 
        } );
      })(index);
      list.append($('<li><a>' + item + '</a></li>').append(link));
    } ); 
  }
  list.listview().listview('refresh');
}

$(document).ready( function(){
  var 
    store= getStorageType('localStorage'),
    fname= $("#sign-in-fname"),
    lname= $("#sign-in-lname"),
    email= $("#sign-in-email"),
    age= $("#sign-in-age"),
    info = $("#user-info");

  var 
  updateInfo = function(fval, lval, emailVal, ageVal ){
    if ( fval !== null && lval !== null && emailVal !== null ){
      fname.val(fval);
      lname.val(lval);
      email.val(emailVal);
      info.html(" " +
        "<h3>User Data</h3>" +
        "<p>" +
          "<strong>First Name</strong>: " + fval + "<br>" +
          "<strong>Last Name</strong>: " + lval + "<br>" +
          "<strong>Email</strong>: " + emailVal + "<br>" +
          "<strong>Age</strong>: " + ageVal + 
        "</p>" +
        "<button class='ui-btn' id='clear-storage' type='button' onClick='clearWebStorageFields'>Clear Storage</button>"
      );
      $("button#clear-storage").click( function(e){
        e.preventDefault();
        clearWebStorageFields();
        alert("The Web Storage has been cleared");
        info.removeClass("active");
      } );
      info.addClass("active");
    } 
  };

  // Auto fill with stored data if available
  if ( storageAvailable('localStorage') ){
    store = getStorageType('localStorage');
    var fval = store.getItem('first-name'),
      lval = store.getItem('last-name'),
      ageVal = store.getItem('age'),
      emailVal = store.getItem('email');
    updateInfo(fval, lval, emailVal, ageVal);
  }

  // Store Sign In information in WebStorage 
  $('#sign-in-form').on('submit', function(event){
    event.preventDefault();    
    if ( storageAvailable('localStorage') ){
      if ( !fname.val() || !lname.val() || !email.val() || !age.val()){
        alert("You must complete all fields");
      } else {
        store.setItem('first-name', fname.val());
        store.setItem('last-name', lname.val());
        store.setItem('email', email.val());
        store.setItem('age', age.val());
        updateInfo(fname.val(), lname.val(), email.val(), age.val());
        alert("Your information has been saved!  Thanks!");
      }
    } else {
      alert("Your browser doesn't support web storage, and that feature is required to sign in.");
    }
  } );

  $('#favForm').on('submit', function(event){
    event.preventDefault();
    var items,
      item = $("#fav-item");
    if ( storageAvailable('localStorage') ){
      if ( !item.val() ){
        alert("You must enter an item.");
      } else {
        items = getFavItems();
        items.push(item.val());
        item.val("");
        setFavItems(items);
        rebuildFavList();
      } 
    }
  } );
  setTimeout(rebuildFavList, 1200);
} );
