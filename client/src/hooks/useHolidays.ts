import { useState, useEffect, useRef } from 'react';
import { Holiday } from '../types';

const NAGER_BASE = 'https://date.nager.at/api/v3/PublicHolidays';

export const useHolidays = (year: number, countryCode = 'US') => {
  const [holidaysMap, setHolidaysMap] = useState<Record<string, Holiday[]>>({});
  const [loading, setLoading] = useState(false);
  const cache = useRef<Record<string, Record<string, Holiday[]>>>({});

  useEffect(() => {
    const cacheKey = `${year}-${countryCode}`;

    if (cache.current[cacheKey]) {
      setHolidaysMap(cache.current[cacheKey]);
      return;
    }

    const fetchHolidays = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${NAGER_BASE}/${year}/${countryCode}`);
        if (!response.ok) throw new Error();
        const data: Holiday[] = await response.json() as Holiday[];

        const map: Record<string, Holiday[]> = {};
        for (const holiday of data) {
          if (!map[holiday.date]) map[holiday.date] = [];
          map[holiday.date].push(holiday);
        }

        cache.current[cacheKey] = map;
        setHolidaysMap(map);
      } catch {
        // no-op
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [year, countryCode]);

  return { holidaysMap, loading };
};
