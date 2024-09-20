// http://www.quirksmode.org/js/cookies.html

// **************************************************** create_cookie

/// <synopsis>
///     create_cookie ( name, value, days );
/// </synopsis>
///
/// <summary>
///     creates a cookie with the specified name, value, and
///     expiration
/// </summary>
///
/// <param name="name">
///     a string containing the name of the cookie. if a cookie
///     with the same name exists, it will be overwritten.
/// </param>
///
/// <param name="value">
///     a string containing the value to be assigned to the
///     cookie
/// </param>
///
/// <param name="days">
///     the cookie expiration, specified in days
/// </param>
///
/// <example>
///     When calling createCookie() you have to give it three
///     three pieces of information: the name and value of the
///     cookie and the number of days it is to remain active.
///     For example, to set a cookie named 'mycookie' to the value
///     'mycookievalue' and have it active for 7 days, use
///
///         create_cookie ( 'mycookie', 'mycookievalue', 7 );
///
///     If you want the cookie to exist as a session cookie, that is
///     the cookie is trashed when the user closes the browser,
///     set the number of days to 0.
///
///     If you set the number of days to a negative number, the
///     cookie is trashed immediately.
/// <example>

function create_cookie(name, value, days) {
  var expires = "";

  if (days) {
    var date = new Date();

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
  }

  document.cookie = name + "=" + value + expires + "; path=/";
}

// ****************************************************** read_cookie

/// <synopsis>
///     var cookie = read_cookie ( name );
///     if ( cookie )
///       {
///       // do something with the cookie value
///       }
/// </synopsis>
///
/// <summary>
///     reads the value of a cookie
/// </summary>
///
/// <param name="name">
///     a string containing the name of the cookie to be read
/// </param>
///
/// <returns>
///     if the cookie exists, a string containing the value of
///     the cookie; otherwise, null
/// </returns>

function read_cookie(name) {
  var cookie = null;

  if (document.cookie.length > 0) {
    var cookies = document.cookie.split(";");
    var name_with_equal = name + "=";

    for (var i = 0; i < cookies.length; i++) {
      var a_cookie = cookies[i];

      a_cookie = a_cookie.replace(/^\s*/, "");
      if (a_cookie.indexOf(name_with_equal) === 0) {
        cookie = a_cookie.substring(name_with_equal.length, a_cookie.length);
        break;
      }
    }
  }

  return cookie;
}

// ***************************************************** erase_cookie

/// <synopsis>
///     erase_cookie ( name );
/// </synopsis>
///
/// <summary>
///     remove the specified cookie
/// </summary>
///
/// <param name="name">
///     a string containing the name of the cookie to be removed
/// </param>

function erase_cookie(name) {
  create_cookie(name, "", -1);
}
