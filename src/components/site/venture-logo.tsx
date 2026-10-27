import Image from "next/image"

const logos: Record<string, { src: string; width: number; height: number }> = {
  "Rise & Shore": {
    src: "/images/ventures/rise-and-shore.svg",
    width: 826,
    height: 315,
  },
  TaxDedux: {
    src: "/images/ventures/taxdedux.png",
    width: 684,
    height: 168,
  },
}

export function VentureLogo({ name }: { name: string }) {
  const logo = logos[name]
  if (!logo) return null
  return (
    <div className="venture-logo">
      <Image
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt=""
        sizes="(max-width: 760px) 220px, 180px"
      />
    </div>
  )
}
