// ******************************************************** next_page

// Pre Condition:
//
// No two pages in the website may have the same file name, even if
// they are in different website directories.

function next_page(target) {
  var current_index;
  var current_page = document.location.href;
  var target_index;
  var target_page = target;

  current_index = current_page.lastIndexOf("/");
  if (current_index >= 0) {
    current_page = current_page.substring(current_index + 1);
  }
  current_page = current_page.toString().toLowerCase();

  target_index = target.lastIndexOf("/");
  if (target_index >= 0) {
    target_page = target_page.substring(target_index + 1);
  }
  target_page = target_page.toString().toLowerCase();

  if (target_page != current_page) {
    document.location.href = target;
  }

  return true;
}
