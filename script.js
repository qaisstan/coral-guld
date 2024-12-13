$(document).ready(function () {
  function resetFormErrors(formName) {
    $("." + formName + "-form-error").remove();
    $("." + formName + "-form-field").removeClass("border-red-500");
  }

  function resetFormValues(formName) {
    $("#" + formName + "-form").trigger("reset");
  }

  function cloneTemplateElement(elementId) {
    return $("#" + elementId)
      .clone()
      .removeAttr("id")
      .css("display", "table-row");
  }

  function setFieldError(formName, fieldName, errorMessage) {
    const fieldElementName = formName + "-form-" + fieldName;
    const $fieldElement = $("#" + fieldElementName);
    const errorMessageElementName = fieldElementName + "-error";

    // Remove existing error message
    $("#" + errorMessageElementName).remove();

    if (errorMessage !== "") {
      $fieldElement
        .addClass("border-red-500")
        .after(
          `<p class="text-red-500 text-xs italic" id="${errorMessageElementName}">${errorMessage}</p>`
        );
    }
  }

  function itemsTableChanged() {
    let totalPrice = 0;

    $("#items-table > tbody > tr").each(function () {
      const total = $(this).data().totalprice || 0;
      totalPrice += parseFloat(total);
    });

    $("#total-price").text(totalPrice.toFixed(2) + " kr");
  }

  function addFormButtonAction() {
    resetFormErrors("add");

    const data = {
      name: "",
      type: $("#add-form-type").val().trim(),
      karat: $("#add-form-karat").val().trim(),
      color: $("#add-form-color").val().trim(),
      material: $("#add-form-material").val().trim(),
      quantity: parseFloat($("#add-form-quantity").val()),
      price: parseFloat($("#add-form-price").val()),
      weight: $("#add-form-weight").val().trim(),
    };

    let formError = false;

    if (isNaN(data.price) || data.price <= 0) {
      data.price = 0; // Default to 0 if price is empty
    }

    if (isNaN(data.quantity) || data.quantity <= 0) {
      setFieldError("add", "quantity", "Quantity must be greater than 0.");
      formError = true;
    }

    if (!formError) {
      data.totalprice = data.quantity * data.price;

      // Build the name dynamically
      data.name = data.type;

      if (data.material && data.material !== "-") {
        data.name += " - " + data.material;
      }

      if (data.color && data.color !== "-") {
        data.name += " - " + data.color;
      }

      if (data.karat && data.karat !== "-") {
        data.name += " - " + data.karat;
        if (!isNaN(data.karat)) {
          data.name += " karat";
        }
      }

      if (data.weight && data.weight !== "-") {
        data.name += " - " + data.weight;
        if (!isNaN(data.weight)) {
          data.name += "g";
        }
      }

      data.name = data.name.trim();

      const $row = cloneTemplateElement("items-table-row-template");

      $row.data(data);
      $row.find("td:nth-child(1)").text(data.name);
      $row.find("td:nth-child(2)").text(data.material);
      $row.find("td:nth-child(3)").text(data.color);
      $row.find("td:nth-child(4)").text(data.quantity);
      $row.find("td:nth-child(5)").text(data.price.toFixed(2) + " kr");
      $row.find("td:nth-child(6)").text(data.totalprice.toFixed(2) + " kr");
      $row.find(".remove-link").click(itemsTableRemoveLinkAction);

      $("#items-table").find("tbody").append($row);
      resetFormValues("add");
      itemsTableChanged();
    }
  }

  function generateFormButtonAction() {
    resetFormErrors("generate");

    const data = {
      receiptcode: $("#generate-form-receiptcode").val().trim() || "N/A", // Default to 'N/A' if empty
      extra: $("#generate-form-extra").val().trim(),
      namn: $("#generate-form-namn").val().trim(),
      items: [],
    };

    let formError = false;

    // Collect all items
    $("#items-table > tbody > tr").each(function () {
      data.items.push($(this).data());
    });

    if (!data.items.length) {
      alert("You must add at least one item to generate a receipt.");
      formError = true;
    }

    if (!formError) {
      $('<form action="print.php" method="POST"/>')
        .append(
          $('<input type="hidden" name="data">').val(JSON.stringify(data))
        )
        .appendTo($(document.body))
        .submit();
    }
  }

  function itemsTableRemoveLinkAction() {
    const tr = $(this).closest("tr");
    tr.css("background-color", "#fbcccc");
    tr.fadeOut(400, function () {
      tr.remove();
      itemsTableChanged();
    });
  }

  $("#add-form-button").click(addFormButtonAction);
  $("#generate-form-button").click(generateFormButtonAction);
});
