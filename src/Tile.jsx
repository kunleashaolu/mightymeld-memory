export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-16 w-16 bg-indigo-300 text-center flex-1 rounded-md"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="inline-block h-16 w-16 bg-indigo-500 rounded-md">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
              color: "#fff",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block h-16 w-16 flex-1 opacity-5">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return <div onClick={flip} className={className}></div>;
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
