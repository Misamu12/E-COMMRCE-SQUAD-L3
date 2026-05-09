$(function(){
}); 
function getData(btn){
  if (typeof event !== 'undefined' && event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
  var $product = $(btn).closest('.product');
  var productName = $(btn).data('product') || $product.find('h3').text().trim();
  var qty = $product.find('input[name="Quantité"]').val();
  var peopleInput = $product.find('input[name="Nombre de personnes"]');
  var people = peopleInput.length ? peopleInput.val() : null;
  console.log({
    product: productName,
    quantite: qty ? parseInt(qty, 10) : null,
    nombreDePersonnes: people ? parseInt(people, 10) : null
  });
  alert(productName + ' ' + qty + ' ' + people);
  alert(JSON.stringify({
    product: productName,
    quantite: qty ? parseInt(qty, 10) : null,
    nombreDePersonnes: people ? parseInt(people, 10) : null
  }, null, 2));
  return false;
}
