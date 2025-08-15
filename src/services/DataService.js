// Importar los archivos JSON directamente
import productsData from '../data/products.json';
import materialsData from '../data/materials.json';
import examplesData from '../data/examples.json';

export class DataService {
  static async getProducts() {
    return productsData || [];
  }

  static async getMaterials() {
    return materialsData || [];
  }

  static async getExamples() {
    return examplesData || [];
  }
}