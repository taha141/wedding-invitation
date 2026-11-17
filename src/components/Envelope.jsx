import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import "../styles/envelope.css";

const PDF_PATH = "/images/invitation/wedding-card.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function InvitationViewer({ onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pageWidth, setPageWidth] = useState(() =>
    Math.min(430, Math.max(260, window.innerWidth * 0.72)),
  );
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      setPageWidth(Math.min(430, Math.max(260, window.innerWidth * 0.72)));
    };

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const nextPage = () => {
    if (isFlipping || isComplete) return;

    if (currentPage === totalPages) {
      setIsComplete(true);
      return;
    }

    setIsFlipping(true);
  };

  const previousPage = () => {
    if (currentPage > 1 && !isFlipping && !isComplete) {
      setCurrentPage((page) => page - 1);
    }
  };

  const handleFlipComplete = () => {
    if (isFlipping) {
      setCurrentPage((page) => page + 1);
      setIsFlipping(false);
    }
  };

  return (
    <motion.div
      className="invitation-pdf-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="invitation-pdf-viewer card-deck-viewer"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pdf-viewer-header">
          <span>आपका शुभ विवाह निमंत्रण</span>

          <button
            className="pdf-close-button"
            onClick={onClose}
            aria-label="Close invitation"
          >
            ✕
          </button>
        </div>

        <div className="card-deck-stage">
          {pdfError ? (
            <p className="pdf-loading-message">
              निमंत्रण लोड नहीं हो पाया। कृपया दोबारा प्रयास करें।
            </p>
          ) : (
            <Document
              file={PDF_PATH}
              onLoadSuccess={({ numPages }) => {
                setTotalPages(numPages);
                setPdfError(false);
              }}
              onLoadError={() => setPdfError(true)}
              loading={
                <p className="pdf-loading-message">
                  आपका निमंत्रण तैयार हो रहा है...
                </p>
              }
            >
              <div className="card-deck">
                {Array.from(
                  { length: totalPages - currentPage + 1 },
                  (_, index) => currentPage + index,
                )
                  .reverse()
                  .map((pageNumber) => {
                    const distance = pageNumber - currentPage;
                    const isFrontCard = distance === 0;

                    return (
                      <motion.div
                        key={pageNumber}
                        className={`deck-card ${
                          isFrontCard ? "deck-card-front" : ""
                        }`}
                        style={{
                          zIndex: totalPages - pageNumber + 1,
                          width: pageWidth,
                        }}
                        initial={false}
                        animate={{
                          x: distance * 5,
                          y: distance * 5,
                          rotate: distance * 1.2,
                          rotateY: isFrontCard && isFlipping ? -180 : 0,
                        }}
                        transition={{
                          duration: isFrontCard ? 0.85 : 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        onAnimationComplete={
                          isFrontCard ? handleFlipComplete : undefined
                        }
                      >
                        <div className="deck-card-face">
                          <Page
                            pageNumber={pageNumber}
                            width={pageWidth}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={
                              <div className="pdf-page-loading">
                                Loading card...
                              </div>
                            }
                          />
                        </div>

                        {isFrontCard && (
                          <div className="deck-card-back">
                            <span>♥</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
              </div>
            </Document>
          )}
        </div>

        {!isComplete ? (
          <div className="pdf-viewer-controls card-deck-controls">
            <button
              onClick={previousPage}
              disabled={currentPage === 1 || isFlipping}
            >
              ← Previous
            </button>

            <span>
              {String(currentPage).padStart(2, "0")} /{" "}
              {String(totalPages).padStart(2, "0")}
            </span>

            <button onClick={nextPage} disabled={isFlipping}>
              {currentPage === totalPages ? "Finish ♥" : "Next →"}
            </button>
          </div>
        ) : (
          <motion.div
            className="invitation-finish"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span>✦ ♥ ✦</span>

            <h2>अब हमें है आपका इंतज़ार...</h2>

            <p>
              इस शुभ अवसर पर आपकी स्नेहिल उपस्थिति हमारे लिए सबसे बड़ा आशीर्वाद
              होगी।
            </p>

            <p>
              आप सपरिवार पधारकर नवदम्पति को अपना स्नेह एवं आशीर्वाद प्रदान करें।
            </p>

            <h3>आपका हार्दिक स्वागत है!</h3>

            <button onClick={onClose}>Close Invitation</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Envelope() {
  const [isOpen, setIsOpen] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);

  const openEnvelope = () => setIsOpen(true);

  const closeEnvelope = () => {
    setIsOpen(false);
    setShowInvitation(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  };

  return (
    <main className="envelope-page">
      <motion.div
        className="envelope-content"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <p className="envelope-eyebrow">A LITTLE SOMETHING FOR YOU</p>

        <h1>With Love,</h1>

        <div
          className={`envelope ${isOpen ? "is-open" : ""}`}
          onClick={openEnvelope}
          role="button"
          tabIndex={isOpen ? -1 : 0}
          aria-label="Open wedding invitation"
          aria-expanded={isOpen}
          onKeyDown={handleKeyDown}
        >
          <div className="envelope-inner" />
          <div className="envelope-back" />

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="invitation-card"
                initial={{ y: 35, opacity: 0 }}
                animate={{ y: -170, opacity: 1 }}
                exit={{ y: 35, opacity: 0 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInvitation(true);
                }}
              >
                <iframe
                  src={`${PDF_PATH}#page=1&toolbar=0&navpanes=0&view=Fit`}
                  title="Invitation preview"
                  className="invitation-preview-frame"
                  tabIndex="-1"
                />

                <div className="invitation-preview-hint">
                  स्पर्श करके पूरा निमंत्रण देखें
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="envelope-front" />

          <motion.div
            className="envelope-flap"
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              transformOrigin: "top center",
              zIndex: isOpen ? 0 : 3,
              backfaceVisibility: "hidden",
            }}
          />

          <AnimatePresence>
            {!isOpen && (
              <motion.div
                className="envelope-seal"
                exit={{ scale: 0, opacity: 0, rotate: 25 }}
                transition={{ duration: 0.3 }}
              >
                <span>♥</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="envelope-hint">
          {isOpen
            ? "आमंत्रण देखने के लिए कार्ड को स्पर्श करें"
            : "Some moments are worth opening..."}
        </p>

        <AnimatePresence>
          {isOpen && (
            <motion.button
              className="close-envelope"
              onClick={closeEnvelope}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              Close envelope
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showInvitation && (
          <InvitationViewer onClose={() => setShowInvitation(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}

export default Envelope;
