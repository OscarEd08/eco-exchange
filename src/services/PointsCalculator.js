export class PointsCalculator {
  constructor(materials) {
    this.materials = materials;
  }

  calculateMaterialPoints(materialId, weight) {
    const material = this.materials.find(m => m.id === materialId);
    return material ? weight * material.pointsPerUnit : 0;
  }

  calculateTotalPoints(materialWeights) {
    let total = 0;
    for (const [materialId, weight] of Object.entries(materialWeights)) {
      total += this.calculateMaterialPoints(materialId, weight || 0);
    }
    return total;
  }

  getBreakdown(materialWeights) {
    const breakdown = {};
    for (const [materialId, weight] of Object.entries(materialWeights)) {
      breakdown[materialId] = this.calculateMaterialPoints(materialId, weight || 0);
    }
    return breakdown;
  }
}