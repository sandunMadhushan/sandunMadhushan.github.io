import { AuthSessionProvider } from "@/components/admin/session-provider";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
