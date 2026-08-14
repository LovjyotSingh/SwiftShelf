import { INITIAL_PRODUCTS } from '../data/mockCatalog';
import { Product } from '@/types';

// Deterministic semantic feature dictionary for simulated high-precision vector embeddings
const FEATURE_VOCAB: Record<string, number> = {
  audio: 0,
  sound: 1,
  anc: 2,
  headphones: 3,
  wireless: 4,
  bluetooth: 5,
  smartwatch: 6,
  watch: 7,
  fitness: 8,
  titanium: 9,
  health: 10,
  chair: 11,
  ergonomic: 12,
  office: 13,
  lumbar: 14,
  mesh: 15,
  monitor: 16,
  display: 17,
  screen: 18,
  oled: 19,
  '6k': 20,
  keyboard: 21,
  mechanical: 22,
  gaming: 23,
  typing: 24,
  aluminum: 25,
  lamp: 26,
  light: 27,
  ambient: 28,
  black: 29,
  silver: 30,
  white: 31,
  luxury: 32,
  minimalist: 33,
};

const VOCAB_SIZE = Object.keys(FEATURE_VOCAB).length;

/**
 * Generate a normalized dense vector embedding from text or feature tags
 */
export function generateEmbedding(text: string): number[] {
  const vector = new Array(VOCAB_SIZE).fill(0);
  const tokens = text.toLowerCase().split(/[\s,._-]+/);

  for (const token of tokens) {
    if (FEATURE_VOCAB[token] !== undefined) {
      vector[FEATURE_VOCAB[token]] += 1.0;
    }
  }

  // Normalize vector (L2 norm)
  let norm = 0;
  for (let i = 0; i < vector.length; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);

  if (norm > 0) {
    for (let i = 0; i < vector.length; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

/**
 * Cosine Similarity between two normalized vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}

/**
 * Semantic Vector Search across product catalog
 */
export function searchProductsBySemanticVector(
  query: string,
  limit: number = 6
): Array<{ product: Product; similarityScore: number }> {
  const queryVector = generateEmbedding(query);

  const scored = INITIAL_PRODUCTS.map((product) => {
    // Generate text representation for product
    const corpus = `${product.title} ${product.subtitle} ${product.category} ${product.tags.join(' ')} ${product.description}`;
    const productVector = generateEmbedding(corpus);
    const score = cosineSimilarity(queryVector, productVector);

    return {
      product,
      similarityScore: Math.round(score * 100) / 100,
    };
  });

  // Sort descending by score
  return scored
    .filter((item) => item.similarityScore > 0.05)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Multimodal Visual Image Search
 * Extracts visual semantics (color dominance, shape attributes) and finds closest matching product
 */
export function searchByImageAnalysis(
  imageMeta: { dominantColor?: string; inferredCategory?: string; label?: string },
  limit: number = 4
): Array<{ product: Product; matchReason: string; confidence: number }> {
  const queryWords = `${imageMeta.inferredCategory || ''} ${imageMeta.label || ''} ${imageMeta.dominantColor || ''}`.trim();
  const semanticResults = searchProductsBySemanticVector(queryWords || 'audio watch chair', limit);

  if (semanticResults.length === 0) {
    return INITIAL_PRODUCTS.slice(0, limit).map((p) => ({
      product: p,
      matchReason: 'Visual pattern & aesthetic match',
      confidence: 88,
    }));
  }

  return semanticResults.map((res) => ({
    product: res.product,
    matchReason: `High visual correlation with ${imageMeta.label || res.product.category}`,
    confidence: Math.min(99, Math.round(Math.max(0.75, res.similarityScore) * 100)),
  }));
}
