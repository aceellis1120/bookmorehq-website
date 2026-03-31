export default function Footer() {
  return (
    <footer className="bg-[#0B0F14] border-t border-[#1F2937] py-8">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#94A3B8]">
        <span>&copy; 2026 BookMore HQ. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
        <a
          href="mailto:hello@bookmorehq.com"
          className="hover:text-white transition-colors"
        >
          hello@bookmorehq.com
        </a>
      </div>
    </footer>
  );
}
