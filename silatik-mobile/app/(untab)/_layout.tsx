// app/(untab)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function UntabLayout() {
  return (
    // Stack Navigator untuk group (untab)
    <Stack>
      {/* Screen untuk halaman detail rumah tangga ([id].tsx) */}
      <Stack.Screen
        name="house/[id]" // Nama screen harus sesuai dengan nama file/folder di dalamnya
        options={{
          headerShown: false, // << Matikan header bawaan untuk halaman ini
          // Anda bisa menambahkan opsi lain khusus untuk halaman detail di sini jika perlu
          // title: 'Detail Rumah', // Ini hanya akan terlihat jika headerShown diaktifkan
        }}
      />

      {/* Screen untuk halaman scanner (jika ada file scanner.tsx) */}
      <Stack.Screen
        name="scanner" // Nama screen harus sesuai dengan nama file scanner.tsx
        options={{
          headerShown: false, // << Matikan header bawaan untuk halaman scanner
          // title: 'Scan Report',
        }}
      />

      {/* Tambahkan Stack.Screen untuk rute lain di dalam folder (untab) jika ada */}
      <Stack.Screen
        name="explore" // Ganti dengan nama file rute Anda
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="bankAccount" // Ganti dengan nama file rute Anda
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
