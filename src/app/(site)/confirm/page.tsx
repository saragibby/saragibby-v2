import { PageIntro } from "@/components/site/shell"
import { TokenAction } from "@/components/site/forms"

export const metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
}
export default async function Confirm({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  return (
    <section className="container section interior">
      <PageIntro label="One more step" title="Make it official.">
        <p>
          Confirm your email address to finish the request you started. Nothing
          happens until you choose to confirm.
        </p>
      </PageIntro>
      <TokenAction
        action="confirm"
        token={typeof token === "string" ? token : ""}
      />
    </section>
  )
}
