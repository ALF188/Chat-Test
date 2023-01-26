var ctrlDown = false;

$(function () {
  $(document).on("click", ".user", function () {
    let to = document.getElementById("to");
    to.value = this.innerText;
    jQuery.data(to, "priv", this.id);
  });
});
$(function () {
  $(document).on("click", "#to", function () {
    let to = document.getElementById("to");
    to.value = "";
    jQuery.removeData(to, "priv");
  });
});
$("document").ready(function () {
  $("#file").change(function () {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#profilePic").attr("src", e.target.result);
        localStorage.setItem("profilePic", e.target.result);
        socket.emit(
          "updateUserList",
          document.getElementById("username").value,
          socket.id,
          document.getElementById("profilePic").src
        );
      };
      reader.readAsDataURL(this.files[0]);
    }
  });
});
$(function () {
  var availableTags = [
    "/clear",
    "/dadjoke",
    "/me",
    "/play",
    "/listPlay",
    "/upload",
    "/video",
  ];
  $("#input").autocomplete({
    source: function (request, response) {
      var matcher = new RegExp(
        "^" + $.ui.autocomplete.escapeRegex(request.term),
        "i"
      );
      response(
        $.grep(availableTags, function (item) {
          return matcher.test(item);
        })
      );
    },
    position: { my: "left top", at: "left top" },
    open: function (event) {
      var $input = $(event.target),
        $results = $input.autocomplete("widget"),
        top = $results.position().top,
        height = $results.height(),
        inputHeight = $input.height(),
        newTop = top - height - inputHeight;

      $results.css("top", newTop + "px");
    },
  });
});
$(window).keydown(function (e) {
  switch (e.keyCode) {
    case 191: // left arrow key
      var hasFocus = $("input").is(":focus");
      if (!hasFocus) {
        e.preventDefault();
        document.getElementById("input").focus();
      }
      break;
    case 17:
      e.preventDefault();
      ctrlDown = true;
      break;
  }
});
$(window).keyup(function (e) {
  switch (e.keyCode) {
    case 17:
      ctrlDown = false;
      document.getElementById("elements").innerText = "";
      break;
  }
});
$(window).on("offline", function () {
  document.getElementById("offline").classList.add("offline");
});
$(window).on("online", function () {
  document.getElementById("offline").classList.remove("offline");
  let messages = document.getElementById("userList");
  while (messages.firstChild != undefined) {
    messages.removeChild(messages.childNodes[0]);
  }
  socket.emit("redoUserList");
});
$("document").ready(function () {
  $("#upload").change(function () {
    if (this.files && this.files[0]) {
      socket.emit("newFile", this.files[0], this.files[0].name);
      document.getElementById("upload").value = "";
    }
  });
});
document.addEventListener(
  "mousemove",
  (e) => {
    let element = document.elementFromPoint(e.clientX, e.clientY);
    if (ctrlDown) {
      if (element.id) {
        document.getElementById("elements").innerText = element.id;
      } else if (element.className) {
        document.getElementById("elements").innerText = element.className;
      }
    }
  },
  { passive: true }
);
$(function () {
  $(document).on("click", function (e) {
    if (ctrlDown) {
      let element = document.elementFromPoint(e.clientX, e.clientY);
      let title = document.getElementById("modal-title");
      let title2 = title.innerText.replace(" id ", element.id);
      title.innerHTML = title2;
      var modal = document.getElementById("myModal");
      modal.style.display = "block";
    }
  });
});
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  modal.style.display = "none";
  let title = document.getElementById("modal-title");
  title.innerHTML = "Change Color of... { id  }";
  document.getElementById("modal-color-picker").value = "000000";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    let title = document.getElementById("modal-title");
    title.innerHTML = "Change Color of... { id }";
    document.getElementById("modal-color-picker").value = "000000";
  }
};
$("document").ready(function () {
  $("#modal-color-picker").change(function () {
    let id = document
      .getElementById("modal-title")
      .innerText.replace("Change Color of... {", "")
      .replace("}", "");
    let color = this.value;
    let element = document.getElementById(id);
    if (element) {
      if (id == "chatBox") document.body.style.backgroundColor = color;
      element.style.backgroundColor = color;
    } else {
      modal.style.display = "none";
      let title = document.getElementById("modal-title");
      title.innerHTML = "Change Color of... { id }";
    }
  });
});
document.addEventListener("visibilitychange", function () {
  ctrlDown = false;
  document.getElementById("elements").innerText = "";
});
