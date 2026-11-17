import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import "../styles/intro.css";

function Intro() {
  return (
    <section className="intro">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p className="intro-eyebrow">A LITTLE WEDDING STORY</p>

        <h1>
          OH WAIT...
          <br />
          SOMEONE'S IN TROUBLE! 👀
        </h1>

        <p className="intro-subtitle">A little love, a little mischief...</p>

        <p className="intro-highlight">AND ONE VERY IMPORTANT INVITATION!</p>
      </motion.div>

      <a href="#couple-scene" className="scroll-indicator">
        <span>SCROLL TO EXPLORE</span>
        <ChevronDown size={22} strokeWidth={1.5} />
      </a>
    </section>
  );
}

export default Intro;
