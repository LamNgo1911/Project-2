module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "text-primary": "#142e45",
        "text-secondary": "#40916c",
        "text-btn": "#FFFFFF",
        "bg-primary": "#FFFFFF",
        "bg-secondary": "#000000",
        "bg-nav": "#edf2fb",
        "bg-btn": "#cc7a00",
        "bg-btn-hover": "#894c29",
        "bg-tag": "#f6f6f6",
      },
      backgroundImage: {
        background: "url('./cover.png')",
        background2: "url('./cover-2.jpg')",
        background3: "url('./cover-3.jpg')",
        category: "url('./coverCategory.png')",
        notiImage: "url('./src/assets/noti-image.png')",
      },
      animation: {
        slideup: "slideup 1s ease-in-out",
        slidedown: "slidedown 1s ease-in-out",
        slideleft: "slideleft 1s ease-in-out",
        slideright: "slideright 1s ease-in-out",
        zoomin: "zoom-in 1s ease-in-out",
        loading: "loading 1.5s ease-in-out infinite",
        shake: "shake 0.5s", // Removed "animation:" prefix
      },
      keyframes: {
        slideup: {
          "0%": { opacity: 0, transform: "translateY(25%)" },
          "100%": { opacity: 1, transform: "translateY(0%)" },
        },
        slidedown: {
          "0%": { opacity: 0, transform: "translateY(-25%)" },
          "100%": { opacity: 1, transform: "translateY(0%)" },
        },
        slideleft: {
          "0%": { opacity: 0, transform: "translateX(-25%)" },
          "100%": { opacity: 1, transform: "translateX(0%)" },
        },
        slideright: {
          "0%": { opacity: 0, transform: "translateX(25%)" },
          "100%": { opacity: 1, transform: "translateX(0%)" },
        },
        zoomin: {
          "0%": { opacity: 0, transform: "scale(0.5)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        loading: {
          "0%": {
            opacity: 0.3,
          },
          "50%": {
            opacity: 0.7,
          },
          "100%": {
            opacity: 0.3,
          },
        },
        shake: {
          "0%": {
            transform: "translateX(0)",
          },
          "25%": {
            transform: "translateX(-5px)",
          },
          "50%": {
            transform: "translateX(5px)",
          },
          "75%": {
            transform: "translateX(-5px)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
