import { Building2 } from "lucide-react";
import { loginAction } from "@/app/admin/actions";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false }
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#123326] p-4">
      <form action={loginAction} className="card grid w-full max-w-md gap-4 p-6">
        <div className="flex items-center gap-3">
          <Building2 className="text-[#b9892f]" />
          <div>
            <h1 className="text-2xl font-black">Admin Login</h1>
            <p className="text-sm text-[#68736d]">Kalpavruksha Real Estate CRM</p>
          </div>
        </div>
        {params.error === "configuration" ? <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">Admin login is not configured for this deployment. Set AUTH_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD_HASH in the hosting environment, then redeploy.</p> : null}
        {params.error && params.error !== "configuration" ? <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">Invalid credentials or ADMIN_PASSWORD_HASH is not configured.</p> : null}
        <input type="hidden" name="next" value={params.next || "/admin"} />
        <label className="field"><span>Email</span><input className="input" name="email" type="email" required /></label>
        <label className="field"><span>Password</span><input className="input" name="password" type="password" required /></label>
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </main>
  );
}
