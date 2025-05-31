import { useQuery } from '@tanstack/react-query';
import { fetchKelurahanByKecamatan } from '~/services/api';

export const useKelurahanByKecamatan = (kecamatanName: string) => {
  return useQuery({
    queryKey: ['kelurahan', kecamatanName],
    queryFn: () => fetchKelurahanByKecamatan(kecamatanName),
    enabled: !!kecamatanName,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
