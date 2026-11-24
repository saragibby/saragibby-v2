import "./admin-graphics.css"

// Login page logo. Server component, no client JS.
export function Logo() {
  return (
    <div className="sg-admin-logo">
      <span className="sg-admin-wordmark">Sara Gibby</span>
      <span className="sg-admin-script">the back office</span>
    </div>
  )
}

// Small mark shown in the admin navigation.
export function Icon() {
  return (
    <span className="sg-admin-icon" aria-hidden="true">
      SG
    </span>
  )
}
