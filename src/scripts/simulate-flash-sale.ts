import { StockReservationEngine } from '../lib/redis/stockReservationEngine';

/**
 * SwiftShelf High-Concurrency Flash Sale Stress Test
 * Simulates 500 concurrent threads attempting to reserve 10 units of limited inventory
 */
async function runFlashSaleConcurrencySimulation() {
  console.log('================================================================');
  console.log('🚀 SWIFTSHELF FLASH-SALE CONCURRENCY RESILIENCE TEST');
  console.log('================================================================');

  const productId = 'prod_flash_drop_2026';
  const variantId = 'var_black_titanium';
  const INITIAL_STOCK = 10;
  const CONCURRENT_REQUESTS = 500;

  // Initialize test inventory
  StockReservationEngine.initializeStock(productId, variantId, INITIAL_STOCK);
  console.log(`[Setup] Initial Inventory Pool: ${INITIAL_STOCK} units.`);
  console.log(`[Sim] Dispatching ${CONCURRENT_REQUESTS} simultaneous reservation threads...\n`);

  const startTime = Date.now();
  const promises: Promise<any>[] = [];

  for (let i = 1; i <= CONCURRENT_REQUESTS; i++) {
    promises.push(
      StockReservationEngine.reserveStock(productId, variantId, 1, `user_thread_${i}`, 600)
    );
  }

  const results = await Promise.all(promises);
  const durationMs = Date.now() - startTime;

  let successfulReservations = 0;
  let rejectedOutOfStock = 0;

  for (const res of results) {
    if (res.success) {
      successfulReservations++;
    } else {
      rejectedOutOfStock++;
    }
  }

  const finalStock = StockReservationEngine.getStockCount(productId, variantId);

  console.log('----------------------------------------------------------------');
  console.log(`⏱️ Completed in: ${durationMs}ms`);
  console.log(`✅ Successful Reservations: ${successfulReservations} (Expected: ${INITIAL_STOCK})`);
  console.log(`❌ Rejected (Out of Stock): ${rejectedOutOfStock} (Expected: ${CONCURRENT_REQUESTS - INITIAL_STOCK})`);
  console.log(`📊 Final Pool State: Total=${finalStock.total}, Reserved=${finalStock.reserved}, Available=${finalStock.available}`);
  console.log('----------------------------------------------------------------');

  if (successfulReservations === INITIAL_STOCK && finalStock.available === 0) {
    console.log('🏆 TEST PASSED: ZERO RACE-CONDITION OVERSELLING GUARANTEE VERIFIED!');
  } else {
    console.error('🚨 TEST FAILED: Race condition detected!');
  }
}

runFlashSaleConcurrencySimulation().catch(console.error);
