export const rupiah = (n) => `Rp ${Number(n).toLocaleString("id-ID")}`;

export const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (diff < 1) return "baru saja";
  if (diff < 60) return `${diff} mnt lalu`;
  const h = Math.floor(diff / 60);
  return `${h} jam ${diff % 60} mnt lalu`;
};