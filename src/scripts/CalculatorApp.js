import { PointsCalculator } from "../services/PointsCalculator.js";
import { ProductRecommendations } from "../services/ProductRecommendations.js";
import { DataService } from "../services/DataService.js";

export class CalculatorApp {
  constructor() {
    this.calculator = null;
    this.recommendations = null;
    this.materials = [];
    this.products = [];
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
  }

  async loadData() {
    try {
      this.materials = await DataService.getMaterials();
      this.products = await DataService.getProducts();
      this.calculator = new PointsCalculator(this.materials);
      this.recommendations = new ProductRecommendations(this.products);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  setupEventListeners() {
    // Calculate button
    document
      .getElementById("calculate-btn")
      ?.addEventListener("click", () => {
        this.calculatePoints();
      });

    // Auto-calculate on input change
    this.materials.forEach((material) => {
      const input = document.getElementById(material.id);
      input?.addEventListener("input", () => {
        this.calculatePoints();
      });
    });

    // Example click handlers
    document.querySelectorAll(".example").forEach((example) => {
      example.addEventListener("click", () => {
        const exampleData = JSON.parse(example.dataset.example);
        this.useExample(exampleData);
      });
    });
  }

  calculatePoints() {
    if (!this.calculator || !this.recommendations) return;

    const materialWeights = {};
    this.materials.forEach((material) => {
      const input = document.getElementById(material.id);
      materialWeights[material.id] = parseFloat(input?.value) || 0;
    });

    const breakdown = this.calculator.getBreakdown(materialWeights);
    const totalPoints = this.calculator.calculateTotalPoints(materialWeights);

    this.updateUI(breakdown, totalPoints);
  }

  updateUI(breakdown, totalPoints) {
    // Update breakdown
    Object.entries(breakdown).forEach(([materialId, points]) => {
      const element = document.getElementById(`${materialId}-points`);
      if (element) {
        element.textContent = `${points} puntos`;
      }
    });

    // Update total
    const totalElement = document.getElementById("total-points");
    if (totalElement) {
      totalElement.textContent = totalPoints;
    }

    // Update recommendations
    const recommendationsElement = document.getElementById("available-products");
    if (recommendationsElement && this.recommendations) {
      const recommendationHTML = this.recommendations.getRecommendationText(totalPoints);

      if (recommendationHTML.includes('<div class="available-product">')) {
        recommendationsElement.innerHTML = `
          <div class="available-products-list">
            ${recommendationHTML}
          </div>
        `;
      } else {
        recommendationsElement.innerHTML = recommendationHTML;
      }
    }
  }

  useExample(exampleData) {
    Object.entries(exampleData).forEach(([materialId, weight]) => {
      const input = document.getElementById(materialId);
      if (input) {
        input.value = weight;
      }
    });
    this.calculatePoints();
  }
}