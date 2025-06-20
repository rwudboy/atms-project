export function Footer(){
    return(
        <footer className="relative w-full h-24 overflow-hidden mt-8">
            <div className="absolute inset-0 bg-gradient-to-r bg-white" />
            <div
              className="absolute bottom-0 right-0 w-1/3 h-full bg-white z-10"
              style={{
                clipPath: "polygon(0 0, 100% 100%, 100% 100%, 0% 100%)",
              }}
            />
              <div
  className="absolute bottom-0 right-0 w-1/5 h-20 bg-red-600 z-30"
  style={{
    clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
  }}
/>
<div
  className="absolute bottom-0 right-0 w-1/4 h-full bg-red-800 z-20"
  style={{
    clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
  }}
/>

          </footer>
    )
}