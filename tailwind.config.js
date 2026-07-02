/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lumo: {
          bg: "#FAF9F7",
          surface: "#FFFFFF",
          primary: "#7C6CF2",
          secondary: "#B9A8FF",
          text: "#1F1F1F",
          subtext: "#7A7A7A",
          success: "#5BB98C",
          warning: "#F5B041",
          danger: "#E57373",
          border: "#E8E6E3",
        },
      },
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
