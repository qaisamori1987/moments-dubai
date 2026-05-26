export default function SiteFooter({ brand }: { brand: string }) {
  return (
    <footer className="rail border-t border-blush/40 py-8 text-center text-xs text-mocha">
      © {new Date().getFullYear()} {brand} · Dubai, UAE
    </footer>
  );
}
