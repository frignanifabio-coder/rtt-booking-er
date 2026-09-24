export const dynamic = "force-dynamic";

import { sendTestEmail } from "./actions";

export default function TestEmailPage() {
  return (
    <form action={sendTestEmail}>
      <button
        style={{
          padding: 20,
          fontSize: 18,
        }}
      >
        Invia test email
      </button>
    </form>
  );
}