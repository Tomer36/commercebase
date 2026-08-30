"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import Telephone from "@modules/common/icons/telephone"
import { Locale } from "@lib/data/locales"
import LanguageSelect from "@modules/layout/components/language-select"
import CompanyOverview from "@modules/layout/components/company-overview"
import StoreBrandMark from "@modules/layout/components/store-brand-mark"

type MobileHeaderProps = {
  locales: Locale[] | null
  currentLocale: string | null
  storeName: string
  contactLabel: string
}

const MobileHeader = ({
  locales,
  currentLocale,
  storeName,
  contactLabel,
}: MobileHeaderProps) => {
  const languageToggleState = useToggleState()
  const contactToggleState = useToggleState()

  return (
    <nav className="small:hidden content-container flex items-center justify-between w-full h-full">
      <div className="flex items-center">
        {!!locales?.length && (
          <LanguageSelect
            toggleState={languageToggleState}
            locales={locales}
            currentLocale={currentLocale}
            variant="pill"
            buttonId="mobile-header-language-select-button"
          />
        )}
      </div>

      <StoreBrandMark storeName={storeName} variant="mark" />

      <button
        type="button"
        onClick={contactToggleState.open}
        aria-label={contactLabel}
        title={contactLabel}
        data-testid="nav-contact-button"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-accent-foreground transition-all duration-150 ease-out hover:bg-white/30 active:scale-90"
      >
        <Telephone size={16} />
      </button>

      <CompanyOverview
        isOpen={contactToggleState.state}
        close={contactToggleState.close}
        storeName={storeName}
      />
    </nav>
  )
}

export default MobileHeader
