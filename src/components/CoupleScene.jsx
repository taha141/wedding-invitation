import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/couple.css";

function CoupleScene() {
  return (
    <section id="couple-scene" className="couple-scene">
      <motion.div
        className="couple-content"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <p className="couple-eyebrow">THE STORY BEHIND THE INVITATION</p>

        <div className="couple-image-wrapper">
          <img
            src="/images/bride-groom.png"
            alt="A playful bride chasing her groom with a wedding invitation"
            className="couple-image"
          />
        </div>

        <h2>Well, he couldn't keep it a secret forever!</h2>

        <p className="couple-description">
          Our big day is here, and we'd love for you to be a part of it.
        </p>

        <Link to="/invitation" className="story-button">
          Discover what's next
          <span>→</span>
        </Link>
      </motion.div>
    </section>
  );
}

export default CoupleScene;
