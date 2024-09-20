var COOKIE_NAME = "SAVED_VARIABLE_FONT_SIZE";
var DEFAULT_FONT_SIZE = 13;
var MAXIMUM_FONT_SIZE = 24;
var MINIMUM_FONT_SIZE = 8;

var variable_font_rule;

// ************************************************* reduce_font_size

/// <summary>
///     reduces, by one point, the font size of elements that are
///     declared as "class='variable_font'"

function reduce_font_size() {
  if (variable_font_rule) {
    var cookie = read_cookie(COOKIE_NAME);
    var font_size = DEFAULT_FONT_SIZE;

    if (cookie) {
      font_size = parseInt(cookie, 10);
    }

    if (font_size > MINIMUM_FONT_SIZE) {
      font_size--;
      variable_font_rule.style.fontSize = font_size + "px";
      create_cookie(COOKIE_NAME, font_size.toString(), 0);
    }
  }
}

// ************************************************ restore_font_size

/// <summary>
///     restores the font size of elements that are declared as
///     "class='variable_font'" to the default font size

function restore_font_size() {
  if (variable_font_rule) {
    var font_size = DEFAULT_FONT_SIZE;

    variable_font_rule.style.fontSize = font_size + "px";
    create_cookie(COOKIE_NAME, font_size.toString(), 0);
  }
}

// *********************************************** increase_font_size

/// <summary>
///     increases, by one point, the font size of elements that are
///     declared as "class='variable_font'"

function increase_font_size() {
  if (variable_font_rule) {
    var cookie = read_cookie(COOKIE_NAME);
    var font_size = DEFAULT_FONT_SIZE;

    if (cookie) {
      font_size = parseInt(cookie, 10);
    }

    if (font_size < MAXIMUM_FONT_SIZE) {
      font_size++;
      variable_font_rule.style.fontSize = font_size + "px";
      create_cookie(COOKIE_NAME, font_size.toString(), 0);
    }
  }
}

// ********************************************* initialize_font_size

/// <summary>
///     initializes the variable 'variable_font_rule' to point to the
///     rule that controls the font size for all elements that are
///     declared as "class='selector'" in the cascading style sheet
///     named 'css_sheet_name'; reads a cookie to determine the
///     current font size; sets all such elements to the default font
///     size, either read from the cookie or specified by the global
///     variable DEFAULT_FONT_SIZE
/// </summary>
///
/// <param name="css_sheet_name">
///     a string containing the name of the cascading style sheet
///     file name, including the extension
/// </param>
///
/// <param name="selector">
///     a the string containing the selector (class name), found in
///     the specified cascading style sheet; it must include the
///     selector prefix (i.e., '.' for classes)
/// </param>
///

function initialize_font_size(css_sheet_name, selector) {
  if (document.styleSheets && css_sheet_name && selector) {
    var done = false;
    var found = false;
    var i = 0;
    var sheet_rules;
    var sheets = document.styleSheets;
    var the_rules = new Array();

    css_sheet_name = css_sheet_name.toLowerCase();

    i = 0;
    done = i >= sheets.length;
    while (!(done || found)) {
      var sheet_name = sheets[i].href
        .substring(sheets[i].href.lastIndexOf("/") + 1)
        .toLowerCase();
      if (sheet_name == css_sheet_name) {
        the_rules = sheets[i].cssRules || sheets[i].rules;
        found = true;
      } else {
        i++;
        done = i >= sheets.length;
      }
    }

    if (found) {
      found = false;

      i = 0;
      done = i >= the_rules.length;
      while (!(done || found)) {
        found =
          the_rules[i].selectorText.toLowerCase() == selector.toLowerCase();
        if (found) {
          variable_font_rule = the_rules[i];
        } else {
          i++;
          done = i >= the_rules.length;
        }
      }
    }

    if (variable_font_rule) {
      var cookie = read_cookie(COOKIE_NAME);
      var font_size = DEFAULT_FONT_SIZE;

      if (cookie) {
        font_size = parseInt(cookie, 10);
      }
      variable_font_rule.style.fontSize = font_size + "px";
      create_cookie(COOKIE_NAME, font_size.toString(), 0);
    }
  }
}

// ********************************************************* on_keyup

/// <summary>
///     event handler that responds to keyup events by determining
///     what key was released and invoking the appropriate font size
///     function
///
///       '+' - increase font size
///       '-' - decrease font size
///       ' ' - restore font size to default

function on_keyup(e) {
  var code = window.event ? event.keyCode : e.keyCode;

  switch (code) {
    case 109:
    case 189: // '-'
      reduce_font_size();
      break;

    case 107:
    case 187: // '+'
      increase_font_size();
      break;

    case 32: // ' '
      restore_font_size();
      break;

    default: // don't handle it in this module
      break;
  }
}

document.onkeyup = on_keyup;
