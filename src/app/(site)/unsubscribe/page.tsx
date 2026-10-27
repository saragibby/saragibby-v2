import { PageIntro } from "@/components/site/shell"
import { TokenAction } from "@/components/site/forms"

export const metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
}
export default async function Unsubscribe({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  return (
    <section className="container section interior">
      <PageIntro label="Your inbox, your choice" title="A little less email.">
        <p>
          Use the button below to unsubscribe from marketing email. Opening this
          page alone does not change your preferences.
        </p>
      </PageIntro>
      <TokenAction
        action="unsubscribe"
        token={typeof token === "string" ? token : ""}
      />
    </section>
  )
}
