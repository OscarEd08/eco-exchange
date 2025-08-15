export class ProductRecommendations {
  constructor(products) {
    this.products = products.sort((a, b) => a.points - b.points);
  }

  getAvailableProducts(totalPoints) {
    return this.products.filter(product => product.points <= totalPoints);
  }

  getNextProduct(totalPoints) {
    return this.products.find(product => product.points > totalPoints);
  }

  getRecommendationText(totalPoints) {
    const availableProducts = this.getAvailableProducts(totalPoints);
    
    if (totalPoints === 0) {
      return 'Ingresa tus materiales para ver qué productos puedes obtener';
    }

    if (availableProducts.length === 0) {
      const nextProduct = this.getNextProduct(totalPoints);
      const pointsNeeded = nextProduct.points - totalPoints;
      return `
        <p>Aún no tienes suficientes puntos para ningún producto.</p>
        <p>El producto más barato cuesta <strong>${nextProduct.points} puntos</strong> (${nextProduct.name}).</p>
        <p>Te faltan <strong>${pointsNeeded} puntos</strong>.</p>
      `;
    }

    return availableProducts.map(product => 
      `<div class="available-product">
        <span class="product-name">${product.name}</span>
        <span class="product-points">${product.points} puntos</span>
      </div>`
    ).join('');
  }
}