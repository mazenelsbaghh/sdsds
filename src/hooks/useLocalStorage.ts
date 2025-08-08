import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // الحصول على القيمة من localStorage أو استخدام القيمة الافتراضية
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // دالة لتحديث القيمة
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // السماح بالقيمة أو دالة لتحديث القيمة
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // حفظ القيمة في الحالة
      setStoredValue(valueToStore);
      
      // حفظ القيمة في localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// هوك إضافي لمراقبة تغييرات localStorage من تبويبات أخرى
export function useLocalStorageListener(key: string, callback: (newValue: any) => void) {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue);
          callback(newValue);
        } catch (error) {
          console.error('Error parsing storage event value:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, callback]);
}