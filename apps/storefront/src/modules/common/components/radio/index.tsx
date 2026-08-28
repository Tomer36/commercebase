const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <>
      <button
        type="button"
        role="radio"
        aria-checked="true"
        data-state={checked ? "checked" : "unchecked"}
        className="group relative flex h-5 w-5 items-center justify-center outline-none"
        data-testid={dataTestId || 'radio-button'}
      >
        <div className="border border-gray-300 group-hover:border-gray-400 group-data-[state=checked]:border-accent group-focus:ring-2 group-focus:ring-accent group-focus:ring-offset-1 group-disabled:!border-gray-200 flex h-[14px] w-[14px] items-center justify-center rounded-full transition-colors">
          {checked && (
            <span
              data-state={checked ? "checked" : "unchecked"}
              className="group flex items-center justify-center"
            >
              <div className="bg-accent group-disabled:bg-gray-300 rounded-full h-1.5 w-1.5"></div>
            </span>
          )}
        </div>
      </button>
    </>
  )
}

export default Radio
