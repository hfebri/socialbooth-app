export const CAPTION_TEMPLATES = [
  "What an incredible experience at META Masterclass! 🚀",
  "Empowered and inspired at META Masterclass! 💡",
  "Amazing insights and connections at META Masterclass! 🌟",
  "Leveling up my skills at META Masterclass! 📈",
  "Grateful for this transformative META Masterclass experience! 🙏",
  "Innovation and inspiration at META Masterclass! 💫",
  "Mind-blown by the META Masterclass sessions! 🤯",
  "Networking with amazing people at META Masterclass! 🤝",
  "Game-changing learnings at META Masterclass! 🎯",
  "Thrilled to be part of META Masterclass! ⚡",
  "META Masterclass: Where innovation meets inspiration! 🚀",
  "Absolutely loving the META Masterclass vibes! ✨",
  "META Masterclass - an experience to remember! 🌈",
  "So much value packed into META Masterclass! 💎",
  "META Masterclass is redefining excellence! 🏆",
];

export function getRandomCaption(): string {
  const randomIndex = Math.floor(Math.random() * CAPTION_TEMPLATES.length);
  return CAPTION_TEMPLATES[randomIndex];
}
