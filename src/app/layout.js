"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/interface-adapters/components/sidebar/app-sidebar";
import { SiteHeader } from "@/interface-adapters/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/interface-adapters/components/ui/sidebar";
import { Footer } from "@/interface-adapters/components/footer/footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/interface-adapters/context/AuthContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const pageSlug = pathname.split("/").filter(Boolean)[0] || "home";
  const excludedRoutes = ["/otp", "/login", "/register","/forgotPassword"];
  const isExcludedRoute = excludedRoutes.includes(pathname);
  
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [explosion, setExplosion] = useState(false);
  const [blueScreen, setBlueScreen] = useState(false);
  const [destroyed, setDestroyed] = useState(false);
  const [permanentRainbow, setPermanentRainbow] = useState(false);
  const [sirenAudio, setSirenAudio] = useState(null);
  const [jumpscareAudio, setJumpscareAudio] = useState(null);

  const formattedTitle = pageSlug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Warning and explosion sequence
  useEffect(() => {
    if (!isExcludedRoute) {
      // Show warning after 3 seconds
      const warningTimer = setTimeout(() => {
        setShowWarning(true);
        
        // Start countdown after 2 seconds of warning
        setTimeout(() => {
          let count = 3;
          setCountdown(count);
          
          const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
              setCountdown(count);
            } else {
              clearInterval(countdownInterval);
              setExplosion(true);
              
              // Show blue screen after explosion
              setTimeout(() => {
                setBlueScreen(true);
                setShowWarning(false);
                setCountdown(null);
                setExplosion(false);
                
                // Show destroyed page with permanent rainbow
                setTimeout(() => {
                  setDestroyed(true);
                  setPermanentRainbow(true);
                  setBlueScreen(false);
                  
                  // Keep rainbow forever - no reset
                }, 3000);
              }, 2000);
            }
          }, 1000);
        }, 2000);
      }, 3000);

      return () => {
        clearTimeout(warningTimer);
        if (sirenAudio) {
          sirenAudio.pause();
          sirenAudio.currentTime = 0;
        }
        if (jumpscareAudio) {
          jumpscareAudio.pause();
          jumpscareAudio.currentTime = 0;
        }
      };
    }
  }, [isExcludedRoute, pathname, sirenAudio, jumpscareAudio]);

  // Sound effects
  useEffect(() => {
    if (showWarning && !sirenAudio) {
      // Civil defense siren from Pixabay - continuous until end
      const warningAudio = new Audio('https://cdn.pixabay.com/download/audio/2024/09/16/audio_5464b60e9b.mp3?filename=air-raid-siren-sound-effect-241383.mp3');
      warningAudio.volume = 0.7;
      warningAudio.loop = true;
      warningAudio.play().catch(() => {});
      setSirenAudio(warningAudio);
    }
    
    if (countdown !== null) {
      // Countdown beep sound - looped
      const beepAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/24/audio_516e7b9b04.mp3?filename=countdown-from-10-105775.mp3');
      beepAudio.volume = 0.8;
      beepAudio.loop = true;
      beepAudio.play().catch(() => {});
    }
    
    if (explosion || blueScreen || permanentRainbow) {
      // Jumpscare sound - looped
      if (!jumpscareAudio) {
        const jumpscare = new Audio('https://cdn.pixabay.com/download/audio/2023/09/19/audio_f304554a28.mp3?filename=smile-dog-jumpscare-167171.mp3');
        jumpscare.volume = 0.9;
        jumpscare.loop = true;
        jumpscare.play().catch(() => {});
        setJumpscareAudio(jumpscare);
      }
    }
  }, [showWarning, countdown, explosion, blueScreen, permanentRainbow, sirenAudio, jumpscareAudio]);

  return (
    <html lang="en">
      <head>
        <title>{formattedTitle}</title>
        <style>{`
          @keyframes meme-rotate {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(15deg) scale(1.1); }
            50% { transform: rotate(-10deg) scale(0.9); }
            75% { transform: rotate(5deg) scale(1.05); }
            100% { transform: rotate(0deg) scale(1); }
          }

          @keyframes unexpected-move {
            0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
            10% { transform: translateX(100px) translateY(-50px) rotate(45deg) scale(1.3); }
            20% { transform: translateX(-150px) translateY(100px) rotate(-30deg) scale(0.8); }
            30% { transform: translateX(200px) translateY(150px) rotate(90deg) scale(1.5); }
            40% { transform: translateX(-100px) translateY(-200px) rotate(-60deg) scale(0.7); }
            50% { transform: translateX(0) translateY(250px) rotate(180deg) scale(1.2); }
            60% { transform: translateX(250px) translateY(-100px) rotate(-120deg) scale(0.9); }
            70% { transform: translateX(-200px) translateY(-150px) rotate(270deg) scale(1.4); }
            80% { transform: translateX(150px) translateY(200px) rotate(-45deg) scale(0.85); }
            90% { transform: translateX(-50px) translateY(-50px) rotate(315deg) scale(1.1); }
            100% { transform: translateX(0) translateY(0) rotate(360deg) scale(1); }
          }

          @keyframes bounce-meme {
            0%, 100% { transform: translateY(0) scaleY(1); }
            10% { transform: translateY(-100px) scaleY(0.8); }
            30% { transform: translateY(-50px) scaleY(1.1); }
            50% { transform: translateY(-150px) scaleY(0.7); }
            70% { transform: translateY(-25px) scaleY(1.2); }
            90% { transform: translateY(-75px) scaleY(0.9); }
          }

          @keyframes wiggle-meme {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(3deg); }
            75% { transform: rotate(-3deg); }
          }

          @keyframes rainbow-cycle {
            0% { 
              filter: hue-rotate(0deg) saturate(2) brightness(1.2);
              background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            }
            14% { 
              filter: hue-rotate(51deg) saturate(2.2) brightness(1.3);
              background: linear-gradient(45deg, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000);
            }
            28% { 
              filter: hue-rotate(102deg) saturate(2.4) brightness(1.1);
              background: linear-gradient(45deg, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000, #ff7f00);
            }
            42% { 
              filter: hue-rotate(153deg) saturate(2.6) brightness(1.4);
              background: linear-gradient(45deg, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000, #ff7f00, #ffff00);
            }
            56% { 
              filter: hue-rotate(204deg) saturate(2.8) brightness(1.2);
              background: linear-gradient(45deg, #0000ff, #4b0082, #9400d3, #ff0000, #ff7f00, #ffff00, #00ff00);
            }
            70% { 
              filter: hue-rotate(255deg) saturate(3) brightness(1.5);
              background: linear-gradient(45deg, #4b0082, #9400d3, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff);
            }
            84% { 
              filter: hue-rotate(306deg) saturate(2.5) brightness(1.3);
              background: linear-gradient(45deg, #9400d3, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082);
            }
            100% { 
              filter: hue-rotate(360deg) saturate(2) brightness(1.2);
              background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            }
          }

          @keyframes warning-flash {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(255, 0, 0, 0.4); }
          }

          @keyframes jumpscare-appear {
            0% { 
              opacity: 0;
              transform: scale(0.1) rotate(0deg);
            }
            50% { 
              opacity: 1;
              transform: scale(1.5) rotate(180deg);
            }
            100% { 
              opacity: 1;
              transform: scale(1) rotate(360deg);
            }
          }

          @keyframes meme-jumpscare {
            0% { transform: scale(1) rotate(0deg) translateX(0) translateY(0); }
            25% { transform: scale(1.3) rotate(90deg) translateX(100px) translateY(-100px); }
            50% { transform: scale(0.7) rotate(180deg) translateX(-100px) translateY(100px); }
            75% { transform: scale(1.2) rotate(270deg) translateX(100px) translateY(100px); }
            100% { transform: scale(1) rotate(360deg) translateX(0) translateY(0); }
          }

          @keyframes blue-screen-glitch {
            0%, 100% { background-color: #0078d4; }
            25% { background-color: #005a9e; }
            50% { background-color: #106ebe; }
            75% { background-color: #2b88d8; }
          }

          .rotate-aggressive {
            animation: 
              meme-rotate 3s ease-in-out infinite,
              wiggle-meme 0.5s ease-in-out infinite;
            transform-origin: center center;
          }

          .rainbow-permanent {
            animation: 
              rainbow-cycle 2s linear infinite,
              meme-rotate 3s ease-in-out infinite,
              wiggle-meme 0.5s ease-in-out infinite;
            transform-origin: center center;
          }

          .warning-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            pointer-events: none;
            animation: warning-flash 0.3s ease-in-out infinite;
          }

          .explosion-jumpscare {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100vw;
            height: 100vh;
            z-index: 15000;
            pointer-events: none;
            background-image: url('https://2007.filemail.com/getthumbnail.ashx?fileid=OBWHO3DBNN3XI3TBNBZXG3LWPR6HYV3IMF2HGQLQOAQES3LBM5SSAMRQGI2S2MBXFUYDCIDBOQQDAMROGA3C4NBZL4YWKNRYMIYWEOJONJYGO&size=Large');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            animation: 
              jumpscare-appear 1s ease-out,
              meme-jumpscare 2s ease-in-out infinite,
              bounce-meme 1.5s ease-in-out infinite;
          }

          .blue-screen-jumpscare {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 60vw;
            height: 60vh;
            z-index: 15001;
            pointer-events: none;
            background-image: url('https://2007.filemail.com/getthumbnail.ashx?fileid=OBWHO3DBNN3XI3TBNBZXG3LWPR6HYV3IMF2HGQLQOAQES3LBM5SSAMRQGI2S2MBXFUYDCIDBOQQDAMROGA3C4NBZL4YWKNRYMIYWEOJONJYGO&size=Large');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 20px;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.8);
            animation: 
              jumpscare-appear 0.5s ease-out,
              unexpected-move 5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite,
              bounce-meme 2s ease-in-out infinite;
          }

          .permanent-rainbow-jumpscare {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 40vw;
            height: 40vh;
            z-index: 15002;
            pointer-events: none;
            background-image: url('https://2007.filemail.com/getthumbnail.ashx?fileid=OBWHO3DBNN3XI3TBNBZXG3LWPR6HYV3IMF2HGQLQOAQES3LBM5SSAMRQGI2S2MBXFUYDCIDBOQQDAMROGA3C4NBZL4YWKNRYMIYWEOJONJYGO&size=Large');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 30px;
            box-shadow: 0 0 100px rgba(255, 255, 255, 0.9);
            animation: 
              unexpected-move 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite,
              bounce-meme 1s ease-in-out infinite,
              meme-rotate 4s ease-in-out infinite;
          }

          .blue-screen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            pointer-events: none;
            animation: blue-screen-glitch 0.5s ease-in-out infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
            color: white;
            font-size: 2rem;
            text-align: center;
            padding: 2rem;
          }

          .warning-text {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            color: red;
            font-size: 4rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            animation: warning-flash 0.3s ease-in-out infinite;
            text-align: center;
          }

          .countdown-text {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            color: red;
            font-size: 8rem;
            font-weight: bold;
            text-shadow: 4px 4px 8px rgba(0,0,0,0.8);
            text-align: center;
          }

          body {
            overflow: hidden;
          }
        `}</style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isExcludedRoute ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <AuthProvider>
            <div className={`${permanentRainbow ? 'rainbow-permanent' : 'rotate-aggressive'}`}>
              <SidebarProvider
                style={{
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                  "--header-height": "calc(var(--spacing) * 12)",
                }}
              >
                <AppSidebar variant="inset" />
                <SidebarInset>
                  <SiteHeader />
                  <div className="flex flex-col min-h-screen">
                    <main className="flex-grow p-6">{children}</main>
                    <Footer />
                  </div>
                  <Toaster richColors />
                </SidebarInset>
              </SidebarProvider>
            </div>

            {/* Warning Overlay */}
            {showWarning && !countdown && !explosion && (
              <>
                <div className="warning-overlay" />
                <div className="warning-text">
                  ⚠️ WARNING! SYSTEM OVERLOAD! ⚠️<br />
                  🚨 TUNING TUNING TUNING 🚨<br />
                  💥 CRITICAL ERROR DETECTED 💥
                </div>
              </>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="countdown-text">
                💥 PROJECT WILL EXPLODE IN<br />{countdown} 💥
              </div>
            )}

            {/* Explosion Jumpscare */}
            {explosion && (
              <div className="explosion-jumpscare" />
            )}

            {/* Blue Screen Overlay */}
            {blueScreen && (
              <>
                <div className="blue-screen-overlay">
                  <div>
                    <h1>💀 SYSTEM CRASHED 💀</h1>
                    <p>A problem has been detected and the system has been shut down to prevent damage.</p>
                    <p>CRITICAL_PROCESS_DIED</p>
                    <p>*** STOP: 0x000000EF (0x00000000, 0x00000000, 0x00000000, 0x00000000)</p>
                    <br />
                    <p>The system is attempting to recover...</p>
                    <p>💥 DUAR! PAGE DESTROYED! 💥</p>
                  </div>
                </div>
                {/* Blue Screen Jumpscare Image */}
                <div className="blue-screen-jumpscare" />
              </>
            )}

            {/* Permanent Rainbow with Jumpscare Image */}
            {permanentRainbow && (
              <div className="permanent-rainbow-jumpscare" />
            )}
          </AuthProvider>
        )}
      </body>
    </html>
  );
}