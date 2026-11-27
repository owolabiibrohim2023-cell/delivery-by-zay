import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} · DBZ – Delivered by Zay`
      : 'DBZ - Delivered By Zay | International Shipping from Nigeria';
  }, [title]);
}
