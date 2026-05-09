// Page checkout - création de commande via API
document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('checkout-content');
  if (!content) return;

  if (!auth.isAuthenticated()) {
    content.innerHTML = '<p>Vous devez être connecté pour passer commande. <a href="login.html">Se connecter</a></p>';
    return;
  }

  if (cart.length === 0) {
    content.innerHTML = '<p>Votre panier est vide. <a href="catalogue.html">Voir le catalogue</a></p>';
    return;
  }

  try {
    const livraisons = await api.getLivraisons();
    let subtotal = 0;
    const itemsWithDetails = [];

    for (const item of cart) {
      const p = await api.getProduit(item.id);
      subtotal += p.price * item.quantity;
      itemsWithDetails.push({ ...p, quantity: item.quantity });
    }

    const livraisonGratuite = livraisons.find(l => l.price === 0);
    const livraisonStandard = livraisons.find(l => l.price > 0) || livraisons[0];
    const selectedLivraison = subtotal >= 200 && livraisonGratuite ? livraisonGratuite : livraisonStandard;
    const total = subtotal + (selectedLivraison?.price || 0);

    content.innerHTML = `
      <div class="checkout-layout">
        <div class="checkout-summary">
          <h2>Récapitulatif</h2>
          ${itemsWithDetails.map(i => `
            <div class="checkout-item">
              <span>${i.name} × ${i.quantity}</span>
              <span>${(i.price * i.quantity).toFixed(2)}$</span>
            </div>
          `).join('')}
          <div class="summary-line"><span>Sous-total</span><span>${subtotal.toFixed(2)}$</span></div>
          <div class="summary-line"><span>Livraison (${(selectedLivraison?.name || 'Standard').replace(/€/g, '$')})</span><span>${(selectedLivraison?.price || 0) === 0 ? 'Gratuite' : (selectedLivraison?.price || 0) + '$'}</span></div>
          <div class="summary-total"><span>Total</span><span class="gold">${total.toFixed(2)}$</span></div>
        </div>
        <div class="checkout-actions">
          <p><strong>Livraison :</strong> ${(selectedLivraison?.name || 'Standard').replace(/€/g, '$')}</p>
          <button class="btn" id="confirm-order">Confirmer votre commande</button>
        </div>
      </div>
    `;

    document.getElementById('confirm-order').addEventListener('click', async () => {
      try {
        const items = cart.map(i => ({ id: i.id, quantity: i.quantity }));
        const { commande } = await api.createCommande(items, selectedLivraison?.id || 1);
        localStorage.removeItem('cart');
        cart.length = 0;
        updateCartCount();
        content.innerHTML = `
          <div class="checkout-success">
            <h2>Commande confirmée !</h2>
            <p>Numéro de commande : <strong>#${commande.id}</strong></p>
            <p>Total : ${commande.total}$</p>
            <a href="dashboard.html" class="btn">Voir mon compte</a>
            <a href="catalogue.html" class="btn">Continuer mes achats</a>
          </div>
        `;
      } catch (err) {
        alert(err.message || 'Erreur lors de la création de la commande');
      }
    });
  } catch (err) {
    content.innerHTML = '<p>Erreur de chargement. Vérifiez que l\'API est démarrée.</p>';
  }

  updateCartCount();
});
