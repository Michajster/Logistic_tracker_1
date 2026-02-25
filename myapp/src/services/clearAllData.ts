import { useMagazynHistoryStore } from '../store/magazynHistoryStore';
import { useDeliveryStore } from '../store/deliveryStore';
import { useCurrentA1Store } from '../store/currentA1Store';
import { useDualQrStore } from '../store/qrDualStore';
import { useQrStore } from '../store/qrStore';

/**
 * Wyczyść wszystkie dane z aplikacji (reset stores)
 */
export function clearAllData() {
  console.log('[CLEAR] Czyszczenie wszystkich danych...');
  
  useMagazynHistoryStore.getState().clear();
  useDeliveryStore.getState().clear();
  useCurrentA1Store.getState().clear();
  useDualQrStore.getState().regenerateMagazyn();
  useQrStore.getState().regenerate();
  
  console.log('[CLEAR] Dane wyczyśczone');
}
